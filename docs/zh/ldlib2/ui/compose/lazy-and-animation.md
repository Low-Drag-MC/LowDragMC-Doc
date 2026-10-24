# 惰性列表与动画

<VersionBadge version="2.2.44" label="自" icon="tag" />

## 惰性列表

`LazyColumn`、`LazyRow` 和 `LazyVerticalGrid` 只组合看得见的项。上下各用一个空 spacer 代替其余部分，所以滚动条仍然反映整个列表。一万行的列表挂载的元素不到 40 个。

```kotlin
LazyColumn(items = recipes, itemHeight = 18f, key = { _, r -> r.id }) { _, recipe ->
    RecipeRow(recipe)
}

LazyVerticalGrid(items = stacks, columns = 9, cellWidth = 18f, cellHeight = 18f) { _, stack ->
    ItemSlot(item = stack)
}
```

| Composable | 尺寸参数 | 默认值 |
| --- | --- | --- |
| `LazyColumn` | `itemHeight: Float`、`variableHeight` | `variableHeight = false`、`overscan = 2` |
| `LazyRow` | `itemWidth: Float`、`variableWidth` | `variableWidth = false`、`overscan = 2` |
| `LazyVerticalGrid` | `columns: Int`、`cellWidth`、`cellHeight`、`variableHeight` | `variableHeight = false`、`overscan = 1` |

三者都接收 `items: List<T>`、可选的 `key: (index, item) -> Any`，以及 `itemContent: @Composable (index, item) -> Unit`。`overscan` 是每侧边缘之外额外保持挂载的行数。

保证结果正确的规则：

- **让每行真的是你声明的高度。** 关闭 `variableHeight` 时，`itemHeight` 不会作用到行上。要自己给每行设定尺寸（`layout = { height(18.px) }`），否则 spacer 和行对不上。
- **使用稳定的 key。** 默认 key 是下标，只适合只在末尾追加的列表。key 应当唯一；重复的 key 按出现位置区分。
- **用新列表表示变化。** `items` 按引用比较。传入新列表，或长度会变化的 `mutableStateListOf`。原地替换一个元素时，新元素会显示出来，但沿用旧元素的 key、保存的状态和测量到的尺寸。
- **滚出视野的行会离开组合。** 它们 `remember` 的状态会丢失。`rememberSaveable` 状态按 key 保存，行回来时恢复；key 不再出现在 `items` 中时丢弃。跨行共享的状态（例如选中项）要放在列表之外。

数据变化时，列表停留在正在显示的行上：第一行可见的行保持在屏幕上的原位，不论是在它上方插入、下方追加还是删除了别的行。如果被删除的正是这一行，由接替它位置的行保持原位。

`LazyRow` 用普通鼠标滚轮横向滚动，不需要按 Shift。

### 可变尺寸

行高不一致（会换行的文本、可展开的行）时，打开 `variableHeight`：

```kotlin
LazyColumn(items = messages, itemHeight = 14f, variableHeight = true) { _, message ->
    Text(message.text)   // 高度由内容决定
}
```

此时 `itemHeight` 只是还没上过屏的行的估计值。每行在布局后会被测量。

| 代价 | 说明 |
| --- | --- |
| 每行多一个包装元素 | 用来测量行高。 |
| 一帧修正 | 新行在第一帧按估计值占位。 |
| 滚动条微调 | 估计值被逐步替换时，滚动条尺寸会轻微变化。屏幕上的内容不会跳动。 |
| 行必须有高度 | 测得高度为 0 的行会被拒绝。 |

固定高度更快、更准确，能用就用。

`LazyRow(variableWidth = true)` 以同样方式测量宽度。`LazyVerticalGrid(variableHeight = true)` 让每一行与该行最高的格子一样高，并拉伸其他格子对齐。网格的列宽始终固定。

::: warning 跨行移动的网格格子
网格格子滚出再滚回时会保留 `rememberSaveable` 状态。但插入或删除把一个格子移到**另一行**时，它会在新行重建，`remember` 和 `rememberSaveable` 状态都不会保留。需要跟着格子走的状态，请按 item 放到网格之外。
:::

## 动画

动画 API 是本模块自己实现的，不是 `androidx.compose.animation`。缓动使用 LDLib2 自己的 `Eases`，与样式表 `transition` 和 `StyleAnimation` 使用同一套曲线。

```kotlin
val alpha by animateFloatAsState(if (expanded) 1f else 0f, tween(200, easing = Eases.QUAD_OUT))
Box(style = { opacity(alpha) }) { Details() }   // 在块里读取：不重组

// 弹簧在中途换目标时保留速度。
val offset by animateFloatAsState(target, spring(dampingRatio = 0.6f, stiffness = 300f))

// 命令式：序列动画、可打断的移动。
val x = rememberAnimatable(0f)
LaunchedEffect(Unit) {
    x.animateTo(100f, spring())
    x.animateTo(0f, tween(400))
}
```

| API | 说明 |
| --- | --- |
| `animateFloatAsState(target, spec, finishedListener)` | 默认 spec 为 `TweenSpec()`：250 ms，线性。 |
| `animateIntAsState(target, spec, finishedListener)` | 同上，用于 `Int`。 |
| `animateColorAsState(target, spec, finishedListener)` | 打包的 ARGB `Int`，像样式表 transition 一样在 Oklab 空间混合。新目标从屏幕上当前的颜色出发。 |
| `rememberAnimatable(initial)` / `Animatable` | `animateTo(target, spec = spring())` 挂起直到到达；`snapTo` 直接跳过去。同一时间只运行一个动画。 |
| `tween(durationMillis = 250, delayMillis = 0, easing = Eases.LINEAR)` | 固定时长的曲线。 |
| `spring(dampingRatio = 1f, stiffness = 400f, threshold = 0.01f)` | 基于物理，没有固定时长。参数必须是有限的正数。 |

- `animate*AsState` 只在**目标**变化时重启。中途变化的 spec 从下一个目标开始生效。
- `finishedListener` 只在动画真正到达目标时调用。初始值不算，被新目标打断的也不算。
- 弹簧的速度与帧率无关。
- 目标为无穷大时直接跳过去，不做插值。

### `AnimatedVisibility`

`if (visible)` 会在当帧删除内容，没有东西可以做退场动画。`AnimatedVisibility` 会让内容保持在组合中，直到退场过渡完成：

```kotlin
AnimatedVisibility(
    visible = shown,
    enter = fadeIn() + slideInVertically() + expandVertically(),
    exit = fadeOut() + shrinkVertically(),
) {
    Details()
}
```

用 `+` 组合过渡。它们同时运行，各自使用自己的 spec（默认 `TweenSpec()`）。同一种过渡出现两次时，左边的生效。

| 进场 / 退场 | 动画的对象 |
| --- | --- |
| `fadeIn` / `fadeOut` | 透明度 |
| `slideIn` / `slideOut`、`slideInHorizontally` / `slideInVertically`、`slideOutHorizontally` / `slideOutVertically` | 绘制偏移，按内容自身尺寸的比例给出（x 上的 `-1f` 表示向左一个完整宽度） |
| `scaleIn` / `scaleOut` | 绕 pivot 的绘制缩放，pivot 按尺寸比例给出（默认中心） |
| `expandVertically` / `shrinkVertically`、`expandHorizontally` / `shrinkHorizontally` | 内容占据的布局空间。相邻元素平滑移动；运行期间内容被裁剪。 |

与 Jetpack Compose 的区别：

- 默认只有 `fadeIn()` 和 `fadeOut()`。`expand*` / `shrink*` 需要显式指定，它会多加一层测量用的包装元素。
- slide 和 scale 只影响绘制。除非同时加上 `expandVertically` 或 `expandHorizontally`，相邻元素不会移动。
- 尺寸动画只支持单轴。进场和退场必须使用同一轴，否则 `AnimatedVisibility` 会抛出异常。
- 尺寸动画运行时，该轴的尺寸由动画控制。把尺寸设在内容上，而不是 `AnimatedVisibility` 的 `layout` 里。
- 在会拉伸子元素的父容器里沿交叉轴展开时，会先展开到内容自身的尺寸，结束时再跳到拉伸后的尺寸。给盒子设置 `alignSelf` 可以避免。
- 首次组合时就可见的内容直接出现，没有进场动画。被打断的过渡从当前位置反向运行。

::: info Compose 动画与 `StyleAnimation`
这些动画驱动的是组合状态，所以在 composable 函数体里读取它们的地方每帧都会重组。在 `style` 或 `layout` 块里读取，就只重新执行那个块。LDLib2 原有的 [`StyleAnimation`](../preliminary/style_animation.md) 直接写样式，完全不经过组合。两者都可以使用。
:::
