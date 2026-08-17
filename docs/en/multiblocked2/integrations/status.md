# Integration Status and Utility Mods

<VersionBadge version="21.0.11" label="MBD2" icon="tag" />

<figure>
<img src="/assets/multiblocked2/integrations/status.png" alt="MBD2 Add Trait registry showing optional integration entries exposed by the installed test mods">
<figcaption>The live editor registry provides runtime evidence for the capability integrations marked available below.</figcaption>
</figure>

| Mod | 21.0.11 status | Public surface |
| --- | --- | --- |
| Mekanism | Active | Chemicals, heat, temperature |
| Create | Partial/active runtime | Rotation capability/condition/Trait; KubeJS kinetic builder and editor project path disabled |
| PneumaticCraft | Active | Pressure/air, heat, conditions |
| Nature's Aura | Active | Aura capability/Trait |
| Applied Energistics 2 | Active | ME Interface and Pattern Provider Traits |
| KubeJS | Active | Registries, generated recipe schemas, machine/recipe-type events |
| JEI / REI / EMI | Active utility | Recipe/multiblock display; no machine storage |
| Jade | Active utility | Machine information provider; no recipe behavior |
| GeckoLib | Active rendering | Animated renderer and client keyframe bridge |
| Botania / GTCEu / Embers / Photon | Not publicly exposed | Classes remain, but critical registrations/calls are commented or inactive |

Do not publish runnable examples for dormant integrations. Historical `inputMana`, `inputEU`, `inputEmber`, and Photon machine-FX paths are not supported entry points in this baseline.

For viewers, `isXEIVisible` controls recipe-type category visibility and recipe `isXEIHidden` controls an individual recipe. `uiName` routes content to an authored widget; default generated IDs follow `@<capability>_<io>_<index>`. Jade only reports information. GeckoLib animation callbacks should remain visual unless server-authoritative logic separately performs gameplay changes.

## Release acceptance test

Start once with the exact optional-mod set, confirm each Trait/capability/condition appears, execute input and output recipes, test all exposed sides, restart the world, then inspect the chosen recipe viewer. Repeat after any optional-mod version change.
