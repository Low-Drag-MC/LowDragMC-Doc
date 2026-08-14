# FXRuntime Lifecycle

![A water effect produced by one live FXRuntime instance](/assets/photon2/fx-water-demo.webp)

*The authored `FX` remains reusable; each executor creates a runtime whose emit, tick, render, destroy, and finish states are independent.*

An `FX` is loaded authored data. An `FXRuntime` is one playable object tree plus its own `TimelinePlayer` and runtime override slots.

## Creating an Instance

| Method | Meaning |
| --- | --- |
| `fx.createRuntime()` | Normal runtime copy; use for playback |
| `fx.createRuntime(true)` | Deep-copy authored object data before runtime construction |
| `fx.createInternalRuntime()` | Uses raw `FXData`; reserved for controlled internal/editor ownership |

Do not use `createInternalRuntime()` for ordinary gameplay. Mutating its object data can modify the loaded definition shared with later playbacks.

## Emit and Destroy

```java
FXRuntime runtime = fx.createRuntime();
runtime.emit(executor);          // or emit(executor, delayTicks)

// Later:
runtime.destroy(false);          // stop future work, let remnants drain
runtime.destroy(true);           // remove visible remnants immediately
```

Emit sends every object to the selected particle host and resets Timeline. A later `emit()` can revive a destroyed runtime, which the editor uses for replay; gameplay code usually creates a new runtime instead.

<VersionBadge version="2.2.0" label="`emit` spelling" icon="tag" />

`emmit(...)` remains deprecated for source compatibility. Migrate to `emit(...)`; there is no behavior difference.

## State Queries

| Query | Meaning |
| --- | --- |
| `isFinished()` | Timeline has no future content and no object is still playing |
| `isAlive()` | Convenience inverse of `isFinished()` |
| `isValid()` | Runtime is emitted, not destroyed, and still tracked by its particle host |

A looping emitter never finishes naturally. `isValid()` solves a different problem from `isFinished()`: world changes, `/photon_client clear_particles`, or another engine wipe can discard particles without letting the runtime finish. The check uses the particle host generation plus a root heartbeat and is cheap enough for a cached-runtime guard.

```java
if (cachedRuntime == null || !cachedRuntime.isValid()) {
    cachedRuntime = fx.createRuntime();
    cachedRuntime.emit(executor);
}
```

Before the first emit and after `destroy`, `isValid()` is false. After non-forced destroy, `isFinished()` becomes true only after visible remnants drain.
