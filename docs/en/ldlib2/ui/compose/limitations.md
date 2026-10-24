# Limitations

<VersionBadge version="2.2.44" label="Since" icon="tag" />

This page lists where `ldlib2-compose` differs from Jetpack Compose, and the side and lifecycle rules that are easy to break.

## Side and threading

::: warning The composition runs on the client render thread only
On a dedicated server, and on the integrated server's own thread in singleplayer (where a menu's `createUI` also runs), `ComposeElement.setContent` only records the content. The server half of a menu gets its data through ordinary bindings.

Coroutines started by effects (`LaunchedEffect`, `rememberCoroutineScope`) are resumed on the render thread, once per frame. Code after `delay()` therefore runs on the render thread too.
:::

Anything that registers a sync value, an RPC event or a menu slot must be created in `createUI`, outside the composition. See [State and Sync](./state-and-sync.md#server-driven-ui).

## Lifecycle

| Event | What happens to the composition |
| --- | --- |
| The element leaves its UI, or the screen closes | The composition is disposed. `remember` state is lost; `rememberSaveable` state is kept only with a `stateKey`. |
| A menu screen is covered by a recipe viewer such as JEI, then comes back | Same as above: disposed and rebuilt. Use `rememberSaveable` with a `stateKey` for state that must survive. |
| An editor window is minimised and restored | Nothing is lost. The element tree moves to a new `ModularUI` and the composition moves with it. |
| The content throws while composing | The error is logged and the element stays empty until the next `setContent`. |

::: warning Avoid these
- **Do not create a `ComposeElement` per frame**, for example in a tooltip component. A composition only releases the global snapshot system when its element is removed from a UI, and a tooltip's UI is dropped without removing anything.
- **Do not throw from `onDispose`.** Compose stops at the first cleanup that throws, so later `onDispose` blocks, including this module's own unsubscriptions, never run.
:::

## Differences from Jetpack Compose

| Area | Behaviour here |
| --- | --- |
| Runtime | JetBrains Compose runtime 1.8.2 only. No `compose.ui`, no `compose.foundation`. |
| Styling | Named parameters instead of a `Modifier` chain. Style properties have no order and are written through, never undone. Use `classes` for conditional appearance. |
| Blocks | A block that reads state re-runs on its own, but it can only change properties. Values that decide what is composed must be read in the function body. |
| Gestures | LDLib2 UI events with bubbling and drag-and-drop (`DragHandler`). No `pointerInput`, touch slop, fling or gesture detectors. |
| Animation | The module's own implementation. `AnimationSpec` is `TweenSpec` or `SpringSpec`; only `Float`, `Int` and ARGB colour values. `animateFloatAsState` defaults to a 250 ms linear tween, not a spring. |
| `AnimatedVisibility` | Fades only by default. Size changes are single-axis, and enter and exit must share the axis. |
| `rememberSaveable` | In memory only: survives a closed screen (with `stateKey`), scrolled-out rows and removed tabs. Cleared on leaving a world; never survives a restart. |
| Lazy lists | `items` is compared by identity. Fixed row sizes must actually be applied to the rows. Grid column widths are fixed. |
| Grid cells | A cell moved into another row by an edit loses its state. |
| `SplitView` | Only the initial divider position (`initialPercentage`) can be set; dragging reports nothing. |
| `Scene` | The camera belongs to the widget, not to composition state. |
| Accessibility | Composed elements contribute nothing to Minecraft's narrator. |

## Development environment

::: warning IntelliJ coroutine debug agent
An `IllegalAccessError` mentioning `DebugProbesKt` and `DebugProbesImpl` on the first Compose screen comes from IntelliJ's coroutine debug agent. Turn off the coroutine agent in the IDE settings, or launch with `gradlew runClient`. It cannot happen outside a development environment.
:::
