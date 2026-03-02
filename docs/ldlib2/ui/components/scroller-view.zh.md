# 滚动视图
{{ version_badge("2.2.1", label="Since", icon="tag") }}
`ScrollerView` 是一个可滚动的容器。它将`viewContainer`包装在`viewPort`内，并提供可选的水平和垂直滚动条，当内容溢出时自动出现。在代码或 XML 中添加到 `ScrollerView` 的子级将放置在 `viewContainer` 内。
!!!笔记 ””[UIElement](../element.md){ data-preview } 上记录的所有内容（布局、样式、事件、数据绑定等）也适用于此处。
---

＃＃ 用法
===“Java”
    ```java
    var sv = new ScrollerView();
    sv.scrollerStyle(style -> style.mode(ScrollerMode.VERTICAL));
    for (int i = 0; i < 20; i++) {
        sv.addScrollViewChild(new Label().setText("Item " + i, false));
    }
    parent.addChild(sv);
    ```

===“科特林”
    ```kotlin
    scrollerView({ scrollerViewStyle { mode(ScrollerMode.VERTICAL) } }) {
        for (i in 0 until 20) {
            label { api { setText("Item $i", false) } }
        }
    }
    ```

===“KubeJS”
    ```js
    let sv = new ScrollerView();
    sv.scrollerStyle(style => style.mode(ScrollerMode.VERTICAL));
    for (let i = 0; i < 20; i++) {
        sv.addScrollViewChild(new Label().setText("Item " + i, false));
    }
    parent.addChild(sv);
    ```

---

## XML
```xml
<scroller-view>
    <label>Item 1</label>
    <label>Item 2</label>
    <label>Item 3</label>
</scroller-view>
```

直接 XML 子级放置在 `viewContainer` 内。
---

## 内部结构
| CSS class | Description |
| --------- | ----------- |
| `.__scroller_view_vertical-container__` | Row flex container holding `viewPort` and the vertical scroller. |
| `.__scroller_view_view-port__` | Clipping viewport with default 5 px padding and border texture. |
| `.__scroller_view_view-container__` | The actual content container where children are placed. |
| `.__scroller_view_vertical-scroller__` | Vertical scroll bar (right side). |
| `.__scroller_view_horizontal-scroller__` | Horizontal scroll bar (bottom). |

---

## ScrollerView 样式
!!!信息“”#### <p style="font-size: 1rem;">滚动视图模式</p>
启用了哪些滚动轴。值：`HORIZONTAL`、`VERTICAL`、`BOTH`。
默认值：`BOTH`
===“Java”
        ```java
        sv.scrollerStyle(style -> style.mode(ScrollerMode.VERTICAL));
        ```

===“LSS”
        ```css
        scroller-view {
            scroller-view-mode: VERTICAL;
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">滚动条垂直显示 / 滚动条水平显示</p>
每个滚动条的可见性策略。取值：`AUTO`（仅当内容溢出时显示）、`ALWAYS`、`NEVER`。
默认值：`AUTO`
===“Java”
        ```java
        sv.scrollerStyle(style -> style
            .verticalScrollDisplay(ScrollDisplay.ALWAYS)
            .horizontalScrollDisplay(ScrollDisplay.NEVER)
        );
        ```

===“LSS”
        ```css
        scroller-view {
            scroller-vertical-display: ALWAYS;
            scroller-horizontal-display: NEVER;
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">滚动视图边距</p>
当垂直滚动条也可见时，为水平滚动条保留右边距。
默认值：`5`
===“LSS”
        ```css
        scroller-view {
            scroller-view-margin: 5;
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">自适应宽度/自适应高度</p>
启用后，`ScrollerView` 会调整自身大小以匹配内容容器的计算宽度或高度。
默认值：`false`
===“Java”
        ```java
        sv.scrollerStyle(style -> style.adaptiveHeight(true));
        ```

===“LSS”
        ```css
        scroller-view {
            adaptive-height: true;
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">最小滚动/最大滚动</p>
限制滚动条滑块每次滚动事件移动的距离（以像素为单位）。
默认值：`5` / `7`
===“Java”
        ```java
        sv.scrollerStyle(style -> style.minScrollPixel(0f).maxScrollPixel(20f));
        ```

===“LSS”
        ```css
        scroller-view {
            min-scroll: 0;
            max-scroll: 20;
        }
        ```

---

## 字段
| Name | Type | Access | Description |
| ---- | ---- | ------ | ----------- |
| `viewContainer` | `UIElement` | `public final` | Container holding all added children. |
| `viewPort` | `UIElement` | `public final` | Clipping region (has border texture and padding). |
| `verticalContainer` | `UIElement` | `public final` | Row flex container wrapping `viewPort` and `verticalScroller`. |
| `horizontalScroller` | `Scroller.Horizontal` | `public final` | Horizontal scroll bar. |
| `verticalScroller` | `Scroller.Vertical` | `public final` | Vertical scroll bar. |

---

＃＃ 方法
| Method | Returns | Description |
| ------ | ------- | ----------- |
| `addScrollViewChild(UIElement)` | `ScrollerView` | Adds a child to `viewContainer`. |
| `addScrollViewChildAt(UIElement, int)` | `ScrollerView` | Inserts a child at a specific index in `viewContainer`. |
| `addScrollViewChildren(UIElement...)` | `ScrollerView` | Adds multiple children to `viewContainer`. |
| `removeScrollViewChild(UIElement)` | `boolean` | Removes a child from `viewContainer`. |
| `clearAllScrollViewChildren()` | `void` | Removes all children from `viewContainer`. |
| `hasScrollViewChild(UIElement)` | `boolean` | Returns `true` if the element is a child of `viewContainer`. |
| `getContainerWidth()` | `float` | Computed content width (includes overflowing children). |
| `getContainerHeight()` | `float` | Computed content height (includes overflowing children). |
| `scrollerStyle(Consumer<ScrollerViewStyle>)` | `ScrollerView` | Configures the style fluently. |
| `viewContainer(Consumer<UIElement>)` | `ScrollerView` | Configures `viewContainer`. |
| `viewPort(Consumer<UIElement>)` | `ScrollerView` | Configures `viewPort`. |
| `verticalContainer(Consumer<UIElement>)` | `ScrollerView` | Configures `verticalContainer`. |
| `horizontalScroller(Consumer<Scroller>)` | `ScrollerView` | Configures the horizontal scroll bar. |
| `verticalScroller(Consumer<Scroller>)` | `ScrollerView` | Configures the vertical scroll bar. |
