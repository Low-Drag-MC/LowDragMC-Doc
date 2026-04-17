# SDFRectTexture

{{ version_badge("2.2.1", label="Since", icon="tag") }}

`SDFRectTexture` draws a rounded rectangle using an SDF (Signed Distance Field) GPU shader. It produces sharp, anti-aliased edges at any size. Supports per-corner radii, an optional stroke border, and smooth CSS-transition interpolation.

Registry name: `sdf_rect_texture`  
LSS function: `rect(...)` / `sdf(...)`

!!! note ""
    Extends `TransformTexture` — supports `rotate()`, `scale()`, `transform()`.

---

## Usage

=== "Java"

    ```java
    // Filled rounded rect
    IGuiTexture panel = new SDFRectTexture()
        .setColor(0xFF2A2A2A)
        .setRadius(6f);

    // Rounded rect with a white stroke
    IGuiTexture bordered = new SDFRectTexture()
        .setColor(0xFF1A1A1A)
        .setRadius(4f)
        .setStroke(1f)
        .setBorderColor(0xFFFFFFFF);

    // Static factory
    IGuiTexture simple = SDFRectTexture.of(0xFF3A3A3A);
    ```

=== "Kotlin"

    ```kotlin
    val panel = SDFRectTexture()
        .setColor(0xFF2A2A2A.toInt())
        .setRadius(6f)

    val bordered = SDFRectTexture.of(0xFF1A1A1A.toInt())
        .setRadius(4f)
        .setStroke(1f)
        .setBorderColor(0xFFFFFFFF.toInt())
    ```

=== "KubeJS"

    ```js
    let panel = new SDFRectTexture()
        .setColor(0xFF2A2A2A)
        .setRadius(6);

    let bordered = SDFRectTexture.of(0xFF1A1A1A)
        .setRadius(4)
        .setStroke(1)
        .setBorderColor(0xFFFFFFFF);
    ```

---

## LSS

```css
/* rect(fillColor) */
background: rect(#2A2A2A);

/* rect(fillColor, radius) */
background: rect(#2A2A2A, 6);

/* rect(fillColor, radius, strokeWidth, borderColor) */
background: rect(#2A2A2A, 4, 1, #FFFFFF);

/* Per-corner radii: top-left top-right bottom-right bottom-left */
background: rect(#2A2A2A, 8 4 8 4);
```

---

## Fields

| Name | Type | Description |
| ---- | ---- | ----------- |
| `color` | `int` | Fill colour (ARGB). Default: `0xFFFFFFFF`. |
| `borderColor` | `int` | Stroke colour (ARGB). Default: `0xFF000000`. |
| `radius` | `Vector4f` | Per-corner radii: `x` = bottom-left, `y` = bottom-right, `z` = top-right, `w` = top-left. |
| `stroke` | `float` | Border stroke width in pixels. `0` disables the border. |

---

## Methods

| Method | Returns | Description |
| ------ | ------- | ----------- |
| `setColor(int)` | `SDFRectTexture` | Sets the fill colour. |
| `setBorderColor(int)` | `SDFRectTexture` | Sets the stroke colour. |
| `setRadius(float)` | `SDFRectTexture` | Sets all four corner radii to the same value. |
| `setRadius(Vector4f)` | `SDFRectTexture` | Sets per-corner radii. |
| `setStroke(float)` | `SDFRectTexture` | Sets the stroke width. |
| `copy()` | `SDFRectTexture` | Returns a deep copy. |
| `interpolate(IGuiTexture, float)` | `IGuiTexture` | Blends all properties toward another `SDFRectTexture`. |
| `SDFRectTexture.of(int)` | `SDFRectTexture` | Static factory — creates a rect with the given fill colour. |