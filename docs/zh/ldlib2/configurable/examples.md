# 源码示例

下面这些源码适合作为自定义 configurable editor 数据的参考。

## UIElement

`com.lowdragmc.lowdraglib2.gui.ui.UIElement`

`UIElement` 是 UI Editor 中最主要的 inspected object。它实现 `IConfigurable`，并暴露可见性、active 状态、focus 行为、layout、style、transform 等编辑器属性。

阅读它可以了解一个大型对象如何混合注解字段和自定义行为。

## AnimationTexture

`com.lowdragmc.lowdraglib2.gui.texture.AnimationTexture`

`AnimationTexture` 是一个紧凑的贴图属性示例：resource location、cell size、帧范围、动画时间和颜色。

它适合理解简单数据对象如何成为可编辑资源。

## EditorSettings

`com.lowdragmc.lowdraglib2.editor.settings.EditorSettings`

`EditorSettings` 展示了 Configurable 在 selected scene object 之外的用法。Settings 页面可以 inspect 临时 configurable group、应用修改、恢复旧值，并独立持久化设置。

## IGuiTexture 和 IRenderer

`com.lowdragmc.lowdraglib2.gui.texture.IGuiTexture`

`com.lowdragmc.lowdraglib2.client.renderer.IRenderer`

二者都是客户端注册资源族，并实现 `IConfigurable`。它们的 accessor 会创建类似 selector 的 UI，用来选择具体注册实现，然后 inspect 该实现自己的 configurable 字段。

当 editor 需要让用户从注册表中选择一个实现，并继续编辑该实现时，可以参考这个模式。

## Array 和 Collection Accessors

`com.lowdragmc.lowdraglib2.configurator.accessors.ArrayConfiguratorAccessor`

`com.lowdragmc.lowdraglib2.configurator.accessors.CollectionConfiguratorAccessor`

这些 accessor 展示了父 configurator 如何复用 child accessor 来编辑每个元素。它们也展示了 `@ConfigList` 如何影响添加、删除、重排、默认元素创建和自定义元素 configurator。
