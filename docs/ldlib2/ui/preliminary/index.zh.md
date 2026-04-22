# 基础概念

{{ version_badge("2.1.0", label="Since", icon="tag") }}

LDLib2 UI 遵循类似于 **Web UI**、**UI Toolkits** 和 **fluent 风格 API** 的设计理念。  
所有 UI 对象都基于一个名为 **`UIElement`** 的基础类型构建。  
通过组合 **布局**、**样式** 和 **事件**，可以实现不同的行为和视觉效果。

如果你已阅读过[入门指南](../getting_start.zh.md)，  
你可能已经注意到 **LDLib2 UI 具有高度的灵活性和模块化特性**。

以下是你可能需要深入了解的核心页面列表。  
每个页面都专注于 UI 系统的特定方面。

| 主题 | 描述 |
| ---- | ----------- |
| [ModularUI](./modularui.zh.md) | 了解 `ModularUI` 的工作原理。 |
| [布局](./layout.zh.md) | 了解基于 Yoga 的 flexbox 布局规则。 |
| [事件](./event.zh.md) | 理解 UI 事件系统，包括事件分发和冒泡机制。 |
| [样式表](./stylesheet.zh.md) | 使用 LSS 声明式定义样式并统一应用主题。 |
| [样式动画](./style_animation.zh.md) | 通过代码驱动的关键帧和缓动函数在运行时为样式属性添加动画。 |
| [数据绑定](./data_bindings.zh.md) | 将 UI 组件绑定到数据源并实现自动更新。 |
| [Screen 与 Menu](./screen_and_menu.zh.md) | 将 ModularUI 与客户端 Screen 和服务端 Menu 集成。 |

