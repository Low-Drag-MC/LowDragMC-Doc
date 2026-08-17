# States and Rendering

<VersionBadge version="21.0.11" label="MBD2" icon="tag" />

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

A child without its own enabled renderer uses the parent's renderer. The same inheritance applies independently to shape, light level, rendering box, and machine sound.

## Renderer choices

- Model renderer: point to a model resource location and verify its texture dependencies are packaged.
- GeckoLib renderer: requires GeckoLib and separate model, texture, and animation resources.
- Custom renderer: supplied by a Java extension; keep server construction safe because client renderer suppliers are evaluated only on the client path.

Shapes rotate from their authored north-facing orientation. Rendering boxes affect block-entity rendering bounds, not collision. Global visibility and rendering radius can make a renderer visible farther away; use them sparingly.

::: warning
Shape and registry-facing block property changes may require restart and can affect existing automation or collision. Test every facing, especially asymmetric shapes.
:::
