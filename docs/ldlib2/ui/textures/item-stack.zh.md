# 项目堆栈纹理
{{ version_badge("2.2.1", label="Since", icon="tag") }}
`ItemStackTexture` 将一个或多个 `ItemStack` 渲染为 GUI 纹理。当提供多个堆栈时，它们每 20 个周期（1 秒）自动循环一次。
注册表名称：`item_stack_texture`
!!!笔记 ””扩展`TransformTexture` — 支持`rotate()`、`scale()`、`transform()`。
---

＃＃ 用法
===“Java”
    ```java
    // Single item
    IGuiTexture diamondIcon = new ItemStackTexture(Items.DIAMOND);

    // Multiple items — cycle every 20 ticks
    IGuiTexture cycleIcon = new ItemStackTexture(
        Items.DIAMOND, Items.EMERALD, Items.GOLD_INGOT
    );

    // From ItemStacks
    IGuiTexture enchanted = new ItemStackTexture(
        new ItemStack(Items.DIAMOND_SWORD)
    );

    // Tinted
    IGuiTexture tinted = new ItemStackTexture(Items.DIAMOND)
        .setColor(0x80FFFFFF); // 50 % opacity
    ```

===“科特林”
    ```kotlin
    val diamond = ItemStackTexture(Items.DIAMOND)

    val cycle = ItemStackTexture(Items.DIAMOND, Items.EMERALD, Items.GOLD_INGOT)
    ```

===“KubeJS”
    ```js
    let icon = new ItemStackTexture(Items.DIAMOND);

    let cycle = new ItemStackTexture(Items.DIAMOND, Items.EMERALD);
    ```

---

## 字段
| Name | Type | Description |
| ---- | ---- | ----------- |
| `items` | `ItemStack[]` | The item stacks to display. |

---

＃＃ 方法
| Method | Returns | Description |
| ------ | ------- | ----------- |
| `setItems(ItemStack...)` | `ItemStackTexture` | Replaces the displayed stacks and resets the cycle index. |
| `setColor(int)` | `ItemStackTexture` | Sets an ARGB tint overlay applied over the rendered item. |
| `copy()` | `ItemStackTexture` | Returns a deep copy. |