# Fullscreen Graph 与自定义纹理

<VersionBadge version="2.2.0" label="自" icon="tag" />

![Photon 浏览器中的 Fullscreen Graph 资源](/assets/photon2/resource-fullscreen-graph.webp)

![正在编辑的 Fullscreen Graph](/assets/photon2/graph-fullscreen.webp)

*资源可以暴露 Sampler 参数，用于 LUT、Noise、Ramp 或 Mod 提供的 Texture。*

Fullscreen Graph 与粒子 Shader Graph 使用同一套类型节点，但几何是 Fullscreen Quad，输入由 Render Graph 的 Pass Port 提供。

## 坐标

- **Fullscreen Position** 提供全屏顶点基础与归一化 UV。
- **Texel Size** 返回 Target Size 的倒数，Blur、Outline、Chromatic Aberration 的 Pixel Offset 应乘它。
- Scene/Depth 重建节点使用当前 Pass 捕获的 Camera State。

不要写死屏幕分辨率。Preview、窗口缩放、UI Scale 和半分辨率 Pass 都会改变真实 Target Size。

## 暴露输入

| Graph Variable | Pass Port/用途 |
| --- | --- |
| Sampler/Texture | 连接 Scene Color、Depth 派生纹理、前一 Pass 或 Texture Input |
| float | radius、strength、threshold、time scale |
| vec2 | direction、center、distortion scale |
| vec3/vec4/color | tint、channel weight、outline color |

`Weight` 由 Engine 管理，不是普通 Pass Port。Shader 需要自行参与 Blend 时使用 Effect Weight Node。

## 外部纹理

LUT、Blue Noise、Ramp、Lens Dirt 可通过 Texture Input 进入。将其放入项目/FX Pack 命名空间，并写清期望的 Filter/Wrap。LUT 的尺寸与打包方式属于 Effect Contract，换成任意图片不会得到有意义结果。

## Graph Pass 与 Core Shader Pass

| Fullscreen Graph | 手写 Core Shader |
| --- | --- |
| 可视化编辑、类型连线 | 直接控制 GLSL |
| 暴露 Variable 决定 Port | 从 JSON Sampler/Uniform 反射 Port |
| Compiler 生成 Stage Plumbing | 作者维护 JSON/VSH/FSH 兼容性 |
| 更容易重构资源 | 更容易移植已有 Shader |

二者运行在相同 Fullscreen Quad 与 Target Pool 上，也可以在同一个 Render Graph 中混用。

手写方案的 JSON 反射规则、Sampler Port 和 Engine Uniform 详见[手写 Fullscreen Shader](./handwritten-fullscreen-shaders.md)。

## 常见多 Pass 结构

```text
Blur: Scene -> Horizontal Half-res -> Vertical Half-res -> Output
Bloom-like: Scene -> Bright -> Downsample/Blur Chain -> Add-mix Scene
Outline: Scene Depth -> Edge; Scene Color + Edge -> Composite -> Output
LUT: Scene -> Color Lookup -> Output
```
