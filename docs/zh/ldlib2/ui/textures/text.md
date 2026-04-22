# TextTexture

{{ version_badge("2.2.1", label="自", icon="tag") }}

`TextTexture` 将翻译后的字符串渲染为 GUI 纹理。它支持多种显示模式（居中、左对齐、滚动、悬停显示）、自动换行、背景色以及可选的实时更新供应器。

注册名：`text_texture`

!!! note ""
    继承自 `TransformTexture` — 支持 `rotate()`、`scale()`、`transform()`。

---

## 用法

=== "Java"

    ```java
    // Static centred text
    IGuiTexture label = new TextTexture("Hello World");

    // Left-aligned, coloured, with shadow
    IGuiTexture info = new TextTexture("Info", 0xFFFFDD44)
        .setType(TextTexture.TextType.LEFT)
        .setDropShadow(true);

    // Scrolling text, word-wrap at 80 px
    IGuiTexture scroll = new TextTexture("Long description that scrolls…")
        .setType(TextTexture.TextType.ROLL_ALWAYS)
        .setWidth(80)
        .setRollSpeed(1.5f);

    // Dynamic — updates every game tick
    IGuiTexture dynamic = new TextTexture(() -> "Ticks: " + level.getGameTime());
    ```

=== "Kotlin"

    ```kotlin
    val label = TextTexture("Hello World")

    val scroll = TextTexture("Long description…")
        .setType(TextTexture.TextType.ROLL_ALWAYS)
        .setWidth(80)
    ```

=== "KubeJS"

    ```js
    let label = new TextTexture("Hello World");

    let dynamic = new TextTexture(() => "Ticks: " + level.getGameTime());
    ```

---

## 文本类型

| 类型 | 对齐方式 | 溢出行为 |
| ---- | -------- | -------- |
| `NORMAL` | 居中 | 所有行堆叠显示。 |
| `LEFT` | 左对齐 | 所有行堆叠显示。 |
| `RIGHT` | 右对齐 | 所有行堆叠显示。 |
| `HIDE` | 居中 | 显示第一行；悬停时完整文本滚动显示。 |
| `LEFT_HIDE` | 左对齐 | 显示第一行；悬停时完整文本滚动显示。 |
| `ROLL` | 居中 | 显示第一行；悬停且文本溢出时滚动。 |
| `LEFT_ROLL` | 左对齐 | 显示第一行；悬停时滚动。 |
| `ROLL_ALWAYS` | 居中 | 始终滚动，无论是否悬停。 |
| `LEFT_ROLL_ALWAYS` | 左对齐 | 始终滚动，无论是否悬停。 |

---

## 字段

| 名称 | 类型 | 描述 |
| ---- | ---- | ---- |
| `text` | `String` | 显示的字符串（通过 `LocalizationUtils` 翻译）。 |
| `color` | `int` | 文本颜色（ARGB）。默认值：`-1`（白色）。 |
| `backgroundColor` | `int` | 背景填充颜色。`0` = 无。 |
| `width` | `int` | 自动换行的最大行宽（像素）。 |
| `rollSpeed` | `float` | 滚动模式的滚动速度。默认值：`1.0`。 |
| `dropShadow` | `boolean` | 是否绘制阴影。默认值：`false`（使用 `String` 的构造函数会设为 `true`）。 |
| `type` | `TextType` | 显示模式。默认值：`NORMAL`。 |
| `supplier` | `Supplier<String>`（可空） | 设置后，`text` 每游戏刻从此供应器更新。 |

---

## 方法

| 方法 | 返回值 | 描述 |
| ---- | ------ | ---- |
| `setColor(int)` | `TextTexture` | 设置文本颜色。 |
| `setBackgroundColor(int)` | `TextTexture` | 设置背景填充颜色。 |
| `setDropShadow(boolean)` | `TextTexture` | 启用或禁用阴影。 |
| `setWidth(int)` | `TextTexture` | 设置换行宽度并重排行。 |
| `setType(TextType)` | `TextTexture` | 设置显示模式。 |
| `setRollSpeed(float)` | `TextTexture` | 设置滚动模式的滚动速度。 |
| `setSupplier(Supplier<String>)` | `TextTexture` | 注册每刻更新的实时文本供应器。 |
| `updateText(String)` | `void` | 立即更新文本并重排行。 |
| `copy()` | `TextTexture` | 返回深拷贝。 |