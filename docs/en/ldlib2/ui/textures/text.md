# TextTexture

{{ version_badge("2.2.1", label="Since", icon="tag") }}

`TextTexture` renders a translated string as a GUI texture. It supports multiple display modes (centred, left-aligned, scrolling, hidden-until-hover), word-wrapping, a background colour, and an optional live-update supplier.

Registry name: `text_texture`

!!! note ""
    Extends `TransformTexture` — supports `rotate()`, `scale()`, `transform()`.

---

## Usage

=== "Java"

    ```java
    // Static centred text
    IGuiTexture label = new TextTexture("Hello World");

    // Left-aligned, coloured, with shadow
    IGuiTexture info = new TextTexture("Info", 0xFFFFDD44)
        .setType(TextTexture.TextType.LEFT)
        .setDropShadow(true);

    // Scrolling text, word-wrap at 80 px
    IGuiTexture scroll = new TextTexture("Long description that scrolls…")
        .setType(TextTexture.TextType.ROLL_ALWAYS)
        .setWidth(80)
        .setRollSpeed(1.5f);

    // Dynamic — updates every game tick
    IGuiTexture dynamic = new TextTexture(() -> "Ticks: " + level.getGameTime());
    ```

=== "Kotlin"

    ```kotlin
    val label = TextTexture("Hello World")

    val scroll = TextTexture("Long description…")
        .setType(TextTexture.TextType.ROLL_ALWAYS)
        .setWidth(80)
    ```

=== "KubeJS"

    ```js
    let label = new TextTexture("Hello World");

    let dynamic = new TextTexture(() => "Ticks: " + level.getGameTime());
    ```

---

## Text Types

| Type | Alignment | Overflow behaviour |
| ---- | --------- | ------------------ |
| `NORMAL` | Centre | All lines shown stacked. |
| `LEFT` | Left | All lines shown stacked. |
| `RIGHT` | Right | All lines shown stacked. |
| `HIDE` | Centre | First line shown; full text scrolls when hovered. |
| `LEFT_HIDE` | Left | First line shown; full text scrolls when hovered. |
| `ROLL` | Centre | First line shown; scrolls when hovered and text overflows. |
| `LEFT_ROLL` | Left | First line shown; scrolls when hovered. |
| `ROLL_ALWAYS` | Centre | Always scrolls regardless of hover. |
| `LEFT_ROLL_ALWAYS` | Left | Always scrolls regardless of hover. |

---

## Fields

| Name | Type | Description |
| ---- | ---- | ----------- |
| `text` | `String` | The displayed string (translated via `LocalizationUtils`). |
| `color` | `int` | Text colour (ARGB). Default: `-1` (white). |
| `backgroundColor` | `int` | Background fill colour. `0` = none. |
| `width` | `int` | Maximum line width for word-wrapping in pixels. |
| `rollSpeed` | `float` | Scroll speed for rolling modes. Default: `1.0`. |
| `dropShadow` | `boolean` | Whether to draw a drop shadow. Default: `false` (constructor with `String` sets it to `true`). |
| `type` | `TextType` | Display mode. Default: `NORMAL`. |
| `supplier` | `Supplier<String>` (nullable) | When set, `text` is updated every game tick from this supplier. |

---

## Methods

| Method | Returns | Description |
| ------ | ------- | ----------- |
| `setColor(int)` | `TextTexture` | Sets the text colour. |
| `setBackgroundColor(int)` | `TextTexture` | Sets the background fill colour. |
| `setDropShadow(boolean)` | `TextTexture` | Enables or disables drop shadow. |
| `setWidth(int)` | `TextTexture` | Sets the word-wrap width and reflows lines. |
| `setType(TextType)` | `TextTexture` | Sets the display mode. |
| `setRollSpeed(float)` | `TextTexture` | Sets the scroll speed for rolling modes. |
| `setSupplier(Supplier<String>)` | `TextTexture` | Registers a live text supplier updated each tick. |
| `updateText(String)` | `void` | Immediately updates the text and reflows lines. |
| `copy()` | `TextTexture` | Returns a deep copy. |