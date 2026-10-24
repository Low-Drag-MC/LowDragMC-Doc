# Physics、Noise、Lighting 与 UV

![最大化 Photon 编辑器中的 UV Animation 项目](/assets/photon2/editor-uv-animation-overview.webp)

*UV Animation 测试项目实时预览 Tile Frame，同时保留 Particle 与 Renderer 配置供对照。*

这些模块作用在 Particle 的不同阶段：Physics 处理重力、摩擦和碰撞，Noise 扰动模拟状态，固定光照（Fixed Light）设置原版 Lightmap 值，UV Animation 选择 Texture Frame。

## Physics 与 Collision

<VersionBadge version="2.2.9" label="Changed" icon="tag" />

**物理**（Physics）模块提供重力和摩擦，并通过 **启用碰撞**（Has Collision）开启碰撞。从 2.2.9 起，粒子可以与方块碰撞形状、流体表面、实体和碰撞体对象碰撞；碰撞采用扫掠检测，高速粒子不会再穿过薄墙。

- **反弹率**（Bounce Rate）是恢复系数：反弹时保留的撞向表面速度的比例。
- **反弹几率**（Bounce Chance）在每次撞击时重新判定；没有反弹的粒子会沿表面滑动。
- **碰撞摩擦**（Collided Friction）只减慢速度的滑动分量，并且只在粒子贴着表面时生效。
- 避免会产生 NaN Position 或 Velocity 的无效 Curve。

全部碰撞选项、碰撞体对象、碰撞事件、性能以及相对 2.2.8 的行为变化，见 [粒子碰撞](./collision.md)。

## Noise

Noise 可以扰动 position、rotation 和 size。`frequency` 控制场变化速度；Quality 用更多计算换取更平滑的变化；Remap 把原始 Noise 转换到需要的输出范围。

低频 Noise 适合 Smoke 漂移，高频 Noise 适合 Spark 或电流抖动。同时在 Position 和类似 Velocity 的模块中使用强 Noise，会让运动难以预测。

## 固定光照 {#fixed-light}

**固定光照**（Fixed Light）模块设置每个 Particle 的原版 Lightmap 值：随粒子生命周期变化的 **天空光**（Sky Light）和 **方块光**（Block Light）Function（0–15）。该模块默认开启且为 15/15，因此粒子以全亮显示。关闭后，粒子使用所在位置的 World 光照。固定亮度适合魔法或自发光外观；真正的 HDR Emission 应放在 Material/Shader 中。

固定光照只修改原版 Lightmap。要让粒子发出光照，使用 [粒子发光](../dynamic-lights/lit-particles-and-shaders.md#light-emission)（Light Emission）；要让粒子被附近的动态光源照亮，在 Material 上开启 [受动态光照](../dynamic-lights/lit-particles-and-shaders.md#lit-by-dynamic-lights)（Lit by Dynamic Lights）。整个系统见 [动态光照](../dynamic-lights/index.md)。

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

- Collision 和高 Quality Noise 都是每 Particle CPU 成本。只开启需要的碰撞目标；开启并行更新后，碰撞发射器可以在工作线程上运行（见 [粒子碰撞](./collision.md#performance-and-debugging)）。
- 使用 World 光照（关闭固定光照）时会查询已加载的 World Position，大型效果不要无限扩张。
- UV Animation 本身便宜，但大型透明 Texture 仍有 Fill Rate 成本。
- 使用真实 Max Particle Count 测试，不要只看编辑器开始几秒。
