# 手写 Fullscreen Shader

<VersionBadge version="2.2.0" label="自" icon="tag" />

![真实 Post Effect Render Graph](/assets/photon2/graph-render-effect.webp)

手写 Fullscreen Shader 是一个由 Render Graph Pass 调用的 Minecraft Core Shader。适合移植已有 Post FX、编写复杂循环，或实现 Fullscreen Shader Graph 暂时没有的算法。它与 Graph Pass 使用相同的全屏 Quad、HDR Target Pool、Priority、Mask 和混合系统。

## 最小资源结构

通常不需要自己写 Vertex Shader。Photon 随 LDLib2 提供了 `ldlib2:fast_blit`：输入全屏 `Position`，输出归一化的 `texCoord`。

```text
assets/wiki/shaders/core/postfx/wave_tint.json
assets/wiki/shaders/core/postfx/wave_tint.fsh
```

Render Graph 中填写的 Shader ID 是 `wiki:postfx/wave_tint`。

## 完整例子

这个 Pass 从 `DiffuseSampler` 读取上一个画面，以像素为单位做横向波动，再乘一个可调颜色。

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

`ScreenSize` 在这个最小算法中没有参与计算，保留它是为了展示 Engine Uniform 的声明方式。无用 uniform 可能被 GLSL Compiler 优化掉，Photon 会安全地跳过不存在的 Location。

## 接入 Render Graph

1. 创建或打开一个 Render Graph。
2. 添加 **Pass** 节点。
3. 将 **Pass Source Type** 改为 **Custom Shader**。
4. Shader 填写 `wiki:postfx/wave_tint`。
5. Pass 会从 JSON 反射出 `DiffuseSampler`、`Strength` 和 `TintColor` Port。
6. 将 **Scene Color** 或上一个 Pass 的输出连接到 `DiffuseSampler`。
7. 将 Pass 输出连接到 **Effect Output**。

`Strength` 和 `TintColor` 可以直接填写常量，也可以连接 Render Graph Blackboard 参数，供 Timeline 或 Java 覆盖。要让请求 Weight 驱动某个 uniform，可将 **Effect Weight** 连接到对应 Value Port；手写 Shader 没有强制名为 `Weight` 的内置 uniform。

修改 JSON 的 sampler/uniform 接口后，执行 Resource Reload，并在 Pass 上重新选择一次 Shader，让节点重建 Port。现有源码损坏时编辑器会暂时保留最后一次有效 Port，但 Render Graph 不会成功编译。

## Sampler：每一个都是 Texture Port

JSON 的 `samplers` 数组决定 Pass 的纹理输入。名称没有固定语义：

```json
"samplers": [
  { "name": "SceneColor" },
  { "name": "SceneDepth" },
  { "name": "NoiseTexture" }
]
```

这会生成三个必连 Port。可以分别连接：

| Render Graph 来源 | 常见用途 |
| --- | --- |
| Scene Color | 原始或前序效果后的 HDR 颜色 |
| Scene Depth | Depth Fade、DOF、重建位置 |
| Custom Mask | 按 Mask Group 限制区域 |
| Custom Depth | Photon 标记对象的深度 |
| 更早的 Pass Output | Blur、Bloom、Composite 等多 Pass 链 |
| Texture Input | LUT、Noise、Ramp 或外部参数纹理 |

::: warning 与粒子 Custom Shader 不同
Post FX 不使用 `SamplerSceneColor`、`SamplerSceneDepth` 这类自动绑定名称。Sampler 的数据来源完全由 Render Graph 连线决定；漏连任意 sampler 都会导致编译失败。
:::

### `<Sampler>_TexelSize`

对 sampler `DiffuseSampler` 声明同名后缀 uniform：

```glsl
uniform vec4 DiffuseSampler_TexelSize;
```

Photon 会写入 `(width, height, 1/width, 1/height)`。它不会成为 Value Port，适合 Blur、Outline 和任意像素偏移。

Scene、Depth、Mask 和 Pass Output 的尺寸已知，可以正确更新。Texture Input 使用固定 Asset 或 Runtime 参数时，Executor 不一定知道原图尺寸，此时保留 JSON 默认值；需要尺寸的算法应把尺寸作为独立参数传入。

## 可暴露的自定义 Uniform

`CustomShaderPass` 只把以下 JSON uniform 转成 Pass Value Port：

| JSON | Port 类型 |
| --- | --- |
| `"type": "float", "count": 1` | float |
| `"type": "float", "count": 2` | vec2 |
| `"type": "float", "count": 3` | vec3 |
| `"type": "float", "count": 4` | vec4 |

`int`、矩阵、count 超出 1–4 的声明不会成为参数 Port。JSON 的 `values` 是默认值：每次 Dispatch 先恢复默认值，再应用 Pass 常量、Blackboard 参数或 Effect Weight，避免上一帧的值泄漏到下一次执行。

颜色没有专用反射规则。需要颜色时使用 `float/count 4`，并在 Render Graph 中以 vec4 传递。

## Engine Uniform

以下名称由 Executor 管理，不会显示为 Pass Port。

| 名称 | 类型 | 内容 |
| --- | --- | --- |
| `ScreenSize` | `vec2` | 当前 Pass 输出 Target 的 `(width, height)`。半分辨率 Pass 得到半分辨率尺寸。 |
| `GameTime` | `float` | `RenderSystem.getShaderGameTime()`，一个 Minecraft 日周期为 `0..1`。 |
| `ModelViewMat` | `mat4` | 捕获该画面的相机 View/ModelView Matrix。 |
| `ProjMat` | `mat4` | 捕获该画面的 Projection Matrix。 |
| `<Sampler>_TexelSize` | `vec4` | 已知输入纹理的 `(width, height, 1/width, 1/height)`。 |

### 相机与屏幕空间 Uniform

<VersionBadge version="2.2.3" label="自" icon="tag" />

| 名称 | 类型 | 内容 |
| --- | --- | --- |
| `U_ViewPort` | `vec4` | 当前相机在 Pass Target 中的 `(x, y, width, height)`；编辑器 Scene 可能只占子区域。 |
| `kg_Time` | `float` | 与 `GameTime` 同源的秒值，`GameTime × 1200`。 |
| `kg_ViewMat` | `mat4` | 捕获的 View Matrix。 |
| `kg_IViewMat` | `mat4` | View Matrix 的逆矩阵。 |
| `kg_IModelViewMat` | `mat4` | 当前 1.21.1 相机路径下同样为逆 View Matrix。 |
| `kg_IProjMat` | `mat4` | Projection Matrix 的逆矩阵。 |
| `kg_CameraBlockPos` | `vec3` | Camera 整数方块坐标部分。 |
| `kg_CameraOffset` | `vec3` | 精度拆分偏移；绝对坐标为 `kg_CameraBlockPos - kg_CameraOffset`。 |

使用 Fragment 坐标时先按 Viewport 归一化：

```glsl
uniform vec4 U_ViewPort;

vec2 viewportUV = (gl_FragCoord.xy - U_ViewPort.xy) / U_ViewPort.zw;
```

这样同一 Shader 才能同时适配游戏全屏、Photon 编辑器子窗口和降分辨率 Pass。读取 Scene Depth 并重建位置时使用 `kg_IProjMat`、`kg_IViewMat` 和精度拆分的 Camera Position。

## 自己编写 Vertex Shader

一般直接使用 `ldlib2:fast_blit`。如果必须自定义，Pass 使用 `DefaultVertexFormat.POSITION`，最小接口为：

```glsl
#version 150

in vec3 Position;
out vec2 texCoord;

void main() {
    gl_Position = vec4(Position.xy, 0.0, 1.0);
    texCoord = Position.xy * 0.5 + 0.5;
}
```

Vertex 和 Fragment 的 varying 名称、类型必须匹配。Fullscreen Quad 已覆盖 NDC `-1..1`，不需要再乘普通世界对象的 Model Matrix。

## 缓存与排错

- Shader JSON 的接口和编译后的 `ShaderInstance` 都按 Shader ID 缓存。
- Resource Reload 会清除缓存；仅修改文件但不 Reload 不会重新解析 Port。
- 先用 `fragColor = texture(Input, texCoord)` 验证连线，再增加 Depth、Mask 和数学逻辑。
- JSON 必须是合法 JSON，不能包含注释和尾随逗号。
- Shader 加载失败、JSON 无法读取或 sampler 漏连时，查看 `latest.log` 与 Render Graph 编译错误。

完整的 Pass/Target 连接规则见 [Render Graph 与 Pass](./render-graph-and-passes.md)；不需要手写 GLSL 时使用 [Fullscreen Graph](./fullscreen-graphs-and-textures.md)。
