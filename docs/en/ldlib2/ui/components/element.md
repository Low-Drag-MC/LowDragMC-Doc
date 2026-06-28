# UIElement

<VersionBadge version="2.2.1" label="Since" icon="tag" />

`UIElement` is the most fundamental and commonly used UI component in LDLib2.
All UI components inherit from it.

Conceptually, it is similar to the `#!html <div/>` element in HTML: a general-purpose container that can be styled, laid out, and extended with behaviors.

Because of that, everything introduced in this page also applies to all other UI components in LDLib2—so please make sure to read it carefully.

---

## Usages

<DocTabs>
<DocTab title="Java">

```java
var element = new UIElement();
element.style(style -> style.background(MCSprites.RECT));
element.layout(layout -> layout.width(40).height(40));
element.setFocusable(true);
element.addEventListener(UIEvents.MOUSE_DOWN, e -> e.currentElement.focus());
element.addClass("add-class");
element.removeClass("add-class");
root.addChild(element);
```

</DocTab>
<DocTab title="Kotlin">

```kotlin
val root = element root@{
    element({
        layout = { size(40.px) }
        style = { background(MCSprites.RECT) }
        focusable = true
        cls = {
            +"add-class"
            -"remove-class"
        }
    }) {
        events { UIEvents.MOUSE_DOWN += { it.currentElement.focus() } }
    }
}
```

</DocTab>
<DocTab title="KubeJS">

```js
let element = new UIElement();
element.style(style => style.background(MCSprites.RECT));
element.layout(layout => layout.width(40).height(40));
element.setFocusable(true);
element.addEventListener(UIEvents.MOUSE_DOWN, e => e.currentElement.focus());
element.addClass("add-class");
element.removeClass("add-class");
root.addChild(element);
```

</DocTab>
</DocTabs>

---

## Xml
```xml
<element id="my_id" class="class1 class2" focusable="false" visible="true" active="true" style="background: #fff; width: 50">
    <!-- add children here -->
    <button text="click me!"/>
    <inventory-slots/>
</element>
```

---

## Styles

::: info Layout
layout attributes are actually styles as well.
:::

UIElement styles (include layouts) can be accessed as below:
<DocTabs>
<DocTab title="Java">

```java
element.style(style -> style.background(...));
element.layout(layout -> layout.width(...));
element.getStyle().background(...);
element.getLayout().width(...);
```

</DocTab>
<DocTab title="Kotlin">

```kotlin
element({
    layout = { width(20.pct) }
    style = { background(MCSprites.RECT) }
}) { }

element.layoutDsl { 
    width(20.pct)
}
element.styleDsl { 
    background(MCSprites.RECT)
}
```

</DocTab>
<DocTab title="KubeJS">

```js
element.style(style => style.background(...));
element.layout(layout => layout.width(...));
element.getStyle().background(...);
element.getLayout().width(...);
```

</DocTab>
</DocTabs>

### Layout Properties

You'd better read [Layout](../preliminary/layout.md) before using.

::: info
#### <p style="font-size: 1rem;">display</p>

Controls whether the element participates in layout. `FLEX` enables flex layout, `GRID` enables grid layout, `NONE` removes the element from layout calculation, and `CONTENTS` doesn't affect layout but renders its children.

<DocTabs>
<DocTab title="Java">

```java
layout.display(TaffyDisplay.FLEX);
layout.display(TaffyDisplay.GRID); // enable grid layout
element.setDisplay(false); // equals to layout.display(TaffyDisplay.NONE);
```

</DocTab>
<DocTab title="Kotlin">

```kotlin
layout {
    display(false)
    display(TaffyDisplay.GRID)
}
```

</DocTab>
<DocTab title="LSS">

```css
element {
    display: flex;
    display: grid;
}
```

</DocTab>
</DocTabs>

:::

::: info
#### <p style="font-size: 1rem;">layout-direction</p>

Sets the layout direction. Usually inherited from parent.

<DocTabs>
<DocTab title="Java">

```java
layout.layoutDirection(TaffyDirection.LTR);
```

</DocTab>
<DocTab title="Kotlin">

```kotlin
layout {
    direction(TaffyDirection.LTR)
}
```

</DocTab>
<DocTab title="LSS">

```css
element {
    layout-direction: ltr;
}
```

</DocTab>
</DocTabs>

:::

::: info
#### <p style="font-size: 1rem;">flex-basis</p>

Sets the initial main size before flex grow/shrink. Supports **point**, **percent**, and **auto**.

<DocTabs>
<DocTab title="Java">

```java
layout.flexBasis(1);
```

</DocTab>
<DocTab title="Kotlin">

```kotlin
layout {
    flexBasis(1)
}
```

</DocTab>
<DocTab title="LSS">

```css
element {
    flex-basis: 1;
}
```

</DocTab>
</DocTabs>

:::

::: info
#### <p style="font-size: 1rem;">flex</p>

Makes the element flexible along the main axis.

<DocTabs>
<DocTab title="Java">

```java
layout.flex(1);
```

</DocTab>
<DocTab title="Kotlin">

```kotlin
layout {
    flex(1)
}
```

</DocTab>
<DocTab title="LSS">

```css
element {
    flex: 1;
}
```

</DocTab>
</DocTabs>

:::

::: info
#### <p style="font-size: 1rem;">flex-grow</p>

Controls how much the element grows when extra space is available.

<DocTabs>
<DocTab title="Java">

```java
layout.flexGrow(1);
```

</DocTab>
<DocTab title="Kotlin">

```kotlin
layout {
    flexGrow(1)
}
```

</DocTab>
<DocTab title="LSS">

```css
element {
    flex-grow: 1;
}
```

</DocTab>
</DocTabs>

:::

::: info
#### <p style="font-size: 1rem;">flex-shrink</p>

Controls how much the element shrinks when space is insufficient.

<DocTabs>
<DocTab title="Java">

```java
layout.flexShrink(1);
```

</DocTab>
<DocTab title="Kotlin">

```kotlin
layout {
    flexShrink(1)
}
```

</DocTab>
<DocTab title="LSS">

```css
element {
    flex-shrink: 1;
}
```

</DocTab>
</DocTabs>

:::

::: info
#### <p style="font-size: 1rem;">flex-direction</p>

Defines the main axis direction, e.g. `ROW` or `COLUMN`.

<DocTabs>
<DocTab title="Java">

```java
layout.flexDirection(FlexDirection.ROW);
```

</DocTab>
<DocTab title="Kotlin">

```kotlin
layout {
    flexDirection(FlexDirection.ROW)
}
```

</DocTab>
<DocTab title="LSS">

```css
element {
    flex-direction: row;
}
```

</DocTab>
</DocTabs>

:::

::: info
#### <p style="font-size: 1rem;">flex-wrap</p>

Controls whether children wrap into multiple lines.

<DocTabs>
<DocTab title="Java">

```java
layout.wrap(FlexWrap.WRAP);
```

</DocTab>
<DocTab title="Kotlin">

```kotlin
layout {
    wrap(FlexWrap.WRAP)
}
```

</DocTab>
<DocTab title="LSS">

```css
element {
    flex-wrap: wrap;
}
```

</DocTab>
</DocTabs>

:::

::: info
#### <p style="font-size: 1rem;">position</p>

Sets positioning mode. `RELATIVE` participates in layout, `ABSOLUTE` does not affect siblings.

<DocTabs>
<DocTab title="Java">

```java
layout.positionType(TaffyPosition.ABSOLUTE);
```

</DocTab>
<DocTab title="Kotlin">

```kotlin
layout {
    position(TaffyPosition.ABSOLUTE)
}
```

</DocTab>
<DocTab title="LSS">

```css
element {
    position: absolute;
}
```

</DocTab>
</DocTabs>

:::

::: info
#### <p style="font-size: 1rem;">top / right / bottom / left / start / end / horizontal / vertical / all</p>

Offsets used when `position` is `RELATIVE` or `ABSOLUTE`.

<DocTabs>
<DocTab title="Java">

```java
layout.top(10);
layout.leftPercent(30); // 30%
layout.allAuto()
```

</DocTab>
<DocTab title="Kotlin">

```kotlin
layout = {
    pos {
        top(10.px)
        left(10.px)
        bottom(auto)
    }
}
```

</DocTab>
<DocTab title="LSS">

```css
element {
    top: 10;
    left: 30%;
    all: auto;
}
```

</DocTab>
</DocTabs>

:::

::: info
#### <p style="font-size: 1rem;">margin-*</p> 

`*`: top / right / bottom / left / start / end / horizontal / vertical / all

Sets outer spacing around the element.

<DocTabs>
<DocTab title="Java">

```java
layout.marginTop(5);
layout.marginAll(3);
```

</DocTab>
<DocTab title="Kotlin">

```kotlin
layout = {
    margin {
        top(5.px)
        all(3.px)
    }
}
```

</DocTab>
<DocTab title="LSS">

```css
element {
    margin-top: 5;
    margin-all: 3;
}
```

</DocTab>
</DocTabs>

:::

::: info
#### <p style="font-size: 1rem;">padding-*</p>

`*`: top / right / bottom / left / start / end / horizontal / vertical / all

Sets inner spacing between border and content.

<DocTabs>
<DocTab title="Java">

```java
layout.paddingLeft(8);
```

</DocTab>
<DocTab title="Kotlin">

```kotlin
layout = {
    padding { left(8) }
}
```

</DocTab>
<DocTab title="LSS">

```css
element {
    padding-left: 8;
}
```

</DocTab>
</DocTabs>

:::

::: info
#### <p style="font-size: 1rem;">gap-*</p>

`*`: row / column / all

Sets spacing between children in flex layouts.

<DocTabs>
<DocTab title="Java">

```java
layout.rowGap(6);
```

</DocTab>
<DocTab title="Kotlin">

```kotlin
layout = {
    gap { row(6) }
}
```

</DocTab>
<DocTab title="LSS">

```css
element {
    gap-row: 6;
}
```

</DocTab>
</DocTabs>

:::

::: info
#### <p style="font-size: 1rem;">width</p>

Sets element width. Supports **point**, **percent**, and **auto** modes.

<DocTabs>
<DocTab title="Java">

```java
layout.width(100);
layout.widthPercent(20); // 20%
```

</DocTab>
<DocTab title="Kotlin">

```kotlin
layout = {
    width(100)
    width(20.pct) // 20%
}
```

</DocTab>
<DocTab title="LSS">

```css
element {
    width: 100;
    width: 20%;
}
```

</DocTab>
</DocTabs>

:::

::: info
#### <p style="font-size: 1rem;">height</p>

Sets element height. Supports **point**, **percent**, and **auto** modes.

<DocTabs>
<DocTab title="Java">

```java
layout.height(50);
```

</DocTab>
<DocTab title="Kotlin">

```kotlin
layout = {
    width(100)
    height(20.pct) // 20%
}
```

</DocTab>
<DocTab title="LSS">

```css
element {
    height: 50;
}
```

</DocTab>
</DocTabs>

:::

::: info
#### <p style="font-size: 1rem;">min-width / min-height</p>

Sets the minimum size constraint.

<DocTabs>
<DocTab title="Java">

```java
layout.minWidth(20);
```

</DocTab>
<DocTab title="Kotlin">

```kotlin
layout = {
    minWidth(20);
}
```

</DocTab>
<DocTab title="LSS">

```css
element {
    min-width: 20;
}
```

</DocTab>
</DocTabs>

:::

::: info
#### <p style="font-size: 1rem;">max-width / max-height</p>

Sets the maximum size constraint.

<DocTabs>
<DocTab title="Java">

```java
layout.maxHeight(200);
```

</DocTab>
<DocTab title="Kotlin">

```kotlin
layout = {
    maxHeight(200);
}
```

</DocTab>
<DocTab title="LSS">

```css
element {
    max-height: 200;
}
```

</DocTab>
</DocTabs>

:::

::: info
#### <p style="font-size: 1rem;">aspect-rate</p>

Locks width–height ratio. Useful for square or icon elements.

<DocTabs>
<DocTab title="Java">

```java
layout.aspectRate(1);
```

</DocTab>
<DocTab title="Kotlin">

```kotlin
layout = {
    aspectRate(1);
}
```

</DocTab>
<DocTab title="LSS">

```css
element {
    aspect-rate: 1;
}
```

</DocTab>
</DocTabs>

:::

::: info
#### <p style="font-size: 1rem;">align-items</p>

Aligns children along the cross axis (container property).

<DocTabs>
<DocTab title="Java">

```java
layout.alignItems(AlignItems.CENTER);
```

</DocTab>
<DocTab title="Kotlin">

```kotlin
layout = {
    alignItems(AlignItems.CENTER)
}
```

</DocTab>
<DocTab title="LSS">

```css
element {
    align-items: center;
}
```

</DocTab>
</DocTabs>

:::

::: info
#### <p style="font-size: 1rem;">justify-content</p>

Aligns children along the main axis (container property).

<DocTabs>
<DocTab title="Java">

```java
layout.justifyContent(AlignContent.CENTER);
```

</DocTab>
<DocTab title="Kotlin">

```kotlin
layout = {
    justifyContent(AlignContent.CENTER)
}
```

</DocTab>
<DocTab title="LSS">

```css
element {
    justify-content: center;
}
```

</DocTab>
</DocTabs>

:::

::: info
#### <p style="font-size: 1rem;">align-self</p>

Overrides cross-axis alignment for a single element.

<DocTabs>
<DocTab title="Java">

```java
layout.alignSelf(AlignItems.CENTER);
```

</DocTab>
<DocTab title="Kotlin">

```kotlin
layout = {
    alignSelf(AlignItems.CENTER)
}
```

</DocTab>
<DocTab title="LSS">

```css
element {
    align-self: center;
}
```

</DocTab>
</DocTabs>

:::

::: info
#### <p style="font-size: 1rem;">align-content</p>

Aligns wrapped lines when `flex-wrap` is enabled.

<DocTabs>
<DocTab title="Java">

```java
layout.alignContent(AlignContent.CENTER);
```

</DocTab>
<DocTab title="Kotlin">

```kotlin
layout = {
    alignContent(AlignContent.CENTER)
}
```

</DocTab>
<DocTab title="LSS">

```css
element {
    align-content: center;
}
```

</DocTab>
</DocTabs>

:::

---

### Grid Properties

::: info
To use grid layout, set `display(TaffyDisplay.GRID)` on the container element. Template properties define the grid structure on the **container**, while `grid-row` and `grid-column` are placed on **child** elements to control their positions.
:::

::: info
#### <p style="font-size: 1rem;">grid-template-rows</p>

Defines the explicit row tracks of a grid container.

Supported track sizes: `Npx` (fixed pixels), `N%` (percent), `Nfr` (fractional unit), `auto`, `min-content`, `max-content`, `minmax(min, max)`, `fit-content(limit)`, `repeat(count, size)`, `[name]` (named line). Multiple tracks are space-separated.

<DocTabs>
<DocTab title="Java">

```java
layout.display(TaffyDisplay.GRID);
layout.gridTemplateRows("1fr 1fr 1fr");             // three equal rows
layout.gridTemplateRows("50px 1fr auto");           // fixed, flexible, auto
layout.gridTemplateRows("repeat(3, 100px)");        // three 100px rows
layout.gridTemplateRows("[header] 50px [content] 1fr [footer] 50px"); // named lines
```

</DocTab>
<DocTab title="Kotlin">

```kotlin
layout = {
    display(TaffyDisplay.GRID)
    grid {
        templateRows("1fr 1fr 1fr")
        templateRows("repeat(3, 100px)")
    }
}
```

</DocTab>
<DocTab title="LSS">

```css
element {
    display: grid;
    grid-template-rows: 1fr 1fr 1fr;
    grid-template-rows: repeat(3, 100px);
}
```

</DocTab>
</DocTabs>

:::

::: info
#### <p style="font-size: 1rem;">grid-template-columns</p>

Defines the explicit column tracks of a grid container. Uses the same track sizing syntax as `grid-template-rows`.

<DocTabs>
<DocTab title="Java">

```java
layout.display(TaffyDisplay.GRID);
layout.gridTemplateColumns("10px 1fr 10px");    // fixed margins + flexible center
layout.gridTemplateColumns("repeat(3, 1fr)");   // three equal columns
layout.gridTemplateColumns("minmax(100px, 1fr) 200px");
```

</DocTab>
<DocTab title="Kotlin">

```kotlin
layout = {
    display(TaffyDisplay.GRID)
    grid {
        templateColumns("10px 1fr 10px")
        templateColumns("repeat(3, 1fr)")
    }
}
```

</DocTab>
<DocTab title="LSS">

```css
element {
    display: grid;
    grid-template-columns: 10px 1fr 10px;
    grid-template-columns: repeat(3, 1fr);
}
```

</DocTab>
</DocTabs>

:::

::: info
#### <p style="font-size: 1rem;">grid-template-areas</p>

Assigns named areas to grid cells. Each quoted string represents a row; words within it name the cells in that row. Use `.` for empty cells. All rows must have the same number of cells.

<DocTabs>
<DocTab title="Java">

```java
layout.display(TaffyDisplay.GRID);
layout.gridTemplateColumns("1fr 1fr 1fr");
layout.gridTemplateRows("auto 1fr auto");
layout.gridTemplateAreas(
    "\"header header header\" \"sidebar content content\" \"footer footer footer\""
);
// Children reference areas via gridRow/gridColumn by area name
```

</DocTab>
<DocTab title="Kotlin">

```kotlin
layout = {
    display(TaffyDisplay.GRID)
    grid {
        templateColumns("1fr 1fr 1fr")
        templateRows("auto 1fr auto")
        templateAreas("\"header header header\" \"sidebar content content\" \"footer footer footer\"")
    }
}
```

</DocTab>
<DocTab title="LSS">

```css
element {
    display: grid;
    grid-template-rows: auto 1fr auto;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-areas: "header header header" "sidebar content content" "footer footer footer";
}
```

</DocTab>
</DocTabs>

:::

::: info
#### <p style="font-size: 1rem;">grid-auto-rows</p>

Sets the row track size for implicitly created rows — those not covered by `grid-template-rows`.

<DocTabs>
<DocTab title="Java">

```java
layout.gridAutoRows("auto");
layout.gridAutoRows("minmax(50px, auto)");
```

</DocTab>
<DocTab title="Kotlin">

```kotlin
layout = {
    display(TaffyDisplay.GRID)
    grid { autoRows("minmax(50px, auto)") }
}
```

</DocTab>
<DocTab title="LSS">

```css
element {
    display: grid;
    grid-auto-rows: minmax(50px, auto);
}
```

</DocTab>
</DocTabs>

:::

::: info
#### <p style="font-size: 1rem;">grid-auto-columns</p>

Sets the column track size for implicitly created columns.

<DocTabs>
<DocTab title="Java">

```java
layout.gridAutoColumns("auto");
layout.gridAutoColumns("100px");
```

</DocTab>
<DocTab title="Kotlin">

```kotlin
layout = {
    display(TaffyDisplay.GRID)
    grid { autoColumns("100px") }
}
```

</DocTab>
<DocTab title="LSS">

```css
element {
    display: grid;
    grid-auto-columns: 100px;
}
```

</DocTab>
</DocTabs>

:::

::: info
#### <p style="font-size: 1rem;">grid-auto-flow</p>

Controls how auto-placed items fill the grid. `ROW` fills rows first (default); `COLUMN` fills columns first. `ROW_DENSE` / `COLUMN_DENSE` back-fill earlier gaps.

<DocTabs>
<DocTab title="Java">

```java
layout.gridAutoFlow(GridAutoFlow.ROW);
layout.gridAutoFlow(GridAutoFlow.COLUMN);
layout.gridAutoFlow(GridAutoFlow.ROW_DENSE);
```

</DocTab>
<DocTab title="Kotlin">

```kotlin
layout = {
    display(TaffyDisplay.GRID)
    grid { autoFlow(GridAutoFlow.COLUMN) }
}
```

</DocTab>
<DocTab title="LSS">

```css
element {
    display: grid;
    grid-auto-flow: column;
}
```

</DocTab>
</DocTabs>

:::

::: info
#### <p style="font-size: 1rem;">grid-row</p>

Controls a **child** element's row placement within the grid container. Set this on the child, not the container.

Placement values: `"1"` (line number), `"1 / 3"` (start / end lines), `"span 2"` (span N rows), `"1 / span 2"` (start + span), `"header"` (named area row), `"-1"` (last line).

<DocTabs>
<DocTab title="Java">

```java
child.layout(layout -> layout.gridRow("1"));          // row 1
child.layout(layout -> layout.gridRow("1 / 3"));      // rows 1–3
child.layout(layout -> layout.gridRow("span 2"));     // span 2 rows
child.layout(layout -> layout.gridRow("header"));     // named area row
child.layout(layout -> layout.gridRow("-1"));         // last row line
```

</DocTab>
<DocTab title="Kotlin">

```kotlin
element({
    layout = {
        grid { row("1 / span 2") }
    }
}) { }
```

</DocTab>
<DocTab title="LSS">

```css
child {
    grid-row: 1;
    grid-row: 1 / 3;
    grid-row: span 2;
    grid-row: header;
}
```

</DocTab>
</DocTabs>

:::

::: info
#### <p style="font-size: 1rem;">grid-column</p>

Controls a **child** element's column placement within the grid container. Uses the same placement syntax as `grid-row`.

<DocTabs>
<DocTab title="Java">

```java
child.layout(layout -> layout.gridColumn("2"));
child.layout(layout -> layout.gridColumn("1 / span 3"));
child.layout(layout -> layout.gridColumn("sidebar"));
```

</DocTab>
<DocTab title="Kotlin">

```kotlin
element({
    layout = {
        grid { column("1 / span 2") }
    }
}) { }
```

</DocTab>
<DocTab title="LSS">

```css
child {
    grid-column: 2;
    grid-column: 1 / span 3;
    grid-column: sidebar;
}
```

</DocTab>
</DocTabs>

:::

---

### Basic Properties

::: info
#### <p style="font-size: 1rem;">background</p>

Sets the texture rendered behind the element, such as a solid color, rect sprite, or image.


<DocTabs>
<DocTab title="Java">

```java
style.background(MCSprites.BORDER);
```

</DocTab>
<DocTab title="Kotlin">

```kotlin
style = {
    background(MCSprites.BORDER)
}
```

</DocTab>
<DocTab title="LSS">

Check [Texture in LSS](../textures/lss.md) for lss supports.

```css
element {
    background: #FFF;
    background: rect(#2ff, 3);
    background: sprite(ldlib2:textures/gui/icon.png);
}
```

</DocTab>
</DocTabs>

:::


::: info
#### <p style="font-size: 1rem;">overflow</p>

**Deprecated, 1.21 API only.** Use [`clip`](#clip) in 26.1 and newer.

In the 1.21 API, `overflow` controlled how overflowing content was handled. `overflow` was a layout property, with convenience helpers such as `overflowVisible(...)` and `setOverflowVisible(...)`. In 26.1+, `UIElement#setOverflowVisible(false)` maps to `Clip.SCISSOR`.

<DocTabs>
<DocTab title="Java">

```java
layout.overflow(YogaOverflow.HIDDEN);
style.overflowVisible(false);
element.setOverflowVisible(false); // helper on UIElement
```

</DocTab>
<DocTab title="Kotlin">

```kotlin
style = {
    overflowVisible(false)
}
```

</DocTab>
<DocTab title="LSS">

```css
element {
    overflow: hidden;
}
```

</DocTab>
</DocTabs>

:::

::: info
#### <p style="font-size: 1rem;" id="clip">clip</p>

<VersionBadge version="mc26.1" label="Since" icon="tag" />

Controls whether and how the element's subtree is clipped. `clip` replaces the old 1.21 `overflow` / `overflow-clip` API. Any mode other than `NONE` also prevents hit testing outside the element's content bounds.

| Mode | Description |
| --- | --- |
| `NONE` | No clipping. This is the default. |
| `SCISSOR` | Clips rendering to the element's content bounds. Use this as the 26.1+ replacement for `overflow: hidden` or `setOverflowVisible(false)`. |
| `MASK` | Clips rendering with the texture set by [`mask`](#mask). Use this for a static mask texture. |
| `DYNAMIC_MASK` | Same as `MASK`, but the mask is refreshed every frame. Use this for animated or otherwise changing masks. |

<DocTabs>
<DocTab title="Java">

```java
style.clip(Clip.SCISSOR);
style.clip(Clip.MASK).mask(MCSprites.BORDER);
style.clip(Clip.DYNAMIC_MASK).mask(animatedMask);
```

</DocTab>
<DocTab title="Kotlin">

```kotlin
style = {
    clip(Clip.SCISSOR)
    clip(Clip.MASK)
    mask(MCSprites.BORDER)
}
```

</DocTab>
<DocTab title="LSS">

```css
element {
    clip: scissor;
}

element.masked {
    clip: mask;
    mask: sprite(ldlib2:textures/gui/icon.png);
}

element.animated-mask {
    clip: dynamic-mask;
    mask: sprite(ldlib2:textures/gui/icon.png);
}
```

</DocTab>
</DocTabs>

:::

::: info
#### <p style="font-size: 1rem;" id="mask">mask</p>

<VersionBadge version="mc26.1" label="Since" icon="tag" />

Defines the texture used by `clip: mask` and `clip: dynamic-mask`. The mask is drawn over the element's bounds and multiplies the rendered subtree's color and alpha by the sampled mask factor.

Opaque grayscale masks use the texture luminance: white keeps content visible and black hides it. Alpha-encoded masks use the alpha channel, which is useful for transparent PNG masks and soft edges. The `mask` property has no visible effect unless `clip` is `MASK` or `DYNAMIC_MASK`.

<DocTabs>
<DocTab title="Java">

```java
style.clip(Clip.MASK);
style.mask(MCSprites.BORDER);
```

</DocTab>
<DocTab title="Kotlin">

```kotlin
style = {
    clip(Clip.MASK)
    mask(MCSprites.BORDER)
}
```

</DocTab>
<DocTab title="LSS">

Check [Texture in LSS](../textures/lss.md) for lss supports.

```css
element {
    clip: mask;
    mask: sprite(ldlib2:textures/gui/icon.png);
}
```

</DocTab>
</DocTabs>

:::

::: info
#### <p style="font-size: 1rem;">overlay</p>

Controls overlay rendering drawn above the element content.

<DocTabs>
<DocTab title="Java">

```java
style.overlay(...);
```

</DocTab>
<DocTab title="Kotlin">

```kotlin
style = {
    overlay(MCSprites.BORDER)
}
```

</DocTab>
<DocTab title="LSS">

Check [Texture in LSS](../textures/lss.md) for lss supports.

```css
element {
    overlay: #FFF;
    overlay: rect(#2ff, 3);
    overlay: sprite(ldlib2:textures/gui/icon.png);
}
```

</DocTab>
</DocTabs>

:::

::: info
#### <p style="font-size: 1rem;">tooltips</p>

Defines tooltip content displayed when hovering the element.

<DocTabs>
<DocTab title="Java">

```java
style.tooltips("tips.0", "tips.1");
style.appendTooltipsString("tips.2");
```

</DocTab>
<DocTab title="Kotlin">

```kotlin
style = {
    tooltips("tips.0", "tips.1")
}
```

</DocTab>
<DocTab title="LSS">

```css
element {
    tooltips: this is my tooltips;
}
```

</DocTab>
</DocTabs>

:::

::: info
#### <p style="font-size: 1rem;">z-index</p>

Controls the stacking order of the element. Higher values appear above lower ones.

<DocTabs>
<DocTab title="Java">

```java
style.zIndex(1);
```

</DocTab>
<DocTab title="Kotlin">

```kotlin
style = {
    zIndex(1)
}
```

</DocTab>
<DocTab title="LSS">

```css
element {
    z-index: 1;
}
```

</DocTab>
</DocTabs>

:::

::: info
#### <p style="font-size: 1rem;">opacity</p>

Sets the transparency level of the element. `0` is fully transparent, `1` is fully opaque.

<DocTabs>
<DocTab title="Java">

```java
style.opacity(0.8f);
```

</DocTab>
<DocTab title="Kotlin">

```kotlin
style = {
    opacity(0.8)
}
```

</DocTab>
<DocTab title="LSS">

```css
element {
    opacity: 0.8;
}
```

</DocTab>
</DocTabs>

:::

::: info
#### <p style="font-size: 1rem;">color</p>

Tints the current element's `background` and `overlay` textures using an ARGB multiplier.
This tint is applied only to the current element and does not affect child elements.

<DocTabs>
<DocTab title="Java">

```java
style.color(0x80FF8080);
```

</DocTab>
<DocTab title="Kotlin">

```kotlin
style = {
    color(0x80FF8080.toInt())
}
```

</DocTab>
<DocTab title="LSS">

```css
element {
    color: #80FF8080;
}
```

</DocTab>
</DocTabs>

:::


::: info
#### <p style="font-size: 1rem;">overflow-clip</p>

**Deprecated, 1.21 API only.** Use [`clip: mask`](#clip) with [`mask`](#mask) in 26.1 and newer.

In the 1.21 API, when the element's `overflow` was hidden, `overflow-clip` clipped child rendering using the given texture's red channel as a mask. In 26.1+, set `clip` to `MASK` or `DYNAMIC_MASK`, then set the mask texture with `mask`.

<div style="text-align: center;">
    <video controls>
    <source src="../assets/overflow-clip.mp4" type="video/mp4">
    Your browser does not support video.
    </video>
</div>

<DocTabs>
<DocTab title="Java">

```java
style.overflowClip(MCSprites.BORDER);
```

</DocTab>
<DocTab title="Kotlin">

```kotlin
style = {
    overflowClip(MCSprites.BORDER)
}
```

</DocTab>
<DocTab title="LSS">

Check [Texture in LSS](../textures/lss.md) for lss supports.

```css
element {
    overflow-clip: sprite(ldlib2:textures/gui/icon.png);
}
```

</DocTab>
</DocTabs>

:::

::: info
#### <p style="font-size: 1rem;">transform-2d</p>

Applies 2D transformations such as translate, scale, or rotate.

<DocTabs>
<DocTab title="Java">

```java
style.transform2D(Transform2D.identity().scale(0.5f));
element.transform(transform -> transform.translate(10, 0))
```

</DocTab>
<DocTab title="Kotlin">

```kotlin
style = {
    transform2D(Transform2D.identity().scale(0.5f))
}
```

</DocTab>
<DocTab title="LSS">

```css
element {
    transform: translate(10, 20) rotate(45) scale(2, 2) pivot(0.5, 0.5);
    transform: translateX(10) scale(0.5);
}
```

</DocTab>
</DocTabs>

:::

::: info
#### <p style="font-size: 1rem;">transition</p>

Defines animated transitions between property changes.

<div style="text-align: center;">
    <video controls>
    <source src="../assets/transition.mp4" type="video/mp4">
    Your browser does not support video.
    </video>
</div>

<DocTabs>
<DocTab title="Java">

```java
layout.transition(new Transition(Map.of(LayoutProperties.HEIGHT, new Animation(1, 0, Eases.LINEAR))));
```

</DocTab>
<DocTab title="Kotlin">

```kotlin
style = {
    transition(Transition(mapOf(LayoutProperties.HEIGHT to Animation(1f, 0f, Eases.LINEAR))))
}
```

</DocTab>
<DocTab title="LSS">

```css
element {
    transition: width 1;
    transition: background 0.8 quad_in_out,
                transform 0.3;
}
```

</DocTab>
</DocTabs>

:::


---
## States

### `isVisible`
When `isVisible` is set to `false`, the element and all of its children will no longer be rendered.  
Unlike `display: NONE`, this does **not** affect layout calculation.  
Elements with `isVisible = false` are also excluded from hit-testing, so many UI events (such as clicks) will not be triggered.

### `isActive`
When `isActive` is set to `false`, the element may lose its interactive behavior—for example, buttons can no longer be clicked—and the element will no longer receive `tick` events.

::: info
When `isActive` is set to `false`, a `__disabled__` class is automatically added to the element.  
You can use the following LSS selectors to style active and inactive states:

```css
selector.__disabled__ {
}

selector:disabled {
}

selector:not(.__disabled__) {
}

selector:not(:disabled) {
}
```
:::

### `focusable`
Elements are `focusable: false` by default. Some components, such as `TextField`, are focusable by design, but you can still manually change an element’s focusable state.  
Only when `focusable` is set to `true` can an element be focused via `focus()` or by mouse interaction.

::: info
When an element is in the `focused` state, a `__focused__` class is automatically added.  
You can style focused and unfocused states using the following LSS selectors:

```css
selector.__focused__ {
}

selector:focused {
}

selector:not(.__focused__) {
}

selector:not(:focused) {
}
```
:::

### `hover state`
When an element is hovered, a `__hovered__` class is automatically added.  
For CSS compatibility, you can use `:hover` as selector sugar, which is equivalent to `.__hovered__`.

```css
selector.__hovered__ {
}

selector:hover {
}
```

### `isInternalUI`
This is a special state that indicates whether an element is an internal part of a component.  
For example, a `button` contains an internal `text` element used for rendering its label.

Semantically, internal elements are not allowed to be added, removed, or reordered directly.  
However, you can still edit their styles and manage their child elements via the editor or XML.  
In the editor, internal elements are displayed in gray in the hierarchy view.

In XML, you can access internal elements using the `#!xml &lt;internal index="..."/&gt;` tag, where `index` specifies which internal element to reference:

```xml
<button>
    <!-- obtain the internal text component here -->
    <internal index="0">
    </internal>
</button>
```
::: info
In LSS, you can use :host and :internal to explicitly target host or internal elements. By default, selectors match both unless constrained.
```css
button > text {
}

button > text:internal {
}

button > text:host {
}
```
:::
---

## Fields

> Only public or protected fields that are externally observable or configurable are listed.

| Name           | Type          | Access                  | Description                                              |
| -------------- | ------------- | ----------------------- | -------------------------------------------------------- |
| `taffyStyle`   | `TaffyLayoutStyle` | protected (getter) | Underlying Taffy style bridge used for layout calculation. |
| `nodeId`       | `NodeId`      | protected (getter)      | Node handle registered in the `TaffyTree`.              |
| `modularUI`    | `ModularUI`   | private (getter)        | The `ModularUI` instance this element belongs to.        |
| `id`           | `String`      | private (getter/setter) | Element ID, used by selectors and queries.               |
| `classes`      | `Set&lt;String&gt;` | private (getter)        | CSS-like class list applied to this element.             |
| `styleBag`     | `StyleBag`    | private (getter)        | Stores resolved style candidates and computed styles.    |
| `styles`       | `List&lt;Style&gt;` | private (getter)        | Inline styles attached to this element.                  |
| `layoutStyle`  | `LayoutStyle` | private (getter)        | Layout-related style wrapper for layout properties.      |
| `style`        | `BasicStyle`  | private (getter)        | Basic visual styles (background, overlay tint color, opacity, zIndex, etc.). |
| `isVisible`    | `boolean`     | private (getter/setter) | Whether the element is visible.                          |
| `isActive`     | `boolean`     | private (getter/setter) | Whether the element participates in logic and events.    |
| `focusable`    | `boolean`     | private (getter/setter) | Whether the element can receive focus.                   |
| `isInternalUI` | `boolean`     | private (getter)        | Marks internal (component-owned) elements.               |

---

## Methods

### Layout & Geometry

| Method                        | Signature                                 | Description                                              |
| ----------------------------- | ----------------------------------------- | -------------------------------------------------------- |
| `getLayout()`                 | `LayoutStyle`                             | Returns the layout style controller.                     |
| `layout(...)`                 | `UIElement layout(Consumer&lt;LayoutStyle&gt;)` | Modify layout properties fluently.                       |
| `getTaffyLayout()`            | `Layout`                                  | Returns the resolved Taffy layout result for this element. |
| `getPositionX()`              | `float`                                   | Absolute X position on screen.                           |
| `getPositionY()`              | `float`                                   | Absolute Y position on screen.                           |
| `getSizeWidth()`              | `float`                                   | Computed width of the element.                           |
| `getSizeHeight()`             | `float`                                   | Computed height of the element.                          |
| `getContentX()`               | `float`                                   | X position of content area (excluding border & padding). |
| `getContentY()`               | `float`                                   | Y position of content area.                              |
| `getContentWidth()`           | `float`                                   | Width of content area.                                   |
| `getContentHeight()`          | `float`                                   | Height of content area.                                  |
| `adaptPositionToScreen()`     | `void`                                    | Adjusts position to stay within screen bounds.           |
| `adaptPositionToElement(...)` | `void`                                    | Adjusts position to stay inside another element.         |

---

### Tree Structure

| Method               | Signature                             | Description                                       |
| -------------------- | ------------------------------------- | ------------------------------------------------- |
| `getParent()`        | `UIElement`                           | Returns parent element, or `null`.                |
| `getChildren()`      | `List&lt;UIElement&gt;`                     | Returns an unmodifiable list of children.         |
| `addChild(...)`      | `UIElement addChild(UIElement)`       | Adds a child element.                             |
| `addChildren(...)`   | `UIElement addChildren(UIElement...)` | Adds multiple children.                           |
| `removeChild(...)`   | `boolean removeChild(UIElement)`      | Removes a child element.                          |
| `removeSelf()`       | `boolean`                             | Removes this element from its parent.             |
| `clearAllChildren()` | `void`                                | Removes all children.                             |
| `isAncestorOf(...)`  | `boolean`                             | Checks if this element is an ancestor of another. |
| `getStructurePath()` | `ImmutableList&lt;UIElement&gt;`            | Path from root to this element.                   |

---

### Style & Classes

| Method             | Signature                                    | Description                                         |
| ------------------ | -------------------------------------------- | --------------------------------------------------- |
| `style(...)`       | `UIElement style(Consumer&lt;BasicStyle&gt;)`      | Modify inline visual styles.                        |
| `lss(...)`         | `UIElement lss(String, Object)`              | Apply a stylesheet-style property programmatically. |
| `addClass(...)`    | `UIElement addClass(String)`                 | Adds a CSS-like class.                              |
| `removeClass(...)` | `UIElement removeClass(String)`              | Removes a class.                                    |
| `hasClass(...)`    | `boolean`                                    | Checks if the class exists.                         |
| `getLocalStylesheets()` | `List&lt;Stylesheet&gt;`                       | Returns local stylesheets attached to this element. |
| `addLocalStylesheet(...)` | `UIElement addLocalStylesheet(Stylesheet)` | Adds a local stylesheet (self + descendants only).  |
| `addLocalStylesheet(...)` | `UIElement addLocalStylesheet(String)`     | Parses and adds local stylesheet from LSS text.     |
| `removeLocalStylesheet(...)` | `UIElement removeLocalStylesheet(Stylesheet)` | Removes a local stylesheet from this element scope. |
| `clearLocalStylesheets()` | `UIElement`                              | Removes all local stylesheets attached to this element. |
| `transform(...)`   | `UIElement transform(Consumer&lt;Transform2D&gt;)` | Applies a 2D transform.                             |
| `animation()`      | `StyleAnimation`                             | Creates a style animation targeting this element. See [StyleAnimation](../preliminary/style_animation.md). |
| `animation(a -> {})`| `StyleAnimation`                            | Runs animation setup immediately if `ModularUI` is valid, or once on `MUI_CHANGED` when it becomes valid. |

---

### Focus & Interaction

| Method           | Signature     | Description                                          |
| ---------------- | ------------- | ---------------------------------------------------- |
| `focus()`        | `void`        | Requests focus for this element.                     |
| `blur()`         | `void`        | Clears focus if this element is focused.             |
| `isFocused()`    | `boolean`     | Returns true if this element is focused.             |
| `isHover()`      | `boolean`     | Returns true if mouse is directly over this element. |
| `isSelfOrChildHover()` | `boolean`     | Returns true if a slef or child is hovered.                  |
| `startDrag(...)` | `DragHandler` | Starts a drag operation.                             |

---

### Events

| Method                               | Signature                                                      | Description                              |
| ------------------------------------ | -------------------------------------------------------------- | ---------------------------------------- |
| `addEventListener(...)`              | `UIElement addEventListener(String, UIEventListener)`          | Registers a bubble-phase event listener. |
| `addEventListener(..., true)`        | `UIElement addEventListener(String, UIEventListener, boolean)` | Registers a capture-phase listener.      |
| `removeEventListener(...)`           | `void`                                                         | Removes an event listener.               |
| `stopInteractionEventsPropagation()` | `UIElement`                                                    | Stops mouse & drag event propagation.    |

#### Usage

<DocTabs>
<DocTab title="Java">

```java
// Bubble-phase listener (default): fires after children handle the event
element.addEventListener(UIEvents.MOUSE_DOWN, event -> {
    event.currentElement.focus();
});

// Capture-phase listener: fires before children handle the event
element.addEventListener(UIEvents.CLICK, event -> {
    event.stopPropagation(); // prevent children from seeing this event
}, true);

// Removing a specific listener
UIEventListener listener = event -> { /* ... */ };
element.addEventListener(UIEvents.CLICK, listener);
element.removeEventListener(UIEvents.CLICK, listener);

// Stop all mouse/drag events from bubbling to parent elements
element.stopInteractionEventsPropagation();
```

</DocTab>
<DocTab title="Kotlin">

```kotlin
element {
    // Bubble events (default)
    events {
        UIEvents.MOUSE_DOWN += UIEventListener { it.currentElement.focus() }
        UIEvents.CLICK on { event -> /* handle click */ }
    }
    // Capture events
    events(capture = true) {
        UIEvents.CLICK on { it.stopPropagation() }
    }
}
```

</DocTab>
<DocTab title="KubeJS">

```js
element.addEventListener(UIEvents.MOUSE_DOWN, event => {
    event.currentElement.focus();
});
```

</DocTab>
</DocTabs>

#### Available Events

| Event | Description |
| ----- | ----------- |
| `UIEvents.MOUSE_DOWN` | Mouse button pressed over the element |
| `UIEvents.MOUSE_UP` | Mouse button released |
| `UIEvents.CLICK` | Mouse clicked (pressed and released on the same element) |
| `UIEvents.DOUBLE_CLICK` | Mouse double-clicked |
| `UIEvents.MOUSE_MOVE` | Mouse moved while over the element |
| `UIEvents.MOUSE_ENTER` | Mouse pointer entered the element's bounds |
| `UIEvents.MOUSE_LEAVE` | Mouse pointer left the element's bounds |
| `UIEvents.MOUSE_WHEEL` | Mouse wheel scrolled |
| `UIEvents.DRAG_ENTER` | A drag operation entered this element |
| `UIEvents.DRAG_LEAVE` | A drag operation left this element |
| `UIEvents.DRAG_UPDATE` | Drag target position updated |
| `UIEvents.DRAG_SOURCE_UPDATE` | Drag source position updated |
| `UIEvents.DRAG_PERFORM` | Item was dropped on this element |
| `UIEvents.DRAG_END` | Drag operation ended |
| `UIEvents.FOCUS` | Element gained keyboard focus |
| `UIEvents.BLUR` | Element lost keyboard focus |
| `UIEvents.FOCUS_IN` | Focus moved into this element's subtree |
| `UIEvents.FOCUS_OUT` | Focus moved out of this element's subtree |
| `UIEvents.KEY_DOWN` | Keyboard key pressed |
| `UIEvents.KEY_UP` | Keyboard key released |
| `UIEvents.CHAR_TYPED` | A printable character was typed |
| `UIEvents.HOVER_TOOLTIPS` | Tooltip collection when hovering |
| `UIEvents.VALIDATE_COMMAND` | Slash command validation |
| `UIEvents.EXECUTE_COMMAND` | Slash command execution |
| `UIEvents.LAYOUT_CHANGED` | Layout was recalculated |
| `UIEvents.STYLE_CHANGED` | Styles were recomputed |
| `UIEvents.REMOVED` | Element was removed from its parent |
| `UIEvents.ADDED` | Element was added to a parent |
| `UIEvents.MUI_CHANGED` | `ModularUI` association changed |
| `UIEvents.TICK` | Periodic client-side tick |

---

### Client–Server Sync & RPC

| Method                     | Signature   | Description                                |
| -------------------------- | ----------- | ------------------------------------------ |
| `addSyncValue(...)`        | `UIElement` | Registers a synced value.                  |
| `removeSyncValue(...)`     | `UIElement` | Unregisters a synced value.                |
| `addRPCEvent(...)`         | `RPCEmitter` | Registers an RPC event.                    |
| `sendEvent(...)`           | `void`      | Sends an RPC event to server.              |
| `sendEvent(..., callback)` | `&lt;T&gt; void`  | Sends an RPC event with response callback. |

#### Server Events

Server-side event listeners run on the **server** instead of the client. They use the same `UIEvents` type constants and support both bubble and capture phases. They are automatically synchronized via an internal RPC mechanism.

<DocTabs>
<DocTab title="Java">

```java
// Runs on the server when UIEvents.TICK fires
element.addServerEventListener(UIEvents.TICK, event -> {
    // server-side tick logic
});
```

</DocTab>
<DocTab title="Kotlin">

```kotlin
element {
    serverEvents {
        UIEvents.TICK on { event ->
            // server-side logic
        }
    }
    // Capture phase on server
    serverEvents(capture = true) {
        UIEvents.CLICK on { it.stopPropagation() }
    }
}
```

</DocTab>
</DocTabs>

#### RPC Events

RPC (Remote Procedure Call) events let the client explicitly invoke logic on the server and optionally receive a response.

<DocTabs>
<DocTab title="Java">

```java
// Register an RPC event during element initialization
RPCEmitter emitter = element.addRPCEvent(ele ->
    RPCEventBuilder.simple(UIEvents.CLICK, (e, args) -> {
        // This runs on the server
        ServerPlayer player = e.modularUI.player;
        player.sendSystemMessage(Component.literal("Hello from server!"));
    })
);

// Trigger the RPC from client (e.g., inside a client event listener)
element.addEventListener(UIEvents.CLICK, event ->
    element.sendEvent(emitter.event())
);
```

</DocTab>
</DocTabs>

#### Data Bindings

Data bindings automatically synchronize values between server and client. Use `addSyncValue` in Java, or the `bind*` DSL helpers in Kotlin.

<DocTabs>
<DocTab title="Java">

```java
// Bidirectional: synced server <-> client
element.addSyncValue(new SyncValue<>(Integer.class,
    () -> myData.count,
    v  -> myData.count = v
));
```

</DocTab>
<DocTab title="Kotlin">

```kotlin
element({}) {
    // Bidirectional (server <-> client)
    bind({ myData.count }, { myData.count = it })

    // Server → client only
    bindS2C({ myData.count })

    // Client → server only
    bindC2S({ v -> myData.count = v })

    // Bind a mutable property directly (bidirectional)
    bind(myData::count)
}
```

</DocTab>
</DocTabs>

---

### Rendering

| Method                       | Signature | Description                            |
| ---------------------------- | --------- | -------------------------------------- |
| `isDisplayed()`              | `boolean` | Returns true if display is not `NONE`. |
