# Kotlin 支持
{{ version_badge("2.2.1", label="Since", icon="tag") }}
LDLib2 提供了用于构建 UI 树的类型安全的 Kotlin DSL。它将 Java API 与构建器模式、嵌套 lambda 和运算符重载封装在一起，使 UI 构造更加简洁和结构化。
---

## 核心概念
DSL 围绕两个互补的想法构建：
- **`ElementSpec`** — 保存在构建时应用于元素的配置（id、类、布局、样式等）。- **`UIContainer`** — 在生成最终的 `UIElement` 之前管理元素的子元素、事件和数据绑定的构建器。
每个构建器函数都遵循相同的两个 lambda 签名：
```kotlin
element(
    /* spec block: configure the element */
    { layout = { size(200.px) } }
) {
    /* init block: add children, events, bindings */
    label({ text("Hello!") })
}
```

**规格块**是可选的。对于不需要配置的元素，您可以完全省略它：
```kotlin
element {
    button({ text("Click") })
}
```

---

## 元素规格
规格块是`ElementSpec`接收器。它公开了以下属性：
| Property | Type | Description |
| -------- | ---- | ----------- |
| `id` | `String?` | Sets the element ID used by selectors and queries. |
| `focusable` | `Boolean?` | Whether the element can receive keyboard focus. |
| `visible` | `Boolean?` | Whether the element is rendered. |
| `active` | `Boolean?` | Whether the element participates in events and ticks. |
| `layout` | `TaffyLayoutStyleDsl.() -> Unit` | Layout configuration block. |
| `style` | `BasicStyle.() -> Unit` | Visual style configuration block. |
| `cls` | `ClassPatchDsl.() -> Unit` | Class add/remove block. |

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
        +"active"     // adds the class "active"
        -"disabled"   // removes the class "disabled"
    }
}) { }
```

### `layout`块
使用`TaffyLayoutStyleDsl`。阅读 [Layout](preliminary/layout.md){ data-preview } 以获取所有可用属性。常见示例：
```kotlin
layout = {
    size(200.px)           // width and height
    width(50.pct)          // 50%
    height(auto)           // auto
    flex(1)                // grow/shrink
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

### `style`块
直接使用`BasicStyle`。阅读 [UIElement Styles](components/element.md#styles){ data-preview } 以获取所有可用属性。
### `cls`块
将`ClassPatchDsl` 与`+` 和`-` 运算符一起使用：
```kotlin
cls = {
    +"selected"     // element.addClass("selected")
    -"hidden"       // element.removeClass("hidden")
}
```

---

## 培养孩子
第二个 lambda 是 `UIContainer` 接收器。您可以通过调用子构建器内部的 DSL 函数来添加子构建器：
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

### `row {}` 和`column {}`
预先配置弹性布局的速记构建器：
- `row {}` — 设置`flexDirection = ROW`、`alignItems = FLEX_START`- `column {}` — 设置`alignItems = FLEX_START`（默认列方向）
两者都接受可选规范：
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

## 活动
在 `events {}` 或 `events(capture = true) {}` 块中注册事件监听器。 lambda 接收 `EventsDsl` 作为 `this` 以及正在构建的元素作为第一个参数。
```kotlin
element({ layout = { size(50.px) } }) {
    events { e ->
        // += operator: add a listener
        UIEvents.CLICK += UIEventListener { event ->
            e.animation().duration(0.3f).style(PropertyRegistry.OPACITY, 0f).start()
        }

        // on infix: concise single-expression form
        UIEvents.MOUSE_ENTER on { event -> event.currentElement.addClass("hover") }
        UIEvents.MOUSE_LEAVE on { event -> event.currentElement.removeClass("hover") }

        // -= operator: remove a previously registered listener
        UIEvents.CLICK -= myStoredListener
    }

    // Capture phase: fires before children see the event
    events(capture = true) {
        UIEvents.CLICK on { it.stopPropagation() }
    }
}
```

!!!笔记 ””`events { e -> ... }` 中的`e` 参数是正在构建的`UIElement`。当您需要对事件处理程序内的元素的引用（例如，调用`e.animation()`）时，它非常有用。
---

## 服务器事件
`serverEvents {}` 的工作方式与 `events {}` 完全相同，但侦听器在 **服务器** 上执行：
```kotlin
button {
    serverEvents {
        UIEvents.MOUSE_DOWN += {
            // runs on the server
            fluidTank.setFluid(FluidStack(Fluids.WATER, 1000))
        }
    }
}
```

还支持捕获阶段：
```kotlin
serverEvents(capture = true) {
    UIEvents.CLICK on { it.stopPropagation() }
}
```

---

## 数据绑定
绑定在服务器和客户端之间同步值。它们设置在 `UIContainer` 上的 **init 块** 内。
!!!笔记 ””绑定需要堆栈的两侧。它们仅在`@LDLRegister`（服务器端）菜单上下文中有意义，而不是仅在`@LDLRegisterClient` 屏幕中有意义。
### `bind` — 双向
```kotlin
// Bind a mutable Kotlin property reference (most concise)
switch { bind(::myBool) }
textField { bind(::myString) }
scrollerHorizontal({ layout = { width(100.pct) } }) { bind(::myFloat) }

// Bind with explicit getter and setter
switch { bind({ myData.enabled }, { myData.enabled = it }) }
```

### `bindS2C` — 服务器 → 客户端（只读）
```kotlin
label {
    bindS2C({
        Component.literal("Value: ")
            .append(Component.literal(myBool.toString()).withStyle(ChatFormatting.AQUA))
    })
}
```

### `bindC2S` — 客户端 → 服务器（只写）
```kotlin
textField {
    bindC2S({ newValue -> serverData = newValue })
}
```

### `dataSource` 和`observer`
直接在数据感知组件上使用较低级别的帮助程序。这些是客户端，并且**不**通过网络同步：
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
对于带有类型化参数的显式客户端→服务器调用，请在元素引用上使用`rpcEvent`扩展（`UIContainer`上的`element`属性）：
```kotlin
button {
    // Declare the RPC: the lambda runs on the server when triggered
    val rpcEvent = element.rpcEvent { value: String ->
        string = value
    }

    // Trigger from the client
    events {
        UIEvents.MOUSE_DOWN += { rpcEvent.send("rpc") }
    }
}
```

---

## 直接API访问
对于规范或 init 块未涵盖的方法，请直接访问元素：
###`api {}`
调用底层 `UIElement` 上的块。在构建阶段立即运行：
```kotlin
element({}) {
    api {
        setFocusable(true)
        setEnforceFocus { /* lost-focus handler */ }
        stopInteractionEventsPropagation()
    }
}
```

###`onBuild {}`
在元素完全构建后调用。当您需要延迟设置的最终元素参考时使用它：
```kotlin
element({}) {
    onBuild { builtElement ->
        builtElement.addEventListener(UIEvents.ADDED) { /* ... */ }
    }
}
```

### 内联扩展函数
在`.build()`之后，返回的`UIElement`可以与扩展函数链接：
```kotlin
element({}) { }
    .layoutDsl { width(100.px) }
    .styleDsl { background(MCSprites.RECT) }
    .clsDsl { +"my-class" }
```

---

## 完整示例：客户端 UI
具有动画、数据绑定组件和项目/流体槽的仅限客户端的 UI。
<div style="text-align: center;"><!-- VIDEO: TestDSL --></div>
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
                // Click to animate: shrink + fade out, then restore
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

                // Label bound to a local variable
                var value = "hello"
                label { dataSource({ Component.literal(value) }) }

                // Button toggles the value
                button({
                    text("hello <-> world")
                    onClick = { value = if (value == "hello") "world" else "hello" }
                })

                // Numeric text field (client-side only)
                var number = 10.4f
                textField {
                    observer { number = it.toFloatOrNull() ?: number }
                    dataSource { number.toString() }
                }.asNumeric(0.3f, 100f)

                // Row with slots and controls
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
具有双向数据绑定、服务器端事件和 RPC 的服务器同步菜单。
<div style="text-align: center;"><!-- VIDEO: TestMenuDSL --></div>
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

            // Slots with bound inventory/tank
            row({ layout = { gap { all(2.px) } } }) {
                itemSlot({ bind(itemHandler, 0) })
                itemSlot({ bind(ItemHandlerSlot(itemHandler, 1).setCanTake({ false })) })
                fluidSlot({ bind(fluidTank, 0) })
            }

            element({ layout = { gap { all(2.px) } } }) {
                // Bidirectional sync via Kotlin property references
                switch { bind(::bool) }
                textField { bind(::string) }
                scrollerHorizontal({ layout = { width(100.pct) } }) { bind(::number) }

                // Server-to-client read-only: always reflects server state
                label {
                    bindS2C({
                        Component.literal("s->c only: ")
                            .append(Component.literal(bool.toString()).withStyle(ChatFormatting.AQUA)).append(" ")
                            .append(Component.literal(string).withStyle(ChatFormatting.RED)).append(" ")
                            .append(Component.literal("%.2f".format(number)).withStyle(ChatFormatting.YELLOW))
                    })
                }

                button {
                    // Server-side event: runs on server when the button is clicked
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
                    // RPC event: client sends a string value to the server
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
