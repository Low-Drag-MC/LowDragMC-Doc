# Activator, Control, and Speed Tracks

![Multiple runtime behaviors arranged on the Timeline](/assets/photon2/editor-timeline-panel.webp)

*Activator, Control, and Speed tracks share the same clock but resolve object state in a defined order.*

These tracks change whether simulation runs, when an object restarts, and how much simulation time it consumes.

## Activator Track

An Activator Track targets one FX object. The object is active while any Activator Clip covers the current time. Outside the clips it is inactive and neither ticks nor renders.

<VersionBadge version="2.2.9" label="Since" icon="tag" /> Every object except the root has a saved **Enabled** switch in the Inspector. A disabled object stays off; an Activator Clip does not wake it.

## Control Track

Control Clips target objects individually. Entering or switching to a Control Clip:

1. resets the target object;
2. recursively resets its FXObject children;
3. applies the clip seed or a fresh executor RNG seed;
4. activates/renders it for the clip range.

Control is suitable for sequencing several one-shot emitters on one lane or replaying the same subtree with deliberate seeds.

## Activator and Control Together

`TimelineState.resolve` considers whether each control type exists and whether it is active at the current time. Do not assume one simply overrides the other. Preview the exact combination; removing or muting a controlling track restores objects that are no longer controlled.

## Speed Track

Speed Track samples a scalar and writes the target's `selfTimeScale`. Children inherit the hierarchical time scale.

| Speed | Result |
| --- | --- |
| `0` | Freeze simulation while retaining the object. |
| `0..1` | Slow motion. |
| `1` | Normal tick rate. |
| `>1` | Multiple bounded simulation substeps per game tick. |

The runtime limits substeps per tick to keep extreme values from creating unbounded work. Speeds beyond the cap cannot simulate arbitrary time in one tick.

<VersionBadge version="2.2.7" label="Since" icon="tag" /> Java code can also change the speed of a whole runtime with `FXRuntime#setRate`, which scales the objects and the Timeline clock together. A Speed Track that targets the root wins over the rate for the ticks it covers. See [FXRuntime Lifecycle](../java-api/fxruntime-lifecycle.md).

## FX Instances

<VersionBadge version="2.2.9" label="Since" icon="tag" />

An [FX instance](../fx-instances.md) plays its source's Timeline on its own clock. The outer tracks drive that clock like any object state:

- a Control clip that restarts the instance, or one of its parents, starts the clock at `0`;
- an Activator Track that turns the instance off pauses the clock, and it continues when the instance turns on again;
- a Speed Track on the instance or a parent scales the clock.

When the outer Timeline and the source drive the same object and channel, the outer Timeline wins. See [FX Instances](../fx-instances.md#timeline) for the full rules.

## State Restoration

When a Speed Track is removed, muted, or rebound, the previously controlled object's scale returns to `1`. Activator/Control state likewise returns to active and visible when the object is no longer controlled.

::: tip Parent targeting
Bind Control or Speed to an Empty parent when the whole child effect should restart or change speed together.
:::
