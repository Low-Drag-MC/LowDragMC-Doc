# Trail、Beam 与 AraTrail Emitter

![Beam Emitter 预览](/assets/photon2/editor-beam-scene.webp)

![AraTrail Emitter 预览](/assets/photon2/editor-aratrail-scene.webp)

*Beam 直接连接端点；AraTrail 会积分移动中的 Segment，因此形状会随时间弯曲。*

这些 Emitter 直接渲染连接几何体，而不是生成一团互相独立的 Tile Particle。

## 对比

| Emitter | Geometry 来源 | 适合用途 |
| --- | --- | --- |
| Trail | 把移动 Emitter 采样成有序 Section | 武器 Slash、移动拖尾、Ribbon。 |
| Beam | 连接 Endpoint 或 Raycast 结果 | Laser、连接线、直线 Energy Beam。 |
| AraTrail | 模拟带 Physics 的移动 Segment Trail | Whip、电流式运动、平滑 Tail。 |

## Trail Emitter

Trail Config 包含 duration、looping、delay、time、minimum vertex distance、width over trail 和 color over trail。Flat 与 Tube Rendering 以更多 Vertex 换取体积。UV 沿有序 Trail Section 前进。

## Beam Emitter

Beam Config 包含 duration、looping、delay、width、emission rate 和 color。Raycast Mode 根据 World 确定 Endpoint；Direct Mode 使用配置的 Transform。UV Animation 和 Lighting 与其他 Emitter 共用数据模块。

## AraTrail Emitter

AraTrail 可以按总长度、总时间和每 Segment 时间控制 Thickness 与 Color。Physics 控制模拟 Chain；Minimum Distance 和 Time Interval 控制 Segment 创建。普通 Trail 直接跟随 Emitter Motion 不够时使用 AraTrail。

## Runtime Value

三种 Emitter 都有强类型 Runtime Layer：`TrailRuntime`、`BeamRuntime`、`AraTrailRuntime`。Timeline 可以动画已注册字段，Java 也可以写相同 `RuntimeValue` Slot。Renderer 与 Material Override 使用和 Particle Emitter 相同的按需 Per-instance Render Pass。

## Additional GPU Data

每个 Renderer 为支持的 Custom Channel 声明固定 GPU Record Layout。Trail、Beam 和 AraTrail Record 与 Tile Particle 不同；应使用对应 Renderer 的 Graph Node/Accessor，并阅读 [Additional GPU Data](../shaders-and-gpu/additional-gpu-data.md)。

## 如何选择

- 几何体需要精确跟随移动 Transform：Trail。
- Endpoint 比运动历史更重要：Beam。
- Trail 本身需要模拟运动：AraTrail。
- 大量独立 Particle 各自需要短 Trail：Particle Trails。
