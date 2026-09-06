# 快速开始

<VersionBadge version="21.1.1" label="MBD2" icon="tag" />

先在编辑器中创建机器项目并导出，再添加配方。这个流程不需要 Java 代码。

<figure>
<img src="/assets/multiblocked2/editor/overview.png" alt="在 MBD2 编辑器中新建单方块机器项目后的界面">
<figcaption>先创建项目；请通过编辑器生成产品 NBT，而不是手写这些文件。</figcaption>
</figure>

## 前置条件

- Minecraft `1.21.1`、NeoForge `21.1.217`+、LDLib2、KilaGraph 和 MBD2 `21.1.1`。
- 单人世界，以及执行 `/mbd2_editor` 所需的权限等级 2。
- 可选：JEI、REI 或 EMI 用于检查配方展示；Photon 用于[机器特效](./editor/machine-fx.md)。

## 第一个机器

1. 执行 `/mbd2_editor`，创建单方块机器或多方块项目。
2. **先把机器 ID 定下来**——它会成为方块、物品、方块实体和定义 ID，之后再改会让已有世界里的机器失效。
3. 配置方块与物品属性、[状态与渲染器](./editor/states-and-rendering.md)。
4. 添加机器需要的 [Trait](./editor/traits-and-ui.md)。Trait 提供存储、自动化或配方 handler。
5. 启用[配方逻辑](./editor/recipe-logic.md)并选择配方类型。
6. 保存项目，**导出产物**，然后重载或重启。
7. 在配方类型项目中，或用 [KubeJS](./KubeJS/recipe.md) 添加配方。

::: tip
先完成一个单输入、单输出的机器，再加入概率、条件或自动化。这样[配方调试器](./editor/debugging.md)的输出会好读得多。
:::

## 迭代

| 改动了 | 该做 |
| --- | --- |
| KubeJS server 脚本里的配方 | `/reload` |
| 导出后的机器项目 | `/mbd2 reload_machine_projects` |
| 导出后的配方类型项目 | `/mbd2 reload_recipe_type_projects` |
| KubeJS startup 脚本、方块属性或碰撞形状 | 重启 |

两条 `/mbd2` 重载命令读取的都是**导出后的**产物，不是编辑器里未保存的状态。

## 数据来自哪里

MBD2 从自身 assets 目录加载由编辑器创作的机器和配方类型产物。编辑器拥有它们的 NBT 格式——请把导出的 `.sm` / `.mb` / `.rt` 当作构建产物，而不是可手写的 API。

## 下一步

| 你想要 | 去 |
| --- | --- |
| 编辑器的其余部分 | [编辑器工作流](./editor/) |
| 随机器一起发布的行为 | [蓝图](./blueprints/) |
| 整合包自己的配方与脚本 | [KubeJS](./KubeJS/) |
| 完整的注册示例 | [教程](./tutorials/) |
