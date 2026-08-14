# FX Hierarchy and Transforms

![The FX Hierarchy panel from a real project](/assets/photon2/editor-timeline-hierarchy.webp)

*Hierarchy nodes own transforms and runtime state; children inherit the effective state of their parents.*

Every runtime has an always-present `root` object. Authored FX objects are parented under it directly or through Empty objects. Parent transforms, active state, visibility, and time scale affect the whole subtree.

## Why Use Empty Objects

Use an Empty to:

- move or rotate several emitters as one unit;
- animate a shared pivot on the Timeline;
- activate, restart, or change speed for a subtree;
- give Java code a stable named control point.

## Transform Rules

Each `FXObject` owns an LDLib2 `Transform` with position, rotation, scale, parent, and ordered children. Scene gizmos edit the local transform. The world transform is resolved through the parent chain.

| Operation | Result |
| --- | --- |
| Reparent while preserving world transform | Local values are recalculated so the object stays in place. |
| Move a parent | Local-space children move with it. |
| Rotate a parent | Child positions and orientations rotate around the parent pivot. |
| Scale a parent | Child transforms inherit the scale. |

## Active, Visible, and Time Scale

- `selfActive=false` stops ticking and rendering this object and its descendants.
- `selfTimelineVisible=false` hides rendering without changing the authored `selfVisible` state.
- `selfTimeScale` multiplies simulation time; children inherit the hierarchical value.
- A Timeline Control Clip can reset and reseed an entire subtree when the clip begins.

## Names and UUIDs

Objects persist with UUIDs, which Timeline bindings use. Names are human-facing and may repeat, although unique names are strongly recommended for Java lookup.

```java
var muzzle = runtime.findObject("muzzle");
var sparks = runtime.findObjects("spark");
```

`findObject` returns the first matching object; `findObjects` returns every match. Use UUID-based references inside serialized data and unique names in integration code.

## Simulation Space Is Separate

Transform inheritance says where the emitter is. Particle simulation space says where already-spawned particle state is stored. In `WORLD` space, moving the emitter does not drag old particles with it. See [Simulation and Forces](./simulation-and-forces.md).
