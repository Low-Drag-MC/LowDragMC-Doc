# PhantomSlotWidget

<div>
  <video width="50%" controls style="margin-left: 20px; float: right;">
    <source src="../../assets/phantom_slot.mp4" type="video/mp4">
    您的浏览器不支持视频播放。
  </video>
</div>

`PhantomSlotWidget` 是一个表示"幽灵"物品槽位的 UI 组件，常用于配方配置中的虚影原料输入。与普通槽位不同，它不与真实的物品栏交互，但允许设置、修改和清除物品以用于视觉或配置目的。

## 特性

- 不允许从真实物品栏中取出或放入物品。
- 支持通过 UI 点击或 API 调用来设置物品。
- 允许右键清除槽位（`clearSlotOnRightClick`）。
- 支持与 JEI/EMI 集成以处理虚影原料。

---

## 基础属性

| 字段                     | 描述                                     |
|--------------------------|------------------------------------------|
| `maxStackSize`          | 此幽灵槽位允许的最大堆叠数量。           |
| `clearSlotOnRightClick` | 右键点击是否清空槽位。                   |

---

## API

它拥有来自 [`SlotWidget`](Slot.md) 的所有 API，你可以通过这些 API 获取或设置物品。

### setClearSlotOnRightClick

配置右键点击槽位时是否清除其内容。

=== "Java / KubeJS"

    ```java
    phantomSlot.setClearSlotOnRightClick(true);
    ```

---

### setMaxStackSize

设置幽灵槽位中允许的最大堆叠数量。

=== "Java / KubeJS"

    ```java
    phantomSlot.setMaxStackSize(64);
    ```

---

### 鼠标交互

幽灵槽位处理不同类型的鼠标交互：

| 鼠标操作                           | 效果                    |
|------------------------------------|-------------------------|
| **左键点击**空槽位并持有一个物品   | 将物品设置到槽位        |
| **左键点击**已满槽位并持有一个物品 | 替换槽位中的物品        |
| **右键点击**已满槽位               | 减少堆叠数量            |
| **Shift + 点击**                   | 动态调整堆叠数量        |
| **右键点击空槽位**                 | 清空槽位（如果启用了 `clearSlotOnRightClick`） |
