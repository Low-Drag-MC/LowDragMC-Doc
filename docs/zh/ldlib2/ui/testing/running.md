# 运行测试

本页介绍如何在不打扰你工作的情况下运行 UI 测试：后台运行、完全不显示窗口、固定分辨率，以及拆分到多个客户端并行运行。这里的所有命令都需要先完成[在你的模组中接入](./index.md#set-up-in-your-mod)里的 Gradle 脚本。

| 模式 | 命令 | 窗口 |
| --- | --- | --- |
| 普通 | `gradlew runClient -PldTest=all` | 显示，启动时抢一次焦点。 |
| Headless | `gradlew runClient -PldTest=all -PldTestHeadless` | 从不显示，不需要显示器。 |
| 并行 | `gradlew runParTest -PldTest=all -PldTestJobs=2` | 每个 job 一个客户端；可与 `-PldTestHeadless` 组合。 |

## 后台运行 {#background-runs}

普通运行不需要窗口处于焦点，也不会移动你的鼠标，所以运行期间你可以继续在同一台机器上工作。

- 输入直接送进 screen，悬停跟随一个合成光标；物理光标停在你放下的位置。
- 截图读取游戏的主帧缓冲，不受焦点或遮挡窗口影响。
- **窗口会在启动时抢一次焦点。** 它由 FML 的早期加载窗口在任何模组代码运行之前创建，测试框架无法阻止。之后不会再把它提到前台或给它焦点。想连这一次也避免，请用 [headless 运行](#headless-runs)。
- **运行期间，来自操作系统的点击和按键会被丢弃**，误点游戏窗口不会落到测试中间。要中止运行，可以关闭窗口、等待 watchdog，或停止 Gradle。

`-PldTestInputMode=REAL` 是例外：它会移动真实光标并等待操作系统投递事件，所以会给窗口焦点，必须在前台运行。

## Headless 运行 {#headless-runs}

<VersionBadge version="2.2.39" label="自" icon="tag" />

`-PldTestHeadless` 从不显示窗口，机器也不需要接显示器。通过 SSH 在没接显示器的机器上启动的运行，会得到同样的报告和截图。

```text
gradlew runClient  -PldTest=all   -PldTestHeadless
gradlew runParTest -PldTest=all   -PldTestJobs=2 -PldTestHeadless
gradlew runMpTest  -PldMpTest=all -PldTestHeadless
```

- 窗口被隐藏而不是最大化。尺寸取 `-PldTestWindow`，省略时为 `1920x1080`。
- 截图从主渲染目标读取，而不是从屏幕读取，结果相同。
- `runParTest` 和 `runMpTest` 会把这个标志转发给它们启动的每个客户端和服务端。
- `-PldTestInputMode=REAL` 会在 Gradle 配置构建时被拒绝，因为真实输入需要一个可获得焦点的窗口。
- 不加这个标志时一切照旧：窗口照常显示并最大化。

### 早期加载窗口 {#early-loading-window}

<VersionBadge version="2.2.40" label="自" icon="tag" />

FML 的早期加载窗口需要主显示器。找不到时它不会失败，而是卡在一个没人能关的对话框后面一直等。对于 headless 运行，`ldlib2-uitest.gradle` 会检查机器是否有显示器：

- **有显示器**：保留早期窗口，客户端得到与玩家游戏相同的 OpenGL 上下文。
- **没有显示器**，或处于 SSH 会话：脚本在 run 目录的 `config/fml.toml` 中写入 `earlyWindowControl = false`，运行结束后恢复原值，客户端崩溃时也会恢复。

这个检测可能出错。例如断开的远程桌面会报告有屏幕，但实际上没有可用的显示器，运行就会卡住。可以用以下三种方式自己关闭早期窗口：

| 覆盖方式 | 作用范围 |
| --- | --- |
| `-PldTestEarlyWindow=false` | 仅当前构建。它**不会**传给 `runParTest` 和 `runMpTest` 启动的子构建。 |
| 环境变量 `LDLIB2_TEST_EARLY_WINDOW=false` | 当前构建及所有子构建，因为子构建继承环境变量。 |
| 文件 `build/ldlib2-uitest-no-monitor` | 该项目的所有构建。某个分片因找不到显示器而退出后，`runParTest` 会自动创建它，下一次运行就能成功。显示器恢复后删除它；`gradlew clean` 也会删除它。 |

::: warning 没有早期窗口时，客户端运行在 OpenGL 3.2 core 上

请求现代 OpenGL 上下文的正是早期窗口。没有它时，Minecraft 会自己创建 3.2 core 上下文，其中没有实例化渲染等 OpenGL 3.3 入口。调用它们的模组可能让客户端进程直接退出，没有异常也没有崩溃报告。只在确实没有显示器的机器上关闭早期窗口。

:::

### 分辨率 {#resolution}

有两个尺寸，很容易混淆：

| 尺寸 | 示例 | 由谁决定 |
| --- | --- | --- |
| 帧缓冲：每张截图的像素尺寸 | `3840x2160` | `-PldTestWindow=WxH` |
| 逻辑视口：UI 布局所用的坐标空间 | `1920x1080` | 帧缓冲 ÷ GUI scale |

- **想要同一布局下更清晰的截图，两个一起调。** 只加 `-PldTestWindow=3840x2160` 时，GUI scale 2 下 UI 得到 1920x1080 的视口，这是另一种布局，而不是更清晰的同一布局。请用 `-PldTestWindow=3840x2160 -PldTestGuiScale=4`。
- **不要让 GUI scale 变成 auto。** auto 会选窗口允许的最大值，4K 帧上是 8，全屏 UI 会被挤进 480x270 的视口。`-PldTestGuiScale` 默认 `2` 正是为了避免这一点。
- **需要在不同机器之间比对截图时，一定要固定 `-PldTestWindow`。** 省略时 headless 运行是 1920x1080，否则是显示器的工作区大小。
- 隐藏窗口不受桌面尺寸限制，所以没有显示器的机器上也能输出 4K 截图。

## 并行运行 {#parallel-runs}

<VersionBadge version="2.2.38" label="自" icon="tag" />

`runParTest` 把选中的场景拆分到多个客户端进程，同时运行，再合并报告。它需要 `ldlib2-uitest-par.gradle`。

```text
gradlew runParTest -PldTest=all -PldTestJobs=2
gradlew runParTest -PldTest=group:mymod -PldTestJobs=2 -PldTestHeadless
```

- `-PldTestJobs` 必填，不给时任务直接失败。从 `2` 开始。
- 每个 job 是一个完整的 Minecraft 客户端，以任务 `runUiTestShard<N>` 运行在自己的 `runs/uiTestShard<N>/` 目录中，有独立的世界、日志和选项。
- 场景按上一次各自的耗时分配，耗时记录在 `build/ldlib2-uitest-weights.json`。第一次运行还没有数据，按轮询分配。
- 合并后的报告是 `build/ldlib2-uitest-par/report.json`，每个分片自己的输出在 `build/ldlib2-uitest-par/shard<N>/`。有任何失败时 `verifyParTest` 会让构建失败。
- `-PldTest`、`-PldTestExclude`、`-PldTestWindow`、`-PldTestGuiScale`、`-PldTestInputMode`、`-PldTestWatchdogSec` 和 `-PldTestHeadless` 会传给每个分片。分片的 watchdog 默认 `180` 秒而不是 `90` 秒，因为所有客户端共用一台机器。

::: warning 并行运行请使用 LDLib2 2.2.39 或更新版本

2.2.38 中分片收不到 `-PldTest`、`-PldTestWindow` 和 `-PldTestGuiScale`，会运行全部场景，并且布局尺寸与串行运行不同，导致场景因坐标不对而失败。

:::

::: warning 并行运行的限制

- job 数超过机器承受能力时，每个客户端都会缺帧，对时序敏感的场景会无故失败。只在运行保持稳定时才调高 `-PldTestJobs`。
- `-PldTestKeepOpen` 不会传给分片。迭代单个场景时用串行的 `runClient`。
- 在 Windows 上每个分片通过 `cmd.exe` 启动，含空格或 `&` 的 `regex:` 选择会被拆坏。这类选择请串行运行。

:::
