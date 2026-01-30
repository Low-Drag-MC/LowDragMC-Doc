# 介绍
{{ version_badge("2.0.0", label="Since", icon="tag") }}

LDLib2 是对原版 LDLib 的完全重写，从头设计以支持现代版本的 Minecraft。
它在模组开发的许多领域提供了先进、高级的解决方案，显著降低了开发复杂性和长期维护成本。

LDLib2 拥有一个庞大且结构良好的代码库，为UI系统、着色器、模型渲染、数据同步与持久化以及游戏内可视化编辑器提供了坚实的基础设施，使开发者能够更高效地构建复杂系统。

:simple-discord: [加入我们的 Discord](https://discord.com/invite/sDdf2yD9bh)

:simple-github: [LDLib2 仓库](https://github.com/Low-Drag-MC/LDLib2)

---

## 💡 与 [LDLib](../ldlib/index.md) 的主要区别
* **完全重新设计的架构**
所有核心系统都已重写，以符合现代 Minecraft 版本的内部结构，从而带来更清晰、更可靠的代码。
* **全面的文档**
LDLib2 包含详细的文档、注释和示例代码，解决了 LDLib 长期以来存在的实现不清晰、难以阅读的问题。
* **移除了遗留系统**
许多过时或未使用的框架已被移除，使 LDLib2 更加轻量且易于维护。
* **改进的模组兼容性**
为 JEI、KubeJS、EMI 等主流模组提供了更稳定、更可靠的集成。

---

## 核心模块

* [数据同步与持久化](./sync/index.md){ data-preview }
* [LDLib2 UI](./ui/index.md){ data-preview }
* 着色器
* 模型渲染
* 游戏内编辑器