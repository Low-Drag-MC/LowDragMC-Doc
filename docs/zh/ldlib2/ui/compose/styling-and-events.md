# 样式与事件

<VersionBadge version="2.2.44" label="自" icon="tag" />

Composable 通过具名参数接收外观和行为，而不是 `Modifier` 链。这些参数直接复用 LDLib2 自己的布局和样式 DSL，不引入新的名字。

```kotlin
Button(
    onClick = { save() },
    text = "Save",
    layout = { width(60.px); padding { all(4.px) } },     // 与 layoutDsl { } 的接收者相同
    style = { backgroundTexture(Sprites.RECT_RD) },       // 与 styleDsl { } 的接收者相同
    buttonStyle = { hoverTexture(Sprites.RECT_RD_LIGHT) }, // 控件自己的样式 facade
    classes = "primary",
)
```

单位与 Kotlin DSL 相同：`40.px`、`50.pct`、`auto`。

## 参数

| 参数 | 设置什么 |
| --- | --- |
| `layout` | 尺寸、间距、flex 与 grid、定位。接收者为 `TaffyLayoutStyleDsl`。 |
| `style` | 背景、透明度、z-index、悬停提示、变换。接收者为 `BasicStyle`。 |
| `xxxStyle` | 控件自己的样式 facade（见下表）。 |
| `classes` | 空格分隔的样式表类名，供 `.name` 选择器匹配。 |
| `id` | 元素 id，供 `#id` 选择器匹配。 |
| `enabled` | 为 `false` 时调用 `setActive(false)`：加上 `__disabled__` 类，并让该元素及其子元素不再接收输入和 tick。 |
| `visible` | 调用 `setVisible`。 |
| `focusable` | 调用 `setFocusable`。为 `null` 时保留元素自身的默认值。 |
| `events` | 事件处理器。见[事件](#events)。 |

| 控件 | 样式 facade 参数 |
| --- | --- |
| `Button` | `buttonStyle` |
| `Text`、`Label` | `textStyle` |
| `TextField` | `fieldStyle` |
| `TextArea`、`CodeEditor` | `areaStyle` |
| `Switch` | `switchStyle` |
| `Toggle` | `toggleStyle` |
| `Slider`、`SliderVertical` | `sliderStyle` |
| `ScrollView`、`ScrollerHorizontal`、`ScrollerVertical` | `scrollerStyle` |
| `Selector` | `selectorStyle` |
| `ItemSlot`、`FluidSlot` | `slotStyle` |
| `ProgressBar` | `barStyle` |
| `GraphView` | `graphStyle` |

`TabView`、`Dialog` 和 `AnimatedVisibility` 没有 `events` 和 `focusable` 参数。`Spacer` 只有 `layout`、`style` 和 `classes`。

## 各类参数如何生效

| 参数 | 值变化时 | 不再传入时 |
| --- | --- | --- |
| `layout`、`style`、`xxxStyle` | 写入元素 | **保持已写入的值**，不会撤销。 |
| `classes`、`events` | 做 diff | 移除 |
| `enabled`、`visible`、`id` | 与上次的值不同时写入 | 回到参数默认值 |

样式块是写穿的，和 `element.styleDsl { }` 一样。在 `if` 里设置的属性，条件变为 false 后仍然保留：

```kotlin
textStyle = { if (hot) fontSize(18f) }           // 错误：hot 变为 false 后字号仍然很大
textStyle = { fontSize(if (hot) 18f else 9f) }   // 正确：两个分支都写值
classes = if (hot) "label hot" else "label"      // 更好：交给样式表决定
```

重复写入相同的值几乎没有开销：值未变化时会直接返回，不会触发重新布局。

块抛出异常只影响它所在的节点。错误会记录到日志，这个块被跳过，组合继续运行。

::: info 包装函数的默认值
包装函数替你选择的值（例如 `Row` 的 flex 方向、`Text` 的自适应高度）写在 `DEFAULT` 来源。你的 `layout` 和 `style` 块写在 `INLINE` 来源，所以你的块和样式表都能覆盖包装函数的默认值。

有一个例外：`Text` 和 `Label` 的自适应高度优先于样式表里的 `height`。用样式表给文本定高时，同一条规则还要写 `adaptive-height: false`。
:::

## 在块里读取状态

块可以直接读取快照状态。状态变化时只重新执行这一个块，不发生重组：

```kotlin
val alpha by animateFloatAsState(if (shown) 1f else 0f)
Box(style = { opacity(alpha) })   // 每帧重新执行这个块，不重组
```

这比在函数体里读取更省：在函数体里读取会重组整个 composable。

两点限制：

- 只有块能这样用。`classes`、`enabled` 等普通参数在函数体里求值，遵循正常的重组规则。
- 块只能修改属性。决定**组合什么**的值必须在函数体里读取：

```kotlin
val o = alpha.coerceIn(0f, 1f)   // 在函数体里读：它决定 Box 是否存在
if (visible || o > 0f) {
    Box(style = { opacity(o) })
}
```

## 事件 {#events}

`events` 的接收者是 `EventScope`：

```kotlin
Box(events = {
    onClick { count++ }
    onMouseEnter { hovered = true }
    onMouseLeave { hovered = false }
})
```

| 辅助方法 | 事件 |
| --- | --- |
| `onClick` | `mouseClick`：在同一个元素上按下并松开 |
| `onMouseDown`、`onMouseUp` | 鼠标按下 / 松开 |
| `onMouseEnter`、`onMouseLeave` | 指针进入 / 离开。始终在捕获阶段。 |
| `onMouseWheel` | 滚轮滚动 |
| `onKeyDown`、`onCharTyped` | 键盘输入 |
| `onFocusIn`、`onFocusOut` | 获得 / 失去焦点 |
| `on(type, capture = false) { }` | 其他任意事件类型 |

每个 `(type, capture)` 组合在元素上只注册一次，无论块执行多少次；重组只替换处理器。同一个事件声明两次时，两个处理器都会执行。

::: tip `onClick` 与 `Button(onClick = …)`
`EventScope.onClick` 在按下**并**松开时触发。`Button` 的 `onClick` 参数是控件自带的点击，在鼠标按下时触发并播放点击音效。
:::

`onMouseEnter` 和 `onMouseLeave` 注册在捕获阶段。`ModularUI` 派发这两个事件时没有冒泡阶段，目标是指针下最内层的元素，所以容器只能通过捕获阶段听到子元素被悬停。

## 悬停与按下状态

只改外观的话不需要写代码。被悬停的元素及其所有祖先都带有 `__hovered__` 类：

```css
.card.__hovered__ {
    background: rect(#4a4a4a, 4);
}
```

当悬停需要改变**组合的内容**（换文字、多一个子元素、改变动画目标）时，把它作为状态跟踪：

```kotlin
val interaction = rememberInteraction()
Box(events = { track(interaction) }) {
    Text(if (interaction.hovered) "Release to delete" else "Delete")
}
```

`InteractionState` 有 `hovered` 和 `pressed` 两个属性。`pressed` 没有对应的类。`track` 会在你自己的处理器旁边追加处理器，所以可以和你的 `onMouseEnter` 共用同一事件。
