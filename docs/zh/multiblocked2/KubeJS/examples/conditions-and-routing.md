# 条件与内容路由

<VersionBadge version="Minecraft 1.21.1 / MBD2 21.0.11" label="当前 API" icon="tag" />

<figure><img src="/assets/multiblocked2/recipes/recipe-display-ui.png" alt="Recipe Viewer UI 编辑器中的命名内容显示区域"><figcaption>`uiName` 选择显示区域；`slotName` 独立选择 Trait handler 路由。</figcaption></figure>

```js
ServerEvents.recipes(event => {
  event.recipes.example.weather_machine()
    .id('example:weather_machine/storm_charge')
    .duration(400)
    .inputItems('minecraft:lightning_rod')
    .slotName('catalyst', r => r.inputItems('minecraft:amethyst_shard'))
    .uiName('main_output', r => r.outputItems('minecraft:creeper_spawn_egg'))
    .dimension('minecraft:overworld')
    .biome('minecraft:plains')
    .machineLevel(2)
    .positionY(64, 320)
    .raining(1, 15)
    .thundering(1, 15)
    .blocksInStructure(4, 16, 'minecraft:copper_block')
    .machineData({ mode: 'storm' }, true)
    .dayTime(false)
    .light(0, 15, 0, 15, true)
    .redstoneSignal(1, 15)
})
```

| 修饰器 | 匹配对象 | 常见错误 |
| --- | --- | --- |
| `slotName` | Trait definition 暴露的 recipe slot name | 误填 Trait 名称 |
| `uiName` | Recipe Viewer UI 的内容控件名 | 误以为它选择存储 |
| `machineData(data, true)` | 只检查 `machine.customData` | 把它当成配方 data |
| `blocksInStructure` | 已成型结构中的方块计数 | 用在单方块机器上期待全世界扫描 |

条件按配方条件引擎执行。不要在 `onTick` 中重复实现天气、维度或红石判断。
