# 自定义 Trait 与配方 Handler

<VersionBadge version="21.0.11" label="MBD2" icon="tag" />

<figure><img src="/assets/multiblocked2/integrations/built-in-capabilities.png" alt="编辑器列表中的 Trait definition 及 Inspector 自动生成的配置控件"><figcaption>正确注册的 TraitDefinitionType 提供列表条目，其可配置 definition 提供 Inspector 控件。</figcaption></figure>

自定义配方 capability 描述内容；Trait 提供机器本地状态和能够消耗/产出该内容的 handler。MBD2 会为机器上附加的每个 `TraitDefinition` 创建一个运行时 Trait。

本页完成上一页的 `heat_units` capability。

## 1. 定义面向编辑器的类型

```java
@Getter
@Setter
public final class HeatBufferTraitDefinition
        extends RecipeCapabilityTraitDefinition {

    @LDLRegister(
        name = "heat_buffer",
        registry = "mbd2:trait_definition_type",
        group = "trait",
        priority = -100
    )
    public static final TraitDefinitionType<HeatBufferTraitDefinition> TYPE =
        new TraitDefinitionType<>("heat_buffer", "trait") {
            @Override
            public HeatBufferTraitDefinition createDefinition() {
                return new HeatBufferTraitDefinition();
            }
        };

    @Configurable(name = "config.examplemod.heat_buffer.capacity")
    @ConfigNumber(range = {1, Integer.MAX_VALUE})
    private int capacity = 10_000;

    @Override
    public ITrait createTrait(MBDMachine machine) {
        return new HeatBufferTrait(machine, this);
    }

    @Override
    public TraitDefinitionType<?> type() {
        return TYPE;
    }

    @Override
    public IGuiTexture getIcon() {
        return new ItemStackTexture(Items.BLAZE_POWDER);
    }
}
```

`RecipeCapabilityTraitDefinition` 已提供以下编辑器字段：

| 字段 | 运行时作用 |
| --- | --- |
| `name` | 脚本和配方 `slotName` 使用的稳定 Trait 标识符 |
| `priority` | 定义之间的排序 |
| `recipeHandlerIO` | handler 接受配方输入、输出或两者 |
| `isDistinct` | 阻止该 capability 的内容跨 handler 合并处理 |
| `slotNames` | 该 handler 为定向配方内容公开的名称 |

只有重复项或组合无效时才重写 `allowMultiple()` 或 `isCompatibleWith(other)`。只有专用机器类型会自动添加的定义才应让 `isMandatory()` 返回 `true`。

## 2. 实现持久化运行时状态

```java
@Getter
public final class HeatBufferTrait extends RecipeCapabilityTrait {
    public static final ManagedFieldHolder MANAGED_FIELD_HOLDER =
        new ManagedFieldHolder(HeatBufferTrait.class);

    @Persisted
    @DescSynced
    private int stored;

    private final HeatRecipeHandler recipeHandler = new HeatRecipeHandler();

    public HeatBufferTrait(MBDMachine machine, HeatBufferTraitDefinition definition) {
        super(machine, definition);
    }

    @Override
    public ManagedFieldHolder getFieldHolder() {
        return MANAGED_FIELD_HOLDER;
    }

    @Override
    public HeatBufferTraitDefinition getDefinition() {
        return (HeatBufferTraitDefinition) super.getDefinition();
    }

    public void setStored(int value) {
        int next = Math.clamp(value, 0, getDefinition().getCapacity());
        if (next == stored) return;
        stored = next;
        notifyListeners();
    }

    @Override
    public List<IRecipeHandlerTrait<?>> getRecipeHandlerTraits() {
        return List.of(recipeHandler);
    }
```

`@Persisted` 将字段写入机器方块实体。`@DescSynced` 将其加入初始/描述同步。请根据字段真实更新频率选择合适的 LDLib2 同步注解；持久化数据与客户端可见数据是两个不同决定。

## 3. 实现模拟与提交

```java
    private final class HeatRecipeHandler extends RecipeHandlerTrait<Integer> {
        private HeatRecipeHandler() {
            super(HeatBufferTrait.this, HeatUnitsCapability.CAP);
        }

        @Override
        public List<Integer> handleRecipeInner(
                IO io,
                MBDRecipe recipe,
                List<Integer> left,
                @Nullable String slotName,
                boolean simulate) {
            if (!compatibleWith(io)) return left;

            int requested = left.stream().mapToInt(Integer::intValue).sum();
            int handled;

            if (io == IO.IN) {
                handled = Math.min(stored, requested);
                if (!simulate) setStored(stored - handled);
            } else {
                int room = getDefinition().getCapacity() - stored;
                handled = Math.min(room, requested);
                if (!simulate) setStored(stored + handled);
            }

            int remaining = requested - handled;
            return remaining == 0 ? null : List.of(remaining);
        }
    }
}
```

返回值是一项协议：

- `null` 表示 handler 已处理全部剩余内容。
- 非空列表会传给后续 handler/proxy。
- `simulate == true` 必须在不改变状态的情况下计算相同结果。
- `simulate == false` 在权威路径运行，可以提交与模拟完全一致的操作。

配方逻辑进入 working 时 MBD2 调用 `preWorking`，离开时调用 `postWorking`。只有预留或外部事务才需要重写它们；普通标量存储不需要。

## 4. 添加到机器

在编辑器中添加 **Heat Buffer**，设置稳定名称（如 `heat`）、配方 IO 和容量。Java 写法：

```java
var heat = new HeatBufferTraitDefinition();
heat.setName("heat");
heat.setCapacity(20_000);
heat.setRecipeHandlerIO(IO.BOTH);
heat.getSlotNames().add("main_heat");

machineSettings.addTraitDefinition(heat);
```

使用 `.slotName("main_heat")` 的配方只会到达公开该名称的 handler。定义的 `name` 由 `machine.getTraitByName("heat")` 使用，它与 `slotNames` 是不同概念。

## 5. 可选 UI 支持

需要编辑器生成组件时，在定义上实现 `IUIProviderTrait`：

```java
@Override
public TraitUILayoutType getTraitUILayoutType() {
    return TraitUILayoutType.BAR;
}

@Override
public void createTraitUITemplate(UIElement container) {
    container.addChild(new ProgressBar()
        .setId(uiId())
        .layout(layout -> layout.height(14)));
}

@Override
public void initTraitUI(ITrait trait, UI ui) {
    if (!(trait instanceof HeatBufferTrait heat)) return;
    ui.selectId(uiId(), ProgressBar.class).forEach(bar ->
        bar.bind(DataBindingBuilder.floatValS2C(() ->
            (float) heat.getStored() / heat.getDefinition().getCapacity()
        ).build()));
}
```

`uiId()` 为 `ui:<trait-name>`。权威值应使用服务端到客户端 binding；不要将客户端组件当作存储。

## 6. 可选 NeoForge 方块 capability

当管道或其他模组需要查询 Trait 时，继承 `SimpleCapabilityTraitDefinition<T, C>` 与 `SimpleCapabilityTrait<T, C>`。其嵌套 `Type` 会在每个 MBD 机器方块实体和代理部件上注册方块 capability：

```java
public static final BlockCapability<IHeatStorage, @Nullable Direction> HEAT =
    BlockCapability.createSided(
        ResourceLocation.fromNamespaceAndPath("examplemod", "heat"),
        IHeatStorage.class);

public static final SimpleCapabilityTraitDefinition.Type<
        IHeatStorage, @Nullable Direction, HeatBufferTraitDefinition> TYPE =
    new SimpleCapabilityTraitDefinition.Type<>("heat_buffer", "trait") {
        @Override protected BlockCapability<IHeatStorage, @Nullable Direction> getCapability() {
            return HEAT;
        }

        @Override protected IHeatStorage merge(List<IHeatStorage> values) {
            return new HeatStorageList(values);
        }

        @Override public HeatBufferTraitDefinition createDefinition() {
            return new HeatBufferTraitDefinition();
        }
    };
```

运行时 Trait 实现 `getCapContent(IO capabilityIO)`，返回强制执行插入/提取方向的 wrapper。当多个 Trait 或被代理的控制器 capability 合并时，`merge` 必须保留 IO 限制和模拟语义。

## 运行时生命周期

`ITrait` 提供 `onMachineLoad`、`onChunkUnloaded`、`onMachineUnLoad`、`onMachineRemoved`、掉落、邻居变化、`serverTick` 和 `clientTick` 钩子。在 load 时注册外部 listener/cache，在 unload/removal 时释放。游戏逻辑修改应留在服务端。
