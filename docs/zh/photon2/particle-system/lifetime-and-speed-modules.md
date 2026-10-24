# Lifetime 与 Speed 模块

![组合 Color、Size 与 Shader Motion 的 shield 项目](/assets/photon2/editor-shield-overview.webp)

*Lifetime 与 Speed 模块通常组合使用；shield 由多层 Emitter 构成，尺寸、颜色与运动会一起变化。*

Lifetime 模块使用归一化粒子 age 采样。Speed 模块先通过配置范围重映射当前速度。它们会与 Start Value 相乘或相加，而不是直接替换完整粒子状态。

## 模块参考

| 模块 | 输入 | 影响 |
| --- | --- | --- |
| Color over Lifetime | 归一化 age | 使用 Gradient 或 Color Function 乘到粒子颜色/alpha。 |
| Size over Lifetime | 归一化 age | 缩放 X/Y/Z Size。 |
| Rotation over Lifetime | 归一化 age | 绕 Space 选定的坐标轴添加 roll、pitch、yaw。 |
| Velocity over Lifetime | 归一化 age | 添加 linear/orbital/radial velocity 和 speed modification。 |
| Force over Lifetime | 归一化 age | 把 acceleration 积分到 velocity。 |
| Color by Speed | 重映射速度 | 根据移动速度乘到颜色。 |
| Size by Speed | 重映射速度 | 根据速度缩放 Size。 |
| Rotation by Speed | 重映射速度 | 根据速度添加 Rotation。 |
| Lifetime by Emitter Speed | Emitter speed | 调整生成时分配的 Lifetime。 |
| 固定光照（Fixed Light） | 归一化 age | 设置原版天空光和方块光数值。见 [固定光照](./physics-noise-lighting-uv.md#fixed-light)。 |
| 粒子发光（Light Emission） | 归一化 age | 让一部分粒子成为跟随它们、并随它们淡出的动态光源。见 [粒子发光](../dynamic-lights/lit-particles-and-shaders.md#light-emission)。 |

<VersionBadge version="2.2.8" label="自" icon="tag" /> 粒子发光（Light Emission）。

## Enable 也是 Runtime Value

<VersionBadge version="2.2.0" label="可动画模块 Enable 自" icon="tag" />

Toggle Module 的 enable 状态会暴露到 Emitter Runtime。因此 Timeline 可以开关模块，而不重写编辑器 Config。

## Speed Range

By Speed 模块把配置的最小和最大速度映射到 `0..1` 后再采样 Function。范围应当接近真实 Particle Velocity；如果范围远高于实际速度，Function 会一直停留在第一段。

## Value Space

产生向量的模块可能提供 `ValueSpace` 字段，用来选择数值所在的坐标轴：`Local`、`World` 或 `Custom`。它不会改变 Emitter 的 Particle Simulation Space。

<VersionBadge version="2.2.8" label="自" icon="tag" />

选择 `Custom` 后会出现 **自定义空间**（Custom Space）选择器。从层级面板把一个对象拖进去，数值就使用该对象当前的坐标轴。未设置或对象被删除时，`Custom` 使用世界坐标轴。

| 模块 | 字段 | 默认值 | `Local` | `World` 与 `Custom` |
| --- | --- | --- | --- | --- |
| 生命周期内受力（Force Over Lifetime） | 模拟空间（Simulation Space） | `Local` | Emitter 的坐标轴。 | 世界坐标轴，或对象的坐标轴。 |
| 生命周期内速度（Velocity Over Lifetime） | 坐标系（Space） | `Local` | Emitter 的坐标轴。 | 世界坐标轴，或对象的坐标轴。使用 `Custom` 时，Orbital 和 Radial 的中心点移到该对象的原点。 |
| 生命周期内旋转（Rotation Over Lifetime） | 坐标系（Space，2.2.8 新增） | `Local` | 粒子自身的坐标轴，与 2.2.8 之前一致。 | 绕世界坐标轴或对象的坐标轴旋转。只对 Model、Horizontal、Vertical 和 None 渲染模式生效。 |
| AraTrail 物理（Physics） | 重力坐标系（Gravity Space，2.2.8 新增） | `World` | Emitter 的坐标轴。 | 世界坐标轴，或对象的坐标轴。 |

- 使用 Billboard 类渲染模式时，生命周期内旋转的坐标系请保持 `Local`。
- 2.2.8 之前保存的 AraTrail 文件会根据 Trail 的空间映射重力坐标系，因此外观不变。
- 子发射器的继承旋转（Inherit Rotation）会忽略 `World` 或 `Custom` 坐标系下的生命周期内旋转。

## 模块组合

Start Color × Color over Lifetime × Color by Speed 得到进入 Material 逻辑前的有效粒子颜色。Size 使用类似方式；Rotation 和 Motion 模块累加各自贡献。

调试时：

1. 把 Start Value 设为简单常量。
2. 只开启一个模块。
3. 使用从零到一的清晰 Linear Curve。
4. 确认第一个模块输入范围后，再加入第二个模块。
