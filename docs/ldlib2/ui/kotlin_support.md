# Kotlin Support

{{ version_badge("2.2.1", label="Since", icon="tag") }}

LDLib2 provides a type-safe Kotlin DSL for building UI trees. It wraps the Java API with builder patterns, nested lambdas, and operator overloads to make UI construction more concise and structured.

---

## Core Concepts

The DSL is built around two complementary ideas:

- **`ElementSpec`** — holds configuration (id, classes, layout, style, etc.) applied to an element at build time.
- **`UIContainer`** — a builder that manages an element's children, events, and data bindings before producing the final `UIElement`.

Every builder function follows the same two-lambda signature:

```kotlin
element(
    /* spec block: configure the element */
    { layout = { size(200.px) } }
) {
    /* init block: add children, events, bindings */
    label({ text("Hello!") })
}
```

The **spec block** is optional. You can omit it entirely for elements that need no configuration:

```kotlin
element {
    button({ text("Click") })
}
```

---

## Element Spec

The spec block is a `ElementSpec` receiver. It exposes the following properties:

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

### `layout` block

Uses `TaffyLayoutStyleDsl`. Read [Layout](preliminary/layout.md){ data-preview } for all available properties. Common examples:

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

### `style` block

Uses `BasicStyle` directly. Read [UIElement Styles](components/element.md#styles){ data-preview } for all available properties.

### `cls` block

Uses `ClassPatchDsl` with `+` and `-` operators:

```kotlin
cls = {
    +"selected"     // element.addClass("selected")
    -"hidden"       // element.removeClass("hidden")
}
```

---

## Building Children

The second lambda is a `UIContainer` receiver. You add child builders by calling their DSL functions inside it:

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

### `row {}` and `column {}`

Shorthand builders that pre-configure flex layout:

- `row {}` — sets `flexDirection = ROW`, `alignItems = FLEX_START`
- `column {}` — sets `alignItems = FLEX_START` (default column direction)

Both accept an optional spec:

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

## Events

Register event listeners in `events {}` or `events(capture = true) {}` blocks. The lambda receives an `EventsDsl` as `this` and the element being built as the first parameter.

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

!!! note ""
    The `e` parameter in `events { e -> ... }` is the `UIElement` being built. It is useful when you need a reference to the element inside the event handler (e.g., to call `e.animation()`).

---

## Server Events

`serverEvents {}` works exactly like `events {}` but the listeners execute on the **server**:

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

Capture phase is also supported:

```kotlin
serverEvents(capture = true) {
    UIEvents.CLICK on { it.stopPropagation() }
}
```

---

## Data Bindings

Bindings synchronize values between the server and client. They are set inside the **init block** on the `UIContainer`.

!!! note ""
    Bindings require both sides of the stack. They only make sense in a `@LDLRegister` (server-side) menu context, not a `@LDLRegisterClient`-only screen.

### `bind` — Bidirectional

```kotlin
// Bind a mutable Kotlin property reference (most concise)
switch { bind(::myBool) }
textField { bind(::myString) }
scrollerHorizontal({ layout = { width(100.pct) } }) { bind(::myFloat) }

// Bind with explicit getter and setter
switch { bind({ myData.enabled }, { myData.enabled = it }) }
```

### `bindS2C` — Server → Client (read-only)

```kotlin
label {
    bindS2C({
        Component.literal("Value: ")
            .append(Component.literal(myBool.toString()).withStyle(ChatFormatting.AQUA))
    })
}
```

### `bindC2S` — Client → Server (write-only)

```kotlin
textField {
    bindC2S({ newValue -> serverData = newValue })
}
```

### `dataSource` and `observer`

Lower-level helpers used directly on data-aware components. These are client-side and do **not** synchronize across the network:

```kotlin
var localValue = "hello"
label { dataSource({ Component.literal(localValue) }) }
textField {
    observer { localValue = it }
    dataSource { localValue }
}
```

---

## RPC Events

For explicit client → server calls with typed arguments, use the `rpcEvent` extension on the element reference (`element` property on `UIContainer`):

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

## Direct API Access

For methods not covered by the spec or init block, access the element directly:

### `api {}`

Calls a block on the underlying `UIElement`. Runs immediately during the build phase:

```kotlin
element({}) {
    api {
        setFocusable(true)
        setEnforceFocus { /* lost-focus handler */ }
        stopInteractionEventsPropagation()
    }
}
```

### `onBuild {}`

Called after the element is fully built. Use it when you need the final element reference for deferred setup:

```kotlin
element({}) {
    onBuild { builtElement ->
        builtElement.addEventListener(UIEvents.ADDED) { /* ... */ }
    }
}
```

### Inline extension functions

After `.build()`, the returned `UIElement` can be chained with extension functions:

```kotlin
element({}) { }
    .layoutDsl { width(100.px) }
    .styleDsl { background(MCSprites.RECT) }
    .clsDsl { +"my-class" }
```

---

## Complete Example: Client UI

A client-only UI with animation, data-bound components, and item/fluid slots.

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

## Complete Example: Synced Menu UI

A server-synced menu with bidirectional data binding, server-side events, and RPC.

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
