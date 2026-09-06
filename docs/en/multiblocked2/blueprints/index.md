# Machine Blueprints

<VersionBadge version="21.1.1" label="MBD2" icon="tag" />
<VersionBadge version="21.1.0.13" label="KilaGraph" icon="tag" />

A blueprint is a node graph that reacts to a machine's events. It reaches everything the [KubeJS machine events](../KubeJS/event.md) reach — states, traits, recipe logic, redstone, custom data, effects, even the machine UI — but it lives inside the machine project, so a machine ships its behaviour with itself.

<figure>
<img src="/assets/multiblocked2/blueprints/canvas.png" alt="Blueprint canvas with a Machine Tick entry node feeding a Branch that either sets a machine state or cancels the event">
<figcaption>A blueprint graph: an event entry node on the left, reads below it, a decision in the middle, and machine actions on the right.</figcaption>
</figure>

## When to use one

| You want | Use |
| --- | --- |
| Behaviour that ships with the machine, editable in game | **A blueprint** |
| Behaviour a modpack author overrides per pack | [KubeJS](../KubeJS/) |
| A new storage model, content type, or condition | [Java](../java/) |
| Amount, duration, or parallel scaling | [Recipe modifiers](../editor/recipe-logic.md) first — they are cheaper |

Blueprints and KubeJS handlers coexist: both receive the same event, blueprints first.

## The shortest useful one

MBD2 ships twelve worked blueprints. The smallest is `redstone_control` — an event, a read, a decision, a write:

<figure>
<img src="/assets/multiblocked2/blueprints/builtin-redstone-control.png" alt="The redstone_control built-in blueprint: Machine Tick and Machine Info feeding Redstone Power, then a comparison and XOR into Set Working Enabled">
<figcaption>`built-in(mbd2:redstone_control)`. The yellow notes are part of the graph — every built-in explains itself on its own canvas.</figcaption>
</figure>

Bind it to a machine, set `requiresSignal` and `threshold` in the machine's Inspector, and the machine has redstone control. No graph editing at all.

## Read next

| Page | Covers |
| --- | --- |
| [Concepts](./concepts.md) | Events, the machine target, parameters, binding, execution and failure |
| [Node reference](./nodes.md) | What is in the palette, by group |
| [Built-in blueprints](./built-in.md) | The twelve MBD2 ships, their parameters and what each one teaches |

<figure>
<img src="/assets/multiblocked2/blueprints/library.png" alt="The editor blueprint library listing the built-in blueprints as resources">
<figcaption>The blueprint library, in the editor's Resources pane.</figcaption>
</figure>

## Requirements

Blueprints need [KilaGraph](https://github.com/Low-Drag-MC/KilaGraph) `21.1.0.12` or newer, which MBD2 depends on. The palette is KilaGraph's ~300 generic nodes (math, logic, string, list, map, flow, `mc.*`) plus MBD2's 235 machine nodes.

::: info Where the graphs live
A blueprint is a `.bp` resource in the editor's blueprint library, or a **built-in** MBD2 ships in memory. A binding either references one by path or [inlines a snapshot](./concepts.md#reference-or-inline) into the machine.
:::
