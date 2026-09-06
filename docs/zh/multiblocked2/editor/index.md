# 编辑器工作流

<VersionBadge version="21.1.1" label="MBD2" icon="tag" />

MBD2 编辑器是创作机器与配方类型产物文件的主要工具。

<figure>
<img src="/assets/multiblocked2/editor/overview.png" alt="MBD2 编辑器，显示项目标签页、状态层级、场景预览、Inspector、History 与 Resources 视图">
<figcaption>项目视图占据中间；Inspector 与 History 停靠在右侧，Resources 在下方。</figcaption>
</figure>

运行 `/mbd2_editor` 打开它。项目菜单会自动发现已注册的机器与配方类型项目提供器，所以安装了 Create 时，Create 动能机器会和内置的单方块、多方块类型并列出现。

## 机器项目的视图

| 视图 | 负责 |
| --- | --- |
| Basic Settings | 定义 ID、方块与物品属性、机器设置、Trait、配方逻辑、部件设置、[蓝图绑定](../blueprints/) |
| Machine Traits | Trait 列表及每个 Trait 的配置 |
| Machine UI | 运行时与 Trait 绑定的 `UIElement` 树 |
| [Machine FX](./machine-fx.md) | 每状态 Photon 特效与命名 FX 库 |
| Multiblock Pattern | 谓词、层、重复次数与 shape 信息——仅多方块项目 |

配方类型项目则有配方列表视图和配方展示 UI 视图。

## 创作顺序

1. 新建所需类型的项目，先把 ID 定下来。
2. 配置定义和它的[状态](./states-and-rendering.md)。
3. 添加 [Trait](./traits-and-ui.md)，然后生成或调整机器 UI。
4. 打开[配方逻辑](./recipe-logic.md)并选择配方类型。
5. 多方块还需要创作谓词、[Pattern](./multiblocks.md) 和 shape 信息。
6. 机器需要的话，再加[特效](./machine-fx.md)和[蓝图](../blueprints/)。
7. 保存项目，然后导出产物再去测试配方。

## 不重启就重载

| 命令 | 重载内容 |
| --- | --- |
| `/mbd2 reload_machine_projects` | 所有由项目文件创建的机器定义 |
| `/mbd2 reload_recipe_type_projects` | 所有由项目文件创建的配方类型及其配方 |

两条都是单人世界、权限等级 2 的命令，并且读取的是**导出后的产物**，不是编辑器里未保存的状态。先导出。

方块属性、碰撞形状以及影响注册的设置仍然需要完整重启。
