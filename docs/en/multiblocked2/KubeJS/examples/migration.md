# KubeJS 1.20.1 Migration Reference

<VersionBadge version="Minecraft 1.20.1 / MBD2 1.0.x" label="Source version" icon="tag" />
<VersionBadge version="Minecraft 1.21.1 / MBD2 21.1.1" label="Target version" icon="tag" />

| Legacy example | 1.21.1 form | Status |
| --- | --- | --- |
| `onEvent('recipes', e => ...)` | `ServerEvents.recipes(e => ...)` | KubeJS event migration |
| `.inputItem(...)` | `.inputItems(...)` | Current schema method |
| `.inputFluid(...)` | `.inputFluids(...)` | Uses `SizedFluidIngredient` |
| `.setPerTick(true)` | `.perTick(true)` or callback | Renamed |
| `.setChance(0.2)` | `.chance(0.2)` or callback | Renamed |
| `.isFuel(true)` | Configure Fuel Recipe Types in the Recipe Type editor | No current builder method |
| `.inputGas/.inputSlurry/.inputPigment/.inputInfuse` | `.inputChemicals(...)` | Unified Mekanism chemical |
| `.inputGases/.inputInfusions/.inputSlurries/.inputPigments` | `.inputChemicals(...)` | Plural forms from the old official Wiki are also removed |
| `.inputMana/.inputEU/.inputEmber` | No current KJS builder | Disabled in 21.1.1 |
| `.inputFluids('water 1000')` | `.inputFluids('1000x minecraft:water')` | Current sized-ingredient format |
| `.addData('key', '{...}')` | `addDataString` or pass a real `Tag` | `addData` does not parse a JSON string |
| `ui.getFirstWidgetById(...)` | `ui.selectId(...).findFirst().orElse(null)` | New UIElement tree |
| `widget.setOnPressCallback(...)` | `addEventListener` / `addServerEventListener` | New UI event system |

```js
// 1.20.1 legacy — recognition only
onEvent('recipes', event => {
  event.recipes.mbd2.crusher()
    .inputItem('minecraft:iron_ingot')
    .setPerTick(true)
    .inputFE(20)
    .isFuel(true)
})
```

```js
// 1.21.1 current
ServerEvents.recipes(event => {
  event.recipes.example.crusher()
    .id('example:crusher/iron')
    .inputItems('minecraft:iron_ingot')
    .perTick(r => r.inputFE(20))
})
```

Do not mechanically replace the namespace: the builder path comes from the actual Recipe Type ID. Fuel is configured as a set of fuel recipe types, not an `.isFuel(true)` flag on one recipe.

The old Wiki described `slotName` as a Trait name; that was incorrect. It must match a recipe slot name exposed by the Trait definition. `uiName` matches a Recipe Viewer UI content element name.
