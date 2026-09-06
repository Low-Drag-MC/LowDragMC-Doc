# 机器蓝图

<VersionBadge version="21.1.1" label="MBD2" icon="tag" />
<VersionBadge version="21.1.0.13" label="KilaGraph" icon="tag" />

蓝图是一张响应机器事件的节点图。它能触及 [KubeJS 机器事件](../KubeJS/event.md)能触及的一切——状态、Trait、配方逻辑、红石、自定义数据、特效，甚至机器 UI——但它存在于机器项目内部，所以机器可以自带行为发布。

<figure>
<img src="/assets/multiblocked2/blueprints/canvas.png" alt="蓝图画布：Machine Tick 入口节点连到 Branch，分别设置机器状态或取消事件">
<figcaption>一张蓝图图：左侧是事件入口节点，下方是读取，中间是判断，右侧是机器动作。</figcaption>
</figure>

## 什么时候用蓝图

| 你想要 | 用 |
| --- | --- |
| 随机器一起发布、可在游戏内编辑的行为 | **蓝图** |
| 整合包作者按包覆盖的行为 | [KubeJS](../KubeJS/) |
| 新的存储模型、内容类型或条件 | [Java](../java/) |
| 数量、时长或并行倍率 | 先用[配方修饰器](../editor/recipe-logic.md)，代价更低 |

蓝图与 KubeJS handler 可以共存：两者收到同一个事件，蓝图先执行。

## 最短的一张

MBD2 自带十二张示范蓝图。最短的是 `redstone_control`——一个事件、一次读取、一次判断、一次写入：

<figure>
<img src="/assets/multiblocked2/blueprints/builtin-redstone-control.png" alt="redstone_control 内置蓝图：Machine Tick 与 Machine Info 接入 Redstone Power，再经比较与 XOR 进入 Set Working Enabled">
<figcaption>`built-in(mbd2:redstone_control)`。黄色便签本身就是图的一部分——每张内置蓝图都在自己的画布上解释自己。</figcaption>
</figure>

把它绑定到机器上，在机器的 Inspector 里填 `requiresSignal` 和 `threshold`，机器就有了红石控制。完全不需要编辑节点图。

## 继续阅读

| 页面 | 内容 |
| --- | --- |
| [核心概念](./concepts.md) | 事件、机器目标、参数、绑定、执行与失败处理 |
| [节点参考](./nodes.md) | 节点面板里都有什么，按分组 |
| [内置蓝图](./built-in.md) | 自带的十二张，参数与各自演示的技巧 |

<figure>
<img src="/assets/multiblocked2/blueprints/library.png" alt="编辑器蓝图资源库，把内置蓝图列为资源">
<figcaption>编辑器 Resources 面板中的蓝图资源库。</figcaption>
</figure>

## 依赖

蓝图需要 [KilaGraph](https://github.com/Low-Drag-MC/KilaGraph) `21.1.0.12` 或更高版本，MBD2 已经依赖它。节点面板包含 KilaGraph 约 300 个通用节点（数学、逻辑、字符串、列表、映射、流程、`mc.*`）以及 MBD2 的 235 个机器节点。

::: info 蓝图存在哪里
蓝图是编辑器蓝图资源库里的一个 `.bp` 资源，或者是 MBD2 在内存中提供的**内置**蓝图。绑定既可以按路径引用它，也可以[内嵌一份快照](./concepts.md#引用还是内嵌)到机器里。
:::
