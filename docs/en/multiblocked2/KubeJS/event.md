# Machine and Recipe-Type Events

<VersionBadge version="Minecraft 1.21.1 / MBD2 21.1.1" label="Current API" icon="tag" />

MBD2 event subscriptions are **targeted**. The first argument is the exact machine-definition or recipe-type ID; the callback receives a KubeJS wrapper whose Java event is `wrapper.event`.

```js
// kubejs/server_scripts/mbd2_events.js
MBDMachineEvents.onAfterRecipeWorking('example:crusher', wrapper => {
  const event = wrapper.event
  console.info(`Recipe ${event.recipe.id} left its active run at ${event.machine.pos}`)
})
```

Do not target a block ID or a recipe ID. A machine handler targets an ID in `MBDRegistries.MACHINE_DEFINITIONS`; a recipe-type handler targets an ID in `MBDRegistries.RECIPE_TYPES`.

::: tip Blueprints cover the same events
Every event on this page is also a **[blueprint](../blueprints/) entry node**, so the same reaction can be drawn in the editor instead of scripted. Choose KubeJS when the pack already scripts; choose a blueprint when the machine should ship self-contained.
:::

## Server machine events

All of these live in `kubejs/server_scripts`. `wrapper.event.machine` is always present.

| Handler | Extra fields | Cancellable | When it runs |
| --- | --- | --- | --- |
| `onLoad` | — | no | One tick after the block entity becomes valid |
| `onRemoved` | — | no | The machine is being removed |
| `onPlaced` | `player`, `itemStack` | no | Placed by an entity |
| `onNeighborChanged` | `block`, `fromPos` | no | A neighbour update reached the machine |
| `onDrops` | `entity`, mutable `drops` | no | Drop list assembled, before it is spawned |
| `onOpenUI` | `player` | yes | Before the machine UI opens |
| `onUseWithoutItem` | `player`, `hit`, mutable `interactionResult` | no | Empty-hand right click |
| `onUseCatalyst` | `catalyst`, `player`, `hand` | yes | Multiblock catalyst use |
| `onUI` | mutable `ui`, mutable `player` | no | The server built the machine `UI` |
| `onStateChanged` | `oldState`, `newState` | yes | A machine-state transition |
| `onStructureFormed` / `onStructureInvalid` | — | no | Multiblock formation and loss |
| `onTick` | — | yes | Before recipe logic and every trait tick |

`drops` is the live Java `List<ItemStack>`; add to it rather than replacing it. Cancelling `onTick` skips recipe logic **and** every trait's `serverTick`.

## Recipe lifecycle events

| Handler | Extra fields | Cancellable | Exact point |
| --- | --- | --- | --- |
| `onBeforeRecipeModify` | mutable `recipe` | yes | Before configured modifiers and parallel calculation |
| `onAfterRecipeModify` | mutable `recipe` | no | After modifiers produced the effective recipe |
| `onBeforeRecipeWorking` | `recipe` | yes | After fuel is taken, before inputs are committed |
| `onRecipeWorking` | `recipe`, `progress` | yes | After this tick's per-tick IO committed, before progress increments |
| `onRecipeWaiting` | `recipe` | no | Status became `WAITING` |
| `onAfterRecipeWorking` | `recipe` | no | Completion **or** interruption, before outputs |
| `onConsumeInputsAfterWorking` | `recipe` | no | Deferred inputs were committed at completion |
| `onRecipeFinish` | `recipe` | no | After the outputs exist |
| `onFuelRecipeModify` | mutable `recipe` | yes | A fuel candidate matched, before its inputs are taken |
| `onFuelBurningFinish` | nullable `recipe` | no | Registered, but **not delivered** — see below |

`onAfterRecipeWorking` fires *before* outputs are produced; `onRecipeFinish` fires *after*. Use the latter for "a craft completed" bonuses, or a bonus item lands in the slot the recipe's own output still needs.

`onConsumeInputsAfterWorking` only fires when the machine's **Consume inputs after working** setting is on — as a definition value, or as a per-machine [runtime value](../editor/runtime-values.md) override of `recipe_logic.consume_inputs_after_working`.

::: warning `onFuelBurningFinish` never fires
`MBDMachine#onFuelBurningFinish` posts its event to the NeoForge bus without `postCustomEvent()`, so neither the KubeJS handler nor the blueprint entry node receives it in `21.1.1`. Java `NeoForge.EVENT_BUS` listeners do work. Track fuel exhaustion through `onRecipeWaiting` or `machine.recipeLogic.fuelTime` instead.
:::

::: info An event with no KubeJS handler
`MachineUseItemOnEvent` (right click **with** an item) exists and has a blueprint entry node, but `MBDServerEvents` registers no KubeJS name for it. Use a blueprint, or a Java listener on `NeoForge.EVENT_BUS`.
:::

```js
MBDMachineEvents.onRecipeWorking('example:crusher', wrapper => {
  const { recipe, progress } = wrapper.event
  if (progress % 20 === 0) {
    console.debug(`${recipe.id}: ${progress}/${recipe.duration}`)
  }
})
```

## Cancelling

Two equivalent forms, for the handlers marked cancellable above:

```js
MBDMachineEvents.onOpenUI('example:crusher', wrapper => {
  wrapper.event.setCanceled(true)          // set it on the Java event
})

MBDMachineEvents.onOpenUI('example:crusher', wrapper => {
  return false                             // KubeJS interrupt-false, mapped to setCanceled
})
```

Cancelling is a control-flow decision, not a substitute for recipe conditions — a cancelled `onBeforeRecipeWorking` runs *after* fuel was already consumed, and a cancelled `onRecipeWorking` runs *after* that tick's per-tick IO committed. Put eligibility in a [`RecipeCondition`](../recipes/condition-reference.md).

Never move resources in an event that can run during simulation or on the client. Resource accounting belongs in a Java `IRecipeHandlerTrait`.

## Client events

These belong in `kubejs/client_scripts`.

| Handler | Group | Fields |
| --- | --- | --- |
| `onClientTick(machineId, cb)` | `MBDMachineEvents` | `machine` |
| `onCustomDataUpdate(machineId, cb)` | `MBDMachineEvents` | `oldValue`, `newValue`; cancellable |
| `onCustomKeyframe(machineId, cb)` | `MBDMachineEvents` | `instruction`, `controllerName`, `animationTick`; GeckoLib only |
| `onRecipeUI(recipeTypeId, cb)` | `MBDRecipeTypeEvents` | mutable `recipe`, mutable `ui`; cancellable |
| `registerCustomRenderers(cb)` | `MBDClientEvents` | not targeted — see [script renderers](./client-renderers.md) |

```js
// kubejs/client_scripts/mbd2_visuals.js
MBDMachineEvents.onCustomDataUpdate('example:crusher', wrapper => {
  const { oldValue, newValue } = wrapper.event
  console.debug(`Client machine data changed: ${oldValue} -> ${newValue}`)
})
```

Keep these visual-only. Holding a machine object on the client does not transfer server authority.

## Proxy-recipe transfer

```js
// kubejs/server_scripts/mbd2_proxy.js
MBDRecipeTypeEvents.onTransferProxyRecipe('example:electric_furnace', wrapper => {
  const event = wrapper.event
  // event.recipeType       target MBDRecipeType
  // event.proxyTypeId      source vanilla/mod recipe type ID
  // event.proxyType        source RecipeType object
  // event.proxyRecipeId    source recipe ID
  // event.proxyRecipe      source recipe object
  // event.mbdRecipe        nullable, mutable converted result
  if (`${event.proxyTypeId}` !== 'minecraft:smelting') {
    event.setCanceled(true)
  }
})
```

This filters recipes produced by a proxy the recipe type already declares; it does not enable one. See [proxy recipe types](./proxy_recipetype.md).

::: warning Tick cost
`onTick`, `onClientTick`, and `onRecipeWorking` run every tick per machine. Do not scan the world, parse IDs, rebuild collections, or allocate UI objects in them.
:::
