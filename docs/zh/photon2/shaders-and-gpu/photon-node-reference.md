# Photon Shader 节点参考

<VersionBadge version="2.2.2" label="节点 Description" icon="tag" />

![真实 Graph 中使用的 Photon Particle Data 节点](/assets/photon2/graph-particle-shader.webp)

*Photon 节点把 Runtime Particle Stream、Camera Data、Scene Texture 与坐标变换引入 Graph。*

Photon 节点将通用 Graph Compiler 与粒子 Instance、场景 Buffer 和全屏 Pass 连接起来。

## 粒子 Graph 输入

| 节点 | 输出 | Graph/Stage 行为 |
| --- | --- | --- |
| Particle Data | position、color、litColor、light、uv、normal | Particle/Function Graph；两个 Stage 都可用 |
| Additional Data | 所选 Scalar 或 `vec3` Channel | Vertex 读取并自动 Varying；不支持时为 0 |
| Custom Data | 所选 `vec4` Stream | Vertex 读取并自动 Varying；Preview 中为 0 |
| Viewport | Viewport Size 与屏幕信息 | 屏幕相关计算 |
| Depth Fade | 交界淡出 | Fragment；需要 Scene Depth |
| Dynamic Light | `light`（`vec3`） | 仅 Fragment；预览中和动态光照关闭时为 0 |
| World to Screen UV | World Position 对应的 Screen UV | 坐标转换 |
| Screen to World | 重建的 World Position | Fragment；需要 Depth/Camera Matrix |

**Particle Data.position** 是插值后的相机相对世界位置；**color** 是编写/运行时粒子颜色，未经光照；**litColor** 是 color × 光照贴图，采样方式与方块相同（在亮度级之间过滤）。<VersionBadge version="2.2.8" label="自" icon="tag" /> **light** 是粒子处的光照贴图，读取方式与原版粒子相同：color × light 恰好等于原版粒子的光照。Trail UV 通常使用长度轴，不是 Sprite Frame 的含义。

自 2.2.8 起，Particle Emitter 不开 GPU Instancing 也能读取 Additional 与 Custom Data。Trail、Beam 和 AraTrail 仍需要 Instancing，见 [Additional GPU Data](./additional-gpu-data.md)。

## Dynamic Light

<VersionBadge version="2.2.8" label="自" icon="tag" />

**Dynamic Light**（中文界面为“动态光源”，位于 Photon 场景分组）以 `light`（`vec3`）返回 Photon [动态光源](../dynamic-lights/index.md)照到当前片元的光。它接受可选的世界空间 `normal`（公告板不要连接）和 0 到 1 的 `wrap`。它只能用于 Fragment，可用于 Particle Graph 和 Function Graph。端口、饱和方式和典型用法见 [Dynamic Light 节点](../dynamic-lights/lit-particles-and-shaders.md#dynamic-light-node)。

## Additional Data Channel

节点下拉列表直接从 `PhotonGpuChannels` Registry 生成。选择 Channel 时，编译器也会标记它为必需数据；Photon 会自动上传，不要求 Inspector Toggle。各字段含义与兼容性见 [Additional GPU Data](./additional-gpu-data.md)。

## Fullscreen Graph 节点

| 节点 | 用途 |
| --- | --- |
| Fullscreen Position | 全屏顶点位置与 UV 基础 |
| Fullscreen Output | 最终处理后的 Color/Alpha |
| Texel Size | `1 / renderTargetSize`，用于邻近像素采样 |
| Scene Color/Texture Input | 当前 Graph 输入或命名 Render Graph Texture |
| Scene Depth | 景深、轮廓与世界坐标重建 |

Fullscreen 专用节点不能放入粒子 Shader Graph；Particle Data 在 Fullscreen Graph 中也没有意义。

## 屏幕空间准确性

- Photon 节点会处理 UV 原点和 Depth 约定，不要手写固定翻转。
- 使用 `Texel Size` 采样邻近像素，不要写死 `1/1920`。
- 除非节点明确说明已线性化，否则 Depth 是非线性的。
- Iris 下 Scene/Depth Buffer 是否可用取决于 Pipeline；必须测试缺失 Buffer 时的安全输出。

::: tip
连线前先选中节点并打开 Description Panel。自 2.2.2 起，Photon 节点会在编辑器内说明端口、Stage 限制、Channel 类型和对应 GLSL。
:::
