# VanillaSpriteTexture

{{ version_badge("2.2.1", label="自", icon="tag") }}

`VanillaSpriteTexture` 用于渲染已经注册在 Minecraft 原版 GUI 图集中的 sprite。适合绘制配方书 toast 图标，或其他由原版 GUI atlas 提供的界面部件。

与 [`SpriteTexture`](sprite.md) 不同，它**不会**从你的 mod `assets/` 目录加载 PNG 文件。`sprite` 的值必须是原版 GUI 图集中存在的 sprite 标识符。

Sprite 标识符遵循 Minecraft `blitSprite` 的约定：路径相对于 `textures/gui/sprites`，并且不需要写文件扩展名。例如，`minecraft:toast/recipe_book` 指向 `assets/minecraft/textures/gui/sprites/toast/recipe_book.png`。如何注册和配置 GUI sprite，请参考 NeoForge 的 [Screens texture 文档](https://docs.neoforged.net/docs/rendering/screens/#textures)。

注册名：`vanilla_sprite_texture`

!!! note ""
    继承自 `TransformTexture` - 支持 `rotate()`、`scale()`、`transform()` 和颜色着色。

!!! tip ""
    如果要使用自己的图片文件，请使用 [`SpriteTexture`](sprite.md)。如果图片来自 Minecraft 的 GUI 图集，请使用 `VanillaSpriteTexture`。

---

## 用法

=== "Java"

    ```java
    IGuiTexture toastIcon = VanillaSpriteTexture.of("minecraft:toast/recipe_book");

    IGuiTexture tinted = VanillaSpriteTexture.of("minecraft:toast/recipe_book")
        .setColor(0xFFFFAA44);
    ```

=== "Kotlin"

    ```kotlin
    val toastIcon = VanillaSpriteTexture.of("minecraft:toast/recipe_book")

    val tinted = VanillaSpriteTexture.of("minecraft:toast/recipe_book")
        .setColor(0xFFFFAA44.toInt())
    ```

=== "KubeJS"

    ```js
    let toastIcon = VanillaSpriteTexture.of("minecraft:toast/recipe_book");

    let tinted = VanillaSpriteTexture.of("minecraft:toast/recipe_book")
        .setColor(0xFFFFAA44);
    ```

---

## LSS

```css
/* 原版 GUI 图集 sprite */
background: vanilla-sprite(minecraft:toast/recipe_book);

/* 带变换链 */
background: vanilla-sprite(minecraft:toast/recipe_book) scale(0.8) rotate(15);

/* 带颜色着色 */
background: vanilla-sprite(minecraft:toast/recipe_book) color(#FFFFAA44);
```

---

## 字段

| 名称 | 类型 | 描述 |
| ---- | ---- | ----------- |
| `sprite` | `Identifier` | Minecraft GUI 图集中 sprite 的标识符。默认值：`minecraft:toast/recipe_book`。 |
| `color` | `int` | ARGB 颜色着色。默认值：`0xFFFFFFFF`（不着色）。 |

---

## 方法

| 方法 | 返回 | 描述 |
| ------ | ------- | ----------- |
| `VanillaSpriteTexture.of(String)` | `VanillaSpriteTexture` | 使用资源路径字符串创建。 |
| `VanillaSpriteTexture.of(Identifier)` | `VanillaSpriteTexture` | 使用 `Identifier` 创建。 |
| `setSprite(Identifier)` | `VanillaSpriteTexture` | 修改使用的原版 GUI atlas sprite。 |
| `setColor(int)` | `VanillaSpriteTexture` | 设置 ARGB 着色颜色。 |
| `copy()` | `VanillaSpriteTexture` | 返回深拷贝。 |
