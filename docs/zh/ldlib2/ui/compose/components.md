# 组件

<VersionBadge version="2.2.44" label="自" icon="tag" />

LDLib2 `ldlib2:ui_element` 注册表里的每个控件都有对应的 composable 包装。这些包装只是对 [`UIElementNode`](#wrapping-any-element) 的薄调用；没有包装的控件（包括其他模组的控件）也能用它。

## 控件对照表

| LDLib2 元素 | Composable |
| --- | --- |
| `UIElement` | `Box`、`Column`、`Row`、`Spacer` |
| `TextElement`、`Label` | `Text`、`Label` |
| `Button` | `Button` |
| `TextField`、`TextArea`、`CodeEditor` | `TextField`、`TextArea`、`CodeEditor` |
| `Switch`、`Toggle`、`ToggleGroupElement` | `Switch`、`Toggle`、`ToggleGroup` |
| `Slider`、`Scroller` | `Slider`、`SliderVertical`、`ScrollerHorizontal`、`ScrollerVertical` |
| `Selector`、`ColorSelector`、`SearchComponent` | `Selector`、`ColorSelector`、`SearchComponent` |
| `TagField`、`StructuredTagEditor` | `TagField`、`StructuredTagEditor` |
| `ItemSlot`、`FluidSlot`、`InventorySlots` | `ItemSlot`、`FluidSlot`、`InventorySlots` |
| `ProgressBar` | `ProgressBar` |
| `ScrollerView` | `ScrollView` |
| `SplitView` | `SplitViewHorizontal`、`SplitViewVertical` |
| `TabView`、`Tab` | `TabView { tab(...) }` |
| `TreeList`、`Inspector`、`Scene`、`GraphView` | `TreeList`、`Inspector`、`Scene`、`GraphView` |
| `UITemplateElement` | `UITemplate` |
| `BindableValue` | `BindableValue`（只镜像值，不能挂同步绑定） |
| `VirtualScrollerView` | 不包装。请使用 [`LazyColumn`、`LazyRow` 或 `LazyVerticalGrid`](./lazy-and-animation.md)。 |

`Dialog` 不是注册表里的元素，但也有包装。

## 受控控件

持有值的控件都是**受控**的：值由组合持有，控件把编辑回报上来。

```kotlin
var name by remember { mutableStateOf("") }
TextField(value = name, onValueChange = { name = it })
```

每次编辑后，控件都会与组合中的值比较，不一致就写回。因此：

- 想拒绝一次编辑，就不要存它。`onValueChange = { if (it.length <= 5) name = it }` 就是一个最多五个字符的输入框。
- 想让控件只读，就忽略回调。

| Composable | 值参数 |
| --- | --- |
| `TextField`、`Slider`、`SliderVertical`、`ScrollerHorizontal`、`ScrollerVertical`、`BindableValue` | `value`、`onValueChange` |
| `Switch`、`Toggle` | `checked`、`onCheckedChange` |
| `Selector`、`SearchComponent` | `selected`、`onSelectedChange` |
| `TreeList` | `selected: Set<N>`、`onSelectedChange` |
| `ItemSlot` | `item`、`onItemChange`（默认忽略编辑） |
| `FluidSlot` | `fluid`、`onFluidChange`（默认忽略编辑） |
| `ColorSelector` | `color`、`onColorChange` |
| `TagField`、`StructuredTagEditor` | `tag: Tag?`、`onTagChange` |
| `TextArea`、`CodeEditor` | `lines: List<String>`、`onLinesChange` |

值得了解的细节：

- **组合写入的值不会被当作编辑回报。** 新的 `range` 让滑块重新夹值，或删掉一个 toggle 后组把勾选让给邻居，都不会调用 `onValueChange`。如果这导致控件与状态不一致，控件会被写回状态的值。
- **配置先于值生效。** `Slider(50f, onValueChange, range = 0f..100f)` 一开始就是 50，不会先被默认的 `0f..1f` 夹成 1。
- **纠正值时保留光标。** `TextField`、`TextArea` 和 `CodeEditor` 在写回值时保持光标位置。
- **可变的值回报副本。** `ItemSlot`、`FluidSlot`、`TagField` 和 `StructuredTagEditor` 回报的是副本，下一次编辑不会改掉你存下的值。`ItemStack` 和 `FluidStack` 按内容比较。

`TextField` 有三种限制输入的方式：

| 方式 | 行为 |
| --- | --- |
| `charFilter` | 在输入字符落下之前拒绝它。粘贴进来、含有被拒字符的文本按非法处理。 |
| `validator` | 判断整段文本。非法文本留在框里显示为错误，不会回报。 |
| 不在 `onValueChange` 里保存 | 下一帧输入框回到已保存的值。适合做纠正，例如把数字夹到范围内。 |

::: warning 菜单槽位与服务端搜索
组合只在客户端运行，所以必须在服务端存在的控件不能放在组合里：

- `InventorySlots` 会注册菜单槽位。组合版只能用在不是菜单的界面里，只读地显示玩家物品栏。用在菜单中时，它会记录错误并保持未绑定。
- 参与菜单槽位同步的 `ItemSlot`、在服务端搜索的 `SearchComponent` 也有同样的问题。

这类控件要在 `createUI` 里构建并加进树，放在 `ComposeElement` 之外。也不要用 `Mount` 挂它们：`Mount` 同样只在客户端运行。

组合里的 `FluidSlot` 不注册点击灌液的 RPC，所以用流体容器点击它没有效果。
:::

## 容器

**`ScrollView`。** `layout` 设置滚动视图本身的尺寸。子元素之间的间距（`gap`、`padding`、方向）写在 `contentLayout` 里；写在 `layout` 里只会推开滚动条。

```kotlin
ScrollView(layout = { height(80.px) }, contentLayout = { gap { all(2.px) } }) {
    rows.forEach { row -> key(row.id) { RowItem(row) } }
}
```

**`Dialog`。** 覆盖在整个 UI 之上的对话框：

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

- 首次组合时就 `visible` 的对话框，会在它的 UI 建好后的第一帧打开。
- `title`、`buttons` 和内容槽位只在对话框显示时组合。
- 玩家可以按 Esc（`dismissOnEscape`，默认 `true`）或点击对话框外部（`dismissOnClickOutside`，默认 `false`）关闭它。两者任一开启时，焦点移到对话框之外也会关闭。这些情况都会调用 `onDismiss`。
- 因为 `visible` 变为 false 而关闭时不会调用 `onDismiss`。

::: info Esc 与对话框
只有当 `ModularUI` 设置了 `shouldCloseOnEsc(false)` 时，Esc 才会传到对话框。否则 Esc 会先关闭整个界面。
:::

**`TabView`。**

```kotlin
var current: Any by remember { mutableStateOf("general") }
TabView(selectedKey = current, onSelect = { current = it }) {
    tab("general", "General") { GeneralPage() }
    tab("advanced", "Advanced") { AdvancedPage() }
}
```

- 页签头按声明顺序排列。调整 `tab(...)` 的顺序会移动已有页签，选中项和每页记住的状态都会保留。
- 页签 key 必须唯一。重复的 key 会抛出 `IllegalArgumentException`。
- `selectedKey = null` 时由控件自己管理选中项。
- 玩家选择页签时会调用 `onSelect`；选中的页签被删除、而 `selectedKey` 没有指向仍存在的页签时，也会调用一次。composable 自己做出的选择不会调用。

**`SplitViewHorizontal` / `SplitViewVertical`。** 两个槽位（`left`/`right` 或 `top`/`bottom`）。`initialPercentage` 只决定分隔条的初始位置，拖动不会回报。

**`ToggleGroup`。** **直接**放在它里面的 `Toggle` 最多只有一个开启。用同一个状态驱动这些 toggle，例如 `checked = selected == "a"`。`allowEmpty = true` 允许取消最后一个。

## 包装任意元素 {#wrapping-any-element}

`UIElementNode` 可以发出任意 `UIElement` 子类：

```kotlin
UIElementNode(
    factory = { TreeList<TreeNode<String, String>>().setFlattenRoot(true) },
    layout = { size(240.px, 60.px) },
    update = { set(depth) { setRoot(root) } },
)
```

| 参数 | 用途 |
| --- | --- |
| `factory` | 构建元素。只在节点创建时执行一次。 |
| `update` | 每次重组执行。每个属性都用 `set(value) { ... }` 包起来，只在该值变化时执行。 |
| `widgetStyle` | 接收者是元素本身的块，在 `layout` 和 `style` 之后执行。 |
| `layout`、`style`、`classes`、`id`、`enabled`、`visible`、`focusable`、`events` | 与所有 composable 相同。见[样式与事件](./styling-and-events.md)。 |
| `content` | 可组合的子内容。 |

::: warning `set(value)` 用 `equals` 比较
`set(value)` 只在 `value` 与上次不 `equals` 时执行。上面的示例用的是 `set(depth)` 而不是 `set(root)`，因为 `TreeNode.equals` 只比较 key 和内容。两棵根相同但内容不同的树会被视为“相等”，`set(root)` 永远不会执行。请以真正会变化的值为 key，或者用 `reconcile { }` 在每次重组时执行。
:::

**`Mount(element)`** 把一个已经存在的元素（手写或用 DSL 构建）放进组合。组合负责挂载、移动和卸载它，但从不修改它的属性。请传入稳定的元素（来自 `remember`）；每次重组都传新实例，就会每次都替换一次。

**`Subcompose(container) { ... }`** 把内容组合进另一个元素，而不是调用处。用于带命名槽位的控件，例如 `SplitView` 的两个面板。它是真正的子组合：`CompositionLocal` 能传进去，与父组合在同一帧重组，并随父组合一起销毁。

```kotlin
val view = remember { SplitView.Horizontal() }
UIElementNode(factory = { view }, layout = { size(200.px, 100.px) })
Subcompose(view.first) { LeftPane() }
Subcompose(view.second) { RightPane() }
```

`LocalUIElement.current` 返回承载当前组合的 `ComposeElement`，可以通过它拿到所在的 `ModularUI` 和玩家。
