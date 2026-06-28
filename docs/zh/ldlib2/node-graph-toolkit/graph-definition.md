# Graph 定义

`Graph` 是图类型的根 API。它持有一个 `CustomGraphModelImpl`，并定义这个图支持什么。

```java
public abstract class Graph implements IGraph {
    public final CustomGraphModelImpl graphModel = createGraphModel();

    public abstract List<Class<? extends Node>> getSupportNodes();
}
```

## Node Registry

当节点使用 `@NodeAttribute` 声明时，使用 `GraphNodeRegistry`。

```java
public class MyGraph extends Graph {
    public static final GraphNodeRegistry NODE_REGISTRY =
            GraphNodeRegistry.create(MyMod.id("my_graph"), MyGraph.class);

    @Override
    public List<Class<? extends Node>> getSupportNodes() {
        return NODE_REGISTRY.getNodeClasses();
    }
}
```

`GraphNodeRegistry` 会按图类型、mod id 和注册环境过滤带注解的节点。

## Node Attribute

```java
@NodeAttribute(
        name = "add",
        group = "math",
        graphTypes = {MyGraph.class}
)
public class AddNode extends Node {
}
```

| 字段 | 说明 |
| ---- | ---- |
| `name` | 图工具包使用的节点 id。 |
| `group` | Item Library 的分组路径。 |
| `modID` | 可选的 mod 过滤。 |
| `priority` | 排序优先级。 |
| `environment` | 注册环境。 |
| `graphTypes` | 这个节点可以在哪些图类中使用。 |

## 支持的类型

`getSupportTypes()` 控制常量和变量可用的类型句柄。Type API 和注册辅助方法见 [Type Handles](./type-handles.md){ data-preview }。

```java
@Override
public @Nullable List<TypeHandle> getSupportTypes() {
    return List.of(TypeHandles.FLOAT, TypeHandles.STRING, TypeHandles.BOOL);
}
```

返回 `null` 时，`CustomGraphModelImpl.detectSupportedTypes(graphModel)` 会从支持节点的端口中收集类型。

也可以分别调整 UI 列表：

```java
@Override
public List<TypeHandle> getLibrarySupportTypes() {
    return List.of(TypeHandles.FLOAT);
}

@Override
public List<TypeHandle> getVariableSupportTypes() {
    return List.of(TypeHandles.FLOAT, TypeHandles.BOOL);
}
```

## Graph Hooks

当行为属于图类型，而不是某个 `GraphView` 实例时，使用 graph hooks。

```java
@Override
public boolean canExecuteCommand(IGraphCommand command) {
    return true;
}

@Override
public void onCommandExecuted(IGraphCommand command) {
}

@Override
public void onGraphChanged(GraphLogger logger) {
    logger.warning(Component.literal("Missing output"));
}
```

`canExecuteCommand` 可以拒绝编辑器变更。

`onCommandExecuted` 在命令修改图之后运行。

`onGraphChanged` 会向 graph view 底部诊断区域输出信息。这些消息是运行时 UI 状态，不会序列化。

## 子图支持

默认支持同类型本地子图。跨类型子图需要显式允许：

```java
@Override
public boolean acceptsSubgraphGraph(Graph other) {
    return other instanceof MaterialGraph;
}
```

使用 `getSupportedSubgraphVariableKinds()` 控制当这个图作为子图使用时，哪些暴露变量会变成端口。
