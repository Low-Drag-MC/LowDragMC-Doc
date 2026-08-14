# Hand-written Fullscreen Shaders

<VersionBadge version="2.2.0" label="Since" icon="tag" />

![A real post-effect Render Graph](/assets/photon2/graph-render-effect.webp)

A hand-written fullscreen shader is a Minecraft Core Shader dispatched by a Render Graph pass. Use one to port an existing post effect, write complex loops, or implement an algorithm not yet covered by Fullscreen Shader Graph. It shares the same fullscreen quad, HDR target pool, priorities, masks, and blending system as a graph pass.

## Minimal Resource Layout

You normally do not need to write a vertex shader. Photon ships `ldlib2:fast_blit` through LDLib2; it receives fullscreen `Position` and outputs normalized `texCoord`.

```text
assets/wiki/shaders/core/postfx/wave_tint.json
assets/wiki/shaders/core/postfx/wave_tint.fsh
```

The shader ID entered in Render Graph is `wiki:postfx/wave_tint`.

## Complete Example

This pass reads the previous image from `DiffuseSampler`, applies a horizontal wave measured in pixels, and multiplies it by an adjustable tint.

<DocTabs>
<DocTab title="wave_tint.json">

```json
{
  "vertex": "ldlib2:fast_blit",
  "fragment": "wiki:postfx/wave_tint",
  "samplers": [
    { "name": "DiffuseSampler" }
  ],
  "uniforms": [
    { "name": "DiffuseSampler_TexelSize", "type": "float", "count": 4,
      "values": [1, 1, 1, 1] },
    { "name": "ScreenSize", "type": "float", "count": 2,
      "values": [1, 1] },
    { "name": "GameTime", "type": "float", "count": 1,
      "values": [0] },
    { "name": "Strength", "type": "float", "count": 1,
      "values": [4] },
    { "name": "TintColor", "type": "float", "count": 4,
      "values": [1, 1, 1, 1] }
  ]
}
```

</DocTab>
<DocTab title="wave_tint.fsh">

```glsl
#version 150

uniform sampler2D DiffuseSampler;
uniform vec4 DiffuseSampler_TexelSize; // (width, height, 1/width, 1/height)
uniform vec2 ScreenSize;
uniform float GameTime;
uniform float Strength;
uniform vec4 TintColor;

in vec2 texCoord;
out vec4 fragColor;

void main() {
    float phase = texCoord.y * 40.0 + GameTime * 6.2831853;
    float offset = sin(phase) * Strength * DiffuseSampler_TexelSize.z;
    vec4 scene = texture(DiffuseSampler, texCoord + vec2(offset, 0.0));
    fragColor = scene * TintColor;
}
```

</DocTab>
</DocTabs>

`ScreenSize` is not needed by this small algorithm; it is retained to demonstrate an engine-uniform declaration. A GLSL compiler may optimize away unused uniforms, and Photon safely skips a missing location.

## Connect It to Render Graph

1. Create or open a Render Graph.
2. Add a **Pass** node.
3. Change **Pass Source Type** to **Custom Shader**.
4. Enter `wiki:postfx/wave_tint` as the shader.
5. The pass reflects `DiffuseSampler`, `Strength`, and `TintColor` ports from the JSON.
6. Connect **Scene Color** or an earlier pass output to `DiffuseSampler`.
7. Connect the pass output to **Effect Output**.

`Strength` and `TintColor` may be inline constants or Render Graph blackboard parameters overridden by Timeline or Java. To drive a uniform with request weight, connect **Effect Weight** to that value port. Hand-written shaders do not receive a mandatory built-in uniform named `Weight`.

After changing the JSON sampler/uniform interface, run Resource Reload and select the shader on the pass again so the node rebuilds its ports. The editor temporarily retains the last valid ports when the source breaks, but the Render Graph will not compile successfully.

## Every Sampler Is a Texture Port

The JSON `samplers` array defines the pass texture inputs. Names have no fixed semantics:

```json
"samplers": [
  { "name": "SceneColor" },
  { "name": "SceneDepth" },
  { "name": "NoiseTexture" }
]
```

This creates three required ports. They may connect to:

| Render Graph source | Typical use |
| --- | --- |
| Scene Color | original HDR color or the output of lower-priority effects |
| Scene Depth | depth fade, DOF, and position reconstruction |
| Custom Mask | restrict an effect by mask group |
| Custom Depth | depth of marked Photon renderers |
| Earlier pass output | multi-pass blur, bloom, and compositing |
| Texture Input | LUT, noise, ramp, or a runtime texture parameter |

::: warning Different from particle Custom Shader
Post FX does not use auto-bound names such as `SamplerSceneColor` or `SamplerSceneDepth`. A sampler's source is determined entirely by its Render Graph wire. Leaving any sampler unconnected fails graph compilation.
:::

### `<Sampler>_TexelSize`

For a sampler named `DiffuseSampler`, declare the matching suffix uniform:

```glsl
uniform vec4 DiffuseSampler_TexelSize;
```

Photon writes `(width, height, 1/width, 1/height)`. It does not become a value port and is intended for blur, outline, and other pixel offsets.

Scene, depth, mask, and pass outputs have known dimensions. When Texture Input comes from a fixed asset or runtime parameter, the executor may not know the source image dimensions, so the JSON default remains. Pass dimensions separately when such an algorithm requires them.

## Exposed Custom Uniforms

`CustomShaderPass` turns only these JSON declarations into pass value ports:

| JSON | Port type |
| --- | --- |
| `"type": "float", "count": 1` | float |
| `"type": "float", "count": 2` | vec2 |
| `"type": "float", "count": 3` | vec3 |
| `"type": "float", "count": 4` | vec4 |

Integers, matrices, and counts outside 1–4 are not exposed as parameter ports. JSON `values` are defaults. Every dispatch restores those defaults before applying pass constants, blackboard parameters, or Effect Weight, preventing values from a previous frame leaking into another execution.

There is no special color reflection rule. Represent a color as `float/count 4` and pass it as a vec4 in Render Graph.

## Engine Uniforms

The executor manages these names; they do not appear as pass ports.

| Name | Type | Value |
| --- | --- | --- |
| `ScreenSize` | `vec2` | current pass output target `(width, height)`; a half-resolution pass receives half-resolution dimensions |
| `GameTime` | `float` | `RenderSystem.getShaderGameTime()`, normalized to `0..1` over one Minecraft day |
| `ModelViewMat` | `mat4` | camera view/model-view matrix captured for this image |
| `ProjMat` | `mat4` | projection matrix captured for this image |
| `<Sampler>_TexelSize` | `vec4` | `(width, height, 1/width, 1/height)` for a known input texture |

### Camera and Screen-space Uniforms

<VersionBadge version="2.2.3" label="Since" icon="tag" />

| Name | Type | Value |
| --- | --- | --- |
| `U_ViewPort` | `vec4` | camera rectangle `(x, y, width, height)` in the pass target; the editor Scene may occupy only a sub-rectangle |
| `kg_Time` | `float` | seconds from the same clock as `GameTime`: `GameTime × 1200` |
| `kg_ViewMat` | `mat4` | captured view matrix |
| `kg_IViewMat` | `mat4` | inverse view matrix |
| `kg_IModelViewMat` | `mat4` | also inverse view on the current 1.21.1 camera path |
| `kg_IProjMat` | `mat4` | inverse projection matrix |
| `kg_CameraBlockPos` | `vec3` | integer block component of camera position |
| `kg_CameraOffset` | `vec3` | precision-split offset; absolute position is `kg_CameraBlockPos - kg_CameraOffset` |

Normalize fragment coordinates through the viewport:

```glsl
uniform vec4 U_ViewPort;

vec2 viewportUV = (gl_FragCoord.xy - U_ViewPort.xy) / U_ViewPort.zw;
```

This lets one shader work in the game fullscreen, the Photon editor sub-viewport, and downscaled passes. Use `kg_IProjMat`, `kg_IViewMat`, and the precision-split camera position when reconstructing positions from Scene Depth.

## Writing a Vertex Shader

Prefer `ldlib2:fast_blit`. If a custom vertex shader is necessary, the pass uses `DefaultVertexFormat.POSITION`; its minimal interface is:

```glsl
#version 150

in vec3 Position;
out vec2 texCoord;

void main() {
    gl_Position = vec4(Position.xy, 0.0, 1.0);
    texCoord = Position.xy * 0.5 + 0.5;
}
```

Vertex and fragment varying names/types must match. The quad already covers NDC `-1..1`; do not apply the model matrix of an ordinary world object.

## Caching and Troubleshooting

- Shader JSON interfaces and compiled `ShaderInstance`s are cached by shader ID.
- Resource Reload clears both caches; editing a file without reload does not reparse ports.
- Start with `fragColor = texture(Input, texCoord)` to verify wiring, then add depth, masks, and math.
- JSON must be valid: no comments or trailing commas.
- For a load failure, unreadable JSON, or missing sampler wire, inspect `latest.log` and the Render Graph compile error.

See [Render Graph and Passes](./render-graph-and-passes.md) for pass/target wiring. Use [Fullscreen Shader Graph](./fullscreen-graphs-and-textures.md) when GLSL is unnecessary.
