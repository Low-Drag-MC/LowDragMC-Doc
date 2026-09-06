# 多方块机器

<VersionBadge version="21.1.1" label="MBD2" icon="tag" />

多方块项目增加可复用谓词、三维 Pattern、重复范围、控制器位置、结构预览、催化剂和部件 capability 路由。

<figure>
<img src="/assets/multiblocked2/editor/multiblock-pattern.png" alt="MBD2 Multiblock Pattern 编辑器显示层轴控制、控制器层、三维预览与谓词资源">
<figcaption>Pattern 视图将层导航和重复控制与交互式三维预览分开。</figcaption>
</figure>

## 创建 Pattern

1. 在绘制网格前创建谓词资源。
2. 选择 Pattern 层轴，并以一致的控制器朝向创作每一层。
3. 为每个 placeholder 指定一个或多个谓词；同一位置的多个谓词作为候选组合。
4. 准确标记一个 placeholder 为控制器，并设置朝向。
5. 配置每个 aisle 的最小和最大重复次数。
6. 生成并检查最小与最大布局的结构信息。

## 内置谓词类型

| 类型 | 匹配内容 |
| --- | --- |
| `blocks` | 配置方块之一 |
| `blockstates` | 精确配置的方块状态 |
| `partial_state` | 只检查指定方块状态属性，忽略未指定属性 |
| `tags` | 位于指定方块标签中的方块 |
| `fluids` | 指定流体状态 |
| `air` | 仅空气 |
| `any` | 任意方块状态；只在结构确实不关心时使用 |

希望整合包可扩展机壳时优先使用标签或 partial state。朝向或属性属于机器要求时使用精确状态。

## 重复与预览

每个 aisle 有闭区间 `[min, max]` 重复范围。运行时匹配接受任何允许数量。编辑器没有显式结构信息时，MBD2 会根据最小重复和额外重复层变体生成预览。请测试控制器偏移以及所有极值；最小布局有效不代表最大布局朝向正确。

## 催化剂与 UI 行为

催化剂开关可以添加替代控制器候选，并参与催化剂查询。`showUIOnlyFormed` 阻止结构成型前打开控制器 UI。`showUIWhenClickStructure` 允许结构交互路由到 UI。

## 部件与代理 Capability

部件保留自己的 Trait。部件还可通过静态 `proxyControllerCapabilities` 或谓词配置的代理条目暴露指定控制器 Trait。路由使用：

- Trait 名称子串过滤器。
- 根据部件/控制器朝向和查询侧解析的 capability IO。
- 可选自动 IO 行为。
- 多个匹配 Trait/控制器共同提供时的合并 wrapper。

代理暴露的是控制器存储视图，不会复制存储。自定义 Trait 的错误 `merge` 实现可能绕过 IO 或模拟规则，因此必须用 GameTest 覆盖此路径。
