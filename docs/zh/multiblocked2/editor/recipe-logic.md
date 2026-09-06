# 配置配方逻辑

<VersionBadge version="21.1.1" label="MBD2" icon="tag" />

配方逻辑将一个机器定义连接到一个 `MBDRecipeType`。只有机器拥有可处理配方内容的兼容 handler proxy 时才会搜索。

<figure>
<img src="/assets/multiblocked2/recipes/recipe-type.png" alt="MBD2 Recipes 视图显示配方类型、示例配方与 Inspector 中的 Fuel Recipe Config">
<figcaption>配方逻辑指向已注册配方类型；燃料配置和查看器可见性属于该配方类型。</figcaption>
</figure>

## 设置

| 设置 | Runtime value 键 | 效果 |
| --- | --- | --- |
| Enable | `recipe_logic.enable` | 配方逻辑是否运行 |
| Recipe type | — | 该机器搜索的 registry ID |
| Recipe damping value | `recipe_logic.damping` | **每个等待 tick 损失的进度**，下限为 0。填 `0` 表示等待时进度冻结 |
| Consume inputs after working | `recipe_logic.consume_inputs_after_working` | 把普通输入的消耗推迟到完成时。每个工作 tick 都会重新模拟这些输入，输入消失会中断配方 |
| Always search recipe | `recipe_logic.always_search` | 每条配方完成后强制重新搜索，而不是复用缓存的那条 |
| Always modify recipe | `recipe_logic.always_modify` | 每轮重新应用修饰器。当 tier、升级件或机器数据会在两轮之间改变最终配方时需要它 |
| Recipe modifiers | — | 对匹配到的配方施加数量、时长与并行变换 |

上表中带键的设置同时也是 [runtime value](./runtime-values.md)，蓝图、脚本或 UI 可以只为**一台放置的机器**修改它，而不动定义。

## 接线检查表

1. 在解析机器定义前注册或导出配方类型。
2. 选择准确的带命名空间 ID。
3. 为候选配方使用的每种 capability 添加至少一个 handler Trait。
4. 为每个配方方向设置 handler IO。
5. 分别测试普通内容与 per-tick 内容。
6. 视觉需要反映状态时添加 `waiting` 和 `working` 状态。
7. 从生成 UI 测试配方查看器查询。

工作期间还会重新检查条件。天气、红石、转动、热、压力或其他条件变化时配方可能进入等待；等待不等于重置，等待要付出多少进度由 damping value 决定。

执行模型参见[配方生命周期](../recipes/recipe-lifecycle.md)；想改写而不只是缩放已匹配的配方，见[蓝图](../blueprints/)。
