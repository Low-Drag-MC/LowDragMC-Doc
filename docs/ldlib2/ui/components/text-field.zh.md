# 文本字段
{{ version_badge("2.2.1", label="Since", icon="tag") }}
`TextField` 是单行文本输入元素。它支持多种输入**模式**（自由字符串、数字、资源位置、复合NBT标签）、数字字段的拖动更改值、用于突出显示无效输入的文本**验证器**、用于自定义显示的**格式化程序**，以及通过`Ctrl+Z` / `Ctrl+Y`进行撤消/重做。
当该字段获得焦点（单击）时，该字段将变为可编辑状态。键盘快捷键遵循标准 Minecraft 约定：`Ctrl+A` 全选、`Ctrl+C/X/V` 复制/剪切/粘贴、`Ctrl+←/→` 文字导航、`Home`/`End`。
!!!笔记 ””[UIElement](../element.md){ data-preview } 上记录的所有内容（布局、样式、事件、数据绑定等）也适用于此处。
---

＃＃ 用法
===“Java”
    ```java
    // Free string input
    var field = new TextField();
    field.setTextResponder(text -> System.out.println("Typed: " + text));
    parent.addChild(field);

    // Integer input with a range
    var intField = new TextField();
    intField.setNumbersOnlyInt(0, 100);
    intField.setText("50");
    intField.setTextResponder(raw -> config.setValue(Integer.parseInt(raw)));

    // Resource location input
    var rlField = new TextField();
    rlField.setResourceLocationOnly();
    ```

===“科特林”
    ```kotlin
    textField({
        layout { height(14) }
    }) {
        api {
            setNumbersOnlyInt(0, 100)
            setText("50")
            setTextResponder { raw -> config.value = raw.toInt() }
        }
    }
    ```

===“KubeJS”
    ```js
    let field = new TextField();
    field.setText("Hello");
    field.setTextResponder(text => { console.log("Input: " + text); });
    parent.addChild(field);
    ```

---

## XML
```xml
<!-- Free string -->
<text-field value="default text"/>

<!-- Integer mode, range 0–100 -->
<text-field mode="NUMBER_INT" value="50"/>

<!-- Resource location mode -->
<text-field mode="RESOURCE_LOCATION"/>

<!-- String with a regex validator -->
<text-field mode="STRING" regex-validator="^[a-zA-Z]+$"/>
```

| XML Attribute | Type | Description |
| ------------- | ---- | ----------- |
| `mode` | `Mode` | Input mode. One of: `STRING`, `COMPOUND_TAG`, `RESOURCE_LOCATION`, `NUMBER_INT`, `NUMBER_LONG`, `NUMBER_FLOAT`, `NUMBER_DOUBLE`, `NUMBER_SHORT`, `NUMBER_BYTE`. |
| `regex-validator` | `string` | Regex pattern used to validate the text (only applied when `mode="STRING"`). |
| `value` | `string` | Initial text value. |

---

## 模式
| Mode | Description |
| ---- | ----------- |
| `STRING` | Accepts any printable characters. Optional regex validator. |
| `COMPOUND_TAG` | Validates that the text is a valid NBT compound tag. |
| `RESOURCE_LOCATION` | Restricts characters to valid resource location format (`namespace:path`). |
| `NUMBER_INT` | Integer in a given `[min, max]` range. Supports drag and mouse-wheel to change value. |
| `NUMBER_LONG` | Long integer in a given range. |
| `NUMBER_FLOAT` | Float in a given range. |
| `NUMBER_DOUBLE` | Double in a given range. |
| `NUMBER_SHORT` | Short integer in a given range. |
| `NUMBER_BYTE` | Byte in a given range. |

数字字段支持：- **鼠标滚轮**可增加/减少`wheelDur`。- **单击并水平拖动**可平滑滑动值。- **Shift** 修饰符将步长乘以 10。
---

## 文本字段样式
!!!信息“”#### <p style="font-size: 1rem;">焦点覆盖</p>
当字段悬停或聚焦时在字段上绘制纹理。
默认值：`Sprites.RECT_RD_T_SOLID`
===“Java”
        ```java
        field.textFieldStyle(style -> style.focusOverlay(myHighlight));
        ```

===“LSS”
        ```css
        text-field {
            focus-overlay: rect(#FFFFFF22, 2);
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">字体/字体大小</p>
渲染文本的字体和大小。
默认值：普通默认字体/`9`
===“Java”
        ```java
        field.textFieldStyle(style -> style
            .font(ResourceLocation.parse("minecraft:uniform"))
            .fontSize(10)
        );
        ```

===“LSS”
        ```css
        text-field {
            font: "minecraft:uniform";
            font-size: 10;
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">文本颜色/错误颜色</p>
有效文本和验证失败文本的颜色。
默认值：`0xFFFFFF`（白色）/`0xFF0000`（红色）
===“Java”
        ```java
        field.textFieldStyle(style -> style
            .textColor(0xFFFFFF)
            .errorColor(0xFF4444)
        );
        ```

===“LSS”
        ```css
        text-field {
            text-color: #FFFFFF;
            error-color: #FF4444;
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">光标颜色</p>
闪烁光标的颜色。
默认值：`0xEEEEEE`
===“Java”
        ```java
        field.textFieldStyle(style -> style.cursorColor(0xFFFFFF));
        ```

===“LSS”
        ```css
        text-field {
            cursor-color: #FFFFFF;
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">文字阴影</p>
是否在文本下方绘制阴影。
默认值：`true`
===“LSS”
        ```css
        text-field {
            text-shadow: false;
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">占位符</p>
当字段为空时显示幽灵文本。
默认值：可翻译键`text_field.empty`
===“Java”
        ```java
        field.textFieldStyle(style -> style
            .placeholder(Component.literal("Enter value…"))
        );
        ```

===“LSS”
        ```css
        text-field {
            placeholder: "Enter value…";
        }
        ```

---

## 值绑定
`TextField` 扩展了 `BindableUIElement<String>`，因此它支持标准数据绑定系统：
===“Java”
    ```java
    field.bind(DataBindingBuilder.string(
        () -> config.getName(),
        name -> config.setName(name)
    ).build());
    ```

有关完整详细信息，请参阅[Data Bindings](../data_bindings.md){ data-preview }。
---

## 字段
| Name | Type | Access | Description |
| ---- | ---- | ------ | ----------- |
| `textFieldStyle` | `TextFieldStyle` | `private` (getter) | Current style instance. |
| `text` | `String` | `private` (getter) | Last validated text value. |
| `rawText` | `String` | `private` (getter) | Current display text (may not have passed validation). |
| `mode` | `Mode` | `private` (getter) | Current input mode. |
| `isError` | `boolean` | `private` (getter) | `true` when `rawText` fails the validator. |
| `formatter` | `Function<String, Component>` | `private` (getter/setter/nullable) | Optional function to render `rawText` as a formatted `Component`. |
| `wheelDur` | `float` | `private` (getter) | Step size for mouse-wheel / drag on number fields. |
| `cursorPos` | `int` | `private` (getter) | Current cursor position in `rawText`. |
| `selectionStart` | `int` | `private` (getter) | Selection start in `rawText`. |
| `selectionEnd` | `int` | `private` (getter) | Selection end in `rawText`. |

---

＃＃ 方法
| Method | Returns | Description |
| ------ | ------- | ----------- |
| `setText(String)` | `TextField` | Sets the value and notifies listeners. |
| `setAnyString()` | `TextField` | Switches to free-string mode (no validation). |
| `setCompoundTagOnly()` | `TextField` | Switches to compound-tag validation mode. |
| `setResourceLocationOnly()` | `TextField` | Restricts input to valid resource location characters. |
| `setNumbersOnlyInt(int, int)` | `TextField` | Integer mode with `[min, max]` range. |
| `setNumbersOnlyLong(long, long)` | `TextField` | Long integer mode with `[min, max]` range. |
| `setNumbersOnlyFloat(float, float)` | `TextField` | Float mode with `[min, max]` range. |
| `setNumbersOnlyDouble(double, double)` | `TextField` | Double mode with `[min, max]` range. |
| `setNumbersOnlyShort(short, short)` | `TextField` | Short integer mode with `[min, max]` range. |
| `setNumbersOnlyByte(byte, byte)` | `TextField` | Byte integer mode with `[min, max]` range. |
| `setTextValidator(Predicate<String>)` | `TextField` | Custom validator; invalid text is shown in `error-color`. |
| `setTextRegexValidator(String)` | `TextField` | Convenience to compile a regex and use it as the validator. |
| `setCharValidator(Predicate<Character>)` | `TextField` | Filters characters before they are inserted. |
| `setTextResponder(Consumer<String>)` | `TextField` | Registers a listener called on each valid text change. |
| `setWheelDur(float)` | `TextField` | Sets the scroll/drag step for number fields. |
| `textFieldStyle(Consumer<TextFieldStyle>)` | `TextField` | Configures style fluently. |
| `getValue()` | `String` | Returns the last validated text. |
| `getRawText()` | `String` | Returns the current display text (may fail validation). |
| `isEditable()` | `boolean` | `true` when focused, active, visible and displayed. |
| `isError()` | `boolean` | `true` when `rawText` does not pass validation. |
