# 配置配方逻辑

<VersionBadge version="21.0.11" label="MBD2" icon="tag" />

配方逻辑将一个机器定义连接到一个 `MBDRecipeType`。只有机器拥有可处理配方内容的兼容 handler proxy 时才会搜索。

<figure>
<img src="/assets/multiblocked2/recipes/recipe-type.png" alt="MBD2 Recipes 视图显示配方类型、示例配方与 Inspector 中的 Fuel Recipe Config">
<figcaption>配方逻辑指向已注册配方类型；燃料配置和查看器可见性属于该配方类型。</figcaption>
</figure>

## 设置

| 设置 | 效果 |
| --- | --- |
| Enable | 为机器创建/使用配方逻辑 |
| Recipe type | 该机器搜索的 registry ID |
| Recipe damping value | 重复搜索之间的延迟/退避；数值越大搜索越不频繁 |
| Consume inputs after working | 将普通输入消耗延迟到完成；只在理解失败/中断行为时使用 |
| Always search recipe | 强制重复搜索，而不是只依赖 handler 变化通知 |
| Always modify recipe | 一致执行配方修改流程；使用 `onBeforeRecipeModify` 的升级系统需要它 |
| Recipe modifiers | 应用由机器/部件逻辑配置的数量、时长或并行转换 |

## 接线检查表

1. 在解析机器定义前注册或导出配方类型。
2. 选择准确的带命名空间 ID。
3. 为候选配方使用的每种 capability 添加至少一个 handler Trait。
4. 为每个配方方向设置 handler IO。
5. 分别测试普通内容与 per-tick 内容。
6. 视觉需要反映状态时添加 `waiting` 和 `working` 状态。
7. 从生成 UI 测试配方查看器查询。

工作期间还会重新检查条件。天气、红石、转动、热、压力或其他条件变化时配方可能等待；这不等于重置进度，除非机器逻辑明确这样做。

执行模型参见[配方生命周期](../recipes/recipe-lifecycle.md)。
