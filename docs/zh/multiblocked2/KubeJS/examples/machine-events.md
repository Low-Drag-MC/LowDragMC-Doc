# 机器事件示例

<VersionBadge version="Minecraft 1.21.1 / MBD2 21.1.1" label="当前 API" icon="tag" />

<figure><img src="/assets/multiblocked2/editor/states-and-rendering.png" alt="机器状态编辑器展示事件脚本可切换的状态"><figcaption>事件可以选择已定义状态，但不会动态创建新的状态或渲染器。</figcaption></figure>

## 空手交互与状态切换

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

状态名必须已经存在于编辑器 state machine；不存在时 `setMachineState` 会静默忽略。

## 配方生命周期日志

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

## 多方块成型/失效

```js
MBDMachineEvents.onStructureFormed('example:blast_furnace', wrapper => {
  wrapper.event.machine.setMachineState('formed')
})

MBDMachineEvents.onStructureInvalid('example:blast_furnace', wrapper => {
  wrapper.event.machine.setMachineState('idle')
})
```

## 阻止 UI 与修改掉落

```js
MBDMachineEvents.onOpenUI('example:crusher', wrapper => {
  const { machine, player } = wrapper.event
  if (!player.hasPermissions(2) && machine.machineStateName === 'locked') {
    wrapper.event.setCanceled(true)
  }
})

MBDMachineEvents.onDrops('example:crusher', wrapper => {
  // drops 是底层 Java List<ItemStack>。
  wrapper.event.drops.add(Item.of('minecraft:iron_nugget', 3))
})
```

## 放置、邻居和燃料

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

## 客户端同步观察

```js
// kubejs/client_scripts/mbd2_visuals.js
MBDMachineEvents.onCustomDataUpdate('example:crusher', wrapper => {
  const { oldValue, newValue } = wrapper.event
  console.debug(`Client machine data changed: ${oldValue} -> ${newValue}`)
})
```

`onClientTick` 与 GeckoLib 的 `onCustomKeyframe` 也属于客户端事件，只应用于动画和视觉状态。

高频事件 `onTick`、`onClientTick`、`onRecipeWorking` 中不要扫描世界、解析大量 JSON 或重建 UI。

## 一次合成完成之后

```js
MBDMachineEvents.onRecipeFinish('example:crusher', wrapper => {
  const { machine, recipe } = wrapper.event
  // The outputs already exist here; onAfterRecipeWorking runs before they do.
  console.info(`${recipe.id} finished at ${machine.pos}`)
})

MBDMachineEvents.onConsumeInputsAfterWorking('example:crusher', wrapper => {
  // Only fires when the machine defers input consumption to completion.
  console.debug(`deferred inputs taken for ${wrapper.event.recipe.id}`)
})
```

::: warning `onFuelBurningFinish` 从不触发
它的 KubeJS 名字已注册，但 `MBDMachine#onFuelBurningFinish` 向 NeoForge 总线投递时没有调用 `postCustomEvent()`，所以在 `21.1.1` 中这个 handler 永远不会被调用。请改为观察 `machine.recipeLogic.fuelTime` 或 `WAITING` 状态。
:::
