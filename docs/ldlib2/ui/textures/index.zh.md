# IGuiTexture

{{ version_badge("2.2.1", label="Since", icon="tag") }}

`IGuiTexture` 是 LDLib2 中所有可绘制纹理的基础接口。每个接受视觉外观的样式属性（如 `background`、`focus-overlay`、`mark-background`）都使用 `IGuiTexture`。

所有已注册的纹理实现都属于 `ldlib2:gui_texture` 注册表，可以进行序列化、在 UI 编辑器中编辑，以及在 LSS 中使用。

---

## 内置常量

| 常量 | 描述 |
| -------- | ----------- |
| `IGuiTexture.EMPTY` | 空操作 — 不绘制任何内容。用于移除纹理而无需传递 `null`。 |
| `IGuiTexture.MISSING_TEXTURE` | 渲染原版缺失纹理的棋盘格图案。当资源无法解析时用作后备。 |

---

## TransformTexture

大多数具体纹理类型继承自抽象类 `TransformTexture`，它将 `Transform2D` 应用于每次绘制调用。所有 `TransformTexture` 子类继承以下流式方法：

| 方法 | 描述 |
| ------ | ----------- |
| `rotate(float degree)` | 围绕纹理中心旋转 `degree` 度。 |
| `scale(float scale)` | 围绕中心均匀缩放。 |
| `scale(float width, float height)` | 在每个轴上独立缩放。 |
| `transform(float xOffset, float yOffset)` | 按给定偏移量（GUI 像素）平移。 |
| `setColor(int argb)` | 为纹理着色。具体效果取决于子类型。 |

=== "Java"

    ```java
    IGuiTexture tex = SpriteTexture.of("mymod:textures/gui/icon.png")
        .rotate(45f)
        .scale(0.8f)
        .setColor(0x80FFFFFF); // 50 % opacity white tint
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

| 方法 | 返回值 | 描述 |
| ------ | ------- | ----------- |
| `setColor(int)` | `IGuiTexture` | 为纹理着色。接口上为空操作；由具体类型重写。 |
| `rotate(float)` | `IGuiTexture` | 旋转纹理。接口上为空操作；由 `TransformTexture` 重写。 |
| `scale(float)` | `IGuiTexture` | 缩放纹理。接口上为空操作；由 `TransformTexture` 重写。 |
| `transform(int, int)` | `IGuiTexture` | 平移纹理。接口上为空操作；由 `TransformTexture` 重写。 |
| `getRawTexture()` | `IGuiTexture` | 返回底层纹理，解包任何代理（如 `DynamicTexture`）。 |
| `copy()` | `IGuiTexture` | 通过编解码器创建深拷贝。 |
| `interpolate(IGuiTexture, float)` | `IGuiTexture` | 将此纹理与另一纹理混合。`lerp = 0` 为当前纹理，`lerp = 1` 为 `other`。原生支持 `ColorRectTexture`、`RectTexture`、`SDFRectTexture` 和 `ColorBorderTexture`。 |

---

## 静态工厂方法

=== "Java"

    ```java
    // Layer multiple textures (drawn in order)
    IGuiTexture layered = IGuiTexture.group(background, overlay);

    // Lazy / dynamic texture resolved every frame
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

## 已注册的纹理类型

| 注册名 | 类 | LSS 函数 | 描述 |
| ------------- | ----- | ------------ | ----------- |
| `color_rect_texture` | [`ColorRectTexture`](color-rect.md) | `color(#RGBA)` 或十六进制字面量 | 纯色填充矩形。 |
| `color_border_texture` | [`ColorBorderTexture`](color-border.md) | `border(size, #RGBA)` | 仅边框矩形（无填充）。 |
| `sdf_rect_texture` | [`SDFRectTexture`](sdf-rect.md) | `rect(color, radius?, stroke?, borderColor?)` | GPU SDF 圆角矩形，可选描边。 |
| `rect_texture` | [`RectTexture`](rect.md) | — | CPU 渲染的圆角矩形（无需着色器）。 |
| `sprite_texture` | [`SpriteTexture`](sprite.md) | `sprite(path, ...)` | PNG 图片，可选九宫格和环绕模式。 |
| `text_texture` | [`TextTexture`](text.md) | — | 渲染文本，支持滚动模式。 |
| `animation_texture` | [`AnimationTexture`](animation.md) | — | 精灵表帧动画。 |
| `item_stack_texture` | [`ItemStackTexture`](item-stack.md) | — | 一个或多个 `ItemStack`，每 20 tick 循环。 |
| `fluid_stack_texture` | [`FluidStackTexture`](fluid-stack.md) | — | 一个或多个流体，每 20 tick 循环。 |
| `group_texture` | [`GuiTextureGroup`](group.md) | `group(...)` | 按顺序绘制的纹理堆栈。 |
| `shader_texture` | [`ShaderTexture`](shader.md) | `shader(location)` | 自定义 GLSL 着色器，自动提供 GUI uniform 变量。 |
| `ui_resource_texture` | [`UIResourceTexture`](ui-resource.md) | `builtin(name)` / `file(...)` | 引用编辑器资源系统中保存的纹理。 |

---

## LSS 参考

纹理作为 LSS 属性的值使用。完整语法（包括 `rect()`、`sprite()`、`group()` 和变换链）请参阅 [LSS 中的纹理](lss.md)。

```css
button {
    background: rect(#3a3a3a, 4);
    hover-background: rect(#4a4a4a, 4, 1, #FFFFFF66);
}
```
