# UI 工厂

在 Minecraft 中，基于菜单（Menu）的 UI 需要同时处理客户端 Screen 和服务器端 Menu 的注册与同步。通常这涉及大量样板代码：注册 `MenuType`、创建 `AbstractContainerMenu` 子类、创建 `AbstractContainerScreen` 子类，并将它们绑定在一起。

LDLib2 提供了内置的 UI 工厂类来简化这一过程。它们预先注册了所需的 `MenuType`，并封装了 `ModularUIContainerMenu` 和 `ModularUIContainerScreen`，使您能够以最少的设置创建基于菜单的 UI。

目前提供三种工厂类，分别对应三种常见的 UI 场景：

- **`PlayerUIMenuType`** — 为玩家打开 UI（与特定方块或物品无关）
- **`BlockUIMenuType`** — 为方块实体打开 UI（如机器 GUI）
- **`HeldItemUIMenuType`** — 为玩家手持物品打开 UI（如配置器工具）

---

## `PlayerUIMenuType`

`PlayerUIMenuType` 允许您注册一个基于玩家实例的 UI，适用于不绑定到任何方块或物品的独立 UI（如玩家设置界面、背包扩展等）。

### 注册 UI

使用 `ResourceLocation` 作为唯一标识注册 UI 工厂：

```java
public static final ResourceLocation UI_ID = LDLib2.id("my_player_ui");

// 在模组初始化期间注册
public static void registerPlayerUI() {
    PlayerUIMenuType.register(UI_ID, ignored -> player -> createModularUI(player));
}
```

其中 `PlayerUIHolder` 是一个函数式接口，接收 `Player` 并返回 `ModularUI`：

```java
private static ModularUI createModularUI(Player player) {
    var root = new UIElement();
    root.addChildren(
            new Label().setText("Player UI"),
            new InventorySlots()
    ).addClass("panel_bg");

    var ui = UI.of(root, StylesheetManager.INSTANCE.getStylesheetSafe(StylesheetManager.GDP));
    return ModularUI.of(ui, player);
}
```

### 打开 UI

```java
public static void openMenuUI(Player player) {
    PlayerUIMenuType.openUI(player, UI_ID);
}
```

---

## `BlockUIMenuType`

`BlockUIMenuType` 用于为方块打开 UI。您的 `Block` 类需要实现 `BlockUIMenuType.BlockUI` 接口。

### 实现 `BlockUI` 接口

```java
public class MachineBlock extends Block implements BlockUIMenuType.BlockUI {

    public MachineBlock(Properties properties) {
        super(properties);
    }

    @Override
    public ModularUI createUI(BlockUIMenuType.BlockUIHolder holder) {
        var root = new UIElement();
        root.addChildren(
                new Label().setText("Machine UI"),
                new InventorySlots()
        ).addClass("panel_bg");

        var ui = UI.of(root, StylesheetManager.INSTANCE.getStylesheetSafe(StylesheetManager.GDP));
        return ModularUI.of(ui, holder.player);
    }

    // 可选：自定义有效性检查（默认检查方块是否改变）
    @Override
    public boolean stillValid(BlockUIMenuType.BlockUIHolder holder) {
        return holder.blockState.is(holder.player.level().getBlockState(holder.pos).getBlock());
    }
}
```

### 打开 UI

在方块的 `use` 方法中调用：

```java
@Override
public InteractionResult use(BlockState state, Level level, BlockPos pos, Player player, InteractionHand hand, BlockHitResult hit) {
    if (!level.isClientSide && player instanceof ServerPlayer serverPlayer) {
        BlockUIMenuType.openUI(serverPlayer, pos);
    }
    return InteractionResult.SUCCESS;
}
```

---

## `HeldItemUIMenuType`

`HeldItemUIMenuType` 用于为玩家手持物品打开 UI。您的 `Item` 类需要实现 `HeldItemUIMenuType.HeldItemUI` 接口。

### 实现 `HeldItemUI` 接口

```java
public class ConfiguratorItem extends Item implements HeldItemUIMenuType.HeldItemUI {

    public ConfiguratorItem(Properties properties) {
        super(properties);
    }

    @Override
    public ModularUI createUI(HeldItemUIMenuType.HeldItemUIHolder holder) {
        var root = new UIElement();
        root.addChildren(
                new Label().setText("Configurator"),
                new InventorySlots()
        ).addClass("panel_bg");

        var ui = UI.of(root, StylesheetManager.INSTANCE.getStylesheetSafe(StylesheetManager.GDP));
        return ModularUI.of(ui, holder.player);
    }

    // 可选：自定义有效性检查（默认检查手持物品是否匹配）
    @Override
    public boolean stillValid(HeldItemUIMenuType.HeldItemUIHolder holder) {
        var current = holder.player.getItemInHand(holder.hand);
        return ItemStack.matches(current, holder.itemStack);
    }
}
```

### 打开 UI

在物品的 `use` 方法中调用：

```java
@Override
public InteractionResultHolder<ItemStack> use(Level level, Player player, InteractionHand hand) {
    if (!level.isClientSide && player instanceof ServerPlayer serverPlayer) {
        HeldItemUIMenuType.openUI(serverPlayer, hand);
    }
    return InteractionResultHolder.success(player.getItemInHand(hand));
}
```

---

## `IContainerUIHolder`

三种工厂类内部均使用 `IContainerUIHolder` 接口来桥接 `ModularUI` 与 Minecraft 的菜单系统。该接口负责：

- 创建 `ModularUI` 实例（`createUI(Player player)`）
- 判断 UI 是否仍然有效（`isStillValid(Player player)`）

大多数情况下，您无需直接与此接口交互——工厂类已为您处理好了所有底层细节。

---

## 对比总结

| 工厂类 | 适用场景 | 需要实现的接口 | 打开方式 |
|--------|---------|--------------|---------|
| `PlayerUIMenuType` | 玩家独立 UI（如设置界面） | `PlayerUIHolder`（函数式注册） | `PlayerUIMenuType.openUI(player, id)` |
| `BlockUIMenuType` | 方块实体 UI（如机器 GUI） | `BlockUI` | `BlockUIMenuType.openUI(player, pos)` |
| `HeldItemUIMenuType` | 手持物品 UI（如配置器） | `HeldItemUI` | `HeldItemUIMenuType.openUI(player, hand)` |

三种工厂类均自动处理 `MenuType` 注册、`ModularUIContainerMenu` 创建和客户端 Screen 的打开，无需您编写任何样板代码。
