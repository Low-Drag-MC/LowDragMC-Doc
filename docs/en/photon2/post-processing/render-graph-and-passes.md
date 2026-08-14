# Render Graph and Passes

<VersionBadge version="2.2.0" label="Since" icon="tag" />

![A real post-effect Render Graph open beside its resources and preview](/assets/photon2/graph-render-effect.webp)

*Render Graph nodes declare pass sources, dependencies, temporary targets, and the final output.*

A Render Graph is a directed acyclic graph of texture resources and full-screen dispatches. It describes one reusable effect, not the complete game renderer.

## Input Nodes

| Input | Contents |
| --- | --- |
| Scene Color | The HDR scene at this position on the global effect axis, including lower-priority effects |
| Scene Depth | Captured opaque scene depth |
| Custom Mask | R = mask group id / 255 for marked Photon renderers; black elsewhere |
| Custom Depth | Depth of marked Photon renderers over the scene-depth prefill |
| Texture Input | An external/named texture supplied to the graph |
| Effect Weight | Merged request weight for this execution |

## Pass Source and Dynamic Ports

A Pass runs either a Fullscreen Graph or a hand-written Core Shader. Its Texture Samplers become wire-only texture ports; exposed scalar/`vec2`/`vec3`/`vec4` uniforms become value ports. Engine uniforms such as screen size, time, and matrices are bound automatically.

See [Hand-written Fullscreen Shaders](./handwritten-fullscreen-shaders.md) for the resource layout, complete GLSL example, and the available uniforms and samplers.

The editor keeps the last valid port set when a source is temporarily broken, so a failed graph reload does not delete every authored wire. The compiler still reports the invalid pass.

## Target Size and Format

| Size mode | Meaning |
| --- | --- |
| Screen Relative | screen/effect-chain size × scale |
| Input Relative | an earlier input/resource size × scale |
| Absolute | fixed width × height |

Use half-resolution chains for blur/bloom where quality permits. `RGBA16F` is the default HDR format. Lower-precision formats save memory/bandwidth; `R8` is suitable for one-channel masks but not HDR color.

Temporary render targets come from a pool and live only as long as the compiled execution requires. Do not expect a pass output to persist into later frames unless an explicit external system owns it.

## Output, Priority, and Auto Blend

Effect Output has two effect-level settings:

- **Priority** places the effect on the global axis. Built-in Bloom is at `0`; negative effects run before it and positive effects after it. Equal priority is ordered stably by effect path.
- **Auto Blend** applies `mix(scene, effect, Weight)` at the end. Disable it only when the graph intentionally consumes Effect Weight and performs its own blend.

## Dependency Rules

Every pass input must come from an input node or an earlier pass. Cycles, missing required textures, no Effect Output, invalid source graphs, and incompatible resource sizes/types fail graph compilation. Keep the graph left-to-right and name Blackboard parameters by purpose to make these errors easy to locate.
