# Recipe Capability Reference

<VersionBadge version="21.1.1" label="MBD2" icon="tag" />

<figure><img src="/assets/multiblocked2/integrations/built-in-capabilities.png" alt="Built-in item, fluid, Forge Energy, and entity Trait handlers in the editor"><figcaption>The core capability rows below map directly to these built-in machine handlers.</figcaption></figure>

The registry name is the stable key used by codecs and `MBDRegistries.RECIPE_CAPABILITIES.get(name)`. The trait type is what a machine must contain for normal handling.

## Core capabilities

| Registry name | Java content type | Trait type | KubeJS builder | Important behavior |
| --- | --- | --- | --- | --- |
| `item` | `SizedIngredient` | `item_slot` | `inputItems`, `outputItems` | Matches item/tag candidates and amount; output must be insertable |
| `item_durability` | `SizedIngredient` | `item_slot` | `inputItemsDurability`, `outputItemsDurability` | Amount represents durability handled by the durability handler |
| `fluid` | `SizedFluidIngredient` | `fluid_tank` | `inputFluids`, `outputFluids` | Matches fluid/tag and amount; tank filters and IO still apply |
| `forge_energy` | `Integer` | `forge_energy_storage` | `inputFE`, `outputFE` | FE input extracts from storage; output receives into storage |
| `entity` | `EntityIngredient` | `entity_handler` | `inputEntities`, `outputEntities` | Supports entity types/tags, count, and optional NBT |

An item-slot trait returns both item and durability handlers. A filter, side capability IO, recipe handler IO, and automatic IO are independent settings: allowing a pipe to insert does not automatically make the trait a recipe input.

## Optional capabilities

| Registry name | Dependency | Trait | KubeJS methods | Content meaning |
| --- | --- | --- | --- | --- |
| `mek_chemical` | Mekanism | `chemical_tank` | `inputChemicals`, `outputChemicals` | `ChemicalStackIngredient` parsed from chemical strings |
| `mek_heat` | Mekanism | `mek_heat_container` | `inputHeat`, `outputHeat` | Heat amount as `double` |
| `create_rotation` | Create | Create rotation trait | `input/outputRPM`, `input/outputStress` | Tagged union: RPM requirement/generation or stress requirement/generation |
| `pneumatic_pressure_air` | PneumaticCraft | `pneumatic_pressure_air_handler` | pressure and air methods | `PressureAir` records whether the number is pressure or air volume |
| `pneumatic_heat` | PneumaticCraft | `pneumatic_heat_exchanger` | `inputPNCHeat`, `outputPNCHeat` | Heat amount as `double` |
| `natures_aura` | Nature's Aura | `aura_handler` | `inputAura`, `outputAura` | Aura amount as integer |
| `ars_source` | Ars Nouveau | `ars_source_storage` **or** `ars_nearby_source` | `inputSource`, `outputSource` | Source amount as integer; the two traits are mutually exclusive |

Optional registrations use `@LDLRegister(modID = "...")`, so the capability is absent when the dependency is not loaded — and the matching KubeJS builder method **throws**. Guard the call in a pack where the mod can be absent.

## Recipe-viewer widget IDs

`uiName` binds a content entry to a named widget in the recipe display UI. When it is empty, MBD2 matches the default generated ID:

```text
@<capability>_<io>_<index>      e.g. @item_import_0, @fluid_export_1
```

`<io>` is the IO's display name — `import` for `IO.IN`, `export` for `IO.OUT`.

Set `uiName` only to override that mapping — for example to send a bonus output to a widget of your own. An explicit `uiName` is matched as a substring, not as an exact ID; see [Slot Names and the Recipe Viewer UI](slots-and-xei-ui.md) for that, for the reserved `@progress_bar` / `@duration` / `@condition` / `@custom_data` elements, and for how a Trait declares the slot names `slotName` is matched against.

## Routing fields

```java
builder.slotName("hot_side")
    .input(HeatUnitsCapability.CAP, 500)
    .slotName(null)
    .uiName("@heat_input")
    .output(HeatUnitsCapability.CAP, 50);
```

Fluent fields remain active until changed. The KubeJS callback forms restore the previous value automatically and are safer for scoped modifiers. (`heat_units` is the [example Java capability](../java/custom-recipe-capability.md); the lookup throws without it.)

```js
ServerEvents.recipes(event => {
  const heat = MBDRegistries.RECIPE_CAPABILITIES.get('heat_units')
  if (heat === null) throw new Error('heat_units capability is not registered')

  event.recipes.example.heat_press()
    .id('example:scoped_heat_press')
    .slotName('hot_side', r => r.inputs(heat, 500))
    .perTick(r => r.inputFE(20))
    .chance(0.25, r => r.outputItems('minecraft:diamond'))
})
```

## Diagnosing “recipe never starts”

1. Confirm the capability exists in `MBDRegistries.RECIPE_CAPABILITIES`.
2. Confirm the machine has a trait returning a handler for that exact capability instance.
3. Confirm trait recipe handler IO supports the recipe direction.
4. If `slotName` is set, confirm the handler advertises it.
5. Simulate the requested amount against current storage and filters.
6. Check conditions separately; a handler shortage and condition failure are different errors.
