# 用户界面工厂
{{ version_badge("2.2.1", label="Since", icon="tag") }}
LDLib2 为最常见的用例提供了三个预构建的工厂助手。每个工厂都会自动处理菜单注册、客户端-服务器路由和生命周期验证。
| Factory | Trigger | Use when |
| ------- | ------- | -------- |
| `BlockUIMenuType` | Player right-clicks a block | Block / Block Entity UI |
| `HeldItemUIMenuType` | Player right-clicks with an item | Handheld tools, devices, wrenches |
| `PlayerUIMenuType` | Any server-side call | Commands, keybinds, arbitrary triggers |

KubeJS 用户可以通过 **`LDLib2UIFactory`** 绑定打开其中任何一个，并通过 **`LDLib2UI`** 事件组注册 UI 构建器 - 不需要 Java 或 Kotlin。
---

## `BlockUIMenuType` — 块/块实体 UI
当块（或块实体）通过右键单击打开 UI 时使用此选项。
===“Java”
在 `Block` 类上实现 `BlockUIMenuType.BlockUI`：
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
                // build your element tree here
            ), holder.player);
        }
    }
    ```

===“科特林”
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

===“KubeJS”
从服务器端块事件触发 UI 打开：
    ```javascript
    // server_scripts/main.js
    BlockEvents.rightClicked('minecraft:glass', event => {
        LDLib2UIFactory.openBlockUI(event.player, event.block.pos, "mymod:my_block_ui");
    })
    ```

注册 UI 构建器（**必须在两侧运行** - 请参阅[Script Placement](#kubejs-script-placement)）：
    ```javascript
    LDLib2UI.block("mymod:my_block_ui", event => {
        event.modularUI = ModularUI.of(UI.of(
            new UIElement().addClass("panel_bg")
        ), event.player);
    })
    ```

传递给 `createUI` 的上下文对象/在事件中可用：
| Field | Type | Description |
| ----- | ---- | ----------- |
| `player` | `Player` | The player who opened the UI |
| `pos` | `BlockPos` | The block's position |
| `blockState` | `BlockState` | The block's current state |

---

## `HeldItemUIMenuType` — 持有物品 UI
当持有的物品打开 UI（例如便携式设备、扳手或扫描仪）时使用此选项。
===“Java”
在 `Item` 类上实现 `HeldItemUIMenuType.HeldItemUI`：
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
                // build your element tree here
            ), holder.player);
        }
    }
    ```

===“科特林”
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

===“KubeJS”
当玩家右键单击该项目时触发 UI 打开：
    ```javascript
    // server_scripts/main.js
    ItemEvents.firstRightClicked('minecraft:stick', event => {
        LDLib2UIFactory.openHeldItemUI(event.player, event.hand, "mymod:my_item_ui");
    })
    ```

注册 UI 构建器（**必须在两侧运行** - 请参阅[Script Placement](#kubejs-script-placement)）：
    ```javascript
    LDLib2UI.item("mymod:my_item_ui", event => {
        event.modularUI = ModularUI.of(UI.of(
            new UIElement().addClass("panel_bg")
        ), event.player);
    })
    ```

传递给 `createUI` 的上下文对象/在事件中可用：
| Field | Type | Description |
| ----- | ---- | ----------- |
| `player` | `Player` | The player holding the item |
| `hand` | `InteractionHand` | The hand being used |
| `itemStack` | `ItemStack` | The item stack that opened the UI |

---

## `PlayerUIMenuType` — 玩家触发的 UI
使用它可以打开不与特定块或项目绑定的 UI，例如通过命令、按键绑定或任何任意服务器端触发器。
===“Java”
使用唯一 ID 注册支架工厂，然后在需要时调用`openUI`：
    ```java
    // Register once (e.g. during mod init)
    var MY_UI_ID = ResourceLocation.fromNamespaceAndPath("mymod", "my_ui");

    PlayerUIMenuType.register(MY_UI_ID, player -> {
        return p -> ModularUI.of(UI.of(
            // build your element tree here
        ), p);
    });

    // Open it later (server side)
    PlayerUIMenuType.openUI(serverPlayer, MY_UI_ID);
    ```

===“科特林”
    ```kotlin
    val MY_UI_ID = ResourceLocation.fromNamespaceAndPath("mymod", "my_ui")

    // Register during init
    PlayerUIMenuType.register(MY_UI_ID) { player ->
        PlayerUIHolder { p ->
            val root = element({ cls = { +"panel_bg" } }) { /* ... */ }
            ModularUI.of(UI.of(root), p)
        }
    }

    // Open later (server side)
    PlayerUIMenuType.openUI(serverPlayer, MY_UI_ID)
    ```

===“KubeJS”
从任何服务器端触发器（命令、按键绑定回调等）打开 UI：
    ```javascript
    // server_scripts/main.js
    LDLib2UIFactory.openPlayerUI(player, "mymod:my_player_ui");
    ```

注册 UI 构建器（**必须在两侧运行** - 请参阅[Script Placement](#kubejs-script-placement)）：
    ```javascript
    LDLib2UI.player("mymod:my_player_ui", event => {
        event.modularUI = ModularUI.of(UI.of(
            new UIElement().addClass("panel_bg")
        ), event.player);
    })
    ```

事件中可用的上下文对象：
| Field | Type | Description |
| ----- | ---- | ----------- |
| `player` | `Player` | The player for whom the UI is opened |

!!!笔记 ””`LDLib2UIFactory.openPlayerUI` 必须从**服务器端**调用。 UI 始终被认为是有效的，因为没有要验证的块或项目。
---

## KubeJS：脚本放置
`LDLib2UI` 事件（`.block`、`.item`、`.player`）在**服务器和客户端**上触发：
- **服务器**触发它来构建`ModularUIContainerMenu`。- **客户端**触发它来构建`ModularUIContainerScreen`。
**双方必须为同一 ID 注册一个处理程序** — 否则 UI 将只存在于一侧。
### 选项 A：单独的客户端和服务器脚本
在`client_scripts` 和`server_scripts` 中注册构建器。您可以在每一端提供不同的实现（例如客户端上的不同样式表）：
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
`startup_scripts` 在**客户端和服务器**上运行，因此一次注册涵盖双方：
```javascript
// startup_scripts/main.js — executed on both client and server
LDLib2UI.block("mymod:my_block_ui", event => {
    event.modularUI = ModularUI.of(UI.of(
        new UIElement().addClass("panel_bg")
    ), event.player);
})
```

!!!警告“不要在启动脚本中急切地创建 UI”当启动脚本运行时，Minecraft 资源（样式表、纹理等）**尚未加载**。始终在事件处理程序 lambda** 内创建 UI，它在 UI 打开时运行，而不是在脚本加载时运行。
    ```javascript
    // ❌ WRONG — built at startup, before resources are ready
    const myUI = ModularUI.of(UI.of(new UIElement()), null);
    LDLib2UI.block("mymod:my_block_ui", event => {
        event.modularUI = myUI; // stale; resources were not loaded yet
    })

    // ✅ CORRECT — built lazily when the player opens the UI
    LDLib2UI.block("mymod:my_block_ui", event => {
        event.modularUI = ModularUI.of(UI.of(new UIElement()), event.player);
    })
    ```
