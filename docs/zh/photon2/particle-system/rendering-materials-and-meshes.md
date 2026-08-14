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

- **Texture Material：** Texture、Discard Threshold、HDR Multiplier/Mode 和 Pixel Art。
- **Sprite Material：** 使用已注册的 Minecraft Particle Sprite。
- **Shader Graph Material：** 将 Graph Resource 编译成 Particle Shader 变体。
- **Custom Shader Material：** 加载 Core Shader，并暴露 Curve/Gradient Sampler。
- **Block Atlas：** 绑定 Minecraft Block Atlas 的 Texture Material。

Shader 相关细节见 [Material System](../shaders-and-gpu/material-system.md)。

<figure>
<img src="/assets/photon2/material.png" alt="Photon Material 与 Renderer 设置">
<figcaption>Renderer State 与 Material State 分离，因此同一 Material 可以复用于不同 Emitter Geometry。</figcaption>
</figure>

## Tile 与 Model 渲染

Tile 模式渲染面向 Camera 或指定方向的 Quad。Model 模式为每个 Particle 渲染 Mesh，支持 Wireframe/Shaded、多 Material，以及 Model Source 提供时的 Block UV。

## Mesh Source

<VersionBadge version="2.2.0" label="通用 Model Source 自" icon="tag" />

| Source | 说明 |
| --- | --- |
| Built-in primitive | Plane、quad、cube、sphere、cylinder、capsule。 |
| OBJ | 直接加载 `.obj` 资源，可选 V Flip。 |
| Minecraft JSON model | 加载 Model Geometry 与 Texture UV。 |
| Resource Mesh | 由编辑器管理的可复用 `.mesh.nbt`。 |

Shape 和 Model Renderer Input 共用 `IModelSource`/`MeshData`，同一资源可以同时驱动 Emission 和可见 Geometry。

## GPU Instancing

Instanced Rendering 上传每 Particle Record，并在一个 Draw Call 中绘制大量 Particle。有效 Render Pass 相同的对象会合并到同一 Batch。每 Emitter Material/Renderer Runtime Override 会按需创建兼容 Override Pass；清除全部 Override 后恢复共享 Fast Path。

## Transparency 与 Depth

Depth Test 防止几何体后的 Particle 透出。Depth Mask 会写入 Particle Depth，使用不当可能让后续透明效果消失。Blend Mode 必须匹配 Shader 的 Color Convention；HDR/Bloom 路径使用支持 Premultiplied 的合成方式。
