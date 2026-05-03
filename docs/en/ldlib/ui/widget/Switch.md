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

=== "Java / KubeJS"

    ```java
    switchWidget.setPressed(true); // Turns ON
    ```

- Triggers **UI updates** and event callbacks.

---

### setOnPressCallback

Registers a callback when the switch is clicked.

=== "Java"

    ```java
    switchWidget.setOnPressCallback((clickData, state) -> {
        System.out.println("Switch is now: " + state);
    });
    ```

=== "KubeJS"

    ```javascript
    switchWidget.setOnPressCallback((clickData, state) => {
        console.log("Switch is now: " + state);
    });
    ```

---

### setSupplier

Automatically syncs with an **external state**.

=== "Java"

    ```java
    switchWidget.setSupplier(() -> getCurrentState()); // bool
    ```

=== "KubeJS"

    ```javascript
    switchWidget.setSupplier(() => getCurrentState()); // bool
    ```

- Updates **dynamically** when `getCurrentState()` changes.