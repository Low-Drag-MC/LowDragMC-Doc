# Label

{{ version_badge("2.2.1", label="Since", icon="tag") }}

`Label` 继承自 [`TextElement`](text.md){ data-preview }，并支持**数据绑定**功能。它实现了 `IBindable<Component>` 和 `IDataConsumer<Component>` 接口，因此其文本可以由服务端到客户端或客户端侧的数据提供者驱动，当值发生变化时自动更新显示的文本。

默认尺寸：宽度从布局继承；高度默认为 **9 px**（默认字体大小下的一行高度）。

!!! note ""
    [TextElement](text.md){ data-preview } 中记录的所有内容（文本样式、换行、对齐）以及 [UIElement](../element.md){ data-preview } 中记录的所有内容（布局、事件等）在此处同样适用。

---

## 用法

=== "Java"

    ```java
    // Static text
    var label = new Label();
    label.setText("my.translation.key", true);

    // Data-bound text (server → client)
    label.bind(DataBindingBuilder.componentS2C(
        () -> Component.literal("Value: " + someObject.getValue())
    ).build());

    parent.addChild(label);
    ```

=== "Kotlin"

    ```kotlin
    // Static label
    label({
        text("my.translation.key")
        textStyle { textColor(0xFFFFFF).fontSize(10f) }
    }) { 
        bindS2C({Component.literal("Value: $value")})
    }

    // Data-bound
    val lbl = Label()
    lbl.bind(DataBindingBuilder.componentS2C { Component.literal("Value: $value") }.build())
    ```

=== "KubeJS"

    ```js
    let label = new Label();
    label.setText(Component.literal("Hello"));
    parent.addChild(label);

    // Data-bound via binding system:
    label.bind(DataBindingBuilder.componentS2C(() =>
        Component.literal("Tick: " + tickCount)
    ).build());
    ```

---

## XML

```xml
<!-- Literal text in element content -->
<label>Hello World</label>

<!-- Translatable text -->
<label><translate key="my.translation.key"/></label>
```

Label 接受与 `TextElement` 相同的文本内容语法——详见 [TextElement § XML](text.md#xml)。

---

## 数据绑定

`Label` 可以订阅一个或多个数据提供者。每个订阅会一直保持活跃，直到调用 `unbindDataSource` 或元素被移除。

=== "Java"

    ```java
    // Server-to-client binding: updates on each server tick
    var binding = DataBindingBuilder.componentS2C(() ->
        Component.literal("Burn time: " + furnaceData.get(2) + " t")
    ).build();

    label.bindDataSource(binding);

    // Unsubscribe when no longer needed
    label.unbindDataSource(binding);
    ```

完整的绑定 API 请参阅 [数据绑定](../data_bindings.md){ data-preview }。

---

## 字段

> 继承自 [TextElement § 字段](text.md#fields){ data-preview } 的所有字段。

---

## 方法

> 继承自 [TextElement § 方法](text.md#methods){ data-preview } 的所有方法。

| 方法 | 返回值 | 描述 |
| ------ | ------- | ----------- |
| `bindDataSource(IDataProvider<Component>)` | `Label` | 订阅数据提供者；文本会自动更新。 |
| `unbindDataSource(IDataProvider<Component>)` | `Label` | 取消订阅先前绑定的数据提供者。 |
| `setValue(Component)` | `Label` | 直接设置文本（与 `setText(Component)` 相同）。 |
| `getValue()` | `Component` | 返回当前文本 `Component`。 |
