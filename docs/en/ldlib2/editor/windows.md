# Windows and Floating Views

An editor normally runs as a screen in the game window. It can also move into its own operating-system window, and single views can be torn out into floating windows. Both use [`ModularUIWindow`](../ui/modular-ui-window.md) underneath.

| Feature | What moves | Since |
| --- | --- | --- |
| Editor in its own window | The whole `EditorWindow` | 2.2.42 |
| Floating view | One `View` tab | 2.2.34 |

## Open the Editor in Its Own Window

<VersionBadge version="2.2.42" label="Since" icon="tag" />

The editor title bar has a toggle button that moves the editor between the game window and a desktop window. While the editor is in its own window, the game window stays playable beside it.

The same choice is a setting: **Settings → Appearance → Open in Its Own Window** (`AppearanceSettings#preferOsWindow`). The title bar toggle writes this setting too, so the editor reopens where the user last left it. The window position and size are also remembered.

Open an editor with `EditorWindow.show(...)` to respect that choice:

```java
EditorWindow.show(ShopEditor.WINDOW_ID, ShopEditor::new);
```

`show(...)` creates or restores the editor, then hosts it as a screen or in its own window, following the user's preference. If the editor is already open in its own window, it focuses that window and returns `null`.

| `EditorWindow` API | Description |
| --- | --- |
| `show(windowID, creator)` | Opens and shows an editor on the preferred host. Client only. |
| `show()` | Shows this window on the preferred host. |
| `hostAsScreen()` | Shows it as a screen in the game window. |
| `popOutToOsWindow()` | Moves it into its own window. Returns `false` and moves nothing if no window can be opened. |
| `dockIntoGameWindow()` | Moves it back into the game window. Returns `false` if it was not in its own window. |
| `isInOsWindow()` | Whether it is in its own window now. |
| `prefersOsWindow()` | The remembered preference. |
| `osWindowOf(windowID)` | The open `EditorOsWindow` for that id, or `null`. |

The toggle button has the element id `EditorWindow.HOST_TOGGLE_ID` (`editor_host_toggle`), for stylesheets and UI tests.

::: warning Platform limits
The toggle is hidden when no second window can be opened: when Minecraft is in native fullscreen, or when GLFW has no windowing platform. The editor's own window uses the game window's GUI scale and cannot have a scale of its own.
:::

## Floating Views

<VersionBadge version="2.2.34" label="Since" icon="tag" />

Right-click a view tab and choose **Float in New Window** to tear that view out of the editor. Choose **Dock Back** on the floating tab to return it.

```java
var floating = editor.getFloatingViews();
floating.floatView(view);      // false if the view refused to float
floating.isFloating(view);
floating.dockBack(view);
```

The first time a view floats, its window opens over the pane it came from, at the same size. After that it reopens where the user last left it. Floating windows and their positions are saved with the editor layout.

When no desktop window can be opened, the view floats in a draggable panel inside the game window instead.

Floating windows close when the editor leaves the UI tree.

### Views that should not float

Call `view.setFloatable(false)` for a view that:

* renders against the game window's own size, such as a 3D scene view that unprojects the mouse against the main window, or
* binds synced values or RPC events. A floating view moves into another `ModularUI` whose sync manager has no server side.

A view that cannot float has no **Float in New Window** entry.

## Restrict Which Views Dock Into a Window

Set a filter on a `SplittableWindow` to decide which views may be dropped into it:

```java
documentRoot.setViewFilter(view -> view instanceof ShopDocumentView);
```

Set it on a root window before splitting. `acceptsView(view)` checks the window's own filter and then its parents, so windows split out later inherit it. The filter applies to drops on the panel body and on the tab strip.

This is useful for a document editor nested inside another editor: it can refuse the outer editor's views, which would otherwise be orphaned when the document closes.
