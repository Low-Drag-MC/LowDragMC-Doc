# KubeJS Example Library

<VersionBadge version="Minecraft 1.21.1 / MBD2 21.1.1" label="Default version" icon="tag" />

Copyable script files. Unless a snippet carries a legacy badge, it was executed against MBD2 `21.1.1`, KubeJS `2101.7.2-build.226` and LDLib2 `2.2.39.a` — not only read off the source.

| Example | What it teaches | Script stage |
| --- | --- | --- |
| [Minimal complete machine](./complete-machine.md) | Register a recipe type, a base machine and a recipe | Startup + Server |
| [Recipe cookbook](./recipe-cookbook.md) | Built-in content, chance, per-tick IO, recipe data | Server |
| [Conditions and routing](./conditions-and-routing.md) | Conditions, `slotName` and `uiName` | Server |
| [Machine events](./machine-events.md) | Interaction, states, multiblocks, lifecycle hooks | Server / Client |
| [Traits and custom data](./traits-and-data.md) | Item, fluid and FE access, persistent NBT, runtime values | Server |
| [UI behaviour](./ui-behavior.md) | `UIElement` queries and server listeners | Server / Client |
| [Runtime recipe modification](./runtime-recipe.md) | Upgrades, duration and recipe copies | Server |
| [Mod integrations](./integrations.md) | Create, Mekanism, PNC, Nature's Aura, Ars Nouveau | Server |
| [1.20.1 migration](./migration.md) | Map legacy APIs to current ones | Migration |

::: tip Debugging order
1. `logs/kubejs/startup.log` — registry scripts. A failure here means no recipe schema exists.
2. Restart. `/reload` cannot recreate registries.
3. `logs/kubejs/server.log` — recipe and event scripts. The line `Added N recipes … with X failed recipes` is the one to read.
:::

Legacy Discord and old-wiki examples are treated as requirements input only. Methods absent from current source are listed on the [migration page](./migration.md), never presented as runnable code.
