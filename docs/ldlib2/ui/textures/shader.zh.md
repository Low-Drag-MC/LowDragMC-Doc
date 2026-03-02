# 材质纹理
{{ version_badge("2.2.1", label="Since", icon="tag") }}
`ShaderTexture` 使用自定义 GLSL 着色器渲染 GUI 的区域。着色器接收元素的屏幕矩形和鼠标位置作为自动制服，从而可以轻松创建动画或交互式效果。
注册表名称：`shader_texture`
!!!笔记 ””扩展`TransformTexture` — 支持`rotate()`、`scale()`、`transform()`。
!!!警告 ””`ShaderTexture` 持有 GPU 资源 (`LDShaderHolder`) 并实现`AutoCloseable`。当不再需要纹理时调用`close()`，或确保它由编辑器管理。
---

＃＃ 用法
===“Java”
    ```java
    // Load a shader from assets/mymod/shaders/core/my_effect.json
    IGuiTexture effect = new ShaderTexture(ResourceLocation.parse("mymod:my_effect"));

    // Tinted shader (vertex colour passed to the shader)
    IGuiTexture tinted = new ShaderTexture(ResourceLocation.parse("mymod:my_effect"))
        .setColor(0xFF44AAFF);
    ```

===“科特林”
    ```kotlin
    val effect = ShaderTexture(ResourceLocation.parse("mymod:my_effect"))

    val tinted = ShaderTexture(ResourceLocation.parse("mymod:my_effect"))
        .setColor(0xFF44AAFF.toInt())
    ```

===“KubeJS”
    ```js
    let effect = new ShaderTexture(ResourceLocation.parse("mymod:my_effect"));
    ```

---

## LSS
```css
background: shader(mymod:my_effect);
```

---

## 自动制服
每次绘图调用时都会自动设置以下制服：
| Uniform | Type | Description |
| ------- | ---- | ----------- |
| `U_GuiRect` | `vec4` | Screen-space rect: `(x, y, width, height)` in GUI pixels. |
| `U_GuiMouse` | `vec2` | Mouse position: `(mouseX, mouseY)` in GUI pixels. |

顶点颜色 (`setColor`) 作为标准顶点颜色属性传递。
其他制服可以由着色器 JSON 公开，并通过 `LDShaderHolder` 在 UI 编辑器中进行编辑。
---

## 着色器文件位置
将着色器 JSON 放置在：
```
assets/<namespace>/shaders/core/<name>.json
```

然后将其引用为`namespace:name`（不带`.json` 扩展名）。
---

## 字段
| Name | Type | Description |
| ---- | ---- | ----------- |
| `shaderLocation` | `ResourceLocation` | The registered shader location. |
| `color` | `int` | ARGB tint passed as vertex colour. Default: `-1` (white). |
| `shaderHolder` | `LDShaderHolder` (nullable) | The compiled GPU shader resource. `null` if compilation failed. |

---

＃＃ 方法
| Method | Returns | Description |
| ------ | ------- | ----------- |
| `setShader(ResourceLocation)` | `ShaderTexture` | Loads or reloads the shader. Safe to call from any thread. |
| `setColor(int)` | `ShaderTexture` | Sets the ARGB tint. |
| `close()` | `void` | Releases the GPU shader resource. |