# PneumaticCraft: Repressurized

<VersionBadge version="21.1.1" label="MBD2" icon="tag" />

PneumaticCraft 集成包含两个独立系统：压力/空气存储和热交换器温度。不要用其中一个 Trait 处理另一个系统。

<figure>
<img src="/assets/multiblocked2/integrations/pneumaticcraft.png" alt="MBD2 Machine Traits 编辑器显示 PneumaticCraft 压力限制与连接设置">
<figcaption>压力 handler 的体积、压力限制、连接 IO 与自动化设置。</figcaption>
</figure>

## 增加的内容

| 层 | 注册名 | KubeJS |
| --- | --- | --- |
| 配方 capability | `pneumatic_pressure_air` | `inputPNCPressure`、`outputPNCPressure`、`inputPNCAir`、`outputPNCAir` |
| 配方 capability | `pneumatic_heat` | `inputPNCHeat`、`outputPNCHeat` |
| Trait | `pneumatic_pressure_air_handler` | 压力/空气存储与 `PNCCapabilities.AIR_HANDLER_MACHINE` |
| Trait | `pneumatic_heat_exchanger` | 热交换器存储/capability |
| Condition | `pneumatic_pressure` | 由 `isAir` 选择压力或空气范围 |
| Condition | `pneumatic_temperature` | 温度范围 |

## 压力与空气

添加 `pneumatic_pressure_air_handler`，配置容积、最大压力、危险压力、临界压力、连接 IO/侧面与自动 IO。每个机器定义只允许一个实例。

压力和空气共用配方 capability，但类型标记会改变含义，`inputPNCPressure(2.0)` 不等于 `inputPNCAir(2)`。条件也遵循同一区别：

```js
ServerEvents.recipes(event => {
  event.recipes.example.compressor()
    .id('example:compressed_part')
    .duration(120)
    .pncPressureCondition(false, 2.0, 5.0) // false：压力
    .perTick(r => r.inputPNCAir(20))
    .inputItems('minecraft:iron_ingot')
    .outputItems('minecraft:iron_block')
})
```

`pncPressureCondition(isAir, min, max)` 中，`true` 检查空气量，`false` 检查压力。条件不会消耗任何值；消耗/产出必须添加 capability 内容。

## 热交换器

添加 `pneumatic_heat_exchanger`，配置容量/导热与连接选项、自动 IO，再使用 `inputPNCHeat`/`outputPNCHeat`。`pncTemperatureCondition(min, max)` 只观察温度。

```js
ServerEvents.recipes(event => {
  event.recipes.example.thermopress()
    .id('example:heated_pressing')
    .duration(80)
    .pncTemperatureCondition(373, 773)
    .perTick(r => r.inputPNCHeat(1.5))
    .inputItems('minecraft:copper_ingot')
    .outputItems('minecraft:copper_block')
})
```

## 安全与验证

危险/临界压力是玩法安全设置，不是配方范围。分别测试低于下限、范围内、高于上限、危险和临界状态；逐面确认压力管连接、主动自动 IO 方向，以及配方输出无法接收时的行为。压力/空气和温度应使用不同 UI 组件，让玩家能判断条件为何失败。
