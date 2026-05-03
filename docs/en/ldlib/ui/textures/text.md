# TextTexture

The `TextTexture` class extends `TransformTexture` to render text as a texture. It supports dynamic text updates through a supplier, configurable text styling (color, background color, drop shadow), and various text alignment or animation types (e.g. roll, hide). This class is primarily used to display formatted and localized text within GUI components.

## Basic Properties

| Field           | Description                                                  |
|-----------------|--------------------------------------------------------------|
| text            | The formatted text to display                                |
| color           | The text color (modifiable via setter)                       |
| backgroundColor | The background color behind the text                         |
| width           | The maximum width for wrapping the text                      |
| rollSpeed       | The speed at which text rolls (for animated text types)        |
| dropShadow      | Whether a drop shadow is applied to the text                  |
| type            | The text display type (e.g., NORMAL, ROLL, HIDE, LEFT, RIGHT)   |
| supplier        | A supplier for dynamic text updates                          |

---

## APIs

### setSupplier

Sets a supplier to provide dynamic text updates.

=== "Java"

    ``` java
    textTexture.setSupplier(() -> "Updated dynamic text");
    ```

=== "KubeJS"

    ``` javascript
    textTexture.setSupplier(() => "Updated dynamic text");
    ```

---

### updateText

Updates the displayed text. This method is invoked automatically via the supplier or can be called directly.

=== "Java / KubeJS"

    ``` java
    textTexture.updateText("New Text Content");
    ```

---

### setBackgroundColor

Sets the background color behind the text.

=== "Java / KubeJS"

    ``` java
    textTexture.setBackgroundColor(0xffff0000);
    ```

---

### setDropShadow

Enables or disables the drop shadow effect on the text.

=== "Java / KubeJS"

    ``` java
    textTexture.setDropShadow(true);
    ```

---

### setWidth

Sets the maximum width for the text area. This method also recalculates text wrapping based on the new width.

=== "Java / KubeJS"

    ``` java
    textTexture.setWidth(100);
    ```

---

### setType

Sets the text display type (e.g., NORMAL, ROLL, LEFT_HIDE).

!!! info "TextType"
    * `NORMAL`:  center, add new lines below
    * `HIDE`:  center, hide redundant words
    * `ROLL`:  center, hide redundant words, roll words while hover
    * `ROLL_ALWAYS`:  center always roll words while redundant
    * `LEFT`:  same as NOMAL but left align
    * `RIGHT`:  same as NORMAL but right aligh
    * `LEFT_HIDE`:  same as HIDE but left align
    * `LEFT_ROLL`:  same as ROLL but left align
    * `LEFT_ROLL_ALWAYS`:  same as ROLL_ALWAYS but let align

=== "Java / KubeJS"

    ``` java
    textTexture.setType(TextType.ROLL);
    ```

---