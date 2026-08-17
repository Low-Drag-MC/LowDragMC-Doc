# Trait 与机器 UI

<VersionBadge version="21.0.11" label="MBD2" icon="tag" />

Trait 是可配置的机器组件。请区分三套 IO：配方 handler IO、分侧方块 capability IO，以及自动世界 IO。

<figure>
<img src="/assets/multiblocked2/editor/machine-ui.png" alt="MBD2 Machine UI 编辑器显示层级、画布、物品栏槽位、样式表、模拟和添加元素控件">
<figcaption>Machine UI 画布；使用右上角添加按钮从已配置 Trait 生成控件。</figcaption>
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

可选 Trait 只在依赖存在时出现，参见[集成](../integrations/)。

## 生成并绑定 UI

实现 `IUIProviderTrait` 的 Trait 定义使用基于 `ui:<trait-name>` 的 ID 创建模板。`SLOT` 布局进入输入/输出列，`BAR` 布局位于其下方。UI 生成器还可添加配方进度、燃料进度、配方查看器查询和玩家物品栏。

Trait 名称和数量稳定后再生成 UI。重命名 Trait 时，检查所有生成组件 ID、配方 `slotName`/`uiName` 和脚本。

运行时 `initTraitUI` 将真实 Trait 绑定到匹配组件。存储由服务端控制；控件应发送操作或使用 data binding，不能直接信任客户端值。

## 跨部件 UI

运行时 capability 代理已经实现。当前多方块 UI 中跨部件/控制器组件 ID 重写仍不完整，因此不要把历史的 `part:<trait>@ui:<id>` 等自定义 ID 记录为稳定的 1.21.1 行为。
