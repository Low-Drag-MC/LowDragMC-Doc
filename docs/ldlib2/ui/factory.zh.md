# UI 工厂

{{ version_badge("2.2.1", label="Since", icon="tag") }}

LDLib2 为最常见的使用场景提供了三种预构建的工厂辅助类。每个工厂都会自动处理菜单注册、客户端-服务端路由和生命周期验证。

| 工厂 | 触发方式 | 适用场景 |
| ------- | ------- | -------- |
| `BlockUIMenuType` | 玩家右键点击方块 | 方块 / 方块实体 UI |
| `HeldItemUIMenuType` | 玩家右键点击使用物品 | 手持工具、设备、扳手 |
| `PlayerUIMenuType` | 任何服务端调用 | 命令、按键绑定、任意触发器 |

KubeJS 用户可以通过 **`LDLib2UIFactory`** 绑定打开上述任何 UI，并通过 **`LDLib2UI`** 事件组注册 UI 构建器——无需 Java 或 Kotlin。

---

## `BlockUIMenuType` — 方块 / 方块实体 UI

当方块（或方块实体）在右键点击时打开 UI 时使用此工厂。

=== "Java"

    在你的 `Block` 类上实现 `BlockUIMenuType.BlockUI`：

    ```java
    public class MyBlock extends Block implements BlockUIMenuType.BlockUI {

        @Override
        public InteractionResult useWithoutItem(BlockState state, Level level, BlockPos pos,
                                                Player player, BlockHitResult hit) {
            if (!level.isClientSide) {
                BlockUIMenuType.openUI((ServerPlayer) player, pos);
            }
            return InteractionResult.SUCCESS;
        }

        @Override
        public ModularUI createUI(BlockUIMenuType.BlockUIHolder holder) {
            return ModularUI.of(UI.of(
                // 在此构建你的元素树
            ), holder.player);
        }
    }
    ```

=== "Kotlin"

    ```kotlin
    class MyBlock : Block(...), BlockUIMenuType.BlockUI {

        override fun useWithoutItem(state: BlockState, level: Level, pos: BlockPos,
                                    player: Player, hit: BlockHitResult): InteractionResult {
            if (!level.isClientSide) {
                BlockUIMenuType.openUI(player as ServerPlayer, pos)
            }
            return InteractionResult.SUCCESS
        }

        override fun createUI(holder: BlockUIMenuType.BlockUIHolder): ModularUI {
            val root = element({ cls = { +"panel_bg" } }) { /* ... */ }
            return ModularUI.of(UI.of(root), holder.player)
        }
    }
    ```

=== "KubeJS"

    从服务端方块事件触发打开 UI：

    ```javascript
    // server_scripts/main.js
    BlockEvents.rightClicked('minecraft:glass', event => {
        LDLib2UIFactory.openBlockUI(event.player, event.block.pos, "mymod:my_block_ui");
    })
    ```

    注册 UI 构建器（**必须在两端运行**——参见[脚本放置](#kubejs脚本放置)）：

    ```javascript
    LDLib2UI.block("mymod:my_block_ui", event => {
        event.modularUI = ModularUI.of(UI.of(
            new UIElement().addClass("panel_bg")
        ), event.player);
    })
    ```

传递给 `createUI` / 在事件中可用的上下文对象：

| 字段 | 类型 | 描述 |
| ----- | ---- | ----------- |
| `player` | `Player` | 打开 UI 的玩家 |
| `pos` | `BlockPos` | 方块的位置 |
| `blockState` | `BlockState` | 方块的当前状态 |

---

## `HeldItemUIMenuType` — 手持物品 UI

当手持物品打开 UI 时使用此工厂（例如便携设备、扳手或扫描仪）。

=== "Java"

    在你的 `Item` 类上实现 `HeldItemUIMenuType.HeldItemUI`：

    ```java
    public class MyItem extends Item implements HeldItemUIMenuType.HeldItemUI {

        @Override
        public InteractionResultHolder<ItemStack> use(Level level, Player player, InteractionHand hand) {
            if (!level.isClientSide) {
                HeldItemUIMenuType.openUI((ServerPlayer) player, hand);
            }
            return InteractionResultHolder.success(player.getItemInHand(hand));
        }

        @Override
        public ModularUI createUI(HeldItemUIMenuType.HeldItemUIHolder holder) {
            return ModularUI.of(UI.of(
                // 在此构建你的元素树
            ), holder.player);
        }
    }
    ```

=== "Kotlin"

    ```kotlin
    class MyItem : Item(...), HeldItemUIMenuType.HeldItemUI {

        override fun use(level: Level, player: Player, hand: InteractionHand): InteractionResultHolder<ItemStack> {
            if (!level.isClientSide) {
                HeldItemUIMenuType.openUI(player as ServerPlayer, hand)
            }
            return InteractionResultHolder.success(player.getItemInHand(hand))
        }

        override fun createUI(holder: HeldItemUIMenuType.HeldItemUIHolder): ModularUI {
            val root = element({ cls = { +"panel_bg" } }) { /* ... */ }
            return ModularUI.of(UI.of(root), holder.player)
        }
    }
    ```

=== "KubeJS"

    当玩家右键点击使用物品时触发打开 UI：

    ```javascript
    // server_scripts/main.js
    ItemEvents.firstRightClicked('minecraft:stick', event => {
        LDLib2UIFactory.openHeldItemUI(event.player, event.hand, "mymod:my_item_ui");
    })
    ```

    注册 UI 构建器（**必须在两端运行**——参见[脚本放置](#kubejs脚本放置)）：

    ```javascript
    LDLib2UI.item("mymod:my_item_ui", event => {
        event.modularUI = ModularUI.of(UI.of(
            new UIElement().addClass("panel_bg")
        ), event.player);
    })
    ```

传递给 `createUI` / 在事件中可用的上下文对象：

| 字段 | 类型 | 描述 |
| ----- | ---- | ----------- |
| `player` | `Player` | 持有物品的玩家 |
| `hand` | `InteractionHand` | 正在使用的手 |
| `itemStack` | `ItemStack` | 打开 UI 的物品堆 |

---

## `PlayerUIMenuType` — 玩家触发的 UI

当 UI 不绑定到特定方块或物品时使用此工厂——例如来自命令、按键绑定或任何任意的服务端触发器。

=== "Java"

    使用唯一 ID 注册一个 holder 工厂，然后在需要时调用 `openUI`：

    ```java
    // 注册一次（例如在 mod 初始化期间）
    var MY_UI_ID = ResourceLocation.fromNamespaceAndPath("mymod", "my_ui");

    PlayerUIMenuType.register(MY_UI_ID, player -> {
        return p -> ModularUI.of(UI.of(
            // 在此构建你的元素树
        ), p);
    });

    // 稍后打开（服务端）
    PlayerUIMenuType.openUI(serverPlayer, MY_UI_ID);
    ```

=== "Kotlin"

    ```kotlin
    val MY_UI_ID = ResourceLocation.fromNamespaceAndPath("mymod", "my_ui")

    // 在初始化期间注册
    PlayerUIMenuType.register(MY_UI_ID) { player ->
        PlayerUIHolder { p ->
            val root = element({ cls = { +"panel_bg" } }) { /* ... */ }
            ModularUI.of(UI.of(root), p)
        }
    }

    // 稍后打开（服务端）
    PlayerUIMenuType.openUI(serverPlayer, MY_UI_ID)
    ```

=== "KubeJS"

    从任何服务端触发器（命令、按键绑定回调等）打开 UI：

    ```javascript
    // server_scripts/main.js
    LDLib2UIFactory.openPlayerUI(player, "mymod:my_player_ui");
    ```

    注册 UI 构建器（**必须在两端运行**——参见[脚本放置](#kubejs脚本放置)）：

    ```javascript
    LDLib2UI.player("mymod:my_player_ui", event => {
        event.modularUI = ModularUI.of(UI.of(
            new UIElement().addClass("panel_bg")
        ), event.player);
    })
    ```

事件中可用的上下文对象：

| 字段 | 类型 | 描述 |
| ----- | ---- | ----------- |
| `player` | `Player` | 为其打开 UI 的玩家 |

!!! note ""
    `LDLib2UIFactory.openPlayerUI` 必须从**服务端**调用。由于没有方块或物品需要验证，UI 始终被认为是有效的。

---

## KubeJS：脚本放置

`LDLib2UI` 事件（`.block`、`.item`、`.player`）在**服务端和客户端都会触发**：

- **服务端**触发它以构建 `ModularUIContainerMenu`。
- **客户端**触发它以构建 `ModularUIContainerScreen`。

**两端都必须为同一 ID 注册处理器**——否则 UI 将只存在于一端。

### 选项 A：分离客户端和服务端脚本

在 `client_scripts` 和 `server_scripts` 中都注册构建器。你可以为每端提供不同的实现（例如客户端使用不同的样式表）：

```javascript
// client_scripts/main.js
LDLib2UI.block("mymod:my_block_ui", event => {
    event.modularUI = ModularUI.of(UI.of(
        new UIElement().addClass("panel_bg")
    ), event.player);
})
```

```javascript
// server_scripts/main.js
LDLib2UI.block("mymod:my_block_ui", event => {
    event.modularUI = ModularUI.of(UI.of(
        new UIElement().addClass("panel_bg")
    ), event.player);
})
```

### 选项 B：启动脚本（推荐）

`startup_scripts` 在**客户端和服务端都运行**，因此单次注册即可覆盖两端：

```javascript
// startup_scripts/main.js — 在客户端和服务端都执行
LDLib2UI.block("mymod:my_block_ui", event => {
    event.modularUI = ModularUI.of(UI.of(
        new UIElement().addClass("panel_bg")
    ), event.player);
})
```

!!! warning "不要在启动脚本中立即创建 UI"
    当启动脚本运行时，Minecraft 资源（样式表、纹理等）**尚未加载**。
    始终在**事件处理器 lambda 内部**创建 UI，它在 UI 打开时运行——而不是在脚本加载时。

    ```javascript
    // ❌ 错误 — 在启动时构建，资源还未准备好
    const myUI = ModularUI.of(UI.of(new UIElement()), null);
    LDLib2UI.block("mymod:my_block_ui", event => {
        event.modularUI = myUI; // 过时；资源还未加载
    })

    // ✅ 正确 — 在玩家打开 UI 时延迟构建
    LDLib2UI.block("mymod:my_block_ui", event => {
        event.modularUI = ModularUI.of(UI.of(new UIElement()), event.player);
    })
    ```
