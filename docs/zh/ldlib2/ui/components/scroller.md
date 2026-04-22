# Scroller

{{ version_badge("2.2.1", label="自", icon="tag") }}

`Scroller` 是一个在 `[min, max]` 范围内保存数值的滚动条控件。注册了两个具体的变体：

- **`scroller-vertical`** — 一个细长的垂直条（默认宽 5 像素）。
- **`scroller-horizontal`** — 一个细长的水平条（默认高 5 像素）。

两者都包含一个 `head` 按钮（向上/向左滚动）、一个 `tail` 按钮（向下/向右滚动）、一个可拖拽的 `scrollBar` 滑块，以及一个 `scrollContainer` 轨道。点击轨道会跳转到点击位置。滚动鼠标滚轮也会改变数值。

`Scroller` 主要用作 [`ScrollerView`](scroller-view.md){ data-preview } 和 [`TextArea`](text-area.md){ data-preview } 内部的**内部组件**，但也可以独立使用。

!!! note ""
    在 [UIElement](element.md){ data-preview } 中记录的所有内容（布局、样式、事件、数据绑定等）同样适用于此处。

---

## 用法

=== "Java"

    ```java
    // Vertical scroll bar
    var scroller = new Scroller.Vertical();
    scroller.setRange(0, 100f);
    scroller.setValue(50f);
    scroller.setOnValueChanged(value -> System.out.println("Scroll: " + value));
    parent.addChild(scroller);

    // Horizontal scroll bar
    var hScroller = new Scroller.Horizontal();
    hScroller.setRange(0, 1f);
    ```

=== "Kotlin"

    ```kotlin
    scrollerVertical({
        layout { height(100) }
    }) {
        api {
            setRange(0f, 100f)
            setOnValueChanged { v -> println("Scroll: $v") }
        }
    }
    ```

=== "KubeJS"

    ```js
    let scroller = new ScrollerVertical();
    scroller.setRange(0, 100);
    scroller.setValue(50);
    parent.addChild(scroller);
    ```

---

## XML

```xml
<!-- 垂直滚动条，范围 0–100 -->
<scroller-vertical min-value="0" max-value="100" value="0"/>

<!-- 水平滚动条 -->
<scroller-horizontal min-value="0" max-value="1" value="0.5"/>
```

| XML 属性 | 类型 | 描述 |
| -------- | ---- | ---- |
| `min-value` | `float` | 最小值。默认值：`0`。 |
| `max-value` | `float` | 最大值。默认值：`1`。 |
| `value` | `float` | 初始值。默认值：`0`。 |

---

## 内部结构

| 字段 | CSS 类 | 描述 |
| ---- | ------ | ---- |
| `headButton` | `.__scroller_head_button__` | 向上/向左箭头按钮。 |
| `tailButton` | `.__scroller_tail_button__` | 向下/向右箭头按钮。 |
| `scrollContainer` | `.__scroller_scroll_container__` | 轨道背景。 |
| `scrollBar` | `.__scroller_scroll_bar__` | 可拖拽的滑块按钮。 |

---

## Scroller 样式

!!! info ""
    #### <p style="font-size: 1rem;">scroll-delta</p>

    每次点击 head/tail 按钮或鼠标滚轮滚动时移动的总范围比例。

    默认值：`0.1`（10%）

    === "Java"

        ```java
        scroller.scrollerStyle(style -> style.scrollDelta(0.05f));
        ```

    === "LSS"

        ```css
        scroller-vertical {
            scroll-delta: 0.05;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">scroll-bar-size</p>

    拖拽滑块大小占轨道长度的百分比。100 表示滑块填满整个轨道。

    默认值：`20`（%）

    === "Java"

        ```java
        scroller.setScrollBarSize(30f);
        // or:
        scroller.scrollerStyle(style -> style.scrollBarSize(30f));
        ```

    === "LSS"

        ```css
        scroller-vertical {
            scroll-bar-size: 30;
        }
        ```

---

## 值绑定

`Scroller` 继承自 `BindableUIElement<Float>`，因此支持数据绑定：

=== "Java"

    ```java
    scroller.bind(DataBindingBuilder.floatVal(
        () -> state.getScrollPosition(),
        v -> state.setScrollPosition(v)
    ).build());
    ```

---

## 字段

| 名称 | 类型 | 访问权限 | 描述 |
| ---- | ---- | -------- | ---- |
| `headButton` | `Button` | `public final` | 向上/向左箭头按钮。 |
| `tailButton` | `Button` | `public final` | 向下/向右箭头按钮。 |
| `scrollContainer` | `UIElement` | `public final` | 轨道元素。 |
| `scrollBar` | `Button` | `public final` | 可拖拽的滑块。 |
| `scrollerStyle` | `ScrollerStyle` | `private` (getter) | 当前样式。 |
| `minValue` | `float` | `private` (getter) | 范围最小值。 |
| `maxValue` | `float` | `private` (getter) | 范围最大值。 |
| `isDragging` | `boolean` | `private` (getter) | 当滑块正在被拖拽时为 `true`。 |

---

## 方法

| 方法 | 返回值 | 描述 |
| ---- | ------ | ---- |
| `setRange(float, float)` | `Scroller` | 设置 `[min, max]` 并限制当前值。 |
| `setMinValue(float)` | `Scroller` | 设置最小值。 |
| `setMaxValue(float)` | `Scroller` | 设置最大值。 |
| `setValue(Float)` | `Scroller` | 设置当前值（限制在范围内）。 |
| `setOnValueChanged(FloatConsumer)` | `Scroller` | 注册值变化监听器。 |
| `setScrollBarSize(float)` | `Scroller` | 设置滚动条滑块大小（0–100%）。 |
| `scrollerStyle(Consumer<ScrollerStyle>)` | `Scroller` | 以流式方式配置样式。 |
| `getNormalizedValue()` | `float` | 返回归一化到 `[0, 1]` 的当前值。 |
| `headButton(Consumer<Button>)` | `Scroller` | 配置头部箭头按钮。 |
| `tailButton(Consumer<Button>)` | `Scroller` | 配置尾部箭头按钮。 |
| `scrollContainer(Consumer<UIElement>)` | `Scroller` | 配置轨道元素。 |
| `scrollBar(Consumer<Button>)` | `Scroller` | 配置拖拽滑块按钮。 |
