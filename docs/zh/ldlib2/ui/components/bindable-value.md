# BindableValue

{{ version_badge("2.2.1", label="Since", icon="tag") }}

`BindableValue<T>` 是一个轻量级的不可见元素，用于保存任意类型的单个值，并在值变化时通知已注册的监听器。它可以作为 UI 树中的非可视响应式绑定点使用。

`BindableValue` 继承自 `BindableUIElement<T>`，拥有完整的数据绑定和事件系统。

!!! note ""
    [UIElement](../element.md){ data-preview } 中记录的所有内容（布局、样式、事件、数据绑定等）同样适用于此组件。

---

## 用法

=== "Java"

    ```java
    var value = new BindableValue<String>();
    value.setValue("hello", false);
    value.registerValueListener(v -> System.out.println("Changed: " + v));

    // Bind a text field to it
    textField.bind(DataBindingBuilder.string(
        value::getValue,
        v -> value.setValue(v, true)
    ).build());

    parent.addChild(value);
    ```

=== "Kotlin"

    ```kotlin
    bindableValue<String>({
        initialValue("hello")
        onChange { v -> println("Changed: $v") }
    }) { }
    ```

=== "KubeJS"

    ```js
    let bv = new BindableValue();
    bv.setValue("hello", false);
    bv.registerValueListener(v => { console.log("Changed: " + v); });
    parent.addChild(bv);
    ```

---

## 值绑定

`BindableValue` 继承自 `BindableUIElement<T>`，完全支持数据绑定系统：

=== "Java"

    ```java
    bv.bind(DataBindingBuilder.string(
        () -> config.getName(),
        name -> config.setName(name)
    ).build());
    ```

详见 [数据绑定](../data_bindings.md){ data-preview }。

---

## 字段

| 名称 | 类型 | 访问权限 | 描述 |
| ---- | ---- | ------ | ----------- |
| `value` | `T`（可空） | `private`（有 getter） | 当前保存的值。 |

---

## 方法

| 方法 | 返回值 | 描述 |
| ------ | ------- | ----------- |
| `setValue(T, boolean)` | `BindableUIElement<T>` | 设置值。第二个参数控制是否通知监听器。如果新值与当前值相等则不执行任何操作。 |
| `getValue()` | `T` | 返回当前值。 |
| `registerValueListener(Consumer<T>)` | `void` | 注册一个在值变化时调用的监听器。 |
