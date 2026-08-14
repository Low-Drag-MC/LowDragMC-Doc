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
