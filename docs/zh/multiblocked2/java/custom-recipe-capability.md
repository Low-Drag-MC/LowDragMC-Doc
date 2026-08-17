# 自定义 RecipeCapability

<VersionBadge version="21.0.11" label="MBD2" icon="tag" />

<figure><img src="/assets/multiblocked2/integrations/mekanism.png" alt="由已注册自定义配方 capability 与 Trait 创建的 Mekanism Chemical Tank 编辑控件"><figcaption>Mekanism 是源码内完整范例：强类型配方内容与可由编辑器配置的存储 Trait 配对。</figcaption></figure>

`RecipeCapability<T>` 定义一种配方内容。它负责转换、复制、编辑器控件、预览渲染和配方查看器渲染。它不在机器中存储任何内容；存储由 Trait 和 handler 提供。

下面添加整数“热量单位”（`HU`）。因为内容是整数标量，可以复用 MBD2 的 `SerializerInteger`。

## 1. 实现并注册 capability

```java
public final class HeatUnitsCapability extends RecipeCapability<Integer> {
    @LDLRegister(name = "heat_units", registry = "mbd2:recipe_capability")
    public static final HeatUnitsCapability CAP = new HeatUnitsCapability();

    private HeatUnitsCapability() {
        super("heat_units", SerializerInteger.INSTANCE);
    }

    @Override
    public Integer createDefaultContent() {
        return 100;
    }

    @Override
    public UIElement createPreview(Supplier<Integer> content) {
        return new Label().bindDataSource(SupplierDataSource.of(() ->
            Component.literal(content.get() + " HU")));
    }

    @Override
    public UIElement createXEITemplate() {
        return new Label().setText("0 HU");
    }

    @Override
    public void bindXEIWidget(UIElement element, Content content, IO io) {
        if (element instanceof Label label) {
            String suffix = content.perTick ? " HU/t" : " HU";
            label.setText(Component.literal(of(content.content) + suffix));
        }
    }

    @Override
    public void createContentConfigurator(
            ConfiguratorGroup parent,
            Supplier<Integer> getter,
            Consumer<Integer> setter) {
        parent.addConfigurators(new NumberConfigurator(
            "recipe.capability.examplemod.heat_units",
            getter,
            value -> setter.accept(value.intValue()),
            100,
            true
        ).setRange(1, Integer.MAX_VALUE));
    }

    @Override
    public Component getLeftErrorInfo(List<Integer> left) {
        int missing = left.stream().mapToInt(Integer::intValue).sum();
        return Component.literal(missing + " HU");
    }
}
```

注解必须位于已加载的 `public static` 字段上。MBD2 扫描它，以 `heat_units` 注册该值，然后冻结 `MBDRegistries.RECIPE_CAPABILITIES`。

## 2. 理解 serializer 契约

自定义 `T` 时实现 `IContentSerializer<T>`：

| 方法 | 职责 |
| --- | --- |
| `of(Object)` | 将 Java/KubeJS/编辑器输入转换为规范 `T`；拒绝不支持的类型或定义明确回退 |
| `copyInner(T)` | 配方搜索期间使用的廉价复制 |
| `deepCopyInner(T)` | 用于修改的独立副本；默认实现通过 codec 复制 |
| `copyWithModifier(T, ContentModifier)` | 应用并行、概率和等级数量修饰 |
| `codec()` | 配方持久化编码 |
| `streamCodec()` | registry-friendly buffer 的网络编码 |

可变内容不能在 `copyInner` 中直接返回自身，除非所有搜索和 handler 代码都将它视为不可变对象。标量 serializer 可以返回同一个装箱值。

## 3. 在 Java 与 KubeJS 中使用

```java
recipeType.recipeBuilder(id)
    .input(HeatUnitsCapability.CAP, 400)
    .output(HeatUnitsCapability.CAP, 50)
    .duration(100)
    .saveAsBuiltinRecipe();
```

```js
ServerEvents.recipes(event => {
  const heat = MBDRegistries.RECIPE_CAPABILITIES.get('heat_units')
  event.recipes.example.heat_press()
    .inputs(heat, 400)
    .outputs(heat, 50)
})
```

KubeJS 调用最终进入 `RecipeCapability#of`，再委托给 serializer 的 `of(Object)`。转换错误应明确失败；静默返回零会生成看似有效但不工作的配方。

## 4. 完成 engine

只有运行时 handler 从 `getRecipeCapability()` 返回该 capability 后，它才真正可用。继续阅读[自定义 Trait](./custom-trait.md)，实现存储和模拟/提交处理。
