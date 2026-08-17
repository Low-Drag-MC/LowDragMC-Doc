# Single-Block Machines

<VersionBadge version="21.0.11" label="MBD2" icon="tag" />

A machine project produces a definition that later registers one block, item, block-entity type, runtime `MBDMachine`, state machine, traits, UI, and optional recipe logic.

<figure>
<img src="/assets/multiblocked2/editor/basic-settings.png" alt="Single-block machine Basic Settings view with definition ID and block and item properties in Inspector">
<figcaption>The definition Inspector is generated from the machine configuration and can be scrolled through every settings group.</figcaption>
</figure>

## Create and identify the project

1. Run `/mbd2_editor` and create a **Single Machine** project.
2. Set a namespaced definition ID such as `example:heat_press` before configuring references.
3. Save the editable project, then export the `.sm` product used at runtime.

The ID becomes the generated block, item, block-entity type, and machine-definition ID. Changing it after a world has used the machine creates missing registry entries unless the pack supplies a migration.

## Definition settings

| Group | Key decisions |
| --- | --- |
| Block properties | Rotation, collision/shape inherited from state, render layers, hardness/resistance and block behavior |
| Item properties | Item renderer, tooltip, GUI lighting, creative-tab toggle |
| Machine settings | Machine level, UI enabled, drop-machine-item behavior, redstone signal connections |
| Traits | Storage, recipe handlers, world capability exposure, automatic IO |
| Recipe logic | Enable flag, selected recipe type, damping, input-consumption timing, recipe modifiers |
| Part settings | Whether this single machine can be a multiblock part, sharing, controller capability proxying |

## Part versus controller

A single machine can enable `ConfigPartSettings` and join one or more multiblock controllers. `canShare` determines whether multiple controllers may use it. Controller capability proxy entries choose a trait-name filter and per-side `CapabilityIO`; they do not copy storage into the part.

When a single machine is only a standalone machine, leave part settings disabled. Unnecessary part/proxy settings make capability routing harder to diagnose.

Next: [States and rendering](./states-and-rendering.md), then [Traits and UI](./traits-and-ui.md).
