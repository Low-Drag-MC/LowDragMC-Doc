# Graph Definition

`Graph` is the root API for a graph type. It owns a `CustomGraphModelImpl` and defines what the graph supports.

```java
public abstract class Graph implements IGraph {
    public final CustomGraphModelImpl graphModel = createGraphModel();

    public abstract List<Class<? extends Node>> getSupportNodes();
}
```

## Node Registry

Use `GraphNodeRegistry` when your nodes are declared with `@NodeAttribute`.

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

`GraphNodeRegistry` filters annotated nodes by graph type, mod id, and registration environment.

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

| Field | Description |
| ----- | ----------- |
| `name` | Node id used by the graph toolkit. |
| `group` | Item library grouping path. |
| `modID` | Optional mod filter. |
| `priority` | Sort priority. |
| `environment` | Registration environment. |
| `graphTypes` | Graph classes this node can be used in. |

## Supported Types

`getSupportTypes()` controls type handles available to constants and variables. See [Type Handles](./type-handles.md) for the type API and registration helpers.

```java
@Override
public @Nullable List<TypeHandle> getSupportTypes() {
    return List.of(TypeHandles.FLOAT, TypeHandles.STRING, TypeHandles.BOOL);
}
```

Return `null` to let `CustomGraphModelImpl.detectSupportedTypes(graphModel)` collect port types from supported nodes.

You can also tune UI lists separately:

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

Use graph hooks when behavior belongs to the graph type instead of one `GraphView` instance.

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

`canExecuteCommand` can veto editor changes.

`onCommandExecuted` runs after a command has changed the graph.

`onGraphChanged` emits footer diagnostics in the graph view. Messages are runtime UI state and are not serialized.

## Subgraph Support

Same-type local subgraphs are supported by default. Cross-type subgraphs require opt-in:

```java
@Override
public boolean acceptsSubgraphGraph(Graph other) {
    return other instanceof MaterialGraph;
}
```

Use `getSupportedSubgraphVariableKinds()` to control which exposed variable kinds become ports when this graph is used as a subgraph.
