# LabelWidget

<img src="../assets/label.png" alt="Image title" width="30%" class="md-img-right">

`LabelWidget` is used to display text and component.

::: info Advanced Widget
`LabelWidget` is a light-weight widget to display text only. text height, align, ... are fixed.
Therefore, we reconmend to use the [`TextTextureWidget`](TextTexture.md) instead, which provids advanced controll of text display.
:::


## Basic Properties

| Field           | Description                                                                       |
|-----------------|-----------------------------------------------------------------------------------|
| `color`         | The text color as an integer                                                      |
| `dropShadow`    | Indicates whether the drop shadow effect is enabled                               |
| `lastTextValue` | currently text `read only` |

---

## APIs

### `setText()`

Updates the label text with a `string`.

<DocTabs>
<DocTab title="Java / KubeJS">

``` java
label.setText("New Label Text");
```

</DocTab>
</DocTabs>
---

### `setComponent()`

Same as `setText()` but support `component` as input

---

### `setTextProvider()`

Configures a supplier to dynamically provide the label text. It will obtain the latest text per tick.

<DocTabs>
<DocTab title="Java">

``` java
label.setTextProvider(() -> "Dynamic Text");
```

</DocTab>
<DocTab title="KubeJS">

``` javascript
label.setTextProvider(() => "Dynamic Text");
```

</DocTab>
</DocTabs>
---

### `setColor()`

Sets the text color. If a rich text component is already set, its style will be replaced accordingly.

<DocTabs>
<DocTab title="Java / KubeJS">

``` java
label.setColor(0xFFFFFFFF); // ARGB
```

</DocTab>
</DocTabs>
---

### `setDropShadow()`

Enables or disables the drop shadow effect for the label.

<DocTabs>
<DocTab title="Java / KubeJS">

``` java
label.setDropShadow(true);
```

</DocTab>
</DocTabs>
---