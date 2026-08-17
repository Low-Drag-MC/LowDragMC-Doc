# 从 1.20.1 Wiki 迁移

<VersionBadge version="21.0.11" label="MBD2" icon="tag" />

<figure><img src="/assets/multiblocked2/editor/overview.png" alt="作为迁移基线的当前 MBD2 1.21.1 编辑器布局"><figcaption>应以此处展示的 1.21.1 编辑器和注册行为为基线，而不是旧 Wiki 的截图或 API。</figcaption></figure>

旧 MBD2 页面不是 1.21.1 的可靠 API 参考。发布前，请基于当前版本更新脚本和整合包文档。

| 旧假设 | 1.21.1 建议 |
| --- | --- |
| 旧集成列表中的任何代码路径都能使用 | 使用[集成状态矩阵](./integrations/status.md)；多个注册已禁用 |
| KubeJS 可以配置所有机器字段 | KubeJS 只能创建基础 `single`/`multiblock` 定义；完整定义请在编辑器中创作 |
| GitHub 上旧的 `1.20.1` 链接描述当前 API | 使用当前源码和本文档；旧路径只具历史参考意义 |
| Botania、GTCEu、Embers、Photon 配方可用 | 不要在 `21.0.11` 的新整合包内容中使用它们 |

迁移后请重新测试配方加载、机器成型、capability IO 和配方查看器展示。
