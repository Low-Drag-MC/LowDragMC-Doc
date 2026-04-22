# TextElement

{{ version_badge("2.2.1", label="Since", icon="tag") }}

`TextElement` is a low-level text rendering element. It displays a `Component` (a Minecraft rich-text object) with configurable font, size, color, alignment, wrapping, and scrolling behaviour.

Most use cases are better served by [`Label`](label.md){ data-preview } (which adds data binding) or the built-in text labels inside [`Button`](button.md){ data-preview }, [`Toggle`](toggle.md){ data-preview }, etc.

!!! note ""
    Everything documented on [UIElement](../element.md){ data-preview } (layout, styles, events, data bindings, etc.) applies here too.

---

## Usage

=== "Java"

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

=== "Kotlin"

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

=== "KubeJS"

    ```js
    let text = new TextElement();
    text.setText(Component.literal("Hello world"));
    text.textStyle(style => style.fontSize(12).textColor(0xFFFF00));
    parent.addChild(text);
    ```

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

!!! note ""
    `TextElement` cannot have layout children added in XML — only text content.

---

## Text Style

`TextStyle` controls all visual aspects of the rendered text.

!!! info ""
    #### <p style="font-size: 1rem;">font-size</p>

    Height of each line of text in pixels.

    Default: `9`

    === "Java"

        ```java
        text.textStyle(style -> style.fontSize(12));
        ```

    === "LSS"

        ```css
        text {
            font-size: 12;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">text-color</p>

    ARGB colour of the text. Use `0xRRGGBB` (alpha defaults to full opacity).

    Default: `0xFFFFFF` (white)

    === "Java"

        ```java
        text.textStyle(style -> style.textColor(0xFFFF00));
        ```

    === "LSS"

        ```css
        text {
            text-color: #FFFF00;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">text-shadow</p>

    Whether to draw a drop-shadow under the text.

    Default: `true`

    === "Java"

        ```java
        text.textStyle(style -> style.textShadow(false));
        ```

    === "LSS"

        ```css
        text {
            text-shadow: false;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">font</p>

    Resource location of the font to use.

    Default: Vanilla default font (`minecraft:default`)

    === "Java"

        ```java
        text.textStyle(style -> style.font(ResourceLocation.parse("minecraft:uniform")));
        ```

    === "LSS"

        ```css
        text {
            font: "minecraft:uniform";
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">horizontal-align</p>

    Horizontal alignment of text lines within the element. Values: `LEFT`, `CENTER`, `RIGHT`.

    Default: `LEFT`

    === "Java"

        ```java
        text.textStyle(style -> style.textAlignHorizontal(Horizontal.CENTER));
        ```

    === "LSS"

        ```css
        text {
            horizontal-align: CENTER;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">vertical-align</p>

    Vertical alignment of the text block within the element. Values: `TOP`, `CENTER`, `BOTTOM`.

    Default: `TOP`

    === "Java"

        ```java
        text.textStyle(style -> style.textAlignVertical(Vertical.CENTER));
        ```

    === "LSS"

        ```css
        text {
            vertical-align: CENTER;
        }
        ```

!!! info ""
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

    === "Java"

        ```java
        text.textStyle(style -> style.textWrap(TextWrap.WRAP));
        ```

    === "LSS"

        ```css
        text {
            text-wrap: WRAP;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">roll-speed</p>

    Speed multiplier for `ROLL` / `HOVER_ROLL` scrolling. Higher values scroll faster.

    Default: `1.0`

    === "Java"

        ```java
        text.textStyle(style -> style.rollSpeed(2f));
        ```

    === "LSS"

        ```css
        text {
            roll-speed: 2;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">line-spacing</p>

    Extra pixels of space added between lines when text wraps.

    Default: `1`

    === "Java"

        ```java
        text.textStyle(style -> style.lineSpacing(3f));
        ```

    === "LSS"

        ```css
        text {
            line-spacing: 3;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">adaptive-height</p>

    When `true`, the element's height is set automatically to fit all text lines.

    Default: `false`

    === "Java"

        ```java
        text.textStyle(style -> style.adaptiveHeight(true));
        ```

    === "LSS"

        ```css
        text {
            adaptive-height: true;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">adaptive-width</p>

    When `true`, the element's width is set automatically to fit the first line's text.

    Default: `false`

    === "Java"

        ```java
        text.textStyle(style -> style.adaptiveWidth(true));
        ```

    === "LSS"

        ```css
        text {
            adaptive-width: true;
        }
        ```

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
| `textStyle(Consumer<TextStyle>)` | `TextElement` | Configures `TextStyle` fluently. |
| `recompute()` | `void` | Forces a re-layout of the text lines (called automatically on style or size changes). |
| `getText()` | `Component` | Returns the current text. |
