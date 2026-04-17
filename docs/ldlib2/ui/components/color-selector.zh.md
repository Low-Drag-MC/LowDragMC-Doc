# ColorSelector

{{ version_badge("2.2.1", label="Since", icon="tag") }}

`ColorSelector` 是一个功能完善的 HSB（色相–饱和度–亮度）颜色选择器。它继承自 `BindableUIElement<Integer>`，其值为所选颜色的 ARGB 压缩整数。包含以下功能：

- HSB 渐变拾色面板，可在色相、饱和度和亮度轴之间切换。
- 色相/透明度滑块。
- RGB 和十六进制文本输入框，支持直接输入。
- 颜色预览色块。
- 剪贴板复制支持。

!!! note ""
    [UIElement](../element.md){ data-preview } 中记录的所有内容（布局、样式、事件、数据绑定等）同样适用于此组件。

---

## 用法

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

## 内部结构

| 字段 | 描述 |
| ----- | ----------- |
| `pickerContainer` | 承载主 HSB 渐变面板的容器。 |
| `colorPreview` | 显示当前所选颜色的预览色块。 |
| `colorSlider` | 主 HSB 轴（色相、饱和度或亮度）的滑块。 |
| `alphaSlider` | 透明度通道滑块。 |
| `hsbButton` | 在 H、S、B 拾色模式之间循环切换的按钮。 |
| `textContainer` | RGB 和十六进制文本输入框的容器。 |
| `hexConfigurator` | 用于输入十六进制颜色代码的文本输入框。 |

---

## 值绑定

`ColorSelector` 继承自 `BindableUIElement<Integer>`：

=== "Java"

    ```java
    picker.bind(DataBindingBuilder.intVal(
        () -> config.getColor(),
        color -> config.setColor(color)
    ).build());
    ```

详见 [数据绑定](../data_bindings.md){ data-preview }。

---

## 字段

| 名称 | 类型 | 访问修饰 | 描述 |
| ---- | ---- | ------ | ----------- |
| `pickerContainer` | `UIElement` | `public final` | HSB 渐变画布。 |
| `colorPreview` | `UIElement` | `public final` | 颜色预览色块。 |
| `colorSlider` | `UIElement` | `public final` | 主 HSB 轴滑块。 |
| `alphaSlider` | `UIElement` | `public final` | 透明度通道滑块。 |
| `hsbButton` | `Button` | `public final` | 循环切换 HSB 拾色模式（H → S → B → H）。 |
| `textContainer` | `UIElement` | `public final` | 文本输入框容器。 |
| `hexConfigurator` | `StringConfigurator` | `public final` | 十六进制颜色输入框。 |

---

## 方法

| 方法 | 返回值 | 描述 |
| ------ | ------- | ----------- |
| `setValue(Integer, boolean)` | `ColorSelector` | 设置 ARGB 颜色值；第二个参数控制是否触发通知。 |
| `getValue()` | `Integer` | 返回当前 ARGB 颜色值。 |
| `registerValueListener(Consumer<Integer>)` | `void` | 注册颜色变化时调用的监听器。 |
