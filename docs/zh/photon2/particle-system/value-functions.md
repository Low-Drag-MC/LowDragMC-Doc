# Curve、Gradient 与 Value Function

![Photon 资源浏览器中的 Curve 资源](/assets/photon2/resource-curve.webp)

![Photon 资源浏览器中的 Gradient 资源](/assets/photon2/resource-gradient.webp)

*Curve 与 Gradient 可以先做成项目资源，再被 Emitter、Timeline Clip 与 Shader 复用。*

Photon 的许多设置使用 `NumberFunction`，而不是固定数字。消费者会提供 time 输入：它可能是归一化粒子生命周期、Emitter 时间、速度、Trail 位置或页面中说明的其他来源。

<figure>
<img src="/assets/photon2/CurveAndGradient.png" alt="Photon 的 Curve 和 Gradient 编辑器">
<figcaption>Curve 控制标量或向量，Gradient 控制颜色和 alpha。</figcaption>
</figure>

## 标量 Function

| 类型 | 结果 |
| --- | --- |
| Constant | 始终返回一个值。 |
| Random Constant | 使用 Particle/Emitter RNG 在范围内取值。 |
| Curve | 使用输入 time 计算可编辑曲线。 |
| Random Curve | 使用稳定随机因子在两条曲线之间取值。 |

`NumberFunction3` 组合三条 Function，用于 size、rotation、force 和 velocity 等 X/Y/Z 值。三个分量可以独立编辑。

## Color Function

| 类型 | 结果 |
| --- | --- |
| Color | 一个 RGBA 颜色。 |
| Random Color | 在配置颜色之间随机取值。 |
| Gradient | 随 time 插值 color stop 与 alpha stop。 |
| Random Gradient | 使用稳定随机值在两条 Gradient 之间混合。 |
| HDR 变体 | 保留普通 `0..1` 显示范围以上的值，用于 bloom/emission。 |

<VersionBadge version="2.2.3" label="HDR Color Function 自" icon="tag" />

只有支持 HDR Color 数据的消费者才能接收 HDR Function。Configurator 会拒绝不兼容的拖放，而不是静默截断数据。

## Time 输入

同一条 Curve 在不同字段中含义可能不同：

- Over Lifetime 模块使用归一化粒子 age。
- By Speed 模块先通过配置范围重映射当前速度。
- Emission 和 Start Value 使用设置定义的 Emitter/Particle 创建时间。
- Trail 字段可能使用归一化长度、总 Trail 时间或 Segment 时间。
- Additional GPU Data 可以选择 Time Source。

在模块之间复制 Curve 前，先确认字段说明。

## Resource 与内联值

Curve、Gradient 和 Color 可以直接内联在配置里，也可以保存为 Resource。多个 Emitter/Material 需要共用同一值时使用 Resource。字段支持资源引用时，拖入 Resource 会保持引用；复制内联值会产生独立数据。

## Timeline 值

Animation Property 可以保存 Keyframe、Curve Clip、Gradient Clip 或 Expression Clip。Timeline 在更新时把采样后的具体值写入目标 `RuntimeValue`，不会修改原始 Curve Resource。
