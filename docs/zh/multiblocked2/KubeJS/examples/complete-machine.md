# 完整机器最小包

<VersionBadge version="Minecraft 1.21.1 / MBD2 21.1.1" label="当前 API" icon="tag" />

本例演示 KubeJS 能独立完成的最小闭环。实际机器的状态、模型、Trait、UI 与多方块 Pattern 仍建议由编辑器创建。

## 1. 注册配方类型和基础机器

```js
// kubejs/startup_scripts/mbd2_registry.js
MBDRegistryEvents.recipeType(event => {
  event.createRecipeType('example:crusher')
})

MBDRegistryEvents.machine(event => {
  // 当前仅注册了 single 与 multiblock 两种 builder key。
  event.create('single', 'example:crusher')
})
```

修改后完整重启。`createRecipeType` 立即注册；机器 builder 在事件全部处理完后统一 `build()`。

## 2. 添加配方

```js
// kubejs/server_scripts/mbd2_recipes.js
ServerEvents.recipes(event => {
  event.recipes.example.crusher()
    .id('example:crusher/iron_dust')
    .duration(100)
    .priority(0)
    .inputItems('minecraft:raw_iron')
    .perTick(r => r.inputFE(40))
    .outputItems('2x minecraft:iron_ingot')
})
```

## 3. 添加交互诊断

```js
// kubejs/server_scripts/mbd2_events.js
MBDMachineEvents.onUseWithoutItem('example:crusher', wrapper => {
  const machine = wrapper.event.machine
  wrapper.event.player.sendSystemMessage(
    Component.literal(`State: ${machine.machineStateName}`)
  )
})
```

::: warning KubeJS 机器注册的边界
基础 `event.create('single', id)` 不会自动产生可用的 item/fluid/FE Trait、Recipe UI 或模型。生产项目应在编辑器中完成定义并保持相同 ID；本例主要用于理解注册阶段和 schema 路径。
:::
