# SpriteTexture

{{ version_badge("2.2.1", label="Since", icon="tag") }}

`SpriteTexture` renders a PNG image file from the `assets/` directory. It supports:

- **9-slice scaling** via `setBorder(...)` — corners stay crisp while the centre stretches.
- **Sprite region** selection within the source image via `setSprite(x, y, width, height)`.
- **Wrap modes** for tiling or mirroring the centre region.
- **Colour tint** via `setColor(int)`.

Registry name: `sprite_texture`

!!! note ""
    Extends `TransformTexture` — supports `rotate()`, `scale()`, `transform()`.

---

## Usage

=== "Java"

    ```java
    // Whole image, stretched
    IGuiTexture icon = SpriteTexture.of("mymod:textures/gui/icon.png");

    // 9-slice panel: 4 px border on all sides
    IGuiTexture panel = SpriteTexture.of("mymod:textures/gui/panel.png")
        .setBorder(4);

    // 9-slice with different left/top/right/bottom borders
    IGuiTexture fancy = SpriteTexture.of("mymod:textures/gui/fancy.png")
        .setBorder(4, 4, 4, 4); // left, top, right, bottom

    // Sub-region of a sprite sheet (x, y, width, height in pixels)
    IGuiTexture frame = SpriteTexture.of("mymod:textures/gui/sheet.png")
        .setSprite(0, 0, 16, 16);

    // Tiling background
    IGuiTexture tile = SpriteTexture.of("mymod:textures/gui/tile.png")
        .setWrapMode(SpriteTexture.WrapMode.REPEAT);

    // Tinted
    IGuiTexture tinted = SpriteTexture.of("mymod:textures/gui/icon.png")
        .setColor(0xFF44AAFF);
    ```

=== "Kotlin"

    ```kotlin
    val icon = SpriteTexture.of("mymod:textures/gui/icon.png")

    val panel = SpriteTexture.of("mymod:textures/gui/panel.png")
        .setBorder(4)

    val tile = SpriteTexture.of("mymod:textures/gui/tile.png")
        .setWrapMode(SpriteTexture.WrapMode.REPEAT)
    ```

=== "KubeJS"

    ```js
    let icon = SpriteTexture.of("mymod:textures/gui/icon.png");

    let panel = SpriteTexture.of("mymod:textures/gui/panel.png")
        .setBorder(4);

    let tinted = SpriteTexture.of("mymod:textures/gui/icon.png")
        .setColor(0xFF44AAFF);
    ```

---

## LSS

```css
/* Simple image */
background: sprite(mymod:textures/gui/icon.png);

/* With sprite region (x, y, width, height) */
background: sprite(mymod:textures/gui/sheet.png, 0, 0, 16, 16);

/* With border (left, top, right, bottom) */
background: sprite(mymod:textures/gui/panel.png, 0, 0, 64, 64, 4, 4, 4, 4);

/* With color tint */
background: sprite(mymod:textures/gui/icon.png, 0, 0, 16, 16, 0, 0, 0, 0, #FF44AAFF);
```

---

## Wrap Modes

| Value | Description |
| ----- | ----------- |
| `CLAMP` | The centre tile is stretched to fill the available area. Default. |
| `REPEAT` | The centre tile is repeated (tiled). |
| `MIRRORED_REPEAT` | The centre tile is tiled with alternating mirrors. |

Wrap modes only apply to the **centre** region of a 9-slice sprite. Corners and edges are always stretched.

---

## Fields

| Name | Type | Description |
| ---- | ---- | ----------- |
| `imageLocation` | `ResourceLocation` | Path to the PNG file. |
| `spritePosition` | `Position` | Top-left pixel of the source region. Default: `(0, 0)`. |
| `spriteSize` | `Size` | Width × height of the source region in pixels. `(0, 0)` = full image. |
| `borderLT` | `Position` | Left / top 9-slice border in pixels. |
| `borderRB` | `Position` | Right / bottom 9-slice border in pixels. |
| `color` | `int` | ARGB colour tint. Default: `0xFFFFFFFF` (no tint). |
| `wrapMode` | `WrapMode` | Centre tile wrap mode. Default: `CLAMP`. |

---

## Methods

| Method | Returns | Description |
| ------ | ------- | ----------- |
| `SpriteTexture.of(String)` | `SpriteTexture` | Static factory from a resource-location string. |
| `SpriteTexture.of(ResourceLocation)` | `SpriteTexture` | Static factory from a `ResourceLocation`. |
| `setImageLocation(ResourceLocation)` | `SpriteTexture` | Changes the source image (clears the size cache). |
| `setSprite(int x, int y, int w, int h)` | `SpriteTexture` | Sets the sprite region within the image. |
| `setBorder(int left, int top, int right, int bottom)` | `SpriteTexture` | Sets per-side 9-slice borders. |
| `setBorder(int)` | `SpriteTexture` | Sets all four borders to the same value. |
| `setColor(int)` | `SpriteTexture` | Sets the ARGB tint colour. |
| `setWrapMode(WrapMode)` | `SpriteTexture` | Sets the centre region wrap mode. |
| `getImageSize()` | `Size` | Returns the natural size of the loaded image (client-only). |
| `copy()` | `SpriteTexture` | Returns a deep copy. |