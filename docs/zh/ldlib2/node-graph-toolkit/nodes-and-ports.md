# 节点和端口

用户创建的图节点继承 `Node`。

```java
public abstract class Node implements INode {
    public abstract Component getDisplayName();

    public void onDefineOptions(IOptionDefinitionContext context) {}

    public void onDefinePorts(IPortDefinitionContext context) {}
}
```

`onDefineOptions(...)` 会先于 `onDefinePorts(...)` 运行。当节点形状依赖可编辑值时，使用 options。

## Options

Options 是节点设置。它们可以显示在节点头部，也可以只显示在 Inspector 中。

```java
@Override
public void onDefineOptions(IOptionDefinitionContext context) {
    context.addOption("inputs", Integer.class)
            .withDisplayName(Component.literal("Inputs"))
            .withDefaultValue(2);
}
```

定义端口时读取 options：

```java
@Override
public void onDefinePorts(IPortDefinitionContext context) {
    getNodeOptionById("inputs").tryGetValue(Integer.class).ifSuccess(value -> {
        int count = (Integer) value;
        for (int i = 0; i < count; i++) {
            context.addInputPort("in" + (i + 1), Float.class);
        }
    });
    context.addOutputPort("out", Float.class);
}
```

常用 option builder 方法：

| 方法 | 用途 |
| ---- | ---- |
| `withDisplayName(Component)` | UI 中显示的标签。 |
| `withTooltips(Tooltips)` | Tooltip 文本。 |
| `withDefaultValue(Object)` | 初始值。 |
| `showInInspectorOnly()` | 不显示在节点头部，只显示在 Inspector。 |
| `withConfigurable(ITypeConfigurable)` | 覆盖这个 option 的编辑 UI。 |
| `withCodec(Codec&lt;?&gt;)` | 覆盖序列化。 |
| `withoutSerialization()` | 保留类型 id，但不持久化值。 |
| `withoutConfigurator()` | 保存值，但不暴露 UI 行。 |

## Ports

Ports 定义图连接关系。

```java
@Override
public void onDefinePorts(IPortDefinitionContext context) {
    context.addInputPort("a", String.class).build();
    context.addInputPort("b", String.class).build();
    context.addOutputPort("out", String.class).build();
}
```

未连接的输入端口可以持有内嵌常量。这也是 input builder 暴露 configurator 和序列化控制的原因。

```java
context.addInputPort("amount", Float.class)
        .withDefaultValue(1f)
        .build();
```

常用 port builder 方法：

| 方法 | 用途 |
| ---- | ---- |
| `withDisplayName(Component)` | 端口旁显示的标签。 |
| `withConnectorUI(PortConnectorUI)` | 自定义连接点图标。 |
| `withOrientation(PortOrientation)` | 水平侧边端口或垂直顶部/底部端口。 |
| `withDefaultValue(Object)` | 初始内嵌常量。 |
| `withConfigurable(ITypeConfigurable)` | 仅输入端口：覆盖编辑 UI。 |
| `withCodec(Codec&lt;?&gt;)` | 仅输入端口：覆盖常量序列化。 |
| `withoutSerialization()` | 仅输入端口：运行时非持久化值。 |
| `withoutConfigurator()` | 仅输入端口：隐藏常量编辑器。 |

## 垂直端口

垂直端口显示在节点主体上方或下方。

```java
context.addInputPort("flow", TypeHandles.EXECUTION_FLOW)
        .withOrientation(PortOrientation.Vertical)
        .build();
```

垂直输入端口默认隐藏内联 configurator。如果某个图类型需要显示垂直端口值，可以覆盖 `GraphModel.showVerticalPortConfigurator()`。

<figure>
<img src="./assets/ngt-node-anatomy-placeholder.png" alt="Node anatomy">
<figcaption>
标准节点布局。
</figcaption>
</figure>

## 节点结构

截图中标记的区域是：

1. **Title**  
   显示来自 `getDisplayName()` 的节点显示名。标题行也会放置小型节点控件，例如可用时的折叠和预览控件。

2. **Options**  
   显示 `onDefineOptions(...)` 定义的节点 options。Options 适合影响节点构建方式的值，例如 enum 模式、数量或配置字段。

3. **Ports**  
   显示 `onDefinePorts(...)` 定义的输入和输出端口。端口是连线的连接点。输入端口在未连接时还可以显示内嵌常量编辑器。

4. **Preview**  
   显示由 `hasNodePreview()` 和 `onBuildNodePreview(...)` 创建的可选预览面板。适合需要视觉反馈的节点，例如颜色、纹理、shader 或程序化结果节点。

<figure>
<img src="./assets/ngt-node-types.png" alt="Node types">
<figcaption>
Node Graph Toolkit 中常见的节点类型。
</figcaption>
</figure>

## 节点类型

图编辑器使用多种节点模型类型。它们共享同一个画布和连线系统，但创建和使用方式不同。

1. **Variable Node**  
   读取或写入图变量。先在 Blackboard 中创建变量，再从该声明创建变量节点。变量见 [Variables and Blackboard](./variables-and-blackboard.md)。

2. **Constant Node**  
   以输出端口形式提供固定值。当一个值应当作为可见节点，而不是输入端口的内联常量时使用。常量值使用 `TypeHandle` 支持，并与端口值使用同一套 configurable 系统。见 [Type Handles](./type-handles.md)。

3. **Node**  
   普通用户定义节点，通过继承 `Node` 并使用 `@NodeAttribute` 注册。用 `onDefineOptions(...)` 定义可编辑 options，用 `onDefinePorts(...)` 定义端口。

4. **Context Node**  
   拥有有序子 block 节点列表的节点。适合序列、分支、状态或组合操作。见 [Context and Block Nodes](./context-and-block-nodes.md)。

5. **Block Node**  
   位于 context node 内部的子节点，而不是直接放在图画布上。通过继承 `BlockNode` 创建 block 节点类，并用 `@UseWithContext` 绑定兼容 context。见 [Context and Block Nodes](./context-and-block-nodes.md)。

6. **Subgraph Node**  
   表示另一个图。它的端口由内部图的暴露变量生成。用于复用图逻辑，或通过 `GraphEditorView` 的面包屑编辑嵌套图。见 [Subgraphs](./subgraphs.md)。

7. **Wire Portal Node**  
   通过命名 portal 对路由连线。长连线让图难以阅读时使用。可以从连线命令或图上下文操作创建 portal。见 [Commands and Customization](./commands-and-customization.md)。

## 节点预览

节点可以在主体下方渲染预览面板。

```java
@Override
public boolean hasNodePreview() {
    return true;
}

@Override
public void onBuildNodePreview(NodePreviewContext context) {
    context.content().addChild(createPreviewElement());
}

@Override
public void onUpdateNodePreview(NodePreviewContext context) {
    context.rebuild();
}
```

预览适合需要视觉反馈的节点，例如 shader、纹理、颜色或程序化输出节点。
