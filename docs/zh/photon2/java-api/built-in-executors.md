# 内置 Effect Executor

![由 Executor 启动并绑定到方块的 Tornado 效果](/assets/photon2/fx-tornado.webp)

*`BlockEffectExecutor` 提供世界锚点；`EntityEffectExecutor` 则从实体和可选 Auto Rotate 模式更新锚点。*

效果绑定方块或实体时，优先使用内置 Executor。所有选项在 `start()` 前设置；`start()` 会创建并 Emit Runtime。

## 方块锚点

```java
FX fx = FXHelper.getFX(ResourceLocation.parse("mymod:block_aura"));
if (fx != null) {
    BlockEffectExecutor executor = new BlockEffectExecutor(fx, level, pos);
    executor.setOffset(0, 0.5, 0);
    executor.setScale(1.25, 1.25, 1.25);
    executor.setDelay(4);
    executor.setCheckState(true);
    executor.setForcedDeath(false);
    executor.setAllowMulti(false);
    executor.setOnFinished(runtime -> onAuraEnded());
    executor.start();
}
```

Root 位于方块中心再加 Offset。Chunk Unload、方块类型改变，或开启 `checkState` 后完整 BlockState 改变时，Executor 会结束 Runtime。

## 实体锚点

```java
EntityEffectExecutor executor = new EntityEffectExecutor(
        fx, level, entity, EntityEffectExecutor.AutoRotate.LOOK);
executor.setOffset(0, -0.25, 0);
executor.setRotation(0, 90, 0); // Degree Convenience Overload
executor.setForcedDeath(true);
executor.start();
```

Entity Root 每帧跟随插值后的 Eye Position。从 2.2.9 起，该 Executor 还会把实体报告为特效的[所有者](./custom-executors-timeline-and-signals.md#owner-entity)，因此 Beam 射线检测和开启 **忽略施放者** 的粒子碰撞都会跳过它。

| AutoRotate | 行为 |
| --- | --- |
| `NONE` | 只使用配置 Quaternion |
| `FORWARD` | 按 Entity Forward Vector 旋转 |
| `LOOK` | 按 View/Look Vector 旋转 |
| `XROT` | 使用 Photon X-oriented 约定应用 Entity Visual Yaw |

## 通用选项

- **offset/rotation/scale** 修改 Runtime Root Transform。
- **delay** 在 Emit/Reset 后赋给每个 Object，单位 Tick。
- **forcedDeath** 控制 Anchor 消失后的处理：`true` 立即移除残留，`false` 让已有粒子自然消散。
- **allowMulti=false** 对同一 Anchor 上的相同效果去重：同一个 `FX` 定义对象，或同一个 FX ID。
- **onFinished** 在 Runtime 自然完成、被 Destroy 或因 Particle Engine 清空而失效时只触发一次。

<VersionBadge version="2.2.9" label="Changed" icon="tag" />

`allowMulti=false` 时，`start()` 不再总是被跳过。从 2.2.9 起，如果正在运行的相同效果播放的是旧的一次加载，而其定义此后已被重新加载（资源重载、FX Pack 被改写），新的 `start()` 会停止它并播放当前定义。

成功 `start()` 前，或 Start 被去重跳过时，`getRuntime()` 可能为 null。后续需要 Runtime/Callback 时保留 Executor 引用，不要直接操作它的静态 Cache。
