# SDFRectTexture

<VersionBadge version="2.2.1" label="Since" icon="tag" />

`SDFRectTexture` draws a rounded rectangle using an SDF (Signed Distance Field) GPU shader. It produces sharp, anti-aliased edges at any size. Supports per-corner radii, an optional stroke border, and smooth CSS-transition interpolation.

Registry name: `sdf_rect_texture`  
LSS function: `sdf(...)`

::: info
Extends `TransformTexture` — supports `rotate()`, `scale()`, `transform()`.
:::

---

## Usage

<DocTabs>
<DocTab title="Java">

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

</DocTab>
<DocTab title="Kotlin">

```kotlin
val panel = SDFRectTexture()
    .setColor(0xFF2A2A2A.toInt())
    .setRadius(6f)

val bordered = SDFRectTexture.of(0xFF1A1A1A.toInt())
    .setRadius(4f)
    .setStroke(1f)
    .setBorderColor(0xFFFFFFFF.toInt())
```

</DocTab>
<DocTab title="KubeJS">

```js
let panel = new SDFRectTexture()
    .setColor(0xFF2A2A2A)
    .setRadius(6);

let bordered = SDFRectTexture.of(0xFF1A1A1A)
    .setRadius(4)
    .setStroke(1)
    .setBorderColor(0xFFFFFFFF);
```

</DocTab>
</DocTabs>

---

## LSS

```css
/* sdf(fillColor) */
background: sdf(#2A2A2A);

/* sdf(fillColor, radius) */
background: sdf(#2A2A2A, 6);

/* sdf(fillColor, radius, strokeWidth, borderColor) */
background: sdf(#2A2A2A, 4, 1, #FFFFFF);

/* Per-corner radii: bottom-left bottom-right top-right top-left */
background: sdf(#2A2A2A, 0 0 8 8); /* rounds the top corners */
```

::: warning Corner order
`sdf()` reads four radii from bottom-left: bottom-left, bottom-right, top-right, top-left. This is the reverse of CSS and of [`rect()`](rect.md#lss). `r 0 0 r` (left side) and `0 r r 0` (right side) are the same in both orders, so a wrong order only shows up when rounding the top or bottom.
:::

`rect(...)` creates a CPU-drawn [`RectTexture`](rect.md), not an `SDFRectTexture`.

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