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

## Sub Emitter Event {#sub-emitter-events}

| Event | 触发时机 |
| --- | --- |
| Birth | Parent Particle 创建时。 |
| Death | Parent Particle 生命周期结束，或被碰撞规则移除时。碰撞导致的 Death 带有接触点。 |
| Collision | Parent Particle 与实心表面发生一次新撞击时。静止贴在表面上不会重复触发。 |
| FirstCollision | Parent Particle 第一次撞击时。 |
| Tick | 按配置的 Tick Interval 重复。 |
| TriggerEnter | Parent Particle 进入触发器碰撞体，或进入触发器模式下的实体时。 |
| TriggerExit | Parent Particle 离开触发器时。 |

<VersionBadge version="2.2.9" label="自" icon="tag" /> TriggerEnter 与 TriggerExit。

<VersionBadge version="2.2.9" label="Changed" icon="tag" /> Collision 每次新撞击只触发一次。2.2.9 之前，粒子持续被挡住时可能每 tick 都触发一次。

哪些撞击和碰撞死亡会被报告，取决于发射器的 [碰撞事件选项](./collision.md#events)（最小冲击速度、去重）。

每个条目包含目标 Emitter 引用、Event、Probability、Tick Interval，以及 Color、Size、Rotation、Lifetime 和 Duration 的继承开关。条目还为碰撞、触发器和 Death 事件提供接触相关选项：

<VersionBadge version="2.2.9" label="自" icon="tag" />

| 设置 | 默认值 | 含义 |
| --- | --- | --- |
| 在接触点生成（Spawn At Contact） | 新条目开启 | 在粒子接触的位置生成，而不是在粒子中心。2.2.9 之前保存的条目仍在中心生成。 |
| 对齐法线（Align To Normal） | 关 | 旋转生成的效果，使其 +Y 沿表面法线。 |
| 表面（Surface） | `Any` | 只在接触 `Blocks`、`Fluids`、`Entities` 或 `Colliders` 时触发。没有接触点的 Death 只能通过 `Any`。Birth 和 Tick 忽略此选项。 |
| 表面方块（Surface Blocks） | 空 | 配合 `Blocks` 或 `Fluids` 使用：只限这些方块，填写 id 或 `#tag`。为空表示任意方块。 |

接触如何转换为事件，见 [粒子碰撞](./collision.md#events-and-sub-emitters)。

## 查找与引用

Sub Emitter 引用同一 FX Runtime 中的另一个 Emitter。目标应使用清晰且唯一的名称，并放在合理的层级位置。Photon 会解析并缓存目标查找，也支持大型 Hierarchy。

## 避免递归爆炸

Emitter 生成自己，或两个 Emitter 互相生成，会导致数量无限增长。Probability 和 Interval 不能让意外循环变安全。使用无环链，并设置保守的 Max Particle Count。

::: warning Parallel Update
Worker Update 中产生的 Sub Emitter 请求会排队，并由所属 Emitter 安全应用。自定义代码不能从 Worker Thread 直接修改另一个 Emitter 的 Particle Collection。
:::
