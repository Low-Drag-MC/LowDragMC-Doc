# GraphView

`GraphView` is the low-level editable UI for NGT graphs.

It contains a header, a pannable canvas, graph elements, the item library, blackboard, inspector, preview panel, history stack, command handling, and diagnostics footer.

::: tip
Prefer `GraphEditorView` for real graph editors. It wraps `GraphView` and adds save handling, dirty state, breadcrumbs, subgraph dive, and external subgraph editing support.
:::

<figure>
<img src="/assets/ldlib2/node-graph-toolkit/ngt-graph-view.png" alt="GraphView with its header, canvas, blackboard, inspector, and graph log">
<figcaption>
GraphView / GraphEditorView panels with the header toggles, canvas, blackboard, inspector, preview, and graph log.
</figcaption>
</figure>

## Direct Loading

```java
var graphView = new GraphView();
graphView.loadGraph(graph);
```

This is useful for test screens, previews, or embedded graph displays.

Inside a normal UI:

```java
root.addChild(graphView.layout(layout -> {
    layout.widthPercent(100);
    layout.heightPercent(100);
}));
```

For a full editor view:

```java
var editorView = new GraphEditorView();
editorView.loadGraph(graph, savedTag -> saveGraph(savedTag));
```

## Built-in Tools

`GraphView` creates these tools:

| Tool | Field | Description |
| ---- | ----- | ----------- |
| Item Library | `itemLibrary` | Popup for creating nodes, constants, blocks, and subgraphs. |
| Blackboard | `blackboard` | Variable declarations. |
| Inspector | `inspector` | Selected model properties. |
| Preview | `preview` | Graph-level preview tool. |
| Dock Manager | `dockManager` | Floating and corner-docked graph panels. |
| History | `historyStack` | Undo and redo for graph commands. |

The default panels are placed around the canvas:

* Blackboard: top-left.
* Inspector: top-right.
* Preview: bottom-right.

### Item Library Recommendations

<VersionBadge version="2.2.38" label="Since" icon="tag" />

Dragging a wire from a port into empty canvas opens the item library with a recommendation list of every node that has a compatible port. Nodes with a port of exactly the wire's type are listed first, then nodes whose ports only accept the type through assignability. Both groups keep the item library's normal order.

## Commands and History

Most graph edits are commands dispatched through `GraphView.dispatchCommand(...)`.

Commands are recorded in the view history stack when they are undoable. The header provides undo, redo, snap-to-grid, align-to-nearby-elements, and fit buttons. Since 2.2.40, the undo and redo tooltips show the shortcut currently bound in the editor keymap.

`GraphView` handles common editor actions:

* create node,
* create wire,
* delete,
* cut/copy/paste,
* duplicate,
* move,
* rename,
* recolor,
* create placemat,
* create subgraph from selection,
* convert wires to portals,
* insert a reroute point on a wire,
* auto layout.

Subgraph dive is handled by `GraphEditorView`, not by using a bare `GraphView` alone.

## Keyboard Shortcuts

| Shortcut | Action |
| -------- | ------ |
| `Ctrl+A` | Select every canvas element. The blackboard is not included. <VersionBadge version="2.2.42" label="Since" icon="tag" /> |
| `Ctrl+C` / `Ctrl+X` / `Ctrl+V` | Copy, cut, and paste the selection. |
| `Ctrl+D` | Duplicate the selection. |
| `Ctrl+Z` | Undo. |
| `Ctrl+Y` / `Ctrl+Shift+Z` | Redo. |
| `Ctrl+S` | Save, when the view is inside a `GraphEditorView`. |
| `Delete` | Delete the selection. |
| Hold `Alt` while dragging | Place elements exactly at the cursor, without grid or element snapping. |
| Double-click a wire | Insert a reroute point. |

Inside the LDLib2 Editor, the `Ctrl` chords come from the editor keymap and can be rebound. See [Keymap](../editor/keymap.md). `Delete` is handled by `GraphView` itself.

## Layers

Graph elements are rendered into named layers.

```java
graphView.setLayers(List.of(
        PlacematElement.PLACEMAT_LAYER,
        WireElement.WIRE_LAYER,
        NodeElement.NODE_LAYER,
        StickyNoteElement.STICKY_NOTE_LAYER
));
```

Use `getLayer(name)` when a custom element needs a specific canvas layer.

## View Preferences

<VersionBadge version="2.2.41" label="Since" icon="tag" />

Snap-to-grid, grid size, element snapping, and wire style are remembered per graph type. They are stored in `config/ldlib2/graph_view.json`, keyed by the graph's class name, and are not part of the graph file.

::: warning
`loadGraph(...)` applies the remembered preferences for the graph's type.

* Setters called **before** `loadGraph(...)` are overwritten.
* Setters called **after** `loadGraph(...)` change the user's saved preferences for that graph type.

To set up a view without writing to the preferences file, call `applyPreferences(...)` after `loadGraph(...)`.
:::

```java
graphView.loadGraph(graph);
graphView.applyPreferences(new GraphViewPreferences.Entry(
        true,                    // snap to grid
        16f,                     // grid size
        true,                    // snap to nearby elements
        WireRouteStyle.CURVED));
```

`currentPreferences()` returns the view's current setup. `GraphViewPreferences.Entry.DEFAULTS` is grid snapping on, size `16`, element snapping on, and `WireRouteStyle.DEFAULT`.

## Snap and Fit

Snap to grid is enabled by default.

```java
graphView.setSnapToGrid(true);
graphView.setGridSnapSize(16f);
```

Use the fit button or call:

```java
graphView.fitGraphChildren();
```

### Snapping and Alignment

<VersionBadge version="2.2.41" label="Since" icon="tag" />

When elements are dragged, the whole selection moves by one offset. Its nearest edge snaps to the grid, and lines up with the edges and centers of nearby elements. A guide line shows each alignment. Hold `Alt` to drop the selection exactly at the cursor.

The magnet button in the header toggles element alignment. In code:

```java
graphView.setSnapToElements(true);
graphView.setElementSnapThreshold(7f); // screen pixels, default 7
graphView.setElementSnapRange(600f);   // screen pixels, default 600
```

Both distances are in screen pixels and are divided by the canvas zoom, so snapping feels the same at any zoom level.

## Wire Styles

<VersionBadge version="2.2.41" label="Since" icon="tag" />

Right-click the canvas and open **Wire Style** to choose how every wire in the view is routed.

| `WireRouteStyle` | Look |
| ---------------- | ---- |
| `DEFAULT` | Straight run with a short stub at each port, rounded corners. |
| `CURVED` | Cubic Bézier leaving each port along its axis. |
| `OCTILINEAR` | Axis-aligned runs joined by 45° cuts. |
| `ORTHOGONAL` | Axis-aligned segments with rounded square corners. |
| `STRAIGHT` | Port to port, with no stubs. |

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

The style is view-wide: one graph view draws all wires the same way.

```java
graphView.setWireRouteStyle(WireRouteStyle.ORTHOGONAL);
```

## Auto Layout

<VersionBadge version="2.2.41" label="Since" icon="tag" />

Right-click the canvas and open **Auto Layout**:

| Entry | `GraphLayoutAlgorithm` | Use |
| ----- | ---------------------- | --- |
| Layered (Sugiyama) | `LAYERED` | Dataflow graphs. Arranges nodes in columns along the wire flow. |
| Grid | `GRID` | Even grid that ignores wires. |
| Force Directed | `FORCE_DIRECTED` | Graphs without a clear flow. Each connected cluster is laid out separately. |

With a selection, only the selected elements are arranged. With nothing selected, the whole graph is arranged. The flow direction comes from the ports on the wires involved: mostly vertical ports lay out top to bottom, otherwise left to right.

Placemats change what counts as one unit:

* **A placemat is selected**: the placemat and everything inside it move as one box and keep their relative arrangement.
* **Only nodes inside a placemat are selected**: those nodes are arranged inside the placemat. The placemat grows to fit the result, but never shrinks.

Auto layout is a normal undoable command:

```java
graphView.dispatchCommand(new LayoutCommands.AutoLayoutCommand(
        selectedElements, GraphLayoutAlgorithm.LAYERED));
```

## Wire Reroute Points

<VersionBadge version="2.2.37" label="Since" icon="tag" />

A reroute point bends a wire through a fixed position. It changes only how the wire is drawn. The wire still connects the same two ports.

<figure>
<img src="/assets/ldlib2/node-graph-toolkit/ngt-reroute-points.png" alt="Wires bent through reroute points, with one point branching into two wires">
<figcaption>
Wires routed through reroute points. Each point has an input dot on the left and an output dot on the right.
</figcaption>
</figure>

| Action | Result |
| ------ | ------ |
| Double-click a wire, or right-click it and choose **Add Reroute Point** | Inserts a reroute point at the cursor. |
| Drag from a point's right (output) dot to an input port | Adds a branch that shares the trunk before the point. |
| Drag from a point's left (input) dot to an output port, or drop a wire from an output port on it | Re-sources every wire passing through the point from that port. |
| Drag a point's body | Moves the point; every wire through it follows. |
| Delete a point | Removes the bend. The wires stay connected. |

Because routing is separate from topology, `WireModel.getFromPort()` and `getToPort()` are unchanged, and graph execution code does not need to know about reroute points.

Useful APIs:

| API | Use |
| --- | --- |
| `WireModel.getReroutePoints()` | Points the wire passes through, from the output port to the input port. |
| `GraphModel.insertReroutePointOnWire(wire, index, position)` | Bends a wire at a segment index. |
| `WireCommands.InsertReroutePointCommand` | Undoable insert. |
| `WireCommands.ReSourceReroutePointCommand` | Undoable re-source. |

Reroute points are saved in the graph NBT under `reroutePoints`, and are included in copy and paste.

## Read-only Views

<VersionBadge version="2.2.38" label="Since" icon="tag" />

`setReadOnly(true)` turns a graph view into a viewer.

```java
var graphView = new GraphView();
graphView.setReadOnly(true);
graphView.loadGraph(graph);
```

::: warning
Call `setReadOnly(...)` before `loadGraph(...)`. Inline port editors read the flag while the UI tree is built, so changing it later leaves the editors already on screen editable.
:::

In a read-only view:

* `dispatchCommand(...)` refuses every command,
* the blackboard and inspector still display but take no input,
* undo and redo are disabled,
* right-click does not open a context menu, and only pans the canvas,
* only `Ctrl+A` and `Ctrl+C` still work, so users can copy a built-in graph into their own.

`GraphEditorView.setReadOnly(...)` does the same for every level of the subgraph stack and hides the save button. Graph resources open this way when their provider cannot edit them; see [Editor Resources](./editor-resources.md#read-only-graphs).

## Diagnostics Footer

`Graph.onGraphChanged(GraphLogger)` feeds the graph log footer.

Use it for graph validation messages that should be visible while editing but not serialized.
