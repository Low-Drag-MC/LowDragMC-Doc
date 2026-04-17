# BindableValue

{{ version_badge("2.2.1", label="Since", icon="tag") }}

`BindableValue<T>` is a lightweight, invisible element that holds a single value of any type and notifies registered listeners whenever the value changes. It is useful as a non-visual reactive binding point inside a UI tree.

`BindableValue` extends `BindableUIElement<T>` and inherits the full data-binding and event system.

!!! note ""
    Everything documented on [UIElement](../element.md){ data-preview } (layout, styles, events, data bindings, etc.) applies here too.

---

## Usage

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

## Value Binding

`BindableValue` extends `BindableUIElement<T>` and participates fully in the data-binding system:

=== "Java"

    ```java
    bv.bind(DataBindingBuilder.string(
        () -> config.getName(),
        name -> config.setName(name)
    ).build());
    ```

See [Data Bindings](../data_bindings.md){ data-preview } for full details.

---

## Fields

| Name | Type | Access | Description |
| ---- | ---- | ------ | ----------- |
| `value` | `T` (nullable) | `private` (getter) | The currently held value. |

---

## Methods

| Method | Returns | Description |
| ------ | ------- | ----------- |
| `setValue(T, boolean)` | `BindableUIElement<T>` | Sets the value. Second param controls notification. No-op if the value is equal to the current. |
| `getValue()` | `T` | Returns the current value. |
| `registerValueListener(Consumer<T>)` | `void` | Registers a listener called when the value changes. |
