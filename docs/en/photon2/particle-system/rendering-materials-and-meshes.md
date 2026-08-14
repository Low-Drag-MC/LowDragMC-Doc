# Rendering, Materials, Meshes, and Models

![Material resources available to Photon renderers](/assets/photon2/resource-material.webp)

![Mesh resources available to model particles](/assets/photon2/resource-mesh.webp)

*A renderer combines one of these materials with tile geometry, a mesh, or a model source.*

Simulation produces particle state. Renderer settings choose geometry and draw order; materials choose shader, texture, depth, and blending.

## Renderer Controls

| Setting | Purpose |
| --- | --- |
| materials | One or more material slots used by the geometry. |
| layer | Opaque or translucent pipeline. |
| cull box | Optional per-emitter bounds for frustum culling. |
| order in layer | Stable ordering between Photon passes. |
| vertex sorting mode | Sort translucent geometry where supported. |
| composite mode | Choose when deferred FX is composited. |
| custom mask | Write named mask/depth information for post effects. |

## Material Types

- **Texture Material:** texture, discard threshold, HDR multiplier/mode, and pixel-art options.
- **Sprite Material:** uses a registered Minecraft particle sprite.
- **Shader Graph Material:** compiles a graph resource into the particle shader variants.
- **Custom Shader Material:** loads a Core Shader and exposes curve/gradient samplers.
- **Block Atlas:** texture material bound to Minecraft's block atlas.

See [Material System](../shaders-and-gpu/material-system.md) for shader-facing details.

<figure>
<img src="/assets/photon2/material.png" alt="Photon material and renderer settings">
<figcaption>Renderer state and material state are separate so the same material can be reused by different emitter geometry.</figcaption>
</figure>

## Tile and Model Rendering

Tile mode renders camera-facing or configured-orientation quads. Model mode renders a mesh for every particle and supports wireframe/shaded choices, multiple materials, and block UVs where the model source provides them.

## Mesh Sources

<VersionBadge version="2.2.0" label="Universal model sources since" icon="tag" />

| Source | Notes |
| --- | --- |
| Built-in primitive | Plane, quad, cube, sphere, cylinder, capsule. |
| OBJ | Direct `.obj` resource with optional V flip. |
| Minecraft JSON model | Loads model geometry and texture UV layout. |
| Resource Mesh | Reusable `.mesh.nbt` managed by the editor. |

Shape and Model renderer inputs share `IModelSource`/`MeshData`, so one resource can drive both emission and visible geometry.

## GPU Instancing

Instanced rendering uploads per-particle records and draws many particles in one call. Equal effective render passes merge into the same batch. A per-emitter material/renderer Runtime override lazily creates a compatible override pass; clearing all overrides returns to the shared fast path.

## Transparency and Depth

Depth test prevents particles behind geometry from showing. Depth mask writes particle depth and can cause later translucent effects to disappear if used carelessly. Blend mode must match the shader's color convention; HDR/bloom paths use premultiplied-aware composition.
