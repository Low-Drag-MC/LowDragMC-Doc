# Particle System

Photon builds an effect from a hierarchy of FX objects. Emitters simulate particles; renderer settings convert their state into draw calls; materials decide how those vertices become pixels; the Timeline can override the same runtime values over time.

<figure>
<img src="/assets/photon2/editor-tornado-overview.webp" alt="Maximized Photon particle editor running the tornado effect">
<figcaption>The real tornado project shows the object, material, live Scene, Resources, and Timeline working together.</figcaption>
</figure>

```mermaid
flowchart TD
    FX["FXRuntime"] --> R["root / Empty objects"]
    R --> P["ParticleEmitter"]
    R --> T["TrailEmitter"]
    R --> B["BeamEmitter"]
    R --> A["AraTrailEmitter"]
    R --> F["ForceFieldObject"]
    R --> C["ColliderObject"]
    R --> L["LightObject / FogVolumeObject"]
    R --> I["FXInstanceObject"]
    I --> IS["Objects placed from another .fx"]
    F -. External Forces .-> P
    C -. collision .-> P
    P --> PC["ParticleRuntime + modules"]
    PC --> PP["TileParticle / trail particles"]
    PP --> RP["Render pass"]
    RP --> M["Material / Shader Graph"]
```

## FX Object Types

| Type | Use |
| --- | --- |
| Empty | Group children and provide an animatable transform. |
| Particle Emitter | Spawn many independent tile/model particles and optional particle trails. |
| Trail Emitter | Build a continuous ribbon or tube from a moving emitter. |
| Beam Emitter | Render a beam between endpoints or along a raycast. |
| AraTrail Emitter | Simulate a physically moving trail with segment properties. |
| Force Field | Apply directional, gravity, drag, and vortex influence through External Forces. |
| Collider | A plane, box, or sphere that particles of the same FX collide with, or a trigger they report. See [Particle Collision](./collision.md#collider-objects). |
| Light | A point or spot dynamic light, optionally shadowed and volumetric. See [Lights and Fog](../dynamic-lights/lights-and-fog.md). |
| Fog Volume | A box or sphere of volumetric fog. See [Lights and Fog](../dynamic-lights/lights-and-fog.md). |
| FX Instance | Place another `.fx` inside this effect and override only what differs. See [FX Instances](../fx-instances.md). |

<VersionBadge version="2.2.8" label="Since" icon="tag" /> Light and Fog Volume objects.

<VersionBadge version="2.2.9" label="Since" icon="tag" /> Collider and FX Instance objects.

## Recommended Reading Order

1. [Hierarchy and Transforms](./hierarchy-and-transforms.md)
2. [Curves, Gradients, and Value Functions](./value-functions.md)
3. [Particle Emitter](./particle-emitter.md)
4. [Emission and Shapes](./emission-and-shapes.md)
5. [Simulation and Forces](./simulation-and-forces.md)
6. [Lifetime and Speed Modules](./lifetime-and-speed-modules.md)
7. [Rendering, Materials, and Meshes](./rendering-materials-and-meshes.md)

## More Topics

- [Physics, Noise, Lighting, and UV](./physics-noise-lighting-uv.md)
- [Particle Collision](./collision.md): blocks, fluids, entities, Collider objects, triggers, and collision events.
- [Trails and Sub-Emitters](./trails-and-sub-emitters.md)
- [glTF Models](./gltf-models.md)
- [Trail, Beam, and AraTrail Emitters](./trail-beam-and-aratrail.md)

## Runtime Model

Authored settings remain config data. Each emitted object creates a runtime layer whose values fall back to that config. Timeline tracks and Java code write runtime slots without mutating the reusable FX definition. This is why one `.fx` can play many independent instances.

::: tip Debug one system at a time
Start with a plain texture material, constant values, and one module. Add curves, trails, custom shaders, and post effects only after emission and motion look correct.
:::
