# Mekanism

<VersionBadge version="21.1.1" label="MBD2" icon="tag" />

Mekanism adds unified chemical storage/recipe content and heat storage/transfer. MBD2 1.21.1 does not use the old separate gas, infusion, pigment, and slurry capability families.

<figure>
<img src="/assets/multiblocked2/integrations/mekanism.png" alt="MBD2 Machine Traits editor showing Mekanism Chemical Tank capacity and filter settings">
<figcaption>The `chemical_tank` editor fields; `mek_heat_container` is visible directly below it in the Trait list.</figcaption>
</figure>

## What is added

| Layer | Registry name | Purpose |
| --- | --- | --- |
| Recipe capability | `mek_chemical` | Transfer a unified `ChemicalStackIngredient` |
| Recipe capability | `mek_heat` | Transfer heat as a `double` |
| Trait | `chemical_tank` | Persist chemicals and expose Mekanism's chemical block capability |
| Trait | `mek_heat_container` | Persist heat/temperature and expose Mekanism's heat capability |
| Condition | `mekanism_heat` | Check a min/max temperature without transferring heat |
| UI element | `chemical-slot` | Bind a chemical tank to authored machine UI |

All entries are conditional on mod ID `mekanism`.

## Chemical machine setup

Add `chemical_tank` in the Trait editor. Configure tank count, per-tank `long` capacity, duplicate-chemical policy, chemical/tag whitelist or blacklist, recipe/GUI/capability IO, auto IO, and optional tank rendering. Name multiple tanks and use recipe `slotName` when one is dedicated to input or output.

The Trait exposes `mekanism.common.capabilities.Capabilities.CHEMICAL.block()`. Container interaction in UI uses `chemical-slot`; external pipes still obey capability-side and IO settings.

In KubeJS, each string is parsed by MBD2's chemical ingredient parser:

```js
ServerEvents.recipes(event => {
  event.recipes.example.chemical_reactor()
    .id('example:chemical_reaction')
    .duration(80)
    .inputChemicals('100x mekanism:hydrogen', '50x mekanism:oxygen')
    .outputChemicals('100x mekanism:water_vapor')
})
```

Use current Mekanism chemical IDs and validate script parsing in the shipped build. Historical `inputGas`, `inputSlurry`, `inputPigment`, and `inputInfusion` examples are obsolete.

## Heat and temperature

Add `mek_heat_container` and configure capacity, inverse insulation/conduction values, recipe/capability IO, and auto IO. `inputHeat` removes heat; `outputHeat` inserts heat. Put the content inside `perTick(...)` for continuous transfer.

```js
ServerEvents.recipes(event => {
  event.recipes.example.heated_reactor()
    .id('example:hot_reaction')
    .duration(200)
    .perTick(r => r.inputHeat(2.5))
    .mekTemperatureCondition(600, 1200)
    .inputItems('minecraft:raw_iron')
    .outputItems('minecraft:iron_ingot')
})
```

Temperatures are compared with the heat handler's value (Kelvin in Mekanism semantics). `mekTemperatureCondition` only gates the recipe; it does not reserve or consume heat. Add `inputHeat` separately when processing must cost heat.

## Failure checklist

- Capability missing in editor: Mekanism was absent during registry discovery or versions are incompatible.
- Recipe never matches: machine lacks the corresponding Trait, handler recipe IO is wrong, or `slotName` targets another tank.
- Pipes cannot connect: check capability IO and side mapping; recipe IO alone does not expose the block capability.
- Temperature passes but no heat is consumed: expected for a condition-only recipe.
- Viewer shows a blank chemical: verify the chemical ID and the installed viewer integration.
