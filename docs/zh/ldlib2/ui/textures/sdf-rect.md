# SDFRectTexture

<VersionBadge version="2.2.1" label="自" icon="tag" />

`SDFRectTexture` 使用 SDF（Signed Distance Field，有符号距离场）GPU Shader 绘制圆角矩形。它能在任意尺寸下生成锐利且抗锯齿的边缘。支持逐角半径、可选的描边边框以及平滑的 CSS 过渡插值。

注册名：`sdf_rect_texture`  
LSS 函数：`sdf(...)`

::: info
继承自 `TransformTexture` —— 支持 `rotate()`、`scale()`、`transform()`。
:::

---

## 用法

<DocTabs>
<DocTab title="Java">

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

</DocTab>
<DocTab title="Kotlin">

```kotlin
val panel = SDFRectTexture()
    .setColor(0xFF2A2A2A.toInt())
    .setRadius(6f)

val bordered = SDFRectTexture.of(0xFF1A1A1A.toInt())
    .setRadius(4f)
    .setStroke(1f)
    .setBorderColor(0xFFFFFFFF.toInt())
```

</DocTab>
<DocTab title="KubeJS">

```js
let panel = new SDFRectTexture()
    .setColor(0xFF2A2A2A)
    .setRadius(6);

let bordered = SDFRectTexture.of(0xFF1A1A1A)
    .setRadius(4)
    .setStroke(1)
    .setBorderColor(0xFFFFFFFF);
```

</DocTab>
</DocTabs>

---

## LSS

```css
/* sdf(fillColor) */
background: sdf(#2A2A2A);

/* sdf(fillColor, radius) */
background: sdf(#2A2A2A, 6);

/* sdf(fillColor, radius, strokeWidth, borderColor) */
background: sdf(#2A2A2A, 4, 1, #FFFFFF);

/* 逐角半径：左下 右下 右上 左上 */
background: sdf(#2A2A2A, 0 0 8 8); /* 圆上方两个角 */
```

::: warning 圆角顺序
`sdf()` 从左下开始读取 4 个半径：左下、右下、右上、左上。这与 CSS 以及 [`rect()`](rect.md#lss) 的顺序相反。`r 0 0 r`（左侧）和 `0 r r 0`（右侧）在两种顺序下相同，所以顺序写错只有在圆上边或下边时才会暴露。
:::

`rect(...)` 创建的是 CPU 绘制的 [`RectTexture`](rect.md)，而不是 `SDFRectTexture`。

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
