# 督察
{{ version_badge("2.2.1", label="Since", icon="tag") }}
`Inspector` 是一个属性编辑器面板。它接受任何 `IConfigurable` 对象并在 [`ScrollerView`](scroller-view.md){ data-preview } 内呈现其可配置属性。对属性的更改可以选择记录在撤消/重做历史堆栈中。
!!!笔记 ””[UIElement](../element.md){ data-preview } 上记录的所有内容（布局、样式、事件、数据绑定等）也适用于此处。
---

＃＃ 用法
===“Java”
    ```java
    var inspector = new Inspector();
    parent.addChild(inspector);

    // Inspect an object (any IConfigurable):
    inspector.inspect(myObject);

    // Inspect with a change listener:
    inspector.inspect(myObject, configurator -> {
        System.out.println("Changed: " + configurator.getLabel());
    });

    // Inspect with change listener + close callback:
    inspector.inspect(myObject,
        configurator -> System.out.println("Changed"),
        () -> System.out.println("Closed")
    );

    // Clear the inspector:
    inspector.clear();
    ```

===“科特林”
    ```kotlin
    inspector({
        inspect(myObject)
        onChange { configurator -> println("Changed: ${configurator.label}") }
    }) { }
    ```

===“KubeJS”
    ```js
    let inspector = new Inspector();
    inspector.inspect(myObject);
    parent.addChild(inspector);
    ```

---

## 内部结构
| Field | Description |
| ----- | ----------- |
| `scrollerView` | The [`ScrollerView`](scroller-view.md){ data-preview } that hosts the generated configurator group. ID: `_inspector_scroller-view_`. |

---

## 字段
| Name | Type | Access | Description |
| ---- | ---- | ------ | ----------- |
| `scrollerView` | `ScrollerView` | `public final` | The scroller containing the configurator UI. |
| `historyStack` | `IHistoryStack` (nullable) | `getter/setter` | Optional undo/redo stack. When set, property changes are recorded. |
| `inspectedConfigurable` | `IConfigurable` (nullable) | `private` (getter) | The currently inspected object. |

---

＃＃ 方法
| Method | Returns | Description |
| ------ | ------- | ----------- |
| `inspect(IConfigurable)` | `ConfiguratorGroup` | Inspects an object and populates the panel. Returns the generated group. |
| `inspect(IConfigurable, Consumer<Configurator>)` | `ConfiguratorGroup` | Inspects with a listener called on every property change. |
| `inspect(IConfigurable, Consumer<Configurator>, Runnable)` | `ConfiguratorGroup` | Inspects with a change listener and an on-close callback. |
| `inspect(T, Consumer<Configurator>, Runnable, Consumer<T>)` | `ConfiguratorGroup` | Full overload with history action callback for undo/redo. |
| `clear()` | `void` | Clears the current inspection, runs the on-close callback, and empties the panel. |
