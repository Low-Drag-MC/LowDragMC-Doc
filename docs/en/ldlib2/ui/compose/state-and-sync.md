# State and Sync

<VersionBadge version="2.2.44" label="Since" icon="tag" />

State works as in Compose: `remember` keeps a value across recompositions, and `mutableStateOf` recomposes whatever reads it when it changes. This page covers what LDLib2 adds: state that survives a closed screen, bridges to LDLib2 data bindings, and UI whose shape is decided by the server.

## Where state lives

When a composable leaves the composition (an `if` turns false, a list item is removed, a row scrolls out of a `LazyColumn`), everything it `remember`ed goes with it. Hoist state to a level that lives as long as the state should:

```kotlin
// The selection lives outside the list, so recycled rows do not lose it.
var selected by remember { mutableStateOf(-1) }
LazyColumn(items, itemHeight = 14f) { index, item ->
    Text(item, classes = if (index == selected) "row selected" else "row")
}
```

Give list items a `key`. With a key, a reorder moves the existing elements, keeping focus, animations and internal state. Without one, items are matched by position, so the state of row 0 goes to whatever is row 0 next.

```kotlin
items.forEach { item -> key(item.id) { ItemRow(item) } }
```

## `rememberSaveable`

`rememberSaveable` is the standard Compose API from `androidx.compose.runtime.saveable`:

```kotlin
var query by rememberSaveable { mutableStateOf("") }
```

It outlives `remember` in three cases:

| Case | What you need |
| --- | --- |
| A row of a `LazyColumn`, `LazyRow` or grid scrolls out and back | Nothing. Each row saves under its `key`. |
| A `TabView` tab is removed and later declared again under the same key | Nothing. Each tab saves under its key. |
| The screen is closed and opened again | A `stateKey` on the screen |

```kotlin
composeModularUI(player, StylesheetManager.MODERN, stateKey = "mymod:furnace@$pos") { FurnaceScreen() }
// or
ComposeElement(stateKey = "mymod:furnace@$pos") { FurnaceScreen() }
```

The `stateKey` must identify both the screen and what it shows. With `"mymod:furnace"`, every furnace would share one set of state.

Differences from Android:

- Values are kept in memory as they are, **not serialised**. Any type works and no `Saver` is needed.
- Saved values stay reachable until cleared. Save values, not UI elements or objects that hold the level.
- Everything is cleared when the player leaves a world. Nothing is written to disk, so a game restart starts fresh.
- Clear it yourself with `ComposeSavedState.clear(key)` or `ComposeSavedState.clearAll()`.
- Two screens open at once under the same `stateKey` share the same live state. The one closed last decides what is kept.

## Bridges to LDLib2 data

Three extensions turn LDLib2 data into Compose state. In every case, **build the binding or data source outside the composition**, so its sync slot never moves.

| Extension | Use |
| --- | --- |
| `IDataProvider<T>.collectAsState(): State<T>` | Read-only. Recomposes when the provider changes. |
| `TrackData<T>.asMutableState(): MutableState<T>` | Two-way. Writes go to the `TrackData` and reach everything bound to it. |
| `IBinding<T>.asMutableState(): MutableState<T>` | Two-way view of a synced binding. Installs the state as the binding's client-side data source. |

```kotlin
// Built once, outside the composition.
val progress = TrackData(0f)
element.addSyncValue(
    DataBindingBuilder.floatValS2C { machine.progress }
        .remoteSetter(progress::setValue)
        .build().syncValue
)

// Inside a composable.
val value by progress.collectAsState()
ProgressBar(progress = value)
```

- Use `IBinding.asMutableState()` only for a binding that is not also bound to a widget. Both would claim the same data source, and the second one wins.
- Polling sources (`ITickable`, such as `SupplierDataSource`) are ticked from the host element's 20 Hz tick, so they update at tick rate, not frame rate. Each `collectAsState()` call ticks the source again: collect a polling source once and pass the state down.

## Server-driven UI

The number of rows, tabs or panels can be decided entirely by the server. One rule makes that work.

### The rule

`UISyncManager` numbers sync values and RPC events in registration order. The sender writes an index; the receiver looks it up in its own table. The indexes agree because both sides run the same `createUI`.

A composition runs on the client only, and it adds and removes elements as state changes. Anything registered inside it would shift every later index on the client only. That fails silently: one read at the wrong index corrupts the rest of the sync packet.

::: warning Register in `createUI`, use in the composition
Never call these inside a composable: `bindDataSource`, `setOnServerClick`, `addServerEventListener`, or anything else that registers a sync value or RPC event.

Some widgets register in their constructor. Check the constructor before wrapping one with `UIElementNode`. The built-in `FluidSlot` wrapper already leaves out its click RPC.
:::

### The pattern

One registration can carry any amount of dynamic content:

- **Server → client:** one sync value carries the whole model. Three rows or three hundred use the same slot.
- **Client → server:** messages. They are addressed by name over one shared RPC event, so sending a new message name registers nothing.

```kotlin
// Fields of the UI holder.
private var rows = listOf("alpha", "bravo")              // the server's list
private val model = mutableStateOf(emptyList<String>())  // the client's mirror

// In createUI, on both sides.
val host = ComposeElement { Rows(model) }

root.addChild(BindableValue<String>().bind(
    DataBindingBuilder.stringS2C { rows.joinToString("|") }
        .name("rows")
        .onRemoteSyncReceived { encoded ->
            model.value = encoded.orEmpty().split("|").filter { it.isNotEmpty() }
        }
        .build()
))

if (!player.level().isClientSide) {
    host.onMessage("remove") { tag -> rows = rows - tag.getString("row") }
}
root.addChild(host)
```

```kotlin
// In the composition, client only.
@Composable
fun Rows(model: State<List<String>>) {
    val rows by model
    val server = rememberServerMessenger()
    Column {
        rows.forEach { row ->
            key(row) {
                Button(onClick = { server.send("remove") { putString("row", row) } }, text = row)
            }
        }
    }
}
```

| `ServerMessenger` method | Sends |
| --- | --- |
| `send(name)` | A message with no payload |
| `send(name, data: CompoundTag)` | A message with a payload |
| `send(name) { putString(...) }` | A message with a payload built inline |
| `call(event: RPCEvent, vararg args)` | A typed RPC event. The event must be registered in `createUI`, on both sides. |

Register the message handlers on the `ComposeElement` built in `createUI`. That is the element messages go through, including from a `ComposeElement` nested inside the composition.

::: warning Add every `ComposeElement` on both sides
A `ComposeElement` built outside a composition registers the shared message RPC in its constructor. Build and add it on both sides, in the same order. Adding one on the client only shifts every RPC after it.

A `ComposeElement` created inside a composition (for example `remember { ComposeElement { ... } }`) exists on the client only and registers nothing. Its `rememberServerMessenger()` sends through the nearest enclosing one built in `createUI`.
:::

See [UI Message](../preliminary/data_bindings.md#ui-message) for the message API, and [Data Bindings](../preliminary/data_bindings.md) for bindings in general.
