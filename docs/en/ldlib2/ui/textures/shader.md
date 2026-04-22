# ShaderTexture

{{ version_badge("2.2.1", label="Since", icon="tag") }}

`ShaderTexture` renders a region of the GUI using a custom GLSL shader. The shader receives the element's screen rectangle and mouse position as automatic uniforms, making it straightforward to create animated or interactive effects.

Registry name: `shader_texture`

!!! note ""
    Extends `TransformTexture` — supports `rotate()`, `scale()`, `transform()`.

!!! warning ""
    `ShaderTexture` holds a GPU resource (`LDShaderHolder`) and implements `AutoCloseable`. Call `close()` when the texture is no longer needed, or ensure it is managed by the editor.

---

## Usage

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

## Automatic Uniforms

The following uniforms are set automatically on every draw call:

| Uniform | Type | Description |
| ------- | ---- | ----------- |
| `U_GuiRect` | `vec4` | Screen-space rect: `(x, y, width, height)` in GUI pixels. |
| `U_GuiMouse` | `vec2` | Mouse position: `(mouseX, mouseY)` in GUI pixels. |

Vertex colour (`setColor`) is passed as the standard vertex colour attribute.

Additional uniforms can be exposed by the shader JSON and edited in the UI editor via `LDShaderHolder`.

---

## Shader File Location

Place the shader JSON at:

```
assets/<namespace>/shaders/core/<name>.json
```

Then reference it as `namespace:name` (without the `.json` extension).

---

## Fields

| Name | Type | Description |
| ---- | ---- | ----------- |
| `shaderLocation` | `ResourceLocation` | The registered shader location. |
| `color` | `int` | ARGB tint passed as vertex colour. Default: `-1` (white). |
| `shaderHolder` | `LDShaderHolder` (nullable) | The compiled GPU shader resource. `null` if compilation failed. |

---

## Methods

| Method | Returns | Description |
| ------ | ------- | ----------- |
| `setShader(ResourceLocation)` | `ShaderTexture` | Loads or reloads the shader. Safe to call from any thread. |
| `setColor(int)` | `ShaderTexture` | Sets the ARGB tint. |
| `close()` | `void` | Releases the GPU shader resource. |