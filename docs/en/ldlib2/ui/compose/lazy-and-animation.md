# Lazy Lists and Animation

<VersionBadge version="2.2.44" label="Since" icon="tag" />

## Lazy lists

`LazyColumn`, `LazyRow` and `LazyVerticalGrid` only compose the items you can see. Two empty spacers stand in for everything above and below, so the scrollbar still reflects the whole list. A list of ten thousand rows mounts fewer than 40 elements.

```kotlin
LazyColumn(items = recipes, itemHeight = 18f, key = { _, r -> r.id }) { _, recipe ->
    RecipeRow(recipe)
}

LazyVerticalGrid(items = stacks, columns = 9, cellWidth = 18f, cellHeight = 18f) { _, stack ->
    ItemSlot(item = stack)
}
```

| Composable | Size parameters | Defaults |
| --- | --- | --- |
| `LazyColumn` | `itemHeight: Float`, `variableHeight` | `variableHeight = false`, `overscan = 2` |
| `LazyRow` | `itemWidth: Float`, `variableWidth` | `variableWidth = false`, `overscan = 2` |
| `LazyVerticalGrid` | `columns: Int`, `cellWidth`, `cellHeight`, `variableHeight` | `variableHeight = false`, `overscan = 1` |

All three take `items: List<T>`, an optional `key: (index, item) -> Any`, and `itemContent: @Composable (index, item) -> Unit`. `overscan` is how many extra rows stay mounted beyond each edge.

Rules for correct results:

- **Give each row the height you declare.** With `variableHeight` off, `itemHeight` is not applied to the rows. Size each row yourself (`layout = { height(18.px) }`), or the spacers and the rows disagree.
- **Use stable keys.** The default key is the index, which is only right for a list that grows at the end. Keys should be unique; repeated keys are told apart by position.
- **Hand over a new list to signal a change.** `items` is compared by identity. Pass a new list, or a `mutableStateListOf` whose size changes. Replacing one element in place shows the new element, but under the old element's key, saved state and measured size.
- **Rows that scroll out leave the composition.** Their `remember` state is lost. `rememberSaveable` state is saved per key and comes back when the row does; it is dropped once the key leaves `items`. Shared state, such as the selection, belongs above the list.

When the data changes, the list stays on the row it was showing: the first visible row keeps its place on screen, whether items were added above it, below it, or removed. If that row itself was removed, the row that took its place stays.

`LazyRow` scrolls horizontally with the plain mouse wheel; Shift is not needed.

### Variable sizes

For rows of different heights (wrapping text, expandable rows), turn on `variableHeight`:

```kotlin
LazyColumn(items = messages, itemHeight = 14f, variableHeight = true) { _, message ->
    Text(message.text)   // height decided by the content
}
```

`itemHeight` becomes the estimate for rows that have not been on screen yet. Each row is measured once it is laid out.

| Cost | Detail |
| --- | --- |
| One wrapper element per row | Used to measure the row. |
| One settling frame | A new row occupies the estimate on its first frame. |
| Scrollbar adjusts | The scrollbar size moves slightly while estimates are replaced. The content on screen does not jump. |
| Rows must have a height | A row measured at 0 is rejected. |

Fixed heights are faster and exact; prefer them when you can.

`LazyRow(variableWidth = true)` measures widths the same way. `LazyVerticalGrid(variableHeight = true)` makes each row as tall as its tallest cell and stretches the other cells to match. Grid column widths are always fixed.

::: warning Grid cells that change rows
A grid cell keeps its `rememberSaveable` state while it scrolls out and back. When an insert or removal moves a cell into **another row**, it is rebuilt there and keeps neither `remember` nor `rememberSaveable` state. Keep state that must follow a cell above the grid, keyed by item.
:::

## Animation

The animation API is part of this module. It is not `androidx.compose.animation`. Easing uses LDLib2's own `Eases`, the same curves as stylesheet `transition` and `StyleAnimation`.

```kotlin
val alpha by animateFloatAsState(if (expanded) 1f else 0f, tween(200, easing = Eases.QUAD_OUT))
Box(style = { opacity(alpha) }) { Details() }   // read in a block: no recomposition

// A spring keeps its velocity when the target changes mid-flight.
val offset by animateFloatAsState(target, spring(dampingRatio = 0.6f, stiffness = 300f))

// Imperative: sequences, interruptible moves.
val x = rememberAnimatable(0f)
LaunchedEffect(Unit) {
    x.animateTo(100f, spring())
    x.animateTo(0f, tween(400))
}
```

| API | Notes |
| --- | --- |
| `animateFloatAsState(target, spec, finishedListener)` | Default spec is `TweenSpec()`: 250 ms, linear. |
| `animateIntAsState(target, spec, finishedListener)` | Same, for `Int`. |
| `animateColorAsState(target, spec, finishedListener)` | Packed ARGB `Int`, blended in Oklab like a stylesheet transition. A new target starts from the colour currently on screen. |
| `rememberAnimatable(initial)` / `Animatable` | `animateTo(target, spec = spring())` suspends until it arrives; `snapTo` jumps. Only one animation runs at a time. |
| `tween(durationMillis = 250, delayMillis = 0, easing = Eases.LINEAR)` | Fixed-duration curve. |
| `spring(dampingRatio = 1f, stiffness = 400f, threshold = 0.01f)` | Physics-based; no fixed duration. Parameters must be positive and finite. |

- `animate*AsState` only restarts when the **target** changes. A spec that changes along the way applies from the next target.
- `finishedListener` is called when an animation actually reaches its target. Not for the initial value, and not for an animation interrupted by a new target.
- Spring speed does not depend on frame rate.
- An infinite target jumps there directly instead of interpolating.

### `AnimatedVisibility`

`if (visible)` removes content on the same frame, so there is nothing left to animate out. `AnimatedVisibility` keeps the content composed until its exit transition has finished:

```kotlin
AnimatedVisibility(
    visible = shown,
    enter = fadeIn() + slideInVertically() + expandVertically(),
    exit = fadeOut() + shrinkVertically(),
) {
    Details()
}
```

Combine transitions with `+`. They run together, each with its own spec (default `TweenSpec()`). If the same kind appears twice, the left one wins.

| Enter / exit | Animates |
| --- | --- |
| `fadeIn` / `fadeOut` | Opacity |
| `slideIn` / `slideOut`, `slideInHorizontally` / `slideInVertically`, `slideOutHorizontally` / `slideOutVertically` | Draw offset, as a fraction of the content's own size (`-1f` on x is one full width to the left) |
| `scaleIn` / `scaleOut` | Draw scale around a pivot given as fractions of the size (centre by default) |
| `expandVertically` / `shrinkVertically`, `expandHorizontally` / `shrinkHorizontally` | The layout space the content takes. Neighbours move smoothly; the content is clipped while it runs. |

Differences from Jetpack Compose:

- The defaults are `fadeIn()` and `fadeOut()` only. Ask for `expand*` / `shrink*` explicitly; it adds a measuring wrapper.
- Slide and scale only change drawing. Neighbours do not move unless you also add `expandVertically` or `expandHorizontally`.
- Size animation works on one axis. Enter and exit must use the same axis, or `AnimatedVisibility` throws.
- While the size animates, that axis belongs to the animation. Set the size on the content, not in the `layout` of `AnimatedVisibility`.
- Expanding across a parent that stretches its children animates to the content's own size, then snaps to the stretched size. Give the box an `alignSelf` to avoid that.
- Content visible on the first composition appears without an entrance. An interrupted transition reverses from where it is.

::: info Compose animation vs `StyleAnimation`
These animations drive composition state, so whatever reads them in a composable body recomposes every frame. Read the value inside a `style` or `layout` block to re-run just that block. LDLib2's own [`StyleAnimation`](../preliminary/style_animation.md) writes styles directly without touching the composition. Both are available.
:::
