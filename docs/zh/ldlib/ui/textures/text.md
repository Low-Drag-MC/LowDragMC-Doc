# TextTexture

`TextTexture` 类继承自 `TransformTexture`，用于将文本渲染为纹理。它支持通过供应器（supplier）进行动态文本更新，可配置的文本样式（颜色、背景色、投影阴影），以及各种文本对齐或动画类型（如滚动、隐藏）。该类主要用于在 GUI 组件中显示格式化和本地化的文本。

## 基本属性

| 字段            | 描述                                                         |
|-----------------|--------------------------------------------------------------|
| text            | 要显示的格式化文本                                           |
| color           | 文本颜色（可通过 setter 修改）                               |
| backgroundColor | 文本背后的背景色                                             |
| width           | 文本换行的最大宽度                                           |
| rollSpeed       | 文本滚动速度（用于动画文本类型）                             |
| dropShadow      | 是否为文本应用投影阴影                                       |
| type            | 文本显示类型（例如 NORMAL、ROLL、HIDE、LEFT、RIGHT）         |
| supplier        | 用于动态文本更新的供应器                                     |

---

## API

### setSupplier

设置一个供应器，用于提供动态文本更新。

=== "Java"

    ``` java
    textTexture.setSupplier(() -> "Updated dynamic text");
    ```

=== "KubeJS"

    ``` javascript
    textTexture.setSupplier(() => "Updated dynamic text");
    ```

---

### updateText

更新显示的文本。此方法会通过供应器自动调用，也可以直接调用。

=== "Java / KubeJS"

    ``` java
    textTexture.updateText("New Text Content");
    ```

---

### setBackgroundColor

设置文本背后的背景色。

=== "Java / KubeJS"

    ``` java
    textTexture.setBackgroundColor(0xffff0000);
    ```

---

### setDropShadow

启用或禁用文本上的投影阴影效果。

=== "Java / KubeJS"

    ``` java
    textTexture.setDropShadow(true);
    ```

---

### setWidth

设置文本区域的最大宽度。此方法还会根据新宽度重新计算文本换行。

=== "Java / KubeJS"

    ``` java
    textTexture.setWidth(100);
    ```

---

### setType

设置文本显示类型（例如 NORMAL、ROLL、LEFT_HIDE）。

!!! info "TextType"
    * `NORMAL`: 居中，在下方添加新行
    * `HIDE`: 居中，隐藏冗余文字
    * `ROLL`: 居中，隐藏冗余文字，悬停时滚动文字
    * `ROLL_ALWAYS`: 居中，存在冗余文字时始终滚动
    * `LEFT`: 与 NORMAL 相同，但左对齐
    * `RIGHT`: 与 NORMAL 相同，但右对齐
    * `LEFT_HIDE`: 与 HIDE 相同，但左对齐
    * `LEFT_ROLL`: 与 ROLL 相同，但左对齐
    * `LEFT_ROLL_ALWAYS`: 与 ROLL_ALWAYS 相同，但左对齐

=== "Java / KubeJS"

    ``` java
    textTexture.setType(TextType.ROLL);
    ```

---
