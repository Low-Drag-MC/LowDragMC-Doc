# ItemSlot

{{ version_badge("2.2.1", label="Since", icon="tag") }}

`ItemSlot` 是与原版容器系统集成的 Minecraft 物品槽。它渲染持有的 `ItemStack`，显示悬停高亮，并向打开的 `AbstractContainerMenu` 注册自身以实现标准的点击转移行为。当 JEI、REI 和 EMI 模组存在时，它也会与这些模组挂钩。

!!! note ""
    [UIElement](../element.md){ data-preview } 中记录的所有内容（布局、样式、事件、数据绑定等）同样适用于此组件。

---

## 使用方法

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

| XML 属性 | 类型 | 描述 |
| ------------- | ---- | ----------- |
| `allow-xei-Lookup` | `boolean` | 点击槽位是否触发 XEI（JEI/REI/EMI）配方查询。默认值：`true`。 |
| `id` / `count` / NBT | — | 用于在编辑器中预填充槽位显示的物品属性。 |

---

## Slot 样式

!!! info ""
    #### <p style="font-size: 1rem;">hover-overlay</p>

    鼠标悬停在槽位上时绘制的纹理。

    默认值：`ColorRectTexture(0x80FFFFFF)`（半透明白色）

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

    绘制在槽位背景上的纹理（始终显示，或仅在为空时显示——参见 `show-slot-overlay-only-empty`）。

    默认值：无（空）

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

    当为 `true` 时，`slot-overlay` 仅在槽位为空时绘制。

    默认值：`true`

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

    悬停在槽位上是否显示标准物品提示框。

    默认值：`true`

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

    将此槽位标记为玩家背包槽位（由快速移动系统使用）。

    默认值：`false`

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

    此槽位是否参与 Shift+点击快速移动，以及当多个槽位竞争时的优先级。

    默认值：`true` / `0`

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

## 值绑定

`ItemSlot` 扩展自 `BindableUIElement<ItemStack>`：

=== "Java"

    ```java
    slot.bind(DataBindingBuilder.itemStack(
        () -> handler.getStackInSlot(0),
        stack -> handler.setStackInSlot(0, stack)
    ).build());
    ```

详见 [数据绑定](../data_bindings.md){ data-preview }。

---

## 字段

| 名称 | 类型 | 访问权限 | 描述 |
| ---- | ---- | ------ | ----------- |
| `slotStyle` | `SlotStyle` | `private`（有 getter） | 当前槽位样式。 |
| `slot` | `Slot` | `private`（有 getter） | 绑定的 `Slot`。 |

---

## 方法

| 方法 | 返回值 | 描述 |
| ------ | ------- | ----------- |
| `bind(IItemHandlerModifiable, int)` | `ItemSlot` | 绑定到指定槽位索引的物品处理器。 |
| `bind(Slot)` | `ItemSlot` | 绑定到现有的原版 `Slot`。 |
| `setItem(ItemStack)` | `ItemSlot` | 设置显示的物品并通知监听器。 |
| `setItem(ItemStack, boolean)` | `ItemSlot` | 设置显示的物品；第二个参数控制是否通知。 |
| `slotStyle(Consumer<SlotStyle>)` | `ItemSlot` | 以流式方式配置样式。 |
| `xeiPhantom()` | `ItemSlot` | 在此槽位启用 XEI（JEI/REI/EMI）幻影拖放。 |
| `xeiRecipeIngredient(IngredientIO)` | `ItemSlot` | 将此槽位标记为 XEI 配方视图中的配方原料。 |
| `xeiRecipeSlot()` | `ItemSlot` | 将此槽位标记为配方槽位，使用默认的 `IngredientIO.NONE`。 |
| `xeiRecipeSlot(IngredientIO, float)` | `ItemSlot` | 以指定的 I/O 类型和概率标记为配方槽位。 |
| `getFullTooltipTexts()` | `List<Component>` | 返回合并后的物品和自定义提示文本行。 |
