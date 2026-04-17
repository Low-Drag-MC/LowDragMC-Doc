# GuiTextureGroup

{{ version_badge("2.2.1", label="Since", icon="tag") }}

`GuiTextureGroup` draws multiple `IGuiTexture` instances stacked on top of each other in the order they were added. It is useful for combining a background image with an overlay, or layering a border over a fill.

Registry name: `group_texture`

!!! note ""
    Extends `TransformTexture` — supports `rotate()`, `scale()`, `transform()`.

---

## Usage

=== "Java"

    ```java
    // Layer a sprite background and a coloured border
    IGuiTexture layered = IGuiTexture.group(
        SpriteTexture.of("mymod:textures/gui/bg.png"),
        new ColorBorderTexture(1, 0xFFFFFFFF)
    );

    // Equivalent static factory
    IGuiTexture same = GuiTextureGroup.of(
        SpriteTexture.of("mymod:textures/gui/bg.png"),
        new ColorBorderTexture(1, 0xFFFFFFFF)
    );
    ```

=== "Kotlin"

    ```kotlin
    val layered = IGuiTexture.group(
        SpriteTexture.of("mymod:textures/gui/bg.png"),
        ColorBorderTexture(1, 0xFFFFFFFF.toInt())
       )
    ```

=== "KubeJS"

    ```js
    let layered = IGuiTexture.group(
        SpriteTexture.of("mymod:textures/gui/bg.png"),
        new ColorBorderTexture(1, 0xFFFFFFFF)
    );
    ```

---

## LSS

```css
background: group(
    sprite(mymod:textures/gui/bg.png),
    rect(#FFFFFF22, 2)
);
```

---

## Fields

| Name | Type | Description |
| ---- | ---- | ----------- |
| `textures` | `IGuiTexture[]` | The textures drawn in order (bottom to top). |

---

## Methods

| Method | Returns | Description |
| ------ | ------- | ----------- |
| `GuiTextureGroup.of(IGuiTexture...)` | `GuiTextureGroup` | Static factory. Equivalent to `IGuiTexture.group(...)`. |
| `setTextures(IGuiTexture...)` | `GuiTextureGroup` | Replaces all textures in the group. |
| `setColor(int)` | `GuiTextureGroup` | Copies all textures, applies `setColor(color)` to each, and returns a new group. |
| `copy()` | `GuiTextureGroup` | Returns a shallow copy (textures are shared). |