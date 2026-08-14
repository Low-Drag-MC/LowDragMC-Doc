# Trails and Sub-Emitters

![A multi-stage firework effect created with Photon](/assets/photon2/fx-hanabi.webp)

*Birth, tick, collision, and death events can chain emitters into multi-stage effects such as this firework.*

The Particle Emitter can create secondary geometry and secondary emitters from each particle. These systems are powerful because they inherit particle state, but they also multiply simulation and rendering work.

## Particle Trails

Enable Trails to attach a trail to a configured ratio of particles.

| Setting | Purpose |
| --- | --- |
| ratio | Fraction of spawned particles that receive a trail. |
| lifetime | Trail lifetime function. |
| dieWithParticles | Remove the trail with its owner or let it drain. |
| sizeAffectsWidth | Multiply width by particle size. |
| sizeAffectsLifetime | Multiply trail lifetime by particle size. |
| inheritParticleColor | Multiply trail color by particle color. |
| colorOverLifetime | Color across trail life. |
| trailType | Select the trail implementation/render geometry. |

The trail has its own material/renderer path. A Particle Emitter may therefore queue tile particles and trail particles into different effective render passes.

## Sub-Emitter Events

| Event | Trigger |
| --- | --- |
| Birth | Parent particle is created. |
| Death | Parent particle finishes. |
| Collision | Parent particle reports a collision. |
| Tick | Repeats at the configured tick interval. |

Each entry includes target emitter reference, event, probability, tick interval, and inheritance flags for color, size, rotation, lifetime, and duration.

## Search and References

Sub-emitters reference another emitter in the same FX runtime. Use clear, unique names and keep the target in a sensible hierarchy location. Photon resolves and caches target searches, including large hierarchies.

## Avoid Recursive Explosions

An emitter that spawns itself, or two emitters that spawn each other, can grow without bound. Probability and interval do not make an accidental cycle safe. Design an acyclic chain and set conservative max-particle counts.

::: warning Parallel updates
Sub-emitter requests created on worker updates are queued and applied safely by the owning emitter. Custom code must not directly mutate another emitter's particle collections from a worker thread.
:::
