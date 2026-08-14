# Fullscreen Shader Graphs and Custom Textures

<VersionBadge version="2.2.0" label="Since" icon="tag" />

![Fullscreen Graph resources in the Photon browser](/assets/photon2/resource-fullscreen-graph.webp)

![A Fullscreen Graph being edited](/assets/photon2/graph-fullscreen.webp)

*A resource can expose sampler parameters for LUTs, noise, ramps, or mod-provided textures.*

Fullscreen Graph uses the same typed node system as particle Shader Graph, but its geometry is a full-screen quad and its inputs come from Render Graph pass ports.

## Coordinates

- **Fullscreen Position** provides the full-screen vertex basis and normalized UV.
- **Texel Size** returns the reciprocal target size; multiply it by pixel offsets for blur, outline, or chromatic aberration.
- Scene/depth reconstruction nodes use the camera state captured for the pass.

Never hard-code a screen resolution. Preview, window resizing, UI scale, and half-resolution passes all change actual target size.

## Exposed Inputs

| Graph variable | Pass port/use |
| --- | --- |
| Sampler/Texture | Wire Scene Color, depth-derived texture, previous pass, or Texture Input |
| float | radius, strength, threshold, time scale |
| vec2 | direction, center, distortion scale |
| vec3/vec4/color | tint, channel weights, outline color |

`Weight` is engine-managed and is not exposed as an ordinary pass port. Use the Effect Weight node when the shader must participate in blending internally.

## External Textures

LUTs, blue noise, ramps, lens dirt, and other images can enter through Texture Input. Keep them in the project/FX Pack namespace and document expected filtering/wrap behavior. A LUT's dimensions and packing are part of the effect contract; replacing it with an arbitrary image will not produce a meaningful result.

## Graph Pass vs Core Shader Pass

| Fullscreen Graph | Hand-written Core Shader |
| --- | --- |
| Visual editing and typed connections | Direct GLSL control |
| Exposed variables define ports | JSON samplers/uniforms are introspected |
| Compiler supplies stage plumbing | Author owns JSON/VSH/FSH compatibility |
| Easier resource refactoring | Easier to port established shaders |

Both sources run on the same full-screen quad and target pool, and can be mixed in one Render Graph.

See [Hand-written Fullscreen Shaders](./handwritten-fullscreen-shaders.md) for JSON reflection rules, sampler ports, and engine uniforms.

## Common Multi-pass Patterns

```text
Blur: Scene -> horizontal half-res pass -> vertical half-res pass -> Output
Bloom-like: Scene -> bright pass -> downsample/blur chain -> add-mix with Scene
Outline: Scene Depth -> edge pass; Scene Color + edge -> composite -> Output
LUT: Scene -> color lookup pass -> Output
```
