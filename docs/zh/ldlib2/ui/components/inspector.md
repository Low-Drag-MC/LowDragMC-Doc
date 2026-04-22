# Inspector

{{ version_badge("2.2.1", label="自", icon="tag") }}

`Inspector` 是一个属性编辑面板。它接受任何 `IConfigurable` 对象，并在 [`ScrollerView`](scroller-view.md){ data-preview } 中渲染其可配置属性。对属性的更改可选择记录在撤销/重做历史栈中。

!!! note ""
    [UIElement](element.md){ data-preview } 上记录的所有内容（布局、样式、事件、数据绑定等）同样适用于此处。

---

## 用法

=== "Java"

    ```java
    var inspector = new Inspector();
    parent.addChild(inspector);

    // 检查一个对象（任何 IConfigurable）：
    inspector.inspect(myObject);

    // 检查并附带变更监听器：
    inspector.inspect(myObject, configurator -> {
        System.out.println("Changed: " + configurator.getLabel());
    });

    // 检查并附带变更监听器 + 关闭回调：
    inspector.inspect(myObject,
        configurator -> System.out.println("Changed"),
        () -> System.out.println("Closed")
    );

    // 清空 Inspector：
    inspector.clear();
    ```

=== "Kotlin"

    ```kotlin
    inspector({
        inspect(myObject)
        onChange { configurator -> println("Changed: ${configurator.label}") }
    }) { }
    ```

=== "KubeJS"

    ```js
    let inspector = new Inspector();
    inspector.inspect(myObject);
    parent.addChild(inspector);
    ```

---

## 内部结构

| 字段 | 描述 |
| ----- | ----------- |
| `scrollerView` | 承载生成的 configurator 组的 [`ScrollerView`](scroller-view.md){ data-preview }。ID：`_inspector_scroller-view_`。 |

---

## 字段

| 名称 | 类型 | 访问权限 | 描述 |
| ---- | ---- | ------ | ----------- |
| `scrollerView` | `ScrollerView` | `public final` | 包含 configurator UI 的滚动视图。 |
| `historyStack` | `IHistoryStack` (nullable) | `getter/setter` | 可选的撤销/重做栈。设置后，属性更改将被记录。 |
| `inspectedConfigurable` | `IConfigurable` (nullable) | `private` (getter) | 当前正在检查的对象。 |

---

## 方法

| 方法 | 返回 | 描述 |
| ------ | ------- | ----------- |
| `inspect(IConfigurable)` | `ConfiguratorGroup` | 检查一个对象并填充面板。返回生成的组。 |
| `inspect(IConfigurable, Consumer<Configurator>)` | `ConfiguratorGroup` | 检查对象，并在每次属性更改时调用监听器。 |
| `inspect(IConfigurable, Consumer<Configurator>, Runnable)` | `ConfiguratorGroup` | 检查对象，附带变更监听器和关闭回调。 |
| `inspect(T, Consumer<Configurator>, Runnable, Consumer<T>)` | `ConfiguratorGroup` | 完整重载，附带用于撤销/重做的历史操作回调。 |
| `clear()` | `void` | 清除当前检查，运行关闭回调，并清空面板。 |
