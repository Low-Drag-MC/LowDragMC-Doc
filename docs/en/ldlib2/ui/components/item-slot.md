# ItemSlot

{{ version_badge("2.2.1", label="Since", icon="tag") }}

`ItemSlot` is a Minecraft item slot that integrates with the vanilla container system. It renders the held `ItemStack`, shows a hover highlight, and registers itself with the open `AbstractContainerMenu` for standard click-to-transfer behaviour. It also hooks into JEI, REI, and EMI when those mods are present.

!!! note ""
    Everything documented on [UIElement](element.md){ data-preview } (layout, styles, events, data bindings, etc.) applies here too.

---

## Usage

=== "Java"

    ```java
    // Bind to an item handler
    var slot = new ItemSlot();
    slot.bind(itemHandler, 0); // IItemHandlerModifiable + slot index
    parent.addChild(slot);

    // Or bind to a vanilla Slot directly
    var slot2 = new ItemSlot(new Slot(inventory, 0, 0, 0));

    // Phantom slot (XEI drag-drop support)
    slot.xeiPhantom();
    ```

=== "Kotlin"

    ```kotlin
    itemSlot({
        layout { width(18).height(18) }
    }) {
        api { bind(itemHandler, 0) }
    }
    ```

=== "KubeJS"

    ```js
    let slot = new ItemSlot();
    slot.bind(itemHandler, 0);
    parent.addChild(slot);
    ```

---

## XML

```xml
<!-- Basic slot (no handler — uses LocalSlot) -->
<item-slot/>

<!-- With an item pre-set for display in the editor -->
<item-slot id="minecraft:diamond" count="1"/>

<!-- Disable XEI recipe lookup -->
<item-slot allow-xei-Lookup="false"/>
```

| XML Attribute | Type | Description |
| ------------- | ---- | ----------- |
| `allow-xei-Lookup` | `boolean` | Whether clicking the slot triggers XEI (JEI/REI/EMI) recipe lookup. Default: `true`. |
| `id` / `count` / NBT | — | Item attributes used to pre-fill the slot for editor display only. |

---

## Slot Style

!!! info ""
    #### <p style="font-size: 1rem;">hover-overlay</p>

    Texture drawn over the slot when the mouse hovers over it.

    Default: `ColorRectTexture(0x80FFFFFF)` (semi-transparent white)

    === "Java"

        ```java
        slot.slotStyle(style -> style.hoverOverlay(myTexture));
        ```

    === "LSS"

        ```css
        item-slot {
            hover-overlay: color(#FFFFFF80);
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">slot-overlay</p>

    Texture drawn over the slot background (always, or only when empty — see `show-slot-overlay-only-empty`).

    Default: none (empty)

    === "Java"

        ```java
        slot.slotStyle(style -> style.slotOverlay(myOverlay));
        ```

    === "LSS"

        ```css
        item-slot {
            slot-overlay: sprite("mymod:textures/gui/slot_icon.png");
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">show-slot-overlay-only-empty</p>

    When `true`, the `slot-overlay` is drawn only when the slot is empty.

    Default: `true`

    === "Java"

        ```java
        slot.slotStyle(style -> style.showSlotOverlayOnlyEmpty(false));
        ```

    === "LSS"

        ```css
        item-slot {
            show-slot-overlay-only-empty: false;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">show-item-tooltips</p>

    Whether hovering the slot shows the standard item tooltip.

    Default: `true`

    === "Java"

        ```java
        slot.slotStyle(style -> style.showItemTooltips(false));
        ```

    === "LSS"

        ```css
        item-slot {
            show-item-tooltips: false;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">is-player-slot</p>

    Marks this slot as a player inventory slot (used by the quick-move system).

    Default: `false`

    === "Java"

        ```java
        slot.slotStyle(style -> style.isPlayerSlot(true));
        ```

    === "LSS"

        ```css
        item-slot {
            is-player-slot: true;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">accept-quick-move / quick-move-priority</p>

    Whether this slot participates in shift-click quick-move, and its priority when multiple slots compete.

    Defaults: `true` / `0`

    === "Java"

        ```java
        slot.slotStyle(style -> style.acceptQuickMove(true).quickMovePriority(1));
        ```

    === "LSS"

        ```css
        item-slot {
            accept-quick-move: true;
            quick-move-priority: 1;
        }
        ```

---

## Value Binding

`ItemSlot` extends `BindableUIElement<ItemStack>`:

=== "Java"

    ```java
    slot.bind(DataBindingBuilder.itemStack(
        () -> handler.getStackInSlot(0),
        stack -> handler.setStackInSlot(0, stack)
    ).build());
    ```

See [Data Bindings](../preliminary/data_bindings.md){ data-preview } for full details.

---

## Fields

| Name | Type | Access | Description |
| ---- | ---- | ------ | ----------- |
| `slotStyle` | `SlotStyle` | `private` (getter) | Current slot style. |
| `slot` | `Slot` | `private` (getter) | The bound `Slot`. |

---

## Methods

| Method | Returns | Description |
| ------ | ------- | ----------- |
| `bind(IItemHandlerModifiable, int)` | `ItemSlot` | Binds to an item handler at the given slot index. |
| `bind(Slot)` | `ItemSlot` | Binds to an existing vanilla `Slot`. |
| `setItem(ItemStack)` | `ItemSlot` | Sets the displayed item and notifies listeners. |
| `setItem(ItemStack, boolean)` | `ItemSlot` | Sets the displayed item; second param controls notification. |
| `slotStyle(Consumer<SlotStyle>)` | `ItemSlot` | Configures style fluently. |
| `xeiPhantom()` | `ItemSlot` | Enables XEI (JEI/REI/EMI) phantom drag-drop on this slot. |
| `xeiRecipeIngredient(IngredientIO)` | `ItemSlot` | Marks this slot as a recipe ingredient in XEI recipe views. |
| `xeiRecipeSlot()` | `ItemSlot` | Marks this slot as a recipe slot with default `IngredientIO.NONE`. |
| `xeiRecipeSlot(IngredientIO, float)` | `ItemSlot` | Marks as recipe slot with given I/O type and chance. |
| `getFullTooltipTexts()` | `List<Component>` | Returns the combined item and custom tooltip lines. |
