# TextArea

{{ version_badge("2.2.1", label="Since", icon="tag") }}

`TextArea` is a multi-line text editor. Its value is a `String[]` — one element per line. It has built-in horizontal and vertical scrollers, a text **validator** for error highlighting, and full keyboard support (arrows, `Home`/`End`, `PageUp`/`PageDown`, `Ctrl+←/→` word navigation, selection, copy/cut/paste, undo/redo).

The editor becomes editable when focused (clicked). Double-click to select a word.

!!! note ""
    Everything documented on [UIElement](../element.md){ data-preview } (layout, styles, events, data bindings, etc.) applies here too.

---

## Usage

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
    `TextArea` cannot have layout children added in XML — only text content.

---

## Internal Structure

| CSS class | Description |
| --------- | ----------- |
| `.__text-area_content-view__` | The main editing surface. |
| `.__text-area_vertical-scroller__` | The vertical scroll bar (right side). |
| `.__text-area_horizontal-scroller__` | The horizontal scroll bar (bottom). |

---

## Text Area Style

!!! info ""
    #### <p style="font-size: 1rem;">focus-overlay</p>

    Texture drawn over the content view when it is hovered or focused.

    Default: `Sprites.RECT_RD_T_SOLID`

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

    Font and size used for all lines.

    Defaults: vanilla default font / `9`

    === "LSS"

        ```css
        text-area {
            font: "minecraft:uniform";
            font-size: 9;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">text-color / error-color</p>

    Text color when valid / when the validator rejects the content.

    Defaults: `0xFFFFFF` / `0xFF0000`

    === "LSS"

        ```css
        text-area {
            text-color: #EEEEEE;
            error-color: #FF4444;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">cursor-color</p>

    Color of the blinking caret.

    Default: `0xEEEEEE`

    === "LSS"

        ```css
        text-area {
            cursor-color: #FFFFFF;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">text-shadow</p>

    Whether to draw text with a drop shadow.

    Default: `true`

    === "LSS"

        ```css
        text-area {
            text-shadow: false;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">placeholder</p>

    Ghost text shown when all lines are empty.

    Default: translatable key `text_field.empty`

    === "Java"

        ```java
        area.textAreaStyle(style -> style
            .placeholder(Component.literal("Enter code…"))
        );
        ```

!!! info ""
    #### <p style="font-size: 1rem;">line-spacing</p>

    Extra pixels added between lines.

    Default: `1`

    === "LSS"

        ```css
        text-area {
            line-spacing: 2;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">scroller-view-mode</p>

    Which scroll axes are enabled. Values: `HORIZONTAL`, `VERTICAL`, `BOTH`.

    Default: `BOTH`

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

    Visibility policy for each scroll bar. Values: `AUTO` (show only when content overflows), `ALWAYS`, `NEVER`.

    Default: `AUTO`

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

    Right margin of the horizontal scroller when the vertical scroller is visible.

    Default: `5`

    === "LSS"

        ```css
        text-area {
            scroller-view-margin: 5;
        }
        ```

---

## Value Binding

`TextArea` extends `BindableUIElement<String[]>`, so it integrates with the data-binding system:

=== "Java"

    ```java
    area.bind(DataBindingBuilder.create(
        () -> config.getLines(),
        lines -> config.setLines(lines)
    ).build());
    ```

See [Data Bindings](../data_bindings.md){ data-preview } for full details.

---

## Fields

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

## Methods

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
