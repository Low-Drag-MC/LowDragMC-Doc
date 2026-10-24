# Simulation, Motion, and Force Fields

<VersionBadge version="2.2.0" label="Simulation spaces and force fields since" icon="tag" />

![The tornado project demonstrating coordinated particle motion](/assets/photon2/editor-tornado-scene.webp)

*Simulation space and force modules decide whether this motion follows its parent or remains in world space.*

Simulation space controls which transform basis stores particle position and velocity. Motion modules then update that state each tick.

## Simulation Space

| Space | Behaviour |
| --- | --- |
| `LOCAL` | Existing particles follow translation, rotation, and scale of the emitter hierarchy. |
| `WORLD` | Particles remain in world space after spawn; moving the emitter only affects new particles. |
| `CUSTOM` | Store particles relative to a referenced FX object's transform. |

Use Local for attached aura and weapon effects, World for smoke left behind by a moving source, and Custom when several emitters must share an independently animated space.

## Velocity over Lifetime

Velocity over Lifetime provides linear, orbital, offset, radial, and speed-modifier functions. Its **Space** field (`ValueSpace`) decides how configured vectors are interpreted before they are added to particle motion.

<VersionBadge version="2.2.1" label="Velocity ValueSpace since" icon="tag" />

<VersionBadge version="2.2.8" label="Since" icon="tag" /> Space can be **Custom**. Drag an object into **Custom Space**, and the vectors use that object's current axes. The orbital and radial pivot also moves to the object's origin, so particles can orbit another object. See [Value Space](./lifetime-and-speed-modules.md#value-space) for every module with this choice.

## Force over Lifetime

Force changes velocity over time rather than setting a direct displacement. Use it for gravity-like acceleration, wind, or controlled curvature. A changing force curve integrates over the particle lifetime.

Its **Simulation Space** field is a value space, not the emitter's Simulation Space. `Local` (default) uses the emitter's axes; `World` uses the world axes.

<VersionBadge version="2.2.8" label="Since" icon="tag" /> `Custom` uses the axes of the object in **Custom Space**.

## Inherit Velocity

Inherit Velocity transfers emitter movement into new or living particles according to its configured mode and multiplier. It is distinct from Local space: World-space particles can inherit launch velocity without continuing to follow the emitter.

## Force Fields

A `ForceFieldObject` is an FX object with a transform and `ForceFieldConfig`. Supported influences include:

- directional force;
- attraction/gravity around the field transform;
- drag;
- vortex motion.

Enable **External Forces** on a Particle Emitter and set its multiplier. The influence filter/list can include or exclude named fields, allowing several force systems in one FX hierarchy.

## Ordering

Start speed and inherited velocity establish initial motion. Per-tick velocity, force, physics, external fields, and noise then contribute through their runtime modules. With collision on, Physics resolves each step's movement against blocks, entities, and colliders; see [Particle Collision](./collision.md). Avoid using several modules to perform the same job unless their combination is intentional.

::: warning Transform scale
Non-uniform parent scale changes vector bases. Test Custom space and orbital motion with the final hierarchy scale, not only at `1 1 1`.
:::
