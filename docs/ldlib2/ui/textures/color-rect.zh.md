# ColorRectTexture

{{ version_badge("2.2.1", label="Since", icon="tag") }}

`ColorRectTexture` 绘制一个纯色 ARGB 填充的矩形。它是最简单的纹理类型——没有圆角、没有边框，只有一个纯色填充。

注册名：`color_rect_texture`

!!! note ""
    继承自 `TransformTexture`——支持 `rotate()`、`scale()`、`transform()`。

---

## 用法

=== "Java"

    ```java
    // Opaque dark background
    IGuiTexture bg = new ColorRectTexture(0xFF1A1A1A);

    // Semi-transparent overlay
    IGuiTexture overlay = new ColorRectTexture(0x80FFFFFF);

    // From java.awt.Color
    IGuiTexture red = new ColorRectTexture(java.awt.Color.RED);
    ```

=== "Kotlin"

    ```kotlin
    val bg = ColorRectTexture(0xFF1A1A1A.toInt())
    val overlay = ColorRectTexture(0x80FFFFFF.toInt())
    ```

=== "KubeJS"

    ```js
    let bg = new ColorRectTexture(0xFF1A1A1A);
    let overlay = new ColorRectTexture(0x80FFFFFF);
    ```

---

## LSS

```css
/* Hex color literal — automatically creates a ColorRectTexture */
background: #1A1A1AFF;   /* #AARRGGBB */
background: #1A1A1A;     /* #RRGGBB (fully opaque) */
background: #FFF;        /* shorthand */
background: rgba(26, 26, 26, 255);
background: rgb(26, 26, 26);

/* Explicit color() function */
background: color(#80FFFFFF);
```

---

## 字段

| 名称 | 类型 | 描述 |
| ---- | ---- | ---- |
| `color` | `int` | 打包的 ARGB 颜色值。 |

---

## 方法

| 方法 | 返回值 | 描述 |
| ---- | ------ | ---- |
| `setColor(int)` | `ColorRectTexture` | 设置打包的 ARGB 颜色。 |
| `copy()` | `ColorRectTexture` | 返回深拷贝。 |
| `interpolate(IGuiTexture, float)` | `IGuiTexture` | 使用 OkLab 色彩空间向另一个 `ColorRectTexture` 混合。 |