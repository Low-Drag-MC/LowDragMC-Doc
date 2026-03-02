# 矩形纹理
{{ version_badge("2.2.1", label="Since", icon="tag") }}
`RectTexture` 使用 CPU 端曲面细分绘制圆角矩形。对于 SDF 着色器不可用的环境，它是 [`SDFRectTexture`](sdf-rect.md) 的后备替代方案。这两个类都公开相同的属性。
注册表名称：`rect_texture`
!!!笔记 ””扩展`TransformTexture` — 支持`rotate()`、`scale()`、`transform()`。
!!!提示 ””对于大多数用例，首选[`SDFRectTexture`](sdf-rect.md)，它在所有尺寸下都能提供更好的视觉质量。仅当需要CPU端渲染时才使用`RectTexture`。
---

＃＃ 用法
===“Java”
    ```java
    // Filled rounded rect
    IGuiTexture panel = new RectTexture()
        .setColor(0xFF2A2A2A)
        .setRadius(new Vector4f(6, 6, 6, 6));

    // With stroke
    IGuiTexture bordered = new RectTexture()
        .setColor(0xFF1A1A1A)
        .setRadius(new Vector4f(4, 4, 4, 4))
        .setStroke(1f)
        .setBorderColor(0xFFFFFFFF);

    // Static factory
    IGuiTexture simple = RectTexture.of(0xFF3A3A3A);
    ```

===“科特林”
    ```kotlin
    val panel = RectTexture()
        .setColor(0xFF2A2A2A.toInt())
        .setRadius(Vector4f(6f, 6f, 6f, 6f))

    val simple = RectTexture.of(0xFF3A3A3A.toInt())
    ```

===“KubeJS”
    ```js
    let panel = new RectTexture()
        .setColor(0xFF2A2A2A)
        .setStroke(1)
        .setBorderColor(0xFFFFFFFF);

    let simple = RectTexture.of(0xFF3A3A3A);
    ```

---

## 字段
| Name | Type | Description |
| ---- | ---- | ----------- |
| `color` | `int` | Fill colour (ARGB). Default: `0xFFFFFFFF`. |
| `borderColor` | `int` | Stroke colour (ARGB). Default: `0xFF000000`. |
| `radius` | `Vector4f` | Per-corner radii: `x` = bottom-left, `y` = bottom-right, `z` = top-right, `w` = top-left. |
| `stroke` | `float` | Border stroke width. `0` disables the border. |
| `cornerSegments` | `int` | Number of line segments per corner arc. Higher = smoother but more vertices. Default: `8`. |

---

＃＃ 方法
| Method | Returns | Description |
| ------ | ------- | ----------- |
| `setColor(int)` | `RectTexture` | Sets the fill colour. |
| `setBorderColor(int)` | `RectTexture` | Sets the stroke colour. |
| `setRadius(Vector4f)` | `RectTexture` | Sets per-corner radii. |
| `setStroke(float)` | `RectTexture` | Sets the stroke width. |
| `setCornerSegments(int)` | `RectTexture` | Sets the number of arc segments per corner. |
| `copy()` | `RectTexture` | Returns a deep copy. |
| `interpolate(IGuiTexture, float)` | `IGuiTexture` | Blends all properties toward another `RectTexture`. |
| `RectTexture.of(int)` | `RectTexture` | Static factory — creates a rect with the given fill colour. |