# TextElement

<VersionBadge version="2.2.1" label="Since" icon="tag" />

`TextElement` is a low-level text rendering element. It displays a `Component` (a Minecraft rich-text object) with configurable font, size, color, alignment, wrapping, and scrolling behaviour.

Most use cases are better served by [`Label`](label.md) (which adds data binding) or the built-in text labels inside [`Button`](button.md), [`Toggle`](toggle.md), etc.

::: info
Everything documented on [UIElement](element.md) (layout, styles, events, data bindings, etc.) applies here too.
:::

---

## Usage

<DocTabs>
<DocTab title="Java">

```java
var text = new TextElement();
text.setText("my.translation.key", true);  // translated
text.textStyle(style -> style
    .fontSize(12)
    .textColor(0xFFFF00)
    .textShadow(false)
    .textAlignHorizontal(Horizontal.CENTER)
);
parent.addChild(text);
```

</DocTab>
<DocTab title="Kotlin">

```kotlin
text({
    layout { width(80).height(18) }
    textStyle {
        fontSize(12f)
        textColor(0xFFFF00)
        textAlignHorizontal(Horizontal.CENTER)
    }
}) { }
```

</DocTab>
<DocTab title="KubeJS">

```js
let text = new TextElement();
text.setText(Component.literal("Hello world"));
text.textStyle(style => style.fontSize(12).textColor(0xFFFF00));
parent.addChild(text);
```

</DocTab>
</DocTabs>
---

## XML

Text content is read from the element's child nodes using Minecraft's component format:

```xml
<!-- Literal text via a plain text node -->
<text>Hello World</text>

<!-- Translatable via a translate child element -->
<text><translate key="my.translation.key"/></text>

<!-- Multiple inline components are concatenated -->
<text>Prefix: <translate key="my.key"/></text>
```

::: info
`TextElement` cannot have layout children added in XML — only text content.
:::

---

## Text Style

`TextStyle` controls all visual aspects of the rendered text.

::: info
#### <p style="font-size: 1rem;">font-size</p>

Height of each line of text in pixels.

Default: `9`

<DocTabs>
<DocTab title="Java">

```java
text.textStyle(style -> style.fontSize(12));
```

</DocTab>
<DocTab title="LSS">

```css
text {
    font-size: 12;
}
```

</DocTab>
</DocTabs>
:::

::: info
#### <p style="font-size: 1rem;">text-color</p>

ARGB colour of the text. Use `0xRRGGBB` (alpha defaults to full opacity).

Default: `0xFFFFFF` (white)

<DocTabs>
<DocTab title="Java">

```java
text.textStyle(style -> style.textColor(0xFFFF00));
```

</DocTab>
<DocTab title="LSS">

```css
text {
    text-color: #FFFF00;
}
```

</DocTab>
</DocTabs>
:::

::: info
#### <p style="font-size: 1rem;">text-shadow</p>

Whether to draw a drop-shadow under the text.

Default: `true`

<DocTabs>
<DocTab title="Java">

```java
text.textStyle(style -> style.textShadow(false));
```

</DocTab>
<DocTab title="LSS">

```css
text {
    text-shadow: false;
}
```

</DocTab>
</DocTabs>
:::

::: info
#### <p style="font-size: 1rem;">font</p>

Resource location of the font to use.

Default: Vanilla default font (`minecraft:default`)

<DocTabs>
<DocTab title="Java">

```java
text.textStyle(style -> style.font(ResourceLocation.parse("minecraft:uniform")));
```

</DocTab>
<DocTab title="LSS">

```css
text {
    font: "minecraft:uniform";
}
```

</DocTab>
</DocTabs>
:::

::: info
#### <p style="font-size: 1rem;">horizontal-align</p>

Horizontal alignment of text lines within the element. Values: `LEFT`, `CENTER`, `RIGHT`.

Default: `LEFT`

<DocTabs>
<DocTab title="Java">

```java
text.textStyle(style -> style.textAlignHorizontal(Horizontal.CENTER));
```

</DocTab>
<DocTab title="LSS">

```css
text {
    horizontal-align: CENTER;
}
```

</DocTab>
</DocTabs>
:::

::: info
#### <p style="font-size: 1rem;">vertical-align</p>

Vertical alignment of the text block within the element. Values: `TOP`, `CENTER`, `BOTTOM`.

Default: `TOP`

<DocTabs>
<DocTab title="Java">

```java
text.textStyle(style -> style.textAlignVertical(Vertical.CENTER));
```

</DocTab>
<DocTab title="LSS">

```css
text {
    vertical-align: CENTER;
}
```

</DocTab>
</DocTabs>
:::

::: info
#### <p style="font-size: 1rem;">text-wrap</p>

Controls how text behaves when it exceeds the element width.

Default: `NONE`

| Value | Behaviour |
| ----- | --------- |
| `NONE` | No wrapping; text is displayed on one line and may overflow. |
| `WRAP` | Text wraps onto multiple lines. |
| `ROLL` | Text scrolls horizontally in a continuous loop. |
| `HOVER_ROLL` | Text scrolls horizontally only when the mouse hovers over the element. |
| `HIDE` | Text is clipped to one line; overflow is hidden. |

<DocTabs>
<DocTab title="Java">

```java
text.textStyle(style -> style.textWrap(TextWrap.WRAP));
```

</DocTab>
<DocTab title="LSS">

```css
text {
    text-wrap: WRAP;
}
```

</DocTab>
</DocTabs>
:::

::: info
#### <p style="font-size: 1rem;">roll-speed</p>

Speed multiplier for `ROLL` / `HOVER_ROLL` scrolling. Higher values scroll faster.

Default: `1.0`

<DocTabs>
<DocTab title="Java">

```java
text.textStyle(style -> style.rollSpeed(2f));
```

</DocTab>
<DocTab title="LSS">

```css
text {
    roll-speed: 2;
}
```

</DocTab>
</DocTabs>
:::

::: info
#### <p style="font-size: 1rem;">line-spacing</p>

Extra pixels of space added between lines when text wraps.

Default: `1`

<DocTabs>
<DocTab title="Java">

```java
text.textStyle(style -> style.lineSpacing(3f));
```

</DocTab>
<DocTab title="LSS">

```css
text {
    line-spacing: 3;
}
```

</DocTab>
</DocTabs>
:::

::: info
#### <p style="font-size: 1rem;">adaptive-height</p>

When `true`, the element's height is set automatically to fit all text lines.

Default: `false`

<DocTabs>
<DocTab title="Java">

```java
text.textStyle(style -> style.adaptiveHeight(true));
```

</DocTab>
<DocTab title="LSS">

```css
text {
    adaptive-height: true;
}
```

</DocTab>
</DocTabs>
:::

::: info
#### <p style="font-size: 1rem;">adaptive-width</p>

When `true`, the element's width is set automatically to fit the first line's text.

Default: `false`

<DocTabs>
<DocTab title="Java">

```java
text.textStyle(style -> style.adaptiveWidth(true));
```

</DocTab>
<DocTab title="LSS">

```css
text {
    adaptive-width: true;
}
```

</DocTab>
</DocTabs>
:::

---

## Fields

| Name | Type | Access | Description |
| ---- | ---- | ------ | ----------- |
| `textStyle` | `TextStyle` | `private` (getter) | The style object for this element's text. |
| `text` | `Component` | `private` (getter) | The current text `Component`. |

---

## Methods

| Method | Returns | Description |
| ------ | ------- | ----------- |
| `setText(String, boolean)` | `TextElement` | Sets text. `true` = translatable, `false` = literal. |
| `setText(Component)` | `TextElement` | Sets text from a `Component` directly. |
| `textStyle(Consumer&lt;TextStyle&gt;)` | `TextElement` | Configures `TextStyle` fluently. |
| `recompute()` | `void` | Forces a re-layout of the text lines (called automatically on style or size changes). |
| `getText()` | `Component` | Returns the current text. |
