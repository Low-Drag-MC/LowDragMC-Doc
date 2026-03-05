# GuiTextureGroup

{{ version_badge("2.2.1", label="Since", icon="tag") }}

`GuiTextureGroup` 按添加顺序自下而上依次绘制多个 `IGuiTexture` 实例。适用于为背景图像叠加图层，或在填充上叠加边框等场景。

注册名：`group_texture`

!!! note ""
    继承自 `TransformTexture` — 支持 `rotate()`、`scale()`、`transform()`。

---

## 用法

=== "Java"

    ```java
    // Layer a sprite background and a coloured border
    IGuiTexture layered = IGuiTexture.group(
        SpriteTexture.of("mymod:textures/gui/bg.png"),
        new ColorBorderTexture(1, 0xFFFFFFFF)
    );

    // Equivalent static factory
    IGuiTexture same = GuiTextureGroup.of(
        SpriteTexture.of("mymod:textures/gui/bg.png"),
        new ColorBorderTexture(1, 0xFFFFFFFF)
    );
    ```

=== "Kotlin"

    ```kotlin
    val layered = IGuiTexture.group(
        SpriteTexture.of("mymod:textures/gui/bg.png"),
        ColorBorderTexture(1, 0xFFFFFFFF.toInt())
       )
    ```

=== "KubeJS"

    ```js
    let layered = IGuiTexture.group(
        SpriteTexture.of("mymod:textures/gui/bg.png"),
        new ColorBorderTexture(1, 0xFFFFFFFF)
    );
    ```

---

## LSS

```css
background: group(
    sprite(mymod:textures/gui/bg.png),
    rect(#FFFFFF22, 2)
);
```

---

## 字段

| 名称 | 类型 | 描述 |
| ---- | ---- | ---- |
| `textures` | `IGuiTexture[]` | 按顺序绘制的纹理（从底部到顶部）。 |

---

## 方法

| 方法 | 返回类型 | 描述 |
| ---- | -------- | ---- |
| `GuiTextureGroup.of(IGuiTexture...)` | `GuiTextureGroup` | 静态工厂方法，等同于 `IGuiTexture.group(...)`。 |
| `setTextures(IGuiTexture...)` | `GuiTextureGroup` | 替换组中的所有纹理。 |
| `setColor(int)` | `GuiTextureGroup` | 复制所有纹理，对每个纹理应用 `setColor(color)`，然后返回新的组。 |
| `copy()` | `GuiTextureGroup` | 返回浅拷贝（纹理为共享引用）。 |