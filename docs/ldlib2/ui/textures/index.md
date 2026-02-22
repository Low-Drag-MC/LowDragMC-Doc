# IGuiTexture

{{ version_badge("2.2.1", label="Since", icon="tag") }}

`IGuiTexture` is the base interface for all drawable textures in LDLib2. Every style property that accepts visual appearance (e.g. `background`, `focus-overlay`, `mark-background`) takes an `IGuiTexture`.

All registered texture implementations are part of the `ldlib2:gui_texture` registry and can be serialised, edited in the UI editor, and used in LSS.

---

## Built-in Constants

| Constant | Description |
| -------- | ----------- |
| `IGuiTexture.EMPTY` | No-op — draws nothing. Use this to remove a texture without passing `null`. |
| `IGuiTexture.MISSING_TEXTURE` | Renders the vanilla missing-texture checkerboard. Used as a fallback when a resource cannot be resolved. |

---

## TransformTexture

Most concrete texture types extend the abstract `TransformTexture`, which wraps a `Transform2D` applied to every draw call. All `TransformTexture` subclasses inherit these fluent methods:

| Method | Description |
| ------ | ----------- |
| `rotate(float degree)` | Rotates around the texture centre by `degree` degrees. |
| `scale(float scale)` | Scales uniformly around the centre. |
| `scale(float width, float height)` | Scales independently on each axis. |
| `transform(float xOffset, float yOffset)` | Translates by the given offset in GUI pixels. |
| `setColor(int argb)` | Tints the texture. Exact effect depends on subtype. |

=== "Java"

    ```java
    IGuiTexture tex = SpriteTexture.of("mymod:textures/gui/icon.png")
        .rotate(45f)
        .scale(0.8f)
        .setColor(0x80FFFFFF); // 50 % opacity white tint
    ```

=== "Kotlin"

    ```kotlin
    val tex = SpriteTexture.of("mymod:textures/gui/icon.png")
        .rotate(45f)
        .scale(0.8f)
        .setColor(0x80FFFFFF.toInt())
    ```

=== "KubeJS"

    ```js
    let tex = SpriteTexture.of("mymod:textures/gui/icon.png")
        .rotate(45)
        .scale(0.8)
        .setColor(0x80FFFFFF);
    ```

---

## Interface Methods

| Method | Returns | Description |
| ------ | ------- | ----------- |
| `setColor(int)` | `IGuiTexture` | Tints the texture. No-op on the interface; overridden by concrete types. |
| `rotate(float)` | `IGuiTexture` | Rotates the texture. No-op on the interface; overridden by `TransformTexture`. |
| `scale(float)` | `IGuiTexture` | Scales the texture. No-op on the interface; overridden by `TransformTexture`. |
| `transform(int, int)` | `IGuiTexture` | Translates the texture. No-op on the interface; overridden by `TransformTexture`. |
| `getRawTexture()` | `IGuiTexture` | Returns the underlying texture, unwrapping any proxy (e.g. `DynamicTexture`). |
| `copy()` | `IGuiTexture` | Creates a deep copy via the codec. |
| `interpolate(IGuiTexture, float)` | `IGuiTexture` | Blends this texture with another. `lerp = 0` is this, `lerp = 1` is `other`. Natively supported by `ColorRectTexture`, `RectTexture`, `SDFRectTexture`, and `ColorBorderTexture`. |

---

## Static Factory Helpers

=== "Java"

    ```java
    // Layer multiple textures (drawn in order)
    IGuiTexture layered = IGuiTexture.group(background, overlay);

    // Lazy / dynamic texture resolved every frame
    IGuiTexture dynamic = IGuiTexture.dynamic(() -> currentTexture);
    ```

=== "Kotlin"

    ```kotlin
    val layered = IGuiTexture.group(background, overlay)
    val dynamic = IGuiTexture.dynamic { currentTexture }
    ```

=== "KubeJS"

    ```js
    let layered = IGuiTexture.group(background, overlay);
    let dynamic = IGuiTexture.dynamic(() => currentTexture);
    ```

---

## Registered Texture Types

| Registry name | Class | LSS function | Description |
| ------------- | ----- | ------------ | ----------- |
| `color_rect_texture` | [`ColorRectTexture`](color-rect.md) | `color(#RGBA)` or hex literal | Solid-fill rectangle. |
| `color_border_texture` | [`ColorBorderTexture`](color-border.md) | `border(size, #RGBA)` | Border-only rectangle (no fill). |
| `sdf_rect_texture` | [`SDFRectTexture`](sdf-rect.md) | `rect(color, radius?, stroke?, borderColor?)` | GPU SDF rounded rect with optional stroke. |
| `rect_texture` | [`RectTexture`](rect.md) | — | CPU-rendered rounded rect (no shader required). |
| `sprite_texture` | [`SpriteTexture`](sprite.md) | `sprite(path, ...)` | PNG image with optional 9-slice and wrap mode. |
| `text_texture` | [`TextTexture`](text.md) | — | Rendered text with scrolling modes. |
| `animation_texture` | [`AnimationTexture`](animation.md) | — | Sprite-sheet frame animation. |
| `item_stack_texture` | [`ItemStackTexture`](item-stack.md) | — | One or more `ItemStack`s cycling every 20 ticks. |
| `fluid_stack_texture` | [`FluidStackTexture`](fluid-stack.md) | — | One or more fluids cycling every 20 ticks. |
| `group_texture` | [`GuiTextureGroup`](group.md) | `group(...)` | Ordered stack of textures drawn together. |
| `shader_texture` | [`ShaderTexture`](shader.md) | `shader(location)` | Custom GLSL shader with automatic GUI uniforms. |
| `ui_resource_texture` | [`UIResourceTexture`](ui-resource.md) | `builtin(name)` / `file(...)` | References a texture saved in the editor resource system. |

---

## LSS Reference

Textures are used as values in LSS properties. See [Texture in LSS](lss.md) for the complete syntax including `rect()`, `sprite()`, `group()`, and transform chains.

```css
button {
    background: rect(#3a3a3a, 4);
    hover-background: rect(#4a4a4a, 4, 1, #FFFFFF66);
}
```