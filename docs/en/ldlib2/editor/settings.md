# Settings

Editor settings are persistent preferences for the editor UI and behavior.

<figure>
<img src="./assets/editor_setting.png" alt="Editor settings panel">
<figcaption>
Editor settings panel: setting groups on the left, editable settings on the right.
</figcaption>
</figure>

`Settings` is the unit of configuration:

```java
public interface Settings extends IConfigurable {
    ResourceLocation getId();
    String getPath();
    void onApply(Editor editor);
    default void onLoaded(Editor editor) {}
}
```

`onApply` runs only when something changed. `onLoaded` <VersionBadge version="2.2.40" label="Since" icon="tag" /> runs when the instance becomes the editor's settings: on registration, and again each time the settings are read back from disk, which replaces the instance. Use it when the settings page needs the editor to draw itself.

`EditorSettings` owns registered settings and codecs. It can:

* register and unregister settings,
* build the settings panel,
* load JSON from `config/ldlib2/editor.json`,
* save JSON,
* detect dirty state,
* apply changed settings,
* restore the last applied state.

Register defaults by overriding `initEditorSettings()`:

```java
@Override
protected void initEditorSettings() {
    super.initEditorSettings();
    editorSettings.registerSettings(new ShopSettings(), ShopSettings.CODEC);
}
```

## Built-in Settings

`Editor#initEditorSettings()` registers three settings pages.

| Settings | Page | Contents |
| --- | --- | --- |
| `AppearanceSettings` | Appearance | The editor theme (see [Builtin Stylesheets](../ui/preliminary/stylesheet.md)), the GUI scale used by the View menu's window size entries, and **Open in Its Own Window** (2.2.42, see [Windows and Floating Views](./windows.md)). It also remembers the editor window's desktop position. |
| `BehaviorSettings` | Behavior | **Restore Layout When Opening Project**, **Restore Asset Browser Folder When Opening Project**, and **Recent Projects To Remember** (0–50, default 10). |
| `KeymapSettings` | Keymap | Shortcut bindings changed by the user. See [Keymap](./keymap.md). Since 2.2.40. |

::: warning Key handling moved to the keymap
Before 2.2.40, `BehaviorSettings` installed Esc close, Alt + S, Ctrl + Shift + S, and Ctrl + S. These are now [keymap actions](./keymap.md) that users can rebind; the settings panel moved to `Ctrl+Alt+S`. `BehaviorSettings#shouldCloseOnEsc` is deprecated and no longer shown. If it was on, the editor binds `Esc` to `ldlib2:editor.close` on first load.
:::

## Custom Settings

```java
public class ShopSettings implements Settings {
    public static final ResourceLocation ID = LDLib2.id("shop");
    public static final Codec<ShopSettings> CODEC =
            PersistedParser.createCodec(ShopSettings::new);

    @Configurable
    private boolean previewItems = true;

    @Override
    public ResourceLocation getId() {
        return ID;
    }

    @Override
    public String getPath() {
        return "Shop";
    }

    @Override
    public void onApply(Editor editor) {
        // Read settings and update editor behavior.
    }
}
```

This page only shows the editor-side settings flow. Configurator details are covered separately.
