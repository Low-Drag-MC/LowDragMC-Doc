# KubeJS Recipes

<VersionBadge version="Minecraft 1.21.1 / MBD2 21.1.1" label="Current API" icon="tag" />

MBD2 creates one KubeJS recipe schema for every registered `MBDRecipeType`. Recipes belong in `kubejs/server_scripts` and are rebuilt by `/reload`.

## Minimal recipe

The builder path is the recipe type's namespace and path. For `example:crusher`:

```js
ServerEvents.recipes(event => {
  event.recipes.example.crusher()
    .id('example:crush_apple')
    .duration(100)
    .inputItems('minecraft:apple')
    .outputItems('2x minecraft:gold_nugget')
})
```

An explicit `.id(...)` is strongly recommended: it gives logs, removal scripts, recipe viewers and migrations one stable identity.

## Complete annotated example

```js
ServerEvents.recipes(event => {
  event.recipes.example.crusher()
    .id('example:wet_crushing')
    .duration(200)                    // machine ticks; defaults to 100
    .priority(10)                     // lower numbers are tried first
    .isXEIHidden(false)

    .inputItems('#c:ores/iron')
    .inputFluids('250x minecraft:water')
    .perTick(r => r.inputFE(40))      // 40 FE every working tick

    .outputItems('2x minecraft:raw_iron')
    .chance(0.15, r =>                // modifier scoped to the callback
      r.outputItems('minecraft:flint'))
    .tierChanceBoost(0.05, r =>
      r.outputItems('minecraft:iron_nugget'))

    .slotName('water_in', r =>        // route only these contents
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

## Content methods

| Capability | Input | Output | Accepted value |
| --- | --- | --- | --- |
| Item | `inputItems(...)` | `outputItems(...)` | `SizedIngredient`: `'minecraft:apple'`, `'2x minecraft:iron_ingot'`, `'#c:ores/iron'` |
| Item durability | `inputItemsDurability(...)` | `outputItemsDurability(...)` | Sized item ingredients, read as durability |
| Fluid | `inputFluids(...)` | `outputFluids(...)` | `SizedFluidIngredient`: `'250x minecraft:water'` |
| Entity | `inputEntities(...)` | `outputEntities(...)` | `'minecraft:zombie'`, `'2x minecraft:zombie'`, or an `EntityIngredient` |
| Forge Energy | `inputFE(int)` | `outputFE(int)` | |
| Nature's Aura | `inputAura(int)` | `outputAura(int)` | Requires `naturesaura` |
| Ars Nouveau Source | `inputSource(int)` | `outputSource(int)` | Requires `ars_nouveau` |
| Mekanism chemical | `inputChemicals(...)` | `outputChemicals(...)` | `'100x mekanism:hydrogen'`; requires `mekanism` |
| Mekanism heat | `inputHeat(double)` | `outputHeat(double)` | Requires `mekanism` |
| Create stress | `inputStress(float)` | `outputStress(float)` | Requires `create` |
| Create RPM | `inputRPM(float)` | `outputRPM(float)` | Requires `create` |
| PNC pressure | `inputPNCPressure(float)` | `outputPNCPressure(float)` | Requires `pneumaticcraft` |
| PNC air | `inputPNCAir(int)` | `outputPNCAir(int)` | Requires `pneumaticcraft` |
| PNC heat | `inputPNCHeat(double)` | `outputPNCHeat(double)` | Requires `pneumaticcraft` |

A method for a mod that is not loaded **throws**, so guard it in a pack where the mod is optional. `inputMana`, `inputEU` and `inputEmber` are commented out in the source and do not exist.

Counted item and entity strings use the `<count>x <id>` form; fluids always take an explicit amount.

## Modifier state machine

`perTick`, `chance`, `tierChanceBoost`, `slotName` and `uiName` decorate every `Content` created while they are active.

The callback form applies the modifier and restores the previous value afterwards:

```js
ServerEvents.recipes(event => {
  event.recipes.example.crusher()
    .id('example:modifier_scope')
    .chance(0.2, r => r.outputItems('minecraft:diamond'))
    .outputItems('minecraft:cobblestone') // guaranteed, not 20%
})
```

The one-argument form changes builder state until it is changed again:

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

Prefer callbacks — they cannot leak into later content.

- `chance` is the base probability for that content.
- `tierChanceBoost` is the extra probability per machine tier.
- `slotName` restricts handling to Traits advertising that slot name. It is **not** the Trait's name.
- `uiName` binds the content to a named widget in the recipe-viewer UI. It does not select storage.
- `perTick` makes the content happen on every working tick instead of at the recipe boundary.

## Conditions

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

Optional integrations add `rotationCondition(minRPM, maxRPM, minStress, maxStress)`, `mekTemperatureCondition(min, max)`, `pncTemperatureCondition(min, max)`, `pncPressureCondition(isAir, min, max)` and `arsSourceNearbyCondition(radius, min, max)`. See the [condition reference](../recipes/condition-reference.md) for grouping and reverse semantics.

## Custom capabilities

A Java-registered capability has no named builder method, but the generic path works with any of them. `MBDRegistries` is a global binding.

`heat_units` below is the example capability from [Custom Recipe Capability](../java/custom-recipe-capability.md) — without that Java extension installed the lookup returns `null` and this script throws on purpose:

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

`inputs(capability, ...values)` and `outputs(...)` call the capability's `of(Object)`, which delegates to its `IContentSerializer`. The Java serializer therefore decides which JavaScript values are valid. `removeInputs` / `removeOutputs` operate on the recipe being built, not on other recipes.

`addCondition(condition)` accepts a `RecipeCondition` instance when a Java integration exposes one to scripts. A custom condition gets no convenience method unless its integration adds one.

## Custom NBT data

`addData(key, Tag)`, `addDataString`, `addDataNumber` (stored as a double) and `addDataBoolean` write the recipe's `data` compound. This has **no effect on its own** — a Trait, a machine event, a blueprint or a Java integration has to read it. Document every key and its default.

::: warning
`addData` takes a real `Tag`, not a JSON string. Use `addDataString` for text.
:::

## Removal

```js
ServerEvents.recipes(event => {
  event.remove({ id: 'example:obsolete_recipe' })
})
```

## If the builder path is missing

1. The recipe type was registered during **startup**, not in a server script.
2. The startup script logged no error and the game was fully restarted.
3. Namespace and path match the recipe-type ID exactly.
4. Optional capability methods are only called with their mod installed.
5. A custom serializer accepts the value being passed.
6. The machine definition actually references this recipe type and has matching IO Traits.
