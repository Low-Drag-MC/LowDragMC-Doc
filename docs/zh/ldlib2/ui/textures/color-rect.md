# ColorRectTexture

{{ version_badge("2.2.1", label="自", icon="tag") }}

`ColorRectTexture` 绘制一个纯色的 ARGB 填充矩形。它是最简单的纹理类型——无圆角、无边框，仅仅是平坦的颜色。

注册名：`color_rect_texture`

!!! note ""
    继承自 `TransformTexture` —— 支持 `rotate()`、`scale()`、`transform()`。

---

## 用法

=== "Java"

    ```java
    // 不透明深色背景
    IGuiTexture bg = new ColorRectTexture(0xFF1A1A1A);

    // 半透明覆盖层
    IGuiTexture overlay = new ColorRectTexture(0x80FFFFFF);

    // 从 java.awt.Color 创建
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
/* 十六进制颜色字面量 —— 自动创建 ColorRectTexture */
background: #1A1A1AFF;   /* #AARRGGBB */
background: #1A1A1A;     /* #RRGGBB（完全不透明） */
background: #FFF;        /* 简写 */
background: rgba(26, 26, 26, 255);
background: rgb(26, 26, 26);

/* 显式 color() 函数 */
background: color(#80FFFFFF);
```

---

## 字段

| 名称 | 类型 | 描述 |
| ---- | ---- | ---- |
| `color` | `int` | 打包的 ARGB 颜色值。 |

---

## 方法

| 方法 | 返回 | 描述 |
| ---- | ---- | ---- |
| `setColor(int)` | `ColorRectTexture` | 设置打包的 ARGB 颜色。 |
| `copy()` | `ColorRectTexture` | 返回深拷贝。 |
| `interpolate(IGuiTexture, float)` | `IGuiTexture` | 使用 OkLab 颜色空间向另一个 `ColorRectTexture` 混合。 |