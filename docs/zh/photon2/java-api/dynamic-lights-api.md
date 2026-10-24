# 动态光照 API

<VersionBadge version="2.2.8" label="自" icon="tag" />

`PhotonLights` 可以不借助特效，直接在 Java 中添加动态光源和雾体积：方块上的一盏灯、跟随实体的光、爆炸时的一次闪光。它们照亮世界的方式与[动态光照](../dynamic-lights/index.md)中的光源对象和雾体积对象相同。相关类位于 `com.lowdragmc.photon.client.light`，仅在客户端可用。

```java
// 一盏一直存在、直到被移除的灯；光源是“活”的，随时可以修改
DynamicLight lamp = PhotonLights.add(new DynamicLight().at(x, y, z).color(1f, .5f, .2f).intensity(12).range(10));
lamp.position.set(x, y + 1, z);
PhotonLights.remove(lamp);

// 跟随实体的光，位于脚下往上 1 格
PhotonLights.Handle handle = PhotonLights.attach(entity, new DynamicLight().range(8), new Vec3(0, 1, 0));
handle.close();

// 一个在 10 tick 内淡出的副本
PhotonLights.flash(new DynamicLight().at(x, y, z).intensity(40).range(16), 10);

// 带可见光柱的聚光灯，以及一片让它照射的雾
PhotonLights.add(new DynamicLight().at(x, y, z).spot(15, 25).direction(0, -1, 0).intensity(80).range(24).volumetric(1));
FogVolume mist = PhotonLights.addFog(new FogVolume().at(x, y, z).size(16, 4, 16).density(1.5f));
PhotonLights.removeFog(mist);
```

## PhotonLights

| 方法 | 作用 |
| --- | --- |
| `DynamicLight add(DynamicLight light)` | 添加一个一直存在、直到被移除的光源，返回同一个对象。 |
| `boolean remove(DynamicLight light)` | 移除光源。未添加过时返回 `false`。 |
| `FogVolume addFog(FogVolume fog)` | 添加一个一直存在、直到被移除的雾体积。 |
| `boolean removeFog(FogVolume fog)` | 移除雾体积。 |
| `void addProvider(LightProvider provider)` | 在被移除之前，每帧向提供器索取一次光源。 |
| `void removeProvider(LightProvider provider)` | 按引用移除提供器。 |
| `void addFogProvider(FogProvider provider)` | 雾体积版本的提供器。 |
| `void removeFogProvider(FogProvider provider)` | |
| `PhotonLights.Handle attach(Entity entity, DynamicLight template, Vec3 offset)` | 跟随实体插值后的位置加上 `offset`，直到实体消失或句柄关闭。模板保持“活”的状态：修改模板就会改变光源。模板自身的位置会被忽略。 |
| `void flash(DynamicLight template, int durationTicks)` | 显示模板的一个副本，在 `durationTicks` 内淡出。没有 level、时长不大于 0 或动态光照关闭时什么也不做。 |
| `boolean isEnabled()` | 客户端配置中的 **启用动态光照** 是否开启。 |
| `boolean isVolumetricEnabled()` | 光晕、光柱和雾体积此刻是否可见。配置可以全局关闭它们，也可以只在光影包下关闭。没有它们时，光源照样照亮表面。 |

`PhotonLights.Handle` 实现了 `AutoCloseable`：`close()` 提前停止光源，`isClosed()` 返回它是否已经停止。

### 提供器

提供器每帧在剔除之前被调用一次。每次 `sink.next()` 都从对象池返回一个已重置的 `DynamicLight`，只在本帧结束前有效。光源集合每帧都在变化时，使用提供器。

```java
LightProvider embers = (sink, partialTick) -> {
    for (Vec3 p : glowingPoints) {
        sink.next().at(p.x, p.y, p.z).color(1f, 0.4f, 0.1f).intensity(4).range(3);
    }
};
PhotonLights.addProvider(embers);
// 之后用同一个引用移除
PhotonLights.removeProvider(embers);
```

`FogProvider` 用法相同：实现 `submitFog(FogSink sink, float partialTick)`，`sink.next()` 返回一个已重置的 `FogVolume`。

## DynamicLight

可变的光源对象。随时修改它的公开字段，下一帧就会生效。

| 字段 | 类型 | 默认值 | 含义 |
| --- | --- | --- | --- |
| `type` | `DynamicLight.Type` | `POINT` | `POINT` 或 `SPOT`。 |
| `position` | `Vector3d` | (0, 0, 0) | 世界坐标。 |
| `color` | `Vector3f` | (1, 1, 1) | 线性 RGB，会乘上 `intensity`。 |
| `intensity` | `float` | 8 | 亮度。光照随距离的平方衰减。 |
| `range` | `float` | 10 | 光照衰减到零的距离（方块）。 |
| `direction` | `Vector3f` | (0, -1, 0) | 仅聚光灯：光锥在世界空间中的方向，长度任意。 |
| `innerAngle` | `float` | 20 | 仅聚光灯：完全照亮的核心区域的半角（度）。 |
| `outerAngle` | `float` | 30 | 仅聚光灯：光锥衰减到零处的半角（度）。 |
| `sourceRadius` | `float` | 0.15 | 发光球体的半径（方块）。0 为硬阴影。 |
| `castShadows` | `boolean` | `true` | 本帧是否参与阴影名额的竞争。 |
| `volumetric` | `float` | 0 | 空气中的光晕强度：0 没有，1 为一层淡淡的光雾。 |
| `enabled` | `boolean` | `true` | 为 `false` 时跳过这个光源，但不移除它。 |

链式设置方法都返回光源本身：`at(x, y, z)`、`color(r, g, b)`、`intensity(f)`、`range(f)`、`sourceRadius(f)`、`shadows(boolean)`、`volumetric(f)`、`point()`、`spot(innerAngle, outerAngle)`、`direction(x, y, z)`。`set(other)` 从另一个光源复制全部字段；`reset()` 恢复默认值。

与光源对象的颜色和强度填相同的数值，得到的光也相同。不过 Java 的默认值与光源对象不同：强度是 8 而不是 10，外角是 30 而不是 35。

## FogVolume

可变的盒形或球形雾区，未设置尺寸时边长为 1 格。

| 字段 | 类型 | 默认值 | 含义 |
| --- | --- | --- | --- |
| `shape` | `FogVolume.Shape` | `BOX` | `BOX` 或 `SPHERE`。 |
| `position` | `Vector3d` | (0, 0, 0) | 中心的世界坐标。 |
| `axes` | `Matrix3f` | 单位矩阵 | 形状的局部坐标轴（以世界方块为单位）：旋转乘以尺寸。 |
| `density` | `float` | 1 | 雾的浓度。1 是一层淡雾。 |
| `edgeFalloff` | `float` | 0.3 | 从形状表面向内，雾逐渐变淡的那部分所占的比例。 |
| `color` | `Vector3f` | (1, 1, 1) | 雾散射光时的颜色。 |
| `absorption` | `float` | 0.5 | 雾在多大程度上遮住后面的东西，0 到 1。 |
| `emission` | `Vector3f` | (0, 0, 0) | 雾自身发出的光，按密度缩放。 |
| `noise` | `float` | 0 | 流动噪声打散雾的程度，0 到 1。 |
| `noiseScale` | `float` | 2 | 噪声团块的大小（方块）。 |
| `noiseOffset` | `Vector3f` | (0, 0, 0) | 噪声已经移动的距离（世界方块）。 |
| `enabled` | `boolean` | `true` | 为 `false` 时跳过这个雾体积，但不移除它。 |

链式设置方法：`at(x, y, z)`、`size(x, y, z)`、`rotate(Quaternionfc)`、`shape(Shape)`、`density(f)`、`color(r, g, b)`、`absorption(f)`、`emission(r, g, b)`、`edgeFalloff(f)`、`noise(strength, scale)`，以及 `set(other)` 和 `reset()`。`size` 设置的是未旋转的尺寸，会覆盖之前的旋转，所以要在它之后再调用 `rotate`。

噪声不会自己移动。每个 tick 或每帧稍微改变 `noiseOffset`，噪声才会飘动。雾体积对象把它设为 `-风 × 秒数`，所以雾丝会沿着风的方向飘。

## 生命周期与线程

::: warning 仅客户端、渲染线程，并且由你负责清理
- 这里的所有类都标注了 `@OnlyIn(Dist.CLIENT)`。只能在仅客户端加载的代码中引用，并在客户端线程上调用。在网络处理器中，先把工作调度到客户端线程。
- `add`、`addFog`、`addProvider` 和 `addFogProvider` 持有强引用。它们的光源会跨越 level 切换一直存在，直到你移除为止；请自行移除，例如在 `LevelEvent.Unload` 时。
- `PhotonLights` 的光源和雾只出现在客户端世界中，不会出现在编辑器或 UI 场景里。
- `attach` 会在实体被移除或切换 level 时自动结束。
- 闪光无法取消。level 卸载时会清空所有闪光。
- 从 sink 取得的光源或雾体积下一帧会被复用，不要保留对它的引用。
:::

## 覆盖已制作好的光源 {#override-an-authored-light}

要修改美术在 `.fx` 中放置的光源或雾体积，先在 Runtime 中找到这个对象，再写入它的 `RuntimeValue` 槽位。这只影响这一次播放。

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

| 对象 | `runtime()` 槽位 |
| --- | --- |
| `LightObject` | `color`、`intensity`、`range`、`volumetricStrength`（`NumberFunction`）；`innerAngle`、`outerAngle`、`sourceRadius`、`flicker`（`Float`）；`castShadows`、`volumetricEnable`（`Boolean`） |
| `FogVolumeObject` | `density`、`color`、`emission`（`NumberFunction`）；`absorption`、`edgeFalloff`（`Float`） |
| `ParticleEmitter` | `runtime().lightEmission`：`enable`（`Boolean`）；`color`、`intensity`、`range`（`NumberFunction`） |

`LightObject` 和 `FogVolumeObject` 位于 `com.lowdragmc.photon.client.gameobject.light`。`clear()` 让槽位回到制作时的值。发射（emit）会重置对象并清空覆盖值，所以要在 `start()` 之后再设置。作用在同一属性上的 Timeline 轨道会覆盖你写入的值。移动或调整光源朝向请通过它的 Transform，见 [Runtime Object 与 Transform](./runtime-objects-and-transforms.md) 和 [Runtime 数据注入](./runtime-data-injection.md)。

## UI 场景与其他 level {#ui-scenes}

特效里的光源属于特效所在的 level，所以编辑器场景和世界各自只照亮自己的内容。对于客户端世界以外的 level，例如 UI 场景的 `DummyWorld`，用 `DynamicLightManager.addProvider(level, provider)` 和 `removeProvider(level, provider)`（以及 `addFogProvider` / `removeFogProvider`）为这个 level 注册提供器。它们以弱引用持有提供器：你需要自己保留一个强引用。

其他模组的 UI 场景如果通过 `PhotonParticleManager` 渲染特效，只有在这个管理器知道所在 level 时，才会被自己特效中的光源对象和粒子发光照亮。请像 Photon 编辑器那样自行调用 `manager.setLevel(level)`；LDLib2 的 `DummyWorld.setParticleManager` 不会设置它。`FXSceneOptions.isDynamicLightsEnabled()`（默认 `true`）可以为某个场景关闭光照。见 [Live Mesh 与 UI 场景](./live-meshes-and-ui-scenes.md)。

## 完整示例

一个仅客户端的类：点亮一座神龛、在它周围铺一层薄雾、让某个实体发光、在爆发时闪光，并在 level 卸载时清理。

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
        // 让薄雾的雾丝以每秒 0.4 格的速度沿 +X 飘动
        if (mist != null) mist.noiseOffset.x -= 0.4f / 20f;
    }

    @SubscribeEvent
    public static void onLevelUnload(LevelEvent.Unload event) {
        // PhotonLights 的光源会跨 level 保留
        if (event.getLevel().isClientSide()) clear();
    }
}
```
