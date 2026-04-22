# GuiTextureGroup

{{ version_badge("2.2.1", label="自", icon="tag") }}

`GuiTextureGroup` 按照添加的顺序将多个 `IGuiTexture` 实例堆叠绘制。它适用于将背景图像与覆盖层组合，或在填充层上叠加边框。

注册名：`group_texture`

!!! note ""
    继承自 `TransformTexture` — 支持 `rotate()`、`scale()`、`transform()`。

---

## 用法

=== "Java"

    ```java
    // 将精灵背景与彩色边框分层叠加
    IGuiTexture layered = IGuiTexture.group(
        SpriteTexture.of("mymod:textures/gui/bg.png"),
        new ColorBorderTexture(1, 0xFFFFFFFF)
    );

    // 等效的静态工厂方法
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
| `textures` | `IGuiTexture[]` | 按顺序绘制的纹理（从下到上）。 |

---

## 方法

| 方法 | 返回 | 描述 |
| ------ | ------- | ----------- |
| `GuiTextureGroup.of(IGuiTexture...)` | `GuiTextureGroup` | 静态工厂。等效于 `IGuiTexture.group(...)`。 |
| `setTextures(IGuiTexture...)` | `GuiTextureGroup` | 替换组内的所有纹理。 |
| `setColor(int)` | `GuiTextureGroup` | 复制所有纹理，对每个纹理应用 `setColor(color)`，并返回一个新组。 |
| `copy()` | `GuiTextureGroup` | 返回浅拷贝（纹理共享）。 |
