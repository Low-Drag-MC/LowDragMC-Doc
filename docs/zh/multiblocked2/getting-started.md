# 快速开始

<VersionBadge version="21.0.11" label="MBD2" icon="tag" />

先在编辑器中创建机器项目并导出，再添加配方。这个流程不需要 Java 代码。

<figure>
<img src="/assets/multiblocked2/editor/overview.png" alt="在 MBD2 编辑器中新建单方块机器项目后的界面">
<figcaption>先创建项目；请通过编辑器生成产品 NBT，而不是手写这些文件。</figcaption>
</figure>

## 前置条件

- Minecraft `1.21.1`、NeoForge、LDLib2 和兼容的 MBD2 `21.0.11`。
- 创作时拥有执行 `/mbd2_editor` 的创造模式权限。
- 可选：JEI、REI 或 EMI，用于检查生成的配方展示。

## 第一个机器

1. 执行 `/mbd2_editor`，创建单方块机器或多方块项目。
2. 在机器配置视图设置机器 ID、方块/物品属性、状态与渲染器。
3. 添加所需的 [Trait](./editor/traits-and-ui.md)。Trait 提供存储、自动化或配方处理器。
4. 启用配方逻辑并选择配方类型。
5. 保存/导出项目；按运行环境要求重启或重载，然后测试生成的方块。
6. 在配方类型项目中，或通过 [KubeJS](./KubeJS/recipe.md) 创建配方。

::: tip
先完成一个单输入、单输出机器，再加入概率、条件或自动化。这样更容易阅读配方调试器输出。
:::

## 数据来自哪里

MBD2 从自身 assets 目录加载由编辑器生成的机器和配方类型产品文件。编辑器拥有它们的 NBT 格式；把导出文件视为构建产物，而不是手写 API。KubeJS 更适合服务器配方内容和行为钩子。

下一步：[编辑器工作流](./editor/)。

需要完整注册示例时，继续阅读 [Java 与 KubeJS 教程](./tutorials/)。
