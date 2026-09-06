# UI 行为

<VersionBadge version="Minecraft 1.21.1 / MBD2 21.1.1" label="适用于" icon="tag" />
<VersionBadge version="LDLib2 2.2.39" label="UI API" icon="tag" />

<figure><img src="/assets/multiblocked2/editor/machine-ui.png" alt="MBD2 机器 UI 编辑器中的现代 LDLib2 UIElement 画布"><figcaption>先在编辑器中建立 UIElement 树和稳定 ID，再由 KubeJS 连接运行时行为。</figcaption></figure>

`MBDMachineEvents.onUI` 在 1.21.1 中仍然有效，但 `wrapper.event.ui` 已经是 LDLib2 2.x 的 `UI`，不再是 1.20.1 文档中的 WidgetGroup。元素查询、事件名和服务端回调都必须使用新框架。

## 1.21.1：为编辑器按钮添加服务端行为

<VersionBadge version="Minecraft 1.21.1" label="当前 API" icon="tag" />

```js
// kubejs/server_scripts/mbd2_ui.js
MBDMachineEvents.onUI('example:crusher', wrapper => {
  const { machine, ui, player } = wrapper.event

  // UI.selectId 返回 Java Stream；ID 是编辑器中 UIElement 的 id。
  const flush = ui.selectId('flush_button').findFirst().orElse(null)
  if (flush === null) {
    console.warn('Missing UI element #flush_button on example:crusher')
    return
  }

  // 权威机器修改应使用服务端事件监听器。
  flush.addServerEventListener(UIEvents.MOUSE_DOWN, click => {
    if (click.button !== 0) return

    const output = machine.getTraitByName('output_items')
    if (output === null) return

    // 示例：通过 handler API 提取，而不是原地修改 ItemStack。
    for (let slot = 0; slot < output.storage.slots; slot++) {
      output.storage.extractItem(slot, 64, false)
    }
  })
})
```

该脚本放在 `server_scripts`，因为 MBD2 的 `onUI` 是带机器 ID 目标的服务端机器事件。LDLib2 会把 `addServerEventListener` 注册的 UI RPC 行为同步给客户端对应元素。

## 修改元素显示的内容

只挂监听器不会改变 UI 的外观，它仍然是编辑器画出的样子。要改动树本身，直接写入查询到的元素：

```js
// kubejs/server_scripts/mbd2_ui.js
MBDMachineEvents.onUI('example:crusher', wrapper => {
  const { machine, ui } = wrapper.event

  const status = ui.selectId('status_label').findFirst().orElse(null)
  if (status !== null) {
    // 单参数的 setText 对脚本不可见。第二个参数传 false 表示按字面文本使用，
    // 传 true 则会当作翻译键。
    status.setText(`Crusher — ${machine.machineStateName}`, false)
  }

  const flush = ui.selectId('flush_button').findFirst().orElse(null)
  if (flush !== null) {
    flush.setText('Flush Output (scripted)', false)
  }
})
```

<figure><img src="/assets/multiblocked2/kubejs/onui-effect.png" alt="同一个机器面板并排对比，左侧未改动，右侧被脚本重写"><figcaption>同一个机器 UI：左为脚本未介入时，右为 <code>onUI</code> 执行后。标题文本取自机器的实时状态，这是编辑器在编写面板时无法知道的。</figcaption></figure>

::: tip
`setText(String)` 和 `setText(Component)` 对脚本隐藏。脚本要用双参数的 `setText(text, translate)`，或者传入 `Component`；只传一个字符串会报 "no such method"。
:::

## 查询元素

<VersionBadge version="LDLib2 2.2.x" label="当前 UI" icon="tag" />

```js
const byId = ui.selectId('status_label').findFirst().orElse(null)
const allButtons = ui.select('.action').toList()
const typed = ui.selectId('progress', ProgressBar).findFirst().orElse(null)
const allBars = ui.select('progress-bar', ProgressBar).toList()
const root = ui.rootElement
```

| 方式 | 返回值 | 用途 |
| --- | --- | --- |
| `ui.selectId(id)` | `Stream<UIElement>` | 按精确 ID 查询 |
| `ui.select(selector)` | `Stream<UIElement>` | LDLib2 selector——类型名、`.class`、`#id` |
| `ui.selectRegex(regex)` | `Stream<UIElement>` | 按正则匹配 ID |
| `ui.selectId(id, Type)` / `ui.select(selector, Type)` | `Stream<Type>` | 限制元素类型 |
| `ui.rootElement` | `UIElement` | 修改整棵树或添加子元素 |

`ProgressBar`、`Button`、`ItemSlot`、`Label` 等 LDLib2 元素都是全局绑定，带类型的写法不需要 `Java.loadClass`。

不要把 `ModularUI.getElementById(...)` 和 `UI.selectId(...)` 混用：`onUI` 暴露的是尚未包装成 `ModularUI` 的 `UI` 描述对象。

## 客户端视觉与服务端行为

`MBDMachineEvents.onUI` 在 21.1.1 注册于服务端机器事件组，适合添加 `addServerEventListener`、服务端 data source 或替换服务器创建的 UI。普通 `addEventListener` 是客户端监听器；不要假设在此服务端回调里创建的 JavaScript lambda 会成为客户端脚本。

如果必须用 KubeJS 同时构造客户端和服务端 UI，请改用 LDLib2 `LDLib2UI.block/item/player`，并按其文档在两侧注册相同 ID。需要数据同步时，应使用 LDLib2 data binding 或 server event/RPC，而不是在客户端事件中直接改变 Trait。完整概念与组件 API 请继续阅读：

- [LDLib2 KubeJS UI 支持](../../ldlib2/ui/kjs_support.md)
- [LDLib2 UI Factory 与脚本放置](../../ldlib2/ui/factory.md)
- [UIElement 选择器、事件与服务端监听器](../../ldlib2/ui/components/element.md)
- [数据绑定](../../ldlib2/ui/preliminary/data_bindings.md)
- [UI 事件传播](../../ldlib2/ui/preliminary/event.md)

## 1.20.1 旧写法：仅用于迁移识别

<VersionBadge version="Minecraft 1.20.1 / MBD2 1.0.x" label="旧 API，不适用于 1.21.1" icon="tag" />

```js
// ❌ 旧 Widget API：1.21.1 的 UI 上不存在这些方法。
const button = event.event.ui.getFirstWidgetById('example:flush')
button.setOnPressCallback(click => { /* ... */ })
```

迁移映射：

| 1.20.1 Widget API | 1.21.1 LDLib2 UI API |
| --- | --- |
| `getFirstWidgetById(id)` | `ui.selectId(id).findFirst().orElse(null)` |
| `setOnPressCallback(...)` | `addEventListener(...)` 或 `addServerEventListener(...)` |
| Widget 回调中的 `isRemote` | 明确选择客户端监听器或服务端监听器 |
| WidgetGroup 层级 | `UIElement` 树、selector 与 LSS |

::: warning
`onUI` 可以替换 `event.ui`，但大多数整合包只应查找并增强编辑器生成的树。完全从脚本构造独立 UI 时，优先使用 LDLib2 的 `LDLib2UI.*` factory，而不是把机器 UI 当作通用窗口工厂。
:::
