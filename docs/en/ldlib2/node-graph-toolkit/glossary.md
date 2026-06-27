# Glossary

| Term | Meaning |
| ---- | ------- |
| `Graph` | User-facing graph definition. Controls supported nodes, types, command policy, subgraph policy, and diagnostics. |
| `GraphModel` | Persisted model that stores nodes, wires, variables, subgraphs, placemats, sticky notes, and change tracking. |
| `CustomGraphModelImpl` | Default graph model used by `Graph`. Delegates graph-specific behavior back to the `Graph` instance. |
| `GraphView` | Low-level editable UI for one graph model. Owns canvas, panels, item library, history, selection, and commands. |
| `GraphEditorView` | Recommended LDLib2 Editor `View` wrapper around `GraphView`, with save button, dirty state, subgraph breadcrumb, and subgraph dive. |
| `GraphResource` | Editor resource definition for graph assets saved as `CompoundTag`. |
| `Node` | User-defined node class. Defines display name, options, ports, and optional preview. |
| `NodeModel` | Runtime/persisted model for a node instance. |
| `PortModel` | Runtime/persisted model for an input or output port. |
| `WireModel` | Runtime/persisted model connecting two ports. |
| `TypeHandle` | Serializable type identity used by ports, variables, constants, options, icons, colors, default values, and configurators. |
| `Constant` | Stored value used by constant nodes, input port values, options, and variable defaults. |
| Blackboard | Graph panel that edits variable declarations. |
| Variable | Graph-level declaration with name, type, default value, and kind. |
| `VariableKind.LOCAL` | Variable used only inside the current graph. |
| `VariableKind.INPUT` | Variable exposed as an input port on subgraph nodes. |
| `VariableKind.OUTPUT` | Variable exposed as an output port on subgraph nodes. |
| Subgraph | Graph nested or referenced by another graph. |
| Local subgraph | Inline subgraph owned by the parent graph. |
| External subgraph | Subgraph referenced by `IResourcePath` and resolved through `IGraphReferenceResolver`. |
| Context node | Node that owns an ordered list of block nodes. |
| Block node | Node that lives inside a context node instead of directly on the graph canvas. |
| Wire portal | Compact node pair used to route a wire through named entry/exit points. |
| Placemat | Resizable canvas area used to visually group graph elements. |
| Sticky note | Comment element placed on the graph canvas. |
| Capability | Flag on graph element models that controls actions such as delete, move, copy, rename, color, collapse, or resize. |
