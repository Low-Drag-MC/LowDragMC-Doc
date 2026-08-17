# Migrating from the 1.20.1 Wiki

<VersionBadge version="21.0.11" label="MBD2" icon="tag" />

<figure><img src="/assets/multiblocked2/editor/overview.png" alt="Current MBD2 1.21.1 editor layout used as the migration baseline"><figcaption>Use the 1.21.1 editor and registry behavior shown here as the baseline, not screenshots or APIs from the old wiki.</figcaption></figure>

The old MBD2 pages were not a reliable API reference for 1.21.1. Update scripts and pack documentation against the current release before shipping.

| Old assumption | 1.21.1 guidance |
| --- | --- |
| Any code path shown in the old integration list is usable | Use the [integration status matrix](./integrations/status.md); several registrations are disabled |
| KubeJS can configure every machine field | KubeJS creates only basic `single`/`multiblock` definitions; author full definitions in the editor |
| Old GitHub `1.20.1` links describe the API | Use current source and this manual; the old paths are historical references only |
| Botania, GTCEu, Embers, Photon recipes are available | Do not add them to new pack content in `21.0.11` |

Re-test recipe loading, machine formation, capability IO, and recipe-viewer displays after migration.
