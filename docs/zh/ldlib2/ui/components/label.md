# Label

{{ version_badge("2.2.1", label="自", icon="tag") }}

`Label` 继承自 [`TextElement`](text.md){ data-preview }，并支持**数据绑定**。它实现了 `IBindable<Component>` 和 `IDataConsumer<Component>`，因此其文本可以由服务端到客户端或客户端的数据提供器驱动，并在数值变化时自动更新显示的文本。

默认尺寸：宽度继承自布局；高度默认为 **9 px**（默认字体大小的一行高度）。

!!! note ""
    [TextElement](text.md){ data-preview } 中记录的所有内容（文本样式、自动换行、对齐方式）以及 [UIElement](element.md){ data-preview } 中记录的所有内容（布局、事件等）同样适用于此处。

---

## 用法

=== "Java"

    ```java
    // 静态文本
    var label = new Label();
    label.setText("my.translation.key", true);

    // 数据绑定文本（服务端 → 客户端）
    label.bind(DataBindingBuilder.componentS2C(
        () -> Component.literal("Value: " + someObject.getValue())
    ).build());

    parent.addChild(label);
    ```

=== "Kotlin"

    ```kotlin
    // 静态 label
    label({
        text("my.translation.key")
        textStyle { textColor(0xFFFFFF).fontSize(10f) }
    }) {
        bindS2C({Component.literal("Value: $value")})
    }

    // 数据绑定
    val lbl = Label()
    lbl.bind(DataBindingBuilder.componentS2C { Component.literal("Value: $value") }.build())
    ```

=== "KubeJS"

    ```js
    let label = new Label();
    label.setText(Component.literal("Hello"));
    parent.addChild(label);

    // 通过绑定系统进行数据绑定：
    label.bind(DataBindingBuilder.componentS2C(() =>
        Component.literal("Tick: " + tickCount)
    ).build());
    ```

---

## XML

```xml
<!-- 元素内容中的字面文本 -->
<label>Hello World</label>

<!-- 可翻译文本 -->
<label><translate key="my.translation.key"/></label>
```

`Label` 接受与 `TextElement` 相同的文本内容语法 —— 详见 [TextElement § XML](text.md#xml)。

---

## 数据绑定

`Label` 可以订阅一个或多个数据提供器。每个订阅将保持活跃，直到调用 `unbindDataSource` 或该元素被移除。

=== "Java"

    ```java
    // 服务端到客户端绑定：在每个服务端 tick 时更新
    var binding = DataBindingBuilder.componentS2C(() ->
        Component.literal("Burn time: " + furnaceData.get(2) + " t")
    ).build();

    label.bindDataSource(binding);

    // 不再需要时取消订阅
    label.unbindDataSource(binding);
    ```

详见 [Data Bindings](../preliminary/data_bindings.md){ data-preview } 了解完整的绑定 API。

---

## 字段

> 继承 [TextElement § 字段](text.md#fields){ data-preview } 中的所有字段。

---

## 方法

> 继承 [TextElement § 方法](text.md#methods){ data-preview } 中的所有方法。

| 方法 | 返回 | 描述 |
| ------ | ------- | ----------- |
| `bindDataSource(IDataProvider<Component>)` | `Label` | 订阅数据提供器；文本自动更新。 |
| `unbindDataSource(IDataProvider<Component>)` | `Label` | 取消订阅先前绑定的数据提供器。 |
| `setValue(Component)` | `Label` | 直接设置文本（与 `setText(Component)` 相同）。 |
| `getValue()` | `Component` | 返回当前文本 `Component`。 |
