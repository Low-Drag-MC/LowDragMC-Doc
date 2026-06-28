# SelectorWidget

<div>
  <video width="50%" controls style="margin-left: 20px; float: right;">
    <source src="../assets/selector.mp4" type="video/mp4">
    Your browser does not support video.
  </video>
</div>

The `SelectorWidget` is a **dropdown-style selection widget** that allows users to pick an option from a predefined list. It supports dynamically updating the selection list, displaying a configurable UI, and handling selection changes efficiently.

---

## Features

- **Dropdown selection** – Expands to show available choices.
- **Event handling** – Fires callbacks when the selection changes.

---

## Properties

| Field           | Type                      | Description |
|----------------|--------------------------|-------------|
| `currentValue` | `String`                  | Currently selected option. |

---

## APIs

### setCandidates

Updates the list of selectable options.

<DocTabs>
<DocTab title="Java">

```Java
selectorWidget.setCandidates(List.of("OptionA", "OptionB", "OptionC"));
```

</DocTab>
<DocTab title="KubeJS">

```Javascript
selectorWidget.setCandidates(["OptionA", "OptionB", "OptionC"]);
```

</DocTab>
</DocTabs>

- Triggers a UI update to reflect the new options.

---

### setValue

Sets the currently selected value.

<DocTabs>
<DocTab title="Java / KubeJS">

```java
selectorWidget.setValue("OptionA");
```

</DocTab>
</DocTabs>

- If the value is **not found** in `candidates`, it remains unchanged.

---

### setMaxCount

Defines how many options should be visible **before scrolling**.

<DocTabs>
<DocTab title="Java / KubeJS">

```java
selectorWidget.setMaxCount(3);
```

</DocTab>
</DocTabs>

- If there are **more** than `maxCount` options, a **scrollbar** is added.

---

### setFontColor

Changes the color of option text.

<DocTabs>
<DocTab title="Java / KubeJS">

```java
selectorWidget.setFontColor(0xFFFFFF); // White text
```

</DocTab>
</DocTabs>

---

### setButtonBackground

Sets the background texture for the button area.

<DocTabs>
<DocTab title="Java / KubeJS">

```java
selectorWidget.setButtonBackground(myCustomTexture);
```

</DocTab>
</DocTabs>

---

### setOnChanged

Registers a callback to handle selection changes.

<DocTabs>
<DocTab title="Java">

```java
selectorWidget.setOnChanged(selected -> {
    System.out.println("New selection: " + selected);
});
```

</DocTab>
<DocTab title="KubeJS">

```javascript
selectorWidget.setOnChanged(selected => {
    console.log("New selection: " + selected);
});
```

</DocTab>
</DocTabs>

- This is useful for **updating UI state** or triggering **game logic**.

---

### setCandidatesSupplier

Automatically updates the option list from a dynamic source.

<DocTabs>
<DocTab title="Java">

```java
selectorWidget.setCandidatesSupplier(() -> fetchDynamicOptions());
```

</DocTab>
<DocTab title="KubeJS">

```javascript
selectorWidget.setCandidatesSupplier(() => fetchDynamicOptions());
```

</DocTab>
</DocTabs>

- The widget **polls** this function to refresh the list.
- Useful when **candidates change based on external conditions**.

---

### setShow

Manually toggles the dropdown visibility.

<DocTabs>
<DocTab title="Java / KubeJS">

```java
selectorWidget.setShow(true); // Opens dropdown
```

</DocTab>
</DocTabs>
