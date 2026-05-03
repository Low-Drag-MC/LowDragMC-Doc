# ItemStackTexture

{{ version_badge("2.2.1", label="Since", icon="tag") }}

`ItemStackTexture` renders one or more `ItemStack`s as a GUI texture. When multiple stacks are provided, they cycle automatically every 20 ticks (1 second).

Registry name: `item_stack_texture`

!!! note ""
    Extends `TransformTexture` — supports `rotate()`, `scale()`, `transform()`.

---

## Usage

=== "Java"

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

## Fields

| Name | Type | Description |
| ---- | ---- | ----------- |
| `items` | `ItemStack[]` | The item stacks to display. |

---

## Methods

| Method | Returns | Description |
| ------ | ------- | ----------- |
| `setItems(ItemStack...)` | `ItemStackTexture` | Replaces the displayed stacks and resets the cycle index. |
| `setColor(int)` | `ItemStackTexture` | Sets an ARGB tint overlay applied over the rendered item. |
| `copy()` | `ItemStackTexture` | Returns a deep copy. |