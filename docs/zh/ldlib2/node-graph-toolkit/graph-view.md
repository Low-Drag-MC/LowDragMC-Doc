# GraphView

`GraphView` 是 NGT 图的底层可编辑 UI。

它包含 header、可平移画布、图元素、Item Library、Blackboard、Inspector、Preview 面板、history stack、命令处理和诊断 footer。

!!! tip ""
    实际图编辑器优先使用 `GraphEditorView`。它包装 `GraphView`，并提供保存、dirty 状态、面包屑路径、子图 dive 和外部子图编辑支持。

<figure markdown="span">
    ![GraphView panels](./assets/ngt-graph-view-placeholder.png)
    <figcaption>
    GraphView / GraphEditorView 中的画布、Blackboard、Inspector、Preview 和日志区域。
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

## Commands and History

大多数图编辑都会通过 `GraphView.dispatchCommand(...)` 派发命令。

当命令可撤销时，会记录到 view history stack。Header 提供 undo、redo、snap-to-grid 和 fit 按钮。

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
* 将连线转换为 portals。

子图 dive 由 `GraphEditorView` 处理，单独使用裸 `GraphView` 不支持完整流程。

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

## Snap and Fit

Snap 默认启用。

```java
graphView.setSnapToGrid(true);
graphView.setGridSnapSize(16f);
```

使用 fit 按钮或调用：

```java
graphView.fitGraphChildren();
```

## Diagnostics Footer

`Graph.onGraphChanged(GraphLogger)` 会向 graph log footer 提供数据。

用于显示编辑时可见但不序列化的图校验消息。
