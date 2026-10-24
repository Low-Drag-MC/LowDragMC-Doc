# Texture in LSS

<VersionBadge version="2.1.4" label="Since" icon="tag" />

In LDLib2, many visual styles (such as `background`) accept a **texture value**.  
Texture values in LSS are **string-based expressions** that describe how a texture is created and optionally transformed.

This system is flexible and composable, allowing you to build complex visuals using a concise syntax.

---

## Supported Texture Types

### Empty Texture

```css
background: empty;
```

or an empty string:

```css
background: ;
```

This results in no texture being rendered.

---

### Solid Color

If the value can be parsed as a color, it will be treated as a color rectangle:

```css
background: #1F00FFFF; /* #AARRGGBB */
background: #FF00FF; //* #RRGGBB */
background: #FFF; /* #RGB */
background: rgba(255, 0, 0, 128);
background: rgb(255, 123, 0);
```

---

### `sprite(...)`

Uses a sprite from a texture atlas or resource location.

```css
background: sprite(ldlib2:textures/gui/icon.png);
```

Advanced usage:

```css
background: sprite(
    ldlib2:textures/gui/icon.png,
    0, 0, 16, 16,          /* sprite region (optional) */
    2, 2, 2, 2,            /* border (opional) */
    #FFFFFF,               /* color tint (optional) */
    repeat                 /* wrap mode (optional, since 2.2.41) */
);
```

The wrap mode is `clamp`, `repeat` or `mirrored-repeat`. Because it is the 11th argument, prefer the [`wrap(...)`](#wrap-mode) modifier, which works without spelling out the region, border and tint.

---

### `icon(...)`

Uses a registered icon texture.

```css
background: icon(check);
background: icon(modid, check);
```

---

### `rect(...)`

Creates a [`RectTexture`](rect.md), a rounded rectangle tessellated on the CPU.

```css
background: rect(#FF0000);
background: rect(#FF0000, 4);
background: rect(#FF0000, 4 4 4 4, 2, #FFFFFF);
background: rect(#FF0000, 6, 0, #00000000, 16); /* smoother corners */
```

Arguments:

1. Fill color
2. Corner radius (single value, or 4 values: top-left, top-right, bottom-right, bottom-left) (optional)
3. Stroke width (optional)
4. Border color (optional)
5. Corner segments, the number of line segments per corner arc (optional, default `8`, since 2.2.41)

---

### `sdf(...)`

Creates an [`SDFRectTexture`](sdf-rect.md), a rounded rectangle drawn by an SDF shader with anti-aliased edges at any size.

```css
background: sdf(#FF0000);
background: sdf(#FF0000, 4);
background: sdf(#FF0000, 4 4 4 4, 2, #FFFFFF);
```

Arguments:

1. Fill color
2. Corner radius (single value, or 4 values: bottom-left, bottom-right, top-right, top-left) (optional)
3. Stroke width (optional)
4. Border color (optional)

::: warning Corner order differs
With four radii, `sdf()` reads them bottom-left, bottom-right, top-right, top-left, while `rect()` reads them top-left, top-right, bottom-right, bottom-left. Left-only (`r 0 0 r`) and right-only (`0 r r 0`) values read the same in both orders, so check a top or bottom rounding when you switch between them.
:::

---

### `border(...)`

Creates a simple colored border.

```css
background: border(2, #00FF00); 
```

---

### `group(...)`

Combines multiple textures into a single group.

```css
background: group(
    sprite(ldlib2:textures/gui/bg.png),
    rect(#FFFFFF, 2)
);
```

---

### `shader(...)`

Uses a custom shader texture.

```css
background: shader(ldlib2:fbm);
```

---

### Resource-based Textures

If the function name matches a registered **resource provider type**, it will be resolved automatically:

```css
background: builtin(ui-gdp:BORDER);
background: file("<namespace>:<path>");
```

This allows integration with LDLib2’s resource system.

---

## Texture Transforms

After the main texture, you can apply **modifier functions**. Modifiers never change a shared texture instance: when a modifier changes the texture, it is applied to a copy.

### Scale

```css
background: sprite(...) scale(2);
background: sprite(...) scale(2, 1);
```

---

### Rotate

```css
background: sprite(...) rotate(45);
```

---

### Translate

```css
background: sprite(...) translate(4, 8);
```

---

### Color Override

```css
background: sprite(...) color(#FFAA00);
background: sprite(...) color(255, 255, 0, 0);
```

This tints the texture using the given color.

---

### Wrap Mode
<VersionBadge version="2.2.41" label="Since" icon="tag" />

```css
background: sprite(mymod:textures/gui/tile.png) wrap(repeat);
background: sprite(mymod:textures/gui/panel.png, 0, 0, 64, 64, 4, 4, 4, 4) wrap-mode(mirrored-repeat);
```

`wrap(...)` and `wrap-mode(...)` set the [`SpriteTexture` wrap mode](sprite.md#wrap-modes): `clamp`, `repeat` or `mirrored-repeat`. They only affect `sprite(...)` textures and are ignored on other types.

---

::: info Invalid values
A texture value that cannot be parsed logs a warning, once per distinct value, instead of failing silently.
:::

---

In summary, LSS texture values let you:

* Define textures declaratively
* Chain transforms in a readable way
* Reuse and override visuals efficiently

This makes UI styling both powerful and resource-pack friendly.
