# ScrollerView

<VersionBadge version="2.2.1" label="Since" icon="tag" />

`ScrollerView` is a scrollable container. It wraps a `viewContainer` inside a `viewPort` and provides optional horizontal and vertical scroll bars that appear automatically when content overflows. Children added to a `ScrollerView` in code or XML are placed inside `viewContainer`.

::: info
Everything documented on [UIElement](element.md) (layout, styles, events, data bindings, etc.) applies here too.
:::

---

## Usage

<DocTabs>
<DocTab title="Java">

```java
var sv = new ScrollerView();
sv.scrollerStyle(style -> style.mode(ScrollerMode.VERTICAL));
for (int i = 0; i < 20; i++) {
    sv.addScrollViewChild(new Label().setText("Item " + i, false));
}
parent.addChild(sv);
```

</DocTab>
<DocTab title="Kotlin">

```kotlin
scrollerView({ scrollerViewStyle { mode(ScrollerMode.VERTICAL) } }) {
    for (i in 0 until 20) {
        label { api { setText("Item $i", false) } }
    }
}
```

</DocTab>
<DocTab title="KubeJS">

```js
let sv = new ScrollerView();
sv.scrollerStyle(style => style.mode(ScrollerMode.VERTICAL));
for (let i = 0; i < 20; i++) {
    sv.addScrollViewChild(new Label().setText("Item " + i, false));
}
parent.addChild(sv);
```

</DocTab>
</DocTabs>
---

## XML

```xml
<scroller-view>
    <label>Item 1</label>
    <label>Item 2</label>
    <label>Item 3</label>
</scroller-view>
```

Direct XML children are placed inside `viewContainer`.

---

## Internal Structure

| CSS class | Description |
| --------- | ----------- |
| `.__scroller_view_vertical-container__` | Row flex container holding `viewPort` and the vertical scroller. |
| `.__scroller_view_view-port__` | Clipping viewport with default 5 px padding and border texture. |
| `.__scroller_view_view-container__` | The actual content container where children are placed. |
| `.__scroller_view_vertical-scroller__` | Vertical scroll bar (right side). |
| `.__scroller_view_horizontal-scroller__` | Horizontal scroll bar (bottom). |

---

## ScrollerView Style

::: info
#### <p style="font-size: 1rem;">scroller-view-mode</p>

Which scroll axes are enabled. Values: `HORIZONTAL`, `VERTICAL`, `BOTH`.

Default: `BOTH`

<DocTabs>
<DocTab title="Java">

```java
sv.scrollerStyle(style -> style.mode(ScrollerMode.VERTICAL));
```

</DocTab>
<DocTab title="LSS">

```css
scroller-view {
    scroller-view-mode: VERTICAL;
}
```

</DocTab>
</DocTabs>
:::

::: info
#### <p style="font-size: 1rem;">scroller-vertical-display / scroller-horizontal-display</p>

Visibility policy for each scroll bar. Values: `AUTO` (show only when content overflows), `ALWAYS`, `NEVER`.

Default: `AUTO`

<DocTabs>
<DocTab title="Java">

```java
sv.scrollerStyle(style -> style
    .verticalScrollDisplay(ScrollDisplay.ALWAYS)
    .horizontalScrollDisplay(ScrollDisplay.NEVER)
);
```

</DocTab>
<DocTab title="LSS">

```css
scroller-view {
    scroller-vertical-display: ALWAYS;
    scroller-horizontal-display: NEVER;
}
```

</DocTab>
</DocTabs>
:::

::: info
#### <p style="font-size: 1rem;">scroller-view-margin</p>

Right margin reserved for the horizontal scroller when the vertical scroller is also visible.

Default: `5`

<DocTabs>
<DocTab title="LSS">

```css
scroller-view {
    scroller-view-margin: 5;
}
```

</DocTab>
</DocTabs>
:::

::: info
#### <p style="font-size: 1rem;">adaptive-width / adaptive-height</p>

When enabled, the `ScrollerView` resizes itself to match the content container's computed width or height.

Default: `false`

<DocTabs>
<DocTab title="Java">

```java
sv.scrollerStyle(style -> style.adaptiveHeight(true));
```

</DocTab>
<DocTab title="LSS">

```css
scroller-view {
    adaptive-height: true;
}
```

</DocTab>
</DocTabs>
:::

::: info
#### <p style="font-size: 1rem;">min-scroll / max-scroll</p>

Clamp bounds (in pixels) on how far the scroll bar thumb travels per scroll event.

Defaults: `5` / `7`

<DocTabs>
<DocTab title="Java">

```java
sv.scrollerStyle(style -> style.minScrollPixel(0f).maxScrollPixel(20f));
```

</DocTab>
<DocTab title="LSS">

```css
scroller-view {
    min-scroll: 0;
    max-scroll: 20;
}
```

</DocTab>
</DocTabs>
:::

---

## Fields

| Name | Type | Access | Description |
| ---- | ---- | ------ | ----------- |
| `viewContainer` | `UIElement` | `public final` | Container holding all added children. |
| `viewPort` | `UIElement` | `public final` | Clipping region (has border texture and padding). |
| `verticalContainer` | `UIElement` | `public final` | Row flex container wrapping `viewPort` and `verticalScroller`. |
| `horizontalScroller` | `Scroller.Horizontal` | `public final` | Horizontal scroll bar. |
| `verticalScroller` | `Scroller.Vertical` | `public final` | Vertical scroll bar. |

---

## Methods

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
| `scrollerStyle(Consumer&lt;ScrollerViewStyle&gt;)` | `ScrollerView` | Configures the style fluently. |
| `viewContainer(Consumer&lt;UIElement&gt;)` | `ScrollerView` | Configures `viewContainer`. |
| `viewPort(Consumer&lt;UIElement&gt;)` | `ScrollerView` | Configures `viewPort`. |
| `verticalContainer(Consumer&lt;UIElement&gt;)` | `ScrollerView` | Configures `verticalContainer`. |
| `horizontalScroller(Consumer&lt;Scroller&gt;)` | `ScrollerView` | Configures the horizontal scroll bar. |
| `verticalScroller(Consumer&lt;Scroller&gt;)` | `ScrollerView` | Configures the vertical scroll bar. |
