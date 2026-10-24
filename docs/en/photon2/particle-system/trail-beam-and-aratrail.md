# Trail, Beam, and AraTrail Emitters

![Beam emitter preview](/assets/photon2/editor-beam-scene.webp)

![AraTrail emitter preview](/assets/photon2/editor-aratrail-scene.webp)

*Beam connects endpoints directly; AraTrail integrates moving segments, so its shape bends over time.*

These emitters render connected geometry directly instead of spawning a cloud of independent tile particles.

## Comparison

| Emitter | Geometry source | Best for |
| --- | --- | --- |
| Trail | Samples a moving emitter into ordered sections | Weapon slashes, movement streaks, ribbons. |
| Beam | Connects endpoints or raycast result | Lasers, links, straight energy beams. |
| AraTrail | Simulates a moving segmented trail with physics | Whips, lightning-like motion, smooth tails. |

## Trail Emitter

Trail config includes duration, looping, delay, time, minimum vertex distance, width over trail, and color over trail. Flat and tube rendering trade vertex count for volume. UVs advance along ordered trail sections.

## Beam Emitter

Beam config includes duration, looping, delay, width, emission rate, and color. Raycast mode determines an endpoint from the world; direct mode uses configured transforms. UV animation and lighting are shared with other emitter data modules.

**Raycast** is `NONE` by default. `BLOCKS`, `ENTITIES`, and `BLOCKS_AND_ENTITIES` shorten the beam at the first hit; with blocks, **Block Mode** and **Fluid Mode** set how the ray treats block shapes and fluids.

<VersionBadge version="2.2.9" label="Changed" icon="tag" /> The block raycast now gives the same hit as the vanilla raycast (`clip`). The entity modes now hit entities; before 2.2.9 they never did. The entity test is widened by the beam width, so a wide beam stops at the entity's surface. It skips the effect's owner, spectators, and entities that cannot be targeted.

## AraTrail Emitter

AraTrail exposes thickness and color over total length, total time, and per-segment time. Physics controls the simulated chain; minimum distance and time interval control segment creation. Use it when a normal Trail tied directly to emitter motion is not expressive enough.

The Physics group applies to AraTrail emitters and to Ara-type particle trails.

| Setting | Default | Meaning |
| --- | --- | --- |
| Gravity Space | `World` | The axes Gravity is authored in: `World`, `Local` (the emitter's axes), or `Custom` (a picked object's axes). |
| Collide With Blocks | off | Trail points slide along, or bounce off, blocks instead of passing through them, so a trail can lie on the ground. |
| Collision Radius | 0.05 | How far trail points keep from surfaces. |
| Collision Bounce | 0 | The share of a point's speed into a surface that bounces back. |
| Collision Friction | 0.5 | The share of sliding speed lost on each contact. |

<VersionBadge version="2.2.8" label="Since" icon="tag" /> Gravity Space. Files saved earlier map it from the trail's space, so they look the same. Since 2.2.8, trail points also move smoothly instead of hopping at 20 Hz, and the tail no longer jumps when Smoothness is above 1.

<VersionBadge version="2.2.9" label="Since" icon="tag" /> Collide With Blocks and its three settings. Trail points collide with blocks only, not with fluids, entities, or Collider objects. See [Particle Collision](./collision.md) for particle collision.

## Runtime Values

All three own typed runtime layers (`TrailRuntime`, `BeamRuntime`, `AraTrailRuntime`). Timeline tracks can animate registered fields, and Java can set the same `RuntimeValue` slots. Renderer and material overrides use the same lazy per-instance render-pass strategy as Particle Emitter.

## Additional GPU Data

Each renderer declares a fixed GPU record layout for its supported custom channels. Trail, Beam, and AraTrail records differ from Tile Particle records; use the graph node/accessor intended for the active renderer and consult [Additional GPU Data](../shaders-and-gpu/additional-gpu-data.md).

## Choosing One

- Choose Trail when geometry should exactly follow a moving transform.
- Choose Beam when endpoints matter more than motion history.
- Choose AraTrail when the trail itself needs simulated motion.
- Choose Particle Trails when many independent particles each need a short trail.
