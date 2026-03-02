# 库存槽位
{{ version_badge("2.2.1", label="Since", icon="tag") }}
`InventorySlots` 是一个预先构建的玩家库存小部件。它渲染标准的3行主库存和9槽热栏，并在打开`ModularUI`时自动将它们绑定到玩家的`Inventory`。
!!!笔记 ””[UIElement](../element.md){ data-preview } 上记录的所有内容（布局、样式、事件、数据绑定等）也适用于此处。
---

＃＃ 用法
===“Java”
    ```java
    var inv = new InventorySlots();
    // Slots are bound automatically when the UI opens.
    // Optionally configure all slots:
    inv.apply(slot -> slot.slotStyle(style -> style.showItemTooltips(true)));
    parent.addChild(inv);
    ```

===“科特林”
    ```kotlin
    inventorySlots({}) {
        api {
            apply { slot -> slot.slotStyle { showItemTooltips(true) } }
        }
    }
    ```

===“KubeJS”
    ```js
    let inv = new InventorySlots();
    parent.addChild(inv);
    ```

---

## XML
```xml
<inventory-slots/>
```

除了从 `UIElement` 继承的属性之外，`InventorySlots` 没有任何 XML 属性。
---

## 内部结构
| CSS class | Description |
| --------- | ----------- |
| `.__inventory_main__` | Container wrapping the three main inventory rows. |
| `.__inventory_row__` | Each of the four `Row` elements (three main + hotbar). |
| `.__inventory_hotbar__` | The hotbar row (separated by 5 px top margin). |

每行内的槽是`ItemSlot`实例，带有`is-player-slot: true`和ID`inventory_0`…`inventory_35`。
---

## 字段
| Name | Type | Access | Description |
| ---- | ---- | ------ | ----------- |
| `rows` | `Row[3]` | `public final` | The three main inventory rows (indices 9–35). |
| `hotbar` | `Row` | `public final` | The hotbar row (indices 0–8). |

`Row` 是 `UIElement` 子类，具有：
| Name | Type | Description |
| ---- | ---- | ----------- |
| `slots` | `ItemSlot[9]` | The nine item slots in this row. |

---

＃＃ 方法
| Method | Returns | Description |
| ------ | ------- | ----------- |
| `apply(Consumer<ItemSlot>)` | `InventorySlots` | Applies a consumer to every slot across all rows and the hotbar. |
