# 文本元素
{{ version_badge("2.2.1", label="Since", icon="tag") }}
`TextElement` 是一个低级文本渲染元素。它显示一个`Component`（一个 Minecraft 富文本对象），具有可配置的字体、大小、颜色、对齐方式、换行和滚动行为。
大多数用例可以通过 [`Label`](label.md){ data-preview } （添加数据绑定）或 [`Button`](button.md){ data-preview }、[`Toggle`](toggle.md){ data-preview } 等内置文本标签来更好地服务。
!!!笔记 ””[UIElement](../element.md){ data-preview } 上记录的所有内容（布局、样式、事件、数据绑定等）也适用于此处。
---

＃＃ 用法
===“Java”
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

===“科特林”
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

===“KubeJS”
    ```js
    let text = new TextElement();
    text.setText(Component.literal("Hello world"));
    text.textStyle(style => style.fontSize(12).textColor(0xFFFF00));
    parent.addChild(text);
    ```

---

## XML
使用 Minecraft 的组件格式从元素的子节点读取文本内容：
```xml
<!-- Literal text via a plain text node -->
<text>Hello World</text>

<!-- Translatable via a translate child element -->
<text><translate key="my.translation.key"/></text>

<!-- Multiple inline components are concatenated -->
<text>Prefix: <translate key="my.key"/></text>
```

!!!笔记 ””`TextElement` 不能在 XML 中添加布局子项 — 只能添加文本内容。
---

## 文本样式
`TextStyle` 控制渲染文本的所有视觉方面。
!!!信息“”#### <p style="font-size: 1rem;">字体大小</p>
每行文本的高度（以像素为单位）。
默认值：`9`
===“Java”
        ```java
        text.textStyle(style -> style.fontSize(12));
        ```

===“LSS”
        ```css
        text {
            font-size: 12;
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">文字颜色</p>
文本的 ARGB 颜色。使用`0xRRGGBB`（Alpha 默认为完全不透明）。
默认值：`0xFFFFFF`（白色）
===“Java”
        ```java
        text.textStyle(style -> style.textColor(0xFFFF00));
        ```

===“LSS”
        ```css
        text {
            text-color: #FFFF00;
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">文字阴影</p>
是否在文本下方绘制阴影。
默认值：`true`
===“Java”
        ```java
        text.textStyle(style -> style.textShadow(false));
        ```

===“LSS”
        ```css
        text {
            text-shadow: false;
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">字体</p>
要使用的字体的资源位置。
默认：香草默认字体（`minecraft:default`）
===“Java”
        ```java
        text.textStyle(style -> style.font(ResourceLocation.parse("minecraft:uniform")));
        ```

===“LSS”
        ```css
        text {
            font: "minecraft:uniform";
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">水平对齐</p>
元素内文本行的水平对齐方式。值：`LEFT`、`CENTER`、`RIGHT`。
默认值：`LEFT`
===“Java”
        ```java
        text.textStyle(style -> style.textAlignHorizontal(Horizontal.CENTER));
        ```

===“LSS”
        ```css
        text {
            horizontal-align: CENTER;
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">垂直对齐</p>
元素内文本块的垂直对齐方式。值：`TOP`、`CENTER`、`BOTTOM`。
默认值：`TOP`
===“Java”
        ```java
        text.textStyle(style -> style.textAlignVertical(Vertical.CENTER));
        ```

===“LSS”
        ```css
        text {
            vertical-align: CENTER;
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">文字换行</p>
控制文本超出元素宽度时的行为方式。
默认值：`NONE`
    | Value | Behaviour |
    | ----- | --------- |
    | `NONE` | No wrapping; text is displayed on one line and may overflow. |
    | `WRAP` | Text wraps onto multiple lines. |
    | `ROLL` | Text scrolls horizontally in a continuous loop. |
    | `HOVER_ROLL` | Text scrolls horizontally only when the mouse hovers over the element. |
    | `HIDE` | Text is clipped to one line; overflow is hidden. |

===“Java”
        ```java
        text.textStyle(style -> style.textWrap(TextWrap.WRAP));
        ```

===“LSS”
        ```css
        text {
            text-wrap: WRAP;
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">滚动速度</p>
`ROLL` / `HOVER_ROLL` 滚动的速度倍增器。值越高，滚动速度越快。
默认值：`1.0`
===“Java”
        ```java
        text.textStyle(style -> style.rollSpeed(2f));
        ```

===“LSS”
        ```css
        text {
            roll-speed: 2;
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">行距</p>
文本换行时，行间添加额外的空间像素。
默认值：`1`
===“Java”
        ```java
        text.textStyle(style -> style.lineSpacing(3f));
        ```

===“LSS”
        ```css
        text {
            line-spacing: 3;
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">自适应高度</p>
当`true`时，元素的高度会自动设置以适合所有文本行。
默认值：`false`
===“Java”
        ```java
        text.textStyle(style -> style.adaptiveHeight(true));
        ```

===“LSS”
        ```css
        text {
            adaptive-height: true;
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">自适应宽度</p>
当`true`时，元素的宽度会自动设置为适合第一行的文本。
默认值：`false`
===“Java”
        ```java
        text.textStyle(style -> style.adaptiveWidth(true));
        ```

===“LSS”
        ```css
        text {
            adaptive-width: true;
        }
        ```

---

## 字段
| Name | Type | Access | Description |
| ---- | ---- | ------ | ----------- |
| `textStyle` | `TextStyle` | `private` (getter) | The style object for this element's text. |
| `text` | `Component` | `private` (getter) | The current text `Component`. |

---

＃＃ 方法
| Method | Returns | Description |
| ------ | ------- | ----------- |
| `setText(String, boolean)` | `TextElement` | Sets text. `true` = translatable, `false` = literal. |
| `setText(Component)` | `TextElement` | Sets text from a `Component` directly. |
| `textStyle(Consumer<TextStyle>)` | `TextElement` | Configures `TextStyle` fluently. |
| `recompute()` | `void` | Forces a re-layout of the text lines (called automatically on style or size changes). |
| `getText()` | `Component` | Returns the current text. |
