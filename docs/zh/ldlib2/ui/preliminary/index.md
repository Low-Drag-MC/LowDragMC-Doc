# 基础

{{ version_badge("2.1.0", label="Since", icon="tag") }}

LDLib2 UI 遵循类似于 **Web UI**、**UI 工具包** 和 **流式风格 API** 的理念。  
所有 UI 对象都从一个名为 **`UIElement`** 的基础类型构建。  
通过将元素与 **布局**、**样式** 和 **事件** 组合，可以实现不同的行为和视觉外观。

如果你已阅读 [入门指南](../getting_start.md)，  
你可能已经注意到 **LDLib2 UI 具有高度的灵活性和模块化**。

下面是你接下来可能需要探索的核心页面列表。  
每个页面都聚焦于 UI 系统的特定方面。

| 主题 | 描述 |
| ---- | ----------- |
| [ModularUI](./modularui.md) | 学习 `ModularUI` 如何工作。 |
| [布局](./layout.md) | 学习如何使用基于 Yoga 的 flexbox 规则进行 UI 布局。 |
| [事件](./event.md) | 理解 UI 事件系统，包括派发和冒泡。 |
| [样式表](./stylesheet.md) | 使用 LSS 以声明方式定义样式并一致地应用主题。 |
| [数据绑定](./data_bindings.md) | 将 UI 组件绑定到数据源并实现自动更新。 |
| [屏幕与菜单](./screen_and_menu.md) | 将 ModularUI 与客户端屏幕和服务器端菜单集成。 |