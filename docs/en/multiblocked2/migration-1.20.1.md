# Migrating from the 1.20.1 Wiki

<VersionBadge version="21.1.1" label="MBD2" icon="tag" />

The old MBD2 pages were not a reliable API reference for 1.21.1. Update scripts and pack documentation against the current release before shipping.

| Old assumption | 1.21.1 guidance |
| --- | --- |
| Any code path shown in the old integration list is usable | Use the [integration status matrix](./integrations/status.md); Botania, GTCEu and Embers registrations are commented out |
| KubeJS can configure every machine field | KubeJS creates only bare `single` / `multiblock` definitions; author full definitions in the editor |
| The 1.20.1 Widget UI applies | 1.21.1 uses LDLib2 2.x `UIElement`; see [UI behaviour](./KubeJS/ui.md) |
| Machine behaviour has to be scripted | [Blueprints](./blueprints/) cover the same events inside the machine project |
| Photon recipes exist | Photon supplies [machine effects](./editor/machine-fx.md), not recipe content |
| Old GitHub `1.20.1` links describe the API | Use current source and this manual |

## What is new since the 1.20.1 wiki

| Feature | Page |
| --- | --- |
| Node-graph machine behaviour | [Blueprints](./blueprints/) |
| Per-machine setting overrides | [Runtime values](./editor/runtime-values.md) |
| Photon particle effects | [Machine effects](./editor/machine-fx.md) |
| Script block-entity renderers | [Script renderers](./KubeJS/client-renderers.md) |
| Ars Nouveau Source | [Ars Nouveau](./integrations/ars-nouveau.md) |

Re-test recipe loading, machine formation, capability IO and recipe-viewer displays after migration.
