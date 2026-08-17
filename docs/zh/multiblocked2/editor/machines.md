# 单方块机器

<VersionBadge version="21.0.11" label="MBD2" icon="tag" />

机器项目会生成一个定义，随后注册一个方块、物品、方块实体类型、运行时 `MBDMachine`、状态机、Trait、UI 和可选配方逻辑。

<figure>
<img src="/assets/multiblocked2/editor/basic-settings.png" alt="单方块机器 Basic Settings 视图，Inspector 显示定义 ID、方块与物品属性">
<figcaption>定义 Inspector 由机器配置自动生成，可滚动查看全部设置组。</figcaption>
</figure>

## 创建并标识项目

1. 执行 `/mbd2_editor`，创建 **Single Machine** 项目。
2. 在配置引用前设置带命名空间的定义 ID，例如 `example:heat_press`。
3. 保存可编辑项目，再导出运行时使用的 `.sm` 产品。

该 ID 会成为生成方块、物品、方块实体类型和机器定义 ID。已有世界使用机器后再更改它，会产生缺失 registry entry，除非整合包提供迁移。

## 定义设置

| 分组 | 关键决定 |
| --- | --- |
| 方块属性 | 旋转、从状态继承的碰撞/形状、渲染层、硬度/抗性和方块行为 |
| 物品属性 | 物品渲染器、提示、GUI 光照、创造标签页开关 |
| 机器设置 | 机器等级、是否有 UI、掉落机器物品、红石信号连接 |
| Trait | 存储、配方 handler、世界 capability 暴露、自动 IO |
| 配方逻辑 | 启用、所选配方类型、damping、输入消耗时机、配方修饰器 |
| 部件设置 | 是否可作为多方块部件、共享、控制器 capability 代理 |

## 部件与控制器

单方块机器可以启用 `ConfigPartSettings`，加入一个或多个多方块控制器。`canShare` 决定它能否被多个控制器使用。控制器 capability 代理条目选择 Trait 名称过滤器和逐侧 `CapabilityIO`；它不会把存储复制到部件中。

机器仅独立使用时应禁用部件设置。不必要的部件/代理配置会增加 capability 路由排查难度。

下一步：[状态与渲染](./states-and-rendering.md)，然后阅读 [Trait 与 UI](./traits-and-ui.md)。
