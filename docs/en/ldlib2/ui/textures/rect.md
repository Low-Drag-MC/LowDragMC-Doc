# RectTexture

{{ version_badge("2.2.1", label="Since", icon="tag") }}

`RectTexture` draws a rounded rectangle using CPU-side tessellation. It is a fallback alternative to [`SDFRectTexture`](sdf-rect.md) for environments where the SDF shader is unavailable. Both classes expose the same properties.

Registry name: `rect_texture`

!!! note ""
    Extends `TransformTexture` — supports `rotate()`, `scale()`, `transform()`.

!!! tip ""
    For most use cases, prefer [`SDFRectTexture`](sdf-rect.md) which provides better visual quality at all sizes. Use `RectTexture` only when you need CPU-side rendering.

---

## Usage

=== "Java"

    ```java
    // Filled rounded rect
    IGuiTexture panel = new RectTexture()
        .setColor(0xFF2A2A2A)
        .setRadius(new Vector4f(6, 6, 6, 6));

    // With stroke
    IGuiTexture bordered = new RectTexture()
        .setColor(0xFF1A1A1A)
        .setRadius(new Vector4f(4, 4, 4, 4))
        .setStroke(1f)
        .setBorderColor(0xFFFFFFFF);

    // Static factory
    IGuiTexture simple = RectTexture.of(0xFF3A3A3A);
    ```

=== "Kotlin"

    ```kotlin
    val panel = RectTexture()
        .setColor(0xFF2A2A2A.toInt())
        .setRadius(Vector4f(6f, 6f, 6f, 6f))

    val simple = RectTexture.of(0xFF3A3A3A.toInt())
    ```

=== "KubeJS"

    ```js
    let panel = new RectTexture()
        .setColor(0xFF2A2A2A)
        .setStroke(1)
        .setBorderColor(0xFFFFFFFF);

    let simple = RectTexture.of(0xFF3A3A3A);
    ```

---

## Fields

| Name | Type | Description |
| ---- | ---- | ----------- |
| `color` | `int` | Fill colour (ARGB). Default: `0xFFFFFFFF`. |
| `borderColor` | `int` | Stroke colour (ARGB). Default: `0xFF000000`. |
| `radius` | `Vector4f` | Per-corner radii: `x` = bottom-left, `y` = bottom-right, `z` = top-right, `w` = top-left. |
| `stroke` | `float` | Border stroke width. `0` disables the border. |
| `cornerSegments` | `int` | Number of line segments per corner arc. Higher = smoother but more vertices. Default: `8`. |

---

## Methods

| Method | Returns | Description |
| ------ | ------- | ----------- |
| `setColor(int)` | `RectTexture` | Sets the fill colour. |
| `setBorderColor(int)` | `RectTexture` | Sets the stroke colour. |
| `setRadius(Vector4f)` | `RectTexture` | Sets per-corner radii. |
| `setStroke(float)` | `RectTexture` | Sets the stroke width. |
| `setCornerSegments(int)` | `RectTexture` | Sets the number of arc segments per corner. |
| `copy()` | `RectTexture` | Returns a deep copy. |
| `interpolate(IGuiTexture, float)` | `IGuiTexture` | Blends all properties toward another `RectTexture`. |
| `RectTexture.of(int)` | `RectTexture` | Static factory — creates a rect with the given fill colour. |