# KubeJS 配方

<VersionBadge version="Minecraft 1.21.1 / MBD2 21.0.11" label="当前 API" icon="tag" />

<figure><img src="/assets/multiblocked2/recipes/recipe-type.png" alt="MBD2 Recipes 视图包含与 KubeJS schema builder 创建结果等价的配方"><figcaption>KubeJS 配方与编辑器内置配方在已注册类型下生成相同的 MBDRecipe 内容模型。</figcaption></figure>

MBD2 会为每个已注册 `MBDRecipeType` 创建一个 KubeJS 配方 schema。配方应放在 `kubejs/server_scripts`，可通过 `/reload` 重建。

## 最小配方

若配方类型 ID 为 `example:crusher`，builder 路径就是命名空间加 path：

```js
ServerEvents.recipes(event => {
  event.recipes.example.crusher()
    .id('example:crush_apple')
    .duration(100)
    .inputItems('minecraft:apple')
    .outputItems('2x minecraft:gold_nugget')
})
```

强烈建议显式填写 `.id(...)`，让日志、删除脚本、JEI/REI/EMI 与迁移都拥有稳定标识。

## 完整注释示例

```js
ServerEvents.recipes(event => {
  event.recipes.example.crusher()
    .id('example:wet_crushing')
    .duration(200)                    // 机器 tick
    .priority(10)                     // 数值越小越先参与匹配
    .isXEIHidden(false)

    .inputItems('#c:ores/iron')
    .inputFluids('250x minecraft:water')
    .perTick(r => r.inputFE(40))      // 每个工作 tick 消耗 40 FE

    .outputItems('2x minecraft:raw_iron')
    .chance(0.15, r =>                // modifier 仅在 callback 内生效
      r.outputItems('minecraft:flint'))
    .tierChanceBoost(0.05, r =>
      r.outputItems('minecraft:iron_nugget'))

    .slotName('water_in', r =>        // 只路由 callback 内的内容
      r.inputFluids('100x minecraft:water'))
    .uiName('bonus_output', r =>
      r.outputItems('minecraft:gravel'))

    .dimension('minecraft:overworld')
    .positionY(-64, 64)
    .redstoneSignal(1, 15)
    .addDataString('mode', 'wet')
    .addDataBoolean('award_xp', true)
})
```

## 内容方法

| Capability | 输入 | 输出 | 接受值 |
| --- | --- | --- | --- |
| 物品 | `inputItems(...)` | `outputItems(...)` | KubeJS `SizedIngredient` 字符串/对象 |
| 物品耐久 | `inputItemsDurability(...)` | `outputItemsDurability(...)` | 按耐久解释的 Sized item ingredient |
| 流体 | `inputFluids(...)` | `outputFluids(...)` | `SizedFluidIngredient`，如 `250x minecraft:water` |
| 实体 | `inputEntities(...)` | `outputEntities(...)` | `minecraft:zombie`、`2x minecraft:zombie` 或 `EntityIngredient` |
| Forge Energy | `inputFE(int)` | `outputFE(int)` | 整数 FE 数量 |
| Nature's Aura | `inputAura(int)` | `outputAura(int)` | Aura 数量；需要安装模组 |
| Mekanism 化学品 | `inputChemicals(...)` | `outputChemicals(...)` | Chemical stack 字符串；需要安装模组 |
| Mekanism 热量 | `inputHeat(double)` | `outputHeat(double)` | 热量；需要安装模组 |
| Create 应力 | `inputStress(float)` | `outputStress(float)` | 应力值；需要安装模组 |
| Create 转速 | `inputRPM(float)` | `outputRPM(float)` | RPM；需要安装模组 |
| PNC 压力 | `inputPNCPressure(float)` | `outputPNCPressure(float)` | 压力；需要安装模组 |
| PNC 空气 | `inputPNCAir(int)` | `outputPNCAir(int)` | 空气量；需要安装模组 |
| PNC 热量 | `inputPNCHeat(double)` | `outputPNCHeat(double)` | 热量；需要安装模组 |

21.0.11 中不能调用 `inputMana`、`inputEU` 与 `inputEmber`；对应旧源码路径已被注释。

## Modifier 状态机

`perTick`、`chance`、`tierChanceBoost`、`slotName` 与 `uiName` 会修饰其生效期间创建的每个 `Content`。

callback 形式临时应用 modifier，结束后恢复之前的值：

```js
ServerEvents.recipes(event => {
  event.recipes.example.crusher()
    .id('example:modifier_scope')
    .chance(0.2, r => r.outputItems('minecraft:diamond'))
    .outputItems('minecraft:cobblestone') // 必定输出，不是 20%
})
```

单参数形式会修改 builder 状态，影响之后所有内容，直到再次修改：

```js
ServerEvents.recipes(event => {
  event.recipes.example.crusher()
    .id('example:stateful_modifier')
    .perTick(true)
    .inputFE(20)
    .inputFluids('5x minecraft:water')
    .perTick(false)
    .outputItems('minecraft:clay')
})
```

局部 modifier 优先使用 callback，防止意外泄漏到后续内容。

- `chance` 是该内容的基础概率。
- `tierChanceBoost` 参与机器配方逻辑使用的 capability 等级概率加成。
- `slotName` 只把内容路由给 Trait 定义中公开对应槽位名的 handler。
- `uiName` 选择配方 UI 组件绑定，不选择存储。
- `perTick` 表示每个正常推进的工作 tick 都处理，而非只在配方开始/结束处理一次。

## 条件

```js
ServerEvents.recipes(event => {
  event.recipes.example.crusher()
    .id('example:conditional_crushing')
    .dimension('minecraft:overworld')
    .biome('minecraft:plains')
    .machineLevel(2)
    .positionY(0, 96)
    .raining(1, 15)
    .thundering(1, 15)
    .blocksInStructure(2, 8, 'minecraft:copper_block')
    .machineData({mode: 'precision'}, true)
    .dayTime(true)
    .light(0, 15, 0, 7, false)
    .redstoneSignal(1, 15)
})
```

可选集成会添加 `rotationCondition(minRPM, maxRPM, minStress, maxStress)`、`mekTemperatureCondition(min, max)`、`pncTemperatureCondition(min, max)` 与 `pncPressureCondition(isAir, min, max)`。分组与 reverse 语义见[条件参考](../recipes/condition-reference.md)。

## 自定义 capability 与 condition

Java 扩展自动使用通用 builder 路径：

```js
ServerEvents.recipes(event => {
  const MBDRegistries = Java.loadClass('com.lowdragmc.mbd2.api.registry.MBDRegistries')
  const heat = MBDRegistries.RECIPE_CAPABILITIES.get('heat_units')
  if (heat === null) throw new Error('heat_units capability is not registered')

  event.recipes.example.heat_press()
    .id('example:anneal_plate')
    .inputs(heat, 400)
    .outputs(heat, 50)
    .removeOutputs(heat) // 移除当前 builder 中该 capability 的全部输出 Content
})
```

`inputs(capability, ...values)` 与 `outputs(...)` 会调用 capability 的 `of(Object)`，后者委托给 `IContentSerializer`。因此 Java serializer 决定 JavaScript 可以传入哪些值。`removeInputs`/`removeOutputs` 只操作当前 builder，不会删除其他配方。

当 Java 集成向脚本提供自定义 `RecipeCondition` 实例时，可调用 `.addCondition(javaCondition)`。自定义条件不会自动获得具名 KubeJS 便捷方法；若需要，集成作者必须另外暴露。

## 自定义 NBT 数据

`addData(key, Tag)`、`addDataString`、`addDataNumber` 和 `addDataBoolean` 写入配方的自定义 `CompoundTag`。这些数据本身没有效果，必须由 Java Trait、机器事件或集成读取并解释。整合包应记录每个 key 与默认值，避免行为悄悄变化。

## 删除与诊断

已加载配方可使用 KubeJS 标准按 ID 删除：

```js
ServerEvents.recipes(event => {
  event.remove({ id: 'example:obsolete_recipe' })
})
```

找不到 builder 路径时，依次检查：

1. 配方类型是否在 startup 阶段注册。
2. startup 脚本是否无错误，并且是否重启过游戏。
3. namespace/path 拼写是否与配方类型 ID 一致。
4. 可选 capability 方法是否只在对应模组安装时使用。
5. 自定义 serializer 是否接受从 JavaScript 传入的值。
6. 机器定义是否确实引用该配方类型，并拥有匹配 IO 的 Trait。
