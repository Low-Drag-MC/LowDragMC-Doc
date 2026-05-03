# WidgetGroup

[ :material-tag: `WidgetGroup`](WidgetGroup.md)

`WidgetGroup` 是一个容器，可以添加子组件。继承自 `WidgetGroup` 的组件也可以添加子组件。

!!! note
    我们会为所有继承自它的组件添加一个 [ :material-tag: `WidgetGroup`](WidgetGroup.md)。

---

## 基本属性

所有属性均可通过 Java / KubeJS 访问。


| 字段       | 描述                          |
| :---------- | :----------------------------------- |
| `widgets`       | 所有子组件  |
| `layout`       | 子组件的布局 |
| `layoutPadding`       | 内边距偏移 |

=== "Java"

    ``` java
    for (var child in group.widgets) {

    }
    ```

=== "KubeJS"

    ``` javascript
    for (let child of group.widgets) {

    }
    ```

!!! warning
    **请勿**直接向 `group.widgets` 添加组件！！请查看下方的方法。

---

## API

### `addWidgets()`

按顺序向其添加子组件。

=== "Java / KubeJS"

    ``` java
    var button = ...;
    var label = ...;
    group.addWidgets(button, label);
    ```
---

### `removeWidget() / clearAllWidgets()`

从中移除子组件。

=== "Java / KubeJS"

    ``` java
    var child = group.getFirstWidgetById("button_id");
    group.removeWidget(child);
    group.clearAllWidget();
    ```
---

### `waitToAdded() / waitToRemoved()`

基本等同于 `addWidgets()` 和 `removeWidget()`。不过，这两个方法在遍历和多线程场景下非常有用。它会在下一 tick（在主线程中）处理组件。
