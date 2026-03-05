# ShaderTexture

{{ version_badge("2.2.1", label="Since", icon="tag") }}

`ShaderTexture` 使用自定义 GLSL 着色器渲染 GUI 区域。着色器会自动接收元素的屏幕矩形和鼠标位置作为 Uniform，便于创建动画或交互效果。

注册名: `shader_texture`

!!! note ""
    继承自 `TransformTexture` — 支持 `rotate()`、`scale()`、`transform()`。

!!! warning ""
    `ShaderTexture` 持有 GPU 资源（`LDShaderHolder`）并实现了 `AutoCloseable`。当纹理不再使用时需调用 `close()`，或确保由编辑器管理。

---

## 用法

=== "Java"

    ```java
    // Load a shader from assets/mymod/shaders/core/my_effect.json
    IGuiTexture effect = new ShaderTexture(ResourceLocation.parse("mymod:my_effect"));

    // Tinted shader (vertex colour passed to the shader)
    IGuiTexture tinted = new ShaderTexture(ResourceLocation.parse("mymod:my_effect"))
        .setColor(0xFF44AAFF);
    ```

=== "Kotlin"

    ```kotlin
    val effect = ShaderTexture(ResourceLocation.parse("mymod:my_effect"))

    val tinted = ShaderTexture(ResourceLocation.parse("mymod:my_effect"))
        .setColor(0xFF44AAFF.toInt())
    ```

=== "KubeJS"

    ```js
    let effect = new ShaderTexture(ResourceLocation.parse("mymod:my_effect"));
    ```

---

## LSS

```css
background: shader(mymod:my_effect);
```

---

## 自动 Uniform

以下 Uniform 在每次绘制调用时自动设置：

| Uniform | 类型 | 描述 |
| ------- | ---- | ---- |
| `U_GuiRect` | `vec4` | 屏幕空间矩形：`(x, y, width, height)`，单位为 GUI 像素。 |
| `U_GuiMouse` | `vec2` | 鼠标位置：`(mouseX, mouseY)`，单位为 GUI 像素。 |

顶点颜色（`setColor`）作为标准顶点颜色属性传递。

可以通过着色器 JSON 暴露额外的 Uniform，并在 UI 编辑器中通过 `LDShaderHolder` 进行编辑。

---

## 着色器文件位置

将着色器 JSON 放置在：

```
assets/<namespace>/shaders/core/<name>.json
```

然后以 `namespace:name` 引用（不带 `.json` 扩展名）。

---

## 字段

| 名称 | 类型 | 描述 |
| ---- | ---- | ---- |
| `shaderLocation` | `ResourceLocation` | 注册的着色器位置。 |
| `color` | `int` | 作为顶点颜色传递的 ARGB 色调。默认值：`-1`（白色）。 |
| `shaderHolder` | `LDShaderHolder`（可空） | 编译后的 GPU 着色器资源。编译失败时为 `null`。 |

---

## 方法

| 方法 | 返回类型 | 描述 |
| ---- | -------- | ---- |
| `setShader(ResourceLocation)` | `ShaderTexture` | 加载或重新加载着色器。可在任意线程调用。 |
| `setColor(int)` | `ShaderTexture` | 设置 ARGB 色调。 |
| `close()` | `void` | 释放 GPU 着色器资源。 |