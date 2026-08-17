# 配方系统

<VersionBadge version="21.0.11" label="MBD2" icon="tag" />

`MBDRecipeType` 将 MBD 配方分组。机器选择一个配方类型；配方逻辑通过请求 Trait 处理每项输入和输出能力来查找匹配配方。

<figure>
<img src="/assets/multiblocked2/recipes/recipe-type.png" alt="MBD2 Recipes 编辑器显示配方类型、内置 wiki_smelting 配方和配方类型 Inspector 字段">
<figcaption>Recipe Type 项目拥有内置配方、燃料设置、代理来源和查看器可见性。</figcaption>
</figure>

## 配方内容

每个条目都有方向（`input` 或 `output`）和一个 `RecipeCapability`。条目还可以具有：

| 字段 | 含义 |
| --- | --- |
| `perTick` | 在工作期间持续消耗或产出，而不是仅在边界处理 |
| `chance` | 此条目的基础概率 |
| `tierChanceBoost` | 每个机器等级额外增加的概率 |
| `slotName` | 将处理限制到指定名称的 Trait |
| `uiName` | 绑定到指定名称的配方查看器 UI 组件 |

KubeJS 构建器中 `duration` 默认为 `100` tick。`priority` 用于排列候选配方。可运行的构建器示例请见 [KubeJS 配方](../KubeJS/recipe.md)。

## 条件与自定义数据

条件在工作开始前由配方逻辑检查。配方自定义数据是可供机器逻辑和事件集成使用的 NBT compound；它不会创建 Trait，也不会自动改变行为。

下一步：[能力与条件](./capabilities-and-conditions.md)。
