# RectTexture

{{ version_badge("2.2.1", label="自", icon="tag") }}

`RectTexture` 使用 CPU 端曲面细分绘制圆角矩形。在无法使用 SDF `Shader` 的环境中，它可作为 [`SDFRectTexture`](sdf-rect.md) 的备用方案。两个类公开的属性完全相同。

注册名：`rect_texture`

!!! note ""
    继承自 `TransformTexture` —— 支持 `rotate()`、`scale()`、`transform()`。

!!! tip ""
    对于大多数用例，建议优先使用 [`SDFRectTexture`](sdf-rect.md)，它在所有尺寸下都能提供更好的视觉效果。仅在需要 CPU 端渲染时使用 `RectTexture`。

---

## 用法

=== "Java"

    ```java
    // 填充圆角矩形
    IGuiTexture panel = new RectTexture()
        .setColor(0xFF2A2A2A)
        .setRadius(new Vector4f(6, 6, 6, 6));

    // 带描边
    IGuiTexture bordered = new RectTexture()
        .setColor(0xFF1A1A1A)
        .setRadius(new Vector4f(4, 4, 4, 4))
        .setStroke(1f)
        .setBorderColor(0xFFFFFFFF);

    // 静态工厂方法
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
| `radius` | `Vector4f` | 每个角的半径：`x` = 左下角，`y` = 右下角，`z` = 右上角，`w` = 左上角。 |
| `stroke` | `float` | 边框描边宽度。`0` 表示禁用边框。 |
| `cornerSegments` | `int` | 每个角圆弧的线段数。数值越高越平滑，但顶点数也越多。默认值：`8`。 |

---

## 方法

| 方法 | 返回 | 描述 |
| ------ | ------- | ----------- |
| `setColor(int)` | `RectTexture` | 设置填充颜色。 |
| `setBorderColor(int)` | `RectTexture` | 设置描边颜色。 |
| `setRadius(Vector4f)` | `RectTexture` | 设置每个角的半径。 |
| `setStroke(float)` | `RectTexture` | 设置描边宽度。 |
| `setCornerSegments(int)` | `RectTexture` | 设置每个角圆弧的线段数。 |
| `copy()` | `RectTexture` | 返回深拷贝。 |
| `interpolate(IGuiTexture, float)` | `IGuiTexture` | 将所有属性混合到另一个 `RectTexture`。 |
| `RectTexture.of(int)` | `RectTexture` | 静态工厂方法 —— 创建具有指定填充颜色的矩形。 |
