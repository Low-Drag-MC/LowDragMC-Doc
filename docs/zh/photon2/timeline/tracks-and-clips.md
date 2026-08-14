# Track 与 Clip

![排列在 Photon Timeline 中的 Track 与 Clip](/assets/photon2/editor-timeline-panel.webp)

*左侧树保存 Track 状态与目标绑定；右侧 Lane 保存 Clip 时间范围和各类 Item。*

`Track` 拥有 Timing Item 和可选 Target 信息。`Clip` 有 start、duration 和 local time；部分 Track 使用 Marker 或 Signal，而不是普通 Clip。

## Track 结构

所有 Track 都提供 Display Name 和 Mute 状态。Targeted Track 保存 FX Object UUID。Track Group 包含子 Track，可以整理大型 Timeline，而不改变 Target Object Hierarchy。

## Clip 时间

| 值 | 含义 |
| --- | --- |
| `start` | Clip 开始的 Master Timeline tick。 |
| `duration` | 长度，单位为 tick。 |
| local time | `masterTime - start`，用于采样 Clip Envelope/Property。 |
| seed | Control Clip Restart 使用的确定 Seed。 |
| random seed | Restart 时从 Executor RNG 获取新 Seed。 |

Clip 边界是否包含端点由各 Track Lookup 定义，但相邻 Clip 应当首尾相接，不要重叠。

## Target Binding

把 FX Object 从 Hierarchy 拖到 Target Slot，或使用 Picker。Animation、Activator、Speed 和 Audio Track 在 Track 级绑定。Control Clip 可以按 Clip 设置 Target，因此同一 Lane 能依次播放多个对象。

## 编辑操作

- 拖动 Clip Body 可以移动。
- Clip 类型支持时，拖动 Edge Handle 可以调整长度。
- 右键菜单提供 Copy、Paste、Duplicate 和 Remove。
- Mute Track 会停止其贡献，并恢复不再受控制的 Runtime Value/State。

## 禁止重叠

一次解析一个 Active Clip 的 Track 不允许 Clip 重叠。Drag、Resize 和 Paste 使用同一套验证。被拒绝的编辑不会改变原位置。

## 序列化

Track Type 通过 `photon:timeline_track` Registry 保存。Clip Data 保存 Timing 和类型专用字段。Runtime Target 被删除后，UUID Lookup 可能找不到对象；它会安全失效，但应在编辑器中重新绑定。
