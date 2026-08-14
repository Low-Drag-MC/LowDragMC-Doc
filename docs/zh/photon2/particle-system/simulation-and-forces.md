# Simulation、Motion 与 Force Field

<VersionBadge version="2.2.0" label="Simulation Space 与 Force Field 自" icon="tag" />

![展示协同粒子运动的 tornado 项目](/assets/photon2/editor-tornado-scene.webp)

*Simulation Space 与 Force 模块决定这段运动跟随父节点，还是保留在 World Space。*

Simulation Space 决定使用哪个 Transform basis 保存粒子 position 和 velocity。Motion 模块随后在每个 tick 更新这些状态。

## Simulation Space

| Space | 行为 |
| --- | --- |
| `LOCAL` | 已生成粒子继续跟随 Emitter 层级的 translation、rotation 和 scale。 |
| `WORLD` | 生成后保存在 World Space；移动 Emitter 只影响新粒子。 |
| `CUSTOM` | 相对引用的另一个 FX Object Transform 保存粒子。 |

附着在实体上的 Aura 或武器效果使用 Local；移动源留下的 Smoke 使用 World；多个 Emitter 需要共享独立动画空间时使用 Custom。

## Velocity over Lifetime

Velocity over Lifetime 提供 linear、orbital、offset、radial 和 speed modifier Function。`ValueSpace` 决定配置向量以哪个坐标空间解释，再加入粒子运动。

<VersionBadge version="2.2.1" label="Velocity ValueSpace 自" icon="tag" />

## Force over Lifetime

Force 会随时间改变 Velocity，而不是直接设置位移。它适合重力式加速度、风或可控弯曲。变化中的 Force Curve 会沿粒子生命周期积分。

## Inherit Velocity

Inherit Velocity 根据 Mode 与 Multiplier，把 Emitter 运动传给新粒子或存活粒子。它与 Local Space 不同：World-space 粒子可以继承发射速度，但之后不继续跟随 Emitter。

## Force Field

`ForceFieldObject` 是带 Transform 和 `ForceFieldConfig` 的 FX Object，支持：

- directional force；
- 围绕 Field Transform 的 attraction/gravity；
- drag；
- vortex motion。

在 Particle Emitter 上开启 **External Forces** 并设置 multiplier。Influence filter/list 可以包含或排除命名 Field，因此同一 FX 层级中可以有多个 Force 系统。

## 计算顺序

Start Speed 和 Inherit Velocity 建立初始运动；每 tick 的 Velocity、Force、Physics、External Field 和 Noise 再通过各自 Runtime 模块产生影响。除非明确需要叠加，否则不要让多个模块重复完成同一件事。

::: warning Transform Scale
非均匀父级 Scale 会改变向量 basis。Custom Space 和 Orbital Motion 必须使用最终层级 Scale 测试，不能只在 `1 1 1` 下检查。
:::
