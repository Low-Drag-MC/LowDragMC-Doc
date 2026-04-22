# AnimationTexture

{{ version_badge("2.2.1", label="自", icon="tag") }}

`AnimationTexture` 可以从一张**均等的精灵表**中播放逐帧动画——这是一张被划分为等大小单元格的 PNG 图像。动画以可配置的速度推进，并在 `from` 和 `to` 帧索引之间循环播放。

注册名：`animation_texture`

!!! note ""
    继承自 `TransformTexture` —— 支持 `rotate()`、`scale()`、`transform()`。

---

## 用法

=== "Java"

    ```java
    // 8×8 网格，每个单元格 8 像素，帧 32–44，每 1 tick 推进一帧
    IGuiTexture anim = new AnimationTexture("mymod:textures/gui/particles.png")
        .setCellSize(8)
        .setAnimation(32, 44)   // 从第 32 帧到第 44 帧
        .setAnimation(1);       // 每帧 1 tick

    // 带颜色叠加的动画
    IGuiTexture tinted = new AnimationTexture("mymod:textures/gui/glow.png")
        .setCellSize(4)
        .setAnimation(0, 15)
        .setAnimation(2)
        .setColor(0xFF44AAFF);
    ```

=== "Kotlin"

    ```kotlin
    val anim = AnimationTexture("mymod:textures/gui/particles.png")
        .setCellSize(8)
        .setAnimation(32, 44)
        .setAnimation(1)
    ```

=== "KubeJS"

    ```js
    let anim = new AnimationTexture("mymod:textures/gui/particles.png")
        .setCellSize(8)
        .setAnimation(32, 44)
        .setAnimation(1);
    ```

---

## 网格的工作原理

精灵表被划分为 `cellSize × cellSize` 个等大小的单元格，按从左到右、从上到下的顺序排列。第 `n` 帧位于第 `n % cellSize` 列，第 `n / cellSize` 行。

例如，当 `cellSize = 8` 时：
- 第 `0` 帧 → 第 0 列，第 0 行
- 第 `7` 帧 → 第 7 列，第 0 行
- 第 `8` 帧 → 第 0 列，第 1 行

---

## 字段

| 名称 | 类型 | 描述 |
| ---- | ---- | ---- |
| `imageLocation` | `ResourceLocation` | 精灵表 PNG 的路径。 |
| `cellSize` | `int` | 每行/列的单元格数量。整张表为 `cellSize × cellSize` 个单元格。 |
| `from` | `int` | 起始帧索引（包含）。 |
| `to` | `int` | 结束帧索引（包含）。 |
| `animation` | `int` | 每帧显示的 tick 数，之后推进到下一帧。 |
| `color` | `int` | ARGB 着色颜色。默认值：`-1`（白色）。 |

---

## 方法

| 方法 | 返回 | 描述 |
| ---- | ---- | ---- |
| `setTexture(String)` | `AnimationTexture` | 更改精灵表图像。 |
| `setCellSize(int)` | `AnimationTexture` | 设置网格尺寸（每行/列的单元格数）。 |
| `setAnimation(int from, int to)` | `AnimationTexture` | 设置帧范围，并重置到第一帧。 |
| `setAnimation(int animation)` | `AnimationTexture` | 设置每帧 tick 数（速度）。 |
| `setColor(int)` | `AnimationTexture` | 设置 ARGB 着色颜色。 |
| `copy()` | `AnimationTexture` | 返回深拷贝。 |
