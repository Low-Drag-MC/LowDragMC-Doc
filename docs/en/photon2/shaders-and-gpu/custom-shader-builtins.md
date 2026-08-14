# Custom Shader Built-in Uniforms and Samplers

<VersionBadge version="2.0.0" label="Since" icon="tag" />

This is the lookup page for Custom Shader Material. Names are case-sensitive and must appear both in the shader JSON and in the GLSL stage that uses them. A declaration that GLSL never reads may be optimized out during compilation.

## Built-in Samplers

Names beginning with `Sampler` are hidden from Shader Settings. Photon currently handles these names:

| Name | GLSL type | Source | Notes |
| --- | --- | --- | --- |
| `Sampler0` | `sampler2D` | RenderSystem texture slot 0 | Conventional main-texture slot. Custom Shader Material does not select this texture itself, so it is reliable only when the active render pass explicitly set slot 0. Use a custom `Texture` sampler when the material must choose its own texture. |
| `Sampler2` | `sampler2D` | Minecraft light texture | Read block and sky light with `texelFetch(Sampler2, lightUV / 16, 0)`. |
| `SamplerBlockAtlas` | `sampler2D` | Minecraft block atlas | Photon binds the block atlas while loading the material. Use atlas UVs. |
| `SamplerSceneColor` | `sampler2D` | current Photon render pass scene color | Valid only inside an active `RenderPassPipeline`. |
| `SamplerSceneDepth` | `sampler2D` | current Photon render pass scene depth | This is nonlinear device depth. Use inverse matrices and viewport data when reconstructing positions. |
| `SamplerCurve` | `sampler2D` | material curve texture | Up to 128 curves with 128 samples each. |
| `SamplerGradient` | `sampler2D` | material gradient texture | Up to 128 gradients with 128 samples each. |

<figure>
<img src="/assets/photon2/CurveAndGradient.png" alt="Curve and Gradient configuration on Custom Shader Material">
<figcaption>SamplerCurve and SamplerGradient are configured as material data, not ordinary PNGs.</figcaption>
</figure>

### Curves and Gradients

```glsl
#moj_import <photon:particle_utils.glsl>

uniform sampler2D SamplerCurve;
uniform sampler2D SamplerGradient;

float strength = getCurveValue(SamplerCurve, 0, age01);
vec4 color = getGradientValue(SamplerGradient, 0, age01);
```

The second argument is a row in `0..127`; the third is a normalized horizontal coordinate. The helper clamps x to valid texel centers. The material panel edits curve/gradient data; Photon binds the generated texture to the shader only when the JSON declares the corresponding sampler.

### Scene Color and Scene Depth

<figure>
<img src="/assets/photon2/color.png" alt="SamplerSceneColor content">
<figcaption>SamplerSceneColor contains scene color captured by the current render pipeline before the particle draw.</figcaption>
</figure>

<figure>
<img src="/assets/photon2/Depth.webp" alt="SamplerSceneDepth content">
<figcaption>SamplerSceneDepth supports depth fade, intersections, and soft particles.</figcaption>
</figure>

Scene samplers are snapshots of the current pipeline and do not necessarily include transparent objects drawn later. A material preview, or a draw without an active Photon render pass, has no valid scene texture.

### Block Atlas

<figure>
<img src="/assets/photon2/blockUV.png" alt="Minecraft block-atlas UVs">
<figcaption>SamplerBlockAtlas expects atlas UVs, not local 0..1 UVs for one texture.</figcaption>
</figure>

## Photon Dynamic Uniforms

| Name | GLSL type | Value on each apply |
| --- | --- | --- |
| `U_CameraPosition` | `vec3` | world position of the active Photon camera |
| `U_InverseProjectionMatrix` | `mat4` | inverse of the current RenderSystem projection matrix |
| `U_InverseViewMatrix` | `mat4` | inverse of the current RenderSystem model-view matrix |
| `U_ViewPort` | `vec4` | OpenGL viewport `(x, y, width, height)` |

`U_ViewPort` <VersionBadge version="2.1.3.a" label="Since" icon="tag" />

::: warning `U_` is reserved
`LDShaderHolder` hides every `U_` uniform, but Custom Shader Material updates only the four names above. Do not begin a custom uniform with `U_`: it will neither receive an automatic value nor appear in the Inspector.
:::

Compute screen UV from fragment coordinates and the viewport:

```glsl
uniform vec4 U_ViewPort;

vec2 screenUV = (gl_FragCoord.xy - U_ViewPort.xy) / U_ViewPort.zw;
```

## Minecraft `ShaderInstance` Uniforms

These standard names are recognized and populated from matching render state by `ShaderInstance`. Declare only what the shader needs.

| Name | Typical type | Meaning |
| --- | --- | --- |
| `ModelViewMat` | `mat4` | current model-view matrix |
| `ProjMat` | `mat4` | current projection matrix |
| `TextureMat` | `mat4` | current texture matrix |
| `ScreenSize` | `vec2` | current output size |
| `ColorModulator` | `vec4` | global color multiplier |
| `Light0_Direction` | `vec3` | first primary light direction |
| `Light1_Direction` | `vec3` | second primary light direction |
| `FogStart` | `float` | fog start distance |
| `FogEnd` | `float` | fog end distance |
| `FogColor` | `vec4` | fog color |
| `FogShape` | `int` | fog shape |
| `GameTime` | `float` | normalized Minecraft game time |
| `GlintAlpha` | `float` | glint intensity |
| `LineWidth` | `float` | line-rendering width |
| `ChunkOffset` | `vec3` | chunk rendering offset; ordinary Photon particles normally do not use it |

Not every Minecraft render path provides a meaningful value for every field. Particle materials most often use matrices, fog, color, screen size, and game time.

## Custom Samplers and Uniforms

Parameters outside the built-in lists are managed by the Inspector:

```json
"samplers": [
  { "name": "NoiseTexture" }
],
"uniforms": [
  { "name": "NoiseScale", "type": "float", "count": 1, "values": [4] },
  { "name": "EmissionColor", "type": "float", "count": 4, "values": [1, 0.4, 0.1, 1] }
]
```

`NoiseTexture` becomes a texture picker, `NoiseScale` a number, and `EmissionColor` an HDR color because its name contains `emission`. Custom values are copied to all renderer-define variants of the material and saved in the FX.

To read particle lifetime, velocity, or Java-injected data, do not invent another built-in uniform. Shader Graph uses the `PhotonData`/`PhotonCustomData` accessors; Custom Shader Material uses appended instance attributes. Both paths and their limitations are documented in [Additional GPU Data](./additional-gpu-data.md).
