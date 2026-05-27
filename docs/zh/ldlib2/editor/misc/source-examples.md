# Source Examples

构建自定义编辑器时，可以参考这些源码。

## `com.lowdragmc.lowdraglib2.test.TestEditor`

最小 `Editor` 子类。它创建 `CodeEditor`，包装进 `View`，放到 center，并注册 project provider。

想看如何向编辑器工作区添加自定义内容时，从这里开始。

## `com.lowdragmc.lowdraglib2.gui.editor.UIEditor`

内置 UI editor。它自定义默认工作区，加载 UI 相关资源，并注册 `UIXmlProjectType`。

想看真实 editor subclass 如何使用资源和项目注册时，阅读它。

## `UIXmlProject` and `UIXmlProjectType`

`UIXmlProject` 展示项目生命周期方法：

* 在 `initNewProject()` 中填充默认内容；
* 在 `onLoad(Editor)` 中创建 View；
* 在 `onClosed(Editor)` 中清理；
* 序列化项目数据。

`UIXmlProjectType` 展示自定义文件持久化：保存和加载 XML 文本，而不是默认 NBT。

## `GraphEditorView`

复杂 `View` 示例，包含 dirty 状态、保存按钮、命令处理、动态标题、面包屑导航和关闭确认。

当你的 View 管理嵌套编辑流程时，可以参考它。

## `ResourceProviderContainer`

资源面板行为的完整参考：list/grid 显示、选择、双击编辑、拖拽 payload、复制路径、添加、复制、重命名、移除、dirty reload 和右键菜单扩展。
