
# TextFieldWidget

<div>
  <video width="50%" controls style="margin-left: 20px; float: right;">
    <source src="../assets/textfield.mp4" type="video/mp4">
    Your browser does not support video.
  </video>
</div>


The `TextFieldWidget` provides an editable text field for GUI interfaces. It supports dynamic text updates via a supplier and responder, validation through custom validators, and configurable properties such as maximum string length, border style, and text color.

## Basic Properties

| Field              | Description                                                         |
|--------------------|---------------------------------------------------------------------|
| currentString      | The current text displayed by the text field                        |
| maxStringLength    | Maximum allowed length for the text                                 |
| isBordered         | Determines whether the text field has a border                       |
| textColor          | The color of the text (modifiable via setter)                        |
| supplier           | A supplier for dynamic text updates                                  |
| textResponder      | A responder that handles text changes                                |
| wheelDur           | Duration (or step value) used for mouse wheel adjustments              |

---

## APIs

### setTextSupplier

Sets the supplier used to update the text dynamically.

<DocTabs>
<DocTab title="Java / KubeJS">

``` java
textFieldWidget.setTextSupplier(() -> "Dynamic Text");
```

</DocTab>
</DocTabs>

---

### setTextResponder

Sets the responder to be called when the text changes.

<DocTabs>
<DocTab title="Java / KubeJS">

``` java
textFieldWidget.setTextResponder(newText -> {
    // Handle text change
});
```

</DocTab>
</DocTabs>

---

### setBordered

Configures whether the text field should display a border.

<DocTabs>
<DocTab title="Java / KubeJS">

``` java
textFieldWidget.setBordered(true);
```

</DocTab>
</DocTabs>

---

### setTextColor

Sets the text color for the text field.

<DocTabs>
<DocTab title="Java / KubeJS">

``` java
textFieldWidget.setTextColor(0xffffff);
```

</DocTab>
</DocTabs>

---

### setMaxStringLength

Sets the maximum number of characters allowed in the text field.

<DocTabs>
<DocTab title="Java / KubeJS">

``` java
textFieldWidget.setMaxStringLength(100);
```

</DocTab>
</DocTabs>

---

### setValidator

Assigns a custom validator function to control and sanitize text input.

<DocTabs>
<DocTab title="Java / KubeJS">

``` java
textFieldWidget.setValidator(text -> text.trim());
```

</DocTab>
</DocTabs>

---

### setCompoundTagOnly

Restricts input to valid compound tags. Displays a tooltip indicating the restriction.

<DocTabs>
<DocTab title="Java / KubeJS">

``` java
textFieldWidget.setCompoundTagOnly();
```

</DocTab>
</DocTabs>

---

### setResourceLocationOnly

Restricts input to valid resource locations. Displays a tooltip indicating the restriction.

<DocTabs>
<DocTab title="Java / KubeJS">

``` java
textFieldWidget.setResourceLocationOnly();
```

</DocTab>
</DocTabs>

---

### setNumbersOnly

Restricts input to numeric values. Overloads are available for different numeric types.

<DocTabs>
<DocTab title="Java">

``` java
textFieldWidget.setNumbersOnly(0, 100); // int
textFieldWidget.setNumbersOnly(0.0f, 1.0f); // float
```

</DocTab>
<DocTab title="KubeJS">

``` java
textFieldWidget.setNumbersOnlyInt(0, 100); // int
textFieldWidget.setNumbersOnlyFloat(0, 100); // float
```

</DocTab>
</DocTabs>

---

### setWheelDur

Sets the wheel duration (step value) for adjusting numbers via mouse wheel or dragging.

<DocTabs>
<DocTab title="Java / KubeJS">

``` java
textFieldWidget.setWheelDur(1);
```

</DocTab>
</DocTabs>

---
