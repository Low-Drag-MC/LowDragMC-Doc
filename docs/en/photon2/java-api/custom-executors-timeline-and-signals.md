# Custom Executors, Timeline, and Signals

![Timeline playback coordinated with a live FXRuntime](/assets/photon2/editor-timeline-overview.webp)

*A custom executor owns the runtime clock and can receive the same signals authored on the visible Timeline.*

Implement `IEffectExecutor` when the FX is not naturally anchored to a block/entity or when your system owns its lifetime.

## Executor Skeleton

```java
public final class OwnedExecutor implements IEffectExecutor {
    private final ClientLevel level;
    private final RandomSource random = RandomSource.create(1234L);
    private FXRuntime runtime;

    public OwnedExecutor(ClientLevel level) {
        this.level = level;
    }

    @Override public Level getLevel() { return level; }
    @Override public RandomSource getRandomSource() { return random; }

    @Override
    public void updateFXObjectTick(IFXObject object) {
        if (runtime != null && object == runtime.root && shouldStop()) {
            runtime.destroy(false);
        }
    }

    @Override
    public void updateFXObjectFrame(IFXObject object, float partialTicks) {
        if (runtime != null && object == runtime.root) {
            runtime.root.updatePos(interpolatedPosition(partialTicks));
        }
    }

    @Override
    public void onTimelineSignal(String channel, String name,
                                 CompoundTag data, double time) {
        handleSignal(channel, name, data);
    }

    public void start(FX fx) {
        runtime = fx.createRuntime();
        runtime.emit(this);
    }
}
```

Store and destroy the runtime you own. Returning a stable `RandomSource` makes repeated authored random functions reproducible where their semantics allow it.

## Owner Entity

<VersionBadge version="2.2.9" label="Since" icon="tag" />

```java
@Override
public Entity owner() {
    return caster; // the entity this effect belongs to, or null
}
```

`owner()` names the entity an effect belongs to. Beam raycasts skip it, and particle collision skips it while the emitter's **Ignore Owner** option is on, so a mob's own effect does not bounce off the mob. The default returns `null`. `EntityEffectExecutor` already returns its entity. Photon calls it on the game thread.

## Collision Events

<VersionBadge version="2.2.9" label="Since" icon="tag" />

```java
if (runtime.findObject("sparks") instanceof ParticleEmitter sparks) {
    ParticleEmitter.CollisionListener listener = (emitter, particle, event) -> {
        if (event.type() == CollisionEvent.Type.IMPACT && event.target() instanceof Entity hit) {
            // client side: play a sound, or send your own packet to the server
        }
    };
    sparks.addCollisionListener(listener);
    // sparks.removeCollisionListener(listener) once you no longer need it
}
```

A collision listener receives the contacts of one emitter's particles while collision is on for that emitter: `IMPACT`, `DEATH`, `TRIGGER_ENTER` and `TRIGGER_EXIT`. Listeners run on the game thread at the end of the emitter's tick, and the emitter's de-duplication applies to impacts and deaths. Each runtime has its own copy of the emitter, so add the listener to every runtime you want to hear from. `CollisionEvent` is in `com.lowdragmc.photon.client.collision`; see [Particle Collision](../particle-system/collision.md#events-and-sub-emitters) for its fields and the authoring side.

## Signals

Signal Track events fire only during live forward playback, not arbitrary editor scrubbing/fast seek. They first call the originating executor's `onTimelineSignal`, then notify global listeners:

```java
PhotonSignals.Listener listener = (effect, channel, name, data, time) -> {
    // Client thread: copy data if retaining it beyond the callback.
};

PhotonSignals.register(listener);
// On mod/client shutdown or owner disposal:
PhotonSignals.unregister(listener);
```

The callback supplies Track display name as `channel`, Signal name, `CompoundTag` data, and master-clock tick. Always unregister global listeners to avoid leaking their owner.

## Custom Post-effect Sink

Timeline Post Process clips call `postEffectSink()` every active frame. The default is `PostEffectStack.GLOBAL`. Override it for an isolated preview/off-screen context that owns another stack; the editor does this so preview effects never leak into the world render.

Do not consume the stack yourself unless you also own the full render target lifecycle. Ordinary mods should submit to it and let Photon's render pipeline execute it.
