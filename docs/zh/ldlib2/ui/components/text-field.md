# TextField

{{ version_badge("2.2.1", label="Since", icon="tag") }}

`TextField` 是单行文本输入元素。它支持多种输入**模式**（自由字符串、数字、资源路径、复合 NBT 标签），数字字段的拖动调值功能，用于高亮无效输入的文本**验证器**，自定义显示的**格式化器**，以及通过 `Ctrl+Z` / `Ctrl+Y` 实现的撤销/重做功能。

当字段获得焦点（被点击）时，即可进行编辑。键盘快捷键遵循标准 Minecraft 约定：`Ctrl+A` 全选，`Ctrl+C/X/V` 复制/剪切/粘贴，`Ctrl+←/→` 按单词导航，`Home`/`End`。

!!! note ""
    [UIElement](../element.md){ data-preview } 中记录的所有内容（布局、样式、事件、数据绑定等）同样适用于此组件。

---

## 使用方法

=== "Java"

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
<!-- Free string -->
<text-field value="default text"/>

<!-- Integer mode, range 0–100 -->
<text-field mode="NUMBER_INT" value="50"/>

<!-- Resource location mode -->
<text-field mode="RESOURCE_LOCATION"/>

<!-- String with a regex validator -->
<text-field mode="STRING" regex-validator="^[a-zA-Z]+$"/>
```

| XML 属性 | 类型 | 描述 |
| ------------- | ---- | ----------- |
| `mode` | `Mode` | 输入模式。可选值：`STRING`、`COMPOUND_TAG`、`RESOURCE_LOCATION`、`NUMBER_INT`、`NUMBER_LONG`、`NUMBER_FLOAT`、`NUMBER_DOUBLE`、`NUMBER_SHORT`、`NUMBER_BYTE`。 |
| `regex-validator` | `string` | 用于验证文本的正则表达式模式（仅在 `mode="STRING"` 时生效）。 |
| `value` | `string` | 初始文本值。 |

---

## 模式

| 模式 | 描述 |
| ---- | ----------- |
| `STRING` | 接受任何可打印字符。可选正则验证器。 |
| `COMPOUND_TAG` | 验证文本是否为有效的 NBT 复合标签。 |
| `RESOURCE_LOCATION` | 限制字符为有效的资源路径格式（`namespace:path`）。 |
| `NUMBER_INT` | 指定 `[min, max]` 范围内的整数。支持拖动和鼠标滚轮调整值。 |
| `NUMBER_LONG` | 指定范围内的长整数。 |
| `NUMBER_FLOAT` | 指定范围内的浮点数。 |
| `NUMBER_DOUBLE` | 指定范围内的双精度浮点数。 |
| `NUMBER_SHORT` | 指定范围内的短整数。 |
| `NUMBER_BYTE` | 指定范围内的字节整数。 |

数字字段支持：

- **鼠标滚轮**：按 `wheelDur` 步长递增/递减。
- **点击拖动**：水平拖动以平滑调整值。
- **Shift 修饰键**：将步长乘以 10。

---

## Text Field 样式

!!! info ""
    #### <p style="font-size: 1rem;">focus-overlay</p>

    当字段被悬停或获得焦点时绘制的覆盖纹理。

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

    渲染文本的字体和字号。

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

    有效文本的颜色和验证失败文本的颜色。

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

    是否在文本下方绘制阴影。

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

    默认值：翻译键 `text_field.empty`

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

## 值绑定

`TextField` 扩展自 `BindableUIElement<String>`，因此支持标准数据绑定系统：

=== "Java"

    ```java
    field.bind(DataBindingBuilder.string(
        () -> config.getName(),
        name -> config.setName(name)
    ).build());
    ```

详见 [数据绑定](../data_bindings.md){ data-preview }。

---

## 字段

| 名称 | 类型 | 访问权限 | 描述 |
| ---- | ---- | ------ | ----------- |
| `textFieldStyle` | `TextFieldStyle` | `private`（有 getter） | 当前样式实例。 |
| `text` | `String` | `private`（有 getter） | 最后验证通过的文本值。 |
| `rawText` | `String` | `private`（有 getter） | 当前显示文本（可能未通过验证）。 |
| `mode` | `Mode` | `private`（有 getter） | 当前输入模式。 |
| `isError` | `boolean` | `private`（有 getter） | 当 `rawText` 验证失败时为 `true`。 |
| `formatter` | `Function<String, Component>` | `private`（有 getter/setter/可为空） | 可选函数，用于将 `rawText` 渲染为格式化的 `Component`。 |
| `wheelDur` | `float` | `private`（有 getter） | 数字字段滚轮/拖动的步长。 |
| `cursorPos` | `int` | `private`（有 getter） | `rawText` 中当前光标位置。 |
| `selectionStart` | `int` | `private`（有 getter） | `rawText` 中选区起始位置。 |
| `selectionEnd` | `int` | `private`（有 getter） | `rawText` 中选区结束位置。 |

---

## 方法

| 方法 | 返回值 | 描述 |
| ------ | ------- | ----------- |
| `setText(String)` | `TextField` | 设置值并通知监听器。 |
| `setAnyString()` | `TextField` | 切换到自由字符串模式（无验证）。 |
| `setCompoundTagOnly()` | `TextField` | 切换到复合标签验证模式。 |
| `setResourceLocationOnly()` | `TextField` | 限制输入为有效的资源路径字符。 |
| `setNumbersOnlyInt(int, int)` | `TextField` | 整数模式，`[min, max]` 范围。 |
| `setNumbersOnlyLong(long, long)` | `TextField` | 长整数模式，`[min, max]` 范围。 |
| `setNumbersOnlyFloat(float, float)` | `TextField` | 浮点数模式，`[min, max]` 范围。 |
| `setNumbersOnlyDouble(double, double)` | `TextField` | 双精度浮点数模式，`[min, max]` 范围。 |
| `setNumbersOnlyShort(short, short)` | `TextField` | 短整数模式，`[min, max]` 范围。 |
| `setNumbersOnlyByte(byte, byte)` | `TextField` | 字节整数模式，`[min, max]` 范围。 |
| `setTextValidator(Predicate<String>)` | `TextField` | 自定义验证器；无效文本以 `error-color` 显示。 |
| `setTextRegexValidator(String)` | `TextField` | 便捷方法，编译正则表达式并用作验证器。 |
| `setCharValidator(Predicate<Character>)` | `TextField` | 在字符插入前进行过滤。 |
| `setTextResponder(Consumer<String>)` | `TextField` | 注册监听器，每次有效文本变更时调用。 |
| `setWheelDur(float)` | `TextField` | 设置数字字段的滚轮/拖动步长。 |
| `textFieldStyle(Consumer<TextFieldStyle>)` | `TextField` | 以流式方式配置样式。 |
| `getValue()` | `String` | 返回最后验证通过的文本。 |
| `getRawText()` | `String` | 返回当前显示文本（可能验证失败）。 |
| `isEditable()` | `boolean` | 当获得焦点、处于活动状态、可见且已显示时为 `true`。 |
| `isError()` | `boolean` | 当 `rawText` 未通过验证时为 `true`。 |
