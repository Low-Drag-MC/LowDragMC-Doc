# Integrations (moved)

<VersionBadge version="21.0.11" label="MBD2" icon="tag" />

The integration documentation is now a full section. Continue to the [integration overview](./integrations/).

This compatibility page preserves the old `/integrations.html` URL.

<figure>
<img src="/assets/multiblocked2/integrations/integration-map.png" alt="MBD2 Add Trait menu listing built-in, AE2, Mekanism, Nature's Aura, and PneumaticCraft entries">
<figcaption>The live editor registry with the documented integration mods loaded.</figcaption>
</figure>

<!-- The former summary remains below for old inbound links. -->

## Legacy summary

| Mod | Trait/runtime | Recipe capability | Condition/event/UI | 21.0.11 status |
| --- | --- | --- | --- | --- |
| KubeJS | Machine access from events | Generated schema for every MBD recipe type | Registry, machine, recipe-type, client hooks | Supported |
| JEI / REI / EMI | — | Displays registered content | Recipe and multiblock categories | Supported |
| Mekanism | Chemical tank, heat container | `mek_chemical`, `mek_heat` | `mekanism_heat` condition | Supported |
| Create | Rotation/kinetic trait | `create_rotation` | Rotation condition and renderer support | Supported, but kinetic definition project is not public |
| PneumaticCraft | Pressure/air handler, heat exchanger | `pneumatic_pressure_air`, `pneumatic_heat` | Pressure and temperature conditions | Supported |
| Nature's Aura | Aura handler | `natures_aura` | Trait UI/rendering | Supported |
| AE2 | ME Interface, Pattern Provider | Uses MBD item/fluid capabilities | Network/pattern-provider behavior | Supported |
| GeckoLib | Animated machine renderer | — | Custom keyframe KubeJS bridge | Supported |
| Jade | Machine lookup | — | Information provider | Supported |
| Botania / GTCEu / Embers / Photon | Partial source only | Key registrations disabled | Some paths commented or inactive | Not publicly exposed |

## Mekanism

Add `chemical_tank` for chemical recipe IO and `mek_heat_container` for heat. Chemical KubeJS content is parsed through `inputChemicals(...)`/`outputChemicals(...)`; current 1.21.1 code uses the unified Mekanism chemical stack model rather than the old gas/slurry/pigment/infusion method families.

`mekanism_heat` checks temperature; it does not consume heat. Use `mek_heat` recipe content when heat must be transferred. Configure recipe handler IO and the trait's external capability IO separately.

## Create

`create_rotation` content distinguishes RPM and stress. Use `inputRPM`/`outputRPM` or `inputStress`/`outputStress`; do not replace one with the other. The condition accepts both RPM and stress ranges.

The Create rotation trait and capability are registered, but the `kinetic` KubeJS machine builder and automatic Create kinetic editor project registration are disabled in the current common bootstrap. Document/use editor-visible features from the actual installed build rather than assuming the dormant definition type is available.

## PneumaticCraft

Pressure and air share the `pneumatic_pressure_air` capability with a flag describing the mode. `inputPNCPressure` uses pressure; `inputPNCAir` uses air amount. Heat uses the separate `pneumatic_heat` capability and heat-exchanger trait.

Conditions check state only: `pncPressureCondition(isAir, min, max)` and `pncTemperatureCondition(min, max)`. A recipe that also transfers these resources needs both the condition and corresponding content.

## Nature's Aura

The `aura_handler` trait handles integer `natures_aura` content. Aura availability depends on the integration's world-facing handler, so test extraction/production at the real machine position rather than only in an isolated recipe builder.

## Applied Energistics 2

`ae2_me_interface` and `ae2_me_pattern_provider` are trait types, not new recipe content types. They bridge AE2 network/pattern behavior to MBD2's existing item and fluid capabilities. Configure a valid MBD recipe type and item/fluid handlers; the AE2 trait does not make arbitrary custom capabilities pattern-compatible.

## Recipe viewers

MBD2 supplies categories for registered recipe types and multiblock information. Entity and Mekanism chemical widgets add viewer-specific ingredients when supported. When multiple viewers are installed, MBD2 has precedence/guard logic to avoid duplicate registration; test the exact viewer combination shipped by the pack.

`isXEIVisible` controls whether a recipe type has a category. Recipe `isXEIHidden` controls individual display. `uiName` binds content to an authored viewer widget; default IDs follow `@<capability>_<io>_<index>`.

## GeckoLib and Jade

GeckoLib enables animated renderer resources and a custom-keyframe event bridge on the client. Keep animation events visual unless a separate server action authorizes gameplay changes. Jade exposes machine information and does not change recipe or capability behavior.

## Inactive source paths

Botania mana, GTCEu energy, Embers ember, and Photon FX classes remain in the repository, but their recipe capability annotations/registrations or runtime calls are disabled in `21.0.11`. Do not publish pack scripts using historical `inputMana`, `inputEU`, `inputEmber`, or Photon machine FX until a released build restores and tests those entry points.

::: tip Integration acceptance test
Launch once with every intended optional mod, verify the trait appears in the editor, inspect the capability/condition registry, run an input and output recipe, test automation/proxy sides, and open the result in the chosen recipe viewer.
:::
