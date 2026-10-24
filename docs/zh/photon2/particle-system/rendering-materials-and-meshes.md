# Rendering、Material、Mesh 与 Model

![Photon Renderer 可用的 Material 资源](/assets/photon2/resource-material.webp)

![Model Particle 可用的 Mesh 资源](/assets/photon2/resource-mesh.webp)

*Renderer 会把其中一个 Material 与 Tile 几何、Mesh 或 Model Source 组合起来。*

Simulation 产生 Particle 状态。Renderer 设置选择几何体和 Draw Order；Material 选择 Shader、Texture、Depth 和 Blend。

## Renderer 设置

| 设置 | 用途 |
| --- | --- |
| materials | 几何体使用的一个或多个 Material Slot。 |
| layer | Opaque 或 Translucent Pipeline。 |
| cull box | 可选的每 Emitter Frustum Culling Bounds。 |
| order in layer | Photon Pass 之间的稳定顺序。 |
| vertex sorting mode | 在支持的 Renderer 中排序透明几何体。 |
| composite mode | 选择 Deferred FX 的合成时机。 |
| custom mask | 为后处理写入命名 Mask/Depth 信息。 |

## Material 类型

- **Texture Material：** Texture、Discard Threshold、HDR Multiplier/Mode 和 Pixel Art。另有[软粒子](#soft-particles)和[受动态光照](#lit-by-dynamic-lights)两个开关。
- **Sprite Material：** 使用已注册的 Minecraft Particle Sprite，同样带有这两个开关。
- **Kila 材质：** <VersionBadge version="2.2.8" label="自" icon="tag" /> 内置的一体化 VFX Material，包含 Render 与 Surface 设置、可选模块和预设库。见 [Kila 材质](../shaders-and-gpu/kila-material.md)。
- **Shader Graph Material：** 将 Graph Resource 编译成 Particle Shader 变体。从 2.2.8 起可以自带渲染状态，见[由 Material 提供渲染状态](#render-state-from-the-material)。
- **Custom Shader Material：** 加载 Core Shader，并暴露 Curve/Gradient Sampler。
- **Block Atlas：** 绑定 Minecraft Block Atlas 的 Texture Material。

Shader 相关细节见 [材质系统](../shaders-and-gpu/material-system.md)。

<figure>
<img src="/assets/photon2/material.png" alt="Photon Material 与 Renderer 设置">
<figcaption>Renderer State 与 Material State 分离，因此同一 Material 可以复用于不同 Emitter Geometry。</figcaption>
</figure>

### 软粒子 {#soft-particles}

<VersionBadge version="2.2.7" label="自" icon="tag" />

从 2.2.7 起，Texture 和 Sprite Material 可以让片元在接近身后的不透明表面时逐渐淡出，消除面片插进地面或墙壁时的那条硬边。在 Material 中打开 **软粒子** 即可。

| 选项 | 默认值 | 描述 |
| --- | --- | --- |
| 淡出距离 | `1`（0.001–64） | 片元距离表面多少格时完全可见。 |
| 淡出曲线 | `1`（0.01–16） | 淡出的指数。大于 `1` 时，边缘保持较淡的范围更长。 |
| 淡出目标 | `BOTH` | `BOTH` 同时缩放颜色和 Alpha，适合叠加混合。`ALPHA_ONLY` 只缩放 Alpha，适合普通的半透明混合。 |

- 淡出需要读取一份场景深度副本。只有当帧内有 Material 需要时，Photon 才会复制。
- Material 缩略图里看不到淡出效果，因为缩略图背后没有场景。
- 淡出在雾效之后计算，所以淡出的叠加粒子不会留下雾色的接缝。
- Shader Graph 和 Custom Shader Material 没有这个开关，请改用深度淡出（Depth Fade）节点或 `SamplerSceneDepth` Sampler。

### 受动态光照 {#lit-by-dynamic-lights}

<VersionBadge version="2.2.8" label="自" icon="tag" />

Texture 和 Sprite Material 有一个 **受动态光照** 开关，附带 **强度** 设置。开启后，粒子会被 Photon 的动态光源照亮。见[受光粒子与 Shader](../dynamic-lights/lit-particles-and-shaders.md)。

### 由 Material 提供渲染状态 {#render-state-from-the-material}

<VersionBadge version="2.2.8" label="自" icon="tag" />

混合、剔除和深度原本由 Renderer 的 Material Slot 决定。从 2.2.8 起，Material 也可以要求自己的设置：

- Shader Graph Material 有一个可选的 **自带渲染状态**，包含 **混合**、**双面**、**先画背面**、**深度测试** 和 **深度写入**。
- Kila 材质总是自带渲染状态。

当 Material 提供了渲染状态时，Slot 会多出一行 **渲染状态**：

| 选项 | 效果 |
| --- | --- |
| 跟随材质 | 默认值。Slot 使用 Material 的混合、剔除和深度设置，自己的相关行会隐藏，并显示一行“使用材质的渲染状态：…”。 |
| 自定义 | Slot 保留自己的设置。 |

Slot 自己的设置以 **混合** 预设下拉框开头，可选 **半透明**、**叠加**、**柔和叠加**、**正片叠底**、**不透明** 和 **自定义**。其他组合在下方的 **混合模式** 中手动设置因子。见 [材质系统](../shaders-and-gpu/material-system.md)。

### 材质缺少数据 {#material-needs-data}

<VersionBadge version="2.2.8" label="自" icon="tag" />

当某个 Material 读取了 Emitter 没有提供的数据时，Emitter 的 Inspector 顶部会出现 **材质缺少数据** 一行：

- Material 在拖尾、光束或 AraTrail 上读取粒子数据，但没有开启 GPU 实例化。这几种几何体只有实例化时才携带粒子数据。
- Material 读取了 Emitter 没有定义的 Custom Data 流，或者需要的通道数比该流多。

**一键修复** 会补齐缺少的部分：添加或扩充 Custom Data 流（同时开启附加GPU数据设置），并在几何体需要时开启 GPU 实例化。

## Tile 与 Model 渲染

Tile 模式渲染面向 Camera 或指定方向的 Quad。Model 模式为每个 Particle 渲染 Mesh，支持 Wireframe/Shaded、多 Material，以及 Model Source 提供时的 Block UV。

Model 渲染模式包含以下几行：

| 行 | 默认值 | 描述 |
| --- | --- | --- |
| Facing | `default` | Mesh 的朝向方式。见 [Model Facing](#model-facing)。 |
| model | – | 要绘制的 Mesh，把 Mesh 资源拖进来即可。 |
| shade | 开 | 为模型的每个面添加明暗。 |
| useBlockUV | 开 | 使用模型自带的 UV；关闭时使用粒子 UV。 |
| tangent | 关 | <VersionBadge version="2.2.5" label="自" icon="tag" /> 为每个顶点上传切线，用于切线空间法线贴图。需要开启 GPU 实例化。见[顶点切线](./gltf-models.md#vertex-tangents)。 |
| modelPivot | `0, 0, 0` | 偏移模型的轴心。 |

### Model Facing {#model-facing}

<VersionBadge version="2.2.7" label="自" icon="tag" />

从 2.2.7 起，Model 渲染模式也有与 Billboard 相同的 **Facing** 下拉框：`default`、`rotate_y`、`lookat_xyz`、`lookat_y`、`lookat_direction`、`direction_x`、`direction_y`、`direction_z`、`emitter_transform_xy`、`emitter_transform_xz` 和 `emitter_transform_yz`。

- 对模型来说，`default` 表示不做朝向处理。Mesh 沿用 Simulation Space 的旋转，与 2.2.7 之前相同，因此旧特效外观不变。下拉框中 `default` 的悬停提示描述的是 Billboard 下的含义。
- 其他模式会用朝向坐标系替换 Simulation Space 的旋转，再叠加粒子自身的旋转。
- `lookat_direction` 和各个 `direction_*` 模式会多出 **Direction Source**（`derive_from_velocity` 或 `custom_direction`）、**最小速度阈值** 和 **自定义方向**。例如，`direction_x` 配合 `derive_from_velocity` 会让 Mesh 的 X 轴对准飞行方向，适合沿 X 轴建模的箭矢。

::: warning 2.2.7 起粒子旋转顺序改变
<VersionBadge version="2.2.7" label="Changed" icon="triangle-alert" />

从 2.2.7 起，在所有 Tile 渲染模式下，粒子的欧拉旋转（起始旋转与生命周期内旋转）改用 Unity 的 ZXY 顺序，不再是 XYZ。先应用 Z，再应用 X，最后应用 Y，因此 Y 转动的是已经被 X 倾斜过的 Mesh。同时绕 X 和 Y 旋转的特效外观可能不同；只绕单个轴旋转的特效不受影响。

Model 粒子现在也会跟随父级的旋转。2.2.7 之前，Space 旋转被放在粒子自身旋转的内侧，会让 Mesh 发生歪斜。
:::

## Mesh Source {#mesh-sources}

<VersionBadge version="2.2.0" label="通用 Model Source 自" icon="tag" />

| Source | 说明 |
| --- | --- |
| Built-in primitive | Plane、quad、cube、sphere、cylinder、capsule。 |
| OBJ 模型 | 直接加载 `.obj` 资源，可选 V Flip。 |
| Json 模型 | Minecraft JSON 模型，加载 Model Geometry 与 Texture UV。 |
| glTF 模型 | <VersionBadge version="2.2.5" label="自" icon="tag" /> `.glb` 或 `.gltf` 文件。见 [glTF 模型](./gltf-models.md)。 |
| Animated glTF Model | <VersionBadge version="2.2.7" label="自" icon="tag" /> 播放自带动画片段的带骨骼 glTF 文件。见[动画 glTF 模型](./gltf-models.md#animated-gltf-models)。 |
| 网格引用 | 指向由编辑器管理的可复用 `.mesh.nbt` Mesh 资源。 |

Shape 和 Model Renderer Input 共用 `IModelSource`/`MeshData`，同一资源可以同时驱动 Emission 和可见 Geometry。

从 2.2.7 起，模组还可以通过 Java 的 `IDynamicMesh` 提供实时几何体。见[实时 Mesh 与 UI 场景](../java-api/live-meshes-and-ui-scenes.md)。

## GPU Instancing

Instanced Rendering 上传每 Particle Record，并在一个 Draw Call 中绘制大量 Particle。有效 Render Pass 相同的对象会合并到同一 Batch。每 Emitter Material/Renderer Runtime Override 会按需创建兼容 Override Pass；清除全部 Override 后恢复共享 Fast Path。

## Transparency 与 Depth

Depth Test 防止几何体后的 Particle 透出。Depth Mask 会写入 Particle Depth，使用不当可能让后续透明效果消失。Blend Mode 必须匹配 Shader 的 Color Convention；HDR/Bloom 路径使用支持 Premultiplied 的合成方式。
