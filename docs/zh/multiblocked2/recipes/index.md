# 配方系统

<VersionBadge version="21.1.1" label="MBD2" icon="tag" />

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
| `slotName` | 只交给声明了该 slot 名的 Trait 处理 |
| `uiName` | 绑定到指定名称的配方查看器控件 |

KubeJS builder 中 `duration` 默认为 `100` tick。`priority` 排列候选配方——**数值越小越先尝试**。可运行的示例见 [KubeJS 配方](../KubeJS/recipe.md)。

## 条件与自定义数据

条件在工作开始前检查，并在配方工作期间反复检查。配方自定义数据是可供机器逻辑、蓝图和事件整合使用的 NBT compound；它不会创建 Trait，本身也不改变行为。

## 在运行时修改配方

| 想要 | 用 |
| --- | --- |
| 缩放数量、时长或并行 | 机器[配方逻辑](../editor/recipe-logic.md)上的配方修饰器 |
| 改变配方**换什么** | 挂在 `Recipe Modify (Before)` 上的[蓝图](../blueprints/)，或 [KubeJS](../KubeJS/upgrade_system.md) |
| 否决某个候选 | `RecipeCondition`，不是事件 |

下一步：[能力与条件](./capabilities-and-conditions.md)。
