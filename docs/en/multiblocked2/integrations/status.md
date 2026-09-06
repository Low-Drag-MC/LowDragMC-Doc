# Integration Status

<VersionBadge version="21.1.1" label="MBD2" icon="tag" />

<figure>
<img src="/assets/multiblocked2/integrations/integration-map.png" alt="MBD2 Add Trait registry showing optional integration entries exposed by the installed test mods">
<figcaption>The live **Add Trait** registry. Optional entries appear only when their mod is loaded, so this menu is the fastest check that an integration is really active.</figcaption>
</figure>

## Resource integrations

These add recipe capabilities and the Traits that handle them.

| Mod | Capability | Trait | Condition |
| --- | --- | --- | --- |
| Mekanism | `mek_chemical`, `mek_heat` | `chemical_tank`, `mek_heat_container` | `mekanism_heat` |
| Create | `create_rotation` | `!create_rotation` | `create_rotation` |
| PneumaticCraft | `pneumatic_pressure_air`, `pneumatic_heat` | `pneumatic_pressure_air_handler`, `pneumatic_heat_exchanger` | `pneumatic_pressure`, `pneumatic_temperature` |
| Nature's Aura | `natures_aura` | `aura_handler` | — |
| Ars Nouveau | `ars_source` | `ars_source_storage`, `ars_nearby_source` | `ars_source_nearby` |
| Applied Energistics 2 | — (uses `item` / `fluid`) | `ae2_me_interface`, `ae2_me_pattern_provider` | — |

## Non-resource integrations

| Mod | What MBD2 gets |
| --- | --- |
| KubeJS | Registry events, one recipe schema per recipe type, machine and recipe-type events, [script renderers](../KubeJS/client-renderers.md) |
| JEI / REI / EMI | Recipe and multiblock categories. `isXEIVisible` on the recipe type, `isXEIHidden` per recipe |
| Jade | Machine information provider; changes no behaviour |
| GeckoLib | Animated machine renderer and the client keyframe event |
| Photon | [Machine effects](../editor/machine-fx.md) — per-state lists and a named library |
| KilaGraph | [Machine blueprints](../blueprints/) — the node graph, its editor and 235 MBD2 nodes |

## Not exposed

| Mod | State |
| --- | --- |
| Botania, GTCEu, Embers | Classes remain in the repository, but their `@LDLRegister` annotations and KubeJS builder methods are commented out. `inputMana`, `inputEU` and `inputEmber` are not callable |

::: warning Source is not support
An integration class can remain in the repository while its registration is disabled. Only what appears in the editor's **Add Trait** menu on your installed build is real.
:::

## Create: what is and is not there

The rotation capability, condition, Trait, UI element and the `create_machine` machine-definition type are all registered, and the editor's project menu offers a Create Kinetic Machine — its `.cm` product registers from Java under the type key `create_machine`.

What is *not* available is the KubeJS `kinetic` machine builder key: `MBDRegistryEvents.machine` accepts `single` and `multiblock` only. Author kinetic machines in the editor.

## Release acceptance test

Start once with the exact optional-mod set, confirm each Trait, capability and condition appears, run an input and an output recipe, test every exposed side, restart the world, then check the recipe viewer. Repeat after any optional-mod version change.
