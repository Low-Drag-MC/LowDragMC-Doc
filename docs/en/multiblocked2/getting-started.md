# Getting Started

<VersionBadge version="21.0.11" label="MBD2" icon="tag" />

Create a machine project in the editor, export it, then add recipes. This path needs no Java code.

<figure>
<img src="/assets/multiblocked2/editor/overview.png" alt="MBD2 editor immediately after creating a single-block machine project">
<figcaption>Create a project first; use the editor rather than hand-writing its NBT product files.</figcaption>
</figure>

## Prerequisites

- Minecraft `1.21.1`, NeoForge, LDLib2, and a compatible MBD2 `21.0.11` build.
- Creative-mode permissions to run `/mbd2_editor` while authoring.
- Optional: JEI, REI, or EMI to inspect the resulting recipe displays.

## First machine

1. Run `/mbd2_editor` and create a single-machine or multiblock project.
2. Set the machine ID, block/item properties, states, and renderer in the machine configuration view.
3. Add the required [traits](./editor/traits-and-ui.md). A trait provides storage, automation, or a recipe handler.
4. Enable recipe logic and select a recipe type.
5. Save/export the project, restart or reload the development instance as required, and test the generated block.
6. Create a recipe in the recipe-type project or with [KubeJS](./KubeJS/recipe.md).

::: tip
Build a one-input, one-output machine before adding probabilities, conditions, or automation. It makes recipe debugger output much easier to interpret.
:::

## Where data comes from

MBD2 loads authored machine and recipe-type product files from its MBD2 assets directory. The editor owns their NBT format; treat exported files as build output, not a hand-authored API. KubeJS is best for server recipe content and behavior hooks.

Next: [Editor workflow](./editor/).

For a complete registration example, continue with the [Java and KubeJS tutorials](./tutorials/).
