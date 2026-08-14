# Trail 与 Sub Emitter

![使用 Photon 制作的多阶段烟花效果](/assets/photon2/fx-hanabi.webp)

*Birth、Tick、Collision 与 Death 事件可以把多个 Emitter 串成图中的多阶段烟花。*

Particle Emitter 可以为每个 Particle 创建次级几何体和次级 Emitter。它们能够继承 Particle 状态，因此很强大，但也会成倍增加模拟和渲染工作。

## Particle Trail

开启 Trails 后，可以为一定比例的 Particle 附加 Trail。

| 设置 | 用途 |
| --- | --- |
| ratio | 获得 Trail 的 Particle 比例。 |
| lifetime | Trail Lifetime Function。 |
| dieWithParticles | 与所属 Particle 同时移除，或让 Trail 自然消散。 |
| sizeAffectsWidth | 把 Particle Size 乘到宽度。 |
| sizeAffectsLifetime | 把 Particle Size 乘到 Trail Lifetime。 |
| inheritParticleColor | 把 Particle Color 乘到 Trail Color。 |
| colorOverLifetime | Trail 生命周期中的颜色。 |
| trailType | 选择 Trail 实现/渲染几何体。 |

Trail 有自己的 Material/Renderer 路径。因此一个 Particle Emitter 可能把 Tile Particle 和 Trail Particle 送入不同的有效 Render Pass。

## Sub Emitter Event

| Event | 触发时机 |
| --- | --- |
| Birth | Parent Particle 创建时。 |
| Death | Parent Particle 结束时。 |
| Collision | Parent Particle 报告碰撞时。 |
| Tick | 按配置的 Tick Interval 重复。 |

每个条目包含目标 Emitter 引用、Event、Probability、Tick Interval，以及 Color、Size、Rotation、Lifetime 和 Duration 的继承开关。

## 查找与引用

Sub Emitter 引用同一 FX Runtime 中的另一个 Emitter。目标应使用清晰且唯一的名称，并放在合理的层级位置。Photon 会解析并缓存目标查找，也支持大型 Hierarchy。

## 避免递归爆炸

Emitter 生成自己，或两个 Emitter 互相生成，会导致数量无限增长。Probability 和 Interval 不能让意外循环变安全。使用无环链，并设置保守的 Max Particle Count。

::: warning Parallel Update
Worker Update 中产生的 Sub Emitter 请求会排队，并由所属 Emitter 安全应用。自定义代码不能从 Worker Thread 直接修改另一个 Emitter 的 Particle Collection。
:::
