# ItemSlot

<VersionBadge version="2.2.1" label="Since" icon="tag" />

`ItemSlot` is a Minecraft item slot that integrates with the vanilla container system. It renders the held `ItemStack`, shows a hover highlight, and registers itself with the open `AbstractContainerMenu` for standard click-to-transfer behaviour. It also hooks into JEI, REI, and EMI when those mods are present.

::: info
Everything documented on [UIElement](element.md) (layout, styles, events, data bindings, etc.) applies here too.
:::

---

## Usage

<DocTabs>
<DocTab title="Java">

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

</DocTab>
<DocTab title="Kotlin">

```kotlin
itemSlot({
    layout { width(18).height(18) }
}) {
    api { bind(itemHandler, 0) }
}
```

</DocTab>
<DocTab title="KubeJS">

```js
let slot = new ItemSlot();
slot.bind(itemHandler, 0);
parent.addChild(slot);
```

</DocTab>
</DocTabs>

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

::: info
#### <p style="font-size: 1rem;">hover-overlay</p>

Texture drawn over the slot when the mouse hovers over it.

Default: `ColorRectTexture(0x80FFFFFF)` (semi-transparent white)

<DocTabs>
<DocTab title="Java">

```java
slot.slotStyle(style -> style.hoverOverlay(myTexture));
```

</DocTab>
<DocTab title="LSS">

```css
item-slot {
    hover-overlay: color(#FFFFFF80);
}
```

</DocTab>
</DocTabs>

:::

::: info
#### <p style="font-size: 1rem;">slot-overlay</p>

Texture drawn over the slot background (always, or only when empty — see `show-slot-overlay-only-empty`).

Default: none (empty)

<DocTabs>
<DocTab title="Java">

```java
slot.slotStyle(style -> style.slotOverlay(myOverlay));
```

</DocTab>
<DocTab title="LSS">

```css
item-slot {
    slot-overlay: sprite("mymod:textures/gui/slot_icon.png");
}
```

</DocTab>
</DocTabs>

:::

::: info
#### <p style="font-size: 1rem;">show-slot-overlay-only-empty</p>

When `true`, the `slot-overlay` is drawn only when the slot is empty.

Default: `true`

<DocTabs>
<DocTab title="Java">

```java
slot.slotStyle(style -> style.showSlotOverlayOnlyEmpty(false));
```

</DocTab>
<DocTab title="LSS">

```css
item-slot {
    show-slot-overlay-only-empty: false;
}
```

</DocTab>
</DocTabs>

:::

::: info
#### <p style="font-size: 1rem;">show-item-tooltips</p>

Whether hovering the slot shows the standard item tooltip.

Default: `true`

<DocTabs>
<DocTab title="Java">

```java
slot.slotStyle(style -> style.showItemTooltips(false));
```

</DocTab>
<DocTab title="LSS">

```css
item-slot {
    show-item-tooltips: false;
}
```

</DocTab>
</DocTabs>

:::

::: info
#### <p style="font-size: 1rem;">is-player-slot</p>

Marks this slot as a player inventory slot (used by the quick-move system).

Default: `false`

<DocTabs>
<DocTab title="Java">

```java
slot.slotStyle(style -> style.isPlayerSlot(true));
```

</DocTab>
<DocTab title="LSS">

```css
item-slot {
    is-player-slot: true;
}
```

</DocTab>
</DocTabs>

:::

::: info
#### <p style="font-size: 1rem;">accept-quick-move / quick-move-priority</p>

Whether this slot participates in shift-click quick-move, and its priority when multiple slots compete.

Defaults: `true` / `0`

<DocTabs>
<DocTab title="Java">

```java
slot.slotStyle(style -> style.acceptQuickMove(true).quickMovePriority(1));
```

</DocTab>
<DocTab title="LSS">

```css
item-slot {
    accept-quick-move: true;
    quick-move-priority: 1;
}
```

</DocTab>
</DocTabs>

:::

---

## Value Binding

`ItemSlot` extends `BindableUIElement&lt;ItemStack&gt;`:

<DocTabs>
<DocTab title="Java">

```java
slot.bind(DataBindingBuilder.itemStack(
    () -> handler.getStackInSlot(0),
    stack -> handler.setStackInSlot(0, stack)
).build());
```

</DocTab>
</DocTabs>

See [Data Bindings](../preliminary/data_bindings.md) for full details.

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
| `slotStyle(Consumer&lt;SlotStyle&gt;)` | `ItemSlot` | Configures style fluently. |
| `xeiPhantom()` | `ItemSlot` | Enables XEI (JEI/REI/EMI) phantom drag-drop on this slot. |
| `xeiRecipeIngredient(IngredientIO)` | `ItemSlot` | Marks this slot as a recipe ingredient in XEI recipe views. |
| `xeiRecipeSlot()` | `ItemSlot` | Marks this slot as a recipe slot with default `IngredientIO.NONE`. |
| `xeiRecipeSlot(IngredientIO, float)` | `ItemSlot` | Marks as recipe slot with given I/O type and chance. |
| `getFullTooltipTexts()` | `List&lt;Component&gt;` | Returns the combined item and custom tooltip lines. |
