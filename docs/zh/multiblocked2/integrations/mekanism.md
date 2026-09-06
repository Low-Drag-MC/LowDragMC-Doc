# Mekanism

<VersionBadge version="21.1.1" label="MBD2" icon="tag" />

Mekanism 集成增加统一化学品存储/配方内容，以及热存储/传输。MBD2 1.21.1 不再使用旧版分离的气体、灌注、颜料和浆液 capability 家族。

<figure>
<img src="/assets/multiblocked2/integrations/mekanism.png" alt="MBD2 Machine Traits 编辑器显示 Mekanism Chemical Tank 容量与过滤设置">
<figcaption>`chemical_tank` 的编辑字段；Trait 列表中其下方可见 `mek_heat_container`。</figcaption>
</figure>

## 增加的内容

| 层 | 注册名 | 用途 |
| --- | --- | --- |
| 配方 capability | `mek_chemical` | 传输统一的 `ChemicalStackIngredient` |
| 配方 capability | `mek_heat` | 以 `double` 传输热 |
| Trait | `chemical_tank` | 持久化化学品并暴露 Mekanism 化学品方块 capability |
| Trait | `mek_heat_container` | 持久化热/温度并暴露 Mekanism 热 capability |
| Condition | `mekanism_heat` | 检查温度范围，不传输热 |
| UI 元素 | `chemical-slot` | 将化学品罐绑定到机器 UI |

所有入口都以 mod ID `mekanism` 为加载条件。

## 化学机器配置

在 Trait 编辑器添加 `chemical_tank`。配置罐数量、每罐 `long` 容量、重复化学品策略、化学品/标签黑白名单、recipe/GUI/capability IO、自动 IO 与可选罐渲染。多个罐应命名；专用输入/输出罐用配方 `slotName` 路由。

Trait 暴露 `mekanism.common.capabilities.Capabilities.CHEMICAL.block()`。UI 容器交互使用 `chemical-slot`；外部管道仍受 capability 侧面与 IO 设置控制。

```js
ServerEvents.recipes(event => {
  event.recipes.example.chemical_reactor()
    .id('example:chemical_reaction')
    .duration(80)
    .inputChemicals('100x mekanism:hydrogen', '50x mekanism:oxygen')
    .outputChemicals('100x mekanism:water_vapor')
})
```

使用当前 Mekanism 化学品 ID，并在发布构建中验证脚本解析。旧的 `inputGas`、`inputSlurry`、`inputPigment`、`inputInfusion` 示例已经失效。

## 热与温度

添加 `mek_heat_container`，配置容量、逆绝热/传导参数、recipe/capability IO 与自动 IO。`inputHeat` 移除热，`outputHeat` 插入热；持续传热要放入 `perTick(...)`。

```js
ServerEvents.recipes(event => {
  event.recipes.example.heated_reactor()
    .id('example:hot_reaction')
    .duration(200)
    .perTick(r => r.inputHeat(2.5))
    .mekTemperatureCondition(600, 1200)
    .inputItems('minecraft:raw_iron')
    .outputItems('minecraft:iron_ingot')
})
```

温度与热 handler 的值比较（按 Mekanism 语义为 Kelvin）。`mekTemperatureCondition` 只决定配方是否允许，不预留或消耗热；需要处理成本时必须另加 `inputHeat`。

## 故障检查

- 编辑器没有 capability：注册发现阶段未加载 Mekanism，或版本不兼容。
- 配方不匹配：机器缺少对应 Trait、handler recipe IO 错误，或 `slotName` 指向别的罐。
- 管道无法连接：检查 capability IO 与侧面；recipe IO 不会自动暴露方块 capability。
- 温度通过但不耗热：只有 condition 时这是预期行为。
- 查看器化学品为空：检查化学品 ID 与已安装查看器集成。
