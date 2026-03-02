# 物品槽位
{{ version_badge("2.2.1", label="Since", icon="tag") }}
`ItemSlot` 是一个与原版容器系统集成的 Minecraft 物品槽。它呈现保留的`ItemStack`，显示悬停突出显示，并将自身注册到打开的`AbstractContainerMenu`以实现标准的点击传输行为。当 JEI、REI 和 EMI 存在时，它还会连接这些 mod。
!!!笔记 ””[UIElement](../element.md){ data-preview } 上记录的所有内容（布局、样式、事件、数据绑定等）也适用于此处。
---

＃＃ 用法
===“Java”
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

===“科特林”
    ```kotlin
    itemSlot({
        layout { width(18).height(18) }
    }) {
        api { bind(itemHandler, 0) }
    }
    ```

===“KubeJS”
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

## 老虎机风格
!!!信息“”#### <p style="font-size: 1rem;">悬停覆盖</p>
当鼠标悬停在槽上时在槽上绘制纹理。
默认值：`ColorRectTexture(0x80FFFFFF)`（半透明白色）
===“Java”
        ```java
        slot.slotStyle(style -> style.hoverOverlay(myTexture));
        ```

===“LSS”
        ```css
        item-slot {
            hover-overlay: color(#FFFFFF80);
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">槽覆盖</p>
在插槽背景上绘制的纹理（始终或仅当为空时 - 请参阅`show-slot-overlay-only-empty`）。
默认值：无（空）
===“Java”
        ```java
        slot.slotStyle(style -> style.slotOverlay(myOverlay));
        ```

===“LSS”
        ```css
        item-slot {
            slot-overlay: sprite("mymod:textures/gui/slot_icon.png");
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">仅显示插槽覆盖-空</p>
当`true`时，`slot-overlay`仅当槽为空时才绘制。
默认值：`true`
===“Java”
        ```java
        slot.slotStyle(style -> style.showSlotOverlayOnlyEmpty(false));
        ```

===“LSS”
        ```css
        item-slot {
            show-slot-overlay-only-empty: false;
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">show-item-tooltips</p>
悬停在插槽上是否显示标准项目工具提示。
默认值：`true`
===“Java”
        ```java
        slot.slotStyle(style -> style.showItemTooltips(false));
        ```

===“LSS”
        ```css
        item-slot {
            show-item-tooltips: false;
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">是玩家插槽</p>
将此插槽标记为玩家库存插槽（由快速移动系统使用）。
默认值：`false`
===“Java”
        ```java
        slot.slotStyle(style -> style.isPlayerSlot(true));
        ```

===“LSS”
        ```css
        item-slot {
            is-player-slot: true;
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">接受快速移动/快速移动优先</p>
该槽位是否参与shift+点击快速移动，以及多个槽位竞争时的优先级。
默认值：`true` / `0`
===“Java”
        ```java
        slot.slotStyle(style -> style.acceptQuickMove(true).quickMovePriority(1));
        ```

===“LSS”
        ```css
        item-slot {
            accept-quick-move: true;
            quick-move-priority: 1;
        }
        ```

---

## 值绑定
`ItemSlot` 扩展`BindableUIElement<ItemStack>`：
===“Java”
    ```java
    slot.bind(DataBindingBuilder.itemStack(
        () -> handler.getStackInSlot(0),
        stack -> handler.setStackInSlot(0, stack)
    ).build());
    ```

有关完整详细信息，请参阅[Data Bindings](../data_bindings.md){ data-preview }。
---

## 字段
| Name | Type | Access | Description |
| ---- | ---- | ------ | ----------- |
| `slotStyle` | `SlotStyle` | `private` (getter) | Current slot style. |
| `slot` | `Slot` | `private` (getter) | The bound `Slot`. |

---

＃＃ 方法
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
