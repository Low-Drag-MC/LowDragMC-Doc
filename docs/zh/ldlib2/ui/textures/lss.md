# LSS 中的纹理

<VersionBadge version="2.1.4" label="自" icon="tag" />

在 LDLib2 中，许多视觉样式（如 `background`）都接受一个**纹理值**。  
LSS 中的纹理值是用来描述纹理如何创建以及可选变换的**字符串表达式**。

该系统灵活且可组合，允许你使用简洁的语法构建复杂的视觉效果。

---

## 支持的纹理类型

### 空纹理

```css
background: empty;
```

或空字符串：

```css
background: ;
```

这将导致不渲染任何纹理。

---

### 纯色

如果该值可以被解析为颜色，它将被视为一个纯色矩形：

```css
background: #1F00FFFF; /* #AARRGGBB */
background: #FF00FF; //* #RRGGBB */
background: #FFF; /* #RGB */
background: rgba(255, 0, 0, 128);
background: rgb(255, 123, 0);
```

---

### `sprite(...)`

使用来自纹理图集或资源位置的 sprite。

```css
background: sprite(ldlib2:textures/gui/icon.png);
```

高级用法：

```css
background: sprite(
    ldlib2:textures/gui/icon.png,
    0, 0, 16, 16,          /* sprite 区域（可选） */
    2, 2, 2, 2,            /* 边框（可选） */
    #FFFFFF,               /* 颜色色调（可选） */
    repeat                 /* 环绕模式（可选，自 2.2.41） */
);
```

环绕模式可选 `clamp`、`repeat` 或 `mirrored-repeat`。由于它是第 11 个参数，推荐改用 [`wrap(...)`](#wrap-mode) 修饰，这样不必写出区域、边框和色调。

---

### `icon(...)`

使用已注册的图标纹理。

```css
background: icon(check);
background: icon(modid, check);
```

---

### `rect(...)`

创建一个 [`RectTexture`](rect.md)，即在 CPU 上细分绘制的圆角矩形。

```css
background: rect(#FF0000);
background: rect(#FF0000, 4);
background: rect(#FF0000, 4 4 4 4, 2, #FFFFFF);
background: rect(#FF0000, 6, 0, #00000000, 16); /* 更平滑的圆角 */
```

参数：

1. 填充颜色
2. 圆角半径（单个值，或 4 个值：左上、右上、右下、左下）（可选）
3. 描边宽度（可选）
4. 边框颜色（可选）
5. 圆角分段数，即每段圆弧的线段数（可选，默认 `8`，自 2.2.41）

---

### `sdf(...)`

创建一个 [`SDFRectTexture`](sdf-rect.md)，即由 SDF shader 绘制的圆角矩形，在任意尺寸下都有抗锯齿边缘。

```css
background: sdf(#FF0000);
background: sdf(#FF0000, 4);
background: sdf(#FF0000, 4 4 4 4, 2, #FFFFFF);
```

参数：

1. 填充颜色
2. 圆角半径（单个值，或 4 个值：左下、右下、右上、左上）（可选）
3. 描边宽度（可选）
4. 边框颜色（可选）

::: warning 圆角顺序不同
写 4 个半径时，`sdf()` 按左下、右下、右上、左上读取，而 `rect()` 按左上、右上、右下、左下读取。只圆左边（`r 0 0 r`）和只圆右边（`0 r r 0`）在两种顺序下读法相同，所以在两者之间切换时，请用上边或下边的圆角来确认。
:::

---

### `border(...)`

创建一个简单的彩色边框。

```css
background: border(2, #00FF00); 
```

---

### `group(...)`

将多个纹理组合成一个组。

```css
background: group(
    sprite(ldlib2:textures/gui/bg.png),
    rect(#FFFFFF, 2)
);
```

---

### `shader(...)`

使用自定义 shader 纹理。

```css
background: shader(ldlib2:fbm);
```

---

### 基于资源的纹理

如果函数名与已注册的**资源提供器类型**匹配，它将自动被解析：

```css
background: builtin(ui-gdp:BORDER);
background: file("<namespace>:<path>");
```

这允许与 LDLib2 的资源系统集成。

---

## 纹理变换

在主纹理之后，你可以应用**修饰函数**。修饰函数不会改动共享的纹理实例：需要改动纹理时，会作用在一份副本上。

### 缩放

```css
background: sprite(...) scale(2);
background: sprite(...) scale(2, 1);
```

---

### 旋转

```css
background: sprite(...) rotate(45);
```

---

### 平移

```css
background: sprite(...) translate(4, 8);
```

---

### 颜色覆盖

```css
background: sprite(...) color(#FFAA00);
background: sprite(...) color(255, 255, 0, 0);
```

这将使用给定的颜色为纹理着色。

---

### 环绕模式 { #wrap-mode }
<VersionBadge version="2.2.41" label="自" icon="tag" />

```css
background: sprite(mymod:textures/gui/tile.png) wrap(repeat);
background: sprite(mymod:textures/gui/panel.png, 0, 0, 64, 64, 4, 4, 4, 4) wrap-mode(mirrored-repeat);
```

`wrap(...)` 和 `wrap-mode(...)` 用于设置 [`SpriteTexture` 的环绕模式](sprite.md#wrap-modes)：`clamp`、`repeat` 或 `mirrored-repeat`。它们只对 `sprite(...)` 纹理生效，对其他类型会被忽略。

---

::: info 无效值
无法解析的纹理值会在日志里输出警告（每个不同的值只输出一次），而不是静默失败。
:::

---

总之，LSS 纹理值让你能够：

* 以声明方式定义纹理
* 以可读的方式链接变换
* 高效地重用和覆盖视觉效果

这使得 UI 样式既强大又兼容资源包。