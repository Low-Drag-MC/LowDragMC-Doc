# RecipeCapability 参考

<VersionBadge version="21.0.11" label="MBD2" icon="tag" />

<figure><img src="/assets/multiblocked2/integrations/built-in-capabilities.png" alt="编辑器中的内置物品、流体、Forge Energy 与实体 Trait handler"><figcaption>下方核心 capability 行直接映射到这些内置机器 handler。</figcaption></figure>

Registry name 是 codec 和 `MBDRegistries.RECIPE_CAPABILITIES.get(name)` 使用的稳定键。机器必须包含对应 Trait type 才能正常处理。

## 核心 Capability

| Registry name | Java 内容类型 | Trait type | KubeJS builder | 重要行为 |
| --- | --- | --- | --- | --- |
| `item` | `SizedIngredient` | `item_slot` | `inputItems`、`outputItems` | 匹配物品/标签候选和数量；输出必须可插入 |
| `item_durability` | `SizedIngredient` | `item_slot` | `inputItemsDurability`、`outputItemsDurability` | 数量表示由耐久 handler 处理的耐久值 |
| `fluid` | `SizedFluidIngredient` | `fluid_tank` | `inputFluids`、`outputFluids` | 匹配流体/标签和数量；储罐过滤器与 IO 仍然生效 |
| `forge_energy` | `Integer` | `forge_energy_storage` | `inputFE`、`outputFE` | FE 输入从存储提取；输出向存储接收 |
| `entity` | `EntityIngredient` | `entity_handler` | `inputEntities`、`outputEntities` | 支持实体类型/标签、数量和可选 NBT |

物品槽 Trait 同时返回物品和耐久 handler。过滤器、方块侧 capability IO、配方 handler IO 和自动 IO 是互相独立的设置：允许管道插入不代表 Trait 自动成为配方输入。

## 可选 Capability

| Registry name | 依赖 | Trait | KubeJS 方法 | 内容含义 |
| --- | --- | --- | --- | --- |
| `mek_chemical` | Mekanism | `chemical_tank` | `inputChemicals`、`outputChemicals` | 从化学品字符串解析的 `ChemicalStackIngredient` |
| `mek_heat` | Mekanism | `mek_heat_container` | `inputHeat`、`outputHeat` | `double` 热量 |
| `create_rotation` | Create | Create rotation trait | `input/outputRPM`、`input/outputStress` | 带标签联合：RPM 或应力的需求/产生 |
| `pneumatic_pressure_air` | PneumaticCraft | `pneumatic_pressure_air_handler` | 压力与空气方法 | `PressureAir` 记录数值是压力还是空气量 |
| `pneumatic_heat` | PneumaticCraft | `pneumatic_heat_exchanger` | `inputPNCHeat`、`outputPNCHeat` | `double` 热量 |
| `natures_aura` | Nature's Aura | `aura_handler` | `inputAura`、`outputAura` | 整数灵气量 |

可选注册使用 `@LDLRegister(modID = "...")`；依赖未加载时该 capability 不存在。如果整合包允许缺少对应模组，脚本就不能无条件调用其 builder 方法。

## 路由字段

```java
builder.slotName("hot_side")
    .input(HeatUnitsCapability.CAP, 500)
    .slotName(null)
    .uiName("@heat_input")
    .output(HeatUnitsCapability.CAP, 50);
```

Fluent 字段会保持生效直到再次修改。KubeJS 回调形式会自动恢复上一个值，更适合限定作用域：

```js
ServerEvents.recipes(event => {
  const heat = MBDRegistries.RECIPE_CAPABILITIES.get('heat_units')
  if (heat === null) throw new Error('heat_units capability is not registered')

  event.recipes.example.heat_press()
    .id('example:scoped_heat_press')
    .slotName('hot_side', r => r.inputs(heat, 500))
    .perTick(r => r.inputFE(20))
    .chance(0.25, r => r.outputItems('minecraft:diamond'))
})
```

## 排查“配方从不开始”

1. 确认 `MBDRegistries.RECIPE_CAPABILITIES` 中存在该 capability。
2. 确认机器 Trait 返回了针对同一个 capability 实例的 handler。
3. 确认 Trait 的配方 handler IO 支持配方方向。
4. 设置了 `slotName` 时，确认 handler 公开该名称。
5. 根据当前存储和过滤器模拟请求数量。
6. 单独检查条件；handler 缺少内容与条件失败是不同错误。
