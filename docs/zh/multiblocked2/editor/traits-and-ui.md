# Trait 与机器 UI

<VersionBadge version="21.1.1" label="MBD2" icon="tag" />

Trait 是可配置的机器组件。请区分三套 IO：配方 handler IO、分侧方块 capability IO，以及自动世界 IO。

<figure>
<img src="/assets/multiblocked2/editor/machine-traits.png" alt="MBD2 Machine Traits 视图，列出物品、流体、能量与整合 Trait，以及 Add Trait 控件">
<figcaption>Machine Traits 视图。可选整合条目只在对应模组加载时出现。</figcaption>
</figure>

## 配置 Trait

| 设置 | 用途 |
| --- | --- |
| Trait name | KubeJS lookup 与生成 `ui:<name>` ID 使用的稳定名称 |
| Recipe handler IO | 配方逻辑是否能从 Trait 消耗或向其中产出 |
| Distinct | capability 内容是否必须不跨 handler 合并处理 |
| Slot names | 配方 `slotName` 引用的可选路由名 |
| Capability IO | 相对机器正面，哪些世界侧允许插入/提取 |
| GUI IO | 机器 UI 允许的操作 |
| Auto IO | 定期与相邻方块 capability 传输 |
| Filter/capacity/rate | Trait 特有存储限制 |

## 核心 Trait

| Trait type | 运行时存储 | 配方 handler | 世界 capability |
| --- | --- | --- | --- |
| `item_slot` | Item stack transfer | `item`、`item_durability` | 分侧物品 handler |
| `fluid_tank` | Fluid storage list | `fluid` | 分侧流体 handler |
| `forge_energy_storage` | Copiable energy storage | `forge_energy` | `Capabilities.EnergyStorage.BLOCK` |
| `entity_handler` | 实体交互配置 | `entity` | 面向行为，并非常规物品栏存储 |

可选 Trait 只在依赖存在时出现：`chemical_tank`、`mek_heat_container`、`pneumatic_pressure_air_handler`、`pneumatic_heat_exchanger`、`aura_handler`、`ars_source_storage`、`ars_nearby_source`、`ae2_me_interface`、`ae2_me_pattern_provider`。参见[集成](../integrations/)。

::: tip 这里的每一项设置都能按机器覆盖
Trait 的设置同时也是 [runtime value](./runtime-values.md)：配方 handler IO、distinct、slot names、capability IO、auto IO、容量和过滤器，都可以由蓝图或脚本在单台放置的机器上覆盖，而不动定义。
:::

## 生成并绑定 UI

<figure>
<img src="/assets/multiblocked2/editor/machine-ui.png" alt="MBD2 Machine UI 编辑器显示元素层级、画布、物品栏槽位、样式表和添加元素控件">
<figcaption>Machine UI 画布；它的添加按钮从已配置的 Trait 生成控件。</figcaption>
</figure>

实现 `IUIProviderTrait` 的 Trait 定义使用基于 `ui:<trait-name>` 的 ID 创建模板。`SLOT` 布局进入输入/输出列，`BAR` 布局位于其下方。UI 生成器还可添加配方进度、燃料进度、配方查看器查询和玩家物品栏。

Trait 名称和数量稳定后再生成 UI。重命名 Trait 时，检查所有生成组件 ID、配方 `slotName`/`uiName` 和脚本。

运行时 `initTraitUI` 将真实 Trait 绑定到匹配组件。存储由服务端控制；控件应发送操作或使用 data binding，不能直接信任客户端值。

## 跨部件 UI

多方块控制器的 UI 可以把一个控件绑定到它某个**部件**上的 Trait，部件的 UI 也可以绑定到**控制器**上的 Trait。在编辑器里给元素一个带前缀的 ID：

| 位于 | ID 形式 | 绑定到 |
| --- | --- | --- |
| 控制器的 UI | `part:<traitName>@ui:<widgetId>` | 任一已成型部件上的该 Trait |
| 部件的 UI | `controller:<traitName>@ui:<widgetId>` | 任一控制器上的该 Trait——需要打开部件设置 |

`<widgetId>` 是去掉 `ui:` 前缀的生成控件 ID，所以部件上名为 `input_items` 的 Trait、其第一个槽位 `ui:input_items_0`，写成 `part:input_items@ui:input_items_0`。

绑定时 MBD2 会找到该 Trait，把元素 ID 改回 `ui:input_items_0`，并执行该 Trait 的 `initTraitUI`。如果没有部件或控制器带这个名字的 Trait，或者该 Trait 不提供 UI，元素保持原样。

## 用蓝图添加 UI

[蓝图](../blueprints/)可以挂在 **Build UI** 事件上，往编辑器创作的界面里追加内容。[Auto IO 面板](../blueprints/built-in.md#auto-io-面板)内置蓝图就是这么做的，也是「机器不改 UI 树就白拿一块界面」的范式。
