# MBD2 KubeJS

<VersionBadge version="Minecraft 1.21.1 / MBD2 21.1.1" label="Current docs" icon="tag" />
<VersionBadge version="KubeJS 2101.7.2-build.226" label="Script runtime" icon="tag" />

MBD2 adds recipe schemas, registry events, targeted machine events, and a client renderer hook to KubeJS.

<figure>
<img src="/assets/multiblocked2/recipes/recipe-display-ui.png" alt="MBD2 Recipe Viewer UI editor showing the template a KubeJS-authored recipe is displayed with in JEI, REI or EMI">
<figcaption>KubeJS supplies recipe data; the editor-authored Recipe Viewer UI controls how it is presented.</figcaption>
</figure>

## Script placement

| Folder | MBD2 API | Use it for |
| --- | --- | --- |
| `startup_scripts` | `MBDRegistryEvents.machine`, `MBDRegistryEvents.recipeType` | Registering recipe types and base machine definitions |
| `server_scripts` | `ServerEvents.recipes`, `MBDMachineEvents.*`, `MBDRecipeTypeEvents.onTransferProxyRecipe` | Recipes and machine behaviour |
| `client_scripts` | `MBDMachineEvents.onClientTick` / `onCustomDataUpdate` / `onCustomKeyframe`, `MBDRecipeTypeEvents.onRecipeUI`, `MBDClientEvents.registerCustomRenderers` | Visuals only |

Every `MBDMachineEvents` and `MBDRecipeTypeEvents` subscription is **targeted**: the first argument is the machine-definition ID or recipe-type ID.

Registry changes need a full restart; `/reload` rebuilds recipes only.

## Global bindings

| Binding | Is |
| --- | --- |
| `MBDRegistries` | The MBD2 registries — `RECIPE_CAPABILITIES`, `RECIPE_TYPES`, `MACHINE_DEFINITIONS`, … |
| `IO` | `IO.IN`, `IO.OUT`, `IO.BOTH`, `IO.NONE` |
| `CapabilityIO`, `ContentModifier`, `MachineState`, `ConfigBlockProperties` | MBD2 config types |
| `UIEvents`, `HoverTooltips`, `DataBindingBuilder`, … | LDLib2 UI types; see its own documentation |

Every `com.lowdragmc.mbd2` and `com.lowdragmc.lowdraglib2` class is also reachable through `Java.loadClass(...)`.

## Pages

| Page | Covers |
| --- | --- |
| [Registry events](./registry.md) | Creating recipe types and base machine definitions at startup |
| [Recipes](./recipe.md) | The full recipe builder |
| [Traits](./trait.md) | Reaching a machine's storage from an event |
| [Events](./event.md) | Every machine and recipe-type event, and what each one can change |
| [UI behaviour](./ui.md) | Attaching server behaviour to an editor-authored machine UI |
| [Script renderers](./client-renderers.md) | Drawing a machine from a client script |
| [Dynamic recipe modification](./upgrade_system.md) | Rewriting the selected recipe at runtime |
| [Proxy recipe types](./proxy_recipetype.md) | Filtering recipes imported from another recipe type |
| [Example library](./examples/) | Copyable scripts |

::: warning Machine authoring boundary
KubeJS registration creates only a bare `single` or `multiblock` definition. It does not expose the editor's states, traits, renderers, UI, recipe logic or multiblock patterns. Author those in an MBD2 editor project, then script recipes and behaviour against it.
:::

::: warning Do not mix UI generations
`MBDMachineEvents.onUI` still exists, but `wrapper.event.ui` is an LDLib2 2.x `UI`, not the 1.20.1 `WidgetGroup`. Legacy `getFirstWidgetById` and `setOnPressCallback` examples do not run. See [UI behaviour](./ui.md).
:::

::: tip Blueprints do the same jobs
Everything on the [events](./event.md) page is also available as a [blueprint](../blueprints/) node graph, authored in the editor and shipped inside the machine. Use KubeJS when the *pack* owns the behaviour, a blueprint when the *machine* does.
:::
