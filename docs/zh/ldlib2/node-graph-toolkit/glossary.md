# 术语表

| 术语 | 含义 |
| ---- | ---- |
| `Graph` | 面向使用者的图定义。控制支持的节点、类型、命令策略、子图策略和诊断。 |
| `GraphModel` | 持久化模型，保存节点、连线、变量、子图、Placemats、Sticky Notes 和变更追踪。 |
| `CustomGraphModelImpl` | `Graph` 使用的默认图模型。将图相关行为委托回 `Graph` 实例。 |
| `GraphView` | 单个图模型的底层可编辑 UI。持有画布、面板、Item Library、history、选择和命令。 |
| `GraphEditorView` | 推荐使用的 LDLib2 Editor `View`，包装 `GraphView`，并提供保存按钮、dirty 状态、子图面包屑和子图 dive。 |
| `GraphResource` | 图资产的 Editor resource 定义，以 `CompoundTag` 保存。 |
| `Node` | 用户定义节点类。定义显示名、options、ports 和可选 preview。 |
| `NodeModel` | 节点实例的运行时/持久化模型。 |
| `PortModel` | 输入或输出端口的运行时/持久化模型。 |
| `WireModel` | 连接两个端口的运行时/持久化模型。 |
| `TypeHandle` | 可序列化类型身份，用于端口、变量、常量、options、图标、颜色、默认值和 configurators。 |
| `Constant` | 常量节点、输入端口值、options 和变量默认值使用的存储值。 |
| Blackboard | 用于编辑变量声明的图面板。 |
| Variable | 图级声明，包含名称、类型、默认值和 kind。 |
| `VariableKind.LOCAL` | 只在当前图内部使用的变量。 |
| `VariableKind.INPUT` | 暴露为子图节点输入端口的变量。 |
| `VariableKind.OUTPUT` | 暴露为子图节点输出端口的变量。 |
| Subgraph | 嵌套在另一个图中，或被另一个图引用的图。 |
| Local subgraph | 由父图拥有的内联子图。 |
| External subgraph | 通过 `IResourcePath` 引用，并通过 `IGraphReferenceResolver` 解析的子图。 |
| Context node | 拥有有序 block node 列表的节点。 |
| Block node | 位于 context node 内部，而不是直接位于图画布上的节点。 |
| Wire portal | 用于通过命名 entry/exit 点路由连线的紧凑节点对。 |
| Placemat | 用于可视化分组图元素的可调整大小画布区域。 |
| Sticky note | 放在图画布上的注释元素。 |
| Capability | 图元素模型上的标记，用于控制删除、移动、复制、重命名、着色、折叠或调整大小等操作。 |
