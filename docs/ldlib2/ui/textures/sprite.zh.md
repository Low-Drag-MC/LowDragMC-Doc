# SpriteTexture

{{ version_badge("2.2.1", label="Since", icon="tag") }}

`SpriteTexture` 用于渲染 `assets/` 目录中的 PNG 图像文件。支持以下功能：

- **九宫格缩放**：通过 `setBorder(...)` 设置，角落保持清晰，中心区域拉伸。
- **精灵区域**：通过 `setSprite(x, y, width, height)` 选择源图像中的特定区域。
- **平铺模式**：用于平铺或镜像中心区域。
- **颜色着色**：通过 `setColor(int)` 设置。

注册名：`sprite_texture`

!!! note ""
    继承自 `TransformTexture`，支持 `rotate()`、`scale()`、`transform()`。

---

## 用法

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

## 平铺模式

| 值 | 描述 |
| ----- | ----------- |
| `CLAMP` | 中心区域拉伸填充可用空间。默认值。 |
| `REPEAT` | 中心区域重复平铺。 |
| `MIRRORED_REPEAT` | 中心区域以镜像方式交替平铺。 |

平铺模式仅应用于九宫格精灵的**中心**区域。角落和边缘始终拉伸。

---

## 字段

| 名称 | 类型 | 描述 |
| ---- | ---- | ----------- |
| `imageLocation` | `ResourceLocation` | PNG 文件路径。 |
| `spritePosition` | `Position` | 源区域的左上角像素位置。默认：`(0, 0)`。 |
| `spriteSize` | `Size` | 源区域的宽度×高度（像素）。`(0, 0)` 表示完整图像。 |
| `borderLT` | `Position` | 左/上九宫格边框（像素）。 |
| `borderRB` | `Position` | 右/下九宫格边框（像素）。 |
| `color` | `int` | ARGB 颜色着色。默认：`0xFFFFFFFF`（无着色）。 |
| `wrapMode` | `WrapMode` | 中心区域平铺模式。默认：`CLAMP`。 |

---

## 方法

| 方法 | 返回值 | 描述 |
| ------ | ------- | ----------- |
| `SpriteTexture.of(String)` | `SpriteTexture` | 从资源位置字符串创建的静态工厂方法。 |
| `SpriteTexture.of(ResourceLocation)` | `SpriteTexture` | 从 `ResourceLocation` 创建的静态工厂方法。 |
| `setImageLocation(ResourceLocation)` | `SpriteTexture` | 更改源图像（清除尺寸缓存）。 |
| `setSprite(int x, int y, int w, int h)` | `SpriteTexture` | 设置图像中的精灵区域。 |
| `setBorder(int left, int top, int right, int bottom)` | `SpriteTexture` | 设置每边的九宫格边框。 |
| `setBorder(int)` | `SpriteTexture` | 将四边边框设置为相同值。 |
| `setColor(int)` | `SpriteTexture` | 设置 ARGB 着色颜色。 |
| `setWrapMode(WrapMode)` | `SpriteTexture` | 设置中心区域的平铺模式。 |
| `getImageSize()` | `Size` | 返回已加载图像的原始尺寸（仅客户端）。 |
| `copy()` | `SpriteTexture` | 返回深拷贝。 |
