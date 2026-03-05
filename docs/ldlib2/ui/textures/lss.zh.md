# LSS 中的纹理

{{ version_badge("2.1.4", label="Since", icon="tag") }}

在 LDLib2 中，许多视觉样式（如 `background`）接受**纹理值**。  
LSS 中的纹理值是**基于字符串的表达式**，用于描述纹理的创建方式及可选的变换方式。

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

这将不渲染任何纹理。

---

### 纯色

如果值可以解析为颜色，则会被视为颜色矩形：

```css
background: #1F00FFFF; /* #AARRGGBB */
background: #FF00FF; //* #RRGGBB */
background: #FFF; /* #RGB */
background: rgba(255, 0, 0, 128);
background: rgb(255, 123, 0);
```

---

### `sprite(...)`

使用来自纹理图集或资源位置的精灵图。

```css
background: sprite(ldlib2:textures/gui/icon.png);
```

高级用法：

```css
background: sprite(
    ldlib2:textures/gui/icon.png,
    0, 0, 16, 16,          /* sprite region (optional) */
    2, 2, 2, 2,            /* border (opional) */
    #FFFFFF                /* color tint (optional) */
);
```

---

### `icon(...)`

使用已注册的图标纹理。

```css
background: icon(check);
background: icon(modid, check);
```

---

### `rect(...)` / `sdf(...)`

创建基于 SDF 的矩形纹理。

```css
background: rect(#FF0000);
background: rect(#FF0000, 4);
background: rect(#FF0000, 4 4 4 4, 2, #FFFFFF);
```

参数：

1. 填充颜色
2. 圆角半径（单个值或 4 个值）（可选）
3. 描边宽度（可选）
4. 边框颜色（可选）

---

### `border(...)`

创建简单的彩色边框。

```css
background: border(2, #00FF00); 
```

---

### `group(...)`

将多个纹理组合为单个组。

```css
background: group(
    sprite(ldlib2:textures/gui/bg.png),
    rect(#FFFFFF, 2)
);
```

---

### `shader(...)`

使用自定义着色器纹理。

```css
background: shader(ldlib2:fbm);
```

---

### 基于资源的纹理

如果函数名称匹配已注册的**资源提供器类型**，将自动解析：

```css
background: builtin(ui-gdp:BORDER);
background: file("<namespace>:<path>");
```

这允许与 LDLib2 的资源系统集成。

---

## 纹理变换

在主纹理之后，可以应用**变换函数**。

### Scale（缩放）

```css
background: sprite(...) scale(2);
background: sprite(...) scale(2, 1);
```

---

### Rotate（旋转）

```css
background: sprite(...) rotate(45);
```

---

### Translate（平移）

```css
background: sprite(...) translate(4, 8);
```

---

### Color Override（颜色覆盖）

```css
background: sprite(...) color(#FFAA00);
background: sprite(...) color(255, 255, 0, 0);
```

这会使用给定的颜色对纹理进行着色。

---

总结，LSS 纹理值允许你：

* 声明式地定义纹理
* 以可读的方式链式应用变换
* 高效地复用和覆盖视觉效果

这使得 UI 样式设计既强大又对资源包友好。