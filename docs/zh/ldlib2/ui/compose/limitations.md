# 限制

<VersionBadge version="2.2.44" label="自" icon="tag" />

本页列出 `ldlib2-compose` 与 Jetpack Compose 的差异，以及容易违反的 Side 与生命周期规则。

## Side 与线程

::: warning 组合只在客户端渲染线程运行
在专用服务器上，以及单人游戏中集成服务器自己的线程上（菜单的 `createUI` 也会在那里执行），`ComposeElement.setContent` 只记录内容。菜单的服务端部分通过普通绑定获取数据。

effect 启动的协程（`LaunchedEffect`、`rememberCoroutineScope`）在渲染线程上恢复，每帧处理一次。因此 `delay()` 之后的代码同样运行在渲染线程上。
:::

任何会注册同步值、RPC 事件或菜单槽位的东西，都必须在 `createUI` 里、组合之外创建。见[状态与同步](./state-and-sync.md#server-driven-ui)。

## 生命周期

| 事件 | 组合会怎样 |
| --- | --- |
| 元素离开所在的 UI，或界面关闭 | 组合被销毁。`remember` 状态丢失；只有带 `stateKey` 时才保留 `rememberSaveable` 状态。 |
| 菜单界面被 JEI 等配方查看器遮住，然后返回 | 同上：销毁后重建。需要保留的状态请用 `rememberSaveable` 加 `stateKey`。 |
| 编辑器窗口最小化后恢复 | 不丢失任何东西。元素树换到新的 `ModularUI`，组合随之迁移。 |
| 组合内容时抛出异常 | 错误记录到日志，元素保持为空，直到下一次 `setContent`。 |

::: warning 避免这些用法
- **不要每帧创建 `ComposeElement`**，例如在悬停提示组件里。组合只有在其元素从 UI 中移除时才会释放全局快照系统，而悬停提示的 UI 被直接丢弃，不会移除任何元素。
- **不要在 `onDispose` 里抛出异常。** Compose 会在第一个抛出异常的清理处停止，之后的 `onDispose`（包括本模块自己的退订）都不会执行。
:::

## 与 Jetpack Compose 的差异

| 方面 | 本模块的行为 |
| --- | --- |
| 运行时 | 只有 JetBrains Compose runtime 1.8.2。没有 `compose.ui`，没有 `compose.foundation`。 |
| 样式 | 用具名参数代替 `Modifier` 链。样式属性没有顺序，写穿且不撤销。条件性外观请用 `classes`。 |
| 块 | 读取状态的块会单独重新执行，但只能修改属性。决定组合什么的值必须在函数体里读取。 |
| 手势 | LDLib2 UI 事件（含冒泡）和拖放（`DragHandler`）。没有 `pointerInput`、触摸阈值、惯性滑动或手势识别。 |
| 动画 | 本模块自己的实现。`AnimationSpec` 只有 `TweenSpec` 和 `SpringSpec`；只支持 `Float`、`Int` 和 ARGB 颜色。`animateFloatAsState` 默认是 250 ms 线性 tween，不是弹簧。 |
| `AnimatedVisibility` | 默认只淡入淡出。尺寸变化只支持单轴，进场与退场必须同轴。 |
| `rememberSaveable` | 只在内存中：能跨关闭界面（需要 `stateKey`）、跨行滚动、跨页签删除保留。退出世界时清空，不跨重启。 |
| 惰性列表 | `items` 按引用比较。固定行尺寸必须真正作用到行上。网格列宽固定。 |
| 网格格子 | 被编辑移到另一行的格子会丢失状态。 |
| `SplitView` | 只能设置分隔条初始位置（`initialPercentage`），拖动不回报。 |
| `Scene` | 相机属于控件本身，不是组合状态。 |
| 无障碍 | 组合出的元素不向 Minecraft 旁白提供信息。 |

## 开发环境

::: warning IntelliJ 协程调试 agent
第一个 Compose 界面出现提到 `DebugProbesKt` 和 `DebugProbesImpl` 的 `IllegalAccessError`，是 IntelliJ 的协程调试 agent 导致的。在 IDE 设置里关闭 coroutine agent，或者改用 `gradlew runClient` 启动。这在开发环境之外不会发生。
:::
