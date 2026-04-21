# 布局

{{ version_badge("2.1.0", label="Since", icon="tag") }}

!!! info inline end
    Grid 布局支持将在未来引入 Yoga。

LDLib2 UI 布局构建于 [Yoga 布局引擎](https://www.yogalayout.dev/docs/about-yoga) 之上。

> **Yoga** 是一个可嵌入的布局系统，被 React Native 等流行 UI 框架所使用。  
> 它**不是** UI 框架，也不执行任何渲染。  
> 它的唯一职责是计算元素的**大小和位置**。

LDLib2 采用 **FlexBox 布局模型**，让你能够以灵活且可预期的方式描述复杂的 UI 结构。

---

## 设置布局属性

每个 `UIElement` 都拥有一个由 Yoga 支持的布局对象。  
你可以通过多种方式配置布局属性，具体取决于你的偏好和使用场景。

除了下面的示例外，布局属性还可以通过 [LSS（LDLib Style Sheet）](./stylesheet.md){ data-preview } 定义，这对于将布局逻辑与 UI 结构分离尤其有用。

=== "Java"

    ```java
    var element = new UIElement();

    // 直接设置布局
    element.getLayout()
            .flexDirection(YogaFlexDirection.ROW)
            .width(150)
            .heightPercent(100)
            .marginAll(10)
            .paddingAll(10);

    // 使用链式 lambda 设置布局
    element.layout(layout -> layout
            .flexDirection(YogaFlexDirection.ROW)
            .width(150)
            .heightPercent(100)
            .marginAll(10)
            .paddingAll(10)
    );

    // 通过样式表 (LSS) 设置布局
    element.lss("flex-direction", "row");
    element.lss("width", 150);
    element.lss("height-percent", 100);
    element.lss("margin-all", 10);
    element.lss("padding-all", 10);
    ```

=== "KubeJS"

    ```js
    let element = new UIElement();

    // 直接设置布局
    element.getLayout()
            .flexDirection(YogaFlexDirection.ROW)
            .width(150)
            .heightPercent(100)
            .marginAll(10)
            .paddingAll(10);

    // 使用链式 lambda 设置布局
    element.layout(layout -> layout
            .flexDirection(YogaFlexDirection.ROW)
            .width(150)
            .heightPercent(100)
            .marginAll(10)
            .paddingAll(10)
    );

    // 通过样式表 (LSS) 设置布局
    element.lss("flex-direction", "row");
    element.lss("width", 150);
    element.lss("height-percent", 100);
    element.lss("margin-all", 10);
    element.lss("padding-all", 10);
    ```

---

## 学习 Flex 布局

!!! info
    如果你已经熟悉 Flexbox，Yoga 布局应该会让你感到非常直观。  
    如果不熟悉，我们建议阅读官方的 [Yoga 文档](https://www.yogalayout.dev/docs/about-yoga) 以获取完整说明。

    作为更轻量的入门，本章重点介绍 **LDLib2 UI 中最常用的 Flex 概念**。


## UI 元素和层级

在 LDLib2 UI 中，界面由 **UI 元素**（`UIElement`）组成。

- UI 元素代表一个视觉容器，例如面板、按钮、文本框或图像。
- UI 元素可以包含其他 UI 元素，形成 **UI 层级**（也称为*布局树*）。

复杂的界面通过将多个 UI 元素组合成嵌套层级来构建，并在不同级别应用布局和样式规则。

```mermaid
flowchart LR
  R([UIElement])

  R --- A([UIElement])
  A --- A1([Label])
  A --- A2([Toggle])
  A --- A3([Slider])

  R --- B([UIElement])
  B --- B1([Label])
  B --- B2([Toggle])

  linkStyle 0,1,2,3,4,5,6 stroke:#9aa3ab,stroke-width:2px,stroke-dasharray:6 4;
```

---

## 定位 UI 元素

在设计 UI 布局时，将每个屏幕视为一组水平或垂直排列的矩形容器。

将布局分解为逻辑部分，然后使用子容器细化每个部分以组织内容。

---

## 定位模式

Yoga 支持两种主要的定位模式：

### 相对定位（默认）

元素参与其父容器的 Flexbox 布局。

- 子元素根据父元素的 **Flex Direction** 进行排列
- 元素大小和位置动态响应：
    - 父布局规则（padding、alignment、spacing）
    - 元素自身的大小约束（width、height、min/max size）

如果布局约束冲突，布局引擎会自动解决它们。  
例如，比容器更宽的元素可能会溢出。

### 绝对定位

元素相对于其父容器定位，但**不参与 Flexbox 布局计算**。

- Flex 属性（如 Grow、Shrink 或 alignment）被忽略
- 元素可能与其他内容重叠
- 位置通过 `Top`、`Right`、`Bottom` 和 `Left` 等偏移量控制

<figure markdown="span">
  ![alt text](../assets/relative.png)
  <br>
  ![alt text](../assets/absolute.png)
  <figcaption>上方蓝色的 UI 元素采用 Relative 定位，父元素使用 Flex Direction: Row 作为 Flex 设置。下方蓝色的 UI 元素采用 Absolute 定位，并忽略父元素的 Flexbox 规则。</figcaption>
</figure>

---

## 尺寸设置

UI 元素默认是容器。

- 没有明确的尺寸规则时，元素可能会扩展以填充可用空间，或收缩为其内容的大小
- `Width` 和 `Height` 定义元素的基础大小
- `Min` 和 `Max` 值限制元素可以增长或收缩的程度
- 如果设置了 `Aspect Rate`，一个维度将由另一个维度决定
- `Overflow` 控制元素内容的裁剪。默认值为 `visible`，意味着元素内容不会被裁剪到元素的边界内。如果将 overflow 设置为 hidden，元素内容将被裁剪到元素的内容边界内。
- 尺寸可以用像素或百分比表示

这些尺寸规则与 Flexbox 设置交互以确定最终布局。


<figure markdown="span">
  ![size](../assets/size.png)
  <br>
  ![size](../assets/overflow.png)
  <figcaption>UI 元素的尺寸设置。</figcaption>
</figure>

---

## Flex 设置

Flex 设置影响使用 Relative 定位时元素如何增长或收缩。建议你亲自实验元素以了解它们的行为。

### Flex Basis

定义元素在应用 Grow 或 Shrink 之前的初始大小。

### Flex Grow

- `Flex Grow > 0` 允许元素扩展并占据可用空间
- 更高的值获得更大的空闲空间份额
- `Flex Grow = 0` 阻止超出基础大小的扩展


### Flex Shrink

- `Flex Shrink > 0` 允许元素在空间受限时收缩
- `Flex Shrink = 0` 阻止收缩，可能导致溢出

> 具有固定像素大小的元素不会响应 Grow 或 Shrink。

<figure markdown="span">
    ![size](../assets/flex.png)
    <figcaption>Basis、Grow 和 Shrink 设置。</figcaption>
</figure>

上面的示例展示了 Basis 如何与 Grow 和 Shrink 选项配合工作：

1. 绿色元素的 Basis 为 80%，占据 80% 的可用空间。
2. 将 Grow 设置为 1 允许绿色元素扩展到整个空间。
3. 添加黄色元素后，元素溢出空间。绿色元素恢复到占据 80% 的空间。
4. Shrink 设置为 1 使绿色元素收缩以适应黄色元素。

在这里，两个元素的 Shrink 值都为 1。它们同等收缩以适应可用空间。

### Flex

`Flex = 1` 等同于 `Flex Grow = 1` 和 `Flex Shrink = 1`，用于同时设置 `Flex Grow` 和 `Flex Shrink`。

<figure markdown="span">
    ![size](../assets/flex2.png)
    <figcaption>
    在此示例中，我们假设根容器 `width: 200px`。  
    最右侧的元素设置 `width: 50%`。因此，剩余空间为 100px，供最左侧和中间元素使用。根据它们的 `flex`，它们以 `2:1` 的比例分配剩余空间。  
    </figcaption>
</figure>

---

### 💡 元素尺寸如何计算

使用 Relative 定位时，布局引擎按以下顺序确定元素大小：

1. 根据 `Width` 和 `Height` 计算基础大小
2. 检查父容器是否有额外空间或溢出
3. 使用 `Flex Grow` 分配额外空间
4. 如果空间不足，使用 `Flex Shrink` 减小大小
5. 应用诸如 `Min/Max` size 和 `Flex Basis` 之类的约束
6. 应用最终解析的大小

---

### Flex Direction 和 Flex Wrapping

- `Flex Direction` 控制子元素是按行还是按列排列
- `Flex Wrap` 控制元素是保持在单行上还是换行到额外的行或列

子元素遵循 UI 层级中定义的顺序。

<figure markdown="span">
    ![size](../assets/flex_direction_wrap.png)
    <figcaption>
    使用 Relative 定位以及不同的 Direction 和 Wrap 组合的父元素和子 UI 元素。
    </figcaption>
</figure>

---

## 对齐

对齐设置控制子元素在容器内的位置。

### Align Items

沿交叉轴（垂直于 Flex Direction）对齐元素：

### Justify Content

沿主轴控制间距：

Flex Grow 和 Shrink 值影响空间的分配方式。

### Align Self

允许单个元素覆盖父元素的对齐规则。

### Align Content

控制 flex 元素的**多行或多列**如何沿**交叉轴**对齐。

!!! note
    `Align Content` 仅在以下情况生效：
    
    - 容器允许换行（`flex-wrap: wrap`）
    - 存在**多行**子元素


<figure markdown="span">
    ![size](../assets/align_justify.png)
    <figcaption>
    Align 和 Justify 设置应用于 Direction 设置为 Row 的父元素；请注意，其他位置和尺寸选项可能会影响最终输出。
    </figcaption>
</figure>

---

## Margin 和 Padding

LDLib2 UI 遵循类似 CSS 的盒模型：

- **Content**：元素的实际内容
- **Padding**：内容和边框之间的空间
- **Border**：元素周围的可选边界，（避免使用）。
- **Margin**：元素外部的空间，将其与其他元素分隔开

<figure markdown="span">
    ![size](../assets/margin_padding.png)
    <figcaption>
    具有定义的 Size、Margin、Border 和 Padding 设置的 UI 元素；具有固定 Width 或 Height 的元素可能会溢出空间。
    </figcaption>
</figure>
