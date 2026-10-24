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

- **Texture Material:** texture, discard threshold, HDR multiplier/mode, and pixel-art options. Also has the [Soft Particles](#soft-particles) and [Lit by Dynamic Lights](#lit-by-dynamic-lights) toggles.
- **Sprite Material:** uses a registered Minecraft particle sprite. Has the same two toggles.
- **Kila Material:** <VersionBadge version="2.2.8" label="Since" icon="tag" /> a built-in all-in-one VFX material: Render and Surface settings, optional modules, and a preset gallery. See [Kila Material](../shaders-and-gpu/kila-material.md).
- **Shader Graph Material:** compiles a graph resource into the particle shader variants. Since 2.2.8 it can bring its own render state; see [Render State From the Material](#render-state-from-the-material).
- **Custom Shader Material:** loads a Core Shader and exposes curve/gradient samplers.
- **Block Atlas:** texture material bound to Minecraft's block atlas.

See [Material System](../shaders-and-gpu/material-system.md) for shader-facing details.

<figure>
<img src="/assets/photon2/material.png" alt="Photon material and renderer settings">
<figcaption>Renderer state and material state are separate so the same material can be reused by different emitter geometry.</figcaption>
</figure>

### Soft Particles

<VersionBadge version="2.2.7" label="Since" icon="tag" />

Since 2.2.7, Texture and Sprite materials can fade a fragment out as it nears the opaque surface behind it. This removes the hard line where a quad cuts through the ground or a wall. Turn on **Soft Particles** in the material.

| Option | Default | Description |
| --- | --- | --- |
| Fade Distance | `1` (0.001–64) | Blocks in front of the surface at which the fragment is fully visible. |
| Fade Power | `1` (0.01–16) | Exponent on the fade. Above `1`, the edge stays faint for longer. |
| Fade Target | `BOTH` | `BOTH` scales colour and alpha; use it for additive blending. `ALPHA_ONLY` scales alpha only; use it for classic alpha blending. |

- The fade reads a copy of the scene depth. Photon only makes that copy in frames where a material asks for it.
- The material thumbnail does not show the fade, because there is no scene behind it.
- The fade is applied after fog, so a faded additive particle leaves no fog-coloured seam.
- Shader Graph and Custom Shader materials don't have this toggle. Use the Depth Fade node or the `SamplerSceneDepth` sampler instead.

### Lit by Dynamic Lights

<VersionBadge version="2.2.8" label="Since" icon="tag" />

Texture and Sprite materials have a **Lit by Dynamic Lights** toggle with an **Intensity**. When it is on, Photon's dynamic lights light the particles. See [Lit Particles and Shaders](../dynamic-lights/lit-particles-and-shaders.md).

### Render State From the Material

<VersionBadge version="2.2.8" label="Since" icon="tag" />

Blend, culling and depth normally belong to the renderer's material slot. Since 2.2.8, a material can ask for its own:

- A Shader Graph Material has an optional **Own Render State** with **Blend**, **Double Sided**, **Back First**, **Depth Test** and **Depth Write**.
- A Kila Material always brings its own render state.

When the material brings a render state, the slot shows a **Render State** row:

| Choice | Effect |
| --- | --- |
| From Material | Default. The slot uses the material's blend, culling and depth. Its own rows are hidden, and a line shows "Render state from the material: …". |
| Custom | The slot keeps its own settings. |

The slot's own settings start with a **Blend** dropdown of presets: **Alpha**, **Additive**, **Soft additive**, **Multiply**, **Opaque** and **Custom**. **Blend Mode** below it holds the factors for anything else. See [Material System](../shaders-and-gpu/material-system.md).

### Material Needs Data

<VersionBadge version="2.2.8" label="Since" icon="tag" />

An emitter's inspector shows a **Material needs data** row at the top when one of its materials reads data the emitter does not provide:

- The material reads particle data on a trail, beam or AraTrail without GPU instancing. Those geometries only carry it when instanced.
- The material reads a Custom Data stream the emitter does not define, or needs more channels than the stream has.

**Fix** provides what is missing. It adds or widens the Custom Data streams (turning on the Additional GPU Data Setting), and turns on GPU instancing where the geometry needs it.

## Tile and Model Rendering

Tile mode renders camera-facing or configured-orientation quads. Model mode renders a mesh for every particle and supports wireframe/shaded choices, multiple materials, and block UVs where the model source provides them.

The Model render mode has these rows:

| Row | Default | Description |
| --- | --- | --- |
| Facing | `default` | How the mesh is oriented. See [Model Facing](#model-facing). |
| model | – | The mesh to draw. Drag a Mesh resource in. |
| shade | on | Shades each side of the model. |
| useBlockUV | on | Uses the model's UVs. Off uses the particle UV. |
| tangent | off | <VersionBadge version="2.2.5" label="Since" icon="tag" /> Uploads a tangent with each vertex, for tangent-space normal mapping. Needs GPU instancing. See [Vertex Tangents](./gltf-models.md#vertex-tangents). |
| modelPivot | `0, 0, 0` | Offsets the model's pivot. |

### Model Facing

<VersionBadge version="2.2.7" label="Since" icon="tag" />

Since 2.2.7, the Model render mode has the same **Facing** dropdown as Billboard: `default`, `rotate_y`, `lookat_xyz`, `lookat_y`, `lookat_direction`, `direction_x`, `direction_y`, `direction_z`, `emitter_transform_xy`, `emitter_transform_xz` and `emitter_transform_yz`.

- `default` means no facing for a model. The mesh keeps the simulation space's rotation, as before 2.2.7, so older effects look the same. The dropdown's tooltip for `default` describes the billboard meaning.
- Any other mode replaces the simulation space's rotation with the facing frame. The particle's own rotation is applied on top.
- `lookat_direction` and the `direction_*` modes add **Direction Source** (`derive_from_velocity` or `custom_direction`), **Min Speed Threshold** and **Custom Direction**. For example, `direction_x` with `derive_from_velocity` lines up the mesh's X axis with its flight, which suits an arrow modelled along X.

::: warning Particle rotation order changed in 2.2.7
<VersionBadge version="2.2.7" label="Changed" icon="triangle-alert" />

Since 2.2.7, a particle's euler rotation (Start Rotation and Rotation Over Lifetime) uses Unity's ZXY order instead of XYZ, in every tile render mode. Z is applied first, then X, then Y, so Y turns a mesh that X has already tilted. Effects that rotate on both X and Y can look different; single-axis rotations look the same.

Model particles now also turn with their parent's rotation. Before 2.2.7, the space rotation was applied inside the particle's own rotation, which skewed the mesh.
:::

## Mesh Sources

<VersionBadge version="2.2.0" label="Universal model sources since" icon="tag" />

| Source | Notes |
| --- | --- |
| Built-in primitive | Plane, quad, cube, sphere, cylinder, capsule. |
| OBJ Model | Direct `.obj` resource with optional V flip. |
| Json Model | Minecraft JSON model; loads model geometry and texture UV layout. |
| glTF Model | <VersionBadge version="2.2.5" label="Since" icon="tag" /> `.glb` or `.gltf` file. See [glTF Models](./gltf-models.md). |
| Animated glTF Model | <VersionBadge version="2.2.7" label="Since" icon="tag" /> Rigged glTF file playing one of its clips. See [Animated glTF Models](./gltf-models.md#animated-gltf-models). |
| Mesh Reference | Points at a reusable `.mesh.nbt` Mesh resource managed by the editor. |

Shape and Model renderer inputs share `IModelSource`/`MeshData`, so one resource can drive both emission and visible geometry.

Since 2.2.7, a mod can also feed live geometry from Java through `IDynamicMesh`. See [Live Meshes and UI Scenes](../java-api/live-meshes-and-ui-scenes.md).

## GPU Instancing

Instanced rendering uploads per-particle records and draws many particles in one call. Equal effective render passes merge into the same batch. A per-emitter material/renderer Runtime override lazily creates a compatible override pass; clearing all overrides returns to the shared fast path.

## Transparency and Depth

Depth test prevents particles behind geometry from showing. Depth mask writes particle depth and can cause later translucent effects to disappear if used carelessly. Blend mode must match the shader's color convention; HDR/bloom paths use premultiplied-aware composition.
