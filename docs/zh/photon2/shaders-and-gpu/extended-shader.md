# 手写 Core Shader 与 ExtendedShader

<VersionBadge version="2.0.0" label="自" icon="tag" />

Photon 通过 LDLib2 的 `LDShaderInstance` 与 `LDShaderHolder` 加载 Core Shader。它保留 Minecraft Core Shader 的 JSON/VSH/FSH 结构，并增加几何阶段、编译 Define、动态 Uniform/Sampler 以及 Inspector 参数保存。

下面制作一个最小但完整的粒子材质。它读取粒子顶点、光照贴图和一张由 Inspector 指定的纹理，并暴露 `TintColor` 与 `DiscardThreshold`。

## 1. JSON

创建 `assets/wiki/shaders/core/wiki_particle.json`：

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

`Sampler2` 是内置光照贴图；`Texture` 不使用保留前缀，因此会出现在 Shader Settings 中。

## 2. Vertex Shader

创建 `assets/wiki/shaders/core/wiki_particle.vsh`：

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

`photon:particle.glsl` 统一了 CPU 粒子、Tile/Model GPU Instance、Trail、Beam 和 AraTrail 的输入。不要直接假设 `Position`、`UV0` 等原版 Attribute 永远存在；通过 `getParticleData()` 读取：

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

Instancing 和 Buffer Texture Accessor 使用 GLSL 330 功能，因此使用 Photon Helper 的 Vertex Shader 应声明 `#version 330 core`。

## 3. Fragment Shader

创建 `assets/wiki/shaders/core/wiki_particle.fsh`：

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

回到 Photon，选择 `wiki:wiki_particle`，在 Shader Settings 为 `Texture` 选择 PNG，再调整 `TintColor` 和 `DiscardThreshold`。三个文件中声明的名称、类型和 Vertex/Fragment 的 varying 必须完全一致。

## Renderer Variant

Photon 会按实际绘制方式重编译同一 Shader，并注入一个 Define：

| Define | 使用场景 |
| --- | --- |
| 无 | CPU 路径与材质预览 |
| `PARTICLE_INSTANCE` | Tile 粒子 GPU Instance |
| `PARTICLE_MODEL_INSTANCE` | Model 粒子 GPU Instance |
| `TRAIL_INSTANCE` | Particle Trail |
| `BEAM_INSTANCE` | Beam |
| `ARA_TRAIL_INSTANCE` | Flat AraTrail |
| `ARA_TRAIL_TUBE_INSTANCE` | Tube AraTrail |

`getParticleData()` 会处理这些差异。若绕过 Helper 自己声明 Attribute，必须为每个目标 Define 编写匹配布局，详见[Vertex Format 与 GPU Instancing](./vertex-formats-and-instancing.md)。

## 几何着色器

ExtendedShader 允许在 JSON 中增加 `geometry`：

```json
{
  "vertex": "wiki:wiki_particle",
  "geometry": "wiki:wiki_particle",
  "fragment": "wiki:wiki_particle"
}
```

对应文件为 `assets/wiki/shaders/core/wiki_particle.gsh`。几何阶段会在 Program Link 前附加。只有确实需要改变或生成 Primitive 时才使用它；它不会自动适配不同 Renderer 的输入，Vertex Shader 仍需先产出正确数据。

## Include、Curve 与粒子数据

- `#moj_import <photon:particle.glsl>`：顶点布局与 `ParticleData`；其中的 GPU Data Buffer Accessor 服务 Shader Graph。Custom Shader Material 读取 Additional/Custom Data 时使用追加 Attribute，详见 [Additional GPU Data](./additional-gpu-data.md)。
- `#moj_import <photon:particle_utils.glsl>`：`getCurveValue()` 与 `getGradientValue()`。
- `#moj_import <namespace:file.glsl>`：加载 `assets/<namespace>/shaders/include/file.glsl`。

Additional GPU Data Accessor 只应在 Vertex Stage 调用；需要在 Fragment Stage 使用时，先写入 varying。完整槽位表见 [Additional GPU Data](./additional-gpu-data.md)。

## 编译问题排查

1. JSON 必须是合法 JSON，不能写注释或尾随逗号。
2. Shader ID 不带扩展名，JSON 中的 Vertex/Fragment/Geometry 值也不带扩展名。
3. 检查 `latest.log` 中最早出现的 JSON、Include、Compile 或 Link 错误。
4. 先让 Fragment 固定输出 `vec4(1, 0, 1, 1)`，再逐项恢复纹理、varying 和计算。
5. 修改文件后点击 **Reload Shader**；若 Resource Pack 本身发生变化，再执行 Minecraft Resource Reload。

所有可由 Photon 自动绑定的名称见[内置 Uniform 与 Sampler 参考](./custom-shader-builtins.md)。
