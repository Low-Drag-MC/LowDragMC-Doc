# 文本区
{{ version_badge("2.2.1", label="Since", icon="tag") }}
`TextArea` 是一个多行文本编辑器。它的值是`String[]`——每行一个元素。它具有内置的水平和垂直滚动条、用于错误突出显示的文本**验证器**以及完整的键盘支持（箭头、`Home`/`End`、`PageUp`/`PageDown`、`Ctrl+←/→` 单词导航、选择、复制/剪切/粘贴、撤消/重做）。
当聚焦（单击）时，编辑器变得可编辑。双击选择一个单词。
!!!笔记 ””[UIElement](../element.md){ data-preview } 上记录的所有内容（布局、样式、事件、数据绑定等）也适用于此处。
---

＃＃ 用法
===“Java”
    ```java
    var area = new TextArea();
    area.setValue(new String[] { "Line 1", "Line 2", "Line 3" });
    area.setLinesResponder(lines -> {
        // called on each valid edit
        System.out.println("Lines: " + Arrays.toString(lines));
    });
    parent.addChild(area);
    ```

===“科特林”
    ```kotlin
    textArea({
        layout { width(200).height(80) }
    }) {
        api {
            setValue(arrayOf("Line 1", "Line 2"))
            setLinesResponder { lines -> println(lines.joinToString("\n")) }
        }
    }
    ```

===“KubeJS”
    ```js
    let area = new TextArea();
    area.setValue(["Line 1", "Line 2"]);
    area.setLinesResponder(lines => { /* ... */ });
    parent.addChild(area);
    ```

---

## XML
```xml
<!-- Pre-populated text (lines split by \n in source) -->
<text-area>Line 1
Line 2
Line 3</text-area>
```

!!!笔记 ””`TextArea` 不能在 XML 中添加布局子项 — 只能添加文本内容。
---

## 内部结构
| CSS class | Description |
| --------- | ----------- |
| `.__text-area_content-view__` | The main editing surface. |
| `.__text-area_vertical-scroller__` | The vertical scroll bar (right side). |
| `.__text-area_horizontal-scroller__` | The horizontal scroll bar (bottom). |

---

## 文本区域样式
!!!信息“”#### <p style="font-size: 1rem;">焦点覆盖</p>
当内容视图悬停或聚焦时，在内容视图上绘制纹理。
默认值：`Sprites.RECT_RD_T_SOLID`
===“Java”
        ```java
        area.textAreaStyle(style -> style.focusOverlay(myHighlight));
        ```

===“LSS”
        ```css
        text-area {
            focus-overlay: rect(#FFFFFF22, 2);
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">字体/字体大小</p>
所有行使用的字体和大小。
默认值：普通默认字体/`9`
===“LSS”
        ```css
        text-area {
            font: "minecraft:uniform";
            font-size: 9;
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">文本颜色/错误颜色</p>
有效时/验证器拒绝内容时的文本颜色。
默认值：`0xFFFFFF` / `0xFF0000`
===“LSS”
        ```css
        text-area {
            text-color: #EEEEEE;
            error-color: #FF4444;
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">光标颜色</p>
闪烁插入符号的颜色。
默认值：`0xEEEEEE`
===“LSS”
        ```css
        text-area {
            cursor-color: #FFFFFF;
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">文字阴影</p>
是否使用阴影绘制文本。
默认值：`true`
===“LSS”
        ```css
        text-area {
            text-shadow: false;
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">占位符</p>
当所有行都为空时显示幻影文本。
默认值：可翻译键`text_field.empty`
===“Java”
        ```java
        area.textAreaStyle(style -> style
            .placeholder(Component.literal("Enter code…"))
        );
        ```

!!!信息“”#### <p style="font-size: 1rem;">行距</p>
行间添加额外像素。
默认值：`1`
===“LSS”
        ```css
        text-area {
            line-spacing: 2;
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">滚动视图模式</p>
启用了哪些滚动轴。值：`HORIZONTAL`、`VERTICAL`、`BOTH`。
默认值：`BOTH`
===“Java”
        ```java
        area.textAreaStyle(style -> style.viewMode(ScrollerMode.VERTICAL));
        ```

===“LSS”
        ```css
        text-area {
            scroller-view-mode: VERTICAL;
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">滚动条垂直显示 / 滚动条水平显示</p>
每个滚动条的可见性策略。取值：`AUTO`（仅当内容溢出时显示）、`ALWAYS`、`NEVER`。
默认值：`AUTO`
===“Java”
        ```java
        area.textAreaStyle(style -> style
            .verticalScrollDisplay(ScrollDisplay.ALWAYS)
            .horizontalScrollDisplay(ScrollDisplay.NEVER)
        );
        ```

===“LSS”
        ```css
        text-area {
            scroller-vertical-display: ALWAYS;
            scroller-horizontal-display: NEVER;
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">滚动视图边距</p>
当垂直滚动条可见时水平滚动条的右边距。
默认值：`5`
===“LSS”
        ```css
        text-area {
            scroller-view-margin: 5;
        }
        ```

---

## 值绑定
`TextArea` 扩展了`BindableUIElement<String[]>`，因此它与数据绑定系统集成：
===“Java”
    ```java
    area.bind(DataBindingBuilder.create(
        () -> config.getLines(),
        lines -> config.setLines(lines)
    ).build());
    ```

有关完整详细信息，请参阅[Data Bindings](../data_bindings.md){ data-preview }。
---

## 字段
| Name | Type | Access | Description |
| ---- | ---- | ------ | ----------- |
| `horizontalScroller` | `Scroller.Horizontal` | `public final` | The horizontal scroll bar. |
| `verticalScroller` | `Scroller.Vertical` | `public final` | The vertical scroll bar. |
| `contentView` | `UIElement` | `public final` | The visible editing surface. |
| `textAreaStyle` | `TextAreaStyle` | `private` (getter) | Current style instance. |
| `isError` | `boolean` | `private` (getter) | `true` when current lines fail the validator. |
| `cursorLine` | `int` | `private` (getter) | Row of the cursor (0-indexed). |
| `cursorCol` | `int` | `private` (getter) | Column of the cursor (0-indexed). |

---

＃＃ 方法
| Method | Returns | Description |
| ------ | ------- | ----------- |
| `setValue(String[])` | `TextArea` | Sets all lines and notifies listeners. |
| `setValue(String[], boolean)` | `TextArea` | Sets all lines; second param controls notification. |
| `setLines(List<String>)` | `TextArea` | Convenience for `setValue(list.toArray(...))`. |
| `setLinesResponder(Consumer<String[]>)` | `TextArea` | Registers a listener called on each valid edit. |
| `setTextValidator(Predicate<String[]>)` | `TextArea` | Custom validator; invalid content is shown in `error-color`. |
| `setCharValidator(Predicate<Character>)` | `TextArea` | Filters characters before they are inserted. |
| `textAreaStyle(Consumer<TextAreaStyle>)` | `TextArea` | Configures style fluently. |
| `getValue()` | `String[]` | Returns the last validated line array. |
| `isEditable()` | `boolean` | `true` when focused, active, visible and displayed. |
| `hasSelection()` | `boolean` | `true` if there is an active text selection. |
| `setCursor(int, int)` | `void` | Moves the cursor to a specific `(line, col)`. |
