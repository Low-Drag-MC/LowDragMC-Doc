# 颜色边框纹理
{{ version_badge("2.2.1", label="Since", icon="tag") }}
`ColorBorderTexture` 仅在矩形周围绘制彩色边框 — 无填充。正 `border` 值绘制在元素边界之外；负值吸引内部。
注册表名称：`color_border_texture`
!!!笔记 ””扩展`TransformTexture` — 支持`rotate()`、`scale()`、`transform()`。
---

＃＃ 用法
===“Java”
    ```java
    // 2 px outside border, white
    IGuiTexture outline = new ColorBorderTexture(2, 0xFFFFFFFF);

    // 1 px inside border, semi-transparent blue
    IGuiTexture inset = new ColorBorderTexture(-1, 0x800000FF);
    ```

===“科特林”
    ```kotlin
    val outline = ColorBorderTexture(2, 0xFFFFFFFF.toInt())
    val inset = ColorBorderTexture(-1, 0x800000FF.toInt())
    ```

===“KubeJS”
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
| Name | Type | Description |
| ---- | ---- | ----------- |
| `border` | `int` | Border thickness in pixels. Positive = outside, negative = inside. |
| `color` | `int` | Packed ARGB colour. |

---

＃＃ 方法
| Method | Returns | Description |
| ------ | ------- | ----------- |
| `setBorder(int)` | `ColorBorderTexture` | Sets the border thickness. |
| `setColor(int)` | `ColorBorderTexture` | Sets the packed ARGB colour. |
| `copy()` | `ColorBorderTexture` | Returns a deep copy. |
| `interpolate(IGuiTexture, float)` | `IGuiTexture` | Blends border and colour towards another `ColorBorderTexture`. |