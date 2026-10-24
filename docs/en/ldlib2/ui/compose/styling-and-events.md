# Styling and Events

<VersionBadge version="2.2.44" label="Since" icon="tag" />

A composable takes its appearance and behaviour as named parameters, not a `Modifier` chain. The parameters reuse LDLib2's own layout and style DSL, so there are no new names to learn.

```kotlin
Button(
    onClick = { save() },
    text = "Save",
    layout = { width(60.px); padding { all(4.px) } },     // same receiver as layoutDsl { }
    style = { backgroundTexture(Sprites.RECT_RD) },       // same receiver as styleDsl { }
    buttonStyle = { hoverTexture(Sprites.RECT_RD_LIGHT) }, // the widget's own style facade
    classes = "primary",
)
```

Units are the ones the Kotlin DSL uses: `40.px`, `50.pct`, `auto`.

## Parameters

| Parameter | What it sets |
| --- | --- |
| `layout` | Size, spacing, flex and grid, position. Receiver `TaffyLayoutStyleDsl`. |
| `style` | Background, opacity, z-index, tooltip, transform. Receiver `BasicStyle`. |
| `xxxStyle` | The widget's own style facade (see the table below). |
| `classes` | Space-separated stylesheet classes, matched by `.name` selectors. |
| `id` | The element id, matched by `#id` selectors. |
| `enabled` | `false` calls `setActive(false)`, which adds `__disabled__` and stops input and ticks for the element and its children. |
| `visible` | Calls `setVisible`. |
| `focusable` | Calls `setFocusable`. `null` leaves the element's default alone. |
| `events` | Event handlers. See [Events](#events). |

| Widget | Style facade parameter |
| --- | --- |
| `Button` | `buttonStyle` |
| `Text`, `Label` | `textStyle` |
| `TextField` | `fieldStyle` |
| `TextArea`, `CodeEditor` | `areaStyle` |
| `Switch` | `switchStyle` |
| `Toggle` | `toggleStyle` |
| `Slider`, `SliderVertical` | `sliderStyle` |
| `ScrollView`, `ScrollerHorizontal`, `ScrollerVertical` | `scrollerStyle` |
| `Selector` | `selectorStyle` |
| `ItemSlot`, `FluidSlot` | `slotStyle` |
| `ProgressBar` | `barStyle` |
| `GraphView` | `graphStyle` |

`TabView`, `Dialog` and `AnimatedVisibility` take no `events` or `focusable`. `Spacer` only takes `layout`, `style` and `classes`.

## How each kind of parameter is applied

| Parameter | When the value changes | When you stop passing it |
| --- | --- | --- |
| `layout`, `style`, `xxxStyle` | Written to the element | **Stays written**. Nothing is undone. |
| `classes`, `events` | Diffed | Removed |
| `enabled`, `visible`, `id` | Written when it differs from the last value | Back to the parameter default |

Style blocks are written through, the same as `element.styleDsl { }`. A property set under an `if` stays set when the condition turns false:

```kotlin
textStyle = { if (hot) fontSize(18f) }           // wrong: stays large after hot turns false
textStyle = { fontSize(if (hot) 18f else 9f) }   // right: both branches write a value
classes = if (hot) "label hot" else "label"      // better: let the stylesheet decide
```

Writing the same value again is cheap: an unchanged value returns early without relayout.

A block that throws only affects its own node. The error is logged, that block is skipped, and the composition carries on.

::: info Wrapper defaults
Values a wrapper picks for you, such as the flex direction of `Row` or the adaptive height of `Text`, are written at `DEFAULT` origin. Your `layout` and `style` blocks write at `INLINE` origin, so both your blocks and stylesheets override wrapper defaults.

One exception: the adaptive height of `Text` and `Label` outranks a stylesheet `height`. A stylesheet rule that sizes text must also set `adaptive-height: false`.
:::

## Reading state in a block

A block can read snapshot state directly. When that state changes, only that block runs again; nothing recomposes:

```kotlin
val alpha by animateFloatAsState(if (shown) 1f else 0f)
Box(style = { opacity(alpha) })   // re-runs this block each frame, no recomposition
```

This is cheaper than reading the value in the function body, which recomposes the whole composable.

Two limits:

- Only blocks work this way. `classes`, `enabled` and the other plain parameters are evaluated in the function body and follow normal recomposition.
- A block can only change properties. A value that decides **what** is composed must be read in the function body:

```kotlin
val o = alpha.coerceIn(0f, 1f)   // read in the body: it decides whether the Box exists
if (visible || o > 0f) {
    Box(style = { opacity(o) })
}
```

## Events

`events` receives an `EventScope`:

```kotlin
Box(events = {
    onClick { count++ }
    onMouseEnter { hovered = true }
    onMouseLeave { hovered = false }
})
```

| Helper | Event |
| --- | --- |
| `onClick` | `mouseClick`: press and release on the same element |
| `onMouseDown`, `onMouseUp` | Mouse button down / up |
| `onMouseEnter`, `onMouseLeave` | Pointer enters / leaves. Always capture phase. |
| `onMouseWheel` | Wheel scrolled |
| `onKeyDown`, `onCharTyped` | Keyboard input |
| `onFocusIn`, `onFocusOut` | Focus gained / lost |
| `on(type, capture = false) { }` | Any other event type |

Each `(type, capture)` pair is registered on the element once, however often the block runs; recomposition only swaps the handler. Declaring the same event twice runs both handlers.

::: tip `onClick` vs `Button(onClick = …)`
`EventScope.onClick` fires on press **and** release. The `onClick` parameter of `Button` is the widget's own click, which fires on mouse-down and plays the click sound.
:::

`onMouseEnter` and `onMouseLeave` are registered in the capture phase. `ModularUI` dispatches these two events without a bubble phase, targeting the innermost element under the pointer, so a container only hears its children being hovered through capture.

## Hover and pressed state

For appearance alone, you do not need code. The hovered element and all its ancestors carry the `__hovered__` class:

```css
.card.__hovered__ {
    background: rect(#4a4a4a, 4);
}
```

When hovering has to change **what is composed** (different text, an extra child, an animation target), track it as state:

```kotlin
val interaction = rememberInteraction()
Box(events = { track(interaction) }) {
    Text(if (interaction.hovered) "Release to delete" else "Delete")
}
```

`InteractionState` has `hovered` and `pressed`. `pressed` has no class equivalent. `track` adds handlers next to your own, so it can share events with your `onMouseEnter`.
