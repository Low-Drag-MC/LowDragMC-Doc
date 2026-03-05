# TextArea

{{ version_badge("2.2.1", label="Since", icon="tag") }}

`TextArea` 是多行文本编辑器。其值为 `String[]` —— 每行一个元素。它内置了水平和垂直滚动条、用于错误高亮的文本**验证器**，以及完整的键盘支持（方向键、`Home`/`End`、`PageUp`/`PageDown`、`Ctrl+←/→` 按词导航、选择、复制/剪切/粘贴、撤销/重做）。

当编辑器获得焦点（被点击）时，即可进行编辑。双击可选中一个单词。

!!! note ""
    [UIElement](../element.md){ data-preview } 中记录的所有内容（布局、样式、事件、数据绑定等）同样适用于此组件。

---

## 使用方法

=== "Java"

    ```java
    var area = new TextArea();
    area.setValue(new String[] { "Line 1", "Line 2", "Line 3" });
    area.setLinesResponder(lines -> {
        // called on each valid edit
        System.out.println("Lines: " + Arrays.toString(lines));
    });
    parent.addChild(area);
    ```

=== "Kotlin"

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

=== "KubeJS"

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

!!! note ""
    `TextArea` 在 XML 中不能添加布局子元素 —— 只能包含文本内容。

---

## 内部结构

| CSS 类名 | 描述 |
| --------- | ----------- |
| `.__text-area_content-view__` | 主编辑区域。 |
| `.__text-area_vertical-scroller__` | 垂直滚动条（右侧）。 |
| `.__text-area_horizontal-scroller__` | 水平滚动条（底部）。 |

---

## Text Area 样式

!!! info ""
    #### <p style="font-size: 1rem;">focus-overlay</p>

    当内容视图被悬停或获得焦点时绘制的覆盖纹理。

    默认值：`Sprites.RECT_RD_T_SOLID`

    === "Java"

        ```java
        area.textAreaStyle(style -> style.focusOverlay(myHighlight));
        ```

    === "LSS"

        ```css
        text-area {
            focus-overlay: rect(#FFFFFF22, 2);
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">font / font-size</p>

    所有行使用的字体和字号。

    默认值：原版默认字体 / `9`

    === "LSS"

        ```css
        text-area {
            font: "minecraft:uniform";
            font-size: 9;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">text-color / error-color</p>

    有效文本的颜色 / 验证器拒绝内容时的颜色。

    默认值：`0xFFFFFF` / `0xFF0000`

    === "LSS"

        ```css
        text-area {
            text-color: #EEEEEE;
            error-color: #FF4444;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">cursor-color</p>

    闪烁光标的颜色。

    默认值：`0xEEEEEE`

    === "LSS"

        ```css
        text-area {
            cursor-color: #FFFFFF;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">text-shadow</p>

    是否在文本下方绘制阴影。

    默认值：`true`

    === "LSS"

        ```css
        text-area {
            text-shadow: false;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">placeholder</p>

    当所有行为空时显示的占位文本。

    默认值：翻译键 `text_field.empty`

    === "Java"

        ```java
        area.textAreaStyle(style -> style
            .placeholder(Component.literal("Enter code…"))
        );
        ```

!!! info ""
    #### <p style="font-size: 1rem;">line-spacing</p>

    行与行之间额外添加的像素间距。

    默认值：`1`

    === "LSS"

        ```css
        text-area {
            line-spacing: 2;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">scroller-view-mode</p>

    启用的滚动轴方向。可选值：`HORIZONTAL`、`VERTICAL`、`BOTH`。

    默认值：`BOTH`

    === "Java"

        ```java
        area.textAreaStyle(style -> style.viewMode(ScrollerMode.VERTICAL));
        ```

    === "LSS"

        ```css
        text-area {
            scroller-view-mode: VERTICAL;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">scroller-vertical-display / scroller-horizontal-display</p>

    每个滚动条的可见策略。可选值：`AUTO`（仅在内容溢出时显示）、`ALWAYS`、`NEVER`。

    默认值：`AUTO`

    === "Java"

        ```java
        area.textAreaStyle(style -> style
            .verticalScrollDisplay(ScrollDisplay.ALWAYS)
            .horizontalScrollDisplay(ScrollDisplay.NEVER)
        );
        ```

    === "LSS"

        ```css
        text-area {
            scroller-vertical-display: ALWAYS;
            scroller-horizontal-display: NEVER;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">scroller-view-margin</p>

    当垂直滚动条可见时，水平滚动条的右边距。

    默认值：`5`

    === "LSS"

        ```css
        text-area {
            scroller-view-margin: 5;
        }
        ```

---

## 值绑定

`TextArea` 扩展自 `BindableUIElement<String[]>`，因此支持数据绑定系统：

=== "Java"

    ```java
    area.bind(DataBindingBuilder.create(
        () -> config.getLines(),
        lines -> config.setLines(lines)
    ).build());
    ```

详见 [数据绑定](../data_bindings.md){ data-preview }。

---

## 字段

| 名称 | 类型 | 访问权限 | 描述 |
| ---- | ---- | ------ | ----------- |
| `horizontalScroller` | `Scroller.Horizontal` | `public final` | 水平滚动条。 |
| `verticalScroller` | `Scroller.Vertical` | `public final` | 垂直滚动条。 |
| `contentView` | `UIElement` | `public final` | 可见的编辑区域。 |
| `textAreaStyle` | `TextAreaStyle` | `private`（有 getter） | 当前样式实例。 |
| `isError` | `boolean` | `private`（有 getter） | 当前行未通过验证器时为 `true`。 |
| `cursorLine` | `int` | `private`（有 getter） | 光标所在行（从 0 开始）。 |
| `cursorCol` | `int` | `private`（有 getter） | 光标所在列（从 0 开始）。 |

---

## 方法

| 方法 | 返回值 | 描述 |
| ------ | ------- | ----------- |
| `setValue(String[])` | `TextArea` | 设置所有行并通知监听器。 |
| `setValue(String[], boolean)` | `TextArea` | 设置所有行；第二个参数控制是否通知。 |
| `setLines(List<String>)` | `TextArea` | `setValue(list.toArray(...))` 的便捷方法。 |
| `setLinesResponder(Consumer<String[]>)` | `TextArea` | 注册监听器，每次有效编辑时调用。 |
| `setTextValidator(Predicate<String[]>)` | `TextArea` | 自定义验证器；无效内容以 `error-color` 显示。 |
| `setCharValidator(Predicate<Character>)` | `TextArea` | 在字符插入前进行过滤。 |
| `textAreaStyle(Consumer<TextAreaStyle>)` | `TextArea` | 以流式方式配置样式。 |
| `getValue()` | `String[]` | 返回最后验证通过的行数组。 |
| `isEditable()` | `boolean` | 当获得焦点、处于活动状态、可见且已显示时为 `true`。 |
| `hasSelection()` | `boolean` | 当存在活动文本选区时为 `true`。 |
| `setCursor(int, int)` | `void` | 将光标移动到指定的 `(line, col)` 位置。 |
