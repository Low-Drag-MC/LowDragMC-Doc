# Label

{{ version_badge("2.2.1", label="Since", icon="tag") }}

`Label` extends [`TextElement`](text.md){ data-preview } with **data binding** support. It implements `IBindable<Component>` and `IDataConsumer<Component>`, so its text can be driven by a server-to-client or client-side data provider that automatically updates the displayed text whenever the value changes.

Default size: inherits width from layout; height defaults to **9 px** (one line at the default font size).

!!! note ""
    Everything documented on [TextElement](text.md){ data-preview } (text styles, wrapping, alignment) and [UIElement](../element.md){ data-preview } (layout, events, etc.) applies here too.

---

## Usage

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

Label accepts the same text content syntax as `TextElement` — see [TextElement § XML](text.md#xml) for details.

---

## Data Binding

`Label` can subscribe to one or more data providers. Each subscription is kept alive until `unbindDataSource` is called or the element is removed.

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

See [Data Bindings](../data_bindings.md){ data-preview } for the full binding API.

---

## Fields

> Inherits all fields from [TextElement § Fields](text.md#fields){ data-preview }.

---

## Methods

> Inherits all methods from [TextElement § Methods](text.md#methods){ data-preview }.

| Method | Returns | Description |
| ------ | ------- | ----------- |
| `bindDataSource(IDataProvider<Component>)` | `Label` | Subscribes to a data provider; text updates automatically. |
| `unbindDataSource(IDataProvider<Component>)` | `Label` | Unsubscribes from a previously bound data provider. |
| `setValue(Component)` | `Label` | Directly sets the text (same as `setText(Component)`). |
| `getValue()` | `Component` | Returns the current text `Component`. |
