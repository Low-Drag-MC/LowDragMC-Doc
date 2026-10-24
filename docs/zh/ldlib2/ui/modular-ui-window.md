# ModularUIWindow

<VersionBadge version="2.2.34" label="自" icon="tag" />

`ModularUIWindow` 可以在第二个操作系统窗口托管 `ModularUI`。UI 仍走普通 LDLib2 渲染和输入流程，但可移动到另一块显示器。

<figure>
<img src="/assets/ldlib2/modular-ui-window.png" alt="在 ModularUIWindow 中托管的 Scene 编辑器">
<figcaption>
编辑器的 Scene 视图被分离到原生窗口后，LDLib2 内容与控件仍按普通路径渲染。
</figcaption>
</figure>

```java
var window = new ModularUIWindow(new ModularUI(UI.of(root)), "My Tool");
window.setDragArea(titleBar);              // 可选
window.setStyleSource(parentModularUI);    // 可选：跟随父 UI 主题
if (!window.open(Integer.MIN_VALUE, Integer.MIN_VALUE, 640, 400, false)) {
    // 在 Minecraft 窗口中打开相同 UI。
}
```

| API | 说明 |
| --- | --- |
| `open(x, y, width, height, decorated)` | 创建并显示原生窗口。使用 `Integer.MIN_VALUE` 让平台定位。 |
| `close()` / `isOpen()` | 关闭或检查托管窗口。 |
| `setDragArea(UIElement)` | 指定可拖动窗口的标题栏区域。 |
| `setStyleSource(ModularUI)` | 镜像来源 UI 的运行时样式表。 |
| `setResizable(boolean)` | 启用边缘缩放。 |
| `setOnCloseRequested(Runnable)` | 处理用户关闭请求。 |
| `setTitle(String)` | 重命名窗口；窗口已打开时同时更新系统标题。 |
| `isMaximized()` / `toggleMaximized()` | 读取或切换最大化状态。 |
| `isDragBlocker(UIElement)` | protected。覆写它，使你自己的标题栏控件上的按下操作不被当作移动窗口。默认按钮都是 blocker。 |
| `surface()` | UI 绘制到的离屏目标；打开前为 `null`。适合测试和截图。 |
| `openWindows()` | 静态方法。所有已打开的 `ModularUIWindow`，按打开顺序。 |
| `windowOf(ModularUI)` | 静态方法。承载某个 UI（或它所嵌入的 UI）的窗口；绘制在游戏窗口中时为 `null`。 |
| `MIN_WIDTH` / `MIN_HEIGHT` | 缩放下限，200 × 150 窗口像素。计算出的尺寸应夹到这个范围内。 |

### 记住窗口位置 { #remember-where-a-window-was }

<VersionBadge version="2.2.38" label="自" icon="tag" />

| API | 说明 |
| --- | --- |
| `restoredBounds()` | 窗口上一次处于打开且非最大化状态时的位置，类型为 `WindowBounds`，没有则为 `null`。它每帧采样，因此窗口关闭或游戏被强行结束后依然有效。 |
| `WindowBounds(x, y, width, height)` | 以虚拟屏幕像素（不是 GUI 单位）表示的窗口矩形。`atLeastMinimum()` 把它夹到 `MIN_WIDTH` × `MIN_HEIGHT`。 |
| `setAlwaysOnTop(boolean)` / `isAlwaysOnTop()` | 让窗口保持在所有窗口之上，包括游戏窗口。平台拒绝时不做任何事。 |

在工具关闭时保存 `restoredBounds()` 的结果，下次再传回 `open(...)`：

```java
// 关闭时
savedBounds = window.restoredBounds();

// 下次打开
var b = savedBounds == null ? null : savedBounds.atLeastMinimum();
boolean opened = b == null
        ? window.open(Integer.MIN_VALUE, Integer.MIN_VALUE, 640, 400, false)
        : window.open(b.x(), b.y(), b.width(), b.height(), false);
```

在 Wayland 上 `OsWindow.supportsAlwaysOnTop()` 为 `false`。此时应隐藏置顶开关，而不是提供一个不起作用的开关。

### 内置用法 { #built-in-uses }

| 窗口 | 承载内容 | 版本 |
| --- | --- | --- |
| `FloatingViewWindow` | 通过 **Float in New Window** 拆出的编辑器 View。见 [浮动 View](../editor/windows.md#floating-views)。 | 2.2.34 |
| `UIDebuggerWindow` | UI 调试器。见 [调试你的 UI](./preliminary/modularui.md#debugger-in-its-own-window)。 | 2.2.38 |
| `EditorOsWindow` | 整个编辑器。见 [在独立窗口中打开 Editor](../editor/windows.md#open-the-editor-in-its-own-window)。 | 2.2.42 |

::: warning 仅客户端且为可选能力

此 API 仅客户端可用。无法创建第二个窗口时 `open(...)` 返回 `false`，调用方必须提供游戏内 fallback。除非确实需要平台接管移动和缩放，否则保持 `decorated` 为 `false`。

托管窗口使用游戏窗口的 GUI scale，不能单独设置。

:::
