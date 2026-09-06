# Editor Workflow

<VersionBadge version="21.1.1" label="MBD2" icon="tag" />

The MBD2 editor is the primary authoring tool for machine and recipe-type product files.

<figure>
<img src="/assets/multiblocked2/editor/overview.png" alt="MBD2 editor showing project tabs, the state hierarchy, a scene preview, the Inspector, History and Resources views">
<figcaption>Project views occupy the centre; Inspector and History dock right, Resources below.</figcaption>
</figure>

Run `/mbd2_editor` to open it. The project menu discovers registered machine and recipe-type project providers automatically, so a Create Kinetic Machine appears alongside the built-in single and multiblock types when Create is installed.

## Views of a machine project

| View | Owns |
| --- | --- |
| Basic Settings | Definition ID, block and item properties, machine settings, traits, recipe logic, part settings, [blueprint bindings](../blueprints/) |
| Machine Traits | The trait list and each trait's configuration |
| Machine UI | The `UIElement` tree bound to traits at runtime |
| [Machine FX](./machine-fx.md) | Per-state Photon effects and the named FX library |
| Multiblock Pattern | Predicates, layers, repetition and shape info — multiblock projects only |

Recipe-type projects have a recipes list and a recipe display UI view instead.

## Authoring sequence

1. Create a project of the required machine type and set its ID first.
2. Configure the definition and its [states](./states-and-rendering.md).
3. Add [traits](./traits-and-ui.md), then generate or refine the machine UI.
4. Enable [recipe logic](./recipe-logic.md) and select a recipe type.
5. For multiblocks, author predicates, the [pattern](./multiblocks.md) and shape information.
6. Add [effects](./machine-fx.md) and [blueprints](../blueprints/) if the machine needs them.
7. Save the project, then export its product before testing recipes.

## Reloading without a restart

| Command | Reloads |
| --- | --- |
| `/mbd2 reload_machine_projects` | Every machine definition created from a project file |
| `/mbd2 reload_recipe_type_projects` | Every recipe type created from a project file, and its recipes |

Both are single-player, permission-level-2 commands, and they re-read the exported product — not the editor's unsaved state. Export first.

Changes to block properties, shapes and registry-facing settings still need a full restart.
