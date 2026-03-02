# 滚轴
{{ version_badge("2.2.1", label="Since", icon="tag") }}
`Scroller` 是一个滚动条控件，它保存 `[min, max]` 范围内的值。注册了两个具体变体：
- **`scroller-vertical`** — 细垂直条（默认宽 5 px）。- **`scroller-horizontal`** — 细水平条（默认高 5 px）。
两者都公开一个`head`按钮（向上/向左滚动）、一个`tail`按钮（向下/向右滚动）、一个拖动手柄`scrollBar`和一个`scrollContainer`轨道。单击轨道会将值跳转到单击的位置。滚动鼠标滚轮也会更改该值。
`Scroller` 主要用作 [`ScrollerView`](scroller-view.md){ data-preview } 和 [`TextArea`](text-area.md){ data-preview } 内的**内部组件**，但它也可以独立使用。
!!!笔记 ””[UIElement](../element.md){ data-preview } 上记录的所有内容（布局、样式、事件、数据绑定等）也适用于此处。
---

＃＃ 用法
===“Java”
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

===“科特林”
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

===“KubeJS”
    ```js
    let scroller = new ScrollerVertical();
    scroller.setRange(0, 100);
    scroller.setValue(50);
    parent.addChild(scroller);
    ```

---

## XML
```xml
<!-- Vertical scroller, range 0–100 -->
<scroller-vertical min-value="0" max-value="100" value="0"/>

<!-- Horizontal scroller -->
<scroller-horizontal min-value="0" max-value="1" value="0.5"/>
```

| XML Attribute | Type | Description |
| ------------- | ---- | ----------- |
| `min-value` | `float` | Minimum value. Default: `0`. |
| `max-value` | `float` | Maximum value. Default: `1`. |
| `value` | `float` | Initial value. Default: `0`. |

---

## 内部结构
| Field | CSS class | Description |
| ----- | --------- | ----------- |
| `headButton` | `.__scroller_head_button__` | Up/left arrow button. |
| `tailButton` | `.__scroller_tail_button__` | Down/right arrow button. |
| `scrollContainer` | `.__scroller_scroll_container__` | Track background. |
| `scrollBar` | `.__scroller_scroll_bar__` | Draggable thumb button. |

---

## 滚动样式
!!!信息“”#### <p style="font-size: 1rem;">滚动增量</p>
每次头/尾按钮单击或鼠标滚轮刻度移动的总范围的分数。
默认值：`0.1` (10 %)
===“Java”
        ```java
        scroller.scrollerStyle(style -> style.scrollDelta(0.05f));
        ```

===“LSS”
        ```css
        scroller-vertical {
            scroll-delta: 0.05;
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">滚动条大小</p>
拖动手柄的大小占轨道长度的百分比。 100 表示手柄填满整个轨道。
默认值：`20` (%)
===“Java”
        ```java
        scroller.setScrollBarSize(30f);
        // or:
        scroller.scrollerStyle(style -> style.scrollBarSize(30f));
        ```

===“LSS”
        ```css
        scroller-vertical {
            scroll-bar-size: 30;
        }
        ```

---

## 值绑定
`Scroller` 扩展了`BindableUIElement<Float>`，因此它支持数据绑定：
===“Java”
    ```java
    scroller.bind(DataBindingBuilder.floatVal(
        () -> state.getScrollPosition(),
        v -> state.setScrollPosition(v)
    ).build());
    ```

---

## 字段
| Name | Type | Access | Description |
| ---- | ---- | ------ | ----------- |
| `headButton` | `Button` | `public final` | Up / left arrow button. |
| `tailButton` | `Button` | `public final` | Down / right arrow button. |
| `scrollContainer` | `UIElement` | `public final` | The track element. |
| `scrollBar` | `Button` | `public final` | The draggable thumb. |
| `scrollerStyle` | `ScrollerStyle` | `private` (getter) | Current style. |
| `minValue` | `float` | `private` (getter) | Minimum of the range. |
| `maxValue` | `float` | `private` (getter) | Maximum of the range. |
| `isDragging` | `boolean` | `private` (getter) | `true` while the thumb is being dragged. |

---

＃＃ 方法
| Method | Returns | Description |
| ------ | ------- | ----------- |
| `setRange(float, float)` | `Scroller` | Sets `[min, max]` and clamps current value. |
| `setMinValue(float)` | `Scroller` | Sets the minimum value. |
| `setMaxValue(float)` | `Scroller` | Sets the maximum value. |
| `setValue(Float)` | `Scroller` | Sets the current value (clamped to range). |
| `setOnValueChanged(FloatConsumer)` | `Scroller` | Registers a listener for value changes. |
| `setScrollBarSize(float)` | `Scroller` | Sets the scroll bar thumb size (0–100 %). |
| `scrollerStyle(Consumer<ScrollerStyle>)` | `Scroller` | Configures style fluently. |
| `getNormalizedValue()` | `float` | Returns the current value normalized to `[0, 1]`. |
| `headButton(Consumer<Button>)` | `Scroller` | Configures the head arrow button. |
| `tailButton(Consumer<Button>)` | `Scroller` | Configures the tail arrow button. |
| `scrollContainer(Consumer<UIElement>)` | `Scroller` | Configures the track element. |
| `scrollBar(Consumer<Button>)` | `Scroller` | Configures the drag handle button. |
