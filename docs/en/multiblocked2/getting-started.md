# Getting Started

<VersionBadge version="21.1.1" label="MBD2" icon="tag" />

Create a machine project in the editor, export it, then add recipes. This path needs no Java code.

<figure>
<img src="/assets/multiblocked2/editor/overview.png" alt="MBD2 editor immediately after creating a single-block machine project">
<figcaption>Create a project first; use the editor rather than hand-writing its NBT product files.</figcaption>
</figure>

## Prerequisites

- Minecraft `1.21.1`, NeoForge `21.1.217`+, LDLib2, KilaGraph, and MBD2 `21.1.1`.
- A single-player world and permission level 2 to run `/mbd2_editor`.
- Optional: JEI, REI or EMI to inspect the resulting recipe displays; Photon for [machine effects](./editor/machine-fx.md).

## First machine

1. Run `/mbd2_editor` and create a single-machine or multiblock project.
2. Set the machine ID first — it becomes the block, item, block-entity and definition ID, and changing it later orphans existing worlds.
3. Configure block and item properties, [states and the renderer](./editor/states-and-rendering.md).
4. Add the [traits](./editor/traits-and-ui.md) the machine needs. A trait provides storage, automation, or a recipe handler.
5. Enable [recipe logic](./editor/recipe-logic.md) and select a recipe type.
6. Save the project, **export its product**, and reload or restart.
7. Add a recipe in the recipe-type project or with [KubeJS](./KubeJS/recipe.md).

::: tip
Build a one-input, one-output machine before adding probabilities, conditions or automation. It makes [recipe debugger](./editor/debugging.md) output far easier to read.
:::

## Iterating

| Changed | Do |
| --- | --- |
| A recipe in a KubeJS server script | `/reload` |
| An exported machine project | `/mbd2 reload_machine_projects` |
| An exported recipe-type project | `/mbd2 reload_recipe_type_projects` |
| A KubeJS startup script, block properties, or a shape | Restart |

Both `/mbd2` reload commands re-read the **exported** product, not the editor's unsaved state.

## Where data comes from

MBD2 loads authored machine and recipe-type products from its assets directory. The editor owns their NBT format — treat exported `.sm` / `.mb` / `.rt` files as build output, not a hand-authored API.

## Next

| You want | Go to |
| --- | --- |
| The rest of the editor | [Editor workflow](./editor/) |
| Behaviour the machine ships with | [Blueprints](./blueprints/) |
| Pack-owned recipes and scripts | [KubeJS](./KubeJS/) |
| A complete registration example | [Tutorials](./tutorials/) |
