# 可绑定值
{{ version_badge("2.2.1", label="Since", icon="tag") }}
`BindableValue<T>` 是一个轻量级的、不可见的元素，它保存任何类型的单个值，并在值发生变化时通知注册的侦听器。它作为 UI 树内的非视觉反应式绑定点非常有用。
`BindableValue` 扩展了`BindableUIElement<T>` 并继承了完整的数据绑定和事件系统。
!!!笔记 ””[UIElement](../element.md){ data-preview } 上记录的所有内容（布局、样式、事件、数据绑定等）也适用于此处。
---

＃＃ 用法
===“Java”
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

===“科特林”
    ```kotlin
    bindableValue<String>({
        initialValue("hello")
        onChange { v -> println("Changed: $v") }
    }) { }
    ```

===“KubeJS”
    ```js
    let bv = new BindableValue();
    bv.setValue("hello", false);
    bv.registerValueListener(v => { console.log("Changed: " + v); });
    parent.addChild(bv);
    ```

---

## 值绑定
`BindableValue` 扩展`BindableUIElement<T>` 并完全参与数据绑定系统：
===“Java”
    ```java
    bv.bind(DataBindingBuilder.string(
        () -> config.getName(),
        name -> config.setName(name)
    ).build());
    ```

有关完整详细信息，请参阅[Data Bindings](../data_bindings.md){ data-preview }。
---

## 字段
| Name | Type | Access | Description |
| ---- | ---- | ------ | ----------- |
| `value` | `T` (nullable) | `private` (getter) | The currently held value. |

---

＃＃ 方法
| Method | Returns | Description |
| ------ | ------- | ----------- |
| `setValue(T, boolean)` | `BindableUIElement<T>` | Sets the value. Second param controls notification. No-op if the value is equal to the current. |
| `getValue()` | `T` | Returns the current value. |
| `registerValueListener(Consumer<T>)` | `void` | Registers a listener called when the value changes. |
