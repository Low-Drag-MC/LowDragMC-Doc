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

Entity Root 每帧跟随插值后的 Eye Position。

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
- **allowMulti=false** 按 FX Instance 或 FX Location 去重同一 Anchor 上的相同效果。
- **onFinished** 在 Runtime 自然完成、被 Destroy 或因 Particle Engine 清空而失效时只触发一次。

成功 `start()` 前，或 Start 被去重跳过时，`getRuntime()` 可能为 null。后续需要 Runtime/Callback 时保留 Executor 引用，不要直接操作它的静态 Cache。
