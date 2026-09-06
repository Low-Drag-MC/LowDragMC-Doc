# 集成状态

<VersionBadge version="21.1.1" label="MBD2" icon="tag" />

<figure>
<img src="/assets/multiblocked2/integrations/integration-map.png" alt="MBD2 的 Add Trait 注册菜单，显示已安装测试模组带来的可选整合条目">
<figcaption>实时的 **Add Trait** 注册菜单。可选条目只在对应模组加载时出现，所以这个菜单是判断整合是否真的生效的最快方式。</figcaption>
</figure>

## 资源类整合

它们提供配方 capability 以及处理它们的 Trait。

| 模组 | Capability | Trait | 条件 |
| --- | --- | --- | --- |
| Mekanism | `mek_chemical`、`mek_heat` | `chemical_tank`、`mek_heat_container` | `mekanism_heat` |
| Create | `create_rotation` | `!create_rotation` | `create_rotation` |
| PneumaticCraft | `pneumatic_pressure_air`、`pneumatic_heat` | `pneumatic_pressure_air_handler`、`pneumatic_heat_exchanger` | `pneumatic_pressure`、`pneumatic_temperature` |
| Nature's Aura | `natures_aura` | `aura_handler` | — |
| Ars Nouveau | `ars_source` | `ars_source_storage`、`ars_nearby_source` | `ars_source_nearby` |
| Applied Energistics 2 | —（使用 `item` / `fluid`） | `ae2_me_interface`、`ae2_me_pattern_provider` | — |

## 非资源类整合

| 模组 | MBD2 从中获得 |
| --- | --- |
| KubeJS | 注册事件、每个配方类型一个 schema、机器与配方类型事件、[脚本渲染器](../KubeJS/client-renderers.md) |
| JEI / REI / EMI | 配方与多方块分类。配方类型上的 `isXEIVisible`、单条配方上的 `isXEIHidden` |
| Jade | 机器信息提供器；不改变任何行为 |
| GeckoLib | 动画机器渲染器与客户端关键帧事件 |
| Photon | [机器特效](../editor/machine-fx.md)——每状态列表与命名库 |
| KilaGraph | [机器蓝图](../blueprints/)——节点图、编辑器与 235 个 MBD2 节点 |

## 未公开

| 模组 | 状态 |
| --- | --- |
| Botania、GTCEu、Embers | 类还在仓库里，但 `@LDLRegister` 注解和 KubeJS builder 方法被注释掉了。`inputMana`、`inputEU` 和 `inputEmber` 无法调用 |

::: warning 有源码不等于有支持
一个整合类可以留在仓库里而它的注册被禁用。只有在你安装的这个版本上、出现在编辑器 **Add Trait** 菜单里的东西才是真的。
:::

## Create：有什么、没有什么

旋转 capability、条件、Trait、UI 元素以及 `create_machine` 机器定义类型都已注册，编辑器的项目菜单里也有 Create 动能机器——它的 `.cm` 产物用类型键 `create_machine` 从 Java 注册。

**没有**的是 KubeJS 的 `kinetic` 机器 builder 键：`MBDRegistryEvents.machine` 只接受 `single` 和 `multiblock`。动能机器请在编辑器里创作。

## 发布验收测试

用整合包实际的可选模组组合启动一次，确认每个 Trait、capability 和条件都出现，跑一条输入配方和一条输出配方，测试每个开放的面，重启世界，再检查配方查看器。任何可选模组版本变化后重复一遍。
