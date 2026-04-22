# InventorySlots

{{ version_badge("2.2.1", label="自", icon="tag") }}

`InventorySlots` 是一个预构建的玩家物品栏控件。它渲染标准的三行主物品栏和一个 9 格快捷栏，并在 `ModularUI` 打开时自动将其绑定到玩家的 `Inventory`。

!!! note ""
    在 [UIElement](element.md){ data-preview } 上记录的所有内容（布局、样式、事件、数据绑定等）同样适用于此。

---

## 用法

=== "Java"

    ```java
    var inv = new InventorySlots();
    // 当UI打开时，槽位会自动绑定。
    // 可选地对所有槽位进行配置：
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

`InventorySlots` 除了从 `UIElement` 继承的属性外，没有其他 XML 属性。

---

## 内部结构

| CSS 类 | 描述 |
| ------ | ---- |
| `.__inventory_main__` | 包裹三行主物品栏的容器。 |
| `.__inventory_row__` | 四个 `Row` 元素中的每一个（三行主物品栏 + 快捷栏）。 |
| `.__inventory_hotbar__` | 快捷栏行（顶部有 5 px 的外边距分隔）。 |

每行内部的槽位是 `ItemSlot` 实例，带有 `is-player-slot: true` 和 ID `inventory_0` … `inventory_35`。

---

## 字段

| 名称 | 类型 | 访问权限 | 描述 |
| ---- | ---- | -------- | ---- |
| `rows` | `Row[3]` | `public final` | 三行主物品栏（索引 9–35）。 |
| `hotbar` | `Row` | `public final` | 快捷栏行（索引 0–8）。 |

`Row` 是 `UIElement` 的子类，包含：

| 名称 | 类型 | 描述 |
| ---- | ---- | ---- |
| `slots` | `ItemSlot[9]` | 此行中的九个物品槽位。 |

---

## 方法

| 方法 | 返回 | 描述 |
| ---- | ---- | ---- |
| `apply(Consumer<ItemSlot>)` | `InventorySlots` | 将一个消费者应用到所有行和快捷栏中的每个槽位。 |
