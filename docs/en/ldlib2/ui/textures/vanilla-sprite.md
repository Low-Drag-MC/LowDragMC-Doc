# VanillaSpriteTexture

<VersionBadge version="2.2.1" label="Since" icon="tag" />

`VanillaSpriteTexture` renders a sprite that is already registered in Minecraft's vanilla GUI atlas. Use it when you want to draw a vanilla UI sprite such as the recipe-book toast icon or other atlas-backed GUI parts.

Unlike [`SpriteTexture`](sprite.md), this texture does **not** load a PNG file from your mod's `assets/` directory. The `sprite` value must be the identifier of a sprite available in the vanilla GUI atlas.

Sprite identifiers follow Minecraft's `blitSprite` convention: they are relative to `textures/gui/sprites` and do not include the file extension. For example, `minecraft:toast/recipe_book` points to `assets/minecraft/textures/gui/sprites/toast/recipe_book.png`. To register and configure GUI sprites, see the NeoForge [Screens texture documentation](https://docs.neoforged.net/docs/rendering/screens/#textures).

Registry name: `vanilla_sprite_texture`

::: info
Extends `TransformTexture` - supports `rotate()`, `scale()`, `transform()`, and color tinting.
:::

::: tip
Use [`SpriteTexture`](sprite.md) for your own image files. Use `VanillaSpriteTexture` when the image is provided by Minecraft's GUI atlas.
:::

---

## Usage

<DocTabs>
<DocTab title="Java">

```java
IGuiTexture toastIcon = VanillaSpriteTexture.of("minecraft:toast/recipe_book");

IGuiTexture tinted = VanillaSpriteTexture.of("minecraft:toast/recipe_book")
    .setColor(0xFFFFAA44);
```

</DocTab>
<DocTab title="Kotlin">

```kotlin
val toastIcon = VanillaSpriteTexture.of("minecraft:toast/recipe_book")

val tinted = VanillaSpriteTexture.of("minecraft:toast/recipe_book")
    .setColor(0xFFFFAA44.toInt())
```

</DocTab>
<DocTab title="KubeJS">

```js
let toastIcon = VanillaSpriteTexture.of("minecraft:toast/recipe_book");

let tinted = VanillaSpriteTexture.of("minecraft:toast/recipe_book")
    .setColor(0xFFFFAA44);
```

</DocTab>
</DocTabs>

---

## LSS

```css
/* Vanilla GUI atlas sprite */
background: vanilla-sprite(minecraft:toast/recipe_book);

/* With transform chain */
background: vanilla-sprite(minecraft:toast/recipe_book) scale(0.8) rotate(15);

/* With color tint */
background: vanilla-sprite(minecraft:toast/recipe_book) color(#FFFFAA44);
```

---

## Fields

| Name | Type | Description |
| ---- | ---- | ----------- |
| `sprite` | `Identifier` | Identifier of the sprite in Minecraft's GUI atlas. Default: `minecraft:toast/recipe_book`. |
| `color` | `int` | ARGB color tint. Default: `0xFFFFFFFF` (no tint). |

---

## Methods

| Method | Returns | Description |
| ------ | ------- | ----------- |
| `VanillaSpriteTexture.of(String)` | `VanillaSpriteTexture` | Static factory from a resource-location string. |
| `VanillaSpriteTexture.of(Identifier)` | `VanillaSpriteTexture` | Static factory from an `Identifier`. |
| `setSprite(Identifier)` | `VanillaSpriteTexture` | Changes the vanilla GUI atlas sprite. |
| `setColor(int)` | `VanillaSpriteTexture` | Sets the ARGB tint color. |
| `copy()` | `VanillaSpriteTexture` | Returns a deep copy. |
