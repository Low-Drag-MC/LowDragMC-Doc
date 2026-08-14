# GraphView

<VersionBadge version="2.2.1" label="Since" icon="tag" />

`GraphView` is a pannable, zoomable canvas for displaying node graphs or any arbitrary 2D content. Children are placed on a `contentRoot` element that can be translated and scaled. The view renders a repeating grid background and supports:

- **Pan** — click and drag (left-button on the view background, or middle-button anywhere).
- **Zoom** — mouse wheel, clamped to `[min-scale, max-scale]`.
- **Fit** — helpers to centre and scale the view to fit all children or a given bounding box.

::: info
Everything documented on [UIElement](element.md) (layout, styles, events, data bindings, etc.) applies here too.
:::

---

## Usage

<DocTabs>
<DocTab title="Java">

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

</DocTab>
<DocTab title="Kotlin">

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

</DocTab>
<DocTab title="KubeJS">

```js
let graph = new GraphView();
graph.graphViewStyle(style => {
    style.allowZoom(true);
    style.minScale(0.2);
});
graph.addContentChild(myNode);
parent.addChild(graph);
```

</DocTab>
</DocTabs>

---

## Internal Structure

| Field | CSS class | Description |
| ----- | --------- | ----------- |
| `contentRoot` | `.__graph-view_content-root__` | Absolutely-positioned element that holds all user-added children and receives the pan/zoom transform. |

---

## GraphView Style

::: info
#### <p style="font-size: 1rem;">allow-zoom</p>

Whether scrolling the mouse wheel changes the zoom level.

Default: `true`

<DocTabs>
<DocTab title="Java">

```java
graph.graphViewStyle(style -> style.allowZoom(false));
```

</DocTab>
<DocTab title="LSS">

```css
graph-view {
    allow-zoom: false;
}
```

</DocTab>
</DocTabs>

:::

::: info
#### <p style="font-size: 1rem;">allow-pan</p>

Whether clicking and dragging pans the view.

Default: `true`

<DocTabs>
<DocTab title="Java">

```java
graph.graphViewStyle(style -> style.allowPan(false));
```

</DocTab>
<DocTab title="LSS">

```css
graph-view {
    allow-pan: false;
}
```

</DocTab>
</DocTabs>

:::

::: info
#### <p style="font-size: 1rem;">min-scale / max-scale</p>

Zoom level bounds.

Defaults: `0.1` / `10`

<DocTabs>
<DocTab title="Java">

```java
graph.graphViewStyle(style -> style.minScale(0.25f).maxScale(4f));
```

</DocTab>
<DocTab title="LSS">

```css
graph-view {
    min-scale: 0.25;
    max-scale: 4;
}
```

</DocTab>
</DocTabs>

:::

::: info
#### <p style="font-size: 1rem;">grid-background</p>

Texture tiled across the background. The default is a built-in grid sprite with `REPEAT` wrap mode.

Default: `ldlib2:textures/gui/grid_bg.png` (repeat)

<DocTabs>
<DocTab title="Java">

```java
graph.graphViewStyle(style -> style.gridTexture(myGridTexture));
```

</DocTab>
<DocTab title="LSS">

```css
graph-view {
    grid-background: sprite("mymod:textures/gui/grid.png");
}
```

</DocTab>
</DocTabs>

:::

::: info
#### <p style="font-size: 1rem;">grid-size</p>

Size (in world-space units) of each grid cell.

Default: `64`

<DocTabs>
<DocTab title="Java">

```java
graph.graphViewStyle(style -> style.gridSize(32f));
```

</DocTab>
<DocTab title="LSS">

```css
graph-view {
    grid-size: 32;
}
```

</DocTab>
</DocTabs>

:::

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
| `graphViewStyle(Consumer&lt;GraphViewStyle&gt;)` | `GraphView` | Configures style fluently. |
| `contentRoot(Consumer&lt;UIElement&gt;)` | `UIElement` | Configures `contentRoot`. |
| `fitToChildren(float padding, float minScaleBound)` | `void` | Adjusts offset and scale to fit all visible children, with the given padding and minimum scale. |
| `fit(float minX, float minY, float maxX, float maxY, float minScaleBound)` | `void` | Adjusts offset and scale to fit the given bounding box. |

---

## Adaptive grid and level of detail

<VersionBadge version="2.2.34" label="Since" icon="tag" />

The background grid now adapts its density as the canvas zoom changes. `getLod()` reports `FULL`, `SIMPLIFIED`, or `BLOCK` from the current physical pixel scale; graph nodes and wires can use it to avoid expensive detail while zoomed out.

<figure>
<img src="/assets/ldlib2/graph-view-full.png" alt="GraphView at full level of detail">
<figcaption>
<code>FULL</code> keeps labels, ports, and wire detail when the graph is close enough to edit.
</figcaption>
</figure>

<figure>
<img src="/assets/ldlib2/graph-view-simplified.png" alt="GraphView zoomed out at simplified level of detail">
<figcaption>
<code>SIMPLIFIED</code> removes expensive fine detail while preserving the graph's structure during navigation.
</figcaption>
</figure>

```java
graph.graphViewStyle(style -> style
        .lodEnabled(true)
        .lodSimplifiedPixelScale(0.5f)
        .lodBlockPixelScale(0.2f));

if (graph.getLod() == GraphViewLod.FULL) {
    // Draw labels or other fine detail.
}
```

`BLOCK` is intended for an overview, not for semantic editing. Keep hit targets and essential graph state available at every LOD.
