# TreeList

{{ version_badge("2.2.1", label="Since", icon="tag") }}

`TreeList<NODE>` 是一个通用的层级列表组件。每个节点实现 `ITreeNode` 接口，可以是分支节点（可展开）或叶子节点。节点通过可配置的 `UIElementProvider` 渲染，可通过箭头图标、单击或双击来展开/折叠。

特性：
- 支持单选和多选（使用 `Shift` 和 `Ctrl`）。
- 动态树（默认每 tick 重新检查子节点）或静态树。
- 扁平化根节点模式，可在显示时跳过根节点。
- 可自定义展开/折叠图标和节点背景纹理。

!!! note ""
    [UIElement](../element.md){ data-preview } 中记录的所有内容（布局、样式、事件、数据绑定等）同样适用于此组件。

---

## 基本用法

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

## 树列表样式

!!! info ""
    #### <p style="font-size: 1rem;">node-background</p>

    未选中节点的背景纹理。

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

    选中（高亮）节点的背景纹理。

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

    分支节点折叠或展开时显示的图标。

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

| 名称 | 类型 | 访问修饰 | 描述 |
| ---- | ---- | ------ | ----------- |
| `treeListStyle` | `TreeListStyle` | `private`（有 getter） | 当前样式。 |
| `root` | `NODE`（可空） | `private`（有 getter） | 根树节点。 |
| `hoveredNode` | `NODE`（可空） | `private`（有 getter） | 当前鼠标悬停的节点。 |
| `doubleClickToExpand` | `boolean` | `setter` | 是否双击展开/折叠分支节点。默认值：`true`。 |
| `clickToExpand` | `boolean` | `setter` | 是否单击展开/折叠分支节点。默认值：`false`。 |
| `supportMultipleSelection` | `boolean` | `setter` | 是否支持 `Ctrl+点击` 和 `Shift+点击` 多选节点。默认值：`false`。 |
| `staticTree` | `boolean` | `setter` | 设为 `true` 时，不会每 tick 重新检查子节点。默认值：`false`。 |

---

## 方法

| 方法 | 返回值 | 描述 |
| ------ | ------- | ----------- |
| `setRoot(NODE)` | `TreeList<NODE>` | 设置根节点并重建列表。 |
| `setNodeUISupplier(UIElementProvider<NODE>)` | `TreeList<NODE>` | 设置为每个节点创建 UI 的工厂。 |
| `setOnNodeUICreated(BiConsumer<NODE, UIElement>)` | `TreeList<NODE>` | 每个节点 UI 创建后调用的回调。 |
| `setOnSelectedChanged(Consumer<Set<NODE>>)` | — | 选中项变化时调用的回调。 |
| `setOnDoubleClickNode(Consumer<NODE>)` | — | 双击节点时调用的回调。 |
| `setSelectableNodeFilter(Predicate<NODE>)` | — | 控制哪些节点可被选中的谓词。 |
| `setFlattenRoot(boolean)` | `TreeList<NODE>` | 设为 `true` 时，不显示根节点；其子节点成为顶层项。 |
| `getSelected()` | `Set<NODE>` | 返回当前选中的节点（不可修改）。 |
| `setSelected(Collection<NODE>, boolean)` | `TreeList<NODE>` | 替换选中项。 |
| `addSelected(NODE, boolean)` | `TreeList<NODE>` | 将节点添加到选中项。 |
| `removeSelected(NODE, boolean)` | `TreeList<NODE>` | 从选中项中移除节点。 |
| `expandNode(NODE)` | `void` | 展开分支节点。 |
| `collapseNode(NODE)` | `void` | 折叠分支节点。 |
| `expandNodeAlongPath(NODE)` | `void` | 展开给定节点的所有祖先节点。 |
| `isNodeExpanded(NODE)` | `boolean` | 如果节点当前已展开则返回 `true`。 |
| `isNodeSelected(NODE)` | `boolean` | 如果节点当前已选中则返回 `true`。 |
| `reloadList()` | `TreeList<NODE>` | 清空并从当前根节点重建所有节点 UI。 |
| `menuStyle(Consumer<TreeListStyle>)` | `TreeList<NODE>` | 流式配置样式。 |

---

## 节点 UI 模板

用于常见节点 UI 布局的静态辅助方法：

| 方法 | 描述 |
| ------ | ----------- |
| `textTemplate(Function<NODE, Component>)` | 创建仅显示文本的节点 UI。 |
| `iconTextTemplate(Function<NODE, IGuiTexture>, Function<NODE, Component>)` | 创建包含图标和文本的节点 UI。 |
| `optionalIconTextTemplate(Function<NODE, IGuiTexture>, Function<NODE, Component>)` | 类似 `iconTextTemplate`，但仅在图标非空时显示图标。 |
