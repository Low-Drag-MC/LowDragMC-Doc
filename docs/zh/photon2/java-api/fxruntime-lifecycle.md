# FXRuntime 生命周期

![由一个存活 FXRuntime Instance 生成的水效果](/assets/photon2/fx-water-demo.webp)

*Authored `FX` 可重复使用；每个 Executor 创建的 Runtime 拥有独立 Emit、Tick、Render、Destroy 与 Finish 状态。*

`FX` 是加载的 Authored Data；`FXRuntime` 是一次可播放的对象树，拥有独立 `TimelinePlayer` 和 Runtime Override Slot。

## 创建 Instance

| 方法 | 含义 |
| --- | --- |
| `fx.createRuntime()` | 普通 Runtime Copy，播放时使用 |
| `fx.createRuntime(true)` | 构建 Runtime 前 Deep Copy Authored Object Data |
| `fx.createInternalRuntime()` | 直接使用 Raw `FXData`，只供受控的内部/编辑器所有权 |

普通游戏逻辑不要使用 `createInternalRuntime()`。修改其对象数据可能影响与后续播放共享的已加载 Definition。

## Emit 与 Destroy

```java
FXRuntime runtime = fx.createRuntime();
runtime.emit(executor);          // 或 emit(executor, delayTicks)

runtime.destroy(false);          // 停止未来工作，残留自然消散
runtime.destroy(true);           // 立即移除可见残留
```

Emit 会把每个 Object 发送给目标 Particle Host 并重置 Timeline。之后再次 `emit()` 可以复活已 Destroy Runtime，编辑器 Replay 会使用这一行为；Gameplay 通常直接创建新 Runtime。

<VersionBadge version="2.2.0" label="`emit` 拼写" icon="tag" />

`emmit(...)` 只为源码兼容而保留并已 Deprecated。迁移到 `emit(...)`，二者行为相同。

## 状态查询

| 查询 | 含义 |
| --- | --- |
| `isFinished()` | Timeline 已无未来内容，且没有 Object 仍在 Playing |
| `isAlive()` | `isFinished()` 的便捷反值 |
| `isValid()` | 已 Emit、未 Destroy，并仍由 Particle Host 追踪 |

Looping Emitter 不会自然 Finished。`isValid()` 与 `isFinished()` 解决的问题不同：切换世界、`/photon_client clear_particles` 或其他 Engine Wipe 可能直接清空粒子，Runtime 没机会完成。该检查使用 Host Generation 与 Root Heartbeat，适合每 Tick 检查缓存 Runtime。

```java
if (cachedRuntime == null || !cachedRuntime.isValid()) {
    cachedRuntime = fx.createRuntime();
    cachedRuntime.emit(executor);
}
```

首次 Emit 前及 Destroy 后，`isValid()` 为 false。非强制 Destroy 后，要等可见残留消散，`isFinished()` 才变为 true。
