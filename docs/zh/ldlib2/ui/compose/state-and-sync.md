# 状态与同步

<VersionBadge version="2.2.44" label="自" icon="tag" />

状态的用法与 Compose 一致：`remember` 在重组之间保留值，`mutableStateOf` 在变化时让读取它的地方重组。本页介绍 LDLib2 额外提供的部分：关闭界面后仍保留的状态、到 LDLib2 数据绑定的桥接，以及结构由服务端决定的 UI。

## 状态放在哪里

当一个 composable 离开组合（`if` 变为 false、列表项被删、行滚出 `LazyColumn`），它 `remember` 的东西也随之消失。要把状态提升到与它应存活时长相同的层级：

```kotlin
// 选中项放在列表外面，被回收的行不会丢掉它。
var selected by remember { mutableStateOf(-1) }
LazyColumn(items, itemHeight = 14f) { index, item ->
    Text(item, classes = if (index == selected) "row selected" else "row")
}
```

给列表项加上 `key`。有 key 时，重排会移动已有元素，保留焦点、动画和内部状态；没有 key 时按位置匹配，第 0 行的状态会留给下一个第 0 行。

```kotlin
items.forEach { item -> key(item.id) { ItemRow(item) } }
```

## `rememberSaveable`

`rememberSaveable` 就是 `androidx.compose.runtime.saveable` 中的标准 Compose API：

```kotlin
var query by rememberSaveable { mutableStateOf("") }
```

它在三种情况下比 `remember` 活得更久：

| 情况 | 需要什么 |
| --- | --- |
| `LazyColumn`、`LazyRow` 或网格的行滚出视野再滚回来 | 什么都不用。每行按自己的 `key` 保存。 |
| `TabView` 的页签被删掉，之后又用同一个 key 声明回来 | 什么都不用。每页按自己的 key 保存。 |
| 关闭界面再重新打开 | 给界面一个 `stateKey` |

```kotlin
composeModularUI(player, StylesheetManager.MODERN, stateKey = "mymod:furnace@$pos") { FurnaceScreen() }
// 或者
ComposeElement(stateKey = "mymod:furnace@$pos") { FurnaceScreen() }
```

`stateKey` 必须同时区分界面和它显示的对象。写成 `"mymod:furnace"` 的话，所有熔炉都会共用一份状态。

与 Android 的区别：

- 值按原样保存在内存里，**不做序列化**。任何类型都能存，不需要 `Saver`。
- 保存的值在被清除前一直被引用。只存值，不要存 UI 元素或持有世界的对象。
- 玩家退出世界时全部清空。不会写入磁盘，重启游戏后从头开始。
- 可以用 `ComposeSavedState.clear(key)` 或 `ComposeSavedState.clearAll()` 手动清除。
- 同一 `stateKey` 的两个界面同时打开时，共享同一份实时状态。最后关闭的那个决定保存什么。

## 桥接 LDLib2 数据

三个扩展函数把 LDLib2 的数据变成 Compose 状态。无论哪种，**都要在组合之外构建绑定或数据源**，这样它的同步槽位才不会移动。

| 扩展 | 用途 |
| --- | --- |
| `IDataProvider<T>.collectAsState(): State<T>` | 只读。provider 变化时重组。 |
| `TrackData<T>.asMutableState(): MutableState<T>` | 双向。写入会进入 `TrackData`，并传到所有绑定它的地方。 |
| `IBinding<T>.asMutableState(): MutableState<T>` | 同步绑定的双向视图。把状态安装为绑定的客户端数据源。 |

```kotlin
// 在组合之外构建一次。
val progress = TrackData(0f)
element.addSyncValue(
    DataBindingBuilder.floatValS2C { machine.progress }
        .remoteSetter(progress::setValue)
        .build().syncValue
)

// 在 composable 里。
val value by progress.collectAsState()
ProgressBar(progress = value)
```

- `IBinding.asMutableState()` 只用于没有同时绑定到控件的绑定。两者会争用同一个数据源，后来的一方生效。
- 轮询型数据源（`ITickable`，例如 `SupplierDataSource`）由宿主元素的 20 Hz tick 驱动，按 tick 频率而不是帧率更新。每次调用 `collectAsState()` 都会再 tick 一次数据源：轮询型数据源只 collect 一次，把状态往下传。

## 服务端驱动的 UI {#server-driven-ui}

行、页签或面板的数量可以完全由服务端决定。前提是遵守一条规则。

### 规则

`UISyncManager` 按注册顺序给同步值和 RPC 事件编号。发送方写入编号，接收方在自己的表里按编号查找。两端编号一致，是因为两端执行的是同一个 `createUI`。

组合只在客户端运行，并且会随状态增删元素。在组合里注册的任何东西都会只在客户端把后面的编号整体错开。这种错误是静默的：一次读错编号会毁掉同步包后面的全部内容。

::: warning 在 `createUI` 里注册，在组合里使用
不要在 composable 里调用这些方法：`bindDataSource`、`setOnServerClick`、`addServerEventListener`，以及其他任何会注册同步值或 RPC 事件的方法。

有些控件在构造函数里注册。用 `UIElementNode` 包装控件前先检查它的构造函数。内置的 `FluidSlot` 包装已经去掉了它的点击 RPC。
:::

### 模式

一次注册可以承载任意多的动态内容：

- **服务端 → 客户端：** 用一个同步值承载整个模型。三行和三百行用的是同一个槽位。
- **客户端 → 服务端：** 用消息。消息按名字寻址，共用一个 RPC 事件，所以发送新名字的消息不需要注册任何东西。

```kotlin
// UI holder 的字段。
private var rows = listOf("alpha", "bravo")              // 服务端的列表
private val model = mutableStateOf(emptyList<String>())  // 客户端的镜像

// 在 createUI 里，两端都执行。
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
// 在组合里，仅客户端。
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

| `ServerMessenger` 方法 | 发送什么 |
| --- | --- |
| `send(name)` | 不带 payload 的消息 |
| `send(name, data: CompoundTag)` | 带 payload 的消息 |
| `send(name) { putString(...) }` | 内联构建 payload 的消息 |
| `call(event: RPCEvent, vararg args)` | 类型化的 RPC 事件。该事件必须在 `createUI` 里两端都注册。 |

消息处理器要注册在 `createUI` 里构建的那个 `ComposeElement` 上。消息都从它发出，包括从组合内部嵌套的 `ComposeElement` 发出的消息。

::: warning 每个 `ComposeElement` 都要在两端添加
在组合之外构建的 `ComposeElement` 会在构造函数里注册共用的消息 RPC。它必须在两端以相同顺序构建并添加。只在客户端添加一个，会让它之后的所有 RPC 错位。

在组合内部创建的 `ComposeElement`（例如 `remember { ComposeElement { ... } }`）只存在于客户端，不注册任何东西。它里面的 `rememberServerMessenger()` 会通过外层最近的、在 `createUI` 中构建的那个发送。
:::

消息 API 见 [UI Message](../preliminary/data_bindings.md#ui-message)，绑定的一般用法见[数据绑定](../preliminary/data_bindings.md)。
