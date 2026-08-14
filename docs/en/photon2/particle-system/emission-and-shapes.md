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
| Mesh | vertices/triangles from a mesh source | Emit from authored model geometry. |
| Function | expressions for position/direction | Procedural paths and mathematical volumes. |

## Arc

Circle-like shapes can restrict their angular range and choose how that range is traversed. Arc modes provide random distribution or ordered progression; loop, ping-pong, spread, and speed controls determine how emission advances.

## Radius Thickness

A thickness of `0` emits on the outer surface. Larger values allow points further toward the center. Use a shell for readable outlines and a filled volume for clouds or explosions.

## Mesh Sources

<VersionBadge version="2.2.0" label="Universal mesh sources since" icon="tag" />

Mesh shapes use the same source model as Model rendering: built-in primitives, OBJ, Minecraft JSON model, or a reusable Mesh Resource. This avoids maintaining separate shape and renderer meshes.

## Function Shape

Function Shape evaluates expressions for position and direction. Keep expressions deterministic and guard divisions/square roots against invalid values; a NaN spawn position cannot be rendered or collided safely.
