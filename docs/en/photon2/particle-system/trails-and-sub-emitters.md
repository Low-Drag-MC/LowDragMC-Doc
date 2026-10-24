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
| Death | Parent particle finishes its lifetime, or a collision rule removes it. A collision death carries the contact point. |
| Collision | Parent particle makes a fresh impact with a solid surface. Resting on a surface does not fire it again. |
| FirstCollision | Parent particle makes its first impact. |
| Tick | Repeats at the configured tick interval. |
| TriggerEnter | Parent particle enters a trigger collider, or an entity in Trigger mode. |
| TriggerExit | Parent particle leaves a trigger. |

<VersionBadge version="2.2.9" label="Since" icon="tag" /> TriggerEnter and TriggerExit.

<VersionBadge version="2.2.9" label="Changed" icon="tag" /> Collision fires once per fresh impact. Before 2.2.9 it could fire again on every tick a particle stayed blocked.

Which impacts and collision deaths are reported depends on the emitter's [collision Events options](./collision.md#events) (Min Impact Speed, De-duplicate).

Each entry includes target emitter reference, event, probability, tick interval, and inheritance flags for color, size, rotation, lifetime, and duration. Entries also have contact options for collision, trigger, and death events:

<VersionBadge version="2.2.9" label="Since" icon="tag" />

| Setting | Default | Meaning |
| --- | --- | --- |
| Spawn At Contact | on for new entries | Spawn where the particle touched, not at its centre. Entries saved before 2.2.9 keep spawning at the centre. |
| Align To Normal | off | Turn the spawned effect so its +Y follows the surface normal. |
| Surface | `Any` | Fire only for contacts with `Blocks`, `Fluids`, `Entities`, or `Colliders`. A Death without a contact never passes a filter other than `Any`. Birth and Tick ignore it. |
| Surface Blocks | empty | With `Blocks` or `Fluids`: only these blocks, as ids or `#tags`. Empty means any. |

See [Particle Collision](./collision.md#events-and-sub-emitters) for how contacts become events.

## Search and References

Sub-emitters reference another emitter in the same FX runtime. Use clear, unique names and keep the target in a sensible hierarchy location. Photon resolves and caches target searches, including large hierarchies.

## Avoid Recursive Explosions

An emitter that spawns itself, or two emitters that spawn each other, can grow without bound. Probability and interval do not make an accidental cycle safe. Design an acyclic chain and set conservative max-particle counts.

::: warning Parallel updates
Sub-emitter requests created on worker updates are queued and applied safely by the owning emitter. Custom code must not directly mutate another emitter's particle collections from a worker thread.
:::
