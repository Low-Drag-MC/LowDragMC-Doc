# Runtime 数据注入

<VersionBadge version="2.2.0" label="Runtime Property Layer" icon="tag" />

![真实 Photon 项目中查看的 GPU Instance 配置](/assets/photon2/editor-gpu-instance-inspector.webp)

![对应的 Instanced 渲染结果](/assets/photon2/editor-gpu-instance-scene.webp)

*Runtime 注入写入 Instance 侧 Slot；这些值会被 Module、Renderer、Timeline 或 Custom GPU Data 消费。*

Runtime 注入只修改一次播放 Instance，不会改写 `.fx` Authored Definition。先查找 Runtime Object，检查具体类型，再写入其 `RuntimeValue` Slot。

## 完整示例

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

        // 顶层 ParticleConfig Slot。
        values.startSpeed.set(new Constant(0.2f));
        values.maxParticles.set(256);

        // Module Slot。Enable 与 Value 是两个独立 Override。
        values.physics.enable.set(true);
        values.physics.gravity.set(new Constant(0.03f));
        values.emission.emissionRate.set(new Constant(24f));

        // 逐 Emitter Renderer Override；有效值相同仍可 Batch。
        values.renderer.layer.set(RendererSetting.Layer.Translucent);
        values.renderer.orderInLayer.set(20);
        values.renderer.writeCustomMask.set(true);
        values.renderer.maskGroup.set("wiki_target");

        // Additional GPU Custom Data：Stream 0，X/R Channel。
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

## RuntimeValue 约定

| 方法 | 结果 |
| --- | --- |
| `get()` | 有 Override 时返回 Override，否则 Authored Fallback |
| `authored()` | 即使被覆盖，也返回 Authored Config Value |
| `set(T)` | 设置带类型的 Instance Override |
| `setRaw(Object)` | Timeline Generic Path 使用；普通集成代码不要用 |
| `clear()` | 删除 Override，恢复 Authored Fallback |
| `isOverridden()` | 是否存在非 null Override |

`null` 表示“没有 Override”，不要把 `set(null)` 当作数据。

## Runtime 类型

`ParticleEmitter`、`TrailEmitter`、`BeamEmitter`、`AraTrailEmitter` 都暴露 `runtime()`。各 Runtime Layer 保存适用于该发射器的顶层值、Module Runtime、Renderer Override 和 `CustomDataRuntime`。不要只根据名字 Cast：名字由作者控制且可能重复，必须使用 `instanceof`。

`findObject(name)` 返回首个完全匹配；`findObjects(name)` 返回全部。需要稳定 API Contract 时，为对外对象使用唯一名字，并在效果资源旁记录这些名字。

## 注入时机与所有权

能提前配置的值应在 Runtime 创建后、`emit()` 前设置。跟随 Gameplay 的值在 Client Tick 更新；只有插值 Transform 或 Render-time Value 才每帧更新。

Timeline Animation 写的是同一批 Slot，并在求值时重复写入。一个 Sample 内最后写入生效；Timeline 每 Tick/Frame 驱动的值会覆盖 Java 的一次性值。请分配独立 Slot/Custom Data Stream，或只让一个系统拥有该值。

所有 Runtime/Renderer 修改都属于 Client Thread。Network、异步资源列表或 Worker Callback 不能直接写入，应调度回 Minecraft Client。
