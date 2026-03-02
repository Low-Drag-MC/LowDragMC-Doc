# 精灵纹理
{{ version_badge("2.2.1", label="Since", icon="tag") }}
`SpriteTexture` 从`assets/` 目录渲染PNG 图像文件。它支持：
- **9 切片缩放** 通过 `setBorder(...)` — 边角保持清晰，而中心拉伸。- **精灵区域**通过`setSprite(x, y, width, height)` 在源图像中选择。- **包裹模式**用于平铺或镜像中心区域。- **色调**通过`setColor(int)`。
注册表名称：`sprite_texture`
!!!笔记 ””扩展`TransformTexture` — 支持`rotate()`、`scale()`、`transform()`。
---

＃＃ 用法
===“Java”
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

===“科特林”
    ```kotlin
    val icon = SpriteTexture.of("mymod:textures/gui/icon.png")

    val panel = SpriteTexture.of("mymod:textures/gui/panel.png")
        .setBorder(4)

    val tile = SpriteTexture.of("mymod:textures/gui/tile.png")
        .setWrapMode(SpriteTexture.WrapMode.REPEAT)
    ```

===“KubeJS”
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

## 环绕模式
| Value | Description |
| ----- | ----------- |
| `CLAMP` | The centre tile is stretched to fill the available area. Default. |
| `REPEAT` | The centre tile is repeated (tiled). |
| `MIRRORED_REPEAT` | The centre tile is tiled with alternating mirrors. |

环绕模式仅适用于 9 切片精灵的**中心**区域。角落和边缘总是被拉伸。
---

## 字段
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

＃＃ 方法
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