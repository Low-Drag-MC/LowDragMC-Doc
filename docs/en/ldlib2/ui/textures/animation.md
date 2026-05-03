# AnimationTexture

{{ version_badge("2.2.1", label="Since", icon="tag") }}

`AnimationTexture` plays a frame animation from a **uniform sprite sheet** — a PNG image arranged as a grid of equal-sized cells. The animation advances at a configurable speed and loops between a `from` and `to` frame index.

Registry name: `animation_texture`

!!! note ""
    Extends `TransformTexture` — supports `rotate()`, `scale()`, `transform()`.

---

## Usage

=== "Java"

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

## How the Grid Works

The sprite sheet is divided into `cellSize × cellSize` equal-sized cells arranged left-to-right, top-to-bottom. Frame `n` is at column `n % cellSize`, row `n / cellSize`.

For example, with `cellSize = 8`:
- Frame `0` → column 0, row 0
- Frame `7` → column 7, row 0
- Frame `8` → column 0, row 1

---

## Fields

| Name | Type | Description |
| ---- | ---- | ----------- |
| `imageLocation` | `ResourceLocation` | Path to the sprite sheet PNG. |
| `cellSize` | `int` | Number of cells per row/column. The sheet is `cellSize × cellSize` cells. |
| `from` | `int` | First frame index (inclusive). |
| `to` | `int` | Last frame index (inclusive). |
| `animation` | `int` | Game ticks to display each frame before advancing. |
| `color` | `int` | ARGB tint colour. Default: `-1` (white). |

---

## Methods

| Method | Returns | Description |
| ------ | ------- | ----------- |
| `setTexture(String)` | `AnimationTexture` | Changes the sprite sheet image. |
| `setCellSize(int)` | `AnimationTexture` | Sets the grid dimension (cells per row/column). |
| `setAnimation(int from, int to)` | `AnimationTexture` | Sets the frame range and resets to the first frame. |
| `setAnimation(int animation)` | `AnimationTexture` | Sets the ticks-per-frame speed. |
| `setColor(int)` | `AnimationTexture` | Sets the ARGB tint colour. |
| `copy()` | `AnimationTexture` | Returns a deep copy. |