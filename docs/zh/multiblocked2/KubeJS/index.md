# MBD2 KubeJS

<VersionBadge version="Minecraft 1.21.1 / MBD2 21.0.11" label="当前文档" icon="tag" />
<VersionBadge version="KubeJS 2101.7.2-build.226" label="脚本运行时" icon="tag" />

MBD2 为 KubeJS 添加配方 schema、注册事件和带目标的机器事件。将注册定义放在 `kubejs/startup_scripts`，将配方或机器行为放在 `kubejs/server_scripts`。

<figure>
<img src="/assets/multiblocked2/recipes/recipe-display-ui.png" alt="MBD2 Recipe Viewer UI 编辑器显示 KubeJS 配方在 JEI、REI 或 EMI 中使用的模板">
<figcaption>KubeJS 提供配方数据；编辑器制作的 Recipe Viewer UI 决定这些数据如何显示。</figcaption>
</figure>

## 加载阶段

| 阶段 | MBD2 API | 用途 |
| --- | --- | --- |
| Startup | `MBDRegistryEvents.machine`、`MBDRegistryEvents.recipeType` | 基础定义和配方类型注册 |
| Server | `ServerEvents.recipes`、`MBDMachineEvents.*`、`MBDRecipeTypeEvents.*` | 配方和机器行为 |
| Client | 可用时的客户端机器事件 | 仅视觉钩子 |

每个 `MBDMachineEvents` 和 `MBDRecipeTypeEvents` 订阅都带有目标：第一个参数传入机器定义 ID 或配方类型 ID。

::: warning 机器创作边界
当前 KubeJS 注册只能创建基础 `single` 或 `multiblock` 定义。它不公开编辑器完整的状态、Trait、渲染器或 Pattern 配置。请在 MBD2 编辑器项目中创建这些内容，再用脚本编写配方和行为。
:::

先阅读[注册事件](./registry.md)，再阅读[配方](./recipe.md)。需要可直接改写的完整脚本时，进入[示例库](./examples/)。

## 版本标记规则

- **当前 API**：已与 1.21.1 分支源码核对，可以作为新脚本起点。
- **旧 API，不适用于 1.21.1**：只用于识别 Discord、旧 Wiki 或旧整合包中的 1.20.1 写法。
- **源码存在但不发布**：Java 类型或 KubeJS handler 名称仍存在，但基础机器当前不会触发，不能依赖。

::: warning 不要混用两个 UI 世代
MBD2 `onUI` 的入口仍存在，但 1.21.1 内部是 LDLib2 2.x `UI` / `UIElement`。旧 `Widget`、`getFirstWidgetById` 与 `setOnPressCallback` 示例不能运行。见 [UI 行为](./ui.md)。
:::
