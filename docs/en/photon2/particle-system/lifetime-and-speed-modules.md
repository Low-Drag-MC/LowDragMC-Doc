# Lifetime and Speed Modules

![The shield project combining color, size, and shader-driven motion](/assets/photon2/editor-shield-overview.webp)

*Lifetime and speed modules are most useful in combination: the shield layers several emitters whose size, color, and motion evolve together.*

Lifetime modules sample with normalized particle age. Speed modules first map current speed through a configured range. They multiply or add to the start values instead of replacing the whole particle state blindly.

## Module Reference

| Module | Input | Effect |
| --- | --- | --- |
| Color over Lifetime | normalized age | Multiply particle color/alpha by a gradient or color function. |
| Size over Lifetime | normalized age | Scale X/Y/Z size. |
| Rotation over Lifetime | normalized age | Add roll, pitch, and yaw about the axes picked by its Space. |
| Velocity over Lifetime | normalized age | Add linear/orbital/radial velocity and speed modification. |
| Force over Lifetime | normalized age | Integrate acceleration into velocity. |
| Color by Speed | remapped speed | Multiply color according to movement speed. |
| Size by Speed | remapped speed | Scale size according to speed. |
| Rotation by Speed | remapped speed | Add rotation according to speed. |
| Lifetime by Emitter Speed | emitter speed | Adjust lifetime assigned at spawn. |
| Fixed Light | normalized age | Set the vanilla Sky Light and Block Light values. See [Fixed Light](./physics-noise-lighting-uv.md#fixed-light). |
| Light Emission | normalized age | Turn a share of the particles into dynamic lights that follow them and fade with them. See [Light Emission](../dynamic-lights/lit-particles-and-shaders.md#light-emission). |

<VersionBadge version="2.2.8" label="Since" icon="tag" /> Light Emission.

## Enable Is a Runtime Value

<VersionBadge version="2.2.0" label="Animatable module enables since" icon="tag" />

Toggle modules expose their enable state through the emitter runtime. Timeline animation can therefore turn a module on and off without rewriting authored config.

## Speed Range

By Speed modules remap the configured minimum and maximum to `0..1` before sampling their function. Keep the range representative of real particle velocity; a range far above actual speed makes the function remain near its first key.

## Value Space

Vector-producing modules may expose a `ValueSpace` field. It picks the axes their values are authored in: `Local`, `World`, or `Custom`. It does not change the emitter's Particle Simulation Space.

<VersionBadge version="2.2.8" label="Since" icon="tag" />

`Custom` shows a **Custom Space** picker. Drag an object from the hierarchy into it, and the values use that object's current axes. While it is unset, or after the object is deleted, `Custom` uses the world axes.

| Module | Field | Default | `Local` | `World` and `Custom` |
| --- | --- | --- | --- | --- |
| Force over Lifetime | Simulation Space | `Local` | The emitter's axes. | World axes, or the object's axes. |
| Velocity over Lifetime | Space | `Local` | The emitter's axes. | World axes, or the object's axes. With `Custom`, the orbital and radial pivot moves to the object's origin. |
| Rotation over Lifetime | Space (new in 2.2.8) | `Local` | The particle's own axes, as before 2.2.8. | Spin about world axes or the object's axes. Applies to the Model, Horizontal, Vertical, and None render modes only. |
| AraTrail Physics | Gravity Space (new in 2.2.8) | `World` | The emitter's axes. | World axes, or the object's axes. |

- For billboard render modes, keep Rotation over Lifetime's Space on `Local`.
- AraTrail files saved before 2.2.8 map Gravity Space from the trail's space, so they look the same.
- A sub-emitter's Inherit Rotation ignores a `World` or `Custom` Rotation over Lifetime.

## Combining Modules

Start Color × Color over Lifetime × Color by Speed produces the effective particle color before material logic. Size follows an equivalent pattern. Rotation and motion modules accumulate contributions.

When debugging:

1. Set the start value to a simple constant.
2. Enable one module.
3. Use a visible linear curve from zero to one.
4. Add the second module only after confirming the first input range.
