# ColorBorderTexture

{{ version_badge("2.2.1", label="Since", icon="tag") }}

`ColorBorderTexture` draws only a coloured border around a rectangle — no fill. A positive `border` value draws outside the element bounds; a negative value draws inside.

Registry name: `color_border_texture`

!!! note ""
    Extends `TransformTexture` — supports `rotate()`, `scale()`, `transform()`.

---

## Usage

=== "Java"

    ```java
    // 2 px outside border, white
    IGuiTexture outline = new ColorBorderTexture(2, 0xFFFFFFFF);

    // 1 px inside border, semi-transparent blue
    IGuiTexture inset = new ColorBorderTexture(-1, 0x800000FF);
    ```

=== "Kotlin"

    ```kotlin
    val outline = ColorBorderTexture(2, 0xFFFFFFFF.toInt())
    val inset = ColorBorderTexture(-1, 0x800000FF.toInt())
    ```

=== "KubeJS"

    ```js
    let outline = new ColorBorderTexture(2, 0xFFFFFFFF);
    let inset = new ColorBorderTexture(-1, 0x800000FF);
    ```

---

## LSS

```css
/* border(size, color) */
background: border(2, #FFFFFF);
background: border(-1, #800000FF);
```

---

## Fields

| Name | Type | Description |
| ---- | ---- | ----------- |
| `border` | `int` | Border thickness in pixels. Positive = outside, negative = inside. |
| `color` | `int` | Packed ARGB colour. |

---

## Methods

| Method | Returns | Description |
| ------ | ------- | ----------- |
| `setBorder(int)` | `ColorBorderTexture` | Sets the border thickness. |
| `setColor(int)` | `ColorBorderTexture` | Sets the packed ARGB colour. |
| `copy()` | `ColorBorderTexture` | Returns a deep copy. |
| `interpolate(IGuiTexture, float)` | `IGuiTexture` | Blends border and colour towards another `ColorBorderTexture`. |