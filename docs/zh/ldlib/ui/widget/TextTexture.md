# TextTextureWidget

`TextTextureWidget` 是一个比 [`LabelWidget`](Label.md) 更高级的文本控件。
它封装了一个内部的 [`TextTexture`](../textures/text.md)，因此你可以通过它来设置所有文本渲染属性。

## 基本属性

| 字段          | 说明                                                         |
|---------------|--------------------------------------------------------------|
| lastComponent | 最后显示的组件文本  `只读`                                   |
| textTexture   | 内部 `TextTexture` `只读`                                    |

---

## API

### textureStyle

修改内部文本纹理的样式。更多详情请参见 [`TextTexture`](../textures/text.md)。

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

使用字符串设置文本。

=== "Java / KubeJS"

    ``` java
    textTextureWidget.setText("Hello World");
    ```

---

### `setText` / `setComponent`

使用 Component 设置文本。

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

使用 Supplier 设置文本。

=== "Java"

    ``` java
    textTextureWidget.setText(() -> "dynamic text");
    ```

=== "KubeJS"

    ``` javascript
    textTextureWidget.setTextProvider(() => Component.string("dynamic text"));
    ```
