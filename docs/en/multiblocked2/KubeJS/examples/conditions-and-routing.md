# Conditions and Content Routing

<VersionBadge version="Minecraft 1.21.1 / MBD2 21.0.11" label="Current API" icon="tag" />

<figure><img src="/assets/multiblocked2/recipes/recipe-display-ui.png" alt="Named content display regions in the Recipe Viewer UI editor"><figcaption>`uiName` selects a display region; `slotName` independently routes to Trait handlers.</figcaption></figure>

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

| Modifier | Matches | Common mistake |
| --- | --- | --- |
| `slotName` | A recipe slot name exposed by a Trait definition | Supplying the Trait name |
| `uiName` | A Recipe Viewer UI content element name | Treating it as storage routing |
| `machineData(data, true)` | `machine.customData` only | Confusing it with recipe data |
| `blocksInStructure` | Block counts in a formed structure | Expecting a world scan on single machines |

Use recipe conditions instead of reimplementing dimensions, weather, or redstone checks in `onTick`.
