# Dynamic Lights API

<VersionBadge version="2.2.8" label="Since" icon="tag" />

`PhotonLights` adds dynamic lights and fog volumes from Java, without an FX: a lamp on a block, a glow that follows an entity, a flash for an explosion. They light the world the same way as the Light and Fog Volume objects described in [Dynamic Lights](../dynamic-lights/index.md). The classes are in `com.lowdragmc.photon.client.light` and are client-only.

```java
// a lamp that stays until removed; lights are live, so change them whenever you like
DynamicLight lamp = PhotonLights.add(new DynamicLight().at(x, y, z).color(1f, .5f, .2f).intensity(12).range(10));
lamp.position.set(x, y + 1, z);
PhotonLights.remove(lamp);

// a light that follows an entity, 1 block above its feet
PhotonLights.Handle handle = PhotonLights.attach(entity, new DynamicLight().range(8), new Vec3(0, 1, 0));
handle.close();

// a copy that fades out over 10 ticks
PhotonLights.flash(new DynamicLight().at(x, y, z).intensity(40).range(16), 10);

// a spot light with a visible beam, and a fog bank for it to shine through
PhotonLights.add(new DynamicLight().at(x, y, z).spot(15, 25).direction(0, -1, 0).intensity(80).range(24).volumetric(1));
FogVolume mist = PhotonLights.addFog(new FogVolume().at(x, y, z).size(16, 4, 16).density(1.5f));
PhotonLights.removeFog(mist);
```

## PhotonLights

| Method | What it does |
| --- | --- |
| `DynamicLight add(DynamicLight light)` | Adds a light that stays until removed. Returns the same object. |
| `boolean remove(DynamicLight light)` | Removes it. `false` if it was not added. |
| `FogVolume addFog(FogVolume fog)` | Adds a fog volume that stays until removed. |
| `boolean removeFog(FogVolume fog)` | Removes it. |
| `void addProvider(LightProvider provider)` | Asks the provider for lights once per frame until it is removed. |
| `void removeProvider(LightProvider provider)` | Removes a provider by identity. |
| `void addFogProvider(FogProvider provider)` | The same for fog volumes. |
| `void removeFogProvider(FogProvider provider)` | |
| `PhotonLights.Handle attach(Entity entity, DynamicLight template, Vec3 offset)` | Follows the entity's interpolated position plus `offset` until the entity is gone or the handle is closed. The template stays live: changing it changes the light. Its own position is ignored. |
| `void flash(DynamicLight template, int durationTicks)` | Shows a copy of the template that fades out over `durationTicks`. Does nothing without a level, with a duration of 0 or less, or while dynamic lights are off. |
| `boolean isEnabled()` | Whether **Enable dynamic lights** is on in the client config. |
| `boolean isVolumetricEnabled()` | Whether halos, beams and fog volumes show right now. The config can turn them off everywhere or only under shader packs. Lights still light surfaces without them. |

`PhotonLights.Handle` implements `AutoCloseable`: `close()` stops the light early, and `isClosed()` reports whether it has stopped.

### Providers

A provider is called once per frame, before culling. Each `sink.next()` returns a reset `DynamicLight` from a pool, valid until the end of the frame. Use a provider when the set of lights changes every frame.

```java
LightProvider embers = (sink, partialTick) -> {
    for (Vec3 p : glowingPoints) {
        sink.next().at(p.x, p.y, p.z).color(1f, 0.4f, 0.1f).intensity(4).range(3);
    }
};
PhotonLights.addProvider(embers);
// later, with the same reference
PhotonLights.removeProvider(embers);
```

`FogProvider` works the same way: `submitFog(FogSink sink, float partialTick)`, with `sink.next()` returning a reset `FogVolume`.

## DynamicLight

A mutable light. Change its public fields at any time; the next frame uses them.

| Field | Type | Default | Meaning |
| --- | --- | --- | --- |
| `type` | `DynamicLight.Type` | `POINT` | `POINT` or `SPOT`. |
| `position` | `Vector3d` | (0, 0, 0) | World position. |
| `color` | `Vector3f` | (1, 1, 1) | Linear RGB, multiplied by `intensity`. |
| `intensity` | `float` | 8 | Brightness. Light falls off with the square of the distance. |
| `range` | `float` | 10 | Distance in blocks at which the light reaches zero. |
| `direction` | `Vector3f` | (0, -1, 0) | Spot only: the cone's world-space direction, any length. |
| `innerAngle` | `float` | 20 | Spot only: half-angle in degrees of the fully lit core. |
| `outerAngle` | `float` | 30 | Spot only: half-angle in degrees where the cone fades to zero. |
| `sourceRadius` | `float` | 0.15 | Emitting sphere radius in blocks. 0 casts hard shadows. |
| `castShadows` | `boolean` | `true` | Whether the light competes for a shadow this frame. |
| `volumetric` | `float` | 0 | Glow in the air: 0 none, 1 a light haze. |
| `enabled` | `boolean` | `true` | `false` skips the light without removing it. |

Fluent setters return the light: `at(x, y, z)`, `color(r, g, b)`, `intensity(f)`, `range(f)`, `sourceRadius(f)`, `shadows(boolean)`, `volumetric(f)`, `point()`, `spot(innerAngle, outerAngle)`, `direction(x, y, z)`. `set(other)` copies every field from another light; `reset()` restores the defaults.

The same numbers as a Light object's Color and Intensity give the same light. The Java defaults differ from the Light object's: intensity 8 instead of 10, outer angle 30 instead of 35.

## FogVolume

A mutable box or sphere of fog, 1 block across before it is sized.

| Field | Type | Default | Meaning |
| --- | --- | --- | --- |
| `shape` | `FogVolume.Shape` | `BOX` | `BOX` or `SPHERE`. |
| `position` | `Vector3d` | (0, 0, 0) | World position of the centre. |
| `axes` | `Matrix3f` | identity | The shape's local axes in world blocks: rotation times size. |
| `density` | `float` | 1 | How thick the fog is. 1 is a light mist. |
| `edgeFalloff` | `float` | 0.3 | The share of the shape, from its surface inwards, over which the fog thins out. |
| `color` | `Vector3f` | (1, 1, 1) | The colour the fog scatters light with. |
| `absorption` | `float` | 0.5 | How much the fog hides what lies behind it, 0 to 1. |
| `emission` | `Vector3f` | (0, 0, 0) | Light the fog gives off on its own, scaled by its density. |
| `noise` | `float` | 0 | How much moving noise breaks the fog up, 0 to 1. |
| `noiseScale` | `float` | 2 | The size of the noise blobs in blocks. |
| `noiseOffset` | `Vector3f` | (0, 0, 0) | How far the noise has moved, in world blocks. |
| `enabled` | `boolean` | `true` | `false` skips the volume without removing it. |

Fluent setters: `at(x, y, z)`, `size(x, y, z)`, `rotate(Quaternionfc)`, `shape(Shape)`, `density(f)`, `color(r, g, b)`, `absorption(f)`, `emission(r, g, b)`, `edgeFalloff(f)`, `noise(strength, scale)`, plus `set(other)` and `reset()`. `size` sets an unrotated size and replaces any earlier rotation, so call `rotate` after it.

The noise does not move by itself. Change `noiseOffset` a little every tick or frame to make it drift. The Fog Volume object sets it to `-wind × seconds`, so wisps drift along `wind`.

## Lifecycle and Threads

::: warning Client only, render thread, and you own the cleanup
- Every class here is `@OnlyIn(Dist.CLIENT)`. Reference it only from client-only code, and call it on the client thread. From a network handler, schedule the work onto the client thread first.
- `add`, `addFog`, `addProvider` and `addFogProvider` hold strong references. Their lights stay across level changes until you remove them; remove them yourself, for example on `LevelEvent.Unload`.
- Lights and fog from `PhotonLights` show only in the client world, never in the editor or in UI scenes.
- `attach` ends by itself when the entity is removed or changes level.
- A flash cannot be cancelled. Flashes are cleared when the level unloads.
- A light or fog volume taken from a sink is reused next frame. Do not keep a reference to it.
:::

## Override an Authored Light {#override-an-authored-light}

To change a Light or Fog Volume that an artist placed in an `.fx`, find the object in the runtime and write its `RuntimeValue` slots. This changes one playback only.

```java
import com.lowdragmc.photon.client.fx.BlockEffectExecutor;
import com.lowdragmc.photon.client.fx.FX;
import com.lowdragmc.photon.client.fx.FXHelper;
import com.lowdragmc.photon.client.fx.FXRuntime;
import com.lowdragmc.photon.client.gameobject.emitter.data.number.NumberFunction;
import com.lowdragmc.photon.client.gameobject.light.LightObject;

FX fx = FXHelper.getFX(ResourceLocation.parse("mymod:campfire"));
if (fx != null) {
    BlockEffectExecutor executor = new BlockEffectExecutor(fx, level, pos);
    executor.start();
    FXRuntime runtime = executor.getRuntime();
    if (runtime != null && runtime.findObject("lamp") instanceof LightObject lamp) {
        var values = lamp.runtime();
        values.intensity.set(NumberFunction.constant(30));
        values.range.set(NumberFunction.constant(16));
        values.castShadows.set(false);
    }
}
```

| Object | `runtime()` slots |
| --- | --- |
| `LightObject` | `color`, `intensity`, `range`, `volumetricStrength` (`NumberFunction`); `innerAngle`, `outerAngle`, `sourceRadius`, `flicker` (`Float`); `castShadows`, `volumetricEnable` (`Boolean`) |
| `FogVolumeObject` | `density`, `color`, `emission` (`NumberFunction`); `absorption`, `edgeFalloff` (`Float`) |
| `ParticleEmitter` | `runtime().lightEmission`: `enable` (`Boolean`); `color`, `intensity`, `range` (`NumberFunction`) |

`LightObject` and `FogVolumeObject` are in `com.lowdragmc.photon.client.gameobject.light`. `clear()` returns a slot to the authored value. Emitting resets the objects and clears their overrides, so set them after `start()`. A Timeline track on the same property writes over your value. Move or aim the light through its transform; see [Runtime Objects and Transforms](./runtime-objects-and-transforms.md) and [Runtime Data Injection](./runtime-data-injection.md).

## UI Scenes and Other Levels {#ui-scenes}

FX lights belong to the level their FX plays in, so the editor scene and the world each light only their own. For a level other than the client world, such as the `DummyWorld` of a UI scene, register a provider for that level with `DynamicLightManager.addProvider(level, provider)` and `removeProvider(level, provider)` (and `addFogProvider` / `removeFogProvider`). These hold the provider weakly: keep your own strong reference to it.

A UI scene from another mod that renders FX through `PhotonParticleManager` is lit by its own Light objects and Light Emission only when the manager knows its level. Call `manager.setLevel(level)` yourself, as Photon's editor does; LDLib2's `DummyWorld.setParticleManager` does not set it. `FXSceneOptions.isDynamicLightsEnabled()` (default `true`) turns the lights off for a scene. See [Live Meshes and UI Scenes](./live-meshes-and-ui-scenes.md).

## Complete Example

A client-only class that lights a shrine, adds a mist around it, gives an entity a glow, flashes on a burst, and cleans up when the level unloads.

```java
package com.example.client;

import com.lowdragmc.photon.client.light.DynamicLight;
import com.lowdragmc.photon.client.light.FogVolume;
import com.lowdragmc.photon.client.light.PhotonLights;
import net.minecraft.core.BlockPos;
import net.minecraft.world.entity.Entity;
import net.minecraft.world.phys.Vec3;
import net.neoforged.api.distmarker.Dist;
import net.neoforged.bus.api.SubscribeEvent;
import net.neoforged.fml.common.EventBusSubscriber;
import net.neoforged.neoforge.client.event.ClientTickEvent;
import net.neoforged.neoforge.event.level.LevelEvent;
import org.jetbrains.annotations.Nullable;

@EventBusSubscriber(modid = "examplemod", value = Dist.CLIENT)
public final class ShrineLights {
    @Nullable
    private static DynamicLight lamp;
    @Nullable
    private static FogVolume mist;
    @Nullable
    private static PhotonLights.Handle aura;

    private ShrineLights() {}

    public static void light(BlockPos pos) {
        clear();
        double x = pos.getX() + 0.5, y = pos.getY() + 1.5, z = pos.getZ() + 0.5;
        lamp = PhotonLights.add(new DynamicLight().at(x, y, z)
                .color(1f, 0.55f, 0.2f).intensity(12).range(10).volumetric(0.5f));
        mist = PhotonLights.addFog(new FogVolume().at(x, y - 1, z)
                .size(12, 2, 12).density(1.5f).noise(0.6f, 3f));
    }

    public static void glow(Entity entity) {
        if (aura != null) aura.close();
        aura = PhotonLights.attach(entity,
                new DynamicLight().color(0.3f, 0.6f, 1f).intensity(6).range(6), new Vec3(0, 1, 0));
    }

    public static void burst(Vec3 at) {
        PhotonLights.flash(new DynamicLight().at(at.x, at.y, at.z)
                .color(1f, 0.8f, 0.4f).intensity(40).range(16), 10);
    }

    public static void clear() {
        if (lamp != null) PhotonLights.remove(lamp);
        if (mist != null) PhotonLights.removeFog(mist);
        if (aura != null) aura.close();
        lamp = null;
        mist = null;
        aura = null;
    }

    @SubscribeEvent
    public static void onClientTick(ClientTickEvent.Post event) {
        // drift the mist's wisps 0.4 blocks per second along +X
        if (mist != null) mist.noiseOffset.x -= 0.4f / 20f;
    }

    @SubscribeEvent
    public static void onLevelUnload(LevelEvent.Unload event) {
        // PhotonLights keeps its lights across levels
        if (event.getLevel().isClientSide()) clear();
    }
}
```
