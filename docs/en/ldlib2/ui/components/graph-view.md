# GraphView

{{ version_badge("2.2.1", label="Since", icon="tag") }}

`GraphView` is a pannable, zoomable canvas for displaying node graphs or any arbitrary 2D content. Children are placed on a `contentRoot` element that can be translated and scaled. The view renders a repeating grid background and supports:

- **Pan** — click and drag (left-button on the view background, or middle-button anywhere).
- **Zoom** — mouse wheel, clamped to `[min-scale, max-scale]`.
- **Fit** — helpers to centre and scale the view to fit all children or a given bounding box.

!!! note ""
    Everything documented on [UIElement](element.md){ data-preview } (layout, styles, events, data bindings, etc.) applies here too.

---

## Usage

=== "Java"

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

=== "Kotlin"

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

=== "KubeJS"

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

## Internal Structure

| Field | CSS class | Description |
| ----- | --------- | ----------- |
| `contentRoot` | `.__graph-view_content-root__` | Absolutely-positioned element that holds all user-added children and receives the pan/zoom transform. |

---

## GraphView Style

!!! info ""
    #### <p style="font-size: 1rem;">allow-zoom</p>

    Whether scrolling the mouse wheel changes the zoom level.

    Default: `true`

    === "Java"

        ```java
        graph.graphViewStyle(style -> style.allowZoom(false));
        ```

    === "LSS"

        ```css
        graph-view {
            allow-zoom: false;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">allow-pan</p>

    Whether clicking and dragging pans the view.

    Default: `true`

    === "Java"

        ```java
        graph.graphViewStyle(style -> style.allowPan(false));
        ```

    === "LSS"

        ```css
        graph-view {
            allow-pan: false;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">min-scale / max-scale</p>

    Zoom level bounds.

    Defaults: `0.1` / `10`

    === "Java"

        ```java
        graph.graphViewStyle(style -> style.minScale(0.25f).maxScale(4f));
        ```

    === "LSS"

        ```css
        graph-view {
            min-scale: 0.25;
            max-scale: 4;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">grid-background</p>

    Texture tiled across the background. The default is a built-in grid sprite with `REPEAT` wrap mode.

    Default: `ldlib2:textures/gui/grid_bg.png` (repeat)

    === "Java"

        ```java
        graph.graphViewStyle(style -> style.gridTexture(myGridTexture));
        ```

    === "LSS"

        ```css
        graph-view {
            grid-background: sprite("mymod:textures/gui/grid.png");
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">grid-size</p>

    Size (in world-space units) of each grid cell.

    Default: `64`

    === "Java"

        ```java
        graph.graphViewStyle(style -> style.gridSize(32f));
        ```

    === "LSS"

        ```css
        graph-view {
            grid-size: 32;
        }
        ```

---

## Fields

| Name | Type | Access | Description |
| ---- | ---- | ------ | ----------- |
| `contentRoot` | `UIElement` | `public final` | The transformed canvas holding all content. |
| `graphViewStyle` | `GraphViewStyle` | `private` (getter) | Current style. |
| `offsetX` | `float` | `getter/setter` | Current horizontal world-space offset. |
| `offsetY` | `float` | `getter/setter` | Current vertical world-space offset. |
| `scale` | `float` | `private` (getter) | Current zoom level. |

---

## Methods

| Method | Returns | Description |
| ------ | ------- | ----------- |
| `addContentChild(UIElement)` | `GraphView` | Adds a child to `contentRoot`. |
| `removeContentChild(UIElement)` | `GraphView` | Removes a child from `contentRoot`. |
| `clearAllContentChildren()` | `GraphView` | Removes all children from `contentRoot`. |
| `graphViewStyle(Consumer<GraphViewStyle>)` | `GraphView` | Configures style fluently. |
| `contentRoot(Consumer<UIElement>)` | `UIElement` | Configures `contentRoot`. |
| `fitToChildren(float padding, float minScaleBound)` | `void` | Adjusts offset and scale to fit all visible children, with the given padding and minimum scale. |
| `fit(float minX, float minY, float maxX, float maxY, float minScaleBound)` | `void` | Adjusts offset and scale to fit the given bounding box. |
