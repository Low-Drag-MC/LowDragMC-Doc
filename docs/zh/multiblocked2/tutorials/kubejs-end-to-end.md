# KubeJS 教程：注册定义并添加配方

<VersionBadge version="21.1.1" label="MBD2" icon="tag" />

本教程在 KubeJS startup 阶段注册配方类型和基础机器定义，再通过 server script 添加配方与定向行为。同时会明确 KubeJS-only 机器目前能做到哪里。

<figure>
<img src="/assets/multiblocked2/recipes/recipe-type.png" alt="MBD2 Recipe Type 与内置配方视图，对应由 KubeJS 注册的定义和配方">
<figcaption>startup 注册完成后，KubeJS 配方会指向此编辑器项目所表示的 recipe-type ID。</figcaption>
</figure>

## 脚本目录

```text
kubejs/
├─ startup_scripts/
│  └─ mbd2_registry.js
└─ server_scripts/
   ├─ mbd2_recipes.js
   └─ mbd2_events.js
```

Registry 定义必须放在 `startup_scripts`；配方与运行时事件属于 `server_scripts`。

## 1. Startup 阶段注册配方类型

创建 `kubejs/startup_scripts/mbd2_registry.js`：

```js
MBDRegistryEvents.recipeType(event => {
  const type = event.createRecipeType('example:crushing')
  console.info(`[MBD2] registered recipe type ${type.registryName}`)
})
```

MBD2 会根据这个 ID 注册 KubeJS recipe schema，映射关系完全确定：

```text
example:crushing -> event.recipes.example.crushing()
```

修改该脚本后必须完整重启游戏/服务器。`/reload` 无法重新创建 registry 或生成 schema。

## 2. 注册基础机器定义

在同一个 startup 文件中加入：

```js
MBDRegistryEvents.machine(event => {
  event.create('single', 'example:scripted_machine')

  // 当前另一个已注册 key：
  // event.create('multiblock', 'example:scripted_multiblock')
})
```

21.1.1 的 KubeJS 机器类型 key 只有 `single` 与 `multiblock`。事件先保存返回的 Java builder，在全部 startup handler 完成后调用 `build()`。

::: warning 这只是注册 shell
公开 KubeJS API 不能完整配置状态机、渲染器、Trait、UI、Recipe Logic 或多方块 Pattern。这个 shell 可以注册定义/方块，但没有文档化的可工作物品 IO，也不会自动引用 `example:crushing`。不要照搬旧示例臆造 fluent builder 调用。真正可加工的机器请使用[混合教程](./hybrid-editor-kubejs.md)。
:::

## 3. 重启并验证 Startup

完整重启后检查 `logs/kubejs/startup.log`。开始写配方前必须先解决两个注册事件中的错误。

可以在对应 startup 事件中查询已注册值：

```js
MBDRegistryEvents.recipeType(event => {
  const type = event.getRecipeType('example:crushing')
  if (type === null) throw new Error('example:crushing was not registered')
})

MBDRegistryEvents.machine(event => {
  const machine = event.getMachine('example:scripted_machine')
  // 同一事件中刚创建的 builder 仍处于 pending，不会由这里返回。
})
```

不要让 Java 与 KubeJS 同时创建同一 ID；每个 registry ID 应只有一个所有者。

## 4. 在 Server Script 中添加配方

创建 `kubejs/server_scripts/mbd2_recipes.js`：

```js
ServerEvents.recipes(event => {
  event.recipes.example.crushing()
    .id('example:crush_iron')
    .duration(100)
    .priority(0)
    .inputItems('minecraft:iron_ingot')
    .outputItems('9x minecraft:iron_nugget')

  event.recipes.example.crushing()
    .id('example:crush_gold')
    .duration(80)
    .priority(-10) // 数值越小越先参与匹配
    .inputItems('minecraft:gold_ingot')
    .perTick(r => r.inputFE(20))
    .chance(0.25, r => r.outputItems('minecraft:raw_gold'))
    .outputItems('9x minecraft:gold_nugget')
})
```

需要遵守：

- 始终设置带命名空间的 `.id(...)`。
- `duration` 单位是机器实际工作的 tick。
- `priority` 数值越小越先尝试。
- `perTick(r => ...)`、`chance(value, r => ...)` 等 callback modifier 会在回调后恢复 builder 状态。
- `inputFE` 等可选内容要求机器拥有匹配 Trait/handler；添加配方内容不会自动创建存储。

配方类型已经存在后，修改 server script 可以使用 `/reload`。

## 5. 添加定向运行时行为

创建 `kubejs/server_scripts/mbd2_events.js`：

```js
MBDMachineEvents.onRecipeStatusChanged('example:scripted_machine', wrapper => {
  const { machine, oldStatus, newStatus } = wrapper.event
  console.info(`[MBD2] ${machine.definition.id()}: ${oldStatus} -> ${newStatus}`)
})

MBDMachineEvents.onUseWithoutItem('example:scripted_machine', wrapper => {
  const { machine } = wrapper.event
  console.info(`[MBD2] state is ${machine.recipeLogic.status}`)
})
```

第一个参数是机器定义 ID，不是方块 tag、配方 ID 或配方类型 ID。修改行为只放在服务端，并避免在 `onTick`/`onRecipeWorking` 中执行重任务。

## 6. 删除或替换配方

```js
ServerEvents.recipes(event => {
  event.remove({ id: 'example:crush_gold' })

  event.recipes.example.crushing()
    .id('example:crush_gold_v2')
    .duration(60)
    .inputItems('minecraft:gold_ingot')
    .outputItems('12x minecraft:gold_nugget')
})
```

`removeInputs(capability)` 与 `removeOutputs(capability)` 只操作当前 builder 的内容，不是全局删除配方方法。

## 故障排查

| 现象 | 原因/检查 |
| --- | --- |
| 找不到 `event.recipes.example.crushing` | Startup 脚本失败、ID 拼写不同，或没有完整重启 |
| 查看器能看到配方但机器不运行 | 没有可工作机器引用该类型，或缺少匹配 IO Trait |
| 机器方块存在但没有 UI/IO | 基础 KubeJS 定义的预期结果；改用编辑器/Java 定义 |
| 可选方法在 startup/reload 抛错 | 对应集成模组/capability 没有注册 |
| 事件不触发 | 目标机器 ID 错误、Side 错误，或基础机器未发布该事件名 |

继续阅读[完整配方 Builder 参考](../KubeJS/recipe.md)与[机器事件参考](../KubeJS/event.md)。
