# LSS 中的纹理
{{ version_badge("2.1.4", label="Since", icon="tag") }}
在 LDLib2 中，许多视觉样式（例如`background`）接受**纹理值**。LSS 中的纹理值是**基于字符串的表达式**，描述纹理的创建方式和可选的转换方式。
该系统灵活且可组合，允许您使用简洁的语法构建复杂的视觉效果。
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

这会导致没有纹理被渲染。
---

＃＃＃ 纯色
如果该值可以解析为颜色，则它将被视为颜色矩形：
```css
background: #1F00FFFF; /* #AARRGGBB */
background: #FF00FF; //* #RRGGBB */
background: #FFF; /* #RGB */
background: rgba(255, 0, 0, 128);
background: rgb(255, 123, 0);
```

---

###`sprite(...)`
使用来自纹理图集或资源位置的精灵。
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

###`icon(...)`
使用注册的图标纹理。
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

论据：
1. 填充颜​​色2. 圆角半径（单个值或 4 个值）（可选）3. 笔划宽度（可选）4. 边框颜色（可选）
---

###`border(...)`
创建一个简单的彩色边框。
```css
background: border(2, #00FF00); 
```

---

###`group(...)`
将多个纹理组合成一个组。
```css
background: group(
    sprite(ldlib2:textures/gui/bg.png),
    rect(#FFFFFF, 2)
);
```

---

###`shader(...)`
使用自定义着色器纹理。
```css
background: shader(ldlib2:fbm);
```

---

### 基于资源的纹理
如果函数名称与注册的**资源提供者类型**匹配，它将自动解析：
```css
background: builtin(ui-gdp:BORDER);
background: file("<namespace>:<path>");
```

这允许与 LDLib2 的资源系统集成。
---

## 纹理变换
在主纹理之后，您可以应用**变换函数**。
＃＃＃ 规模
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

＃＃＃ 翻译
```css
background: sprite(...) translate(4, 8);
```

---

### 颜色覆盖
```css
background: sprite(...) color(#FFAA00);
background: sprite(...) color(255, 255, 0, 0);
```

这使用给定的颜色对纹理进行着色。
---

总之，LSS 纹理值可让您：
* 以声明方式定义纹理* 链以可读的方式转换* 有效地重用和覆盖视觉效果
这使得 UI 样式既强大又对资源包友好。