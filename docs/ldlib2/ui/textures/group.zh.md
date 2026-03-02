# Gui纹理组
{{ version_badge("2.2.1", label="Since", icon="tag") }}
`GuiTextureGroup` 绘制多个 `IGuiTexture` 实例，按照它们添加的顺序堆叠在一起。它对于将背景图像与叠加层组合或在填充上分层边框非常有用。
注册表名称：`group_texture`
!!!笔记 ””扩展`TransformTexture` — 支持`rotate()`、`scale()`、`transform()`。
---

＃＃ 用法
===“Java”
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

===“科特林”
    ```kotlin
    val layered = IGuiTexture.group(
        SpriteTexture.of("mymod:textures/gui/bg.png"),
        ColorBorderTexture(1, 0xFFFFFFFF.toInt())
       )
    ```

===“KubeJS”
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
| Name | Type | Description |
| ---- | ---- | ----------- |
| `textures` | `IGuiTexture[]` | The textures drawn in order (bottom to top). |

---

＃＃ 方法
| Method | Returns | Description |
| ------ | ------- | ----------- |
| `GuiTextureGroup.of(IGuiTexture...)` | `GuiTextureGroup` | Static factory. Equivalent to `IGuiTexture.group(...)`. |
| `setTextures(IGuiTexture...)` | `GuiTextureGroup` | Replaces all textures in the group. |
| `setColor(int)` | `GuiTextureGroup` | Copies all textures, applies `setColor(color)` to each, and returns a new group. |
| `copy()` | `GuiTextureGroup` | Returns a shallow copy (textures are shared). |