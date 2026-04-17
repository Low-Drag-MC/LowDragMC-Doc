# RectTexture

{{ version_badge("2.2.1", label="Since", icon="tag") }}

`RectTexture` 使用 CPU 侧曲面细分绘制圆角矩形。当 SDF 着色器不可用时，它可作为 [`SDFRectTexture`](sdf-rect.md) 的备选方案。两个类暴露相同的属性。

注册名：`rect_texture`

!!! note ""
    继承自 `TransformTexture` — 支持 `rotate()`、`scale()`、`transform()`。

!!! tip ""
    大多数情况下，推荐使用 [`SDFRectTexture`](sdf-rect.md)，它在所有尺寸下都能提供更好的视觉质量。仅当需要 CPU 侧渲染时才使用 `RectTexture`。

---

## 用法

=== "Java"

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

=== "Kotlin"

    ```kotlin
    val panel = RectTexture()
        .setColor(0xFF2A2A2A.toInt())
        .setRadius(Vector4f(6f, 6f, 6f, 6f))

    val simple = RectTexture.of(0xFF3A3A3A.toInt())
    ```

=== "KubeJS"

    ```js
    let panel = new RectTexture()
        .setColor(0xFF2A2A2A)
        .setStroke(1)
        .setBorderColor(0xFFFFFFFF);

    let simple = RectTexture.of(0xFF3A3A3A);
    ```

---

## 字段

| 名称 | 类型 | 描述 |
| ---- | ---- | ---- |
| `color` | `int` | 填充颜色（ARGB）。默认值：`0xFFFFFFFF`。 |
| `borderColor` | `int` | 描边颜色（ARGB）。默认值：`0xFF000000`。 |
| `radius` | `Vector4f` | 各角的半径：`x` = 左下，`y` = 右下，`z` = 右上，`w` = 左上。 |
| `stroke` | `float` | 边框描边宽度。`0` 表示禁用边框。 |
| `cornerSegments` | `int` | 每个圆角弧线的线段数量。值越高越平滑，但顶点数更多。默认值：`8`。 |

---

## 方法

| 方法 | 返回值 | 描述 |
| ---- | ------ | ---- |
| `setColor(int)` | `RectTexture` | 设置填充颜色。 |
| `setBorderColor(int)` | `RectTexture` | 设置描边颜色。 |
| `setRadius(Vector4f)` | `RectTexture` | 设置各角的半径。 |
| `setStroke(float)` | `RectTexture` | 设置描边宽度。 |
| `setCornerSegments(int)` | `RectTexture` | 设置每个圆角的弧线段数量。 |
| `copy()` | `RectTexture` | 返回深拷贝。 |
| `interpolate(IGuiTexture, float)` | `IGuiTexture` | 将所有属性向另一个 `RectTexture` 混合。 |
| `RectTexture.of(int)` | `RectTexture` | 静态工厂方法 — 使用给定的填充颜色创建矩形。 |