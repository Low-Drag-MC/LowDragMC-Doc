# SpriteTexture

{{ version_badge("2.2.1", label="自", icon="tag") }}

`SpriteTexture` 从 `assets/` 目录中渲染一张 PNG 图像文件。它支持：

- **九宫格缩放** —— 通过 `setBorder(...)` 实现，四个角保持清晰，中心部分拉伸。
- **精灵区域** —— 通过 `setSprite(x, y, width, height)` 在源图像中选择区域。
- **环绕模式** —— 用于平铺或镜像中心区域。
- **颜色着色** —— 通过 `setColor(int)` 实现。

注册名：`sprite_texture`

!!! note ""
    继承自 `TransformTexture` —— 支持 `rotate()`、`scale()`、`transform()`。

---

## 用法

=== "Java"

    ```java
    // 整张图像，拉伸
    IGuiTexture icon = SpriteTexture.of("mymod:textures/gui/icon.png");

    // 九宫格面板：四边各 4 像素边框
    IGuiTexture panel = SpriteTexture.of("mymod:textures/gui/panel.png")
        .setBorder(4);

    // 九宫格，四边边框不同
    IGuiTexture fancy = SpriteTexture.of("mymod:textures/gui/fancy.png")
        .setBorder(4, 4, 4, 4); // left, top, right, bottom

    // 精灵表中的子区域（x、y、width、height 以像素为单位）
    IGuiTexture frame = SpriteTexture.of("mymod:textures/gui/sheet.png")
        .setSprite(0, 0, 16, 16);

    // 平铺背景
    IGuiTexture tile = SpriteTexture.of("mymod:textures/gui/tile.png")
        .setWrapMode(SpriteTexture.WrapMode.REPEAT);

    // 着色
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
/* 简单图像 */
background: sprite(mymod:textures/gui/icon.png);

/* 带精灵区域（x、y、width、height） */
background: sprite(mymod:textures/gui/sheet.png, 0, 0, 16, 16);

/* 带边框（left、top、right、bottom） */
background: sprite(mymod:textures/gui/panel.png, 0, 0, 64, 64, 4, 4, 4, 4);

/* 带颜色着色 */
background: sprite(mymod:textures/gui/icon.png, 0, 0, 16, 16, 0, 0, 0, 0, #FF44AAFF);
```

---

## 环绕模式

| 值 | 描述 |
| ----- | ----------- |
| `CLAMP` | 中心区域拉伸以填充可用区域。默认值。 |
| `REPEAT` | 中心区域重复（平铺）。 |
| `MIRRORED_REPEAT` | 中心区域以交替镜像的方式平铺。 |

环绕模式仅适用于九宫格精灵的**中心**区域。角和边缘始终为拉伸。

---

## 字段

| 名称 | 类型 | 描述 |
| ---- | ---- | ----------- |
| `imageLocation` | `ResourceLocation` | PNG 文件的路径。 |
| `spritePosition` | `Position` | 源区域的左上角像素。默认值：`(0, 0)`。 |
| `spriteSize` | `Size` | 源区域的宽 × 高（像素）。`(0, 0)` 表示整张图像。 |
| `borderLT` | `Position` | 左侧 / 顶部九宫格边框（像素）。 |
| `borderRB` | `Position` | 右侧 / 底部九宫格边框（像素）。 |
| `color` | `int` | ARGB 着色颜色。默认值：`0xFFFFFFFF`（无着色）。 |
| `wrapMode` | `WrapMode` | 中心区域环绕模式。默认值：`CLAMP`。 |

---

## 方法

| 方法 | 返回 | 描述 |
| ------ | ------- | ----------- |
| `SpriteTexture.of(String)` | `SpriteTexture` | 通过资源路径字符串的静态工厂方法。 |
| `SpriteTexture.of(ResourceLocation)` | `SpriteTexture` | 通过 `ResourceLocation` 的静态工厂方法。 |
| `setImageLocation(ResourceLocation)` | `SpriteTexture` | 更改源图像（清除大小缓存）。 |
| `setSprite(int x, int y, int w, int h)` | `SpriteTexture` | 设置图像内的精灵区域。 |
| `setBorder(int left, int top, int right, int bottom)` | `SpriteTexture` | 设置每侧的九宫格边框。 |
| `setBorder(int)` | `SpriteTexture` | 将四边边框设为相同值。 |
| `setColor(int)` | `SpriteTexture` | 设置 ARGB 着色颜色。 |
| `setWrapMode(WrapMode)` | `SpriteTexture` | 设置中心区域环绕模式。 |
| `getImageSize()` | `Size` | 返回加载图像的原始大小（仅客户端）。 |
| `copy()` | `SpriteTexture` | 返回深拷贝。 |