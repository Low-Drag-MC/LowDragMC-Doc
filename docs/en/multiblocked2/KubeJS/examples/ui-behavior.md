# UI Behavior Example

<VersionBadge version="Minecraft 1.21.1 / MBD2 21.0.11" label="Current MBD2" icon="tag" />
<VersionBadge version="LDLib2 2.2.35" label="Current UI" icon="tag" />

<figure><img src="/assets/multiblocked2/editor/machine-ui.png" alt="MBD2 Machine UI editor with a stable reset_button element ID"><figcaption>Create the element and ID in the editor, then attach server behavior with `onUI`.</figcaption></figure>

```js
// kubejs/server_scripts/mbd2_ui.js
MBDMachineEvents.onUI('example:processor', wrapper => {
  const { machine, ui } = wrapper.event
  const reset = ui.selectId('reset_button').findFirst().orElse(null)
  if (reset === null) return

  reset.addServerEventListener(UIEvents.MOUSE_DOWN, event => {
    if (event.button !== 0) return
    const data = machine.customData.copy()
    data.remove('uses')
    machine.setCustomData(data)
  })
})
```

This requires a `UIElement` with ID `reset_button` in the editor. Layout, LSS, components, propagation, and data binding are maintained by LDLib2; continue with [LDLib2 KubeJS UI support](../../../ldlib2/ui/kjs_support.md) and the [UIElement API](../../../ldlib2/ui/components/element.md).

## Modify the client Recipe Viewer UI

```js
// kubejs/client_scripts/mbd2_recipe_ui.js
MBDRecipeTypeEvents.onRecipeUI('example:processor', wrapper => {
  const { recipe, ui } = wrapper.event
  const output = ui.selectId('main_output').findFirst().orElse(null)
  if (output === null) return

  output.addEventListener(UIEvents.HOVER_TOOLTIPS, event => {
    event.hoverTooltips = HoverTooltips.empty().append(`Recipe: ${recipe.id}`)
  })
})
```

`onRecipeUI` is a client recipe-type event, so it may register normal client `UIElement` listeners. Never mutate a machine or server storage here.

<VersionBadge version="Minecraft 1.20.1 / MBD2 1.0.x" label="Legacy; do not copy to 1.21.1" icon="tag" />

```js
// ❌ Legacy Widget API
ui.getFirstWidgetById('reset_button').setOnPressCallback(...)
```
