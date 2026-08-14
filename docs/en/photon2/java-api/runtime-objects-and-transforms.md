# Runtime Objects and Transforms

![A transformed object hierarchy rendered in the tornado project](/assets/photon2/editor-tornado-overview.webp)

*Runtime transforms update the live object tree shown in the editor; they do not mutate the shared authored `FX` definition.*

Every runtime owns an always-present Empty root with UUID `FXRuntime.ROOT_UUID`. Authored objects are parented under that root when no explicit parent exists.

## Lookup

```java
IFXObject byId = runtime.getSceneObject(uuid);
IFXObject firstNamed = runtime.findObject("muzzle");
List<IFXObject> allNamed = runtime.findObjects("spark");
IFXObject root = runtime.getRoot();
```

UUID is the stable identity used by parent references and Timeline targets. Names are convenient integration labels but are not enforced unique. Unknown UUID/name returns `null` (or an empty list for `findObjects`).

## Updating Transforms

```java
object.updatePos(new Vector3f(x, y, z));
object.updateRotation(new Quaternionf().rotationXYZ(rx, ry, rz)); // radians
object.updateScale(new Vector3f(sx, sy, sz));
```

The `IFXEffectExecutor.setRotation(x, y, z)` convenience overload accepts degrees; `IFXObject.updateRotation(Vector3f)` and JOML `rotationXYZ` use radians. Mixing these is a common 57.3× rotation error.

Transforms participate in the authored parent hierarchy. Updating an Empty parent moves/rotates/scales its descendants; local/world/custom simulation space determines whether already-spawned particles follow that change.

## Tick vs Frame Callback

In a custom executor:

- `updateFXObjectTick` is for lifecycle checks, discrete game state, and deterministic simulation inputs.
- `updateFXObjectFrame` receives `partialTicks` and is for smooth anchor transforms.

Both callbacks run for emitted FX objects. Filter to `runtime.root` when the work should execute only once per runtime instead of once per object.

## Do Not Edit Shared Config

The objects in a normal `FXRuntime` own a runtime copy and named `RuntimeValue` layers. Prefer those layers. Directly modifying a loaded `FX` definition or an internal runtime can affect future playback, invalidate renderer batching assumptions, and conflict with Timeline restoration. RuntimeValue preserves the authored fallback and makes `clear()` deterministic.
