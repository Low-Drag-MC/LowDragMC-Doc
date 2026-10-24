# 自定义 Executor、Timeline 与 Signal

![Timeline Playback 与存活 FXRuntime 协同运行](/assets/photon2/editor-timeline-overview.webp)

*自定义 Executor 持有 Runtime Clock，并能接收图中 Timeline 编写的同一批 Signal。*

FX 不适合绑定方块/实体，或你的系统需要完整拥有其生命周期时，实现 `IEffectExecutor`。

## Executor 骨架

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

保存并 Destroy 自己拥有的 Runtime。返回稳定 `RandomSource`，可让允许确定性的 Authored Random Function 在重复播放时重现。

## 所有者实体 {#owner-entity}

<VersionBadge version="2.2.9" label="自" icon="tag" />

```java
@Override
public Entity owner() {
    return caster; // 这个特效所属的实体，或 null
}
```

`owner()` 指明特效属于哪个实体。Beam 的射线检测会跳过它；发射器开启 **忽略施放者** 时，粒子碰撞也会跳过它，这样生物自己的特效就不会从自己身上弹开。默认返回 `null`。`EntityEffectExecutor` 已经返回它绑定的实体。Photon 在游戏线程上调用这个方法。

## 碰撞事件 {#collision-events}

<VersionBadge version="2.2.9" label="自" icon="tag" />

```java
if (runtime.findObject("sparks") instanceof ParticleEmitter sparks) {
    ParticleEmitter.CollisionListener listener = (emitter, particle, event) -> {
        if (event.type() == CollisionEvent.Type.IMPACT && event.target() instanceof Entity hit) {
            // 客户端：播放音效，或自行向服务端发送数据包
        }
    };
    sparks.addCollisionListener(listener);
    // 不再需要时调用 sparks.removeCollisionListener(listener)
}
```

碰撞监听器在某个发射器开启碰撞时接收其粒子的接触事件：`IMPACT`、`DEATH`、`TRIGGER_ENTER` 和 `TRIGGER_EXIT`。监听器在发射器 tick 结束时于游戏线程上运行，发射器的去重设置作用于撞击和死亡事件。每个 Runtime 都有自己的发射器副本，所以要在每个需要监听的 Runtime 上添加监听器。`CollisionEvent` 位于 `com.lowdragmc.photon.client.collision`；它的字段和编辑器一侧的设置见[粒子碰撞](../particle-system/collision.md#events-and-sub-emitters)。

## Signal

Signal Track 只在实时向前播放时触发，不会在任意 Editor Scrub/Fast Seek 时触发。事件先调用来源 Executor 的 `onTimelineSignal`，再通知 Global Listener：

```java
PhotonSignals.Listener listener = (effect, channel, name, data, time) -> {
    // Client Thread；需要在 Callback 后保存时 Copy Data。
};

PhotonSignals.register(listener);
// Mod Client Shutdown 或 Owner Dispose：
PhotonSignals.unregister(listener);
```

Callback 提供作为 `channel` 的 Track Display Name、Signal Name、`CompoundTag` Data 与 Master Clock Tick。Global Listener 必须 Unregister，避免泄漏 Owner。

## 自定义 Post-effect Sink

Timeline Post Process Clip 在每个有效 Frame 调用 `postEffectSink()`。默认返回 `PostEffectStack.GLOBAL`。独立 Preview/Off-screen Context 拥有自己的 Stack 时可以覆盖；编辑器正是这样避免 Preview Effect 泄漏到世界渲染。

除非你同时拥有完整 Render Target 生命周期，否则不要自己 Consume Stack。普通 Mod 只负责 Submit，由 Photon Render Pipeline 执行。
