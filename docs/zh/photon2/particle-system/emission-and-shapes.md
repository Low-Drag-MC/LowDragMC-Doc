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
| Mesh | 来自 Mesh Source 的顶点/三角形 | 从模型几何体生成。 |
| Function | 位置/方向表达式 | 程序化路径和数学体积。 |

## Arc

圆形 Shape 可以限制角度范围，并选择如何遍历范围。Arc Mode 可以随机分布或按顺序推进；loop、ping-pong、spread 和 speed 决定 Emission 如何前进。

## Radius Thickness

Thickness 为 `0` 时只在外表面生成。更大的值允许点向中心分布。需要清晰轮廓时使用 shell，需要云雾或爆炸体积时填满内部。

## Mesh Source

<VersionBadge version="2.2.0" label="通用 Mesh Source 自" icon="tag" />

Mesh Shape 与 Model 渲染使用同一套 Source：内置 primitive、OBJ、Minecraft JSON Model 或可复用 Mesh Resource。不需要分别维护 Shape Mesh 和 Renderer Mesh。

## Function Shape

Function Shape 使用表达式计算 position 和 direction。表达式应保持确定性，并防止除零或无效开方；NaN 生成位置无法安全渲染或碰撞。
