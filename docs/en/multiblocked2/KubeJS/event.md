# Machine and Recipe-Type Events

<VersionBadge version="Minecraft 1.21.1 / MBD2 21.0.11" label="Current API" icon="tag" />

<figure><img src="/assets/multiblocked2/editor/overview.png" alt="MBD2 machine editor representing the machine definition targeted by KubeJS machine events"><figcaption>Every targeted event ID resolves to one registered machine definition; callbacks operate on its runtime instances.</figcaption></figure>

MBD2 event subscriptions are **targeted**. The first argument is the exact machine-definition or recipe-type ID; the callback receives a KubeJS wrapper whose Java event is stored in `event.event`.

```js
// kubejs/server_scripts/mbd2_events.js
MBDMachineEvents.onAfterRecipeWorking('example:crusher', wrapper => {
  const event = wrapper.event
  const machine = event.machine
  const recipe = event.recipe
  console.info(`Recipe ${recipe.id} is leaving its active run at ${machine.pos}`)
})
```

Do not target a block ID or a recipe ID. A machine handler targets the ID registered in `MBDRegistries.MACHINE_DEFINITIONS`; a recipe-type handler targets the ID registered in `MBDRegistries.RECIPE_TYPES`.

## Shared event contract

Every machine event exposes `event.machine`. Additional fields depend on the event:

| Event | Important fields | Typical use |
| --- | --- | --- |
| `onLoad`, `onRemoved` | `machine` | Attach or release script-side bookkeeping |
| `onPlaced` | `player`, `itemStack` | Initialize data from the placing stack |
| `onNeighborChanged` | `block`, `fromPos` | React to a specific neighboring update |
| `onDrops` | mutable `drops`, `entity` | Replace or append machine drops |
| `onOpenUI` | `player` | Validate access before opening |
| `onUseCatalyst` | `catalyst`, `player`, `hand` | Handle multiblock catalyst use |
| `onUseWithoutItem` | `player`, `hit`, mutable `interactionResult` | Implement empty-hand interaction |
| `onUI` | mutable `ui`, `player` | Adjust the machine UI instance |
| `onStateChanged` | `oldState`, `newState` | React to a state transition |
| `onStructureFormed`, `onStructureInvalid` | `machine` | Initialize or tear down multiblock-only state |
| `onTick` | `machine` | Small server tick operation |

Fields marked mutable are intentionally replaceable on the underlying Java event. Other fields should be treated as observations.

## Recipe lifecycle events

| Event | Fields | When it runs |
| --- | --- | --- |
| `onBeforeRecipeModify` | mutable `recipe` | Before machine and part recipe modifiers |
| `onAfterRecipeModify` | mutable `recipe` | After modifiers have produced the effective recipe |
| `onBeforeRecipeWorking` | `recipe` | Immediately before a work step |
| `onRecipeWorking` | `recipe`, `progress` | During a work step |
| `onAfterRecipeWorking` | `recipe` | Completion before deferred inputs/outputs, or interruption |
| `onRecipeWaiting` | `recipe` | Recipe found, but currently unable to advance |
| `onRecipeStatusChanged` | `oldStatus`, `newStatus` | Recipe logic status transition |
| `onFuelRecipeModify` | mutable `recipe` | Fuel recipe modification |
| `onFuelBurningFinish` | nullable `recipe` | Registered, but not posted to KubeJS in 21.0.11 |

Use recipe contents and conditions for normal processing rules. Events are best for behavior that cannot be represented by the recipe engine.

::: warning Registered names without a base-machine publisher
`onFuelBurningFinish`, `onConsumeInputsAfterWorking`, and `onRecipeFinish` are registered in the KubeJS event group, but MBD2 21.0.11's base `MBDMachine` does not send them through `postCustomEvent()`. Their Java hooks may run, but KubeJS handlers for these three names do not receive a base-machine event. See the [RecipeLogic lifecycle](../recipes/recipe-lifecycle.md#completion-and-the-next-execution).
:::

```js
MBDMachineEvents.onRecipeWorking('example:crusher', wrapper => {
  const { machine, recipe, progress } = wrapper.event
  if (progress % 20 === 0) {
    console.debug(`${recipe.id}: ${progress}/${recipe.duration}`)
  }
})
```

## Cancellation and mutation

Some underlying NeoForge events implement `ICancellableEvent`: `onBeforeRecipeWorking`, `onRecipeWorking`, `onOpenUI`, `onFuelRecipeModify`, `onStateChanged`, `onTick`, `onUseCatalyst`, and the client `onCustomDataUpdate`. Cancellation is a control-flow decision, not a general replacement for recipe conditions. Confirm the KubeJS version's event cancellation bridge in your pack before depending on it; changing the documented mutable fields is the stable path for transformations.

Never modify storage in a handler that may be called during simulation or on the client. Runtime resource movement belongs in a Java `IRecipeHandlerTrait`.

## Client events

Client script handlers are:

- `onClientTick(machineId, handler)`
- `onCustomDataUpdate(machineId, handler)`, with `oldValue` and `newValue`
- `onCustomKeyframe(machineId, handler)` only when GeckoLib is installed
- `MBDRecipeTypeEvents.onRecipeUI(recipeTypeId, handler)`, with mutable `recipe` and `ui`

Keep these visual-only. Server authority is not transferred merely because the wrapper exposes a machine object.

## Proxy-recipe transfer

```js
MBDRecipeTypeEvents.onTransferProxyRecipe('example:crusher', wrapper => {
  const event = wrapper.event
  // event.recipeType       target MBD recipe type
  // event.proxyTypeId      source vanilla/mod recipe type ID
  // event.proxyType        source RecipeType object
  // event.proxyRecipeId    source recipe ID
  // event.proxyRecipe      source recipe object
  // event.mbdRecipe        nullable, mutable converted result
})
```

This event is for altering or rejecting a recipe produced by a configured proxy. It does not enable a proxy by itself; configure the source proxy on the recipe type first.

::: warning Tick cost
`onTick`, `onClientTick`, and `onRecipeWorking` are hot paths. Avoid world-wide searches, rebuilding collections, parsing IDs, or allocating UI objects in them. Cache immutable lookups during startup/load.
:::
