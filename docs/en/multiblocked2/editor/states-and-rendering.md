# States and Rendering

<VersionBadge version="21.1.1" label="MBD2" icon="tag" />

Every definition has a root `base` state. Child states inherit renderer, shape, light, rendering box, and sound when the corresponding toggle is disabled.

<figure>
<img src="/assets/multiblocked2/editor/states-and-rendering.png" alt="MBD2 base state selected with renderer, shape, light, rendering bounds, radius, and sound groups in Inspector">
<figcaption>Select a state in the left hierarchy to edit its enabled overrides and inherited rendering fields.</figcaption>
</figure>

## Recommended state tree

| State | Purpose |
| --- | --- |
| `base` | Fallback renderer, shape, light, and sound |
| `idle` | Ready but not currently processing |
| `waiting` | Recipe selected but condition/input/tick requirement is unavailable |
| `working` | Active processing visuals and sound |
| `formed` / `unformed` | Useful for parts or multiblock-specific presentation |

A child without its own enabled renderer uses the parent's renderer. The same inheritance applies independently to shape, light level, rendering box, machine sound, and [machine effects](./machine-fx.md).

## Renderer choices

| Renderer | Needs | Notes |
| --- | --- | --- |
| Model | A model resource location | Verify its texture dependencies are packaged |
| GeckoLib | GeckoLib, plus model, texture and animation resources | Adds the client keyframe event |
| **Custom Script** | KubeJS | Draws from a client script — see [script renderers](../KubeJS/client-renderers.md) |
| Java | An `IRenderer` supplied by a mod | Keep server construction safe; client suppliers are evaluated only on the client path |

Shapes rotate from their authored north-facing orientation. Rendering boxes affect block-entity rendering bounds, not collision. Global visibility and rendering radius can make a renderer visible farther away; use them sparingly.

## Effects and sound

A state's Photon effect list and its machine sound both follow the same inheritance rule as the renderer: a **disabled** toggle means "whatever my parent says", not "nothing". A state that genuinely wants silence enables the toggle and leaves the list empty. See [Machine effects](./machine-fx.md).

::: warning
Shape and registry-facing block property changes may require restart and can affect existing automation or collision. Test every facing, especially asymmetric shapes.
:::
