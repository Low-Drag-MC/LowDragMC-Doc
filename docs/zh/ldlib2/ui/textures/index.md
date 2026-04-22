# IGuiTexture

{{ version_badge("2.2.1", label="自", icon="tag") }}

`IGuiTexture` 是 LDLib2 中所有可绘制 Texture 的基接口。所有接受视觉外观的样式属性（例如 `background`、`focus-overlay`、`mark-background`）都使用 `IGuiTexture`。

所有已注册的 Texture 实现都属于 `ldlib2:gui_texture` 注册表，可以被序列化、在 UI 编辑器中编辑，并在 LSS 中使用。

---

## 内置常量

| 常量 | 描述 |
| -------- | ----------- |
| `IGuiTexture.EMPTY` | 无操作 — 不绘制任何内容。使用此值可在不传递 `null` 的情况下移除 Texture。 |
| `IGuiTexture.MISSING_TEXTURE` | 渲染原版缺失 Texture 的棋盘格图案。当资源无法解析时作为后备使用。 |

---

## TransformTexture

大多数具体的 Texture 类型都继承自抽象类 `TransformTexture`，它包装了一个 `Transform2D` 并在每次绘制调用时应用。所有 `TransformTexture` 的子类都继承以下流式方法：

| 方法 | 描述 |
| ------ | ----------- |
| `rotate(float degree)` | 绕 Texture 中心旋转 `degree` 度。 |
| `scale(float scale)` | 绕中心均匀缩放。 |
| `scale(float width, float height)` | 在每个轴上独立缩放。 |
| `transform(float xOffset, float yOffset)` | 按给定的 GUI 像素偏移量平移。 |
| `setColor(int argb)` | 为 Texture 着色。具体效果取决于子类型。 |

=== "Java"

    ```java
    IGuiTexture tex = SpriteTexture.of("mymod:textures/gui/icon.png")
        .rotate(45f)
        .scale(0.8f)
        .setColor(0x80FFFFFF); // 50% 不透明度白色着色
    ```

=== "Kotlin"

    ```kotlin
    val tex = SpriteTexture.of("mymod:textures/gui/icon.png")
        .rotate(45f)
        .scale(0.8f)
        .setColor(0x80FFFFFF.toInt())
    ```

=== "KubeJS"

    ```js
    let tex = SpriteTexture.of("mymod:textures/gui/icon.png")
        .rotate(45)
        .scale(0.8)
        .setColor(0x80FFFFFF);
    ```

---

## 接口方法

| 方法 | 返回 | 描述 |
| ------ | ------- | ----------- |
| `setColor(int)` | `IGuiTexture` | 为 Texture 着色。在接口上无操作；由具体类型重写。 |
| `rotate(float)` | `IGuiTexture` | 旋转 Texture。在接口上无操作；由 `TransformTexture` 重写。 |
| `scale(float)` | `IGuiTexture` | 缩放 Texture。在接口上无操作；由 `TransformTexture` 重写。 |
| `transform(int, int)` | `IGuiTexture` | 平移 Texture。在接口上无操作；由 `TransformTexture` 重写。 |
| `getRawTexture()` | `IGuiTexture` | 返回底层 Texture，解包任何代理（例如 `DynamicTexture`）。 |
| `copy()` | `IGuiTexture` | 通过编解码器创建深拷贝。 |
| `interpolate(IGuiTexture, float)` | `IGuiTexture` | 将此 Texture 与另一个混合。`lerp = 0` 为此 Texture，`lerp = 1` 为另一个。`ColorRectTexture`、`RectTexture`、`SDFRectTexture` 和 `ColorBorderTexture` 原生支持。 |

---

## 静态工厂辅助方法

=== "Java"

    ```java
    // 多层叠加 Texture（按顺序绘制）
    IGuiTexture layered = IGuiTexture.group(background, overlay);

    // 懒加载 / 动态 Texture，每帧解析
    IGuiTexture dynamic = IGuiTexture.dynamic(() -> currentTexture);
    ```

=== "Kotlin"

    ```kotlin
    val layered = IGuiTexture.group(background, overlay)
    val dynamic = IGuiTexture.dynamic { currentTexture }
    ```

=== "KubeJS"

    ```js
    let layered = IGuiTexture.group(background, overlay);
    let dynamic = IGuiTexture.dynamic(() => currentTexture);
    ```

---

## 已注册的 Texture 类型

| 注册名 | 类 | LSS 函数 | 描述 |
| ------------- | ----- | ------------ | ----------- |
| `color_rect_texture` | [`ColorRectTexture`](color-rect.md) | `color(#RGBA)` 或十六进制字面量 | 纯色填充矩形。 |
| `color_border_texture` | [`ColorBorderTexture`](color-border.md) | `border(size, #RGBA)` | 仅边框矩形（无填充）。 |
| `sdf_rect_texture` | [`SDFRectTexture`](sdf-rect.md) | `rect(color, radius?, stroke?, borderColor?)` | GPU SDF 圆角矩形，可选描边。 |
| `rect_texture` | [`RectTexture`](rect.md) | — | CPU 渲染圆角矩形（无需 Shader）。 |
| `sprite_texture` | [`SpriteTexture`](sprite.md) | `sprite(path, ...)` | PNG 图像，可选 9-slice 和环绕模式。 |
| `text_texture` | [`TextTexture`](text.md) | — | 渲染文本，支持滚动模式。 |
| `animation_texture` | [`AnimationTexture`](animation.md) | — | 精灵表帧动画。 |
| `item_stack_texture` | [`ItemStackTexture`](item-stack.md) | — | 一个或多个 `ItemStack`，每 20 tick 循环。 |
| `fluid_stack_texture` | [`FluidStackTexture`](fluid-stack.md) | — | 一种或多种流体，每 20 tick 循环。 |
| `group_texture` | [`GuiTextureGroup`](group.md) | `group(...)` | 一起绘制的有序 Texture 堆叠。 |
| `shader_texture` | [`ShaderTexture`](shader.md) | `shader(location)` | 自定义 GLSL Shader，自动提供 GUI Uniform。 |
| `ui_resource_texture` | [`UIResourceTexture`](ui-resource.md) | `builtin(name)` / `file(...)` | 引用保存在编辑器资源系统中的 Texture。 |

---

## LSS 参考

Texture 在 LSS 属性中作为值使用。有关完整语法，包括 `rect()`、`sprite()`、`group()` 和变换链，请参见 [LSS 中的 Texture](lss.md)。

```css
button {
    background: rect(#3a3a3a, 4);
    hover-background: rect(#4a4a4a, 4, 1, #FFFFFF66);
}
```
