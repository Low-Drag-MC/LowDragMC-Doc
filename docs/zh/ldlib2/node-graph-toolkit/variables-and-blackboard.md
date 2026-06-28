# 变量和 Blackboard

变量是图级声明。它们显示在 Blackboard 中，并可以被 variable node 引用。

```java
graph.graphModel.createVariable("speed", Float.class, 1f, VariableKind.LOCAL);
```

当一个值属于整个图，而不是某一个节点时，使用变量。常见用途：

* 在多个节点之间共享值，
* 当图作为子图使用时，暴露一个输入值，
* 从子图向父图暴露一个输出值，
* 定义由 Inspector 编辑的图级默认值。

## Blackboard

Blackboard 是图变量的内置 UI。

<figure markdown="span">
    ![Blackboard](./assets/ngt-blackboard-placeholder.png)
    <figcaption>
    Blackboard 中的变量声明。
    </figcaption>
</figure>

每一行都是一个变量声明。行中显示变量名，并可以展开查看类型和默认值。选中变量后，Inspector 会显示完整可编辑状态。

`GraphView` 默认创建一个 `Blackboard` 面板。`GraphEditorView` 包含该 graph view，是编辑器中推荐的使用方式。

## Variable Inspector

<figure markdown="span">
    ![Variable inspector](./assets/ngt-variable-inspector.png)
    <figcaption>
    选中图变量时的 Inspector。
    </figcaption>
</figure>

Inspector 让变量声明成为真正可编辑的数据：

| 字段 | 用途 |
| ---- | ---- |
| Variable Name | 声明名称。Variable node 和子图端口使用这个名字显示。 |
| Default Value | 存在声明 `Constant` 中的初始值。 |
| Variable Type | 编辑器中显示的变量 scope/type 模式。暴露变量可以在图外部使用。 |
| Flow Direction | 该变量在子图使用时是输入、输出、双向，还是仅本地图内部使用。 |

修改名称、类型或方向会更新引用该声明的 variable node。如果变量通过子图节点暴露，子图节点端口也会重新定义。

## Direction and Subgraph Ports

变量方向存储为 `ModifierFlags`，并通过 `VariableKind` 暴露。

```java
public enum VariableKind {
    LOCAL,
    INPUT,
    OUTPUT
}
```

| UI 含义 | 源模型 | 子图节点结果 |
| ------- | ------ | ------------ |
| Local | `ModifierFlags.NONE` / `VariableKind.LOCAL` | 不生成子图端口。 |
| Input | `ModifierFlags.READ` / `VariableKind.INPUT` | 在子图节点上生成输入端口。 |
| Output | `ModifierFlags.WRITE` / `VariableKind.OUTPUT` | 在子图节点上生成输出端口。 |
| Input + Output | `ModifierFlags.READ_WRITE` | 同时生成输入和输出端口。 |

Input 变量表示父图可以向子图传入一个值。

Output 变量表示子图可以向父图发布一个值。

暴露变量如何变成 `SubgraphNodeModel` 端口，见 [Subgraphs](./subgraphs.md){ data-preview }。

## 在代码中创建变量

在 graph model 上使用 `createVariable(...)`：

```java
graph.graphModel.createVariable(
        "speed",
        Float.class,
        1f,
        VariableKind.INPUT
);
```

类型也可以用 `TypeHandle` 提供：

```java
graph.graphModel.createVariable(
        "color",
        TypeHandles.COLOR,
        -1,
        VariableKind.OUTPUT
);
```

如果 `kind` 为 `null`，LDLib2 会创建本地变量。

## Variable Nodes

Variable node 是对变量声明的引用。它不拥有变量数据。

当节点逻辑需要读取图变量或写入图变量时使用 variable node。如果声明类型改变，variable node 的端口会根据声明更新。

Variable node 和子图端口是不同的：

* variable node 在图内部使用，
* 暴露的变量声明会在面向父图的子图节点上生成端口。

## 支持的变量类型

`Graph.getVariableSupportTypes()` 控制 Blackboard 和变量 Inspector 中出现哪些类型。

```java
@Override
public @Nullable List<TypeHandle> getVariableSupportTypes() {
    return List.of(TypeHandles.FLOAT, TypeHandles.COLOR, TypeHandles.BOOL);
}
```

返回 `null` 时复用 `getSupportTypes()`。

内置 handle、自定义注册、图标、默认值和 configurator 见 [Type Handles](./type-handles.md){ data-preview }。
