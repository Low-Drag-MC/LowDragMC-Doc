# 图形视图
{{ version_badge("2.2.1", label="Since", icon="tag") }}
`GraphView` 是一个可平移、可缩放的画布，用于显示节点图或任何任意 2D 内容。子元素被放置在可以平移和缩放的`contentRoot` 元素上。该视图呈现重复的网格背景并支持：
- **平移** — 单击并拖动（在视图背景上使用左键，或在任意位置使用中键）。- **缩放** — 鼠标滚轮，固定在`[min-scale, max-scale]`。- **适合** - 帮助器居中和缩放视图以适合所有子项或给定的边界框。
!!!笔记 ””[UIElement](../element.md){ data-preview } 上记录的所有内容（布局、样式、事件、数据绑定等）也适用于此处。
---

＃＃ 用法
===“Java”
    ```java
    var graph = new GraphView();
    graph.graphViewStyle(style -> style
        .allowZoom(true)
        .allowPan(true)
        .minScale(0.2f)
        .maxScale(5f)
    );

    var node = new UIElement();
    graph.addContentChild(node);
    parent.addChild(graph);

    // Fit the view after adding children:
    graph.fitToChildren(20f, 0.1f);
    ```

===“科特林”
    ```kotlin
    graphView({
        graphViewStyle = {
            allowZoom(true)
            minScale(0.2f)
            maxScale(5f)
        }
    }) {
        content(myNodeElement)
    }
    ```

===“KubeJS”
    ```js
    let graph = new GraphView();
    graph.graphViewStyle(style => {
        style.allowZoom(true);
        style.minScale(0.2);
    });
    graph.addContentChild(myNode);
    parent.addChild(graph);
    ```

---

## 内部结构
| Field | CSS class | Description |
| ----- | --------- | ----------- |
| `contentRoot` | `.__graph-view_content-root__` | Absolutely-positioned element that holds all user-added children and receives the pan/zoom transform. |

---

## GraphView 样式
!!!信息“”#### <p style="font-size: 1rem;">允许缩放</p>
滚动鼠标滚轮是否会更改缩放级别。
默认值：`true`
===“Java”
        ```java
        graph.graphViewStyle(style -> style.allowZoom(false));
        ```

===“LSS”
        ```css
        graph-view {
            allow-zoom: false;
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">allow-pan</p>
单击并拖动是否平移视图。
默认值：`true`
===“Java”
        ```java
        graph.graphViewStyle(style -> style.allowPan(false));
        ```

===“LSS”
        ```css
        graph-view {
            allow-pan: false;
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">最小尺度/最大尺度</p>
缩放级别边界。
默认值：`0.1` / `10`
===“Java”
        ```java
        graph.graphViewStyle(style -> style.minScale(0.25f).maxScale(4f));
        ```

===“LSS”
        ```css
        graph-view {
            min-scale: 0.25;
            max-scale: 4;
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">网格背景</p>
纹理平铺在背景上。默认是带有 `REPEAT` 环绕模式的内置网格精灵。
默认值：`ldlib2:textures/gui/grid_bg.png`（重复）
===“Java”
        ```java
        graph.graphViewStyle(style -> style.gridTexture(myGridTexture));
        ```

===“LSS”
        ```css
        graph-view {
            grid-background: sprite("mymod:textures/gui/grid.png");
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">网格大小</p>
每个网格单元的大小（以世界空间单位表示）。
默认值：`64`
===“Java”
        ```java
        graph.graphViewStyle(style -> style.gridSize(32f));
        ```

===“LSS”
        ```css
        graph-view {
            grid-size: 32;
        }
        ```

---

## 字段
| Name | Type | Access | Description |
| ---- | ---- | ------ | ----------- |
| `contentRoot` | `UIElement` | `public final` | The transformed canvas holding all content. |
| `graphViewStyle` | `GraphViewStyle` | `private` (getter) | Current style. |
| `offsetX` | `float` | `getter/setter` | Current horizontal world-space offset. |
| `offsetY` | `float` | `getter/setter` | Current vertical world-space offset. |
| `scale` | `float` | `private` (getter) | Current zoom level. |

---

＃＃ 方法
| Method | Returns | Description |
| ------ | ------- | ----------- |
| `addContentChild(UIElement)` | `GraphView` | Adds a child to `contentRoot`. |
| `removeContentChild(UIElement)` | `GraphView` | Removes a child from `contentRoot`. |
| `clearAllContentChildren()` | `GraphView` | Removes all children from `contentRoot`. |
| `graphViewStyle(Consumer<GraphViewStyle>)` | `GraphView` | Configures style fluently. |
| `contentRoot(Consumer<UIElement>)` | `UIElement` | Configures `contentRoot`. |
| `fitToChildren(float padding, float minScaleBound)` | `void` | Adjusts offset and scale to fit all visible children, with the given padding and minimum scale. |
| `fit(float minX, float minY, float maxX, float maxY, float minScaleBound)` | `void` | Adjusts offset and scale to fit the given bounding box. |
