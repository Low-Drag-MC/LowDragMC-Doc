# Source Examples

Use these classes as reference points while building custom editors.

## `com.lowdragmc.lowdraglib2.test.TestEditor`

A minimal `Editor` subclass. It creates a `CodeEditor`, wraps it in a `View`, places it in the center, and registers a project provider.

Read this when you want the smallest example of adding custom content to the editor workspace.

## `com.lowdragmc.lowdraglib2.gui.editor.UIEditor`

The built-in UI editor. It customizes the default workspace, loads UI-related resources, and registers `UIXmlProjectType`.

Read this when you want to see a real editor subclass that uses resources and project registration.

## `UIXmlProject` and `UIXmlProjectType`

`UIXmlProject` shows project lifecycle methods:

* default content in `initNewProject()`,
* view creation in `onLoad(Editor)`,
* cleanup in `onClosed(Editor)`,
* project data serialization.

`UIXmlProjectType` shows custom file persistence by saving and loading XML text instead of default NBT.

## `GraphEditorView`

A complex `View` with its own dirty state, save button, command handling, dynamic title, breadcrumb navigation, and close confirmation.

Read this when your editor view manages a nested editing workflow.

## `ResourceProviderContainer`

The full reference for resource panel behavior: list/grid display, selection, double-click edit, drag payloads, copy path, add, copy, rename, remove, dirty reload, and context menu extension.
