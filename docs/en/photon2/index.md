# Photon2

<VersionBadge version="2.0.0" label="Since" icon="tag" />

Photon is an in-game real-time VFX toolkit for Minecraft. It combines particle emitters, trails, beams, a non-linear Timeline, Shader Graph materials, and graph-based post-processing in one editor.

<figure>
<img src="/assets/photon2/editor-tornado-overview.webp" alt="Maximized Photon editor with hierarchy, scene, inspector, resources, and timeline">
<figcaption>
The maximized Photon editor running the real tornado project. Hierarchy, Scene, Inspector, Resources, and Timeline stay visible together.
</figcaption>
</figure>

## Photon 2.2 Showcase

<div class="video-container">
<iframe width="100%" height="420" src="https://www.youtube.com/embed/jr800pFgZBw" title="Photon 2.2 showcase" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

The 2.2 release expands Photon from a particle editor into a complete VFX pipeline: Timeline sequencing, Shader Graph materials, Fullscreen Shader Graphs, Render Graph post effects, custom GPU data, force fields, mesh particles, and distributable FX Packs.

## Classic Introduction Video

The original video remains available. It focuses on the foundational particle workflow and complements the 2.2 showcase above; its interface and feature coverage reflect the earlier release.

<div class="video-container">
<iframe width="100%" height="420" src="https://www.youtube.com/embed/1fXFaWheYvc?si=veqThF1redsFnSHm" title="Photon classic introduction video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## Choose a Path

| Goal | Start here |
| --- | --- |
| Create a first effect in the editor | [Getting Started](./getting-started.md) |
| Learn particle emitters and modules | [Particle System](./particle-system/) |
| Reuse an effect inside another one | [FX Instances](./fx-instances.md) |
| Sequence effects and properties | [Timeline](./timeline/) |
| Build materials and GPU effects | [Shaders and GPU](./shaders-and-gpu/) |
| Light the world with effects | [Dynamic Lights](./dynamic-lights/) |
| Create fullscreen effects | [Post Processing](./post-processing/) |
| Load and control effects from a mod | [Java API](./java-api/) |

## How the Parts Fit Together

```mermaid
flowchart LR
    P["FX Project"] --> H["FX object hierarchy"]
    P --> R["Reusable resources"]
    P --> T["Timeline"]
    H --> E["Particle / Trail / Beam emitters"]
    H --> I["FX instances"]
    I --> F["Other .fx effects"]
    H --> L["Lights and fog volumes"]
    L --> D["Dynamic lights"]
    R --> M["Materials and meshes"]
    M --> S["Shader Graph, Kila Material, or custom shader"]
    E --> G["Photon render pipeline"]
    T --> E
    T --> X["Post-effect requests"]
    X --> Q["Render Graph"]
    S --> G
    Q --> O["Final frame"]
    G --> O
    D --> O
```

An exported `.fx` stores the authored object tree and Timeline. FX instances are baked into ordinary objects when the `.fx` loads. At runtime, `FX#createRuntime()` creates an independent playable instance. The runtime emits its objects into the client particle engine and submits active post-process clips once per frame.

## Main Features

- **Particle authoring:** particle, trail, beam, and AraTrail emitters with curves, gradients, sub-emitters, UV animation, custom renderers, and simulation spaces.
- **Collision:** particles collide with blocks, fluid surfaces, entities, and Collider objects; triggers let particles pass and report them entering and leaving. See [Particle Collision](./particle-system/collision.md). <VersionBadge version="2.2.9" label="Since" icon="tag" />
- **Models:** mesh particles from OBJ, JSON, and glTF / glb models, including animated glTF. See [glTF models](./particle-system/gltf-models.md). <VersionBadge version="2.2.5" label="Since" icon="tag" />
- **Dynamic lights:** point and spot lights with soft voxel shadows, volumetric light, fog volumes, and particles that emit or receive light. See [Dynamic Lights](./dynamic-lights/). <VersionBadge version="2.2.8" label="Since" icon="tag" />
- **Kila Material:** an all-in-one VFX material with 27 presets that can be exported to a Shader Graph. See [Kila Material](./shaders-and-gpu/kila-material.md). <VersionBadge version="2.2.8" label="Since" icon="tag" />
- **FX instances:** place one `.fx` inside another and save only what you change. See [FX Instances](./fx-instances.md). <VersionBadge version="2.2.9" label="Since" icon="tag" />
- **Timeline:** animation, activation, control, speed, signal, audio, group, and post-process tracks.
- **Shader Graph:** visual vertex and fragment shaders with scene inputs, particle inputs, reusable functions, and live previews.
- **GPU data:** per-emitter custom streams readable from Shader Graph or GLSL.
- **Post-processing:** fullscreen passes composed in a Render Graph, including weighted blending, priorities, custom textures, mask groups, and custom depth.
- **Distribution:** plain `.fx` exports and self-contained `.fxpack` resource packs.
- **Java integration:** built-in block/entity executors, direct control through `FXRuntime`, and [preloading](./java-api/preloading.md) effects before they first play.

## Requirements

- Minecraft `1.21.1`
- NeoForge `21.1+`
- Photon `2.2.9` needs LDLib2 `2.2.43` or newer. KilaGraph is bundled inside Photon's jar, so it needs no separate install.
- A client environment: Photon rendering and playback APIs are client-side

::: warning Photon 1.x
This manual documents Photon 2.x. The original Photon 1.x wiki remains available in the [legacy repository wiki](https://github.com/Low-Drag-MC/Photon/wiki).
:::
