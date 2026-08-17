# 注册机器与配方类型

<VersionBadge version="21.0.11" label="MBD2" icon="tag" />

<figure><img src="/assets/multiblocked2/editor/basic-settings.png" alt="可导出并通过 Java 注册的编辑器机器定义"><figcaption>推荐的 Java 路径注册导出定义，并保留此 Inspector 中制作的全部设置。</figcaption></figure>

对大多数模组，最安全的流程是：在 `/mbd2_editor` 中创作项目，导出后将产品文件打包到 `assets/<modid>/...`，再通过 `MBDRegistryEvent` 注册。只有定义必须由代码生成时才使用程序化 builder。

## 注册编辑器产品

```java
public static void registerRecipeTypes(MBDRegistryEvent.MBDRecipeType event) {
    event.registerFromResource(
        ExampleMod.class,
        "examplemod/mbd/recipe_types/heat_press.rt"
    );
}

public static void registerMachines(MBDRegistryEvent.Machine event) {
    event.registerFromResource(
        ExampleMod.class,
        "single_machine", // registry key，不是 KubeJS 的 "single" 别名
        "examplemod/mbd/machines/heat_press.sm"
    );
    event.registerFromResource(
        ExampleMod.class,
        "multiblock",
        "examplemod/mbd/machines/blast_furnace.mb"
    );
}
```

`registerFromResource` 从 `/assets/<projectFile>` 读取 NBT。类型或资源缺失时会记录错误并跳过定义。编辑器产品加载会把依赖 registry 的字段延迟到 MBD2 post task 中处理。

## 用 Java 创建配方类型

```java
public static final ResourceLocation HEAT_PRESS_RECIPES =
    ResourceLocation.fromNamespaceAndPath(ExampleMod.MOD_ID, "heat_press");

public static void registerRecipeTypes(MBDRegistryEvent.MBDRecipeType event) {
    MBDRecipeType type = new MBDRecipeType(HEAT_PRESS_RECIPES);

    MBDRecipe recipe = type.recipeBuilder(
            ResourceLocation.fromNamespaceAndPath(ExampleMod.MOD_ID, "press_iron"))
        .inputItems(Items.IRON_INGOT, 2)
        .input(HeatUnitsCapability.CAP, 400)
        .outputItems(Items.IRON_BLOCK)
        .duration(200)
        .addCondition(new MoonPhaseCondition(0))
        .saveAsBuiltinRecipe();

    event.register(type);
}
```

`saveAsBuiltinRecipe()` 将构建结果放入该类型的内置配方表。`buildRawRecipe()` 只返回对象，不会注册或保存。数据生成时，请配置 `onSave` 并调用 `MBDRecipeBuilder#save(RecipeOutput)`。

## 用 Java 创建简单定义

```java
public static void registerMachines(MBDRegistryEvent.Machine event) {
    var energy = new ForgeEnergyCapabilityTraitDefinition();
    energy.setName("power");
    energy.setCapacity(100_000);
    energy.setMaxReceive(2_000);
    energy.setMaxExtract(2_000);
    energy.setRecipeHandlerIO(IO.IN);

    var definition = MBDMachineDefinition.builder()
        .id(ResourceLocation.fromNamespaceAndPath(ExampleMod.MOD_ID, "heat_press"))
        .rootState(MachineState.baseBuilder()
            .modelRenderer(ResourceLocation.fromNamespaceAndPath(
                ExampleMod.MOD_ID, "block/heat_press"))
            .shape(Shapes.block())
            .lightLevel(0)
            .child("working")
            .build())
        .blockProperties(ConfigBlockProperties.builder().build())
        .itemProperties(ConfigItemProperties.builder().build())
        .machineSettings(() -> ConfigMachineSettings.builder()
            .machineLevel(1)
            .hasUI(true)
            .traitDefinitions(new ArrayList<>(List.of(energy)))
            .build())
        .recipeLogicSettings(ConfigRecipeLogicSettings.builder()
            .enable(true)
            .recipeType(HEAT_PRESS_RECIPES)
            .build())
        .partSettings(() -> ConfigPartSettings.builder().build())
        .build();

    event.register(definition);
}
```

该定义随后会注册自己的方块、物品、方块实体、渲染器和 capability。不要再把这些生成对象放入自己的 `DeferredRegister`。

## 何时创建定义类型

只有需要不同的定义/运行时类或编辑器项目提供器时，才创建 `MachineDefinitionType<T>`。普通的自定义外观、Trait 集合、UI 或配方类型不需要新定义类型。内置类型为 `single_machine`（`.sm`）和 `multiblock`（`.mb`）。
