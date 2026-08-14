# Render Graph 与 Pass

<VersionBadge version="2.2.0" label="自" icon="tag" />

![真实 Post Effect Render Graph 与资源、预览同时打开](/assets/photon2/graph-render-effect.webp)

*Render Graph 节点声明 Pass Source、依赖、临时 Target 与最终输出。*

Render Graph 是由 Texture Resource 与全屏 Dispatch 构成的有向无环图。它描述一个可复用 Effect，而不是整个游戏 Renderer。

## 输入节点

| 输入 | 内容 |
| --- | --- |
| Scene Color | 全局 Effect 轴当前位置的 HDR Scene，包含更低 Priority 的效果 |
| Scene Depth | 捕获的 Opaque Scene Depth |
| Custom Mask | 标记的 Photon Renderer 写入 `mask group / 255`；其余为黑色 |
| Custom Depth | 标记 Renderer 的深度，底层预填 Scene Depth |
| Texture Input | 外部或命名 Texture |
| Effect Weight | 本次执行合并后的请求权重 |

## Pass Source 与动态 Port

Pass 可以运行 Fullscreen Graph 或手写 Core Shader。Texture Sampler 变为只能连线的 Texture Port；暴露的 Scalar/`vec2`/`vec3`/`vec4` Uniform 变为 Value Port。Screen Size、Time、Matrix 等 Engine Uniform 自动绑定。

手写 Pass 的文件结构、完整 GLSL 示例以及可用 Uniform/Sampler 见[手写 Fullscreen Shader](./handwritten-fullscreen-shaders.md)。

Source 暂时损坏时，编辑器会保留最后一次有效 Port 集合，因此一次失败的 Graph Reload 不会删除所有连线；Compiler 仍会报告无效 Pass。

## Target Size 与 Format

| Size Mode | 含义 |
| --- | --- |
| Screen Relative | Screen/Effect Chain 尺寸 × Scale |
| Input Relative | 更早的 Input/Resource 尺寸 × Scale |
| Absolute | 固定 Width × Height |

质量允许时，Blur/Bloom Chain 可使用半分辨率。默认 `RGBA16F` 支持 HDR；低精度格式节省显存与带宽，`R8` 适合单通道 Mask，不适合 HDR Color。

临时 Render Target 来自 Pool，只存活到编译后的本次执行不再需要它。除非外部系统明确拥有 Target，否则不要假设 Pass Output 能保留到下一帧。

## Output、Priority 与 Auto Blend

- **Priority** 决定全局轴位置。内置 Bloom 为 `0`，负值在 Bloom 前执行，正值在 Bloom 后执行；相同值按 Effect Path 稳定排序。
- **Auto Blend** 最终执行 `mix(scene, effect, Weight)`。只有 Graph 故意读取 Effect Weight 并自己混合时才关闭。

## 依赖规则

每个 Pass Input 必须来自 Input Node 或更早的 Pass。Cycle、缺必需 Texture、无 Effect Output、Source Graph 无效、资源尺寸/类型不兼容都会导致编译失败。让 Graph 保持从左到右，并按用途命名 Blackboard 参数，排错会容易很多。
