# Source Examples

These source files are useful references when building your own configurable editor data.

## UIElement

`com.lowdragmc.lowdraglib2.gui.ui.UIElement`

`UIElement` is the main object inspected by the UI Editor. It implements `IConfigurable` and exposes common editor-facing fields such as visibility, activity, focus behavior, layout, style, and transform data.

Read it to see how a large object mixes annotated fields with custom behavior.

## AnimationTexture

`com.lowdragmc.lowdraglib2.gui.texture.AnimationTexture`

`AnimationTexture` is a compact example of texture properties exposed to the inspector: resource location, cell size, frame range, animation timing, and color.

It is a good reference for simple data objects that become editable resources.

## EditorSettings

`com.lowdragmc.lowdraglib2.editor.settings.EditorSettings`

`EditorSettings` shows Configurable used outside a selected scene object. Settings pages can inspect temporary configurable groups, apply changes, restore previous values, and persist settings separately.

## IGuiTexture And IRenderer

`com.lowdragmc.lowdraglib2.gui.texture.IGuiTexture`

`com.lowdragmc.lowdraglib2.client.renderer.IRenderer`

Both are registered client-side resource families and implement `IConfigurable`. Their accessors create selector-style UIs for choosing concrete registered implementations, then inspect the selected implementation's own configurable fields.

Use this pattern when your editor lets users choose one implementation from a registry and then edit that implementation.

## Array And Collection Accessors

`com.lowdragmc.lowdraglib2.configurator.accessors.ArrayConfiguratorAccessor`

`com.lowdragmc.lowdraglib2.configurator.accessors.CollectionConfiguratorAccessor`

These accessors show how a parent configurator can reuse a child accessor for each item. They also show how `@ConfigList` changes add, remove, reorder, default item creation, and custom item configurators.
