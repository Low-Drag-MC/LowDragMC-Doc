# BindableValue

<VersionBadge version="2.2.1" label="Since" icon="tag" />

`BindableValue&lt;T&gt;` is a lightweight, invisible element that holds a single value of any type and notifies registered listeners whenever the value changes. It is useful as a non-visual reactive binding point inside a UI tree.

`BindableValue` extends `BindableUIElement&lt;T&gt;` and inherits the full data-binding and event system.

::: info
Everything documented on [UIElement](element.md) (layout, styles, events, data bindings, etc.) applies here too.
:::

---

## Usage

<DocTabs>
<DocTab title="Java">

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

</DocTab>
<DocTab title="Kotlin">

```kotlin
bindableValue<String>({
    initialValue("hello")
    onChange { v -> println("Changed: $v") }
}) { }
```

</DocTab>
<DocTab title="KubeJS">

```js
let bv = new BindableValue();
bv.setValue("hello", false);
bv.registerValueListener(v => { console.log("Changed: " + v); });
parent.addChild(bv);
```

</DocTab>
</DocTabs>
---

## Value Binding

`BindableValue` extends `BindableUIElement&lt;T&gt;` and participates fully in the data-binding system:

<DocTabs>
<DocTab title="Java">

```java
bv.bind(DataBindingBuilder.string(
    () -> config.getName(),
    name -> config.setName(name)
).build());
```

</DocTab>
</DocTabs>
See [Data Bindings](../preliminary/data_bindings.md) for full details.

---

## Fields

| Name | Type | Access | Description |
| ---- | ---- | ------ | ----------- |
| `value` | `T` (nullable) | `private` (getter) | The currently held value. |

---

## Methods

| Method | Returns | Description |
| ------ | ------- | ----------- |
| `setValue(T, boolean)` | `BindableUIElement&lt;T&gt;` | Sets the value. Second param controls notification. No-op if the value is equal to the current. |
| `getValue()` | `T` | Returns the current value. |
| `registerValueListener(Consumer&lt;T&gt;)` | `void` | Registers a listener called when the value changes. |
