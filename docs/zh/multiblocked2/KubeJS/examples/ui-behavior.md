# UI 行为示例

<VersionBadge version="Minecraft 1.21.1 / MBD2 21.1.1" label="当前 MBD2" icon="tag" />
<VersionBadge version="LDLib2 2.2.39" label="当前 UI" icon="tag" />

<figure><img src="/assets/multiblocked2/editor/machine-ui.png" alt="带稳定 reset_button 元素 ID 的 MBD2 Machine UI 编辑器"><figcaption>先在编辑器中创建元素和 ID，再让 `onUI` 添加服务端行为。</figcaption></figure>

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

本例依赖编辑器中 ID 为 `reset_button` 的 `UIElement`。完整的布局、LSS、组件、事件传播和 data binding 不在 MBD2 中重复维护，请阅读 [LDLib2 KubeJS UI 支持](../../../ldlib2/ui/kjs_support.md) 与 [UIElement API](../../../ldlib2/ui/components/element.md)。

## 修改客户端 Recipe Viewer UI

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

`onRecipeUI` 是客户端配方类型事件，用 `addEventListener` 注册普通客户端 `UIElement` 监听器；不要在这里修改机器或服务端存储。

`HoverTooltips.empty().append(...)` 接受 `Component`，传 JS 字符串会自动转换。

## 该用哪种监听器

| 调用 | 运行于 | 用于 |
| --- | --- | --- |
| `addEventListener(type, cb)` | 客户端 | 提示、视觉状态等本地逻辑 |
| `addServerEventListener(type, cb)` | 服务端（通过 RPC） | 机器与存储变更 |

在服务端 `onUI` 回调里创建的 JavaScript lambda 不会变成客户端代码——请显式选择监听器种类。

<VersionBadge version="Minecraft 1.20.1 / MBD2 1.0.x" label="旧写法，不可复制到 1.21.1" icon="tag" />

```js
// ❌ Legacy Widget API
ui.getFirstWidgetById('reset_button').setOnPressCallback(...)
```
