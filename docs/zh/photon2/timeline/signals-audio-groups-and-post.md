# Signal、Audio、Group 与 Post Process

![用于编排非粒子 Track 的完整 Timeline 项目](/assets/photon2/editor-timeline-overview.webp)

*Signal、Audio、Group 与 Post Process Track 可与粒子控制 Track 并列，并跟随同一个播放游标。*

这些 Track 负责把 FX 与 Particle Simulation 之外的系统协调起来。

## Signal Track

Signal 包含 time、name 和自定义 `CompoundTag` data。Track Display Name 是 Channel。Forward Playback 时，Player 在单调窗口 `(lastSignalTick, currentTime]` 中发送 Signal，避免时间零或普通重复 Evaluate 导致重复触发。

Signal 会发送到：

1. 当前播放的 `IEffectExecutor#onTimelineSignal`；
2. 通过全局 `PhotonSignals` 注册的 Listener。

编辑器在 Scrub/Replay Preview 期间关闭 Dispatch。

## Audio Track

Audio Clip 选择 Sound Event、Category、Attenuation、Duration 和 Volume/Pitch Function。

<VersionBadge version="2.2.1" label="可使用 Curve 的 Volume/Pitch 自" icon="tag" />

- 进入 Clip 时启动 Sound Instance。
- 离开或切换 Clip 时请求停止上一个 Instance。
- Clip 比 Sound 长时循环；比 Sound 短时在 Clip 末尾截断。
- 开启 Attenuation 并绑定 Target 时，Position 跟随 FX Object。
- Editor Preview 可能强制使用非定位声音，保证可听。

## Track Group

Group 用于组织 Child Track，并支持嵌套显示/Mute 结构。它不会创建 FX Object 或 Transform；需要 Simulation Hierarchy 时应使用 Empty Object。

## Post Process Track

Post Process Clip 引用 Render Graph 或 Fullscreen Graph Resource Path，并保存 Weight Envelope 和 Parameter Override。在范围内的每个 Render Frame：

1. 采样 Local Clip Time；
2. 计算 Fade/Weight；
3. 采样 Parameter Override；
4. 向 `IEffectExecutor#postEffectSink()` 提交请求。

停止提交后，下一次 Stack Consume 就会移除效果。同一效果的重叠 Request 按 PostEffectStack 规则混合。

Graph 制作见 [Post Processing](../post-processing/)，手动请求见 [Post Processing Java API](../java-api/post-processing-api.md)。
