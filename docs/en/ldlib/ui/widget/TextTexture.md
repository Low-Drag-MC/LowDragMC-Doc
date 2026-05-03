# TextTextureWidget

`TextTextureWidget` is an advanced text widget compared with [`LabelWidget`](Label.md).
It wrapper an internal [`TextTexture`](../textures/text.md), therefore, you can set the all text rendering properties by it.

## Basic Properties

| Field         | Description                                                  |
|---------------|--------------------------------------------------------------|
| lastComponent | The last component text displayed  `read only`                        |
| textTexture   | Internal `TextTexture` `read only`                 |

---

## APIs

### textureStyle

Modifies the style of the internal text texture. see [`TextTexture`](../textures/text.md) for more details.

=== "Java"

    ``` java
    textTextureWidget.textureStyle(texture -> {
        texture.setType(TextType.ROLL);
        texture.setRollSpeed(0.5);
    });
    ```
=== "KubeJS"

    ``` javascript
    textTextureWidget.textureStyle(texture => {
        texture.setType(TextType.ROLL);
        texture.setRollSpeed(0.5);
    });
    ```

---

### `setText`

Sets the text using a string.

=== "Java / KubeJS"

    ``` java
    textTextureWidget.setText("Hello World");
    ```

---

### `setText` / `setComponent`

Sets the text using a Component.

=== "Java"

    ``` java
    textTextureWidget.setText(Component.literal("Hello World"));
    ```

=== "KubeJS"

    ``` javascript
    textTextureWidget.setComponent("....");
    ```

---

### `setText / setTextProvider`

Sets the text using a Supplier.

=== "Java"

    ``` java
    textTextureWidget.setText(() -> "dynamic text");
    ```

=== "KubeJS"

    ``` javascript
    textTextureWidget.setTextProvider(() => Component.string("dynamic text"));
    ```