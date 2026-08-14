# Runtime Data Injection

<VersionBadge version="2.2.0" label="Runtime property layer" icon="tag" />

![GPU-instance settings inspected in a real Photon project](/assets/photon2/editor-gpu-instance-inspector.webp)

![The corresponding instanced result](/assets/photon2/editor-gpu-instance-scene.webp)

*Runtime injection writes the instance-side slots represented by the Inspector and consumed by modules, renderers, Timeline, or Custom GPU Data.*

Runtime injection changes one playback instance without mutating the authored `.fx` definition. Find the runtime object, check its concrete type, then write its `RuntimeValue` slots.

## Complete Example

```java
package com.example.client;

import com.lowdragmc.photon.client.fx.FXRuntime;
import com.lowdragmc.photon.client.gameobject.IFXObject;
import com.lowdragmc.photon.client.gameobject.emitter.data.RendererSetting;
import com.lowdragmc.photon.client.gameobject.emitter.data.number.Constant;
import com.lowdragmc.photon.client.gameobject.emitter.particle.ParticleEmitter;

public final class PhotonInjection {
    private PhotonInjection() {}

    public static void configure(FXRuntime runtime) {
        IFXObject object = runtime.findObject("sparks");
        if (!(object instanceof ParticleEmitter emitter)) {
            return;
        }

        var values = emitter.runtime();

        // Top-level ParticleConfig slots.
        values.startSpeed.set(new Constant(0.2f));
        values.maxParticles.set(256);

        // Module slots. Enabling and the value are separate overrides.
        values.physics.enable.set(true);
        values.physics.gravity.set(new Constant(0.03f));
        values.emission.emissionRate.set(new Constant(24f));

        // Per-emitter renderer override; identical effective values can still batch.
        values.renderer.layer.set(RendererSetting.Layer.Translucent);
        values.renderer.orderInLayer.set(20);
        values.renderer.writeCustomMask.set(true);
        values.renderer.maskGroup.set("wiki_target");

        // Additional GPU Custom Data: stream 0, X/R channel.
        values.customData.slot(0, 0).set(new Constant(0.85f));
    }

    public static void restoreAuthored(FXRuntime runtime) {
        if (runtime.findObject("sparks") instanceof ParticleEmitter emitter) {
            var values = emitter.runtime();
            values.startSpeed.clear();
            values.maxParticles.clear();
            values.physics.enable.clear();
            values.physics.gravity.clear();
            values.emission.emissionRate.clear();
            values.clearRenderOverride();
            values.customData.slot(0, 0).clear();
        }
    }
}
```

## RuntimeValue Contract

| Method | Result |
| --- | --- |
| `get()` | Effective value: override, otherwise authored fallback |
| `authored()` | Authored config value even while overridden |
| `set(T)` | Set a typed instance override |
| `setRaw(Object)` | Untyped generic path used by Timeline; avoid in normal integration code |
| `clear()` | Remove override and return to authored fallback |
| `isOverridden()` | Whether a non-null override exists |

`null` means “no override”; do not use `set(null)` as data.

## Runtime Types

`ParticleEmitter`, `TrailEmitter`, `BeamEmitter`, and `AraTrailEmitter` each expose `runtime()`. Their runtime layers contain top-level values, module runtimes, renderer overrides, and `CustomDataRuntime` appropriate to that emitter. Do not cast based only on an object name: names are author-controlled and may repeat; always use `instanceof`.

`findObject(name)` returns the first exact name match; `findObjects(name)` returns all matches. For a stable integration contract, give API-facing objects unique names and document them with the effect asset.

## Timing and Ownership

Apply setup overrides after creating the runtime and before `emit()` when possible. For values that must follow gameplay, update on the client tick. Use per-frame updates only for interpolated transforms or render-time values.

Timeline Animation uses the same slots and writes them during evaluation. The last write for a sample wins. A Timeline track that writes every tick/frame will replace a one-time Java value; dedicate separate slots/Custom Data streams or establish one owner.

All runtime and renderer mutations are client-thread work. Do not mutate them from networking, async resource listing, or worker callbacks without scheduling onto the Minecraft client.
