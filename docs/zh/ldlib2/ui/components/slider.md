# Slider

<VersionBadge version="2.2.33" label="Since" icon="tag" />

`Slider` 用于在 `[min, max]` 范围内选择 `float`。它是 [Scroller](scroller.md) 的数值选择对应物：Slider 的手柄长度固定，Scroller 的手柄表示视口大小。已注册两个具体组件：

- **`slider-horizontal`**：水平 Slider，默认高 7 px。
- **`slider-vertical`**：垂直 Slider，默认宽 7 px。

拖动手柄、左键点击轨道或使用鼠标滚轮都会改变值。`Slider` 继承 `BindableUIElement<Float>`，支持普通数据绑定。

<figure>
<img src="/assets/ldlib2/slider.png" alt="真实 LDLib2 UI 中的水平与垂直 Slider">
<figcaption>
客户端实际渲染的水平与垂直 Slider。已填充轨道表示当前值，方块是可拖动手柄。
</figcaption>
</figure>

::: info

本页之外的布局、样式、事件和数据绑定规则见 [UIElement](element.md)。

:::

---

## 使用

<DocTabs>
<DocTab title="Java">

```java
var volume = new Slider.Horizontal()
        .setRange(0f, 100f)
        .setValue(40f)
        .setOnValueChanged(value -> saveVolume(value));
volume.sliderStyle(style -> style.sliderStep(0.05f));
parent.addChild(volume);

var vertical = new Slider.Vertical().setRange(-1f, 1f);
```

</DocTab>
<DocTab title="KubeJS">

```js
let slider = new SliderHorizontal();
slider.setRange(0, 100);
slider.setValue(40);
slider.setOnValueChanged(value => saveVolume(value));
parent.addChild(slider);
```

</DocTab>
</DocTabs>

---

## XML

```xml
<slider-horizontal min-value="0" max-value="100" value="40"/>
<slider-vertical min-value="-1" max-value="1" value="0"/>
```

| XML 属性 | 类型 | 说明 |
| --- | --- | --- |
| `min-value` | `float` | 最小值。默认：`0`。 |
| `max-value` | `float` | 最大值。默认：`1`。 |
| `value` | `float` | 初始值。默认：`0`。 |

---

## 内部结构

| 字段 | CSS class | 说明 |
| --- | --- | --- |
| `trackContainer` | `.__slider_track_container__` | 完整命中区域，接收轨道点击和滚轮事件。 |
| `track` | `.__slider_track__` | 细的背景轨道。 |
| `fill` | `.__slider_fill__` | 从最小值到当前值的填充轨道。 |
| `handle` | `.__slider_handle__` | 固定大小、可拖动的 `Button`。 |

---

## Slider 样式

::: info
#### <p style="font-size: 1rem;">slider-step</p>

单次鼠标滚轮移动的总范围比例。默认：`0.1`。

<DocTabs><DocTab title="Java">

```java
slider.sliderStyle(style -> style.sliderStep(0.05f));
```

</DocTab><DocTab title="LSS">

```css
slider-horizontal { slider-step: 0.05; }
```

</DocTab></DocTabs>

:::

::: info
#### <p style="font-size: 1rem;">slider-track-size</p>

轨道像素厚度。默认：`1`。

<DocTabs><DocTab title="Java">

```java
slider.sliderStyle(style -> style.trackSize(2));
```

</DocTab><DocTab title="LSS">

```css
slider-horizontal { slider-track-size: 2; }
```

</DocTab></DocTabs>

:::

::: info
#### <p style="font-size: 1rem;">slider-handle-size</p>

手柄沿轨道方向的像素长度。默认：`3`。

<DocTabs><DocTab title="Java">

```java
slider.sliderStyle(style -> style.handleSize(6));
```

</DocTab><DocTab title="LSS">

```css
slider-horizontal { slider-handle-size: 6; }
```

</DocTab></DocTabs>

:::

---

## 数据绑定

```java
slider.bind(DataBindingBuilder.floatVal(
        () -> state.getVolume(),
        value -> state.setVolume(value)
).build());
```

同步策略和生命周期规则见 [Data Bindings](../preliminary/data_bindings.md)。

---

## 字段

| 名称 | 类型 | 可见性 | 说明 |
| --- | --- | --- | --- |
| `trackContainer` | `UIElement` | `public final` | 完整 Slider 命中区域。 |
| `track` | `UIElement` | `public final` | 背景轨道。 |
| `fill` | `UIElement` | `public final` | 数值填充轨道。 |
| `handle` | `Button` | `public final` | 可拖动手柄。 |
| `sliderStyle` | `SliderStyle` | `private`（getter） | 当前 Slider 样式。 |
| `minValue` / `maxValue` | `float` | `protected`（getter） | 当前范围端点。 |
| `isDragging` | `boolean` | `protected`（getter） | 拖动手柄时为 `true`。 |

---

## 方法

| 方法 | 返回值 | 说明 |
| --- | --- | --- |
| `setRange(float, float)` | `Slider` | 设置范围并限制当前值。 |
| `setMinValue(float)` / `setMaxValue(float)` | `Slider` | 修改一个范围端点。 |
| `setValue(Float)` | `Slider` | 设置限制后的值并通知监听器。 |
| `setValue(Float, boolean)` | `Slider` | 设置值；传入 `false` 可不通知。 |
| `setNormalizedValue(float)` | `Slider` | 设置归一化 `0..1` 位置。 |
| `getNormalizedValue()` | `float` | 获取归一化位置。 |
| `slideValue(float)` | `void` | 按归一化范围比例移动。 |
| `setOnValueChanged(FloatConsumer)` | `Slider` | 注册值变化监听器。 |
| `sliderStyle(Consumer<SliderStyle>)` | `Slider` | 流式配置样式。 |
| `trackContainer(...)`、`track(...)`、`fill(...)`、`handle(...)` | `Slider` | 配置内部元素。 |
