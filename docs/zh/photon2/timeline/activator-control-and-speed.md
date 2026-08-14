# Activator、Control 与 Speed Track

![在 Timeline 上编排的多种 Runtime 行为](/assets/photon2/editor-timeline-panel.webp)

*Activator、Control 与 Speed Track 共用同一时钟，但会按确定顺序解析对象状态。*

这些 Track 改变 Simulation 是否运行、对象何时重启，以及消耗多少 Simulation Time。

## Activator Track

Activator Track 绑定一个 FX Object。当前时间被任意 Activator Clip 覆盖时，对象 Active；Clip 之外对象 Inactive，既不 tick 也不渲染。

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

## 状态恢复

Speed Track 被删除、Mute 或重新绑定后，之前 Target 的 Scale 恢复为 `1`。Activator/Control 不再控制对象时，Active 与 Visible 也会恢复。

::: tip 绑定 Parent
整个子效果需要一起 Restart 或改变 Speed 时，把 Control/Speed 绑定到 Empty Parent。
:::
