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

<DocTabs>
<DocTab title="Java">

``` java
textTextureWidget.textureStyle(texture -> {
    texture.setType(TextType.ROLL);
    texture.setRollSpeed(0.5);
});
```

</DocTab>
<DocTab title="KubeJS">

``` javascript
textTextureWidget.textureStyle(texture => {
    texture.setType(TextType.ROLL);
    texture.setRollSpeed(0.5);
});
```

</DocTab>
</DocTabs>
---

### `setText`

Sets the text using a string.

<DocTabs>
<DocTab title="Java / KubeJS">

``` java
textTextureWidget.setText("Hello World");
```

</DocTab>
</DocTabs>
---

### `setText` / `setComponent`

Sets the text using a Component.

<DocTabs>
<DocTab title="Java">

``` java
textTextureWidget.setText(Component.literal("Hello World"));
```

</DocTab>
<DocTab title="KubeJS">

``` javascript
textTextureWidget.setComponent("....");
```

</DocTab>
</DocTabs>
---

### `setText / setTextProvider`

Sets the text using a Supplier.

<DocTabs>
<DocTab title="Java">

``` java
textTextureWidget.setText(() -> "dynamic text");
```

</DocTab>
<DocTab title="KubeJS">

``` javascript
textTextureWidget.setTextProvider(() => Component.string("dynamic text"));
```

</DocTab>
</DocTabs>