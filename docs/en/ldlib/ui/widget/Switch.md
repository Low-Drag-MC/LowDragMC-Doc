# SwitchWidget

The `SwitchWidget` is a **toggle button** that switches between an ON and OFF state. It supports **custom textures**, **event callbacks**, and **dynamic state updates**.

---

## Features

- **Toggle button behavior** – Click to switch between ON and OFF.
- **Event handling** – Fires callbacks when the switch state changes.

---

## Properties

| Field             | Type                      | Description |
|------------------|--------------------------|-------------|
| `isPressed`      | `boolean` _(default: false)_ | Current switch state. |

---

## APIs

### setPressed

Sets the **ON/OFF** state of the switch.

<DocTabs>
<DocTab title="Java / KubeJS">

```java
switchWidget.setPressed(true); // Turns ON
```

</DocTab>
</DocTabs>

- Triggers **UI updates** and event callbacks.

---

### setOnPressCallback

Registers a callback when the switch is clicked.

<DocTabs>
<DocTab title="Java">

```java
switchWidget.setOnPressCallback((clickData, state) -> {
    System.out.println("Switch is now: " + state);
});
```

</DocTab>
<DocTab title="KubeJS">

```javascript
switchWidget.setOnPressCallback((clickData, state) => {
    console.log("Switch is now: " + state);
});
```

</DocTab>
</DocTabs>

---

### setSupplier

Automatically syncs with an **external state**.

<DocTabs>
<DocTab title="Java">

```java
switchWidget.setSupplier(() -> getCurrentState()); // bool
```

</DocTab>
<DocTab title="KubeJS">

```javascript
switchWidget.setSupplier(() => getCurrentState()); // bool
```

</DocTab>
</DocTabs>

- Updates **dynamically** when `getCurrentState()` changes.