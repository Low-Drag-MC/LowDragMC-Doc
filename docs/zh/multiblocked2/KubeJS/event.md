# 机器与配方类型事件

<VersionBadge version="Minecraft 1.21.1 / MBD2 21.1.1" label="当前 API" icon="tag" />

MBD2 的事件订阅都**带目标**。第一个参数是确切的机器定义 ID 或配方类型 ID；回调收到一个 KubeJS 包装对象，其中的 Java 事件在 `wrapper.event` 上。

```js
// kubejs/server_scripts/mbd2_events.js
MBDMachineEvents.onAfterRecipeWorking('example:crusher', wrapper => {
  const event = wrapper.event
  console.info(`Recipe ${event.recipe.id} left its active run at ${event.machine.pos}`)
})
```

不要传方块 ID 或配方 ID。机器事件的目标是 `MBDRegistries.MACHINE_DEFINITIONS` 里的 ID；配方类型事件的目标是 `MBDRegistries.RECIPE_TYPES` 里的 ID。

::: tip 蓝图覆盖同样这些事件
本页的每个事件同时也是一个 **[蓝图](../blueprints/)入口节点**，所以同样的反应可以在编辑器里画出来而不用写脚本。整合包已经在写脚本就用 KubeJS；机器要自带行为发布就用蓝图。
:::

## 服务端机器事件

这些都放在 `kubejs/server_scripts`。`wrapper.event.machine` 始终存在。

| Handler | 额外字段 | 可取消 | 触发时机 |
| --- | --- | --- | --- |
| `onLoad` | — | 否 | 方块实体有效后的下一 tick |
| `onRemoved` | — | 否 | 机器正在被移除 |
| `onPlaced` | `player`、`itemStack` | 否 | 被实体放置 |
| `onNeighborChanged` | `block`、`fromPos` | 否 | 相邻更新到达机器 |
| `onDrops` | `entity`、可改的 `drops` | 否 | 掉落列表已组装、尚未生成 |
| `onOpenUI` | `player` | 是 | 机器 UI 打开之前 |
| `onUseWithoutItem` | `player`、`hit`、可改的 `interactionResult` | 否 | 空手右键 |
| `onUseCatalyst` | `catalyst`、`player`、`hand` | 是 | 多方块催化剂使用 |
| `onUI` | 可改的 `ui`、可改的 `player` | 否 | 服务端构建好机器 `UI` |
| `onStateChanged` | `oldState`、`newState` | 是 | 机器状态切换 |
| `onStructureFormed` / `onStructureInvalid` | — | 否 | 多方块成型与失效 |
| `onTick` | — | 是 | 配方逻辑和所有 Trait tick 之前 |

`drops` 是活的 Java `List<ItemStack>`，往里加而不要替换它。取消 `onTick` 会同时跳过配方逻辑**和**每个 Trait 的 `serverTick`。

## 配方生命周期事件

| Handler | 额外字段 | 可取消 | 确切位置 |
| --- | --- | --- | --- |
| `onBeforeRecipeModify` | 可改的 `recipe` | 是 | 配置的修饰器与并行计算之前 |
| `onAfterRecipeModify` | 可改的 `recipe` | 否 | 修饰器产出最终配方之后 |
| `onBeforeRecipeWorking` | `recipe` | 是 | 燃料已扣除之后、输入提交之前 |
| `onRecipeWorking` | `recipe`、`progress` | 是 | 本 tick 的 per-tick IO 已提交、进度递增之前 |
| `onRecipeWaiting` | `recipe` | 否 | 状态变为 `WAITING` |
| `onAfterRecipeWorking` | `recipe` | 否 | 完成**或**中断，产出之前 |
| `onConsumeInputsAfterWorking` | `recipe` | 否 | 完成时刚刚提交了延迟的输入 |
| `onRecipeFinish` | `recipe` | 否 | 产出已经存在之后 |
| `onFuelRecipeModify` | 可改的 `recipe` | 是 | 燃料候选匹配后、扣除其输入之前 |
| `onFuelBurningFinish` | 可空的 `recipe` | 否 | 已注册，但**不会送达**——见下 |

`onAfterRecipeWorking` 在产出生成*之前*触发，`onRecipeFinish` 在*之后*。「一次合成完成」的奖励要写在后者里，否则奖励物品会落进配方自己的产出正要用的槽位。

`onConsumeInputsAfterWorking` 只有在机器打开了 **Consume inputs after working** 时才会触发——无论它来自定义值，还是来自 `recipe_logic.consume_inputs_after_working` 的单机 [runtime value](../editor/runtime-values.md) 覆盖。

::: warning `onFuelBurningFinish` 从不触发
`MBDMachine#onFuelBurningFinish` 把事件投递到 NeoForge 总线时没有调用 `postCustomEvent()`，所以在 `21.1.1` 中 KubeJS handler 和蓝图入口节点都收不到它。Java 的 `NeoForge.EVENT_BUS` 监听器是有效的。要跟踪燃料耗尽，请改用 `onRecipeWaiting` 或 `machine.recipeLogic.fuelTime`。
:::

::: info 一个没有 KubeJS handler 的事件
`MachineUseItemOnEvent`（手持物品右键）存在并且有蓝图入口节点，但 `MBDServerEvents` 没有为它注册 KubeJS 名字。请改用蓝图，或者用 Java 监听 `NeoForge.EVENT_BUS`。
:::

```js
MBDMachineEvents.onRecipeWorking('example:crusher', wrapper => {
  const { recipe, progress } = wrapper.event
  if (progress % 20 === 0) {
    console.debug(`${recipe.id}: ${progress}/${recipe.duration}`)
  }
})
```

## 取消

对上表中标记为可取消的 handler，两种写法等价：

```js
MBDMachineEvents.onOpenUI('example:crusher', wrapper => {
  wrapper.event.setCanceled(true)          // 直接设置 Java 事件
})

MBDMachineEvents.onOpenUI('example:crusher', wrapper => {
  return false                             // KubeJS 的 interrupt-false，会映射到 setCanceled
})
```

取消是控制流决策，不能替代配方条件——被取消的 `onBeforeRecipeWorking` 发生在燃料已经被扣掉*之后*，被取消的 `onRecipeWorking` 发生在该 tick 的 per-tick IO 已经提交*之后*。资格判断请写进 [`RecipeCondition`](../recipes/condition-reference.md)。

不要在可能于模拟阶段或客户端执行的事件里搬运资源。资源结算属于 Java 的 `IRecipeHandlerTrait`。

## 客户端事件

这些放在 `kubejs/client_scripts`。

| Handler | 事件组 | 字段 |
| --- | --- | --- |
| `onClientTick(machineId, cb)` | `MBDMachineEvents` | `machine` |
| `onCustomDataUpdate(machineId, cb)` | `MBDMachineEvents` | `oldValue`、`newValue`；可取消 |
| `onCustomKeyframe(machineId, cb)` | `MBDMachineEvents` | `instruction`、`controllerName`、`animationTick`；仅 GeckoLib |
| `onRecipeUI(recipeTypeId, cb)` | `MBDRecipeTypeEvents` | 可改的 `recipe` 与 `ui`；可取消 |
| `registerCustomRenderers(cb)` | `MBDClientEvents` | 不带目标——见[脚本渲染器](./client-renderers.md) |

```js
// kubejs/client_scripts/mbd2_visuals.js
MBDMachineEvents.onCustomDataUpdate('example:crusher', wrapper => {
  const { oldValue, newValue } = wrapper.event
  console.debug(`Client machine data changed: ${oldValue} -> ${newValue}`)
})
```

这些只做视觉。在客户端拿到机器对象并不意味着获得了服务端权限。

## 代理配方转换

```js
// kubejs/server_scripts/mbd2_proxy.js
MBDRecipeTypeEvents.onTransferProxyRecipe('example:electric_furnace', wrapper => {
  const event = wrapper.event
  // event.recipeType       目标 MBDRecipeType
  // event.proxyTypeId      来源 vanilla/模组配方类型 ID
  // event.proxyType        来源 RecipeType 对象
  // event.proxyRecipeId    来源配方 ID
  // event.proxyRecipe      来源配方对象
  // event.mbdRecipe        可空、可改的转换结果
  if (`${event.proxyTypeId}` !== 'minecraft:smelting') {
    event.setCanceled(true)
  }
})
```

这个事件过滤的是配方类型已经声明的代理产生的配方，它本身不会启用代理。见[代理配方类型](./proxy_recipetype.md)。

::: warning tick 开销
`onTick`、`onClientTick` 和 `onRecipeWorking` 对每台机器每 tick 都会跑。不要在里面扫世界、解析 ID、重建集合或分配 UI 对象。
:::
