# Windows and Floating Views

Editor 通常作为游戏窗口中的一个 Screen 运行。它也可以移入独立的操作系统窗口，单个 View 也可以拆出为浮动窗口。两者底层都使用 [`ModularUIWindow`](../ui/modular-ui-window.md)。

| 功能 | 移动的内容 | 版本 |
| --- | --- | --- |
| Editor 独立窗口 | 整个 `EditorWindow` | 2.2.42 |
| 浮动 View | 一个 `View` tab | 2.2.34 |

## 在独立窗口中打开 Editor { #open-the-editor-in-its-own-window }

<VersionBadge version="2.2.42" label="自" icon="tag" />

Editor 标题栏有一个切换按钮，可以把 Editor 在游戏窗口和桌面窗口之间移动。Editor 在独立窗口中时，游戏窗口在旁边仍然可以正常游玩。

同一选项也是一项设置：**Settings → Appearance → Open in Its Own Window**（`AppearanceSettings#preferOsWindow`）。标题栏按钮也会写入这个设置，所以 Editor 会在用户上次离开的位置重新打开。窗口的位置和大小同样会被记住。

用 `EditorWindow.show(...)` 打开 Editor，即可遵循这一选择：

```java
EditorWindow.show(ShopEditor.WINDOW_ID, ShopEditor::new);
```

`show(...)` 会创建或恢复 Editor，然后按用户偏好以 Screen 或独立窗口承载它。如果该 Editor 已经在独立窗口中打开，它会聚焦那个窗口并返回 `null`。

| `EditorWindow` API | 说明 |
| --- | --- |
| `show(windowID, creator)` | 打开 Editor 并在偏好的宿主中显示。仅客户端。 |
| `show()` | 在偏好的宿主中显示此窗口。 |
| `hostAsScreen()` | 作为游戏窗口中的 Screen 显示。 |
| `popOutToOsWindow()` | 移入独立窗口。无法打开窗口时返回 `false`，且不移动任何东西。 |
| `dockIntoGameWindow()` | 移回游戏窗口。原本不在独立窗口中时返回 `false`。 |
| `isInOsWindow()` | 当前是否在独立窗口中。 |
| `prefersOsWindow()` | 记住的偏好。 |
| `osWindowOf(windowID)` | 该 id 对应的已打开 `EditorOsWindow`，没有则为 `null`。 |

切换按钮的元素 id 是 `EditorWindow.HOST_TOGGLE_ID`（`editor_host_toggle`），可用于样式表和 UI 测试。

::: warning 平台限制
无法打开第二个窗口时切换按钮会隐藏：Minecraft 处于原生全屏，或 GLFW 没有窗口平台。Editor 的独立窗口使用游戏窗口的 GUI scale，不能单独设置。
:::

## 浮动 View { #floating-views }

<VersionBadge version="2.2.34" label="自" icon="tag" />

右键 View 的 tab 并选择 **Float in New Window**，即可把该 View 从 Editor 中拆出。在浮动窗口的 tab 上选择 **Dock Back** 可以把它放回去。

```java
var floating = editor.getFloatingViews();
floating.floatView(view);      // View 拒绝浮动时返回 false
floating.isFloating(view);
floating.dockBack(view);
```

View 第一次浮动时，窗口会覆盖在它原来所在的面板上，大小相同。之后会在用户上次离开的位置重新打开。浮动窗口及其位置会随 Editor 布局一起保存。

无法打开桌面窗口时，View 会改为浮动在游戏窗口内的一个可拖拽面板中。

Editor 离开 UI 树时，浮动窗口会一并关闭。

### 不应浮动的 View { #views-that-should-not-float }

以下 View 应调用 `view.setFloatable(false)`：

* 按游戏窗口自身尺寸渲染的 View，例如根据主窗口反投影鼠标的 3D 场景 View；
* 绑定了同步值或 RPC 事件的 View。浮动 View 会移入另一个 `ModularUI`，它的同步管理器没有服务端对应。

不能浮动的 View 没有 **Float in New Window** 菜单项。

## 限制可停靠的 View { #restrict-which-views-dock-into-a-window }

在 `SplittableWindow` 上设置过滤器，决定哪些 View 可以拖入：

```java
documentRoot.setViewFilter(view -> view instanceof ShopDocumentView);
```

请在拆分之前设置在根窗口上。`acceptsView(view)` 会先检查窗口自己的过滤器，再检查父窗口，因此之后拆分出来的窗口会自动继承。过滤器同时作用于拖到面板主体和拖到 tab 栏的情况。

这适合嵌套在另一个 Editor 中的文档编辑器：它可以拒绝外层 Editor 的 View，否则这些 View 会在文档关闭时变成孤儿。
