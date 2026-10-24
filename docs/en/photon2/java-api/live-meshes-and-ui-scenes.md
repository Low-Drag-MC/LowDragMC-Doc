# Live Meshes and UI Scenes

This page covers two integration points for mods that render with Photon outside an authored `.fx` file: feeding geometry that changes every frame into a Model-mode emitter, and showing an effect inside your own LDLib2 UI.

## Live Meshes

<VersionBadge version="2.2.7" label="Since" icon="tag" />

An `IDynamicMesh` supplies geometry that changes while it is drawn: a skinned character in the middle of an animation, or a mesh that another mod deforms on the GPU. Wrap it in a `DynamicMeshSource` and install it on a particle emitter in Model render mode. Every particle of that emitter then draws the current geometry.

The classes are in `com.lowdragmc.photon.client.gameobject.emitter.data.model`.

### The Contract

| Method | Required | Meaning |
| --- | --- | --- |
| `PhotonMesh topology()` | Yes | The part that does not change: vertex count, indices, UVs, shade, sprite bounds and a rest pose. Return the same instance every frame; a new instance throws away every cached buffer. |
| `long revision()` | Yes | Changes when, and only when, the geometry changes. Photon skips all work while it stays the same. Start at `1`; `0` means the topology's own rest pose. |
| `float[] geometry()` | CPU path | This revision's positions and normals: `PhotonMesh.FLOATS_PER_GEOMETRY` (6) floats per vertex (`x y z nx ny nz`), in the topology's vertex order, exactly `vertexCount() * 6` floats. Photon copies it during the upload, so reusing one array is fine. Return `null` when the data exists only on the GPU. |
| `float[] tangents()` | No | This revision's deformed tangents. `null` derives them from the UVs, which rebuilds a weld map over the whole mesh for every revision. Supply them if the emitter draws with tangents. |
| `int glBuffer()`, `long glByteOffset()`, `boolean glPackedNormals()` | GPU path | A GL buffer that holds this revision's geometry stream, and the byte offset of the first vertex. Photon binds it directly as its geometry stream, with no copy and no readback. Each vertex is 3 position floats plus 3 normal floats (24 bytes), or with packed normals 3 floats plus 4 signed bytes (16 bytes). A buffer written by a compute pass can be bound as well. |
| `void onDrawn()` | No | Called once per frame in which Photon drew the mesh. Use it to keep a pooled allocation alive. |

Build the topology with `PhotonMesh.Builder`.

### Example

A quad whose top edge sways, computed on the CPU:

```java
public final class SwayingQuad implements IDynamicMesh {
    private final PhotonMesh topology;
    private final float[] rest;
    private final float[] geometry;
    private long revision = 1;

    public SwayingQuad() {
        var builder = new PhotonMesh.Builder();
        // vertex(x, y, z, u, v, nx, ny, nz, shade)
        int a = builder.vertex(-0.5f, -0.5f, 0, 0, 1, 0, 0, 1, 1);
        int b = builder.vertex(0.5f, -0.5f, 0, 1, 1, 0, 0, 1, 1);
        int c = builder.vertex(0.5f, 0.5f, 0, 1, 0, 0, 0, 1, 1);
        int d = builder.vertex(-0.5f, 0.5f, 0, 0, 0, 0, 0, 1, 1);
        builder.quad(a, b, c, d);
        topology = builder.build();
        rest = topology.geometry().clone();
        geometry = rest.clone();
    }

    @Override public PhotonMesh topology() { return topology; }
    @Override public long revision() { return revision; }
    @Override public float[] geometry() { return geometry; }

    /** Client tick: move the top edge, then report a new revision. */
    public void tick(float time) {
        float sway = Mth.sin(time * 0.2f) * 0.25f;
        for (int v = 0; v < topology.vertexCount(); v++) {
            int o = PhotonMesh.geometryOffset(v);
            geometry[o] = rest[o] + (rest[o + 1] > 0 ? sway : 0);
        }
        revision++;
    }
}
```

Install it on an emitter of a running effect:

```java
SwayingQuad mesh = new SwayingQuad();

if (runtime.findObject("banner") instanceof ParticleEmitter emitter) {
    var renderer = emitter.runtime().renderer;
    renderer.renderMode.set(ParticleRendererSetting.Mode.Model);
    renderer.model.set(new MeshData(new DynamicMeshSource(mesh)));
    // emitter.runtime().clearRenderOverride() returns to the authored renderer.
}
```

Call `mesh.tick(...)` from your client tick. A `DynamicMeshSource` is not registered and not saved; a live mesh has no authored form, so it exists only as a [runtime override](./runtime-data-injection.md). Two sources are equal when they wrap the same provider. Emitters that share one provider share one render pass, its buffers and its upload; different providers batch apart.

### Limits

- The GL buffer path is drawn only by the GPU-instanced renderer. Turn on **Use GPU Instance** for the emitter, or set `renderer.useGPUInstance`. The CPU path draws `geometry()`, or the topology's rest pose when that returns `null`.
- The GL buffer path cannot feed an emission shape, because emission samples vertices on the CPU. Supply `geometry()` too if you need both. The runtime layer has no slot for the Mesh emission shape.
- On the GL buffer path, tangents stay at the rest pose.

::: warning Threading
- Rendering reads the provider on the render thread. Update the geometry and the revision on the client thread.
- If the provider also feeds an emission shape, shape sampling can call `topology()`, `revision()` and `geometry()` from parallel simulation workers. Keep them cheap and thread-safe.
- Keep the GL buffer and offset pointing at the same vertices for as long as you report the same revision. If a suballocator recycles the slice, Photon draws another model's vertices without any error. Pin the allocation from `onDrawn()`.
:::

## FX Previews in Your Own UI

<VersionBadge version="2.2.5" label="Since" icon="tag" />

LDLib2's [`Scene`](../../ldlib2/ui/components/scene.md) element renders a dummy world inside a UI. Give that world a `PhotonParticleManager`, and an effect emitted into it renders the way it does in Photon's editor:

- Post effects go to an isolated stack, not to the world's.
- Post effects that reconstruct world positions use the scene's camera.
- Photon's render pipeline takes its scene branch instead of the world branch, which expects the game's own frame.

`FXSceneOptions` (`com.lowdragmc.photon.client`) holds the switches that the manager reads every frame. `FXSceneOptions.DEFAULT` renders the scene normally.

### Minimal Example

This is the setup Photon's own editor scene uses, reduced to one effect:

```java
package com.example.client;

import com.lowdragmc.lowdraglib2.gui.ui.elements.Scene;
import com.lowdragmc.lowdraglib2.utils.virtuallevel.TrackedDummyWorld;
import com.lowdragmc.photon.client.FXSceneOptions;
import com.lowdragmc.photon.client.PhotonParticleManager;
import com.lowdragmc.photon.client.fx.FX;
import com.lowdragmc.photon.client.fx.FXHelper;
import com.lowdragmc.photon.client.fx.IEffectExecutor;
import com.lowdragmc.photon.client.postfx.runtime.PostEffectStack;
import net.minecraft.resources.ResourceLocation;
import net.minecraft.world.level.Level;

public final class FxPreview {
    private FxPreview() {}

    public static Scene create(ResourceLocation fxId) {
        var level = new TrackedDummyWorld();
        var particles = new PhotonParticleManager(FXSceneOptions.DEFAULT);
        // Before createScene: the scene hands the level's particle manager to its renderer.
        level.setParticleManager(particles);
        particles.setLevel(level);

        var scene = new Scene();
        scene.createScene(level).setTickWorld(true);

        FX fx = FXHelper.getFX(fxId);
        if (fx != null) {
            fx.createRuntime().emit(new PreviewExecutor(level));
            particles.play(); // the manager starts paused
        }
        return scene;
    }

    private record PreviewExecutor(Level level) implements IEffectExecutor {
        @Override
        public Level getLevel() {
            return level; // a DummyWorld: the effect goes into its particle manager
        }

        @Override
        public PostEffectStack postEffectSink() {
            return PostEffectStack.EDITOR_SCENE; // Post Process clips stay in the scene
        }
    }
}
```

Add the returned `Scene` to your UI like any other element and size it with its layout. The effect plays at the origin of the dummy world, where the scene's camera looks by default. To show a floor, place blocks in the level and pass their positions to `scene.setRenderedCore(...)`.

Do this on the client, from UI code. Everything here runs on the render thread.

### Options

| Method | Default | Effect |
| --- | --- | --- |
| `getDrawMode()` | `SceneView.DrawMode.DRAW` | `DRAW` (shaded), `WIREFRAME`, or `BOTH` (shaded + wireframe). |
| `isBloomEnabled()` | `true` | Whether the scene runs its bloom pass. Bloom in the world still follows the mod config. |
| `isEffectsEnabled()` | `true` | Whether the scene's post-effect chain runs at all. |
| `isMaskViewEnabled()` | `false` | Debug view: shows the Custom Mask contents instead of the scene. |
| `isDynamicLightsEnabled()` | `true` | Whether the scene's Light objects and emitters light it. The dynamic lights switch in the mod config must be on too. Added in 2.2.8. |

The manager reads the options every frame, so a toggle in your UI takes effect at once:

```java
public final class PreviewOptions implements FXSceneOptions {
    public boolean bloom = true;

    @Override
    public boolean isBloomEnabled() {
        return bloom;
    }
}
```

Pass an instance to `new PhotonParticleManager(options)` instead of `FXSceneOptions.DEFAULT`.

### Restart and Seek

`particles.pause()` stops the scene clock and `play()` resumes it. `particles.clear()` removes every particle and resets the clock; runtimes emitted into the manager become invalid, so emit a new runtime to replay.

To show a given tick, restart and run the ticks while paused, the way Photon's editor does:

```java
particles.clear();
fx.createRuntime().emit(executor);
try {
    for (long i = 0; i < tick; i++) {
        // skip per-tick visual updates, except in the last two ticks, which are drawn
        PhotonParticleManager.setFastSimulation(i < tick - 2);
        particles.tickInternal(); // runs even while paused
    }
} finally {
    PhotonParticleManager.setFastSimulation(false);
}
particles.setTime(tick);
```

The cost grows with the tick count and is spent on the render thread, so seek at most once per frame while a playhead is dragged.
