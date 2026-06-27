# Context and Block Nodes

Context nodes hold ordered block nodes.

Use them when a graph node needs an internal list of child operations, clauses, states, or steps.

<figure markdown="span">
    ![Context and block nodes](./assets/ngt-context-block-placeholder.png)
    <figcaption>
    Placeholder: replace with a screenshot of a context node containing block nodes.
    </figcaption>
</figure>

## Context Node

A context node extends `ContextNode`.

```java
@NodeAttribute(name = "test_context", group = "test", graphTypes = {TestGraph.class})
public class TestContextNode extends ContextNode {
    @Override
    public Component getDisplayName() {
        return Component.literal("Context");
    }
}
```

A context can have its own options and ports, just like a normal node.

It also owns a block list.

```java
int count = contextNode.getBlockCount();
IBlockNode block = contextNode.getBlock(0);
```

## Block Node

A block node extends `BlockNode`.

```java
@UseWithContext({TestContextNode.class})
@NodeAttribute(name = "test_block_a", group = "test", graphTypes = {TestGraph.class})
public class TestBlockA extends BlockNode {
    @Override
    public Component getDisplayName() {
        return Component.literal("Block A");
    }
}
```

Blocks can define ports and options. Their ports are registered with the graph, so wires can connect to them.

Blocks are not top-level graph nodes. They live inside their parent context and are reached through `ContextNode.getBlocks()`.

## Compatibility

The default context behavior discovers compatible blocks from `@UseWithContext`.

```java
@UseWithContext({MyContextNode.class})
public class MyBlockNode extends BlockNode {
}
```

Override `getSupportBlocks()` when compatibility should be explicit or dynamic:

```java
@Override
public List<Class<? extends BlockNode>> getSupportBlocks() {
    return List.of(MyBlockNode.class);
}
```

`ContextNode.acceptsBlock(...)` checks `@UseWithContext` first, then `getSupportBlocks()`.

## Ordering and Lifecycle

`ContextNodeModel` owns block insertion, removal, and movement.

Block mutations emit graph topology changes on the parent context. The block UI is rebuilt inside the context element instead of being created as a top-level canvas element.

This matters for copy, paste, serialization, and wires:

* blocks serialize as part of the context node,
* deleting a context deletes its blocks,
* block ports remain registered for wire lookup,
* graph-wide node iteration skips blocks.
