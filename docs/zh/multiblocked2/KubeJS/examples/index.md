# KubeJS 示例库

<VersionBadge version="Minecraft 1.21.1 / MBD2 21.0.11" label="默认版本" icon="tag" />

这里的示例按可直接复制的脚本文件组织。除非页面另有旧版本标记，所有代码均已按 MBD2 `21.0.11`、KubeJS `2101.7.2-build.226` 与 LDLib2 `2.2.35` 源码核对。

<figure><img src="/assets/multiblocked2/recipes/recipe-display-ui.png" alt="MBD2 Recipe Viewer UI 显示 KubeJS 配方使用的内容布局"><figcaption>示例脚本提供运行时数据，编辑器项目提供机器、Trait 和 UI 创作数据。</figcaption></figure>

| 示例 | 学到什么 | 脚本阶段 |
| --- | --- | --- |
| [完整机器最小包](./complete-machine.md) | 注册 recipe type、基础机器与配方 | Startup + Server |
| [配方 Cookbook](./recipe-cookbook.md) | 全部内置内容类型、概率与每 tick | Server |
| [条件与路由](./conditions-and-routing.md) | condition、`slotName`、`uiName` | Server |
| [机器事件](./machine-events.md) | 交互、状态、多方块与生命周期 hook | Server/Client |
| [Trait 与自定义数据](./traits-and-data.md) | 安全访问物品、流体、FE 与持久 NBT | Server |
| [UI 行为](./ui-behavior.md) | 1.21.1 `UIElement` 查询与 server listener | Server |
| [运行时配方修改](./runtime-recipe.md) | 升级、时长与内容副本 | Server |
| [模组集成内容](./integrations.md) | Create、Mekanism、PNC、Nature's Aura | Server |
| [1.20.1 迁移速查](./migration.md) | 旧 API 到当前 API 的对应关系 | Migration |

::: tip 验证顺序
先看 `logs/kubejs/startup.log`，确认注册阶段无错误；重启后再看 `logs/kubejs/server.log`。注册脚本不能只用 `/reload` 验证。
:::

Discord 中的旧示例只作为需求来源：凡是源码中不存在的方法均放入迁移页，不会包装成可运行的 1.21.1 示例。
