# Emission and Shapes

![A water emitter previewed in the Photon Scene](/assets/photon2/editor-water-scene.webp)

*Shape, direction, and emission rate combine into the distribution visible in the live Scene.*

Emission decides **when** to spawn particles. Shape decides **where** they start and which direction supplies their initial speed.

## Emission Sources

| Source | Behaviour |
| --- | --- |
| Emission Rate | Spawn continuously over emitter time. |
| Distance Rate | Spawn as the emitter travels, useful for footsteps and moving trails. |
| Burst | Spawn a configured count at a specific cycle time. |

Bursts include `time`, `count`, `cycles`, `interval`, and `probability`. The emitter tracks each burst cycle so looping emitters do not replay old burst state incorrectly.

## Shape Transform

The Shape module adds its own position, rotation, and scale inside the emitter transform. This is useful when the visual emission volume needs a different pivot without adding another Empty object.

## Built-in Shapes

| Shape | Important controls | Typical use |
| --- | --- | --- |
| Dot | none | One origin point. |
| Box | dimensions and emit-from mode | Volumes, planes, or box surfaces. |
| Circle | radius, thickness, arc | Rings and radial sprays. |
| Cone | angle, radius, thickness, arc | Fire, jets, and directional spreads. |
| Cylinder | radius, thickness, arc | Columns and circular walls. |
| Sphere | radius, thickness, arc | Explosions, auras, and shells. |
| Mesh | vertices, edges or triangles of a mesh source | Emit from authored model geometry. |
| Function | expressions for position/direction | Procedural paths and mathematical volumes. |

## Arc

Circle-like shapes can restrict their angular range and choose how that range is traversed. Arc modes provide random distribution or ordered progression; loop, ping-pong, spread, and speed controls determine how emission advances.

## Radius Thickness

A thickness of `0` emits on the outer surface. Larger values allow points further toward the center. Use a shell for readable outlines and a filled volume for clouds or explosions.

## Mesh Sources

<VersionBadge version="2.2.0" label="Universal mesh sources since" icon="tag" />

Mesh shapes use the same sources as Model rendering: built-in primitives, OBJ Model, Json Model, glTF Model, Animated glTF Model, or a Mesh Reference to a reusable Mesh resource. This avoids maintaining separate shape and renderer meshes. See [Mesh Sources](./rendering-materials-and-meshes.md#mesh-sources) for the full list.

<VersionBadge version="2.2.5" label="glTF Model since" icon="tag" /> <VersionBadge version="2.2.7" label="Animated glTF Model since" icon="tag" />

A glTF Model works like any other mesh. With an Animated glTF Model, the shape follows the animation: particles spawn on the current shared-clock pose, even when the model uses Per-Particle Phase for rendering. The sampling weights (edge lengths and triangle areas) stay those of the rest pose, so a stretched limb gets its unstretched share. See [glTF Models](./gltf-models.md#emission-shapes).

## Ground Snap

<VersionBadge version="2.2.9" label="Since" icon="tag" />

Since 2.2.9, Ground Snap drops every spawn point onto the terrain below it. Use it for dust, debris or grass tufts that should start on the ground under an emitter that floats above it. Turn on **Ground Snap** in the Particle Emitter's Shape module.

Each new particle looks for ground along a straight line from its spawn point and moves onto the first surface it hits.

| Option | Default | Description |
| --- | --- | --- |
| Direction | `WorldDown` | `WorldDown`: straight down. `EmitterDown`: the emitter's -Y, for emitters on walls and ceilings. |
| Max Distance | `8` (0–256) | How far below the spawn point to look for ground, in blocks. |
| Search Above | `1` (0–64) | Start looking this far above the spawn point, so points just under the surface still find it. |
| Offset | `0` (-16–16) | Distance from the surface along its normal. |
| Include Fluids | off | Land on fluid surfaces too. |
| Align To Normal | off | Turns the start velocity so that what the shape aims up leaves the surface along its normal. It matters when the face the search lands on is not square to the search direction, for example with `EmitterDown` on a tilted emitter. |
| Discard Without Ground | off | Removes particles that find no ground within reach, instead of leaving them where the shape put them. |

- The search hits block collision shapes, so slabs and stairs count, and blocks without collision (grass, flowers) do not. Collider objects are not hit.
- When the search starts inside a block (under a low ceiling, inside a tree), it searches again from the spawn point itself.
- The snap happens once, at spawn. To keep particles on the ground afterwards, use [Collision](./collision.md).

## Function Shape

Function Shape evaluates expressions for position and direction. Keep expressions deterministic and guard divisions/square roots against invalid values; a NaN spawn position cannot be rendered or collided safely.
