# 颜色矩形纹理
{{ version_badge("2.2.1", label="Since", icon="tag") }}
`ColorRectTexture` 绘制一个实心 ARGB 填充矩形。它是最简单的纹理类型——没有圆角，没有边框，只有平面颜色。
注册表名称：`color_rect_texture`
!!!笔记 ””扩展`TransformTexture` — 支持`rotate()`、`scale()`、`transform()`。
---

＃＃ 用法
===“Java”
    ```java
    // Opaque dark background
    IGuiTexture bg = new ColorRectTexture(0xFF1A1A1A);

    // Semi-transparent overlay
    IGuiTexture overlay = new ColorRectTexture(0x80FFFFFF);

    // From java.awt.Color
    IGuiTexture red = new ColorRectTexture(java.awt.Color.RED);
    ```

===“科特林”
    ```kotlin
    val bg = ColorRectTexture(0xFF1A1A1A.toInt())
    val overlay = ColorRectTexture(0x80FFFFFF.toInt())
    ```

===“KubeJS”
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
| Name | Type | Description |
| ---- | ---- | ----------- |
| `color` | `int` | The packed ARGB colour value. |

---

＃＃ 方法
| Method | Returns | Description |
| ------ | ------- | ----------- |
| `setColor(int)` | `ColorRectTexture` | Sets the packed ARGB colour. |
| `copy()` | `ColorRectTexture` | Returns a deep copy. |
| `interpolate(IGuiTexture, float)` | `IGuiTexture` | Blends towards another `ColorRectTexture` using OkLab colour space. |