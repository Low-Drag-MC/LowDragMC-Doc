# KubeJS 配方

<VersionBadge version="Minecraft 1.21.1 / MBD2 21.1.1" label="当前 API" icon="tag" />

MBD2 为每个已注册的 `MBDRecipeType` 生成一个 KubeJS 配方 schema。配方写在 `kubejs/server_scripts`，`/reload` 会重建它们。

## 最小配方

builder 路径就是配方类型的 namespace 和 path。对 `example:crusher`：

```js
ServerEvents.recipes(event => {
  event.recipes.example.crusher()
    .id('example:crush_apple')
    .duration(100)
    .inputItems('minecraft:apple')
    .outputItems('2x minecraft:gold_nugget')
})
```

强烈建议显式写 `.id(...)`：它给日志、移除脚本、配方查看器和后续迁移一个稳定的身份。

## 带注释的完整示例

```js
ServerEvents.recipes(event => {
  event.recipes.example.crusher()
    .id('example:wet_crushing')
    .duration(200)                    // 机器 tick；默认 100
    .priority(10)                     // 数值越小越先尝试
    .isXEIHidden(false)

    .inputItems('#c:ores/iron')
    .inputFluids('250x minecraft:water')
    .perTick(r => r.inputFE(40))      // 每个工作 tick 40 FE

    .outputItems('2x minecraft:raw_iron')
    .chance(0.15, r =>                // 修饰器只作用于回调内部
      r.outputItems('minecraft:flint'))
    .tierChanceBoost(0.05, r =>
      r.outputItems('minecraft:iron_nugget'))

    .slotName('water_in', r =>        // 只路由这部分内容
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

| Capability | 输入 | 输出 | 接受的值 |
| --- | --- | --- | --- |
| 物品 | `inputItems(...)` | `outputItems(...)` | `SizedIngredient`：`'minecraft:apple'`、`'2x minecraft:iron_ingot'`、`'#c:ores/iron'` |
| 物品耐久 | `inputItemsDurability(...)` | `outputItemsDurability(...)` | 数量被当作耐久度 |
| 流体 | `inputFluids(...)` | `outputFluids(...)` | `SizedFluidIngredient`：`'250x minecraft:water'` |
| 实体 | `inputEntities(...)` | `outputEntities(...)` | `'minecraft:zombie'`、`'2x minecraft:zombie'` 或 `EntityIngredient` |
| Forge Energy | `inputFE(int)` | `outputFE(int)` | |
| Nature's Aura | `inputAura(int)` | `outputAura(int)` | 需要 `naturesaura` |
| Ars Nouveau Source | `inputSource(int)` | `outputSource(int)` | 需要 `ars_nouveau` |
| Mekanism 化学品 | `inputChemicals(...)` | `outputChemicals(...)` | `'100x mekanism:hydrogen'`；需要 `mekanism` |
| Mekanism 热量 | `inputHeat(double)` | `outputHeat(double)` | 需要 `mekanism` |
| Create 应力 | `inputStress(float)` | `outputStress(float)` | 需要 `create` |
| Create 转速 | `inputRPM(float)` | `outputRPM(float)` | 需要 `create` |
| PNC 压力 | `inputPNCPressure(float)` | `outputPNCPressure(float)` | 需要 `pneumaticcraft` |
| PNC 空气 | `inputPNCAir(int)` | `outputPNCAir(int)` | 需要 `pneumaticcraft` |
| PNC 热量 | `inputPNCHeat(double)` | `outputPNCHeat(double)` | 需要 `pneumaticcraft` |

对应模组没加载时调用相应方法会**抛异常**，所以模组可选的整合包必须加判断。`inputMana`、`inputEU` 和 `inputEmber` 在源码里已被注释掉，不存在。

物品和实体的带数量字符串用 `<数量>x <id>` 形式；流体总是需要显式数量。

## 修饰器状态机

`perTick`、`chance`、`tierChanceBoost`、`slotName` 和 `uiName` 会修饰它们生效期间创建的每一条 `Content`。

回调形式会在回调结束后恢复原值：

```js
ServerEvents.recipes(event => {
  event.recipes.example.crusher()
    .id('example:modifier_scope')
    .chance(0.2, r => r.outputItems('minecraft:diamond'))
    .outputItems('minecraft:cobblestone') // 必定产出，不是 20%
})
```

单参数形式会一直改变 builder 状态，直到再次改变：

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

优先用回调形式——它不会泄漏到后面的内容上。

- `chance` 是该条内容的基础概率。
- `tierChanceBoost` 是每级机器 tier 增加的概率。
- `slotName` 限制只由声明了该 slot 名的 Trait 处理。它**不是** Trait 的名字。
- `uiName` 把内容绑到配方查看器 UI 里的命名控件上，不影响存储选择。
- `perTick` 让内容在每个工作 tick 发生，而不是在配方的开始/结束。

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
    .machineData({ mode: 'precision' }, true)
    .dayTime(true)
    .light(0, 15, 0, 7, false)
    .redstoneSignal(1, 15)
    .inputItems('minecraft:stone')
    .outputItems('minecraft:gravel')
})
```

可选整合另外提供 `rotationCondition(minRPM, maxRPM, minStress, maxStress)`、`mekTemperatureCondition(min, max)`、`pncTemperatureCondition(min, max)`、`pncPressureCondition(isAir, min, max)` 和 `arsSourceNearbyCondition(radius, min, max)`。分组与反转语义见[条件参考](../recipes/condition-reference.md)。

## 自定义 capability

Java 注册的 capability 没有专门的 builder 方法，但通用入口对任何 capability 都有效。`MBDRegistries` 是全局绑定。

下面的 `heat_units` 是[自定义 RecipeCapability](../java/custom-recipe-capability.md) 里的示例 capability——没有装那个 Java 扩展时查找会返回 `null`，这段脚本会按设计抛出异常：

```js
ServerEvents.recipes(event => {
  const heat = MBDRegistries.RECIPE_CAPABILITIES.get('heat_units')
  if (heat === null) throw new Error('heat_units capability is not registered')

  event.recipes.example.heat_press()
    .id('example:anneal_plate')
    .inputs(heat, 400)
    .outputs(heat, 50)
    .removeOutputs(heat)   // removes every output Content for this capability
    .inputItems('minecraft:iron_ingot')
    .outputItems('minecraft:iron_block')
})
```

`inputs(capability, ...values)` 和 `outputs(...)` 会调用该 capability 的 `of(Object)`，后者委托给它的 `IContentSerializer`。所以哪些 JavaScript 值合法由 Java 的序列化器决定。`removeInputs` / `removeOutputs` 只作用于正在构建的这条配方，不影响别的配方。

当某个 Java 整合把 `RecipeCondition` 实例暴露给脚本时，可以用 `addCondition(condition)`。自定义条件不会自动获得便捷方法，除非该整合自己加。

## 自定义 NBT 数据

`addData(key, Tag)`、`addDataString`、`addDataNumber`（按 double 存）和 `addDataBoolean` 写入配方的 `data` 复合标签。它**本身不产生任何效果**——必须有 Trait、机器事件、蓝图或 Java 整合去读它。请把每个键和默认值都记录下来。

::: warning
`addData` 接受真正的 `Tag`，不是 JSON 字符串。文本请用 `addDataString`。
:::

## 移除

```js
ServerEvents.recipes(event => {
  event.remove({ id: 'example:obsolete_recipe' })
})
```

## builder 路径不存在时

1. 配方类型是在 **startup** 阶段注册的，不是在 server 脚本里。
2. startup 脚本没有报错，并且已经完整重启。
3. namespace 和 path 与配方类型 ID 完全一致。
4. 可选 capability 方法只在对应模组安装时调用。
5. 自定义序列化器接受你传入的值。
6. 机器定义确实引用了这个配方类型，并且有匹配的 IO Trait。
