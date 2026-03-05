# InventorySlots

{{ version_badge("2.2.1", label="Since", icon="tag") }}

`InventorySlots` 是一个预构建的玩家物品栏组件。它渲染标准的 3 行主物品栏和 9 格快捷栏，并在 `ModularUI` 打开时自动绑定到玩家的 `Inventory`。

!!! note ""
    [UIElement](../element.md){ data-preview } 中记录的所有内容（布局、样式、事件、数据绑定等）同样适用于此组件。

---

## 使用方法

=== "Java"

    ```java
    var inv = new InventorySlots();
    // Slots are bound automatically when the UI opens.
    // Optionally configure all slots:
    inv.apply(slot -> slot.slotStyle(style -> style.showItemTooltips(true)));
    parent.addChild(inv);
    ```

=== "Kotlin"

    ```kotlin
    inventorySlots({}) {
        api {
            apply { slot -> slot.slotStyle { showItemTooltips(true) } }
        }
    }
    ```

=== "KubeJS"

    ```js
    let inv = new InventorySlots();
    parent.addChild(inv);
    ```

---

## XML

```xml
<inventory-slots/>
```

`InventorySlots` 除了继承自 `UIElement` 的属性外，没有其他 XML 属性。

---

## 内部结构

| CSS 类名 | 描述 |
| --------- | ----------- |
| `.__inventory_main__` | 包裹三行主物品栏的容器。 |
| `.__inventory_row__` | 四个 `Row` 元素中的每一个（三个主行 + 快捷栏）。 |
| `.__inventory_hotbar__` | 快捷栏行（顶部间距 5 像素）。 |

每行内的槽位是 `ItemSlot` 实例，具有 `is-player-slot: true` 属性，ID 为 `inventory_0` … `inventory_35`。

---

## 字段

| 名称 | 类型 | 访问权限 | 描述 |
| ---- | ---- | ------ | ----------- |
| `rows` | `Row[3]` | `public final` | 三行主物品栏（索引 9–35）。 |
| `hotbar` | `Row` | `public final` | 快捷栏行（索引 0–8）。 |

`Row` 是 `UIElement` 的子类，包含：

| 名称 | 类型 | 描述 |
| ---- | ---- | ----------- |
| `slots` | `ItemSlot[9]` | 该行中的九个物品槽。 |

---

## 方法

| 方法 | 返回值 | 描述 |
| ------ | ------- | ----------- |
| `apply(Consumer<ItemSlot>)` | `InventorySlots` | 对所有行和快捷栏中的每个槽位应用一个 consumer。 |
