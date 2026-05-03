# TextField

{{ version_badge("2.2.1", label="自", icon="tag") }}

`TextField` 是一种单行文本输入元素。它支持多种输入**模式**（自由字符串、数字、ResourceLocation、复合 NBT 标签），数字字段支持拖拽调整数值、用于高亮无效输入的文本**校验器**、用于自定义显示的**格式化器**，以及通过 `Ctrl+Z` / `Ctrl+Y` 实现的撤销/重做功能。

字段在获得焦点（点击）时变为可编辑状态。键盘快捷键遵循 Minecraft 的标准惯例：`Ctrl+A` 全选，`Ctrl+C/X/V` 复制/剪切/粘贴，`Ctrl+←/→` 按单词导航，`Home`/`End` 行首/行尾。

!!! note ""
    [UIElement](element.md){ data-preview } 中记录的所有内容（布局、样式、事件、数据绑定等）同样适用于此。

---

## 用法

=== "Java"

    ```java
    // 自由字符串输入
    var field = new TextField();
    field.setTextResponder(text -> System.out.println("Typed: " + text));
    parent.addChild(field);

    // 带有范围限制的整数输入
    var intField = new TextField();
    intField.setNumbersOnlyInt(0, 100);
    intField.setText("50");
    intField.setTextResponder(raw -> config.setValue(Integer.parseInt(raw)));

    // ResourceLocation 输入
    var rlField = new TextField();
    rlField.setResourceLocationOnly();
    ```

=== "Kotlin"

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

=== "KubeJS"

    ```js
    let field = new TextField();
    field.setText("Hello");
    field.setTextResponder(text => { console.log("Input: " + text); });
    parent.addChild(field);
    ```

---

## XML

```xml
<!-- 自由字符串 -->
<text-field value="default text"/>

<!-- 整数模式，范围 0–100 -->
<text-field mode="NUMBER_INT" value="50"/>

<!-- ResourceLocation 模式 -->
<text-field mode="RESOURCE_LOCATION"/>

<!-- 带正则校验器的字符串 -->
<text-field mode="STRING" regex-validator="^[a-zA-Z]+$"/>
```

| XML 属性 | 类型 | 描述 |
| ------------- | ---- | ----------- |
| `mode` | `Mode` | 输入模式。可选值：`STRING`、`COMPOUND_TAG`、`RESOURCE_LOCATION`、`NUMBER_INT`、`NUMBER_LONG`、`NUMBER_FLOAT`、`NUMBER_DOUBLE`、`NUMBER_SHORT`、`NUMBER_BYTE`。 |
| `regex-validator` | `string` | 用于校验文本的正则表达式（仅在 `mode="STRING"` 时生效）。 |
| `value` | `string` | 初始文本值。 |

---

## 模式

| 模式 | 描述 |
| ---- | ----------- |
| `STRING` | 接受任何可打印字符。可选的正则校验器。 |
| `COMPOUND_TAG` | 校验文本是否为有效的 NBT 复合标签。 |
| `RESOURCE_LOCATION` | 将字符限制为有效的 ResourceLocation 格式（`namespace:path`）。 |
| `NUMBER_INT` | 给定 `[min, max]` 范围内的整数。支持拖拽和鼠标滚轮调整数值。 |
| `NUMBER_LONG` | 给定范围内的长整数。 |
| `NUMBER_FLOAT` | 给定范围内的浮点数。 |
| `NUMBER_DOUBLE` | 给定范围内的双精度浮点数。 |
| `NUMBER_SHORT` | 给定范围内的短整数。 |
| `NUMBER_BYTE` | 给定范围内的字节。 |

数字字段支持：
- **鼠标滚轮**以 `wheelDur` 为单位递增/递减。
- **点击并水平拖拽**以平滑滑动数值。
- **Shift** 修饰键将步长乘以 10。

---

## TextField 样式

!!! info ""
    #### <p style="font-size: 1rem;">focus-overlay</p>

    当字段被悬停或获得焦点时绘制在其上方的 Texture。

    默认值：`Sprites.RECT_RD_T_SOLID`

    === "Java"

        ```java
        field.textFieldStyle(style -> style.focusOverlay(myHighlight));
        ```

    === "LSS"

        ```css
        text-field {
            focus-overlay: rect(#FFFFFF22, 2);
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">font / font-size</p>

    渲染文本的字体和大小。

    默认值：原版默认字体 / `9`

    === "Java"

        ```java
        field.textFieldStyle(style -> style
            .font(ResourceLocation.parse("minecraft:uniform"))
            .fontSize(10)
        );
        ```

    === "LSS"

        ```css
        text-field {
            font: "minecraft:uniform";
            font-size: 10;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">text-color / error-color</p>

    有效文本和校验失败文本的颜色。

    默认值：`0xFFFFFF`（白色）/ `0xFF0000`（红色）

    === "Java"

        ```java
        field.textFieldStyle(style -> style
            .textColor(0xFFFFFF)
            .errorColor(0xFF4444)
        );
        ```

    === "LSS"

        ```css
        text-field {
            text-color: #FFFFFF;
            error-color: #FF4444;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">cursor-color</p>

    闪烁光标的颜色。

    默认值：`0xEEEEEE`

    === "Java"

        ```java
        field.textFieldStyle(style -> style.cursorColor(0xFFFFFF));
        ```

    === "LSS"

        ```css
        text-field {
            cursor-color: #FFFFFF;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">text-shadow</p>

    是否在文本下方绘制投影。

    默认值：`true`

    === "LSS"

        ```css
        text-field {
            text-shadow: false;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">placeholder</p>

    当字段为空时显示的占位文本。

    默认值：可翻译键 `text_field.empty`

    === "Java"

        ```java
        field.textFieldStyle(style -> style
            .placeholder(Component.literal("Enter value…"))
        );
        ```

    === "LSS"

        ```css
        text-field {
            placeholder: "Enter value…";
        }
        ```

---

## 数据绑定

`TextField` 继承自 `BindableUIElement<String>`，因此支持标准的数据绑定系统：

=== "Java"

    ```java
    field.bind(DataBindingBuilder.string(
        () -> config.getName(),
        name -> config.setName(name)
    ).build());
    ```

更多详情请参见 [数据绑定](../preliminary/data_bindings.md){ data-preview }。

---

## 字段

| 名称 | 类型 | 访问权限 | 描述 |
| ---- | ---- | ------ | ----------- |
| `textFieldStyle` | `TextFieldStyle` | `private`（getter） | 当前样式实例。 |
| `text` | `String` | `private`（getter） | 最后通过校验的文本值。 |
| `rawText` | `String` | `private`（getter） | 当前显示的文本（可能尚未通过校验）。 |
| `mode` | `Mode` | `private`（getter） | 当前输入模式。 |
| `isError` | `boolean` | `private`（getter） | 当 `rawText` 未通过校验器时为 `true`。 |
| `formatter` | `Function<String, Component>` | `private`（getter/setter/nullable） | 可选函数，用于将 `rawText` 渲染为格式化的 `Component`。 |
| `wheelDur` | `float` | `private`（getter） | 数字字段中鼠标滚轮/拖拽的步长。 |
| `cursorPos` | `int` | `private`（getter） | `rawText` 中的当前光标位置。 |
| `selectionStart` | `int` | `private`（getter） | `rawText` 中的选择起始位置。 |
| `selectionEnd` | `int` | `private`（getter） | `rawText` 中的选择结束位置。 |

---

## 方法

| 方法 | 返回 | 描述 |
| ------ | ------- | ----------- |
| `setText(String)` | `TextField` | 设置值并通知监听器。 |
| `setAnyString()` | `TextField` | 切换为自由字符串模式（无校验）。 |
| `setCompoundTagOnly()` | `TextField` | 切换为复合标签校验模式。 |
| `setResourceLocationOnly()` | `TextField` | 将输入限制为有效的 ResourceLocation 字符。 |
| `setNumbersOnlyInt(int, int)` | `TextField` | 整数模式，范围 `[min, max]`。 |
| `setNumbersOnlyLong(long, long)` | `TextField` | 长整数模式，范围 `[min, max]`。 |
| `setNumbersOnlyFloat(float, float)` | `TextField` | 浮点数模式，范围 `[min, max]`。 |
| `setNumbersOnlyDouble(double, double)` | `TextField` | 双精度浮点数模式，范围 `[min, max]`。 |
| `setNumbersOnlyShort(short, short)` | `TextField` | 短整数模式，范围 `[min, max]`。 |
| `setNumbersOnlyByte(byte, byte)` | `TextField` | 字节模式，范围 `[min, max]`。 |
| `setTextValidator(Predicate<String>)` | `TextField` | 自定义校验器；无效文本将以 `error-color` 显示。 |
| `setTextRegexValidator(String)` | `TextField` | 便捷方法，编译正则表达式并用作校验器。 |
| `setCharValidator(Predicate<Character>)` | `TextField` | 在字符插入前对其进行过滤。 |
| `setTextResponder(Consumer<String>)` | `TextField` | 注册监听器，在每次有效文本更改时调用。 |
| `setWheelDur(float)` | `TextField` | 设置数字字段的滚动/拖拽步长。 |
| `textFieldStyle(Consumer<TextFieldStyle>)` | `TextField` | 以流式接口配置样式。 |
| `getValue()` | `String` | 返回最后通过校验的文本。 |
| `getRawText()` | `String` | 返回当前显示的文本（可能未通过校验）。 |
| `isEditable()` | `boolean` | 当获得焦点、处于激活状态、可见且已显示时为 `true`。 |
| `isError()` | `boolean` | 当 `rawText` 未通过校验时为 `true`。 |