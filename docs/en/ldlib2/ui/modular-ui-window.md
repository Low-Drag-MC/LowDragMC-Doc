# ModularUIWindow

<VersionBadge version="2.2.34" label="Since" icon="tag" />

`ModularUIWindow` hosts a `ModularUI` in a second operating-system window. The UI still uses the ordinary LDLib2 rendering and input path, but can be moved to another monitor.

<figure>
<img src="/assets/ldlib2/modular-ui-window.png" alt="A Scene editor hosted inside a ModularUIWindow">
<figcaption>
The editor's Scene view after being detached into a native window. Its LDLib2 content and controls continue to render normally.
</figcaption>
</figure>

```java
var window = new ModularUIWindow(new ModularUI(UI.of(root)), "My Tool");
window.setDragArea(titleBar);              // optional
window.setStyleSource(parentModularUI);    // optional: follow its theme
if (!window.open(Integer.MIN_VALUE, Integer.MIN_VALUE, 640, 400, false)) {
    // Open the same UI in the Minecraft window instead.
}
```

| API | Description |
| --- | --- |
| `open(x, y, width, height, decorated)` | Creates and shows the native window. Use `Integer.MIN_VALUE` for platform placement. |
| `close()` / `isOpen()` | Closes or checks the hosted window. |
| `setDragArea(UIElement)` | Makes an element act as the title bar drag region. |
| `setStyleSource(ModularUI)` | Mirrors runtime stylesheets from an originating UI. |
| `setResizable(boolean)` | Enables edge resizing. |
| `setOnCloseRequested(Runnable)` | Handles the user close request. |
| `setTitle(String)` | Renames the window, including the OS title if it is open. |
| `isMaximized()` / `toggleMaximized()` | Reads or toggles the maximized state. |
| `isDragBlocker(UIElement)` | Protected. Override so presses on your own title bar controls are not taken as a window move. Buttons are blockers by default. |
| `surface()` | The off-screen target the UI is drawn into, or `null` before opening. Useful for tests and captures. |
| `openWindows()` | Static. Every open `ModularUIWindow`, in opening order. |
| `windowOf(ModularUI)` | Static. The window hosting a UI (or the UI it is embedded in), or `null` if it is drawn in the game window. |
| `MIN_WIDTH` / `MIN_HEIGHT` | The resize floor, 200 × 150 window pixels. Clamp computed sizes to it. |

### Remember Where a Window Was

<VersionBadge version="2.2.38" label="Since" icon="tag" />

| API | Description |
| --- | --- |
| `restoredBounds()` | Where the window was the last time it was open and not maximized, as a `WindowBounds`, or `null`. Sampled every frame, so it survives the window being closed or the game being killed. |
| `WindowBounds(x, y, width, height)` | A window rectangle in virtual-screen pixels, not GUI units. `atLeastMinimum()` clamps it to `MIN_WIDTH` × `MIN_HEIGHT`. |
| `setAlwaysOnTop(boolean)` / `isAlwaysOnTop()` | Keeps the window above all others, including the game window. Does nothing where the platform refuses. |

Keep the result of `restoredBounds()` when your tool closes, and pass it back to `open(...)` next time:

```java
// on close
savedBounds = window.restoredBounds();

// next time
var b = savedBounds == null ? null : savedBounds.atLeastMinimum();
boolean opened = b == null
        ? window.open(Integer.MIN_VALUE, Integer.MIN_VALUE, 640, 400, false)
        : window.open(b.x(), b.y(), b.width(), b.height(), false);
```

`OsWindow.supportsAlwaysOnTop()` is `false` on Wayland. Hide an always-on-top control there instead of offering one that does nothing.

### Built-in Uses

| Window | What it hosts | Since |
| --- | --- | --- |
| `FloatingViewWindow` | An editor view torn out with **Float in New Window**. See [Floating Views](../editor/windows.md#floating-views). | 2.2.34 |
| `UIDebuggerWindow` | The UI debugger. See [Debug your UI](./preliminary/modularui.md#debugger-in-its-own-window). | 2.2.38 |
| `EditorOsWindow` | A whole editor. See [Open the Editor in Its Own Window](../editor/windows.md#open-the-editor-in-its-own-window). | 2.2.42 |

::: warning Client-only and optional

This API is client-only. `open(...)` returns `false` if a second window cannot be created; callers must provide an in-game fallback. Keep `decorated` as `false` unless platform-managed move/resize behavior is explicitly required.

A hosted window uses the game window's GUI scale. It cannot have its own.

:::
