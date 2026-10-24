# Components

<VersionBadge version="2.2.44" label="Since" icon="tag" />

Every widget registered in LDLib2's `ldlib2:ui_element` registry has a composable wrapper. The wrappers are thin calls to [`UIElementNode`](#wrapping-any-element), which also works for widgets that have no wrapper, including other mods' widgets.

## Widget table

| LDLib2 element | Composable |
| --- | --- |
| `UIElement` | `Box`, `Column`, `Row`, `Spacer` |
| `TextElement`, `Label` | `Text`, `Label` |
| `Button` | `Button` |
| `TextField`, `TextArea`, `CodeEditor` | `TextField`, `TextArea`, `CodeEditor` |
| `Switch`, `Toggle`, `ToggleGroupElement` | `Switch`, `Toggle`, `ToggleGroup` |
| `Slider`, `Scroller` | `Slider`, `SliderVertical`, `ScrollerHorizontal`, `ScrollerVertical` |
| `Selector`, `ColorSelector`, `SearchComponent` | `Selector`, `ColorSelector`, `SearchComponent` |
| `TagField`, `StructuredTagEditor` | `TagField`, `StructuredTagEditor` |
| `ItemSlot`, `FluidSlot`, `InventorySlots` | `ItemSlot`, `FluidSlot`, `InventorySlots` |
| `ProgressBar` | `ProgressBar` |
| `ScrollerView` | `ScrollView` |
| `SplitView` | `SplitViewHorizontal`, `SplitViewVertical` |
| `TabView`, `Tab` | `TabView { tab(...) }` |
| `TreeList`, `Inspector`, `Scene`, `GraphView` | `TreeList`, `Inspector`, `Scene`, `GraphView` |
| `UITemplateElement` | `UITemplate` |
| `BindableValue` | `BindableValue` (mirrors a value only; it cannot carry a synced binding) |
| `VirtualScrollerView` | Not wrapped. Use [`LazyColumn`, `LazyRow` or `LazyVerticalGrid`](./lazy-and-animation.md). |

`Dialog` is not a registered element but has a wrapper too.

## Controlled widgets

Widgets that hold a value are **controlled**: the composition owns the value, and the widget reports edits back.

```kotlin
var name by remember { mutableStateOf("") }
TextField(value = name, onValueChange = { name = it })
```

After each edit, the widget compares itself with the composed value and writes it back if they differ. So:

- To refuse an edit, do not store it. `onValueChange = { if (it.length <= 5) name = it }` is a field limited to five characters.
- To make a widget read-only, ignore the callback.

| Composable | Value parameters |
| --- | --- |
| `TextField`, `Slider`, `SliderVertical`, `ScrollerHorizontal`, `ScrollerVertical`, `BindableValue` | `value`, `onValueChange` |
| `Switch`, `Toggle` | `checked`, `onCheckedChange` |
| `Selector`, `SearchComponent` | `selected`, `onSelectedChange` |
| `TreeList` | `selected: Set<N>`, `onSelectedChange` |
| `ItemSlot` | `item`, `onItemChange` (defaults to ignoring edits) |
| `FluidSlot` | `fluid`, `onFluidChange` (defaults to ignoring edits) |
| `ColorSelector` | `color`, `onColorChange` |
| `TagField`, `StructuredTagEditor` | `tag: Tag?`, `onTagChange` |
| `TextArea`, `CodeEditor` | `lines: List<String>`, `onLinesChange` |

Details worth knowing:

- **Writes from the composition are not reported as edits.** A slider re-clamped by a new `range`, or a toggle group checking a neighbour after its toggle was removed, does not call `onValueChange`. If that leaves the widget and the state disagreeing, the widget is set back to the state.
- **Configuration is applied before the value.** `Slider(50f, onValueChange, range = 0f..100f)` starts at 50; it is not first clamped to the default `0f..1f`.
- **The caret survives corrections.** `TextField`, `TextArea` and `CodeEditor` keep the caret where it was when a value is written back.
- **Mutable values are reported as copies.** `ItemSlot`, `FluidSlot`, `TagField` and `StructuredTagEditor` report a copy, so the next edit cannot change what you stored. `ItemStack` and `FluidStack` are compared by content.

`TextField` has three ways to restrict input:

| Option | Behaviour |
| --- | --- |
| `charFilter` | Refuses a typed character before it lands. Pasted text containing a refused character is treated as invalid. |
| `validator` | Judges the whole text. Invalid text stays in the field, shown as an error, and is not reported. |
| Not storing in `onValueChange` | The field returns to the stored value on the next frame. Use it for corrections, such as clamping a number. |

::: warning Menu slots and server-side search
A composition only runs on the client, so a widget that has to exist on the server cannot be composed:

- `InventorySlots` registers menu slots. The composable version only works in a screen that is not a menu, where it shows the player's inventory read-only. Used in a menu, it logs an error and stays unbound.
- An `ItemSlot` that takes part in menu slot sync, or a `SearchComponent` that searches on the server, has the same problem.

Build such widgets in `createUI` and add them to the tree there, outside the `ComposeElement`. Do not use `Mount` for them either: it also runs on the client only.

The composed `FluidSlot` does not register the click-to-fill RPC, so clicking it with a fluid container does nothing.
:::

## Containers

**`ScrollView`.** `layout` sizes the scroll view itself. Spacing between children (`gap`, `padding`, direction) goes in `contentLayout`; in `layout` it would push the scrollbars instead.

```kotlin
ScrollView(layout = { height(80.px) }, contentLayout = { gap { all(2.px) } }) {
    rows.forEach { row -> key(row.id) { RowItem(row) } }
}
```

**`Dialog`.** A dialog shown over the whole UI:

```kotlin
Dialog(
    visible = confirming,
    onDismiss = { confirming = false },
    title = { Text("Delete it?") },
    buttons = { Button(onClick = { delete(); confirming = false }, text = "Delete") },
) {
    Text("This cannot be undone.")
}
```

- A dialog visible on the first composition opens on the first frame after its UI exists.
- The `title`, `buttons` and content slots are only composed while the dialog shows.
- The player can close it with Escape (`dismissOnEscape`, default `true`) or a click outside (`dismissOnClickOutside`, default `false`). With either enabled, focus moving outside the dialog also closes it. Each of these calls `onDismiss`.
- `onDismiss` is not called when the dialog closes because `visible` turned false.

::: info Escape and dialogs
Escape only reaches a dialog when its `ModularUI` is set to `shouldCloseOnEsc(false)`. Otherwise Escape closes the whole screen first.
:::

**`TabView`.**

```kotlin
var current: Any by remember { mutableStateOf("general") }
TabView(selectedKey = current, onSelect = { current = it }) {
    tab("general", "General") { GeneralPage() }
    tab("advanced", "Advanced") { AdvancedPage() }
}
```

- Tab headers follow the declared order. Reordering the `tab(...)` calls moves the existing tabs; selection and each page's remembered state are kept.
- Tab keys must be unique. A repeated key throws `IllegalArgumentException`.
- `selectedKey = null` lets the widget manage its own selection.
- `onSelect` is called when the player picks a tab, and once when the selected tab is removed and `selectedKey` does not name a remaining tab. It is not called for selections the composable makes itself.

**`SplitViewHorizontal` / `SplitViewVertical`.** Two slots (`left`/`right` or `top`/`bottom`). `initialPercentage` only sets where the divider starts; the widget reports no drag.

**`ToggleGroup`.** At most one of the `Toggle`s placed **directly** inside it is on. Drive the toggles from one piece of state, as in `checked = selected == "a"`. `allowEmpty = true` allows unchecking the last one.

## Wrapping any element

`UIElementNode` emits any `UIElement` subclass:

```kotlin
UIElementNode(
    factory = { TreeList<TreeNode<String, String>>().setFlattenRoot(true) },
    layout = { size(240.px, 60.px) },
    update = { set(depth) { setRoot(root) } },
)
```

| Parameter | Use |
| --- | --- |
| `factory` | Builds the element. Runs once, when the node is created. |
| `update` | Runs on each recomposition. Wrap each property in `set(value) { ... }` so it only runs when that value changed. |
| `widgetStyle` | A block whose receiver is the element itself, run after `layout` and `style`. |
| `layout`, `style`, `classes`, `id`, `enabled`, `visible`, `focusable`, `events` | As for every composable. See [Styling and Events](./styling-and-events.md). |
| `content` | Composable children. |

::: warning `set(value)` compares with `equals`
`set(value)` only runs when `value` is not `equals` to the last one. The example above uses `set(depth)`, not `set(root)`, because `TreeNode.equals` compares the key and content only. Two different trees with the same root would be "equal", and `set(root)` would never run. Key on what actually changes, or use `reconcile { }` to run on every recomposition.
:::

**`Mount(element)`** places an element that already exists, built by hand or with the DSL, into the composition. The composition attaches, moves and detaches it but never touches its properties. Pass a stable element (from `remember`); a new instance on each recomposition replaces the old one each time.

**`Subcompose(container) { ... }`** composes content into another element rather than where the call sits. Use it for widgets with named slots, such as the two panes of a `SplitView`. It is a real subcomposition: `CompositionLocal`s reach it, it recomposes on the same frames, and it is disposed with its parent.

```kotlin
val view = remember { SplitView.Horizontal() }
UIElementNode(factory = { view }, layout = { size(200.px, 100.px) })
Subcompose(view.first) { LeftPane() }
Subcompose(view.second) { RightPane() }
```

`LocalUIElement.current` returns the `ComposeElement` hosting the composition, which gives access to its `ModularUI` and player.
