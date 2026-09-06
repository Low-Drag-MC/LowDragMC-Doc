# KubeJS 示例库

<VersionBadge version="Minecraft 1.21.1 / MBD2 21.1.1" label="默认版本" icon="tag" />

可直接复制的脚本文件。除非片段带有旧版本标记，它都在 MBD2 `21.1.1`、KubeJS `2101.7.2-build.226` 与 LDLib2 `2.2.39.a` 上**实际执行过**，而不只是照着源码抄的。

| 示例 | 演示 | 脚本阶段 |
| --- | --- | --- |
| [最小完整机器](./complete-machine.md) | 注册配方类型、基础机器和配方 | Startup + Server |
| [配方手册](./recipe-cookbook.md) | 内置内容、概率、per-tick IO、配方数据 | Server |
| [条件与路由](./conditions-and-routing.md) | 条件、`slotName` 与 `uiName` | Server |
| [机器事件](./machine-events.md) | 交互、状态、多方块、生命周期钩子 | Server / Client |
| [Trait 与自定义数据](./traits-and-data.md) | 物品、流体、FE 访问，持久化 NBT，runtime value | Server |
| [UI 行为](./ui-behavior.md) | `UIElement` 查询与服务端监听器 | Server / Client |
| [运行时配方修改](./runtime-recipe.md) | 升级件、时长与配方副本 | Server |
| [模组整合](./integrations.md) | Create、Mekanism、PNC、Nature's Aura、Ars Nouveau | Server |
| [1.20.1 迁移](./migration.md) | 旧 API 到当前 API 的对照 | 迁移 |

::: tip 排查顺序
1. `logs/kubejs/startup.log`——注册脚本。这里失败就不会有配方 schema。
2. 重启。`/reload` 无法重建注册表。
3. `logs/kubejs/server.log`——配方与事件脚本。重点看 `Added N recipes … with X failed recipes` 这一行。
:::

Discord 与旧 Wiki 的示例只作为需求输入。当前源码里不存在的方法会列在[迁移页](./migration.md)，绝不会当作可运行代码展示。
