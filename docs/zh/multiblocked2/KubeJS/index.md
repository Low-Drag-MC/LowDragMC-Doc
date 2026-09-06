# MBD2 KubeJS

<VersionBadge version="Minecraft 1.21.1 / MBD2 21.1.1" label="当前文档" icon="tag" />
<VersionBadge version="KubeJS 2101.7.2-build.226" label="脚本运行时" icon="tag" />

MBD2 为 KubeJS 添加配方 schema、注册事件、带目标的机器事件，以及一个客户端渲染器钩子。

<figure>
<img src="/assets/multiblocked2/recipes/recipe-display-ui.png" alt="MBD2 Recipe Viewer UI 编辑器显示 KubeJS 配方在 JEI、REI 或 EMI 中使用的模板">
<figcaption>KubeJS 提供配方数据；编辑器制作的 Recipe Viewer UI 决定这些数据如何显示。</figcaption>
</figure>

## 脚本放在哪里

| 目录 | MBD2 API | 用途 |
| --- | --- | --- |
| `startup_scripts` | `MBDRegistryEvents.machine`、`MBDRegistryEvents.recipeType` | 注册配方类型和基础机器定义 |
| `server_scripts` | `ServerEvents.recipes`、`MBDMachineEvents.*`、`MBDRecipeTypeEvents.onTransferProxyRecipe` | 配方与机器行为 |
| `client_scripts` | `MBDMachineEvents.onClientTick` / `onCustomDataUpdate` / `onCustomKeyframe`、`MBDRecipeTypeEvents.onRecipeUI`、`MBDClientEvents.registerCustomRenderers` | 仅视觉 |

每个 `MBDMachineEvents` 和 `MBDRecipeTypeEvents` 订阅都**带目标**：第一个参数是机器定义 ID 或配方类型 ID。

注册相关的改动需要完整重启；`/reload` 只重建配方。

## 全局绑定

| 绑定 | 是什么 |
| --- | --- |
| `MBDRegistries` | MBD2 的注册表——`RECIPE_CAPABILITIES`、`RECIPE_TYPES`、`MACHINE_DEFINITIONS` 等 |
| `IO` | `IO.IN`、`IO.OUT`、`IO.BOTH`、`IO.NONE` |
| `CapabilityIO`、`ContentModifier`、`MachineState`、`ConfigBlockProperties` | MBD2 配置类型 |
| `UIEvents`、`HoverTooltips`、`DataBindingBuilder` 等 | LDLib2 UI 类型，详见其自身文档 |

`com.lowdragmc.mbd2` 和 `com.lowdragmc.lowdraglib2` 下的所有类也都能通过 `Java.loadClass(...)` 取到。

## 页面

| 页面 | 内容 |
| --- | --- |
| [注册事件](./registry.md) | 在 startup 阶段创建配方类型和基础机器定义 |
| [配方](./recipe.md) | 完整的配方 builder |
| [Trait](./trait.md) | 在事件里访问机器存储 |
| [事件](./event.md) | 所有机器与配方类型事件，以及每个能改什么 |
| [UI 行为](./ui.md) | 给编辑器创作的机器 UI 挂服务端行为 |
| [脚本渲染器](./client-renderers.md) | 用客户端脚本绘制机器 |
| [动态配方修改](./upgrade_system.md) | 在运行时重写选中的配方 |
| [代理配方类型](./proxy_recipetype.md) | 过滤从其他配方类型导入的配方 |
| [示例库](./examples/) | 可直接复制的脚本 |

::: warning 机器创作边界
KubeJS 注册只能创建空壳的 `single` 或 `multiblock` 定义，不公开编辑器的状态、Trait、渲染器、UI、配方逻辑或多方块 Pattern。请在 MBD2 编辑器项目里创作这些，再用脚本给它写配方和行为。
:::

::: warning 不要混用两个 UI 世代
`MBDMachineEvents.onUI` 依然存在，但 `wrapper.event.ui` 是 LDLib2 2.x 的 `UI`，不是 1.20.1 的 `WidgetGroup`。旧的 `getFirstWidgetById` 和 `setOnPressCallback` 示例不能运行。见 [UI 行为](./ui.md)。
:::

::: tip 蓝图能做同样的事
[事件页](./event.md)上的一切都可以用[蓝图](../blueprints/)节点图实现，在编辑器里创作、随机器一起发布。行为归**整合包**所有时用 KubeJS，归**机器**所有时用蓝图。
:::
