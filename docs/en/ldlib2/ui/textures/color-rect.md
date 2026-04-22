# ColorRectTexture

{{ version_badge("2.2.1", label="Since", icon="tag") }}

`ColorRectTexture` draws a solid ARGB-filled rectangle. It is the simplest texture type — no rounding, no border, just a flat colour.

Registry name: `color_rect_texture`

!!! note ""
    Extends `TransformTexture` — supports `rotate()`, `scale()`, `transform()`.

---

## Usage

=== "Java"

    ```java
    // Opaque dark background
    IGuiTexture bg = new ColorRectTexture(0xFF1A1A1A);

    // Semi-transparent overlay
    IGuiTexture overlay = new ColorRectTexture(0x80FFFFFF);

    // From java.awt.Color
    IGuiTexture red = new ColorRectTexture(java.awt.Color.RED);
    ```

=== "Kotlin"

    ```kotlin
    val bg = ColorRectTexture(0xFF1A1A1A.toInt())
    val overlay = ColorRectTexture(0x80FFFFFF.toInt())
    ```

=== "KubeJS"

    ```js
    let bg = new ColorRectTexture(0xFF1A1A1A);
    let overlay = new ColorRectTexture(0x80FFFFFF);
    ```

---

## LSS

```css
/* Hex color literal — automatically creates a ColorRectTexture */
background: #1A1A1AFF;   /* #AARRGGBB */
background: #1A1A1A;     /* #RRGGBB (fully opaque) */
background: #FFF;        /* shorthand */
background: rgba(26, 26, 26, 255);
background: rgb(26, 26, 26);

/* Explicit color() function */
background: color(#80FFFFFF);
```

---

## Fields

| Name | Type | Description |
| ---- | ---- | ----------- |
| `color` | `int` | The packed ARGB colour value. |

---

## Methods

| Method | Returns | Description |
| ------ | ------- | ----------- |
| `setColor(int)` | `ColorRectTexture` | Sets the packed ARGB colour. |
| `copy()` | `ColorRectTexture` | Returns a deep copy. |
| `interpolate(IGuiTexture, float)` | `IGuiTexture` | Blends towards another `ColorRectTexture` using OkLab colour space. |