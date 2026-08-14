# Hand-written Core Shaders and ExtendedShader

<VersionBadge version="2.0.0" label="Since" icon="tag" />

Photon loads Core Shaders through LDLib2's `LDShaderInstance` and `LDShaderHolder`. They retain Minecraft's JSON/VSH/FSH structure and add a geometry stage, compile-time defines, dynamic uniforms/samplers, and persisted Inspector parameters.

This example creates a small but complete particle material. It reads Photon particle vertices, the light map, and a texture selected in the Inspector, and exposes `TintColor` and `DiscardThreshold`.

## 1. JSON

Create `assets/wiki/shaders/core/wiki_particle.json`:

```json
{
  "vertex": "wiki:wiki_particle",
  "fragment": "wiki:wiki_particle",
  "samplers": [
    { "name": "Sampler2" },
    { "name": "Texture" }
  ],
  "uniforms": [
    { "name": "ModelViewMat", "type": "matrix4x4", "count": 16,
      "values": [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
    { "name": "ProjMat", "type": "matrix4x4", "count": 16,
      "values": [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
    { "name": "FogStart", "type": "float", "count": 1, "values": [0] },
    { "name": "FogEnd", "type": "float", "count": 1, "values": [1] },
    { "name": "FogColor", "type": "float", "count": 4, "values": [0, 0, 0, 0] },
    { "name": "FogShape", "type": "int", "count": 1, "values": [0] },
    { "name": "TintColor", "type": "float", "count": 4, "values": [1, 1, 1, 1] },
    { "name": "DiscardThreshold", "type": "float", "count": 1, "values": [0.01] }
  ]
}
```

`Sampler2` is the built-in light map. `Texture` avoids the reserved prefix and therefore appears in Shader Settings.

## 2. Vertex Shader

Create `assets/wiki/shaders/core/wiki_particle.vsh`:

```glsl
#version 330 core

#moj_import <fog.glsl>
#moj_import <photon:particle.glsl>

uniform sampler2D Sampler2;
uniform mat4 ModelViewMat;
uniform mat4 ProjMat;
uniform int FogShape;

out float vertexDistance;
out vec2 texCoord0;
out vec4 vertexColor;

void main() {
    ParticleData data = getParticleData();

    gl_Position = ProjMat * ModelViewMat * vec4(data.Position, 1.0);
    vertexDistance = fog_distance(data.Position, FogShape);
    texCoord0 = data.UV;
    vertexColor = data.Color * texelFetch(Sampler2, data.LightUV / 16, 0);
}
```

`photon:particle.glsl` normalizes the input of CPU particles, tile/model GPU instances, trails, beams, and AraTrail. Do not assume vanilla attributes such as `Position` and `UV0` always exist. Read them through `getParticleData()`:

```glsl
struct ParticleData {
    vec3 Position;
    vec4 Color;
    vec2 UV;
    ivec2 LightUV;
    vec3 Normal;
    vec3 ObjectPosition;
    vec3 ObjectNormal;
};
```

Instancing and buffer-texture accessors use GLSL 330 features, so a vertex shader using Photon helpers should declare `#version 330 core`.

## 3. Fragment Shader

Create `assets/wiki/shaders/core/wiki_particle.fsh`:

```glsl
#version 150

#moj_import <fog.glsl>

uniform sampler2D Texture;
uniform float FogStart;
uniform float FogEnd;
uniform vec4 FogColor;
uniform vec4 TintColor;
uniform float DiscardThreshold;

in float vertexDistance;
in vec2 texCoord0;
in vec4 vertexColor;

out vec4 fragColor;

void main() {
    vec4 color = texture(Texture, texCoord0) * vertexColor * TintColor;
    if (color.a < DiscardThreshold) {
        discard;
    }
    fragColor = linear_fog(color, vertexDistance, FogStart, FogEnd, FogColor);
}
```

Back in Photon, select `wiki:wiki_particle`, assign a PNG to `Texture`, and adjust `TintColor` and `DiscardThreshold`. Names and types in the three files, including vertex/fragment varyings, must match exactly.

## Renderer Variants

Photon recompiles the same shader for the active draw path and injects one define:

| Define | Draw path |
| --- | --- |
| none | CPU path and material preview |
| `PARTICLE_INSTANCE` | tile-particle GPU instancing |
| `PARTICLE_MODEL_INSTANCE` | model-particle GPU instancing |
| `TRAIL_INSTANCE` | particle trails |
| `BEAM_INSTANCE` | beams |
| `ARA_TRAIL_INSTANCE` | flat AraTrail |
| `ARA_TRAIL_TUBE_INSTANCE` | tube AraTrail |

`getParticleData()` handles these differences. If you bypass the helper and declare attributes yourself, implement the layout of every target define; see [Vertex Formats and GPU Instancing](./vertex-formats-and-instancing.md).

## Geometry Shader

ExtendedShader accepts a `geometry` entry in the JSON:

```json
{
  "vertex": "wiki:wiki_particle",
  "geometry": "wiki:wiki_particle",
  "fragment": "wiki:wiki_particle"
}
```

The corresponding file is `assets/wiki/shaders/core/wiki_particle.gsh`. It is attached before program linking. Use this only when a geometry stage must alter or generate primitives. It does not normalize renderer input; the vertex shader must still produce the correct data.

## Includes, Curves, and Particle Data

- `#moj_import <photon:particle.glsl>`: input layouts and `ParticleData`. Its GPU-data buffer accessors serve Shader Graph; Custom Shader Material reads Additional/Custom Data through appended attributes as described in [Additional GPU Data](./additional-gpu-data.md).
- `#moj_import <photon:particle_utils.glsl>`: `getCurveValue()` and `getGradientValue()`.
- `#moj_import <namespace:file.glsl>`: loads `assets/<namespace>/shaders/include/file.glsl`.

Additional GPU Data accessors are vertex-stage functions. To use a value in the fragment stage, write it to a varying first. See [Additional GPU Data](./additional-gpu-data.md) for the complete slot matrix.

## Troubleshooting Compilation

1. JSON must be valid: no comments or trailing commas.
2. Shader IDs omit extensions; so do Vertex/Fragment/Geometry values in JSON.
3. Find the first JSON, include, compile, or link error in `latest.log`.
4. Start with a fixed fragment output such as `vec4(1, 0, 1, 1)`, then restore textures, varyings, and calculations one at a time.
5. Click **Reload Shader** after file edits. Run Minecraft Resource Reload as well if the resource pack itself changed.

See [Built-in Uniform and Sampler Reference](./custom-shader-builtins.md) for every name Photon binds automatically.
