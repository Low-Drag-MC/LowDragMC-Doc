# KubeJS Example Library

<VersionBadge version="Minecraft 1.21.1 / MBD2 21.0.11" label="Default version" icon="tag" />

These examples are organized as copyable script files. Unless a page carries a legacy badge, every snippet was checked against MBD2 `21.0.11`, KubeJS `2101.7.2-build.226`, and LDLib2 `2.2.35` source.

<figure><img src="/assets/multiblocked2/recipes/recipe-display-ui.png" alt="MBD2 Recipe Viewer UI showing the content layout used by KubeJS recipes"><figcaption>Example scripts supply runtime data; editor projects supply machine, Trait, and UI authoring data.</figcaption></figure>

| Example | What it teaches | Script stage |
| --- | --- | --- |
| [Minimal complete machine](./complete-machine.md) | Register a recipe type, base machine, and recipe | Startup + Server |
| [Recipe cookbook](./recipe-cookbook.md) | Built-in content, chance, and per-tick IO | Server |
| [Conditions and routing](./conditions-and-routing.md) | Conditions, `slotName`, and `uiName` | Server |
| [Machine events](./machine-events.md) | Interaction, states, multiblocks, lifecycle hooks | Server/Client |
| [Traits and custom data](./traits-and-data.md) | Safe item, fluid, FE, and persistent NBT access | Server |
| [UI behavior](./ui-behavior.md) | 1.21.1 `UIElement` queries and server listeners | Server |
| [Runtime recipe modification](./runtime-recipe.md) | Upgrades, duration, and recipe copies | Server |
| [Mod integrations](./integrations.md) | Create, Mekanism, PNC, Nature's Aura | Server |
| [1.20.1 migration](./migration.md) | Map legacy APIs to current APIs | Migration |

::: tip Validation order
Check `logs/kubejs/startup.log` first, restart after registry changes, and then inspect `logs/kubejs/server.log`. `/reload` cannot validate registry changes.
:::

Legacy Discord examples are treated as requirements input only. Methods absent from current source are documented on the migration page, not presented as runnable 1.21.1 code.
