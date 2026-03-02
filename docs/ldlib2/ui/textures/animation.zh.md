# 动画纹理
{{ version_badge("2.2.1", label="Since", icon="tag") }}
`AnimationTexture` 从**均匀的精灵表**播放帧动画 - 排列为大小相等的单元格的 PNG 图像。动画以可配置的速度前进并在`from` 和`to` 帧索引之间循环。
注册表名称：`animation_texture`
!!!笔记 ””扩展`TransformTexture` — 支持`rotate()`、`scale()`、`transform()`。
---

＃＃ 用法
===“Java”
    ```java
    // 8×8 grid of 8 px cells, frames 32–44, advance every 1 tick
    IGuiTexture anim = new AnimationTexture("mymod:textures/gui/particles.png")
        .setCellSize(8)
        .setAnimation(32, 44)   // from frame 32 to frame 44
        .setAnimation(1);       // 1 tick per frame

    // Tinted animation
    IGuiTexture tinted = new AnimationTexture("mymod:textures/gui/glow.png")
        .setCellSize(4)
        .setAnimation(0, 15)
        .setAnimation(2)
        .setColor(0xFF44AAFF);
    ```

===“科特林”
    ```kotlin
    val anim = AnimationTexture("mymod:textures/gui/particles.png")
        .setCellSize(8)
        .setAnimation(32, 44)
        .setAnimation(1)
    ```

===“KubeJS”
    ```js
    let anim = new AnimationTexture("mymod:textures/gui/particles.png")
        .setCellSize(8)
        .setAnimation(32, 44)
        .setAnimation(1);
    ```

---

## 网格如何工作
精灵表被分成`cellSize × cellSize` 大小相等的单元，从左到右、从上到下排列。帧`n` 位于`n % cellSize` 列`n / cellSize` 行。
例如，使用 `cellSize = 8`：- 帧 `0` → 第 0 列，第 0 行- 帧 `7` → 第 7 列，第 0 行- 帧 `8` → 第 0 列，第 1 行
---

## 字段
| Name | Type | Description |
| ---- | ---- | ----------- |
| `imageLocation` | `ResourceLocation` | Path to the sprite sheet PNG. |
| `cellSize` | `int` | Number of cells per row/column. The sheet is `cellSize × cellSize` cells. |
| `from` | `int` | First frame index (inclusive). |
| `to` | `int` | Last frame index (inclusive). |
| `animation` | `int` | Game ticks to display each frame before advancing. |
| `color` | `int` | ARGB tint colour. Default: `-1` (white). |

---

＃＃ 方法
| Method | Returns | Description |
| ------ | ------- | ----------- |
| `setTexture(String)` | `AnimationTexture` | Changes the sprite sheet image. |
| `setCellSize(int)` | `AnimationTexture` | Sets the grid dimension (cells per row/column). |
| `setAnimation(int from, int to)` | `AnimationTexture` | Sets the frame range and resets to the first frame. |
| `setAnimation(int animation)` | `AnimationTexture` | Sets the ticks-per-frame speed. |
| `setColor(int)` | `AnimationTexture` | Sets the ARGB tint colour. |
| `copy()` | `AnimationTexture` | Returns a deep copy. |