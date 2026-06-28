# Inspector

<VersionBadge version="2.2.1" label="Since" icon="tag" />

`Inspector` is a property-editor panel. It accepts any `IConfigurable` object and renders its configurable properties inside a [`ScrollerView`](scroller-view.md). Changes to properties are optionally recorded in an undo/redo history stack.

::: info
Everything documented on [UIElement](element.md) (layout, styles, events, data bindings, etc.) applies here too.
:::

---

## Usage

<DocTabs>
<DocTab title="Java">

```java
var inspector = new Inspector();
parent.addChild(inspector);

// Inspect an object (any IConfigurable):
inspector.inspect(myObject);

// Inspect with a change listener:
inspector.inspect(myObject, configurator -> {
    System.out.println("Changed: " + configurator.getLabel());
});

// Inspect with change listener + close callback:
inspector.inspect(myObject,
    configurator -> System.out.println("Changed"),
    () -> System.out.println("Closed")
);

// Clear the inspector:
inspector.clear();
```

</DocTab>
<DocTab title="Kotlin">

```kotlin
inspector({
    inspect(myObject)
    onChange { configurator -> println("Changed: ${configurator.label}") }
}) { }
```

</DocTab>
<DocTab title="KubeJS">

```js
let inspector = new Inspector();
inspector.inspect(myObject);
parent.addChild(inspector);
```

</DocTab>
</DocTabs>
---

## Internal Structure

| Field | Description |
| ----- | ----------- |
| `scrollerView` | The [`ScrollerView`](scroller-view.md) that hosts the generated configurator group. ID: `_inspector_scroller-view_`. |

---

## Fields

| Name | Type | Access | Description |
| ---- | ---- | ------ | ----------- |
| `scrollerView` | `ScrollerView` | `public final` | The scroller containing the configurator UI. |
| `historyStack` | `IHistoryStack` (nullable) | `getter/setter` | Optional undo/redo stack. When set, property changes are recorded. |
| `inspectedConfigurable` | `IConfigurable` (nullable) | `private` (getter) | The currently inspected object. |

---

## Methods

| Method | Returns | Description |
| ------ | ------- | ----------- |
| `inspect(IConfigurable)` | `ConfiguratorGroup` | Inspects an object and populates the panel. Returns the generated group. |
| `inspect(IConfigurable, Consumer&lt;Configurator&gt;)` | `ConfiguratorGroup` | Inspects with a listener called on every property change. |
| `inspect(IConfigurable, Consumer&lt;Configurator&gt;, Runnable)` | `ConfiguratorGroup` | Inspects with a change listener and an on-close callback. |
| `inspect(T, Consumer&lt;Configurator&gt;, Runnable, Consumer&lt;T&gt;)` | `ConfiguratorGroup` | Full overload with history action callback for undo/redo. |
| `clear()` | `void` | Clears the current inspection, runs the on-close callback, and empties the panel. |
