# GraphView

<VersionBadge version="2.2.1" label="自" icon="tag" />

`GraphView` 是一个可平移、可缩放的画布，用于显示节点图或任意 2D 内容。子元素被放置在 `contentRoot` 元素上，该元素可以进行平移和缩放变换。视图渲染重复的网格背景，并支持：

- **平移** — 点击并拖拽（在视图背景上使用左键，或在任意位置使用中键）。
- **缩放** — 鼠标滚轮，限制在 `[min-scale, max-scale]` 范围内。
- **适应** — 辅助方法，用于将视图居中并缩放以适应所有子元素或给定的边界框。

::: info
[UIElement](element.md) 上记录的所有内容（布局、样式、事件、数据绑定等）同样适用于此。
:::

---

## 用法

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

// 添加子元素后适应视图：
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

## 内部结构

| 字段 | CSS 类 | 描述 |
| ----- | --------- | ----------- |
| `contentRoot` | `.__graph-view_content-root__` | 绝对定位的元素，包含所有用户添加的子元素，并接收平移/缩放变换。 |

---

## GraphView 样式

::: info
#### <p style="font-size: 1rem;">allow-zoom</p>

是否允许滚动鼠标滚轮改变缩放级别。

默认值：`true`

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

是否允许点击并拖拽来平移视图。

默认值：`true`

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

缩放级别的边界值。

默认值：`0.1` / `10`

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

在背景上平铺的纹理。默认是带有 `REPEAT` 环绕模式的内置网格精灵图。

默认值：`ldlib2:textures/gui/grid_bg.png`（重复）

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

每个网格单元的大小（以世界空间单位为单位）。

默认值：`64`

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

## 字段

| 名称 | 类型 | 访问权限 | 描述 |
| ---- | ---- | ------ | ----------- |
| `contentRoot` | `UIElement` | `public final` | 用于保存所有内容的变换画布。 |
| `graphViewStyle` | `GraphViewStyle` | `private`（有 getter） | 当前样式。 |
| `offsetX` | `float` | `getter/setter` | 当前水平世界空间偏移量。 |
| `offsetY` | `float` | `getter/setter` | 当前垂直世界空间偏移量。 |
| `scale` | `float` | `private`（有 getter） | 当前缩放级别。 |

---

## 方法

| 方法 | 返回值 | 描述 |
| ------ | ------- | ----------- |
| `addContentChild(UIElement)` | `GraphView` | 向 `contentRoot` 添加子元素。 |
| `removeContentChild(UIElement)` | `GraphView` | 从 `contentRoot` 移除子元素。 |
| `clearAllContentChildren()` | `GraphView` | 移除 `contentRoot` 的所有子元素。 |
| `graphViewStyle(Consumer&lt;GraphViewStyle&gt;)` | `GraphView` | 以流式方式配置样式。 |
| `contentRoot(Consumer&lt;UIElement&gt;)` | `UIElement` | 配置 `contentRoot`。 |
| `fitToChildren(float padding, float minScaleBound)` | `void` | 调整偏移量和缩放比例以适应所有可见子元素，使用给定的内边距和最小缩放值。 |
| `fit(float minX, float minY, float maxX, float maxY, float minScaleBound)` | `void` | 调整偏移量和缩放比例以适应给定的边界框。 |

---

## 自适应网格与细节等级

<VersionBadge version="2.2.34" label="Since" icon="tag" />

画布缩放时背景网格会自动调整密度。`getLod()` 根据当前物理像素比例返回 `FULL`、`SIMPLIFIED` 或 `BLOCK`；图节点和连线可以用它在缩小时省略高成本细节。

<figure>
<img src="/assets/ldlib2/graph-view-full.png" alt="完整细节等级下的 GraphView">
<figcaption>
距离足够近、适合编辑时，<code>FULL</code> 会保留标签、端口和连线细节。
</figcaption>
</figure>

<figure>
<img src="/assets/ldlib2/graph-view-simplified.png" alt="缩小到简化细节等级的 GraphView">
<figcaption>
导航时，<code>SIMPLIFIED</code> 会省略高成本细节，同时保留图的整体结构。
</figcaption>
</figure>

```java
graph.graphViewStyle(style -> style
        .lodEnabled(true)
        .lodSimplifiedPixelScale(0.5f)
        .lodBlockPixelScale(0.2f));

if (graph.getLod() == GraphViewLod.FULL) {
    // 绘制标签或其他细节。
}
```

`BLOCK` 用于总览，不应用于语义编辑。每个 LOD 都应保留命中区域和必要的图状态。
