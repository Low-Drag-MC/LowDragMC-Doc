# TreeList

<VersionBadge version="2.2.1" label="Since" icon="tag" />

`TreeList&lt;NODE&gt;` is a generic hierarchical list widget. Each node implements `ITreeNode` and can be a branch (expandable) or a leaf. Nodes are rendered using a configurable `UIElementProvider` and can be expanded/collapsed via arrow icons, single-click, or double-click.

Features:
- Single and multi-selection (with `Shift` and `Ctrl`).
- Dynamic tree (children are rechecked every tick by default) or static tree.
- Flatten-root mode to skip the root node in the display.
- Customisable expand/collapse icons and node background textures.

::: info
Everything documented on [UIElement](element.md) (layout, styles, events, data bindings, etc.) applies here too.
:::

---

## Usage

<DocTabs>
<DocTab title="Java">

```java
var tree = new TreeList<MyNode>(rootNode);
tree.setNodeUISupplier(TreeList.textTemplate(node -> Component.literal(node.getName())));
tree.setOnSelectedChanged(selected -> System.out.println("Selected: " + selected));
tree.setDoubleClickToExpand(true);
parent.addChild(tree);
```

</DocTab>
<DocTab title="Kotlin">

```kotlin
treeList<MyNode>(rootNode, {
    nodeUI(TreeList.textTemplate { node -> Component.literal(node.name) })
    onSelectionChanged { selected -> println("Selected: $selected") }
}) { }
```

</DocTab>
<DocTab title="KubeJS">

```js
let tree = new TreeList(rootNode);
tree.setNodeUISupplier(TreeList.textTemplate(n => Component.literal(n.name)));
tree.setOnSelectedChanged(selected => { /* use selection */ });
parent.addChild(tree);
```

</DocTab>
</DocTabs>
---

## Tree List Style

::: info
#### <p style="font-size: 1rem;">node-background</p>

Background texture for unselected nodes.

Default: none (empty)

<DocTabs>
<DocTab title="Java">

```java
tree.menuStyle(style -> style.nodeTexture(myBg));
```

</DocTab>
<DocTab title="LSS">

```css
tree-list {
    node-background: color(#00000040);
}
```

</DocTab>
</DocTabs>
:::

::: info
#### <p style="font-size: 1rem;">node-hover-background</p>

Background texture for selected (highlighted) nodes.

Default: `ColorPattern.BLUE.rectTexture()`

<DocTabs>
<DocTab title="Java">

```java
tree.menuStyle(style -> style.hoverTexture(myHighlight));
```

</DocTab>
<DocTab title="LSS">

```css
tree-list {
    node-hover-background: color(#4040FF80);
}
```

</DocTab>
</DocTabs>
:::

::: info
#### <p style="font-size: 1rem;">collapse-icon / expand-icon</p>

Icons shown on branch nodes when they are collapsed or expanded.

Defaults: `Icons.RIGHT_ARROW_NO_BAR_S_WHITE` / `Icons.DOWN_ARROW_NO_BAR_S_WHITE`

<DocTabs>
<DocTab title="Java">

```java
tree.menuStyle(style -> style
    .collapseIcon(myCollapsed)
    .expandIcon(myExpanded)
);
```

</DocTab>
<DocTab title="LSS">

```css
tree-list {
    collapse-icon: sprite("mymod:textures/gui/arrow_right.png");
    expand-icon: sprite("mymod:textures/gui/arrow_down.png");
}
```

</DocTab>
</DocTabs>
:::

---

## Fields

| Name | Type | Access | Description |
| ---- | ---- | ------ | ----------- |
| `treeListStyle` | `TreeListStyle` | `private` (getter) | Current style. |
| `root` | `NODE` (nullable) | `private` (getter) | The root tree node. |
| `hoveredNode` | `NODE` (nullable) | `private` (getter) | The node currently under the mouse. |
| `doubleClickToExpand` | `boolean` | `setter` | Whether double-clicking expands/collapses branches. Default: `true`. |
| `clickToExpand` | `boolean` | `setter` | Whether single-clicking expands/collapses branches. Default: `false`. |
| `supportMultipleSelection` | `boolean` | `setter` | Whether `Ctrl+click` and `Shift+click` select multiple nodes. Default: `false`. |
| `staticTree` | `boolean` | `setter` | When `true`, children are not rechecked every tick. Default: `false`. |

---

## Methods

| Method | Returns | Description |
| ------ | ------- | ----------- |
| `setRoot(NODE)` | `TreeList&lt;NODE&gt;` | Sets the root node and rebuilds the list. |
| `setNodeUISupplier(UIElementProvider&lt;NODE&gt;)` | `TreeList&lt;NODE&gt;` | Sets the factory that creates the UI for each node. |
| `setOnNodeUICreated(BiConsumer&lt;NODE, UIElement&gt;)` | `TreeList&lt;NODE&gt;` | Callback invoked after each node UI is created. |
| `setOnSelectedChanged(Consumer&lt;Set&lt;NODE&gt;&gt;)` | — | Callback invoked when the selection changes. |
| `setOnDoubleClickNode(Consumer&lt;NODE&gt;)` | — | Callback invoked on double-click. |
| `setSelectableNodeFilter(Predicate&lt;NODE&gt;)` | — | Predicate that controls which nodes can be selected. |
| `setFlattenRoot(boolean)` | `TreeList&lt;NODE&gt;` | When `true`, the root is not shown; its children become top-level items. |
| `getSelected()` | `Set&lt;NODE&gt;` | Returns the currently selected nodes (unmodifiable). |
| `setSelected(Collection&lt;NODE&gt;, boolean)` | `TreeList&lt;NODE&gt;` | Replaces the selection. |
| `addSelected(NODE, boolean)` | `TreeList&lt;NODE&gt;` | Adds a node to the selection. |
| `removeSelected(NODE, boolean)` | `TreeList&lt;NODE&gt;` | Removes a node from the selection. |
| `expandNode(NODE)` | `void` | Expands a branch node. |
| `collapseNode(NODE)` | `void` | Collapses a branch node. |
| `expandNodeAlongPath(NODE)` | `void` | Expands all ancestors of the given node. |
| `isNodeExpanded(NODE)` | `boolean` | Returns `true` if the node is currently expanded. |
| `isNodeSelected(NODE)` | `boolean` | Returns `true` if the node is currently selected. |
| `reloadList()` | `TreeList&lt;NODE&gt;` | Clears and rebuilds all node UIs from the current root. |
| `menuStyle(Consumer&lt;TreeListStyle&gt;)` | `TreeList&lt;NODE&gt;` | Configures style fluently. |

---

## Node UI Templates

Static helper methods for common node UI layouts:

| Method | Description |
| ------ | ----------- |
| `textTemplate(Function&lt;NODE, Component&gt;)` | Creates a node UI showing only text. |
| `iconTextTemplate(Function&lt;NODE, IGuiTexture&gt;, Function&lt;NODE, Component&gt;)` | Creates a node UI with an icon and text. |
| `optionalIconTextTemplate(Function&lt;NODE, IGuiTexture&gt;, Function&lt;NODE, Component&gt;)` | Like `iconTextTemplate` but the icon is shown only when non-empty. |
