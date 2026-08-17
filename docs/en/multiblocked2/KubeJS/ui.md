# UI Behavior

<VersionBadge version="Minecraft 1.21.1 / MBD2 21.0.11" label="Applies to" icon="tag" />
<VersionBadge version="LDLib2 2.2.35" label="UI API" icon="tag" />

<figure><img src="/assets/multiblocked2/editor/machine-ui.png" alt="The modern LDLib2 UIElement canvas in the MBD2 machine UI editor"><figcaption>Create the UIElement tree and stable IDs in the editor, then attach runtime behavior with KubeJS.</figcaption></figure>

`MBDMachineEvents.onUI` still exists in 1.21.1, but `wrapper.event.ui` is now an LDLib2 2.x `UI`, not the WidgetGroup used by old 1.20.1 documentation. Element queries, event names, and server callbacks must use the new framework.

## 1.21.1: attach server behavior to an editor button

<VersionBadge version="Minecraft 1.21.1" label="Current API" icon="tag" />

```js
// kubejs/server_scripts/mbd2_ui.js
MBDMachineEvents.onUI('example:crusher', wrapper => {
  const { machine, ui, player } = wrapper.event

  // UI.selectId returns a Java Stream. The ID comes from the editor UIElement.
  const flush = ui.selectId('flush_button').findFirst().orElse(null)
  if (flush === null) {
    console.warn('Missing UI element #flush_button on example:crusher')
    return
  }

  // Authoritative machine changes belong in a server event listener.
  flush.addServerEventListener(UIEvents.MOUSE_DOWN, click => {
    if (click.button !== 0) return

    const output = machine.getTraitByName('output_items')
    if (output === null) return

    // Extract through the handler; do not mutate returned ItemStacks in place.
    for (let slot = 0; slot < output.storage.slots; slot++) {
      output.storage.extractItem(slot, 64, false)
    }
  })
})
```

Place this in `server_scripts`: MBD2 `onUI` is a targeted server-side machine event. LDLib2 synchronizes the UI RPC behavior registered by `addServerEventListener` to the corresponding client element.

## Selecting elements

<VersionBadge version="LDLib2 2.2.x" label="Current UI" icon="tag" />

```js
const byId = ui.selectId('status_label').findFirst().orElse(null)
const allButtons = ui.select('.action').toList()
const typed = ui.selectId('progress', ProgressBar).findFirst().orElse(null)
const root = ui.rootElement
```

| API | Result | Use |
| --- | --- | --- |
| `ui.selectId(id)` | `Stream<UIElement>` | Exact ID lookup |
| `ui.select(selector)` | `Stream<UIElement>` | LDLib2 selector lookup |
| `ui.selectId(id, Type)` | `Stream<Type>` | ID lookup constrained by element type |
| `ui.rootElement` | `UIElement` | Edit the tree or append elements |

Do not mix `ModularUI.getElementById(...)` with `UI.selectId(...)`: `onUI` exposes the `UI` description before it is wrapped in a `ModularUI`.

## Client visuals and server behavior

`MBDMachineEvents.onUI` is registered as a server machine event in 21.0.11. Use it for `addServerEventListener`, server data sources, or replacing the server-created UI. A normal `addEventListener` is a client listener; do not assume a JavaScript lambda created by this server callback becomes client script code.

To construct both client and server UI from KubeJS, use LDLib2 `LDLib2UI.block/item/player` and register the same ID on both sides as its documentation describes. Use LDLib2 data binding or server events/RPC for synchronized data. Continue with:

- [LDLib2 KubeJS UI support](../../ldlib2/ui/kjs_support.md)
- [LDLib2 UI Factory and script placement](../../ldlib2/ui/factory.md)
- [UIElement selectors, events, and server listeners](../../ldlib2/ui/components/element.md)
- [Data bindings](../../ldlib2/ui/preliminary/data_bindings.md)
- [UI event propagation](../../ldlib2/ui/preliminary/event.md)

## Legacy 1.20.1 syntax: migration reference only

<VersionBadge version="Minecraft 1.20.1 / MBD2 1.0.x" label="Legacy; not valid on 1.21.1" icon="tag" />

```js
// ❌ Old Widget API. These methods do not exist on the 1.21.1 UI.
const button = event.event.ui.getFirstWidgetById('example:flush')
button.setOnPressCallback(click => { /* ... */ })
```

| 1.20.1 Widget API | 1.21.1 LDLib2 UI API |
| --- | --- |
| `getFirstWidgetById(id)` | `ui.selectId(id).findFirst().orElse(null)` |
| `setOnPressCallback(...)` | `addEventListener(...)` or `addServerEventListener(...)` |
| `isRemote` checks in Widget callbacks | Select a client listener or server listener explicitly |
| WidgetGroup hierarchy | `UIElement` tree, selectors, and LSS |

::: warning
`onUI` can replace `event.ui`, but most packs should query and enhance the editor-generated tree. For a fully script-built standalone UI, use the LDLib2 `LDLib2UI.*` factories instead of treating a machine UI as a generic window factory.
:::
