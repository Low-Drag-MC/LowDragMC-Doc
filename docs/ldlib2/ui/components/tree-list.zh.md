# 树列表
{{ version_badge("2.2.1", label="Since", icon="tag") }}
`TreeList<NODE>` 是一个通用的分层列表小部件。每个节点都实现`ITreeNode`，并且可以是分支（可扩展）或叶子。节点使用可配置的 `UIElementProvider` 进行渲染，并且可以通过箭头图标、单击或双击来展开/折叠。
特征：- 单选和多选（使用`Shift` 和`Ctrl`）。- 动态树（默认情况下，每个刻度都会重新检查子级）或静态树。- 展平根模式可跳过显示中的根节点。- 可定制的展开/折叠图标和节点背景纹理。
!!!笔记 ””[UIElement](../element.md){ data-preview } 上记录的所有内容（布局、样式、事件、数据绑定等）也适用于此处。
---

＃＃ 用法
===“Java”
    ```java
    var tree = new TreeList<MyNode>(rootNode);
    tree.setNodeUISupplier(TreeList.textTemplate(node -> Component.literal(node.getName())));
    tree.setOnSelectedChanged(selected -> System.out.println("Selected: " + selected));
    tree.setDoubleClickToExpand(true);
    parent.addChild(tree);
    ```

===“科特林”
    ```kotlin
    treeList<MyNode>(rootNode, {
        nodeUI(TreeList.textTemplate { node -> Component.literal(node.name) })
        onSelectionChanged { selected -> println("Selected: $selected") }
    }) { }
    ```

===“KubeJS”
    ```js
    let tree = new TreeList(rootNode);
    tree.setNodeUISupplier(TreeList.textTemplate(n => Component.literal(n.name)));
    tree.setOnSelectedChanged(selected => { /* use selection */ });
    parent.addChild(tree);
    ```

---

## 树列表样式
!!!信息“”#### <p style="font-size: 1rem;">节点背景</p>
未选定节点的背景纹理。
默认值：无（空）
===“Java”
        ```java
        tree.menuStyle(style -> style.nodeTexture(myBg));
        ```

===“LSS”
        ```css
        tree-list {
            node-background: color(#00000040);
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">节点悬停背景</p>
选定（突出显示）节点的背景纹理。
默认值：`ColorPattern.BLUE.rectTexture()`
===“Java”
        ```java
        tree.menuStyle(style -> style.hoverTexture(myHighlight));
        ```

===“LSS”
        ```css
        tree-list {
            node-hover-background: color(#4040FF80);
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">折叠图标 / 展开图标</p>
折叠或展开分支节点时显示的图标。
默认值：`Icons.RIGHT_ARROW_NO_BAR_S_WHITE` / `Icons.DOWN_ARROW_NO_BAR_S_WHITE`
===“Java”
        ```java
        tree.menuStyle(style -> style
            .collapseIcon(myCollapsed)
            .expandIcon(myExpanded)
        );
        ```

===“LSS”
        ```css
        tree-list {
            collapse-icon: sprite("mymod:textures/gui/arrow_right.png");
            expand-icon: sprite("mymod:textures/gui/arrow_down.png");
        }
        ```

---

## 字段
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

＃＃ 方法
| Method | Returns | Description |
| ------ | ------- | ----------- |
| `setRoot(NODE)` | `TreeList<NODE>` | Sets the root node and rebuilds the list. |
| `setNodeUISupplier(UIElementProvider<NODE>)` | `TreeList<NODE>` | Sets the factory that creates the UI for each node. |
| `setOnNodeUICreated(BiConsumer<NODE, UIElement>)` | `TreeList<NODE>` | Callback invoked after each node UI is created. |
| `setOnSelectedChanged(Consumer<Set<NODE>>)` | — | Callback invoked when the selection changes. |
| `setOnDoubleClickNode(Consumer<NODE>)` | — | Callback invoked on double-click. |
| `setSelectableNodeFilter(Predicate<NODE>)` | — | Predicate that controls which nodes can be selected. |
| `setFlattenRoot(boolean)` | `TreeList<NODE>` | When `true`, the root is not shown; its children become top-level items. |
| `getSelected()` | `Set<NODE>` | Returns the currently selected nodes (unmodifiable). |
| `setSelected(Collection<NODE>, boolean)` | `TreeList<NODE>` | Replaces the selection. |
| `addSelected(NODE, boolean)` | `TreeList<NODE>` | Adds a node to the selection. |
| `removeSelected(NODE, boolean)` | `TreeList<NODE>` | Removes a node from the selection. |
| `expandNode(NODE)` | `void` | Expands a branch node. |
| `collapseNode(NODE)` | `void` | Collapses a branch node. |
| `expandNodeAlongPath(NODE)` | `void` | Expands all ancestors of the given node. |
| `isNodeExpanded(NODE)` | `boolean` | Returns `true` if the node is currently expanded. |
| `isNodeSelected(NODE)` | `boolean` | Returns `true` if the node is currently selected. |
| `reloadList()` | `TreeList<NODE>` | Clears and rebuilds all node UIs from the current root. |
| `menuStyle(Consumer<TreeListStyle>)` | `TreeList<NODE>` | Configures style fluently. |

---

## 节点 UI 模板
常见节点 UI 布局的静态辅助方法：
| Method | Description |
| ------ | ----------- |
| `textTemplate(Function<NODE, Component>)` | Creates a node UI showing only text. |
| `iconTextTemplate(Function<NODE, IGuiTexture>, Function<NODE, Component>)` | Creates a node UI with an icon and text. |
| `optionalIconTextTemplate(Function<NODE, IGuiTexture>, Function<NODE, Component>)` | Like `iconTextTemplate` but the icon is shown only when non-empty. |
