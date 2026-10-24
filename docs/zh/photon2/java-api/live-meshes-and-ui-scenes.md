# 动态网格与 UI 场景

本页介绍两个集成点，供在 `.fx` 文件之外使用 Photon 渲染的模组使用：把每帧都在变化的几何体送进 Model 模式的发射器，以及在你自己的 LDLib2 UI 里显示特效。

## 动态网格 {#live-meshes}

<VersionBadge version="2.2.7" label="自" icon="tag" />

`IDynamicMesh` 提供在绘制过程中不断变化的几何体：正在播放动画的蒙皮角色，或者被其他模组在 GPU 上变形的网格。把它包进 `DynamicMeshSource`，安装到渲染模式为 Model 的粒子发射器上，这个发射器的每个粒子就会绘制当前的几何体。

这些类位于 `com.lowdragmc.photon.client.gameobject.emitter.data.model`。

### 接口约定

| 方法 | 是否必需 | 含义 |
| --- | --- | --- |
| `PhotonMesh topology()` | 是 | 不变的部分：顶点数、索引、UV、明暗、Sprite 范围和一个静止姿态。每帧都返回同一个实例；返回新实例会丢掉所有缓存的缓冲区。 |
| `long revision()` | 是 | 当且仅当几何体变化时改变。只要它不变，Photon 就跳过所有工作。从 `1` 开始；`0` 表示拓扑自身的静止姿态。 |
| `float[] geometry()` | CPU 路径 | 当前修订版的位置与法线：每个顶点 `PhotonMesh.FLOATS_PER_GEOMETRY`（6）个 float（`x y z nx ny nz`），按拓扑的顶点顺序排列，总长度正好是 `vertexCount() * 6`。Photon 在上传时会复制它，所以反复使用同一个数组没有问题。数据只存在于 GPU 上时返回 `null`。 |
| `float[] tangents()` | 否 | 当前修订版变形后的切线。返回 `null` 时由 UV 推导，这会为每个修订版在整个网格上重建一次焊接表。发射器使用切线绘制时请提供它。 |
| `int glBuffer()`、`long glByteOffset()`、`boolean glPackedNormals()` | GPU 路径 | 保存当前修订版几何流的 GL 缓冲区，以及第一个顶点的字节偏移。Photon 直接把它绑定为几何流，不复制也不回读。每个顶点是 3 个位置 float 加 3 个法线 float（24 字节）；打包法线时是 3 个 float 加 4 个有符号字节（16 字节）。计算 Pass 写入的缓冲区同样可以绑定。 |
| `void onDrawn()` | 否 | Photon 每绘制一帧这个网格就调用一次。用它让池化的分配保持存活。 |

用 `PhotonMesh.Builder` 构建拓扑。

### 示例

一个上边缘左右摆动的四边形，在 CPU 上计算：

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

    /** 客户端 tick：移动上边缘，然后报告新的修订版。 */
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

把它安装到正在运行的特效中的某个发射器上：

```java
SwayingQuad mesh = new SwayingQuad();

if (runtime.findObject("banner") instanceof ParticleEmitter emitter) {
    var renderer = emitter.runtime().renderer;
    renderer.renderMode.set(ParticleRendererSetting.Mode.Model);
    renderer.model.set(new MeshData(new DynamicMeshSource(mesh)));
    // emitter.runtime().clearRenderOverride() 可恢复为编写时的渲染器设置。
}
```

在客户端 tick 中调用 `mesh.tick(...)`。`DynamicMeshSource` 不会注册，也不会保存；动态网格没有可编写的形式，所以只能作为 [Runtime 覆盖](./runtime-data-injection.md)存在。包装同一个提供者的两个 Source 视为相等。共享同一个提供者的发射器共用一个渲染 Pass、它的缓冲区和上传；不同提供者分开合批。

### 限制

- GL 缓冲区路径只由 GPU 实例化渲染器绘制。为发射器打开 **使用GPU实例**，或设置 `renderer.useGPUInstance`。CPU 路径绘制 `geometry()`；它返回 `null` 时绘制拓扑的静止姿态。
- GL 缓冲区路径不能用作发射形状，因为发射在 CPU 上采样顶点。两者都需要时，请同时提供 `geometry()`。Runtime 层没有 Mesh 发射形状的槽位。
- 在 GL 缓冲区路径上，切线保持静止姿态。

::: warning 线程
- 渲染在渲染线程上读取提供者。请在客户端线程上更新几何体和修订版。
- 如果提供者同时用作发射形状，形状采样可能从并行模拟的工作线程调用 `topology()`、`revision()` 和 `geometry()`。这些方法要开销小且线程安全。
- 只要报告的修订版不变，GL 缓冲区和偏移就必须一直指向同一批顶点。如果子分配器回收了这段内存，Photon 会画出别的模型的顶点，而且不会报任何错。请在 `onDrawn()` 中固定这块分配。
:::

## 在你自己的 UI 中预览特效 {#fx-previews-in-your-own-ui}

<VersionBadge version="2.2.5" label="自" icon="tag" />

LDLib2 的 [`Scene`](../../ldlib2/ui/components/scene.md) 元素在 UI 中渲染一个虚拟世界。给这个世界一个 `PhotonParticleManager`，发射到其中的特效就会像在 Photon 编辑器里一样渲染：

- 后处理效果进入独立的 Stack，而不是世界的 Stack。
- 需要重建世界坐标的后处理效果使用场景的相机。
- Photon 的渲染管线走场景分支，而不是依赖游戏主画面的世界分支。

`FXSceneOptions`（`com.lowdragmc.photon.client`）保存管理器每帧读取的开关。`FXSceneOptions.DEFAULT` 按常规方式渲染场景。

### 最小示例

这是 Photon 编辑器场景自身的设置方式，精简到只播放一个特效：

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
        // 必须在 createScene 之前：场景会把世界的粒子管理器交给它的渲染器。
        level.setParticleManager(particles);
        particles.setLevel(level);

        var scene = new Scene();
        scene.createScene(level).setTickWorld(true);

        FX fx = FXHelper.getFX(fxId);
        if (fx != null) {
            fx.createRuntime().emit(new PreviewExecutor(level));
            particles.play(); // 管理器初始为暂停状态
        }
        return scene;
    }

    private record PreviewExecutor(Level level) implements IEffectExecutor {
        @Override
        public Level getLevel() {
            return level; // DummyWorld：特效会进入它的粒子管理器
        }

        @Override
        public PostEffectStack postEffectSink() {
            return PostEffectStack.EDITOR_SCENE; // Post Process 片段留在场景内
        }
    }
}
```

像其他元素一样把返回的 `Scene` 加进 UI，并通过布局设置大小。特效在虚拟世界的原点播放，也就是场景相机默认注视的位置。如果想显示地面，在世界中放置方块，并把它们的位置传给 `scene.setRenderedCore(...)`。

这些代码要在客户端的 UI 代码中执行，全部运行在渲染线程上。

### 选项

| 方法 | 默认值 | 作用 |
| --- | --- | --- |
| `getDrawMode()` | `SceneView.DrawMode.DRAW` | `DRAW`（着色）、`WIREFRAME`（线框）或 `BOTH`（着色 + 线框）。 |
| `isBloomEnabled()` | `true` | 场景是否执行 Bloom Pass。世界中的 Bloom 仍然遵循模组配置。 |
| `isEffectsEnabled()` | `true` | 场景的后处理链是否执行。 |
| `isMaskViewEnabled()` | `false` | 调试视图：用 Custom Mask 的内容代替场景画面。 |
| `isDynamicLightsEnabled()` | `true` | 场景中的 Light 对象和发射器是否照亮场景。模组配置中的动态光照开关也必须打开。2.2.8 加入。 |

管理器每帧都会读取这些选项，所以 UI 中的开关会立即生效：

```java
public final class PreviewOptions implements FXSceneOptions {
    public boolean bloom = true;

    @Override
    public boolean isBloomEnabled() {
        return bloom;
    }
}
```

把它的实例传给 `new PhotonParticleManager(options)`，代替 `FXSceneOptions.DEFAULT`。

### 重播与跳转

`particles.pause()` 停止场景时钟，`play()` 继续。`particles.clear()` 移除所有粒子并重置时钟；发射到这个管理器中的 Runtime 随之失效，重播时请 Emit 一个新的 Runtime。

要显示某个 tick 的画面，可以像 Photon 编辑器那样重新开始，然后在暂停状态下逐 tick 推进：

```java
particles.clear();
fx.createRuntime().emit(executor);
try {
    for (long i = 0; i < tick; i++) {
        // 跳过逐 tick 的视觉更新，最后两个 tick 除外，因为它们会被绘制
        PhotonParticleManager.setFastSimulation(i < tick - 2);
        particles.tickInternal(); // 暂停时也会执行
    }
} finally {
    PhotonParticleManager.setFastSimulation(false);
}
particles.setTime(tick);
```

开销随 tick 数增长，并且花在渲染线程上，所以拖动播放头时每帧最多跳转一次。
