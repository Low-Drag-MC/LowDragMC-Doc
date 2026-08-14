# Timeline 编辑器与播放

![最大化窗口中的 Timeline 面板，包含 Track Tree、Ruler、Clip、Key 与 Playhead](/assets/photon2/editor-timeline-panel.webp)

*该局部图来自最大化窗口，Track 名称、Clip 范围、Key 与红色 Playhead 都可以直接辨认。*

Timeline 面板组合 Track Tree、Time Ruler、Clip Lane 和 Property Editor。选择 Track 或 Property 后，会显示与该项目有关的操作。

## 播放控制

| 控件 | 行为 |
| --- | --- |
| Play/Pause | 推进或冻结 Timeline Master Clock。 |
| Stop/Restart | Reset Runtime Object，并从时间零重新计算。 |
| Loop | 在编辑器中重复播放预览范围。 |
| Scrub | 在指针时间计算效果，不进行正常 Forward Playback。 |

编辑器 Scrub 时会关闭 Signal 和 Audio Dispatch，避免拖动 Playhead 时反复触发 Gameplay Event 或叠加声音。游戏内 Forward Playback 会开启两者。

## Time 与 Zoom

Ruler 单位是 tick。Zoom 会围绕指针改变 Pixels Per Tick；水平滚动移动可见时间窗口。红色 Playhead 是当前计算时间。

## 选择与编辑

- 在 Lane 空白处拖拽，可以框选 Item。
- 按编辑器选择规则使用 Ctrl/Shift 多选。
- 可以整体拖动多个选中的 Clip 或 Key。
- Edge Guide 会吸附附近 Clip/Key 边界。
- 一次只能有一个 Active Clip 的 Track 会拒绝重叠放置。
- Copy/Paste 保留相对 Offset，并在产生无效重叠时拒绝操作，不会静默破坏时间。

## Fast Seek

向较远时间 Scrub 可能需要从头重放 Simulation，因为 Particle State 不是单个时间戳的纯函数。编辑器会合并连续 Seek Request，并使用 Fast Replay，避免指针经过的每个像素都排队一次完整模拟。

## 编辑器与游戏内区别

编辑器使用独立 Particle Manager 和 Post Effect Stack。必要时 Audio Preview 会强制为非定位声音，保证从预览 Camera 可听。游戏内播放使用 Executor 的真实 Level、Entity/Block Anchor、Signal Hook 和 Global Post Stack。

::: tip 检查 Timing
先 Scrub 检查布局，再从零开始 Forward Play，验证 Control Restart、Random Seed、Signal、Audio 和 Post Effect Fade。
:::
