# Shaders, Materials, and GPU Data

<VersionBadge version="2.2.0" label="Shader Graph and GPU streams" icon="tag" />

Photon separates *what an emitter draws* from *how its pixels are shaded*. A Material selects textures, render state, and a shader. Shader Graph builds that shader visually. GPU Data supplies values that change for every particle or trail point.

<figure>
<img src="/assets/photon2/graph-particle-shader.webp" alt="Maximized Photon editor with a real particle Shader Graph">
<figcaption>The real particle graph is open beside its live Scene, Material resources, Inspector, and Timeline.</figcaption>
</figure>

```mermaid
flowchart LR
    E["Emitter runtime"] --> R["Tile / model / trail renderer"]
    E --> D["Particle, additional, and custom data"]
    M["Material"] --> R
    G["Shader Graph"] --> C["Photon shader compiler"]
    C --> P["Compiled render pass"]
    R --> P
    D --> A["Attributes or buffer textures"]
    A --> P
    P --> F["Minecraft render targets"]
```

## Choose an Authoring Path

| Need | Use |
| --- | --- |
| One texture on ordinary particles | Texture or Sprite Material |
| Common VFX looks (flipbook, dissolve, distortion, soft edges, rims, decals) without a graph | Kila Material |
| Visual per-pixel logic without GLSL | Shader Graph Material |
| Existing Core Shader JSON/VSH/FSH | Custom Shader Material |
| Scene-color or full-screen processing | Fullscreen Graph and Render Graph |
| Per-particle animation inside the shader | Additional GPU Data |
| Values controlled by Timeline or Java | Custom Data streams |

<VersionBadge version="2.2.8" label="Kila Material" icon="tag" />

Start a new effect with [Kila Material](./kila-material.md): its modules and presets cover the common looks, and it reads per-particle data without a graph. When you need logic it has no module for, export it as a Shader Graph and continue there. Shader Graph declares its required streams and works across Photon render contexts. Hand-written shaders remain useful when porting a shader or when graph nodes cannot express an operation.

## In This Section

- [Material System](./material-system.md)
- [Kila Material](./kila-material.md)
- [Shader Graph: Getting Started](./shader-graph-getting-started.md)
- [Stages, Functions, and Subgraphs](./stages-functions-and-subgraphs.md)
- [Core Node Reference](./core-node-reference.md)
- [Photon Node Reference](./photon-node-reference.md)
- [Custom Shader Material](./custom-shaders-uniforms-and-samplers.md)
- [Hand-written Core Shaders and ExtendedShader](./extended-shader.md)
- [Built-in Uniform and Sampler Reference](./custom-shader-builtins.md)
- [Vertex Formats and GPU Instancing](./vertex-formats-and-instancing.md)
- [Additional GPU Data](./additional-gpu-data.md)
