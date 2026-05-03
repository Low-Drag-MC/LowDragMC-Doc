
# TextFieldWidget

<div>
  <video width="50%" controls style="margin-left: 20px; float: right;">
    <source src="../../assets/textfield.mp4" type="video/mp4">
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

=== "Java / KubeJS"

    ``` java
    textFieldWidget.setTextSupplier(() -> "Dynamic Text");
    ```

---

### setTextResponder

Sets the responder to be called when the text changes.

=== "Java / KubeJS"

    ``` java
    textFieldWidget.setTextResponder(newText -> {
        // Handle text change
    });
    ```

---

### setBordered

Configures whether the text field should display a border.

=== "Java / KubeJS"

    ``` java
    textFieldWidget.setBordered(true);
    ```

---

### setTextColor

Sets the text color for the text field.

=== "Java / KubeJS"

    ``` java
    textFieldWidget.setTextColor(0xffffff);
    ```

---

### setMaxStringLength

Sets the maximum number of characters allowed in the text field.

=== "Java / KubeJS"

    ``` java
    textFieldWidget.setMaxStringLength(100);
    ```

---

### setValidator

Assigns a custom validator function to control and sanitize text input.

=== "Java / KubeJS"

    ``` java
    textFieldWidget.setValidator(text -> text.trim());
    ```

---

### setCompoundTagOnly

Restricts input to valid compound tags. Displays a tooltip indicating the restriction.

=== "Java / KubeJS"

    ``` java
    textFieldWidget.setCompoundTagOnly();
    ```

---

### setResourceLocationOnly

Restricts input to valid resource locations. Displays a tooltip indicating the restriction.

=== "Java / KubeJS"

    ``` java
    textFieldWidget.setResourceLocationOnly();
    ```

---

### setNumbersOnly

Restricts input to numeric values. Overloads are available for different numeric types.

=== "Java"

    ``` java
    textFieldWidget.setNumbersOnly(0, 100); // int
    textFieldWidget.setNumbersOnly(0.0f, 1.0f); // float
    ```

=== "KubeJS"

    ``` java
    textFieldWidget.setNumbersOnlyInt(0, 100); // int
    textFieldWidget.setNumbersOnlyFloat(0, 100); // float
    ```

---

### setWheelDur

Sets the wheel duration (step value) for adjusting numbers via mouse wheel or dragging.

=== "Java / KubeJS"

    ``` java
    textFieldWidget.setWheelDur(1);
    ```

---