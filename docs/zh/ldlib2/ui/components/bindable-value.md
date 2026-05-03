# BindableValue

{{ version_badge("2.2.1", label="自", icon="tag") }}

`BindableValue<T>` 是一种轻量级、不可见的元素，用于保存任意类型的单个值，并在值发生变化时通知已注册的监听器。在 UI 树中，它可用作非可视化的响应式绑定点。

`BindableValue` 继承自 `BindableUIElement<T>`，拥有完整的数据绑定和事件系统。

!!! note ""
    [UIElement](element.md){ data-preview } 中记录的所有内容（布局、样式、事件、数据绑定等）同样适用于此处。

---

## 用法

=== "Java"

    ```java
    var value = new BindableValue<String>();
    value.setValue("hello", false);
    value.registerValueListener(v -> System.out.println("Changed: " + v));

    // 将文本框绑定到该值
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

`BindableValue` 继承自 `BindableUIElement<T>`，可完整参与数据绑定系统：

=== "Java"

    ```java
    bv.bind(DataBindingBuilder.string(
        () -> config.getName(),
        name -> config.setName(name)
    ).build());
    ```

详情请参阅 [数据绑定](../preliminary/data_bindings.md){ data-preview }。

---

## 字段

| 名称 | 类型 | 访问权限 | 描述 |
| ---- | ---- | -------- | ---- |
| `value` | `T` (nullable) | `private` (getter) | 当前持有的值。 |

---

## 方法

| 方法 | 返回 | 描述 |
| ---- | ---- | ---- |
| `setValue(T, boolean)` | `BindableUIElement<T>` | 设置值。第二个参数控制是否通知。如果值与当前值相等，则不执行任何操作。 |
| `getValue()` | `T` | 返回当前值。 |
| `registerValueListener(Consumer<T>)` | `void` | 注册一个值变化时调用的监听器。 |
