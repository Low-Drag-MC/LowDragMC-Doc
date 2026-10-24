# Activator、Control 与 Speed Track

![在 Timeline 上编排的多种 Runtime 行为](/assets/photon2/editor-timeline-panel.webp)

*Activator、Control 与 Speed Track 共用同一时钟，但会按确定顺序解析对象状态。*

这些 Track 改变 Simulation 是否运行、对象何时重启，以及消耗多少 Simulation Time。

## Activator Track

Activator Track 绑定一个 FX Object。当前时间被任意 Activator Clip 覆盖时，对象 Active；Clip 之外对象 Inactive，既不 tick 也不渲染。

<VersionBadge version="2.2.9" label="自" icon="tag" /> 除 root 外，每个对象的 Inspector 中都有一个会保存的 **启用**（Enabled）开关。被禁用的对象始终保持关闭，Activator Clip 也无法唤醒它。

## Control Track

Control Clip 分别绑定 Target。进入或切换到 Control Clip 时：

1. Reset Target Object；
2. 递归 Reset 其 FXObject Child；
3. 应用 Clip Seed，或从 Executor RNG 获取新 Seed；
4. 在 Clip 范围内启用并渲染。

Control 适合在同一 Lane 中依次播放多个 One-shot Emitter，或使用明确 Seed 重放同一子树。

## 同时使用 Activator 与 Control

`TimelineState.resolve` 会同时考虑两种控制是否存在、当前是否 Active。不能简单认为一个覆盖另一个。应预览实际组合；删除或 Mute 控制 Track 后，不再受控的对象会恢复状态。

## Speed Track

Speed Track 采样标量，并写入 Target `selfTimeScale`。Child 继承层级 Time Scale。

| Speed | 结果 |
| --- | --- |
| `0` | 保留对象但冻结 Simulation。 |
| `0..1` | 慢动作。 |
| `1` | 正常 Tick Rate。 |
| `>1` | 每个 Game Tick 执行多个有上限的 Simulation Substep。 |

Runtime 会限制每 tick Substep 数，避免极端值产生无限工作。超过上限的 Speed 不能在一个 tick 内模拟任意长时间。

<VersionBadge version="2.2.7" label="自" icon="tag" /> Java 代码也可以用 `FXRuntime#setRate` 改变整个 Runtime 的速度，它会同时缩放对象和 Timeline 时钟。绑定 root 的 Speed Track 在它覆盖的 tick 内优先于这个速率。见 [FXRuntime 生命周期](../java-api/fxruntime-lifecycle.md)。

## FX 实例

<VersionBadge version="2.2.9" label="自" icon="tag" />

[FX 实例](../fx-instances.md)在自己的时钟上播放源特效的 Timeline。外层 Track 像控制其他对象状态一样驱动这个时钟：

- 重启实例或其父对象的 Control Clip，会让时钟从 `0` 开始；
- 关闭实例的 Activator Track 会暂停时钟，实例重新打开后继续；
- 作用于实例或其父对象的 Speed Track 会缩放时钟。

外层 Timeline 和源驱动同一对象的同一通道时，外层优先。完整规则见 [FX 实例](../fx-instances.md#timeline)。

## 状态恢复

Speed Track 被删除、Mute 或重新绑定后，之前 Target 的 Scale 恢复为 `1`。Activator/Control 不再控制对象时，Active 与 Visible 也会恢复。

::: tip 绑定 Parent
整个子效果需要一起 Restart 或改变 Speed 时，把 Control/Speed 绑定到 Empty Parent。
:::
