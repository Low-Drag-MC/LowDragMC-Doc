# Custom Shader 内置 Uniform 与 Sampler

<VersionBadge version="2.0.0" label="自" icon="tag" />

本页是 Custom Shader Material 的查询表。名称区分大小写，并且必须同时出现在 Shader JSON 和使用它的 GLSL Stage 中。未被 GLSL 实际使用的项可能在编译时被优化掉。

## 内置 Sampler

以 `Sampler` 开头的名称不会出现在 Shader Settings 中。Photon 当前会自动处理以下名称：

| 名称 | GLSL 类型 | 数据来源 | 说明 |
| --- | --- | --- | --- |
| `Sampler0` | `sampler2D` | RenderSystem Texture Slot 0 | 常用主纹理槽；Custom Shader Material 本身不选择这张纹理，只有当前 Render Pass 明确设置 Slot 0 时才可靠。需要材质自己选择纹理时使用自定义 `Texture` sampler。 |
| `Sampler2` | `sampler2D` | Minecraft Light Texture | 用 `texelFetch(Sampler2, lightUV / 16, 0)` 读取方块光与天空光。 |
| `SamplerBlockAtlas` | `sampler2D` | Minecraft Block Atlas | Photon 在加载材质时绑定方块图集。配合 Atlas UV 使用。 |
| `SamplerSceneColor` | `sampler2D` | 当前 Photon Render Pass 的 Scene Color | 仅在有效的 `RenderPassPipeline` 中可用。 |
| `SamplerSceneDepth` | `sampler2D` | 当前 Photon Render Pass 的 Scene Depth | 深度是非线性的设备深度；重建位置时同时使用逆矩阵和视口。 |
| `SamplerCurve` | `sampler2D` | 材质的 Curve Texture | 最多 128 条曲线，每条 128 个采样。 |
| `SamplerGradient` | `sampler2D` | 材质的 Gradient Texture | 最多 128 条渐变，每条 128 个采样。 |

<figure>
<img src="/assets/photon2/CurveAndGradient.png" alt="Custom Shader Material 的 Curve 与 Gradient 配置">
<figcaption>SamplerCurve 与 SamplerGradient 的数据在材质中配置，不是普通 PNG。</figcaption>
</figure>

### Curve 与 Gradient

```glsl
#moj_import <photon:particle_utils.glsl>

uniform sampler2D SamplerCurve;
uniform sampler2D SamplerGradient;

float strength = getCurveValue(SamplerCurve, 0, age01);
vec4 color = getGradientValue(SamplerGradient, 0, age01);
```

第二个参数是行号 `0..127`，第三个参数是归一化横坐标。Helper 会把 x 限制到有效 texel 中心范围。材质面板负责编辑 Curve/Gradient；只有 JSON 声明了对应 sampler，Photon 才会把生成的纹理绑定给 Shader。

### Scene Color 与 Scene Depth

<figure>
<img src="/assets/photon2/color.png" alt="SamplerSceneColor 内容">
<figcaption>SamplerSceneColor：粒子绘制前当前 Render Pipeline 保存的场景颜色。</figcaption>
</figure>

<figure>
<img src="/assets/photon2/Depth.webp" alt="SamplerSceneDepth 内容">
<figcaption>SamplerSceneDepth：同一场景的深度纹理，可用于 Depth Fade、交界线和软粒子。</figcaption>
</figure>

Scene sampler 是当前绘制管线的快照，不保证包含更晚绘制的透明物体。材质预览或没有活动 Photon Render Pass 时不会得到有效场景纹理。

### Block Atlas

<figure>
<img src="/assets/photon2/blockUV.png" alt="Minecraft Block Atlas UV">
<figcaption>SamplerBlockAtlas 使用图集 UV，而不是单张纹理的 0..1 局部 UV。</figcaption>
</figure>

## Photon 动态 Uniform

| 名称 | GLSL 类型 | 每次 Apply 的值 |
| --- | --- | --- |
| `U_CameraPosition` | `vec3` | 当前 Photon Camera 的世界坐标。 |
| `U_InverseProjectionMatrix` | `mat4` | 当前 `RenderSystem` Projection Matrix 的逆矩阵。 |
| `U_InverseViewMatrix` | `mat4` | 当前 `RenderSystem` Model View Matrix 的逆矩阵。 |
| `U_ViewPort` | `vec4` | OpenGL Viewport 的 `(x, y, width, height)`。 |

`U_ViewPort` <VersionBadge version="2.1.3.a" label="自" icon="tag" />

::: warning `U_` 是保留前缀
`LDShaderHolder` 会隐藏所有 `U_` uniform，但 Custom Shader Material 只会更新上表四个名称。自定义 uniform 不要以 `U_` 开头，否则它既不会自动绑定，也不会出现在 Inspector。
:::

屏幕 UV 可由 Fragment 坐标与 Viewport 得到：

```glsl
uniform vec4 U_ViewPort;

vec2 screenUV = (gl_FragCoord.xy - U_ViewPort.xy) / U_ViewPort.zw;
```

## Minecraft `ShaderInstance` 内置 Uniform

这些是 `ShaderInstance` 识别并按对应渲染状态更新的标准名称。只声明当前算法需要的项。

| 名称 | 常用类型 | 含义 |
| --- | --- | --- |
| `ModelViewMat` | `mat4` | 当前 Model View Matrix。 |
| `ProjMat` | `mat4` | 当前 Projection Matrix。 |
| `TextureMat` | `mat4` | 当前 Texture Matrix。 |
| `ScreenSize` | `vec2` | 当前输出尺寸。 |
| `ColorModulator` | `vec4` | 全局颜色乘数。 |
| `Light0_Direction` | `vec3` | 第一主光方向。 |
| `Light1_Direction` | `vec3` | 第二主光方向。 |
| `FogStart` | `float` | 雾开始距离。 |
| `FogEnd` | `float` | 雾结束距离。 |
| `FogColor` | `vec4` | 雾颜色。 |
| `FogShape` | `int` | 雾形状。 |
| `GameTime` | `float` | Minecraft 归一化游戏时间。 |
| `GlintAlpha` | `float` | Glint 强度。 |
| `LineWidth` | `float` | 线渲染宽度。 |
| `ChunkOffset` | `vec3` | Chunk Render Offset；普通 Photon 粒子通常不依赖它。 |

不同 Minecraft 渲染路径不一定为每个值提供有意义的状态。粒子材质常用的是矩阵、Fog、Color、Screen Size 和 Game Time。

## 自定义 Sampler 与 Uniform

不在上述列表的参数会由 Inspector 管理：

```json
"samplers": [
  { "name": "NoiseTexture" }
],
"uniforms": [
  { "name": "NoiseScale", "type": "float", "count": 1, "values": [4] },
  { "name": "EmissionColor", "type": "float", "count": 4, "values": [1, 0.4, 0.1, 1] }
]
```

`NoiseTexture` 会成为纹理选择项；`NoiseScale` 是数字；`EmissionColor` 因名称含 `emission`，会成为 HDR 颜色控件。自定义值会复制到同一材质的所有 Renderer Define Variant，并随 FX 保存。

如果需要读取粒子生命周期、速度或 Java 注入的数据，不应伪造新的内置 uniform。Shader Graph 使用 `PhotonData`/`PhotonCustomData` Accessor；Custom Shader Material 使用追加的 Instance Attribute。两条路径及其限制见 [Additional GPU Data](./additional-gpu-data.md)。
