# Physics、Noise、Lighting 与 UV

![最大化 Photon 编辑器中的 UV Animation 项目](/assets/photon2/editor-uv-animation-overview.webp)

*UV Animation 测试项目实时预览 Tile Frame，同时保留 Particle 与 Renderer 配置供对照。*

这些模块作用在 Particle 的不同阶段：Physics 处理 World 交互，Noise 扰动模拟状态，Lighting 修改 Packed Light，UV Animation 选择 Texture Frame。

## Physics 与 Collision

粒子需要与 Minecraft Collision Shape 碰撞时开启 Physics。核心设置包括 gravity、collision response、bounce 和 friction。Collision 需要 CPU 计算并访问 World，只在接触确实可见时使用。

- **Bounce** 保留沿碰撞法线的 Velocity。
- **Friction** 减少接触后的切向运动。
- 速度过大时可能在两个 tick 之间穿过薄几何体，应降低速度或修改效果设计。
- 避免会产生 NaN Position 或 Velocity 的无效 Curve。

## Noise

Noise 可以扰动 position、rotation 和 size。`frequency` 控制场变化速度；Quality 用更多计算换取更平滑的变化；Remap 把原始 Noise 转换到需要的输出范围。

低频 Noise 适合 Smoke 漂移，高频 Noise 适合 Spark 或电流抖动。同时在 Position 和类似 Velocity 的模块中使用强 Noise，会让运动难以预测。

## Lighting

Light over Lifetime 提供 Sky Light 和 Block Light Function。关闭时，支持的 Particle 使用 World Packed Light。固定亮度适合魔法或自发光外观；真正的 HDR Emission 应放在 Material/Shader 中。

<figure>
<img src="/assets/photon2/LightMap.png" alt="Photon Material 使用的 Light Map 数据">
<figcaption>Light Value 和 Material Emission 解决不同问题：Light 影响 Minecraft Shading，HDR Emission 用于 Bloom。</figcaption>
</figure>

## UV Animation

UV Animation 把 Texture 划分成 Tile，并随时间选择 Frame。

| 设置 | 含义 |
| --- | --- |
| tiles | Sprite Sheet 的列数和行数。 |
| animation | 整张 Sheet 或配置的 Animation Mode。 |
| frameOverTime | 选择 Frame 进度的 Function。 |
| startFrame | 每个 Particle 的起始 Frame Offset。 |
| cycle | 采样区间内遍历 Sheet 的次数。 |

硬边 Sprite Sheet 应使用 nearest/pixel-art Material 设置。Tile 数错误会采样相邻 Sprite 或空白区域。

## 性能检查

- Collision 和高 Quality Noise 都是每 Particle CPU 成本。
- Lighting 可能查询已加载 World Position，大型效果不要无限扩张。
- UV Animation 本身便宜，但大型透明 Texture 仍有 Fill Rate 成本。
- 使用真实 Max Particle Count 测试，不要只看编辑器开始几秒。
