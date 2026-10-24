# Emission 与 Shape

![Photon Scene 中预览的水粒子 Emitter](/assets/photon2/editor-water-scene.webp)

*Shape、发射方向与 Emission Rate 共同决定 Scene 中看到的粒子分布。*

Emission 决定**什么时候**生成粒子，Shape 决定粒子**从哪里**生成，以及哪个方向提供初始速度。

## Emission 来源

| 来源 | 行为 |
| --- | --- |
| Emission Rate | 根据 Emitter 时间连续生成。 |
| Distance Rate | 随 Emitter 移动距离生成，适合脚步和移动轨迹。 |
| Burst | 在循环内指定时间生成配置数量。 |

Burst 包含 `time`、`count`、`cycles`、`interval` 和 `probability`。Emitter 会跟踪每个 Burst cycle，避免循环时错误重放旧状态。

## Shape Transform

Shape 模块在 Emitter Transform 内还有自己的 position、rotation 和 scale。视觉生成体积需要不同 pivot 时，不必额外增加 Empty。

## 内置 Shape

| Shape | 重要设置 | 常见用途 |
| --- | --- | --- |
| Dot | 无 | 单一原点。 |
| Box | 尺寸与 Emit From 模式 | 体积、平面或方盒表面。 |
| Circle | radius、thickness、arc | 环形和径向喷射。 |
| Cone | angle、radius、thickness、arc | 火焰、喷射和方向扩散。 |
| Cylinder | radius、thickness、arc | 柱体和圆形墙。 |
| Sphere | radius、thickness、arc | 爆炸、Aura 和球壳。 |
| Mesh | Mesh Source 的顶点、边或三角形 | 从模型几何体生成。 |
| Function | 位置/方向表达式 | 程序化路径和数学体积。 |

## Arc

圆形 Shape 可以限制角度范围，并选择如何遍历范围。Arc Mode 可以随机分布或按顺序推进；loop、ping-pong、spread 和 speed 决定 Emission 如何前进。

## Radius Thickness

Thickness 为 `0` 时只在外表面生成。更大的值允许点向中心分布。需要清晰轮廓时使用 shell，需要云雾或爆炸体积时填满内部。

## Mesh Source {#mesh-sources}

<VersionBadge version="2.2.0" label="通用 Mesh Source 自" icon="tag" />

Mesh Shape 与 Model 渲染使用同一套 Source：内置 primitive、OBJ 模型、Json 模型、glTF 模型、Animated glTF Model，或指向可复用 Mesh 资源的网格引用。不需要分别维护 Shape Mesh 和 Renderer Mesh。完整列表见 [Mesh Source](./rendering-materials-and-meshes.md#mesh-sources)。

<VersionBadge version="2.2.5" label="glTF 模型 自" icon="tag" /> <VersionBadge version="2.2.7" label="Animated glTF Model 自" icon="tag" />

glTF 模型的用法与其他 Mesh 相同。使用 Animated glTF Model 时，Shape 会跟随动画：粒子总是在当前共享时钟的姿势上生成，即使模型渲染时开启了 Per-Particle Phase 也是如此。采样权重（边长与三角形面积）仍取自静止姿势，所以被拉长的肢体只分到未拉长时的份额。见 [glTF 模型](./gltf-models.md#emission-shapes)。

## 贴地（Ground Snap） {#ground-snap}

<VersionBadge version="2.2.9" label="自" icon="tag" />

从 2.2.9 起，贴地功能会把每个发射点投到下方的地形上。悬在空中的 Emitter 要让尘土、碎屑或草丛从地面生成时就可以用它。在 Particle Emitter 的 **形状** 模块中打开 **贴地** 即可。

每个新粒子会从发射点沿直线寻找地面，并移动到碰到的第一个表面上。

| 选项 | 默认值 | 描述 |
| --- | --- | --- |
| 方向 | `WorldDown` | `WorldDown`：竖直向下。`EmitterDown`：沿 Emitter 的 -Y，用于墙面和天花板上的 Emitter。 |
| 最大距离 | `8`（0–256） | 在发射点下方多远范围内寻找地面，单位为格。 |
| 向上搜索 | `1`（0–64） | 从发射点上方这么远处开始寻找，略低于地表的点也能找到地面。 |
| 偏移 | `0`（-16–16） | 沿表面法线离开表面的距离。 |
| 包含流体 | 关 | 也落在流体表面上。 |
| 对齐法线 | 关 | 旋转初速度，使形状原本朝上的方向沿表面法线离开表面。当搜索落到的面与搜索方向不垂直时才有作用，例如倾斜的 Emitter 使用 `EmitterDown` 时。 |
| 无地面时丢弃 | 关 | 在范围内找不到地面的粒子直接移除，而不是留在形状给出的位置。 |

- 搜索检测的是方块的碰撞箱，所以台阶和楼梯都算数，而没有碰撞的方块（草、花）会被穿过。Collider 对象不参与检测。
- 如果搜索起点位于方块内部（低矮的天花板下、树冠里），会改从发射点本身重新搜索。
- 贴地只在生成时执行一次。若要让粒子之后一直留在地面上，请使用[碰撞](./collision.md)。

## Function Shape

Function Shape 使用表达式计算 position 和 direction。表达式应保持确定性，并防止除零或无效开方；NaN 生成位置无法安全渲染或碰撞。
