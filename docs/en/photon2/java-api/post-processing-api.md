# Post Processing Java API

<VersionBadge version="2.2.0" label="Since" icon="tag" />

![RGB-shift post effect submitted through the runtime stack](/assets/photon2/post-rgb-shift.webp)

*Java requests use the same Render Graph assets as Timeline clips and must be submitted for every frame in which the effect should remain active.*

Submit an effect every render frame in which it should be visible.

```java
IResourcePath effect = PhotonPostFX.parsePath("built-in:wiki_tint_effect");

PhotonPostFX.submit(effect, Map.of(
        "Tint", new Vector4f(1.0f, 0.35f, 0.2f, 1.0f),
        "Strength", 0.8f
), 0.65f);
```

`parsePath` accepts a full `type(path)` form or a built-in resource name. `listEffectPaths()` returns requestable Render Graph and bare Fullscreen Graph paths, matching `/photonfx list`.

## Per-frame Request Model

`submit(effect, params, weight)` queues only the current frame. Weight is clamped to `0..1`; null effect and non-positive weight are ignored. Stop submitting and the effect disappears next frame.

Submit from the client render-frame path appropriate to your ownership—not a server tick. If gameplay state is calculated on ticks, cache the state and submit its interpolated/render-safe value per frame.

## Parameters

Parameter keys are exposed display names. Values may be `Float`, `Vector2f`, `Vector3f`, `Vector4f`, integer color, Boolean, and other types defined by the graph schema. Unknown/wrongly typed values fall back or fail resolution according to that parameter; consult the graph's Blackboard.

## Multiple Requests

Requests for the same effect normally merge. Weight combines as `1 - Π(1 - wᵢ)`; lerpable parameters blend in ascending weight order, while non-lerpable values use the highest-weight request. Add reserved `Independent=true` only when each request must execute separately.

Mask-filtered requests can include the reserved mask filter parameter used by Timeline. Prefer Timeline UI or a shared integration helper instead of hard-coding internal reserved strings.

## Isolated Stack

An executor can return a dedicated `PostEffectStack` from `postEffectSink()` for a separately rendered scene. Submit directly through `stack.submit(...)` in that context. `PhotonPostFX.submit(...)` always targets the global world stack.

Post effects also run when no Photon particle was drawn: the standalone pipeline consumes pending global requests over the main target. Iris/shader-pack execution moves to the compatible late render hook and obeys Photon client configuration.
