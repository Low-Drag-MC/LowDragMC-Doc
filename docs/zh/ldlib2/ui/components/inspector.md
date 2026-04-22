# Inspector

{{ version_badge("2.2.1", label="Since", icon="tag") }}

`Inspector` 是一个属性编辑面板。它接受任意 `IConfigurable` 对象，并在 [`ScrollerView`](scroller-view.md){ data-preview } 内渲染其可配置属性。属性变更可选择性地记录到撤销/重做历史栈中。

!!! note ""
    [UIElement](../element.md){ data-preview } 中记录的所有内容（布局、样式、事件、数据绑定等）在此同样适用。

---

## 基本用法

=== "Java"

    ```java
    var inspector = new Inspector();
    parent.addChild(inspector);

    // 检查一个对象（任意 IConfigurable）：
    inspector.inspect(myObject);

    // 带变更监听器检查：
    inspector.inspect(myObject, configurator -> {
        System.out.println("Changed: " + configurator.getLabel());
    });

    // 带变更监听器和关闭回调检查：
    inspector.inspect(myObject,
        configurator -> System.out.println("Changed"),
        () -> System.out.println("Closed")
    );

    // 清空检查器：
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
| `scrollerView` | 承载生成的配置器组的 [`ScrollerView`](scroller-view.md){ data-preview }。ID：`_inspector_scroller-view_`。 |

---

## 属性

| 名称 | 类型 | 访问权限 | 描述 |
| ---- | ---- | ------ | ----------- |
| `scrollerView` | `ScrollerView` | `public final` | 包含配置器 UI 的滚动视图。 |
| `historyStack` | `IHistoryStack`（可空） | `getter/setter` | 可选的撤销/重做栈。设置后，属性变更将被记录。 |
| `inspectedConfigurable` | `IConfigurable`（可空） | `private`（有 getter） | 当前被检查的对象。 |

---

## 方法

| 方法 | 返回值 | 描述 |
| ------ | ------- | ----------- |
| `inspect(IConfigurable)` | `ConfiguratorGroup` | 检查一个对象并填充面板。返回生成的组。 |
| `inspect(IConfigurable, Consumer<Configurator>)` | `ConfiguratorGroup` | 带监听器检查，每次属性变更时调用。 |
| `inspect(IConfigurable, Consumer<Configurator>, Runnable)` | `ConfiguratorGroup` | 带变更监听器和关闭回调检查。 |
| `inspect(T, Consumer<Configurator>, Runnable, Consumer<T>)` | `ConfiguratorGroup` | 完整重载，包含用于撤销/重做的历史操作回调。 |
| `clear()` | `void` | 清除当前检查，执行关闭回调，并清空面板。 |
