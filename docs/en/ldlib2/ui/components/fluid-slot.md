# FluidSlot

{{ version_badge("2.2.1", label="Since", icon="tag") }}

`FluidSlot` renders a `FluidStack` inside a slot with a directional fill visualisation. Clicking the slot with a fluid container in hand fills or drains it via the vanilla `FluidUtil` API. It also hooks into JEI, REI, and EMI when those mods are present.

!!! note ""
    Everything documented on [UIElement](element.md){ data-preview } (layout, styles, events, data bindings, etc.) applies here too.

---

## Usage

=== "Java"

    ```java
    var fluidSlot = new FluidSlot();
    fluidSlot.bind(fluidHandler, 0); // IFluidHandler + tank index
    fluidSlot.setCapacity(16000);
    parent.addChild(fluidSlot);

    // Phantom slot (XEI drag-drop)
    fluidSlot.xeiPhantom();
    ```

=== "Kotlin"

    ```kotlin
    fluidSlot({
        layout { width(18).height(18) }
    }) {
        api {
            bind(fluidHandler, 0)
            setCapacity(16000)
        }
    }
    ```

=== "KubeJS"

    ```js
    let slot = new FluidSlot();
    slot.bind(fluidHandler, 0);
    slot.setCapacity(16000);
    parent.addChild(slot);
    ```

---

## XML

```xml
<!-- Basic slot -->
<fluid-slot capacity="16000"/>

<!-- Disable XEI lookup -->
<fluid-slot capacity="4000" allow-xei-Lookup="false"/>
```

| XML Attribute | Type | Description |
| ------------- | ---- | ----------- |
| `capacity` | `int` | Tank capacity shown in the tooltip. Default: `0`. |
| `allow-xei-Lookup` | `boolean` | Whether hovering triggers XEI recipe lookup. Default: `true`. |

---

## Internal Structure

| Field | CSS class | Description |
| ----- | --------- | ----------- |
| `amountLabel` | `.__fluid-slot_amount-label__` | `Label` in the bottom-right corner showing the fluid amount (e.g. `1.5B`). |

---

## Slot Style

!!! info ""
    #### <p style="font-size: 1rem;">fill-direction</p>

    Direction in which the fluid texture fills the slot as the amount increases. Values: `LEFT_TO_RIGHT`, `RIGHT_TO_LEFT`, `UP_TO_DOWN`, `DOWN_TO_UP`, `ALWAYS_FULL`.

    Default: `LEFT_TO_RIGHT`

    === "Java"

        ```java
        fluidSlot.slotStyle(style -> style.fillDirection(FillDirection.UP_TO_DOWN));
        ```

    === "LSS"

        ```css
        fluid-slot {
            fill-direction: UP_TO_DOWN;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">hover-overlay</p>

    Texture drawn over the slot on hover.

    Default: `ColorRectTexture(0x80FFFFFF)`

    === "Java"

        ```java
        fluidSlot.slotStyle(style -> style.hoverOverlay(myTexture));
        ```

    === "LSS"

        ```css
        fluid-slot {
            hover-overlay: color(#FFFFFF80);
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">slot-overlay</p>

    Texture drawn over the slot background.

    Default: none (empty)

    === "Java"

        ```java
        fluidSlot.slotStyle(style -> style.slotOverlay(myOverlay));
        ```

    === "LSS"

        ```css
        fluid-slot {
            slot-overlay: sprite("mymod:textures/gui/fluid_slot.png");
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">show-slot-overlay-only-empty</p>

    When `true`, `slot-overlay` is drawn only when the slot is empty.

    Default: `true`

    === "Java"

        ```java
        fluidSlot.slotStyle(style -> style.showSlotOverlayOnlyEmpty(false));
        ```

    === "LSS"

        ```css
        fluid-slot {
            show-slot-overlay-only-empty: false;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">show-fluid-tooltips</p>

    Whether hovering shows the fluid name, amount/capacity, temperature, and state tooltip.

    Default: `true`

    === "Java"

        ```java
        fluidSlot.slotStyle(style -> style.showFluidTooltips(false));
        ```

    === "LSS"

        ```css
        fluid-slot {
            show-fluid-tooltips: false;
        }
        ```

---

## Value Binding

`FluidSlot` extends `BindableUIElement<FluidStack>`:

=== "Java"

    ```java
    fluidSlot.bind(DataBindingBuilder.fluidStackS2C(
        () -> tank.getFluidInTank(0)
    ).build());
    ```

See [Data Bindings](../preliminary/data_bindings.md){ data-preview } for full details.

---

## Fields

| Name | Type | Access | Description |
| ---- | ---- | ------ | ----------- |
| `amountLabel` | `Label` | `public final` | Label showing the compact fluid amount. |
| `slotStyle` | `SlotStyle` | `private` (getter) | Current slot style. |
| `fluid` | `FluidStack` | `private` (getter) | The currently displayed fluid. |
| `capacity` | `int` | `getter/setter` | Tank capacity used for fill calculations and tooltips. |
| `allowClickFilled` | `boolean` | `getter/setter` | Whether clicking with a container fills it from the tank. Default: `true`. |
| `allowClickDrained` | `boolean` | `getter/setter` | Whether clicking with a container drains it into the tank. Default: `true`. |

---

## Methods

| Method | Returns | Description |
| ------ | ------- | ----------- |
| `bind(IFluidHandler, int)` | `FluidSlot` | Binds to a fluid handler at the given tank index. Syncs fluid and capacity. |
| `setFluid(FluidStack)` | `FluidSlot` | Sets the displayed fluid and notifies listeners. |
| `setFluid(FluidStack, boolean)` | `FluidSlot` | Sets the fluid; second param controls notification. |
| `slotStyle(Consumer<SlotStyle>)` | `FluidSlot` | Configures style fluently. |
| `xeiPhantom()` | `FluidSlot` | Enables XEI phantom drag-drop on this slot. |
| `xeiRecipeIngredient(IngredientIO)` | `FluidSlot` | Marks as recipe ingredient in XEI recipe views. |
| `xeiRecipeSlot()` | `FluidSlot` | Marks as recipe slot with default `IngredientIO.NONE`. |
| `xeiRecipeSlot(IngredientIO, float)` | `FluidSlot` | Marks as recipe slot with given I/O type and chance. |
| `getFluidAmountText()` | `Component` | Returns the compact amount text shown in `amountLabel`. |
| `getFullTooltipTexts()` | `List<Component>` | Returns the combined fluid and custom tooltip lines. |
