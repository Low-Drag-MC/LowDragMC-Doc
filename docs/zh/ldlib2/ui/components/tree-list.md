# TreeList

{{ version_badge("2.2.1", label="自", icon="tag") }}

`TreeList<NODE>` 是一个通用层级列表 Widget。每个节点实现 `ITreeNode`，可以是分支（可展开）或叶子节点。节点使用可配置的 `UIElementProvider` 渲染，并可通过箭头图标、单击或双击来展开/折叠。

特性：
- 单选和多选（配合 `Shift` 和 `Ctrl`）。
- 动态树（默认每 tick 重新检查子节点）或静态树。
- Flatten-root 模式，在显示中跳过根节点。
- 可自定义展开/折叠图标和节点背景 Texture。

!!! note ""
    [UIElement](element.md){ data-preview } 中记录的所有内容（布局、样式、事件、数据绑定等）同样适用于此处。

---

## 用法

=== "Java"

    ```java
    var tree = new TreeList<MyNode>(rootNode);
    tree.setNodeUISupplier(TreeList.textTemplate(node -> Component.literal(node.getName())));
    tree.setOnSelectedChanged(selected -> System.out.println("Selected: " + selected));
    tree.setDoubleClickToExpand(true);
    parent.addChild(tree);
    ```

=== "Kotlin"

    ```kotlin
    treeList<MyNode>(rootNode, {
        nodeUI(TreeList.textTemplate { node -> Component.literal(node.name) })
        onSelectionChanged { selected -> println("Selected: $selected") }
    }) { }
    ```

=== "KubeJS"

    ```js
    let tree = new TreeList(rootNode);
    tree.setNodeUISupplier(TreeList.textTemplate(n => Component.literal(n.name)));
    tree.setOnSelectedChanged(selected => { /* use selection */ });
    parent.addChild(tree);
    ```

---

## Tree List 样式

!!! info ""
    #### <p style="font-size: 1rem;">node-background</p>

    未选中节点的背景 Texture。

    默认值：无（空）

    === "Java"

        ```java
        tree.menuStyle(style -> style.nodeTexture(myBg));
        ```

    === "LSS"

        ```css
        tree-list {
            node-background: color(#00000040);
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">node-hover-background</p>

    选中（高亮）节点的背景 Texture。

    默认值：`ColorPattern.BLUE.rectTexture()`

    === "Java"

        ```java
        tree.menuStyle(style -> style.hoverTexture(myHighlight));
        ```

    === "LSS"

        ```css
        tree-list {
            node-hover-background: color(#4040FF80);
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">collapse-icon / expand-icon</p>

    分支节点在折叠或展开时显示的图标。

    默认值：`Icons.RIGHT_ARROW_NO_BAR_S_WHITE` / `Icons.DOWN_ARROW_NO_BAR_S_WHITE`

    === "Java"

        ```java
        tree.menuStyle(style -> style
            .collapseIcon(myCollapsed)
            .expandIcon(myExpanded)
        );
        ```

    === "LSS"

        ```css
        tree-list {
            collapse-icon: sprite("mymod:textures/gui/arrow_right.png");
            expand-icon: sprite("mymod:textures/gui/arrow_down.png");
        }
        ```

---

## 字段

| 名称 | 类型 | 访问权限 | 描述 |
| ---- | ---- | -------- | ---- |
| `treeListStyle` | `TreeListStyle` | `private` (getter) | 当前样式。 |
| `root` | `NODE` (nullable) | `private` (getter) | 根树节点。 |
| `hoveredNode` | `NODE` (nullable) | `private` (getter) | 当前鼠标悬停的节点。 |
| `doubleClickToExpand` | `boolean` | `setter` | 双击是否展开/折叠分支。默认值：`true`。 |
| `clickToExpand` | `boolean` | `setter` | 单击是否展开/折叠分支。默认值：`false`。 |
| `supportMultipleSelection` | `boolean` | `setter` | `Ctrl+点击` 和 `Shift+点击` 是否可选中多个节点。默认值：`false`。 |
| `staticTree` | `boolean` | `setter` | 为 `true` 时，不会每 tick 重新检查子节点。默认值：`false`。 |

---

## 方法

| 方法 | 返回 | 描述 |
| ---- | ---- | ---- |
| `setRoot(NODE)` | `TreeList<NODE>` | 设置根节点并重建列表。 |
| `setNodeUISupplier(UIElementProvider<NODE>)` | `TreeList<NODE>` | 设置创建每个节点 UI 的工厂。 |
| `setOnNodeUICreated(BiConsumer<NODE, UIElement>)` | `TreeList<NODE>` | 每个节点 UI 创建后调用的回调。 |
| `setOnSelectedChanged(Consumer<Set<NODE>>)` | — | 选中项变化时调用的回调。 |
| `setOnDoubleClickNode(Consumer<NODE>)` | — | 双击时调用的回调。 |
| `setSelectableNodeFilter(Predicate<NODE>)` | — | 控制哪些节点可以被选中的谓词。 |
| `setFlattenRoot(boolean)` | `TreeList<NODE>` | 为 `true` 时，根节点不显示；其子节点变为顶级项。 |
| `getSelected()` | `Set<NODE>` | 返回当前选中的节点（不可修改）。 |
| `setSelected(Collection<NODE>, boolean)` | `TreeList<NODE>` | 替换选中项。 |
| `addSelected(NODE, boolean)` | `TreeList<NODE>` | 将节点添加到选中项。 |
| `removeSelected(NODE, boolean)` | `TreeList<NODE>` | 从选中项中移除节点。 |
| `expandNode(NODE)` | `void` | 展开分支节点。 |
| `collapseNode(NODE)` | `void` | 折叠分支节点。 |
| `expandNodeAlongPath(NODE)` | `void` | 展开给定节点的所有祖先。 |
| `isNodeExpanded(NODE)` | `boolean` | 节点当前是否展开。 |
| `isNodeSelected(NODE)` | `boolean` | 节点当前是否被选中。 |
| `reloadList()` | `TreeList<NODE>` | 清除并从当前根节点重建所有节点 UI。 |
| `menuStyle(Consumer<TreeListStyle>)` | `TreeList<NODE>` | 以流式方式配置样式。 |

---

## 节点 UI 模板

常用节点 UI 布局的静态辅助方法：

| 方法 | 描述 |
| ---- | ---- |
| `textTemplate(Function<NODE, Component>)` | 创建一个仅显示文本的节点 UI。 |
| `iconTextTemplate(Function<NODE, IGuiTexture>, Function<NODE, Component>)` | 创建一个带有图标和文本的节点 UI。 |
| `optionalIconTextTemplate(Function<NODE, IGuiTexture>, Function<NODE, Component>)` | 类似 `iconTextTemplate`，但仅在图标非空时显示。 |
