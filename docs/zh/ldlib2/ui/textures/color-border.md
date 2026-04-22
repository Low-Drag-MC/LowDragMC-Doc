# ColorBorderTexture

{{ version_badge("2.2.1", label="自", icon="tag") }}

`ColorBorderTexture` 仅在矩形周围绘制彩色边框，不进行填充。正值的 `border` 会在元素边界外绘制；负值则在边界内绘制。

注册名：`color_border_texture`

!!! note ""
    继承自 `TransformTexture` — 支持 `rotate()`、`scale()`、`transform()`。

---

## 用法

=== "Java"

    ```java
    // 2 像素外边框，白色
    IGuiTexture outline = new ColorBorderTexture(2, 0xFFFFFFFF);

    // 1 像素内边框，半透明蓝色
    IGuiTexture inset = new ColorBorderTexture(-1, 0x800000FF);
    ```

=== "Kotlin"

    ```kotlin
    val outline = ColorBorderTexture(2, 0xFFFFFFFF.toInt())
    val inset = ColorBorderTexture(-1, 0x800000FF.toInt())
    ```

=== "KubeJS"

    ```js
    let outline = new ColorBorderTexture(2, 0xFFFFFFFF);
    let inset = new ColorBorderTexture(-1, 0x800000FF);
    ```

---

## LSS

```css
/* border(size, color) */
background: border(2, #FFFFFF);
background: border(-1, #800000FF);
```

---

## 字段

| 名称 | 类型 | 描述 |
| ---- | ---- | ---- |
| `border` | `int` | 边框厚度，单位为像素。正值 = 外部，负值 = 内部。 |
| `color` | `int` | 打包后的 ARGB 颜色。 |

---

## 方法

| 方法 | 返回 | 描述 |
| ------ | ------- | ----------- |
| `setBorder(int)` | `ColorBorderTexture` | 设置边框厚度。 |
| `setColor(int)` | `ColorBorderTexture` | 设置打包后的 ARGB 颜色。 |
| `copy()` | `ColorBorderTexture` | 返回一个深拷贝。 |
| `interpolate(IGuiTexture, float)` | `IGuiTexture` | 将边框和颜色向另一个 `ColorBorderTexture` 混合。 |
