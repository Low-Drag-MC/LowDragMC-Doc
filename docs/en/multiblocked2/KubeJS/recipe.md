# KubeJS Recipes

<VersionBadge version="Minecraft 1.21.1 / MBD2 21.0.11" label="Current API" icon="tag" />

<figure><img src="/assets/multiblocked2/recipes/recipe-type.png" alt="MBD2 Recipes view containing a recipe equivalent to one created by the KubeJS schema builder"><figcaption>KubeJS recipes and editor built-in recipes produce the same MBDRecipe content model under a registered type.</figcaption></figure>

MBD2 creates one KubeJS recipe schema for every registered `MBDRecipeType`. Recipes belong in `kubejs/server_scripts` and are rebuilt by `/reload`.

## Minimal recipe

If the recipe type ID is `example:crusher`, its builder path is namespace plus path:

```js
ServerEvents.recipes(event => {
  event.recipes.example.crusher()
    .id('example:crush_apple')
    .duration(100)
    .inputItems('minecraft:apple')
    .outputItems('2x minecraft:gold_nugget')
})
```

An explicit `.id(...)` is strongly recommended. It gives logs, removal scripts, JEI/REI/EMI, and migrations one stable identity.

## Complete annotated example

```js
ServerEvents.recipes(event => {
  event.recipes.example.crusher()
    .id('example:wet_crushing')
    .duration(200)                    // machine ticks
    .priority(10)                     // lower numbers are considered first
    .isXEIHidden(false)

    .inputItems('#c:ores/iron')
    .inputFluids('250x minecraft:water')
    .perTick(r => r.inputFE(40))      // 40 FE each working tick

    .outputItems('2x minecraft:raw_iron')
    .chance(0.15, r =>                // modifier is scoped to callback
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
| Item | `inputItems(...)` | `outputItems(...)` | KubeJS `SizedIngredient` strings/objects |
| Item durability | `inputItemsDurability(...)` | `outputItemsDurability(...)` | Sized item ingredients interpreted as durability |
| Fluid | `inputFluids(...)` | `outputFluids(...)` | `SizedFluidIngredient`, for example `250x minecraft:water` |
| Entity | `inputEntities(...)` | `outputEntities(...)` | `minecraft:zombie`, `2x minecraft:zombie`, or `EntityIngredient` |
| Forge Energy | `inputFE(int)` | `outputFE(int)` | Integer FE amount |
| Nature's Aura | `inputAura(int)` | `outputAura(int)` | Aura amount; mod must be installed |
| Mekanism chemical | `inputChemicals(...)` | `outputChemicals(...)` | Chemical stack strings; mod must be installed |
| Mekanism heat | `inputHeat(double)` | `outputHeat(double)` | Heat amount; mod must be installed |
| Create stress | `inputStress(float)` | `outputStress(float)` | Stress value; mod must be installed |
| Create RPM | `inputRPM(float)` | `outputRPM(float)` | RPM value; mod must be installed |
| PNC pressure | `inputPNCPressure(float)` | `outputPNCPressure(float)` | Pressure; mod must be installed |
| PNC air | `inputPNCAir(int)` | `outputPNCAir(int)` | Air; mod must be installed |
| PNC heat | `inputPNCHeat(double)` | `outputPNCHeat(double)` | Heat; mod must be installed |

`inputMana`, `inputEU`, and `inputEmber` are not callable in 21.0.11. Their older source paths are commented out.

## Modifier state machine

`perTick`, `chance`, `tierChanceBoost`, `slotName`, and `uiName` decorate each `Content` created while the modifier is active.

The callback form temporarily applies the modifier and restores the previous value afterward:

```js
ServerEvents.recipes(event => {
  event.recipes.example.crusher()
    .id('example:modifier_scope')
    .chance(0.2, r => r.outputItems('minecraft:diamond'))
    .outputItems('minecraft:cobblestone') // guaranteed, not 20%
})
```

The one-argument form changes builder state for all following contents until changed again:

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

Prefer callbacks for local modifiers; they prevent accidental leakage to later content.

- `chance` is the base probability for that content.
- `tierChanceBoost` contributes the capability-tier bonus used by the machine's recipe logic.
- `slotName` routes content only to handlers whose Trait definition exposes that slot name.
- `uiName` identifies the recipe UI widget binding; it does not select storage.
- `perTick` causes the content to be handled for each progressing work tick, not once at recipe start/end.

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
    .machineData({mode: 'precision'}, true)
    .dayTime(true)
    .light(0, 15, 0, 7, false)
    .redstoneSignal(1, 15)
})
```

Optional integrations add `rotationCondition(minRPM, maxRPM, minStress, maxStress)`, `mekTemperatureCondition(min, max)`, `pncTemperatureCondition(min, max)`, and `pncPressureCondition(isAir, min, max)`. See the [condition reference](../recipes/condition-reference.md) for grouping and reverse semantics.

## Custom capabilities and conditions

Java extensions automatically use the generic builder path:

```js
ServerEvents.recipes(event => {
  const MBDRegistries = Java.loadClass('com.lowdragmc.mbd2.api.registry.MBDRegistries')
  const heat = MBDRegistries.RECIPE_CAPABILITIES.get('heat_units')
  if (heat === null) throw new Error('heat_units capability is not registered')

  event.recipes.example.heat_press()
    .id('example:anneal_plate')
    .inputs(heat, 400)
    .outputs(heat, 50)
    .removeOutputs(heat) // removes every output Content for this capability
})
```

`inputs(capability, ...values)` and `outputs(...)` call that capability's `of(Object)`, which delegates to its `IContentSerializer`. Therefore the Java serializer defines which JavaScript values are valid. `removeInputs`/`removeOutputs` operate on the current builder, not on other recipes.

Use `.addCondition(javaCondition)` when a Java integration makes a custom `RecipeCondition` instance available to scripts. A custom condition does not receive an automatic named KubeJS convenience method; the integration must add one if desired.

## Custom NBT data

`addData(key, Tag)`, `addDataString`, `addDataNumber`, and `addDataBoolean` write the recipe's custom `CompoundTag`. This data has no effect by itself. A Java Trait, machine event, or integration must read and interpret it. Document every key and default in the pack to avoid silent behavior changes.

## Removal and diagnosis

Use normal KubeJS recipe removal by ID for an already-loaded recipe:

```js
ServerEvents.recipes(event => {
  event.remove({ id: 'example:obsolete_recipe' })
})
```

If the builder path is missing, check in order:

1. The recipe type was registered during startup.
2. The startup script has no error and the game was restarted.
3. Namespace/path spelling matches the recipe type ID.
4. Optional capability methods are used only with their mod installed.
5. A custom serializer accepts the value passed from JavaScript.
6. The machine definition actually references this recipe type and has matching IO Traits.
