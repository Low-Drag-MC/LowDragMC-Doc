# ItemStackTexture

{{ version_badge("2.2.1", label="自", icon="tag") }}

`ItemStackTexture` 可将一个或多个 `ItemStack` 渲染为 GUI 纹理。当提供多个堆叠时，它们会每 20 tick（1 秒）自动循环切换。

注册名：`item_stack_texture`

!!! note ""
    继承自 `TransformTexture` — 支持 `rotate()`、`scale()`、`transform()`。

---

## 用法

=== "Java"

    ```java
    // 单个物品
    IGuiTexture diamondIcon = new ItemStackTexture(Items.DIAMOND);

    // 多个物品 — 每 20 tick 循环一次
    IGuiTexture cycleIcon = new ItemStackTexture(
        Items.DIAMOND, Items.EMERALD, Items.GOLD_INGOT
    );

    // 从 ItemStack 创建
    IGuiTexture enchanted = new ItemStackTexture(
        new ItemStack(Items.DIAMOND_SWORD)
    );

    // 着色
    IGuiTexture tinted = new ItemStackTexture(Items.DIAMOND)
        .setColor(0x80FFFFFF); // 50 % 不透明度
    ```

=== "Kotlin"

    ```kotlin
    val diamond = ItemStackTexture(Items.DIAMOND)

    val cycle = ItemStackTexture(Items.DIAMOND, Items.EMERALD, Items.GOLD_INGOT)
    ```

=== "KubeJS"

    ```js
    let icon = new ItemStackTexture(Items.DIAMOND);

    let cycle = new ItemStackTexture(Items.DIAMOND, Items.EMERALD);
    ```

---

## 字段

| 名称 | 类型 | 描述 |
| ---- | ---- | ---- |
| `items` | `ItemStack[]` | 要显示的物品堆叠。 |

---

## 方法

| 方法 | 返回 | 描述 |
| ---- | ---- | ---- |
| `setItems(ItemStack...)` | `ItemStackTexture` | 替换显示的物品堆叠并重置循环索引。 |
| `setColor(int)` | `ItemStackTexture` | 设置在渲染物品上叠加的 ARGB 着色。 |
| `copy()` | `ItemStackTexture` | 返回深拷贝。 |
