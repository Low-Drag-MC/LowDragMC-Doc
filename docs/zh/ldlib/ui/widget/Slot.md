# SlotWidget

![图片标题](../assets/slot.png){ width="30%" align=right }


`SlotWidget` 代表容器 GUI 中的交互式物品槽位。该控件支持可配置属性，例如是否可以取出或放入物品、自定义悬停覆盖层和工具提示，以及与 JEI/REI/EMI 系统集成以显示原料详情。它可以被配置为代表标准库存容器中的槽位或通过物品传输处理器来实现。

!!! note
    你无法修改 slot 控件的尺寸。
    

## 基础属性

| 字段             | 描述                                                                                 |
|-------------------|---------------------------------------------------------------------------------------------|
| canTakeItems      | 指示是否可以从槽位中提取物品（可通过 setter 修改）                   |
| canPutItems       | 指示是否可以向槽位中插入物品（可通过 setter 修改）                    |
| drawHoverOverlay  | 决定当鼠标悬停在槽位上时是否绘制悬停覆盖层                 |
| drawHoverTips     | 决定当鼠标悬停在槽位上时是否显示工具提示                   |
| lastItem      | 上一 tick 存储的物品。     |

---

## API

### setContainerSlot

通过指定槽位索引将控件与库存容器关联。例如玩家物品栏。

=== "Java / KubeJS"

    ``` java
    var player = ...;
    slotWidget.setContainerSlot(player.getInventory(), 2); // 绑定玩家物品栏的第 2 个索引。
    ```

---

### setHandlerSlot

配置控件使用指定槽位索引的物品传输处理器。

#### Java

!!! note "Java 用户请注意！！！"
    如果你想使用来自 Forge 的 `ItemStackHandler` 或来自 Fabric 的 `Storage<ItemVariant>` 的处理器，你需要额外添加一行代码。因为 Forge 和 Fabric 有不同的 API，你需要将处理器转换为 LDLib 的处理器，可以在 `ItemTransferHelperImpl` 中找到转换方法。

    === "Forge"

        ``` java
        var itemHandler = ...;
        var itemTransfer = ItemTransferHelperImpl.toItemTransfer(itemHandler);
        ```

    === "Fabric"

        ``` java
        var storage = ...;
        var itemTransfer = ItemTransferHelperImpl.toItemTransfer(storage);
        ```

#### KubeJS

KubeJS 用户不需要做这些繁琐的操作。我们已经将它们转换为内部的物品传输处理器。

=== "KubeJS"

    ``` javascript
    slotWidget.setHandlerSlot(itemTransfer, 0);
    ```

---

### setItem

设置内部物品堆叠，可选择是否通知。

=== "Java / KubeJS"

    ``` java
    slotWidget.setItem(itemstack); // 它也会触发你设置的监听
    slotWidget.setItem(itemstack, false); // 它不会触发监听
    ```

---

### getItem

获取存储的内部物品堆叠。

=== "Java / KubeJS"

    ``` java
    var itemstack = slotWidget.getItem();
    ```
---

### setChangeListener

配置当槽位内容变化时触发的监听器。

=== "Java"

    ``` java
    slotWidget.setChangeListener(() -> {
        var last = slotWidget.getLastItem();
        var current = slotWidget.getItem();
    });
    ```

=== "KubeJS"

    ``` javascript
    slotWidget.setChangeListener(() => {
        let last = slotWidget.getLastItem();
        let current = slotWidget.getItem();
    });
    ```

---

### canPutStack

是否可以向槽位放入物品堆叠。

=== "Java / KubeJS"

    ``` java
    slotWidget.canPutStack(true);
    ```

---

### canTakeStack

是否可以从槽位取出物品堆叠。

=== "Java / KubeJS"

    ``` java
    slotWidget.canTakeStack(true);
    ```

---

### setLocationInfo

配置额外的槽位位置信息，例如它是否属于玩家容器或快捷栏。这将影响 Shift 移动行为。

=== "Java / KubeJS"

    ``` java
    slotWidget.setLocationInfo(true, false); // (isPlayerContainer isPlayerHotBar)
    ```

---
