# SliderWidget
Added v1.0.48
<br>

来自 SliderWidget 测试的 Widget。<br>
![来自 SliderWidget 测试的 Widget](../assets/slider.png){ width="30%" align=right }


`SliderWidget` 是一个简单的 GUI 滑块，类似于 Minecraft 选项菜单中的滑块。它支持水平和垂直模式，并且可以拥有任意数量的步进。

---

## 特性

- **方向模式** – 水平或垂直模式。
- **事件处理** – 当滑块移动时触发回调。
- **步进大小** – 滑块拥有的步进数量。0 = 滑块的长度，设置超过长度的值可以实现 GUI 子像素级别的滑块。

---

## 属性

| 字段            | 类型            | 描述                                                                                                      |
|-----------------|-----------------|:----------------------------------------------------------------------------------------------------------|
| `sliderValue`   | `Float`         | 滑块的位置值，0 - 1。                                                                                     |
| `valueStep`     | `Integer`       | 滑块拥有的步进数量。0 = 滑块的长度，设置超过长度的值可以实现 GUI 子像素级别的滑块。                        |
| `leftUpKey`     | `Char/Integer`  | 用于根据模式向左或向上移动滑块的键的整数值。                                                               |
| `rightDownKey`  | `Char/Integer`  | 同上，但用于向右和向下。                                                                                   |
| `handleSize`    | `Integer`       | 滑块手柄的大小（以像素为单位）。                                                                           |
| `minAmount`     | `Float`         | 滑块的最小值，仅用于代码。                                                                                 |
| `minAmount`     | `Float`         | 同上，但为最大值。                                                                                         |

---

## API

### setSliderCallback

设置变更回调。<br>
示例将文本覆盖层设置为以百分比显示数值。

=== "Java"

    ```Java
    sliderWidget.setSliderCallback(value -> {
        if(sliderWidget.getOverlay() instanceof TextTexture) {
            ((TextTexture) sliderWidget.getOverlay()).updateText(((int) (value * 100)) + "%%");
        }
    });
    ```

=== "KubeJS"

    ```Javascript
    sliderWidget.setSliderCallback(value => {
        if(sliderWidget.getOverlay() typeof TextTexture) {
            ((TextTexture) sliderWidget.getOverlay()).updateText(((int) (value * 100)) + "%%");
        }
    });
    ```

### getAmount

返回从 minAmount 到 maxAmount 的 lerp 浮点值。<br>
示例，`minAmount = 5`，`maxAmount = 10`，`sliderValue = 0.5f`，则 .getAmount() 返回 `0.75f`


=== "Java"

    ```Java
    value = sliderWidget.getAmount();
    ```

=== "KubeJS"

    ```Javascript
    value = sliderWidget.getAmount();
    ```

---

### setAmount

使用 minAmount 和 maxAmount 将 sliderValue 设置为 inverseLerp<br>
示例，`minAmount = 5`，`maxAmount = 10`，`sliderValue = 0.5f`，则 .getAmount() 返回 `0.75f`


=== "Java"

    ```Java
    sliderWidget.setAmount(0.5f);
    ```

=== "KubeJS"

    ```Javascript
    sliderWidget.setAmount(0.5f);
    ```

---
