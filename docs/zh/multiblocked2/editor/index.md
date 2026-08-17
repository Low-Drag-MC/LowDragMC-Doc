# 编辑器工作流

<VersionBadge version="21.0.11" label="MBD2" icon="tag" />

MBD2 编辑器是创建机器和配方类型产品文件的主要工具。

<figure>
<img src="/assets/multiblocked2/editor/overview.png" alt="MBD2 编辑器显示项目标签、状态层级、场景预览、Inspector、History 与 Resources 视图">
<figcaption>项目视图位于中间，Inspector 和 History 停靠在右侧，Resources 位于底部。</figcaption>
</figure>

执行 `/mbd2_editor` 打开编辑器。文件菜单会自动发现已注册的机器和配方类型项目提供器。

## 创作顺序

1. 创建所需机器类型的项目。
2. 配置定义和状态。
3. 添加 Trait，再生成或细调机器 UI。
4. 对多方块机器，创建谓词、结构 Pattern 和结构信息。
5. 保存项目并导出产品，然后测试配方。

配方类型项目可以显示配方列表和配方 UI。字段在运行时的含义请见[配方系统](../recipes/)。
