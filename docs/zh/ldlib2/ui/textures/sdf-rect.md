# SDFRectTexture

{{ version_badge("2.2.1", label="自", icon="tag") }}

`SDFRectTexture` 使用 SDF（Signed Distance Field，有符号距离场）GPU Shader 绘制圆角矩形。它能在任意尺寸下生成锐利且抗锯齿的边缘。支持逐角半径、可选的描边边框以及平滑的 CSS 过渡插值。

注册名称：`sdf_rect_texture`  
LSS 函数：`rect(...)` / `sdf(...)`

!!! note ""
    继承自 `TransformTexture` —— 支持 `rotate()`、`scale()`、`transform()`。

---

## 用法

=== "Java"

    ```java
    // 填充圆角矩形
    IGuiTexture panel = new SDFRectTexture()
        .setColor(0xFF2A2A2A)
        .setRadius(6f);

    // 带白色描边的圆角矩形
    IGuiTexture bordered = new SDFRectTexture()
        .setColor(0xFF1A1A1A)
        .setRadius(4f)
        .setStroke(1f)
        .setBorderColor(0xFFFFFFFF);

    // 静态工厂
    IGuiTexture simple = SDFRectTexture.of(0xFF3A3A3A);
    ```

=== "Kotlin"

    ```kotlin
    val panel = SDFRectTexture()
        .setColor(0xFF2A2A2A.toInt())
        .setRadius(6f)

    val bordered = SDFRectTexture.of(0xFF1A1A1A.toInt())
        .setRadius(4f)
        .setStroke(1f)
        .setBorderColor(0xFFFFFFFF.toInt())
    ```

=== "KubeJS"

    ```js
    let panel = new SDFRectTexture()
        .setColor(0xFF2A2A2A)
        .setRadius(6);

    let bordered = SDFRectTexture.of(0xFF1A1A1A)
        .setRadius(4)
        .setStroke(1)
        .setBorderColor(0xFFFFFFFF);
    ```

---

## LSS

```css
/* rect(fillColor) */
background: rect(#2A2A2A);

/* rect(fillColor, radius) */
background: rect(#2A2A2A, 6);

/* rect(fillColor, radius, strokeWidth, borderColor) */
background: rect(#2A2A2A, 4, 1, #FFFFFF);

/* 逐角半径：左上 右上 右下 左下 */
background: rect(#2A2A2A, 8 4 8 4);
```

---

## 字段

| 名称 | 类型 | 描述 |
| ---- | ---- | ----------- |
| `color` | `int` | 填充颜色（ARGB）。默认值：`0xFFFFFFFF`。 |
| `borderColor` | `int` | 描边颜色（ARGB）。默认值：`0xFF000000`。 |
| `radius` | `Vector4f` | 逐角半径：`x` = 左下，`y` = 右下，`z` = 右上，`w` = 左上。 |
| `stroke` | `float` | 边框描边宽度，以像素为单位。`0` 表示禁用边框。 |

---

## 方法

| 方法 | 返回 | 描述 |
| ------ | ------- | ----------- |
| `setColor(int)` | `SDFRectTexture` | 设置填充颜色。 |
| `setBorderColor(int)` | `SDFRectTexture` | 设置描边颜色。 |
| `setRadius(float)` | `SDFRectTexture` | 将所有四个角半径设为相同值。 |
| `setRadius(Vector4f)` | `SDFRectTexture` | 设置逐角半径。 |
| `setStroke(float)` | `SDFRectTexture` | 设置描边宽度。 |
| `copy()` | `SDFRectTexture` | 返回深拷贝。 |
| `interpolate(IGuiTexture, float)` | `IGuiTexture` | 将所有属性向另一个 `SDFRectTexture` 混合过渡。 |
| `SDFRectTexture.of(int)` | `SDFRectTexture` | 静态工厂 —— 使用给定填充颜色创建矩形。 |
