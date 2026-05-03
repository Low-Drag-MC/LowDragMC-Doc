# UI Factory

{{ version_badge("2.2.1", label="Since", icon="tag") }}

LDLib2 provides three pre-built factory helpers for the most common use cases. Each factory handles menu registration, client–server routing, and lifecycle validation automatically.

| Factory | Trigger | Use when |
| ------- | ------- | -------- |
| `BlockUIMenuType` | Player right-clicks a block | Block / Block Entity UI |
| `HeldItemUIMenuType` | Player right-clicks with an item | Handheld tools, devices, wrenches |
| `PlayerUIMenuType` | Any server-side call | Commands, keybinds, arbitrary triggers |

KubeJS users can open any of these via the **`LDLib2UIFactory`** bindings and register UI builders via the **`LDLib2UI`** event group — no Java or Kotlin required.

---

## `BlockUIMenuType` — Block / Block Entity UI

Use this when a block (or block entity) opens a UI on right-click.

=== "Java"

    Implement `BlockUIMenuType.BlockUI` on your `Block` class:

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

    Trigger the UI open from a server-side block event:

    ```javascript
    // server_scripts/main.js
    BlockEvents.rightClicked('minecraft:glass', event => {
        LDLib2UIFactory.openBlockUI(event.player, event.block.pos, "mymod:my_block_ui");
    })
    ```

    Register the UI builder (**must run on both sides** — see [Script Placement](#kubejs-script-placement)):

    ```javascript
    LDLib2UI.block("mymod:my_block_ui", event => {
        event.modularUI = ModularUI.of(UI.of(
            new UIElement().addClass("panel_bg")
        ), event.player);
    })
    ```

The context object passed to `createUI` / available in the event:

| Field | Type | Description |
| ----- | ---- | ----------- |
| `player` | `Player` | The player who opened the UI |
| `pos` | `BlockPos` | The block's position |
| `blockState` | `BlockState` | The block's current state |

---

## `HeldItemUIMenuType` — Held Item UI

Use this when a held item opens a UI (e.g. a portable device, a wrench, or a scanner).

=== "Java"

    Implement `HeldItemUIMenuType.HeldItemUI` on your `Item` class:

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

    Trigger the UI open when the player right-clicks with the item:

    ```javascript
    // server_scripts/main.js
    ItemEvents.firstRightClicked('minecraft:stick', event => {
        LDLib2UIFactory.openHeldItemUI(event.player, event.hand, "mymod:my_item_ui");
    })
    ```

    Register the UI builder (**must run on both sides** — see [Script Placement](#kubejs-script-placement)):

    ```javascript
    LDLib2UI.item("mymod:my_item_ui", event => {
        event.modularUI = ModularUI.of(UI.of(
            new UIElement().addClass("panel_bg")
        ), event.player);
    })
    ```

The context object passed to `createUI` / available in the event:

| Field | Type | Description |
| ----- | ---- | ----------- |
| `player` | `Player` | The player holding the item |
| `hand` | `InteractionHand` | The hand being used |
| `itemStack` | `ItemStack` | The item stack that opened the UI |

---

## `PlayerUIMenuType` — Player-triggered UI

Use this to open a UI that is not tied to a specific block or item — for example from a command, a keybind, or any arbitrary server-side trigger.

=== "Java"

    Register a holder factory with a unique ID, then call `openUI` when needed:

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

=== "Kotlin"

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

=== "KubeJS"

    Open the UI from any server-side trigger (command, keybind callback, etc.):

    ```javascript
    // server_scripts/main.js
    LDLib2UIFactory.openPlayerUI(player, "mymod:my_player_ui");
    ```

    Register the UI builder (**must run on both sides** — see [Script Placement](#kubejs-script-placement)):

    ```javascript
    LDLib2UI.player("mymod:my_player_ui", event => {
        event.modularUI = ModularUI.of(UI.of(
            new UIElement().addClass("panel_bg")
        ), event.player);
    })
    ```

The context object available in the event:

| Field | Type | Description |
| ----- | ---- | ----------- |
| `player` | `Player` | The player for whom the UI is opened |

!!! note ""
    `LDLib2UIFactory.openPlayerUI` must be called from the **server side**. The UI is always considered valid since there is no block or item to validate against.

---

## KubeJS: Script Placement

The `LDLib2UI` event (`.block`, `.item`, `.player`) fires on **both the server and the client**:

- The **server** fires it to build the `ModularUIContainerMenu`.
- The **client** fires it to build the `ModularUIContainerScreen`.

**Both sides must register a handler** for the same ID — otherwise the UI will only exist on one side.

### Option A: Separate client and server scripts

Register the builder in both `client_scripts` and `server_scripts`. You can provide different implementations per side (e.g. a different stylesheet on the client):

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

### Option B: Startup script (recommended)

`startup_scripts` run on **both the client and server**, so a single registration covers both sides:

```javascript
// startup_scripts/main.js — executed on both client and server
LDLib2UI.block("mymod:my_block_ui", event => {
    event.modularUI = ModularUI.of(UI.of(
        new UIElement().addClass("panel_bg")
    ), event.player);
})
```

!!! warning "Do not create UI eagerly in startup scripts"
    Minecraft resources (stylesheets, textures, etc.) are **not yet loaded** when startup scripts run.
    Always create the UI **inside the event handler lambda**, which runs at UI-open time — not at script load time.

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
