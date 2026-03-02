# 标签
{{ version_badge("2.2.1", label="Since", icon="tag") }}
`Label` 通过 **数据绑定** 支持扩展了 [`TextElement`](text.md){ data-preview }。它实现了`IBindable<Component>`和`IDataConsumer<Component>`，因此它的文本可以由服务器到客户端或客户端数据提供程序驱动，只要值发生变化，该数据提供程序就会自动更新显示的文本。
默认大小：从布局继承宽度；高度默认为**9 px**（默认字体大小一行）。
!!!笔记 ””[TextElement](text.md){ data-preview } （文本样式、换行、对齐）和 [UIElement](../element.md){ data-preview } （布局、事件等）上记录的所有内容也适用于此处。
---

＃＃ 用法
===“Java”
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

===“科特林”
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

===“KubeJS”
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

标签接受与 `TextElement` 相同的文本内容语法 - 有关详细信息，请参阅[TextElement § XML](text.md#xml)。
---

## 数据绑定
`Label`可以订阅一个或多个数据提供者。每个订阅都保持活动状态，直到 `unbindDataSource` 被调用或元素被删除。
===“Java”
    ```java
    // Server-to-client binding: updates on each server tick
    var binding = DataBindingBuilder.componentS2C(() ->
        Component.literal("Burn time: " + furnaceData.get(2) + " t")
    ).build();

    label.bindDataSource(binding);

    // Unsubscribe when no longer needed
    label.unbindDataSource(binding);
    ```

请参阅 [Data Bindings](../data_bindings.md){ data-preview } 了解完整的绑定 API。
---

## 字段
> 继承[TextElement § Fields](text.md#fields){ data-preview } 中的所有字段。
---

＃＃ 方法
> 继承[TextElement § Methods](text.md#methods){ data-preview } 的所有方法。
| Method | Returns | Description |
| ------ | ------- | ----------- |
| `bindDataSource(IDataProvider<Component>)` | `Label` | Subscribes to a data provider; text updates automatically. |
| `unbindDataSource(IDataProvider<Component>)` | `Label` | Unsubscribes from a previously bound data provider. |
| `setValue(Component)` | `Label` | Directly sets the text (same as `setText(Component)`). |
| `getValue()` | `Component` | Returns the current text `Component`. |
