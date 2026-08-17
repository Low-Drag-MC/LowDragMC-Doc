# MBD2 KubeJS

<VersionBadge version="Minecraft 1.21.1 / MBD2 21.0.11" label="Current docs" icon="tag" />
<VersionBadge version="KubeJS 2101.7.2-build.226" label="Script runtime" icon="tag" />

MBD2 adds recipe schemas, registry events, and targeted machine events to KubeJS. Put registry definitions in `kubejs/startup_scripts` and recipes or machine behavior in `kubejs/server_scripts`.

<figure>
<img src="/assets/multiblocked2/recipes/recipe-display-ui.png" alt="MBD2 Recipe Viewer UI editor showing the template that KubeJS-authored recipes use in JEI, REI, or EMI">
<figcaption>KubeJS supplies recipe data; the editor-authored Recipe Viewer UI controls how that data is presented.</figcaption>
</figure>

## Loading phases

| Phase | MBD2 API | Use it for |
| --- | --- | --- |
| Startup | `MBDRegistryEvents.machine`, `MBDRegistryEvents.recipeType` | Basic definitions and recipe-type registration |
| Server | `ServerEvents.recipes`, `MBDMachineEvents.*`, `MBDRecipeTypeEvents.*` | Recipes and machine behavior |
| Client | Client machine events when available | Visual-only hooks |

Every `MBDMachineEvents` and `MBDRecipeTypeEvents` subscription is targeted: pass the machine definition ID or recipe-type ID as its first argument.

::: warning Machine authoring boundary
Current KubeJS registration creates only basic `single` or `multiblock` definitions. It does not expose the editor's complete state, trait, renderer, or pattern configuration. Author those in an MBD2 editor project, then script recipes and behavior.
:::

Start with [Registry events](./registry.md), then [recipes](./recipe.md). For complete copyable scripts, open the [example library](./examples/).

## Version badge policy

- **Current API**: checked against the 1.21.1 branch and suitable as a new-script baseline.
- **Legacy; not valid on 1.21.1**: retained only to identify 1.20.1 Discord, old Wiki, or old pack code.
- **Present in source but not posted**: the Java type or KubeJS handler name exists, but base machines do not currently fire it.

::: warning Do not mix UI generations
The MBD2 `onUI` entry point remains, but 1.21.1 now carries an LDLib2 2.x `UI` / `UIElement` tree. Legacy `Widget`, `getFirstWidgetById`, and `setOnPressCallback` examples do not run. See [UI behavior](./ui.md).
:::
