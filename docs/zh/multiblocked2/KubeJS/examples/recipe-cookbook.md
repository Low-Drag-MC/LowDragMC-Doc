# 配方 Cookbook

<VersionBadge version="Minecraft 1.21.1 / MBD2 21.0.11" label="当前 API" icon="tag" />

<figure><img src="/assets/multiblocked2/recipes/recipe-type.png" alt="配方类型编辑器展示物品输入和输出 Content 行"><figcaption>脚本 builder 生成与编辑器 Recipes 视图相同的 MBDRecipe 内容模型。</figcaption></figure>

## 内置内容类型

```js
// kubejs/server_scripts/mbd2_recipe_cookbook.js
ServerEvents.recipes(event => {
  event.recipes.example.processor()
    .id('example:processor/all_builtin_content')
    .duration(200)
    .inputItems('2x minecraft:iron_ingot', '#c:gems/quartz')
    .outputItems('minecraft:iron_block')
    .inputItemsDurability('minecraft:diamond_pickaxe')
    .outputItemsDurability('minecraft:diamond_pickaxe')
    .inputFluids('250x minecraft:water')
    .outputFluids('100x minecraft:lava')
    .inputEntities('2x minecraft:zombie')
    .outputEntities('minecraft:villager')
    .inputFE(4000)
    .outputFE(250)
})
```

实体 wrapper 接受 `minecraft:zombie` 或 `2x minecraft:zombie`，也接受 Java 构造的 `EntityIngredient`。字符串中的数量必须使用 `数量x 空格 ID` 格式。

## 每 tick、概率和等级加成

```js
ServerEvents.recipes(event => {
  event.recipes.example.processor()
    .id('example:processor/wet_grinding')
    .duration(120)
    .inputItems('#c:ores/copper')
    .perTick(r => {
      r.inputFE(32)
      r.inputFluids('5x minecraft:water')
    })
    .outputItems('2x minecraft:raw_copper')
    .chance(0.25, r => r.outputItems('minecraft:flint'))
    .tierChanceBoost(0.05, r => r.outputItems('minecraft:gold_nugget'))
})
```

callback 结束后 modifier 自动恢复；单参数 `.perTick(true)`、`.chance(0.25)` 会继续影响后续内容，直到显式恢复。

## 自定义数据与隐藏

```js
ServerEvents.recipes(event => {
  event.recipes.example.processor()
    .id('example:processor/secret')
    .duration(20)
    .isXEIHidden(true)
    .addDataString('mode', 'precision')
    .addDataNumber('xp', 2.5)
    .addDataBoolean('consume_tool', false)
    .inputItems('minecraft:diamond')
    .outputItems('minecraft:emerald')
})
```

`addData*` 只写入 `MBDRecipe.data`；必须由事件、Trait 或 Java 集成读取才会产生效果。
