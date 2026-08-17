# Machine Event Examples

<VersionBadge version="Minecraft 1.21.1 / MBD2 21.0.11" label="Current API" icon="tag" />

<figure><img src="/assets/multiblocked2/editor/states-and-rendering.png" alt="Machine state editor showing states that event scripts may select"><figcaption>Events can select authored states; they do not create new states or renderers dynamically.</figcaption></figure>

## Empty-hand interaction and state changes

```js
const InteractionResult = Java.loadClass('net.minecraft.world.InteractionResult')

MBDMachineEvents.onUseWithoutItem('example:crusher', wrapper => {
  const { machine, player } = wrapper.event
  const next = machine.machineStateName === 'idle' ? 'disabled' : 'idle'
  machine.setMachineState(next)
  player.sendSystemMessage(Component.literal(`Machine state: ${next}`))
  wrapper.event.setInteractionResult(InteractionResult.SUCCESS)
})
```

The state must already exist in the editor state machine. Unknown names are silently ignored.

## Recipe lifecycle logging

```js
MBDMachineEvents.onRecipeStatusChanged('example:crusher', wrapper => {
  const { machine, oldStatus, newStatus } = wrapper.event
  console.info(`${machine.pos}: ${oldStatus} -> ${newStatus}`)
})

MBDMachineEvents.onRecipeWorking('example:crusher', wrapper => {
  const { recipe, progress } = wrapper.event
  if (progress % 20 === 0) {
    console.debug(`${recipe.id}: ${progress}/${recipe.duration}`)
  }
})
```

## Multiblock formation

```js
MBDMachineEvents.onStructureFormed('example:blast_furnace', wrapper => {
  wrapper.event.machine.setMachineState('formed')
})

MBDMachineEvents.onStructureInvalid('example:blast_furnace', wrapper => {
  wrapper.event.machine.setMachineState('idle')
})
```

## Block UI access and alter drops

```js
MBDMachineEvents.onOpenUI('example:crusher', wrapper => {
  const { machine, player } = wrapper.event
  if (!player.hasPermissions(2) && machine.machineStateName === 'locked') {
    wrapper.event.setCanceled(true)
  }
})

MBDMachineEvents.onDrops('example:crusher', wrapper => {
  // drops is the underlying Java List<ItemStack>.
  wrapper.event.drops.add(Item.of('minecraft:iron_nugget', 3))
})
```

## Placement, neighbors, and fuel

```js
MBDMachineEvents.onPlaced('example:crusher', wrapper => {
  const { machine, itemStack } = wrapper.event
  const data = machine.customData.copy()
  data.putString('placed_from', `${itemStack.id}`)
  machine.setCustomData(data)
})

MBDMachineEvents.onNeighborChanged('example:crusher', wrapper => {
  console.debug(`Neighbor ${wrapper.event.block} changed at ${wrapper.event.fromPos}`)
})

MBDMachineEvents.onFuelRecipeModify('example:crusher', wrapper => {
  const fuelRecipe = wrapper.event.recipe
  console.debug(`Selected fuel: ${fuelRecipe.id}`)
})
```

## Observe client synchronization

```js
// kubejs/client_scripts/mbd2_visuals.js
MBDMachineEvents.onCustomDataUpdate('example:crusher', wrapper => {
  const { oldValue, newValue } = wrapper.event
  console.debug(`Client machine data changed: ${oldValue} -> ${newValue}`)
})
```

`onClientTick` and GeckoLib-only `onCustomKeyframe` are also client events; keep them visual-only.

Avoid world scans, JSON parsing, and UI reconstruction in `onTick`, `onClientTick`, and `onRecipeWorking`.

::: warning Registered but not posted by the base machine
`onFuelBurningFinish`, `onConsumeInputsAfterWorking`, and `onRecipeFinish` have KubeJS event names in 21.0.11, but base `MBDMachine` does not send them through `postCustomEvent()`. Do not place behavior in these three handlers; they do not reach KubeJS on a base machine in 21.0.11.
:::
