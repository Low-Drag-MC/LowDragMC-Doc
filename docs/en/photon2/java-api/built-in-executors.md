# Built-in Effect Executors

![A block-anchored tornado effect started by an executor](/assets/photon2/fx-tornado.webp)

*`BlockEffectExecutor` supplies a world anchor; `EntityEffectExecutor` updates that anchor from an entity and optional auto-rotation mode.*

Use the built-in executors when an effect follows a block or entity. Configure them before `start()`; `start()` creates and emits the runtime.

## Block Anchor

```java
FX fx = FXHelper.getFX(ResourceLocation.parse("mymod:block_aura"));
if (fx != null) {
    BlockEffectExecutor executor = new BlockEffectExecutor(fx, level, pos);
    executor.setOffset(0, 0.5, 0);
    executor.setScale(1.25, 1.25, 1.25);
    executor.setDelay(4);
    executor.setCheckState(true);
    executor.setForcedDeath(false);
    executor.setAllowMulti(false);
    executor.setOnFinished(runtime -> onAuraEnded());
    executor.start();
}
```

The root is centered at the block plus offset. The executor retires the runtime when the chunk unloads, block type changes, or—with `checkState`—the exact BlockState changes.

## Entity Anchor

```java
EntityEffectExecutor executor = new EntityEffectExecutor(
        fx, level, entity, EntityEffectExecutor.AutoRotate.LOOK);
executor.setOffset(0, -0.25, 0);
executor.setRotation(0, 90, 0); // degrees convenience overload
executor.setForcedDeath(true);
executor.start();
```

The entity root follows interpolated eye position every frame.

| AutoRotate | Behavior |
| --- | --- |
| `NONE` | Keep only the configured quaternion |
| `FORWARD` | Rotate from the entity's forward vector |
| `LOOK` | Rotate from the view/look vector |
| `XROT` | Apply the entity visual yaw using Photon's X-oriented convention |

## Shared Options

- **offset/rotation/scale** transform the runtime root.
- **delay** is assigned to every object after emit/reset, in ticks.
- **forcedDeath** controls anchor loss: `true` removes remnants immediately; `false` lets existing particles drain.
- **allowMulti=false** deduplicates an equal effect on the same anchor by FX instance or FX location.
- **onFinished** fires once when the runtime finishes, is destroyed, or becomes invalid because the particle engine discarded it.

`getRuntime()` is nullable before a successful `start()` and when start is skipped. Keep the executor if later code needs its runtime or callback; avoid reaching into the static executor caches.
