# Kotlin 支持

{{ version_badge("2.2.1", label="自", icon="tag") }}

LDLib2 提供了类型安全的 Kotlin DSL 用于构建 UI 树。它通过构建器模式、嵌套 lambda 和运算符重载包装 Java API，使 UI 构建更加简洁和结构化。

---

## 核心概念

DSL 围绕两个互补的概念构建：

- **`ElementSpec`** — 保存在构建时应用于元素的配置（id、类、布局、样式等）。
- **`UIContainer`** — 在生成最终 `UIElement` 之前管理元素子项、事件和数据绑定的构建器。

每个构建器函数都遵循相同的双 lambda 签名：

```kotlin
element(
    /* spec block: 配置元素 */
    { layout = { size(200.px) } }
) {
    /* init block: 添加子项、事件、绑定 */
    label({ text("Hello!") })
}
```

**spec block** 是可选的。对于不需要配置的元素，可以完全省略：

```kotlin
element {
    button({ text("Click") })
}
```

---

## Element Spec

spec block 是一个 `ElementSpec` 接收器。它公开以下属性：

| 属性 | 类型 | 描述 |
| ---- | ---- | ---- |
| `id` | `String?` | 设置元素 ID，供选择器和查询使用。 |
| `focusable` | `Boolean?` | 元素是否可以接收键盘焦点。 |
| `visible` | `Boolean?` | 元素是否渲染。 |
| `active` | `Boolean?` | 元素是否参与事件和 tick。 |
| `layout` | `TaffyLayoutStyleDsl.() -> Unit` | 布局配置块。 |
| `style` | `BasicStyle.() -> Unit` | 视觉样式配置块。 |
| `cls` | `ClassPatchDsl.() -> Unit` | 类添加/移除块。 |

```kotlin
element({
    id = "my-panel"
    focusable = true
    visible = true
    active = true

    layout = {
        size(200.px)
        flexDirection(FlexDirection.ROW)
        gap { all(4.px) }
        padding { all(8.px) }
    }

    style = {
        background(MCSprites.RECT)
        opacity(0.9f)
        tooltips("my.tooltip.key")
    }

    cls = {
        +"active"     // 添加类 "active"
        -"disabled"   // 移除类 "disabled"
    }
}) { }
```

### `layout` 块

使用 `TaffyLayoutStyleDsl`。阅读 [布局](preliminary/layout.md){ data-preview } 了解所有可用属性。常见示例：

```kotlin
layout = {
    size(200.px)           // 宽度和高度
    width(50.pct)          // 50%
    height(auto)           // 自动
    flex(1)                // 增长/收缩
    gap { all(4.px) }
    padding { all(8.px) }
    margin { top(2.px) }
    position(TaffyPosition.ABSOLUTE)
    pos { left(10.px); top(10.px) }
    display(TaffyDisplay.GRID)
    grid {
        templateColumns("1fr 1fr")
        templateRows("auto 1fr")
        row("1")
        column("2")
    }
}
```

### `style` 块

直接使用 `BasicStyle`。阅读 [UIElement 样式](components/element.md#styles){ data-preview } 了解所有可用属性。

### `cls` 块

使用带有 `+` 和 `-` 运算符的 `ClassPatchDsl`：

```kotlin
cls = {
    +"selected"     // 添加类 "selected"
    -"hidden"       // 移除类 "hidden"
}
```

---

## 构建子元素

第二个 lambda 是一个 `UIContainer` 接收器。你可以通过在其中调用 DSL 函数来添加子构建器：

```kotlin
element({ layout = { size(200.px); gap { all(4.px) } } }) {
    label({ text("Title") })
    button({ text("OK") }) {
        events { UIEvents.CLICK on { /* handle */ } }
    }
    row {
        switch()
        toggle()
    }
}
```

### `row {}` 和 `column {}`

预配置 flex 布局的简写构建器：

- `row {}` — 设置 `flexDirection = ROW`、`alignItems = FLEX_START`
- `column {}` — 设置 `alignItems = FLEX_START`（默认列方向）

两者都接受可选的 spec：

```kotlin
row({ layout = { gap { all(4.px) }; padding { all(8.px) } } }) {
    fluidSlot()
    itemSlot({ item = Items.APPLE.defaultInstance })
}

column {
    switch()
    toggle()
}
```

---

## 事件

在 `events {}` 或 `events(capture = true) {}` 块中注册事件监听器。lambda 接收 `EventsDsl` 作为 `this`，正在构建的元素作为第一个参数。

```kotlin
element({ layout = { size(50.px) } }) {
    events { e ->
        // += 运算符：添加监听器
        UIEvents.CLICK += UIEventListener { event ->
            e.animation().duration(0.3f).style(PropertyRegistry.OPACITY, 0f).start()
        }

        // on 中缀：简洁的单表达式形式
        UIEvents.MOUSE_ENTER on { event -> event.currentElement.addClass("hover") }
        UIEvents.MOUSE_LEAVE on { event -> event.currentElement.removeClass("hover") }

        // -= 运算符：移除先前注册的监听器
        UIEvents.CLICK -= myStoredListener
    }

    // 捕获阶段：在子元素看到事件之前触发
    events(capture = true) {
        UIEvents.CLICK on { it.stopPropagation() }
    }
}
```

!!! note ""
    `events { e -> ... }` 中的 `e` 参数是正在构建的 `UIElement`。当你需要在事件处理器中引用元素时很有用（例如，调用 `e.animation()`）。

---

## 服务端事件

`serverEvents {}` 的工作方式与 `events {}` 完全相同，但监听器在**服务端**执行：

```kotlin
button {
    serverEvents {
        UIEvents.MOUSE_DOWN += {
            // 在服务端运行
            fluidTank.setFluid(FluidStack(Fluids.WATER, 1000))
        }
    }
}
```

也支持捕获阶段：

```kotlin
serverEvents(capture = true) {
    UIEvents.CLICK on { it.stopPropagation() }
}
```

---

## 数据绑定

绑定在服务端和客户端之间同步值。它们在 `UIContainer` 的 **init block** 中设置。

!!! note ""
    绑定需要双端支持。它们只在 `@LDLRegister`（服务端）菜单上下文中有意义，而不是仅 `@LDLRegisterClient` 的屏幕。

### `bind` — 双向绑定

```kotlin
// 绑定可变 Kotlin 属性引用（最简洁）
switch { bind(::myBool) }
textField { bind(::myString) }
scrollerHorizontal({ layout = { width(100.pct) } }) { bind(::myFloat) }

// 使用显式 getter 和 setter 绑定
switch { bind({ myData.enabled }, { myData.enabled = it }) }
```

### `bindS2C` — 服务端 → 客户端（只读）

```kotlin
label {
    bindS2C({
        Component.literal("Value: ")
            .append(Component.literal(myBool.toString()).withStyle(ChatFormatting.AQUA))
    })
}
```

### `bindC2S` — 客户端 → 服务端（只写）

```kotlin
textField {
    bindC2S({ newValue -> serverData = newValue })
}
```

### `dataSource` 和 `observer`

直接用于数据感知组件的底层辅助函数。这些是客户端的，**不会**跨网络同步：

```kotlin
var localValue = "hello"
label { dataSource({ Component.literal(localValue) }) }
textField {
    observer { localValue = it }
    dataSource { localValue }
}
```

---

## RPC 事件

对于带有类型参数的显式客户端 → 服务端调用，在元素引用（`UIContainer` 的 `element` 属性）上使用 `rpcEvent` 扩展：

```kotlin
button {
    // 声明 RPC：触发时在服务端运行 lambda
    val rpcEvent = element.rpcEvent { value: String ->
        string = value
    }

    // 从客户端触发
    events {
        UIEvents.MOUSE_DOWN += { rpcEvent.send("rpc") }
    }
}
```

---

## 直接 API 访问

对于 spec 或 init block 未涵盖的方法，可以直接访问元素：

### `api {}`

在底层 `UIElement` 上调用一个块。在构建阶段立即运行：

```kotlin
element({}) {
    api {
        setFocusable(true)
        setEnforceFocus { /* 失去焦点处理器 */ }
        stopInteractionEventsPropagation()
    }
}
```

### `onBuild {}`

在元素完全构建后调用。当你需要最终元素引用进行延迟设置时使用：

```kotlin
element({}) {
    onBuild { builtElement ->
        builtElement.addEventListener(UIEvents.ADDED) { /* ... */ }
    }
}
```

### 内联扩展函数

在 `.build()` 之后，返回的 `UIElement` 可以链式调用扩展函数：

```kotlin
element({}) { }
    .layoutDsl { width(100.px) }
    .styleDsl { background(MCSprites.RECT) }
    .clsDsl { +"my-class" }
```

---

## 完整示例：客户端 UI

一个包含动画、数据绑定组件和物品/流体槽的纯客户端 UI。

<div style="text-align: center;">
    <!-- VIDEO: TestDSL -->
</div>

```kotlin
@LDLRegisterClient(name = "dsl", registry = "ldlib2:screen_test")
class TestDSL : IScreenTest {
    override fun createUI(entityPlayer: Player?): ModularUI? {
        return ModularUI.of(UI.of(
            element({
                layout = { size(200.px); gap { all(3.px) }; padding { all(4.px) } }
                style = { background(Sprites.RECT) }
                cls = { +"cla" }
            }) {
                // 点击触发动画：缩小 + 淡出，然后恢复
                element({
                    layout = { size(30.px) }
                    style = { background(Sprites.RECT_SOLID).tooltips("animation") }
                }) {
                    events { e ->
                        UIEvents.CLICK += {
                            e.animation()
                                .duration(1f).ease(Eases.QUAD_IN_OUT)
                                .style(PropertyRegistry.TRANSFORM_2D, Transform2D().scale(0.5f).translate(100f, 0f))
                                .style(PropertyRegistry.OPACITY, 0f)
                                .onFinished { _ ->
                                    e.animation()
                                        .ease(Eases.QUART_IN_OUT)
                                        .style(PropertyRegistry.TRANSFORM_2D, Transform2D())
                                        .style(PropertyRegistry.OPACITY, 1f)
                                        .start()
                                }
                                .start()
                        }
                    }
                }

                // 绑定到局部变量的 Label
                var value = "hello"
                label { dataSource({ Component.literal(value) }) }

                // 按钮切换值
                button({
                    text("hello <-> world")
                    onClick = { value = if (value == "hello") "world" else "hello" }
                })

                // 数字文本框（仅客户端）
                var number = 10.4f
                textField {
                    observer { number = it.toFloatOrNull() ?: number }
                    dataSource { number.toString() }
                }.asNumeric(0.3f, 100f)

                // 包含槽位和控件的 Row
                row({ layout = { gap { all(2.px) } } }) {
                    fluidSlot()
                    itemSlot({ item = Items.APPLE.defaultInstance })
                    column {
                        switch()
                        toggle()
                    }
                }
            }
        ), entityPlayer)
    }
}
```

---

## 完整示例：同步菜单 UI

一个带有双向数据绑定、服务端事件和 RPC 的服务端同步菜单。

<div style="text-align: center;">
    <!-- VIDEO: TestMenuDSL -->
</div>

```kotlin
@LDLRegister(name = "dsl_sync", registry = "ldlib2:menu_test")
class TestMenuDSL : IMenuTest {
    private var bool = true
    private var string = "hello"
    private var number = 0.5f

    override fun createUI(player: Player): ModularUI {
        val itemHandler = ItemStackHandler(2)
        val fluidTank = FluidTank(2000)

        val root = element({ cls = { +"panel_bg" } }) {
            label({ text("Data Between Screen and Menu") })

            // 绑定了物品栏/储罐的槽位
            row({ layout = { gap { all(2.px) } } }) {
                itemSlot({ bind(itemHandler, 0) })
                itemSlot({ bind(ItemHandlerSlot(itemHandler, 1).setCanTake({ false })) })
                fluidSlot({ bind(fluidTank, 0) })
            }

            element({ layout = { gap { all(2.px) } } }) {
                // 通过 Kotlin 属性引用实现双向同步
                switch { bind(::bool) }
                textField { bind(::string) }
                scrollerHorizontal({ layout = { width(100.pct) } }) { bind(::number) }

                // 仅服务端到客户端的只读绑定：始终反映服务端状态
                label {
                    bindS2C({
                        Component.literal("s->c only: ")
                            .append(Component.literal(bool.toString()).withStyle(ChatFormatting.AQUA)).append(" ")
                            .append(Component.literal(string).withStyle(ChatFormatting.RED)).append(" ")
                            .append(Component.literal("%.2f".format(number)).withStyle(ChatFormatting.YELLOW))
                    })
                }

                button {
                    // 服务端事件：按钮点击时在服务端运行
                    serverEvents {
                        UIEvents.MOUSE_DOWN += {
                            fluidTank.setFluid(
                                if (fluidTank.fluid.fluid === Fluids.WATER)
                                    FluidStack(Fluids.LAVA, 1000)
                                else
                                    FluidStack(Fluids.WATER, 1000)
                            )
                        }
                    }
                    // RPC 事件：客户端向服务端发送字符串值
                    val rpcEvent = element.rpcEvent { clickValue: String -> string = clickValue }
                    events {
                        UIEvents.MOUSE_DOWN += { rpcEvent.send("rpc") }
                    }
                }

                inventorySlots()
            }
        }
        return ModularUI(UI.of(root, StylesheetManager.MODERN), player)
    }
}
```
