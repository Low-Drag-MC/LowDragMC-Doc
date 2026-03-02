# 颜色选择器
{{ version_badge("2.2.1", label="Since", icon="tag") }}
`ColorSelector` 是一个全功能的 HSB（色调-饱和度-亮度）颜色选择器。它扩展`BindableUIElement<Integer>`，其值是选定的颜色（作为压缩的 ARGB 整数）。它包括：
- 可以在色调、饱和度和亮度轴之间切换的 HSB 渐变拾取表面。- 色相/Alpha 滑块。- 用于直接输入的 RGB 和十六进制文本字段。- 颜色预览样本。- 剪贴板复制支持。
!!!笔记 ””[UIElement](../element.md){ data-preview } 上记录的所有内容（布局、样式、事件、数据绑定等）也适用于此处。
---

＃＃ 用法
===“Java”
    ```java
    var picker = new ColorSelector();
    picker.setValue(0xFF4080FF, false); // initial ARGB color
    picker.registerValueListener(color -> System.out.printf("Color: #%08X%n", color));
    parent.addChild(picker);
    ```

===“科特林”
    ```kotlin
    colorSelector({
        color(0xFF4080FF.toInt())
        onChange { color -> println("Color: ${color.toString(16)}") }
    }) { }
    ```

===“KubeJS”
    ```js
    let picker = new ColorSelector();
    picker.setValue(0xFF4080FF, false);
    picker.registerValueListener(color => { /* use color */ });
    parent.addChild(picker);
    ```

---

## 内部结构
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

## 值绑定
`ColorSelector` 扩展`BindableUIElement<Integer>`：
===“Java”
    ```java
    picker.bind(DataBindingBuilder.intVal(
        () -> config.getColor(),
        color -> config.setColor(color)
    ).build());
    ```

有关完整详细信息，请参阅[Data Bindings](../data_bindings.md){ data-preview }。
---

## 字段
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

＃＃ 方法
| Method | Returns | Description |
| ------ | ------- | ----------- |
| `setValue(Integer, boolean)` | `ColorSelector` | Sets the ARGB color value; second param controls notification. |
| `getValue()` | `Integer` | Returns the current ARGB color. |
| `registerValueListener(Consumer<Integer>)` | `void` | Registers a listener called whenever the color changes. |
