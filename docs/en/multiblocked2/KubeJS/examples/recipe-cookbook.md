# Recipe Cookbook

<VersionBadge version="Minecraft 1.21.1 / MBD2 21.0.11" label="Current API" icon="tag" />

<figure><img src="/assets/multiblocked2/recipes/recipe-type.png" alt="Recipe Type editor showing item input and output Content rows"><figcaption>The script builder produces the same MBDRecipe content model shown by the editor Recipes view.</figcaption></figure>

## Built-in content types

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

The entity wrapper accepts `minecraft:zombie`, `2x minecraft:zombie`, or a Java-created `EntityIngredient`. Counted strings require the `countx space ID` format.

## Per-tick IO, chance, and tier boost

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

Callback modifiers restore their previous state automatically. Single-argument `.perTick(true)` and `.chance(0.25)` continue affecting later content until reset.

## Custom data and XEI visibility

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

`addData*` only writes `MBDRecipe.data`; an event, Trait, or Java integration must interpret it.
