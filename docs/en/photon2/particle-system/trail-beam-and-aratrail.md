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

## AraTrail Emitter

AraTrail exposes thickness and color over total length, total time, and per-segment time. Physics controls the simulated chain; minimum distance and time interval control segment creation. Use it when a normal Trail tied directly to emitter motion is not expressive enough.

## Runtime Values

All three own typed runtime layers (`TrailRuntime`, `BeamRuntime`, `AraTrailRuntime`). Timeline tracks can animate registered fields, and Java can set the same `RuntimeValue` slots. Renderer and material overrides use the same lazy per-instance render-pass strategy as Particle Emitter.

## Additional GPU Data

Each renderer declares a fixed GPU record layout for its supported custom channels. Trail, Beam, and AraTrail records differ from Tile Particle records; use the graph node/accessor intended for the active renderer and consult [Additional GPU Data](../shaders-and-gpu/additional-gpu-data.md).

## Choosing One

- Choose Trail when geometry should exactly follow a moving transform.
- Choose Beam when endpoints matter more than motion history.
- Choose AraTrail when the trail itself needs simulated motion.
- Choose Particle Trails when many independent particles each need a short trail.
