# 从 1.20.1 Wiki 迁移

<VersionBadge version="21.1.1" label="MBD2" icon="tag" />

旧 MBD2 页面不是 1.21.1 的可靠 API 参考。发布前，请基于当前版本更新脚本和整合包文档。

| 旧假设 | 1.21.1 建议 |
| --- | --- |
| 旧集成列表中的任何代码路径都能使用 | 见[集成状态矩阵](./integrations/status.md)；Botania、GTCEu 与 Embers 的注册被注释掉了 |
| KubeJS 可以配置所有机器字段 | KubeJS 只能创建空壳的 `single` / `multiblock` 定义；完整定义请在编辑器中创作 |
| 1.20.1 的 Widget UI 仍然适用 | 1.21.1 使用 LDLib2 2.x 的 `UIElement`，见 [UI 行为](./KubeJS/ui.md) |
| 机器行为只能写脚本 | [蓝图](./blueprints/)在机器项目内部覆盖同样这些事件 |
| Photon 提供配方内容 | Photon 提供的是[机器特效](./editor/machine-fx.md)，不是配方内容 |
| GitHub 上旧的 `1.20.1` 链接描述当前 API | 使用当前源码和本文档 |

## 1.20.1 Wiki 之后新增的东西

| 功能 | 页面 |
| --- | --- |
| 节点图机器行为 | [蓝图](./blueprints/) |
| 按机器覆盖设置 | [Runtime value](./editor/runtime-values.md) |
| Photon 粒子特效 | [机器特效](./editor/machine-fx.md) |
| 脚本方块实体渲染器 | [脚本渲染器](./KubeJS/client-renderers.md) |
| Ars Nouveau 的 Source | [Ars Nouveau](./integrations/ars-nouveau.md) |

迁移后请重新测试配方加载、机器成型、capability IO 和配方查看器展示。
