# 机器与配方类型事件

<VersionBadge version="Minecraft 1.21.1 / MBD2 21.0.11" label="当前 API" icon="tag" />

<figure><img src="/assets/multiblocked2/editor/overview.png" alt="表示 KubeJS machine event 目标机器定义的 MBD2 机器编辑器"><figcaption>每个定向事件 ID 都解析为一个已注册机器定义；回调作用于其运行时实例。</figcaption></figure>

MBD2 的事件订阅全部**带目标**。第一个参数是准确的机器定义或配方类型 ID；回调收到 KubeJS wrapper，真正的 Java 事件位于 `event.event`。

```js
// kubejs/server_scripts/mbd2_events.js
MBDMachineEvents.onAfterRecipeWorking('example:crusher', wrapper => {
  const event = wrapper.event
  const machine = event.machine
  const recipe = event.recipe
  console.info(`Recipe ${recipe.id} is leaving its active run at ${machine.pos}`)
})
```

不要填写方块 ID 或单个配方 ID。机器事件目标是在 `MBDRegistries.MACHINE_DEFINITIONS` 注册的 ID；配方类型事件目标是在 `MBDRegistries.RECIPE_TYPES` 注册的 ID。

## 通用事件协议

每个机器事件都有 `event.machine`，其余字段由事件决定：

| 事件 | 重要字段 | 典型用途 |
| --- | --- | --- |
| `onLoad`、`onRemoved` | `machine` | 建立或释放脚本侧状态 |
| `onPlaced` | `player`、`itemStack` | 从放置物品初始化数据 |
| `onNeighborChanged` | `block`、`fromPos` | 响应特定邻居更新 |
| `onDrops` | 可修改 `drops`、`entity` | 替换或追加机器掉落物 |
| `onOpenUI` | `player` | 打开 UI 前验证访问权限 |
| `onUseCatalyst` | `catalyst`、`player`、`hand` | 处理多方块催化剂 |
| `onUseWithoutItem` | `player`、`hit`、可修改 `interactionResult` | 实现空手交互 |
| `onUI` | 可修改 `ui`、`player` | 调整机器 UI 实例 |
| `onStateChanged` | `oldState`、`newState` | 响应状态切换 |
| `onStructureFormed`、`onStructureInvalid` | `machine` | 建立或清理多方块专属状态 |
| `onTick` | `machine` | 少量服务端 tick 逻辑 |

标为“可修改”的字段可以在底层 Java 事件上替换；其他字段应视为只读观察值。

## 配方生命周期事件

| 事件 | 字段 | 调用时机 |
| --- | --- | --- |
| `onBeforeRecipeModify` | 可修改 `recipe` | 机器和部件修改器之前 |
| `onAfterRecipeModify` | 可修改 `recipe` | 修改器生成有效配方之后 |
| `onBeforeRecipeWorking` | `recipe` | 一次工作步骤之前 |
| `onRecipeWorking` | `recipe`、`progress` | 工作步骤期间 |
| `onAfterRecipeWorking` | `recipe` | 完成时位于延迟输入/输出之前，或配方被中断时 |
| `onRecipeWaiting` | `recipe` | 找到配方但暂时无法推进 |
| `onRecipeStatusChanged` | `oldStatus`、`newStatus` | 配方逻辑状态切换 |
| `onFuelRecipeModify` | 可修改 `recipe` | 修改燃料配方 |
| `onFuelBurningFinish` | 可为 null 的 `recipe` | 已注册，但 21.0.11 未发布给 KubeJS |

普通加工规则优先使用配方内容与条件；事件适合表达配方引擎本身无法描述的行为。

::: warning 已注册名称不等于基础机器会发布
KubeJS 事件组注册了 `onFuelBurningFinish`、`onConsumeInputsAfterWorking` 与 `onRecipeFinish`，但 MBD2 21.0.11 的基础 `MBDMachine` 没有通过 `postCustomEvent()` 将它们送往 KubeJS。对应 Java hook 可能会运行，但这三个 KubeJS handler 收不到基础机器事件。准确顺序见 [RecipeLogic 生命周期](../recipes/recipe-lifecycle.md#完成与下一次执行)。
:::

```js
MBDMachineEvents.onRecipeWorking('example:crusher', wrapper => {
  const { machine, recipe, progress } = wrapper.event
  if (progress % 20 === 0) {
    console.debug(`${recipe.id}: ${progress}/${recipe.duration}`)
  }
})
```

## 取消与修改

以下底层 NeoForge 事件实现了 `ICancellableEvent`：`onBeforeRecipeWorking`、`onRecipeWorking`、`onOpenUI`、`onFuelRecipeModify`、`onStateChanged`、`onTick`、`onUseCatalyst`，以及客户端 `onCustomDataUpdate`。取消是流程控制，不应代替一般配方条件。若整合包依赖取消行为，请先确认所用 KubeJS 版本的事件取消桥；转换数据时，修改表中明确可修改的字段更稳定。

不要在可能处于模拟阶段或客户端的处理器中修改存储。运行时资源移动属于 Java `IRecipeHandlerTrait`。

## 客户端事件

客户端脚本事件包括：

- `onClientTick(machineId, handler)`
- `onCustomDataUpdate(machineId, handler)`，字段为 `oldValue` 和 `newValue`
- 仅安装 GeckoLib 时存在的 `onCustomKeyframe(machineId, handler)`
- `MBDRecipeTypeEvents.onRecipeUI(recipeTypeId, handler)`，字段为可修改的 `recipe` 与 `ui`

这些事件只处理视觉内容。wrapper 暴露机器对象并不代表客户端获得服务端权威。

## 代理配方转换

```js
MBDRecipeTypeEvents.onTransferProxyRecipe('example:crusher', wrapper => {
  const event = wrapper.event
  // event.recipeType       目标 MBD 配方类型
  // event.proxyTypeId      来源原版/模组配方类型 ID
  // event.proxyType        来源 RecipeType 对象
  // event.proxyRecipeId    来源配方 ID
  // event.proxyRecipe      来源配方对象
  // event.mbdRecipe        可为 null、可修改的转换结果
})
```

该事件用于修改或拒绝已由代理生成的配方，不能单独启用代理；必须先在配方类型上配置来源代理。

::: warning Tick 成本
`onTick`、`onClientTick` 与 `onRecipeWorking` 都是高频路径。不要在其中进行全世界搜索、重建集合、解析 ID 或创建 UI 对象。不可变查询结果应在 startup/load 阶段缓存。
:::
