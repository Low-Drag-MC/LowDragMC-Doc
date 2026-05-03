# ColorSelector

{{ version_badge("2.2.1", label="Since", icon="tag") }}

`ColorSelector` is a full-featured HSB (Hue–Saturation–Brightness) color picker. It extends `BindableUIElement<Integer>` and its value is the selected color as a packed ARGB integer. It includes:

- An HSB gradient picking surface that can switch between hue, saturation, and brightness axes.
- A hue/alpha slider.
- RGB and hex text fields for direct input.
- A color preview swatch.
- Clipboard copy support.

!!! note ""
    Everything documented on [UIElement](element.md){ data-preview } (layout, styles, events, data bindings, etc.) applies here too.

---

## Usage

=== "Java"

    ```java
    var picker = new ColorSelector();
    picker.setValue(0xFF4080FF, false); // initial ARGB color
    picker.registerValueListener(color -> System.out.printf("Color: #%08X%n", color));
    parent.addChild(picker);
    ```

=== "Kotlin"

    ```kotlin
    colorSelector({
        color(0xFF4080FF.toInt())
        onChange { color -> println("Color: ${color.toString(16)}") }
    }) { }
    ```

=== "KubeJS"

    ```js
    let picker = new ColorSelector();
    picker.setValue(0xFF4080FF, false);
    picker.registerValueListener(color => { /* use color */ });
    parent.addChild(picker);
    ```

---

## Internal Structure

| Field | Description |
| ----- | ----------- |
| `pickerContainer` | Container holding the main HSB gradient surface. |
| `colorPreview` | Swatch showing the currently selected color. |
| `colorSlider` | Slider for the primary HSB axis (hue, saturation, or brightness). |
| `alphaSlider` | Slider for the alpha (transparency) channel. |
| `hsbButton` | Button that cycles between H, S, and B pick modes. |
| `textContainer` | Container for the RGB and hex text field inputs. |
| `hexConfigurator` | Text input for entering hex color codes. |

---

## Value Binding

`ColorSelector` extends `BindableUIElement<Integer>`:

=== "Java"

    ```java
    picker.bind(DataBindingBuilder.intVal(
        () -> config.getColor(),
        color -> config.setColor(color)
    ).build());
    ```

See [Data Bindings](../preliminary/data_bindings.md){ data-preview } for full details.

---

## Fields

| Name | Type | Access | Description |
| ---- | ---- | ------ | ----------- |
| `pickerContainer` | `UIElement` | `public final` | HSB gradient canvas. |
| `colorPreview` | `UIElement` | `public final` | Color preview swatch. |
| `colorSlider` | `UIElement` | `public final` | Primary HSB axis slider. |
| `alphaSlider` | `UIElement` | `public final` | Alpha channel slider. |
| `hsbButton` | `Button` | `public final` | Cycles the active HSB pick mode (H → S → B → H). |
| `textContainer` | `UIElement` | `public final` | Container for text inputs. |
| `hexConfigurator` | `StringConfigurator` | `public final` | Hex color input field. |

---

## Methods

| Method | Returns | Description |
| ------ | ------- | ----------- |
| `setValue(Integer, boolean)` | `ColorSelector` | Sets the ARGB color value; second param controls notification. |
| `getValue()` | `Integer` | Returns the current ARGB color. |
| `registerValueListener(Consumer<Integer>)` | `void` | Registers a listener called whenever the color changes. |
