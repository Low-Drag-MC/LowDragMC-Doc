# RecipeCondition 参考

<VersionBadge version="21.1.1" label="MBD2" icon="tag" />

条件会在匹配期间和配方工作期间检查。除非另有说明，所有值都描述机器/控制器位置或运行时机器。

## 内置条件

| Registry name | 参数 | KubeJS 方法 | 检查内容 |
| --- | --- | --- | --- |
| `dimension` | 维度 ID | `dimension(id)` | 当前世界维度等于 ID |
| `biome` | 生物群系 ID | `biome(id)` | 机器位置生物群系等于 ID |
| `pos_y` | 最小、最大 | `positionY(min, max)` | 控制器 Y 位于闭区间内 |
| `day_time` | `isDay` | `dayTime(boolean)` | 世界昼夜状态匹配 |
| `rain` | 最小、最大 | `raining(min, max)` | 降雨等级位于范围内 |
| `thunder` | 最小、最大 | `thundering(min, max)` | 雷暴等级位于范围内 |
| `light` | 天空光最小/最大、方块光最小/最大、可见天空 | `light(...)` | 两种光照与天空可见性匹配 |
| `redstone_signal` | 最小、最大（`0..15`） | `redstoneSignal(min, max)` | 最佳邻接红石信号位于范围内 |
| `block` | 最小数量、最大数量、候选方块 | `blocksInStructure(...)` | 已成型结构含有匹配数量 |
| `machine_level` | 最低等级 | `machineLevel(level)` | 机器等级满足要求 |
| `machine_custom_data` | compound、仅自定义数据标记 | `machineData(tag, flag)` | 自定义或完整机器数据包含所需 NBT |

所有范围包含边界。`machine_custom_data` 将所需 compound 合并到源数据副本，再与源数据比较，以实现包含式检查。

## 可选条件

| Registry name | 依赖 | KubeJS 方法 | 检查内容 |
| --- | --- | --- | --- |
| `create_rotation` | Create | `rotationCondition(minRPM, maxRPM, minStress, maxStress)` | 可用/工作转动值位于范围内 |
| `mekanism_heat` | Mekanism | `mekTemperatureCondition(min, max)` | Mekanism 温度位于范围内 |
| `pneumatic_temperature` | PneumaticCraft | `pncTemperatureCondition(min, max)` | 气动工艺热交换器温度位于范围内 |
| `pneumatic_pressure` | PneumaticCraft | `pncPressureCondition(isAir, min, max)` | 所选空气量或压力位于范围内 |
| `ars_source_nearby` | Ars Nouveau | `arsSourceNearbyCondition(radius, min, max)` | `radius` 内源罐持有的 Source 位于范围内 |

对应模组未加载时调用条件方法会在脚本执行时**抛异常**，所以模组可选的整合包必须加判断。

## OR、AND 与 Reverse

默认 `RecipeCondition#isOr()` 返回 `true`。MBD2 按注册类型分组：同类型候选之间使用 OR，不同类型组之间使用 AND。`reverse` 会在分组前反转每个独立测试。

```java
builder.addCondition(new BiomeCondition(PLAINS));
builder.addCondition(new BiomeCondition(DESERT)); // 平原或沙漠
builder.addCondition(new PositionYCondition(0, 64)); // 并且 Y 为 0..64
```

在编辑器中启用条件的 reverse 字段表示“不得匹配”。Java 中调用 `.setReverse(true)`。自定义条件不应在自己的 `test` 中反转结果。
