# ScrollerView

{{ version_badge("2.2.1", label="Since", icon="tag") }}

`ScrollerView` 是一个可滚动容器。它将 `viewContainer` 包裹在 `viewPort` 内，并提供可选的水平和垂直滚动条，当内容溢出时自动显示。通过代码或 XML 添加到 `ScrollerView` 的子元素会被放置在 `viewContainer` 中。

!!! note ""
    [UIElement](../element.md){ data-preview } 中记录的所有内容（布局、样式、事件、数据绑定等）同样适用于此组件。

---

## 使用方法

=== "Java"

    ```java
    var sv = new ScrollerView();
    sv.scrollerStyle(style -> style.mode(ScrollerMode.VERTICAL));
    for (int i = 0; i < 20; i++) {
        sv.addScrollViewChild(new Label().setText("Item " + i, false));
    }
    parent.addChild(sv);
    ```

=== "Kotlin"

    ```kotlin
    scrollerView({ scrollerViewStyle { mode(ScrollerMode.VERTICAL) } }) {
        for (i in 0 until 20) {
            label { api { setText("Item $i", false) } }
        }
    }
    ```

=== "KubeJS"

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

直接在 XML 中添加的子元素会被放置在 `viewContainer` 内。

---

## 内部结构

| CSS 类名 | 描述 |
| --------- | ----------- |
| `.__scroller_view_vertical-container__` | 包含 `viewPort` 和垂直滚动条的行 flex 容器。 |
| `.__scroller_view_view-port__` | 裁剪视口，默认有 5 px 内边距和边框纹理。 |
| `.__scroller_view_view-container__` | 实际的内容容器，子元素放置于此。 |
| `.__scroller_view_vertical-scroller__` | 垂直滚动条（右侧）。 |
| `.__scroller_view_horizontal-scroller__` | 水平滚动条（底部）。 |

---

## ScrollerView 样式

!!! info ""
    #### <p style="font-size: 1rem;">scroller-view-mode</p>

    启用的滚动轴方向。可选值：`HORIZONTAL`、`VERTICAL`、`BOTH`。

    默认值：`BOTH`

    === "Java"

        ```java
        sv.scrollerStyle(style -> style.mode(ScrollerMode.VERTICAL));
        ```

    === "LSS"

        ```css
        scroller-view {
            scroller-view-mode: VERTICAL;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">scroller-vertical-display / scroller-horizontal-display</p>

    每个滚动条的可见策略。可选值：`AUTO`（仅在内容溢出时显示）、`ALWAYS`、`NEVER`。

    默认值：`AUTO`

    === "Java"

        ```java
        sv.scrollerStyle(style -> style
            .verticalScrollDisplay(ScrollDisplay.ALWAYS)
            .horizontalScrollDisplay(ScrollDisplay.NEVER)
        );
        ```

    === "LSS"

        ```css
        scroller-view {
            scroller-vertical-display: ALWAYS;
            scroller-horizontal-display: NEVER;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">scroller-view-margin</p>

    当垂直滚动条可见时，水平滚动条的右边距。

    默认值：`5`

    === "LSS"

        ```css
        scroller-view {
            scroller-view-margin: 5;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">adaptive-width / adaptive-height</p>

    启用后，`ScrollerView` 会根据内容容器计算出的宽度或高度自动调整自身尺寸。

    默认值：`false`

    === "Java"

        ```java
        sv.scrollerStyle(style -> style.adaptiveHeight(true));
        ```

    === "LSS"

        ```css
        scroller-view {
            adaptive-height: true;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">min-scroll / max-scroll</p>

    每次滚动事件中滚动条滑块移动距离的最小/最大像素限制。

    默认值：`5` / `7`

    === "Java"

        ```java
        sv.scrollerStyle(style -> style.minScrollPixel(0f).maxScrollPixel(20f));
        ```

    === "LSS"

        ```css
        scroller-view {
            min-scroll: 0;
            max-scroll: 20;
        }
        ```

---

## 字段

| 名称 | 类型 | 访问权限 | 描述 |
| ---- | ---- | ------ | ----------- |
| `viewContainer` | `UIElement` | `public final` | 存放所有已添加子元素的容器。 |
| `viewPort` | `UIElement` | `public final` | 裁剪区域（带有边框纹理和内边距）。 |
| `verticalContainer` | `UIElement` | `public final` | 包裹 `viewPort` 和 `verticalScroller` 的行 flex 容器。 |
| `horizontalScroller` | `Scroller.Horizontal` | `public final` | 水平滚动条。 |
| `verticalScroller` | `Scroller.Vertical` | `public final` | 垂直滚动条。 |

---

## 方法

| 方法 | 返回值 | 描述 |
| ------ | ------- | ----------- |
| `addScrollViewChild(UIElement)` | `ScrollerView` | 向 `viewContainer` 添加子元素。 |
| `addScrollViewChildAt(UIElement, int)` | `ScrollerView` | 在 `viewContainer` 的指定索引处插入子元素。 |
| `addScrollViewChildren(UIElement...)` | `ScrollerView` | 向 `viewContainer` 添加多个子元素。 |
| `removeScrollViewChild(UIElement)` | `boolean` | 从 `viewContainer` 移除子元素。 |
| `clearAllScrollViewChildren()` | `void` | 移除 `viewContainer` 中的所有子元素。 |
| `hasScrollViewChild(UIElement)` | `boolean` | 如果元素是 `viewContainer` 的子元素则返回 `true`。 |
| `getContainerWidth()` | `float` | 计算出的内容宽度（包括溢出的子元素）。 |
| `getContainerHeight()` | `float` | 计算出的内容高度（包括溢出的子元素）。 |
| `scrollerStyle(Consumer<ScrollerViewStyle>)` | `ScrollerView` | 以流式方式配置样式。 |
| `viewContainer(Consumer<UIElement>)` | `ScrollerView` | 配置 `viewContainer`。 |
| `viewPort(Consumer<UIElement>)` | `ScrollerView` | 配置 `viewPort`。 |
| `verticalContainer(Consumer<UIElement>)` | `ScrollerView` | 配置 `verticalContainer`。 |
| `horizontalScroller(Consumer<Scroller>)` | `ScrollerView` | 配置水平滚动条。 |
| `verticalScroller(Consumer<Scroller>)` | `ScrollerView` | 配置垂直滚动条。 |
