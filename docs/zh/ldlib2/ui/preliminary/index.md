# 基础

{{ version_badge("2.1.0", label="自", icon="tag") }}

LDLib2 UI 遵循与 **Web UI**、**UI Toolkits** 和 **fluent-style APIs** 相似的理念。  
所有 UI 对象都构建自一个名为 **`UIElement`** 的单一基类型。  
通过为元素组合 **layout**、**styles** 和 **events**，即可实现不同的行为与视觉表现。

如果你已阅读 [入门指南](../getting_start.md)，  
可能已经注意到 **LDLib2 UI 具有极高的灵活性与模块化程度**。

以下是你接下来可以深入了解的核心页面列表。  
每个页面都专注于 UI 系统的某个特定方面。

| 主题 | 描述 |
| ---- | ----------- |
| [ModularUI](./modularui.md) | 了解 `ModularUI` 的工作原理。 |
| [Layout](./layout.md) | 了解如何使用基于 Yoga 的 flexbox 规则进行 UI 布局。 |
| [Events](./event.md) | 理解 UI 事件系统，包括分发与冒泡。 |
| [Stylesheet](./stylesheet.md) | 使用 LSS 以声明方式定义样式，并一致地应用主题。 |
| [StyleAnimation](./style_animation.md) | 在运行时通过代码驱动的关键帧与缓动函数对样式属性进行动画处理。 |
| [Data Bindings](./data_bindings.md) | 将 UI 组件绑定到数据源，实现自动更新。 |
| [Screen & Menu](./screen_and_menu.md) | 将 ModularUI 与客户端 Screen 和服务器端 Menu 集成。 |
