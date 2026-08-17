# 内置资源 Capability

<VersionBadge version="21.0.11" label="MBD2" icon="tag" />

这五种 capability 不需要可选模组，也是理解外部集成的参考模型。

<figure>
<img src="/assets/multiblocked2/integrations/built-in-capabilities.png" alt="MBD2 Machine Traits 编辑器列出物品、流体、Forge Energy 与实体 handler，并在 Inspector 中显示 Item Slot 设置">
<figcaption>Trait 列表中的内置 handler，以及编辑器自动生成的 Item Slot 配置。</figcaption>
</figure>

## 精确对应关系

| 配方 capability | 机器 Trait | KubeJS 方法 | 运行语义 |
| --- | --- | --- | --- |
| `item` | `item_slot` | `inputItems`、`outputItems` | 消耗/插入物品堆 |
| `item_durability` | `item_slot` | `inputItemsDurability`、`outputItemsDurability` | 损伤/修复已有的可损坏物品 |
| `fluid` | `fluid_tank` | `inputFluids`、`outputFluids` | 抽取/填充 NeoForge 流体 |
| `forge_energy` | `forge_energy_storage` | `inputFE`、`outputFE` | 抽取/接收整数 FE |
| `entity` | `entity_handler` | `inputEntities`、`outputEntities` | 在配置 AABB 中匹配/移除或生成实体 |

`IO.IN` 始终表示配方从机器侧 handler 取走内容，`IO.OUT` 表示向 handler 提供内容。对 `item_durability` 而言，输入会**增加损伤**，输出会**减少损伤**。

## 物品与耐久

添加 `item_slot`。配置 `slotSize`、`slotLimit`、相同物品能否占多个槽、物品/标签过滤，并分别配置三类访问方向：

- **Recipe IO**：配方能否从此 Trait 消耗或向其产出。
- **GUI IO**：玩家能否在绑定组件中放入/取出。
- **Capability IO / auto IO**：相邻自动化可看到什么，以及机器是否主动抽取/推出。

该 Trait 暴露 NeoForge `Capabilities.ItemHandler.BLOCK`。生成组件 ID 为 `<trait-ui-id>_0`、`_1` 等。存在多个物品 Trait 时应命名，并用 `slotName` 定向配方内容；否则任意兼容 handler 都可能满足它。

耐久内容不会消耗工具堆。工具必须已在槽内、匹配 ingredient 且可损坏。输入 10 点耐久会最多增加 10 点 damage；输出 10 点则最多修复已有的 10 点 damage。

## 流体

添加 `fluid_tank`。`tankSize` 创建多个独立罐，`capacity` 作用于每个罐。配置相同流体行为、流体/标签过滤、recipe/GUI/capability IO、主动世界 IO 速度/范围以及可选的方块内流体渲染。

该 Trait 暴露 `Capabilities.FluidHandler.BLOCK`。流体数量使用 `SizedFluidIngredient` 接受的单位；脚本中应显式写出数量。

## Forge Energy

添加 `forge_energy_storage`。`capacity` 是存储上限；`maxReceive` 与 `maxExtract` 限制外部传输，不是配方每 tick 消耗。持续耗电应把配方内容设为 per-tick。

该 Trait 暴露 `Capabilities.EnergyStorage.BLOCK`。配方 `IN` 从存储抽取，配方 `OUT` 向存储接收；因此输出缓存已满会阻止配方完成。

## 实体

添加 `entity_handler`，配置相对机器且随正面方向变换的 AABB。输入 handler 每 20 个服务端 tick 重新扫描存活实体。输入内容匹配缓存区域内实体，并在实际执行时移除；输出内容创建实体并放入区域。

实体 handler 不暴露普通物品/流体式存储 capability。设计时应考虑一秒扫描间隔，并防止生成区域被阻挡或混入意外生物。

## 完整 KubeJS 示例

```js
ServerEvents.recipes(event => {
  event.recipes.example.assembler()
    .id('example:charged_cutting')
    .duration(100)
    .inputItems('2x minecraft:iron_ingot')
    .inputItemsDurability('1x minecraft:diamond_pickaxe')
    .inputFluids('250x minecraft:water')
    .perTick(r => r.inputFE(40))
    .outputItems('minecraft:iron_block')
})
```

机器定义必须包含兼容的 `item_slot`、`fluid_tank`、`forge_energy_storage` Trait；builder 不会自动添加它们。

## 验收测试

每个 handler 先测配方模拟，再测实际执行。确认输入不足时拒绝开始、输出满时等待且不吞产物、每 tick 资源不足时按 RecipeLogic 规则暂停/停止、侧面配置与外部自动化一致，并确认内容在世界重启后保留。
