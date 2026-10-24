# GraphView

`GraphView` 是 NGT 图的底层可编辑 UI。

它包含 header、可平移画布、图元素、Item Library、Blackboard、Inspector、Preview 面板、history stack、命令处理和诊断 footer。

::: tip
实际图编辑器优先使用 `GraphEditorView`。它包装 `GraphView`，并提供保存、dirty 状态、面包屑路径、子图 dive 和外部子图编辑支持。
:::

<figure>
<img src="/assets/ldlib2/node-graph-toolkit/ngt-graph-view.png" alt="GraphView with its header, canvas, blackboard, inspector, and graph log">
<figcaption>
GraphView / GraphEditorView 中的 header 开关、画布、Blackboard、Inspector、Preview 和日志区域。
</figcaption>
</figure>

## 直接加载

```java
var graphView = new GraphView();
graphView.loadGraph(graph);
```

这适合测试 screen、预览，或嵌入式图显示。

在普通 UI 中：

```java
root.addChild(graphView.layout(layout -> {
    layout.widthPercent(100);
    layout.heightPercent(100);
}));
```

完整编辑器 view 使用：

```java
var editorView = new GraphEditorView();
editorView.loadGraph(graph, savedTag -> saveGraph(savedTag));
```

## 内置工具

`GraphView` 创建这些工具：

| 工具 | 字段 | 说明 |
| ---- | ---- | ---- |
| Item Library | `itemLibrary` | 用于创建节点、常量、blocks 和子图的弹出库。 |
| Blackboard | `blackboard` | 变量声明。 |
| Inspector | `inspector` | 选中模型的属性。 |
| Preview | `preview` | 图级预览工具。 |
| Dock Manager | `dockManager` | 可浮动和停靠到角落的图面板。 |
| History | `historyStack` | 图命令的 undo 和 redo。 |

默认面板放在画布周围：

* Blackboard：左上。
* Inspector：右上。
* Preview：右下。

### Item Library 推荐列表 { #item-library-recommendations }

<VersionBadge version="2.2.38" label="自" icon="tag" />

从端口拖出连线并松开在画布空白处时，Item Library 会打开推荐列表，列出所有带有兼容端口的节点。端口类型与连线类型完全一致的节点排在前面，只能通过可赋值关系接收该类型的节点排在后面。两组内部都保持 Item Library 的常规顺序。

## Commands and History

大多数图编辑都会通过 `GraphView.dispatchCommand(...)` 派发命令。

当命令可撤销时，会记录到 view history stack。Header 提供 undo、redo、snap-to-grid、对齐附近元素和 fit 按钮。从 2.2.40 起，undo 和 redo 按钮的 tooltip 会显示编辑器 keymap 中当前绑定的快捷键。

`GraphView` 处理常见编辑器操作：

* 创建节点，
* 创建连线，
* 删除，
* cut/copy/paste，
* duplicate，
* move，
* rename，
* recolor，
* 创建 placemat，
* 从选区创建子图，
* 将连线转换为 portals，
* 在连线上插入中继点，
* 自动布局。

子图 dive 由 `GraphEditorView` 处理，单独使用裸 `GraphView` 不支持完整流程。

## 快捷键 { #keyboard-shortcuts }

| 快捷键 | 操作 |
| ------ | ---- |
| `Ctrl+A` | 选中画布上的所有元素，不包括 Blackboard。<VersionBadge version="2.2.42" label="自" icon="tag" /> |
| `Ctrl+C` / `Ctrl+X` / `Ctrl+V` | 复制、剪切、粘贴选区。 |
| `Ctrl+D` | 复制一份选区（duplicate）。 |
| `Ctrl+Z` | 撤销。 |
| `Ctrl+Y` / `Ctrl+Shift+Z` | 重做。 |
| `Ctrl+S` | 保存（仅当 view 位于 `GraphEditorView` 中）。 |
| `Delete` | 删除选区。 |
| 拖动时按住 `Alt` | 元素精确落在光标处，不做网格吸附和元素对齐。 |
| 双击连线 | 插入中继点。 |

在 LDLib2 Editor 中，这些 `Ctrl` 组合键来自编辑器 keymap，可以重新绑定，见 [Keymap](../editor/keymap.md)。`Delete` 由 `GraphView` 自己处理。

## Layers

图元素会渲染到命名 layer 中。

```java
graphView.setLayers(List.of(
        PlacematElement.PLACEMAT_LAYER,
        WireElement.WIRE_LAYER,
        NodeElement.NODE_LAYER,
        StickyNoteElement.STICKY_NOTE_LAYER
));
```

自定义元素需要特定画布 layer 时，使用 `getLayer(name)`。

## 视图偏好 { #view-preferences }

<VersionBadge version="2.2.41" label="自" icon="tag" />

网格吸附开关、网格大小、元素对齐开关和连线样式会按图类型记住。它们保存在 `config/ldlib2/graph_view.json` 中，以图的类全名为 key，不属于图文件本身。

::: warning
`loadGraph(...)` 会应用该图类型记住的偏好。

* 在 `loadGraph(...)` **之前**调用的 setter 会被覆盖。
* 在 `loadGraph(...)` **之后**调用的 setter 会改写用户为该图类型保存的偏好。

如果只想设置当前 view 而不写入偏好文件，在 `loadGraph(...)` 之后调用 `applyPreferences(...)`。
:::

```java
graphView.loadGraph(graph);
graphView.applyPreferences(new GraphViewPreferences.Entry(
        true,                    // 吸附到网格
        16f,                     // 网格大小
        true,                    // 对齐附近元素
        WireRouteStyle.CURVED));
```

`currentPreferences()` 返回 view 当前的设置。`GraphViewPreferences.Entry.DEFAULTS` 为：网格吸附开启、大小 `16`、元素对齐开启、`WireRouteStyle.DEFAULT`。

## Snap and Fit

网格吸附默认启用。

```java
graphView.setSnapToGrid(true);
graphView.setGridSnapSize(16f);
```

使用 fit 按钮或调用：

```java
graphView.fitGraphChildren();
```

### 吸附与对齐 { #snapping-and-alignment }

<VersionBadge version="2.2.41" label="自" icon="tag" />

拖动元素时，整个选区按同一个偏移量移动。选区离网格最近的那条边会吸附到网格，并与附近元素的边和中线对齐，每次对齐都会显示一条参考线。按住 `Alt` 可以让选区精确落在光标处。

Header 中的磁铁按钮用于开关元素对齐。在代码中：

```java
graphView.setSnapToElements(true);
graphView.setElementSnapThreshold(7f); // 屏幕像素，默认 7
graphView.setElementSnapRange(600f);   // 屏幕像素，默认 600
```

这两个距离都以屏幕像素为单位，使用前会除以画布缩放，因此在任何缩放级别下吸附手感一致。

## 连线样式 { #wire-styles }

<VersionBadge version="2.2.41" label="自" icon="tag" />

右键画布，打开 **连线样式**（Wire Style），选择当前 view 中所有连线的走线方式。

| `WireRouteStyle` | 外观 |
| ---------------- | ---- |
| `DEFAULT` | 直线连接，两端各有一小段引出线，拐角圆滑。 |
| `CURVED` | 三次贝塞尔曲线，沿端口方向引出。 |
| `OCTILINEAR` | 沿轴向的线段之间用 45° 斜线衔接。 |
| `ORTHOGONAL` | 只有水平和竖直线段，拐角为圆角直角。 |
| `STRAIGHT` | 端口到端口的直线，没有引出线。 |

<table>
<tr>
<td><img src="/assets/ldlib2/node-graph-toolkit/ngt-wire-style-curved.png" alt="Curved wire style"></td>
<td><img src="/assets/ldlib2/node-graph-toolkit/ngt-wire-style-octilinear.png" alt="Octilinear wire style"></td>
</tr>
<tr>
<td align="center"><code>CURVED</code></td>
<td align="center"><code>OCTILINEAR</code></td>
</tr>
<tr>
<td><img src="/assets/ldlib2/node-graph-toolkit/ngt-wire-style-orthogonal.png" alt="Orthogonal wire style"></td>
<td><img src="/assets/ldlib2/node-graph-toolkit/ngt-wire-style-straight.png" alt="Straight wire style"></td>
</tr>
<tr>
<td align="center"><code>ORTHOGONAL</code></td>
<td align="center"><code>STRAIGHT</code></td>
</tr>
</table>

样式作用于整个 view：同一个 graph view 中的所有连线使用同一种画法。

```java
graphView.setWireRouteStyle(WireRouteStyle.ORTHOGONAL);
```

## 自动布局 { #auto-layout }

<VersionBadge version="2.2.41" label="自" icon="tag" />

右键画布，打开 **自动布局**（Auto Layout）：

| 菜单项 | `GraphLayoutAlgorithm` | 用途 |
| ------ | ---------------------- | ---- |
| 分层布局 (Sugiyama) | `LAYERED` | 数据流图。沿连线方向把节点排成若干列。 |
| 网格布局 | `GRID` | 忽略连线的均匀网格。 |
| 力导向布局 | `FORCE_DIRECTED` | 没有明显流向的图。每个连通的簇单独布局。 |

有选区时只排列选中的元素；没有选区时排列整张图。流向由相关连线上的端口决定：竖向端口占多数时从上到下排列，否则从左到右。

Placemat 会改变"一个单元"的含义：

* **选中了 placemat 本身**：placemat 及其内部所有内容作为一个整体移动，内部相对位置不变。
* **只选中了 placemat 内的节点**：这些节点在 placemat 内部重新排列。placemat 会撑大以容纳结果，但不会缩小。

自动布局是普通的可撤销命令：

```java
graphView.dispatchCommand(new LayoutCommands.AutoLayoutCommand(
        selectedElements, GraphLayoutAlgorithm.LAYERED));
```

## 连线中继点 { #wire-reroute-points }

<VersionBadge version="2.2.37" label="自" icon="tag" />

中继点（reroute point）让连线经过一个固定位置再折向目标。它只改变连线的画法，连线连接的仍然是原来的两个端口。

<figure>
<img src="/assets/ldlib2/node-graph-toolkit/ngt-reroute-points.png" alt="Wires bent through reroute points, with one point branching into two wires">
<figcaption>
经过中继点的连线。每个中继点左侧是输入点，右侧是输出点。
</figcaption>
</figure>

| 操作 | 结果 |
| ---- | ---- |
| 双击连线，或右键连线选择 **添加中继点** | 在光标处插入中继点。 |
| 从中继点右侧（输出）点拖到某个输入端口 | 新增一条分支，共用中继点之前的主干。 |
| 从中继点左侧（输入）点拖到某个输出端口，或把输出端口拖出的连线放到它上面 | 经过该中继点的所有连线都改由这个端口出发。 |
| 拖动中继点本体 | 移动中继点，经过它的连线跟着移动。 |
| 删除中继点 | 去掉这个折点，连线保持连接。 |

由于走线和拓扑是分开的，`WireModel.getFromPort()` 和 `getToPort()` 不会变化，图的执行逻辑不需要关心中继点。

常用 API：

| API | 用途 |
| --- | ---- |
| `WireModel.getReroutePoints()` | 连线经过的中继点，从输出端口一侧到输入端口一侧排列。 |
| `GraphModel.insertReroutePointOnWire(wire, index, position)` | 在指定线段处折弯连线。 |
| `WireCommands.InsertReroutePointCommand` | 可撤销的插入。 |
| `WireCommands.ReSourceReroutePointCommand` | 可撤销的改接来源。 |

中继点保存在图 NBT 的 `reroutePoints` 下，复制粘贴时也会一并带上。

## 只读 view { #read-only-views }

<VersionBadge version="2.2.38" label="自" icon="tag" />

`setReadOnly(true)` 把 graph view 变成查看器。

```java
var graphView = new GraphView();
graphView.setReadOnly(true);
graphView.loadGraph(graph);
```

::: warning
必须在 `loadGraph(...)` 之前调用 `setReadOnly(...)`。端口的内嵌编辑器在构建 UI 树时读取这个标记，之后再修改，已经显示的编辑器仍然可编辑。
:::

只读 view 中：

* `dispatchCommand(...)` 拒绝所有命令，
* Blackboard 和 Inspector 仍然显示，但不接受输入，
* undo 和 redo 被禁用，
* 右键不会弹出菜单，只用于平移画布，
* 只有 `Ctrl+A` 和 `Ctrl+C` 仍然可用，方便用户把内置图复制到自己的图中。

`GraphEditorView.setReadOnly(...)` 会对子图栈中的每一层做同样的设置，并隐藏保存按钮。当 provider 无法编辑某个图资源时，该资源就会以这种方式打开，见 [Editor Resources](./editor-resources.md#read-only-graphs)。

## Diagnostics Footer

`Graph.onGraphChanged(GraphLogger)` 会向 graph log footer 提供数据。

用于显示编辑时可见但不序列化的图校验消息。
