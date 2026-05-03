# PhantomSlotWidget

<div>
  <video width="50%" controls style="margin-left: 20px; float: right;">
    <source src="../../assets/phantom_slot.mp4" type="video/mp4">
    Your browser does not support video.
  </video>
</div>

The `PhantomSlotWidget` is a UI widget representing a "phantom" item slot, commonly used for ghost ingredient inputs in recipe configurations. Unlike regular slots, it does not interact with real inventories but allows setting, modifying, and clearing items for visual or configurational purposes.

## Features

- Does not allow item taking or putting from real inventories.
- Supports setting items via UI clicks or API calls.
- Allows right-click clearing (`clearSlotOnRightClick`).
- Supports integration with JEI/EMI for ghost ingredient handling.

---

## Basic Properties

| Field                  | Description                                          |
|------------------------|------------------------------------------------------|
| `maxStackSize`        | Maximum allowed stack size in this phantom slot.      |
| `clearSlotOnRightClick` | Whether right-clicking clears the slot.               |

---

## APIs

It owns all APIs from [`SlotWidget`](Slot.md), and you can get or set item by its APIs.

### setClearSlotOnRightClick

Configures whether right-clicking on the slot clears its contents.

=== "Java / KubeJS"

    ```java
    phantomSlot.setClearSlotOnRightClick(true);
    ```

---

### setMaxStackSize

Sets the maximum allowed stack size in the phantom slot.

=== "Java / KubeJS"

    ```java
    phantomSlot.setMaxStackSize(64);
    ```

---

### Mouse Interactions

Phantom slots handle different types of mouse interactions:

| Mouse Action                | Effect |
|-----------------------------|--------|
| **Left-click** on empty slot with an item | Sets the item to the slot |
| **Left-click** on filled slot with an item | Replaces the item in the slot |
| **Right-click** on filled slot | Decreases stack size |
| **Shift + Click** | Adjusts stack size dynamically |
| **Right-click on empty slot** | Clears the slot (if `clearSlotOnRightClick` is enabled) |
