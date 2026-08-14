# ModularUIWindow

<VersionBadge version="2.2.34" label="Since" icon="tag" />

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

::: warning 仅客户端且为可选能力

此 API 仅客户端可用。无法创建第二个窗口时 `open(...)` 返回 `false`，调用方必须提供游戏内 fallback。除非确实需要平台接管移动和缩放，否则保持 `decorated` 为 `false`。

:::
