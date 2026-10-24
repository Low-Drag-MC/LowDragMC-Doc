# Physics, Noise, Lighting, and UV

![The UV animation project in the maximized Photon editor](/assets/photon2/editor-uv-animation-overview.webp)

*The UV animation fixture previews tiled frames while its particle and renderer settings remain visible in the editor.*

These modules affect different stages of a particle: Physics resolves gravity, friction, and collision, Noise perturbs simulated state, Fixed Light sets the vanilla lightmap value, and UV Animation selects texture frames.

## Physics and Collision

<VersionBadge version="2.2.9" label="Changed" icon="tag" />

The Physics module adds gravity and friction, and turns on collision through **Has Collision**. Since 2.2.9, particles collide with block shapes, fluid surfaces, entities, and Collider objects, and the collision is swept, so fast particles no longer pass through thin walls.

- **Bounce Rate** is restitution: the share of the speed into the surface kept on a bounce.
- **Bounce Chance** is rolled on every impact; a particle that does not bounce slides along the surface.
- **Collided Friction** slows only the sliding part of the velocity, and only while the particle touches a surface.
- Avoid invalid curves that can produce NaN position or velocity.

See [Particle Collision](./collision.md) for every collision option, Collider objects, collision events, performance, and the behaviour changes from 2.2.8.

## Noise

Noise can perturb position, rotation, and size. `frequency` controls how quickly the field changes; quality trades work for smoother variation. Remap converts raw noise into a useful output range.

Use low-frequency noise for smoke drift and high-frequency noise for sparks or electrical jitter. Applying strong noise to both position and velocity-like modules can make motion difficult to predict.

## Fixed Light

The **Fixed Light** module sets the vanilla lightmap value of each particle: a Sky Light and a Block Light function (0–15) over the particle lifetime. It is on by default at 15/15, so particles render full-bright. Turn it off to use the world's light at the particle position. Fixed bright values are useful for magical or emissive-looking effects, while actual HDR emission belongs in the material/shader.

Fixed Light only changes the vanilla lightmap. To make particles cast light, use [Light Emission](../dynamic-lights/lit-particles-and-shaders.md#light-emission); to light particles by nearby dynamic lights, use [Lit by Dynamic Lights](../dynamic-lights/lit-particles-and-shaders.md#lit-by-dynamic-lights) on the material. See [Dynamic Lights](../dynamic-lights/index.md) for the whole system.

<figure>
<img src="/assets/photon2/LightMap.png" alt="Light map data used by Photon materials">
<figcaption>Light values and material emission solve different problems: light affects Minecraft shading; HDR emission feeds bloom.</figcaption>
</figure>

## UV Animation

UV Animation divides a texture into tiles and chooses a frame over time.

| Setting | Meaning |
| --- | --- |
| tiles | Columns and rows in the sheet. |
| animation | Whole sheet or configured animation mode. |
| frameOverTime | Function that selects progress through frames. |
| startFrame | Per-particle starting frame offset. |
| cycle | Number of sheet traversals over the sampling interval. |

Use nearest/pixel-art material settings for hard-edged sprite sheets. Incorrect tile counts sample neighbouring sprites or empty texture space.

## Performance Checklist

- Collision and high-quality noise are per-particle CPU costs. Enable only the collision targets you need; with Parallel Update on, collision emitters can run on worker threads (see [Particle Collision](./collision.md#performance-and-debugging)).
- World light (Fixed Light off) queries loaded world positions; keep large systems within reasonable bounds.
- UV animation is cheap, but oversized transparent textures still cost fill rate.
- Test with the real maximum particle count, not only the editor's first seconds.
