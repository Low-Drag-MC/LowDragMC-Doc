# 集成（已移动）

<VersionBadge version="21.0.11" label="MBD2" icon="tag" />

集成文档现已扩展为完整章节。请前往[集成总览](./integrations/)。

此兼容页面保留旧的 `/integrations.html` URL。

<figure>
<img src="/assets/multiblocked2/integrations/integration-map.png" alt="MBD2 Add Trait 菜单列出内置、AE2、Mekanism、Nature's Aura 与 PneumaticCraft 条目">
<figcaption>加载文档所述集成模组后的实时编辑器注册表。</figcaption>
</figure>

<!-- 下方保留旧摘要，供外部旧链接使用。 -->

## 旧版摘要

| 模组 | Trait/运行时 | 配方 capability | Condition/事件/UI | 21.0.11 状态 |
| --- | --- | --- | --- | --- |
| KubeJS | 从事件访问机器 | 为每个 MBD 配方类型生成 schema | Registry、机器、配方类型、客户端钩子 | 已支持 |
| JEI / REI / EMI | — | 展示已注册内容 | 配方与多方块分类 | 已支持 |
| Mekanism | 化学罐、热容器 | `mek_chemical`、`mek_heat` | `mekanism_heat` 条件 | 已支持 |
| Create | 转动/动力 Trait | `create_rotation` | 转动条件与渲染支持 | 已支持，但动力定义项目未公开 |
| PneumaticCraft | 压力/空气 handler、热交换器 | `pneumatic_pressure_air`、`pneumatic_heat` | 压力与温度条件 | 已支持 |
| Nature's Aura | 灵气 handler | `natures_aura` | Trait UI/渲染 | 已支持 |
| AE2 | ME Interface、Pattern Provider | 使用 MBD 物品/流体 capability | 网络/样板供应器行为 | 已支持 |
| GeckoLib | 动画机器 renderer | — | 自定义关键帧 KubeJS 桥接 | 已支持 |
| Jade | 机器查询 | — | 信息提供器 | 已支持 |
| Botania / GTCEu / Embers / Photon | 仅部分源码 | 关键注册禁用 | 部分路径被注释或未激活 | 未公开 |

## Mekanism

添加 `chemical_tank` 处理化学品配方 IO，添加 `mek_heat_container` 处理热。化学品 KubeJS 内容通过 `inputChemicals(...)`/`outputChemicals(...)` 解析；当前 1.21.1 代码使用统一 Mekanism chemical stack 模型，不再使用旧的 gas/slurry/pigment/infusion 方法组。

`mekanism_heat` 检查温度，不消耗热量。需要传输热量时使用 `mek_heat` 配方内容。配方 handler IO 与 Trait 的外部 capability IO 必须分别配置。

## Create

`create_rotation` 内容区分 RPM 与应力。使用 `inputRPM`/`outputRPM` 或 `inputStress`/`outputStress`，不能互相替代。条件同时接受 RPM 和应力范围。

Create 转动 Trait 和 capability 已注册，但当前 common bootstrap 禁用了 `kinetic` KubeJS 机器 builder 和 Create 动力编辑器项目的自动注册。请根据实际安装构建中编辑器可见功能编写文档/内容，不要假设休眠的定义类型可用。

## PneumaticCraft

压力和空气共用 `pneumatic_pressure_air` capability，并由标记描述模式。`inputPNCPressure` 使用压力；`inputPNCAir` 使用空气量。热使用独立的 `pneumatic_heat` capability 和热交换器 Trait。

条件只检查状态：`pncPressureCondition(isAir, min, max)` 与 `pncTemperatureCondition(min, max)`。配方还要传输这些资源时，需要同时添加条件和对应内容。

## Nature's Aura

`aura_handler` Trait 处理整数 `natures_aura` 内容。灵气可用量依赖集成面向世界的 handler，因此要在真实机器位置测试提取/产出，而不应只测试孤立配方 builder。

## Applied Energistics 2

`ae2_me_interface` 和 `ae2_me_pattern_provider` 是 Trait type，不是新的配方内容类型。它们将 AE2 网络/样板行为桥接到 MBD2 现有物品与流体 capability。请配置有效的 MBD 配方类型和物品/流体 handler；AE2 Trait 不会让任意自定义 capability 自动兼容样板。

## 配方查看器

MBD2 为已注册配方类型和多方块信息提供分类。实体和 Mekanism 化学品组件会在支持时加入查看器特有 ingredient。安装多个查看器时，MBD2 通过优先级/保护逻辑避免重复注册；请测试整合包实际发布的查看器组合。

`isXEIVisible` 控制配方类型是否有分类，配方 `isXEIHidden` 控制单条展示。`uiName` 将内容绑定到自定义查看器组件；默认 ID 为 `@<capability>_<io>_<index>`。

## GeckoLib 与 Jade

GeckoLib 启用动画渲染资源和客户端自定义关键帧事件桥接。除非独立服务端操作授权游戏逻辑变化，否则动画事件只应影响视觉。Jade 暴露机器信息，不改变配方或 capability 行为。

## 未激活源码路径

Botania 魔力、GTCEu 能量、Embers 余烬和 Photon FX 类仍在仓库中，但 `21.0.11` 已禁用其配方 capability 注解/注册或运行时调用。在发布构建恢复并测试这些入口之前，不要发布使用历史 `inputMana`、`inputEU`、`inputEmber` 或 Photon machine FX 的脚本。

::: tip 集成验收测试
加载全部计划使用的可选模组启动一次，确认 Trait 出现在编辑器，检查 capability/condition registry，运行输入和输出配方，测试自动化/代理侧，并在选定配方查看器中打开结果。
:::
