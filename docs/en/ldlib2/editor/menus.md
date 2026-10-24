# Menus

Editor menus are built from `MenuTab`.

A tab provides:

* `createDefaultMenu()`,
* `getComponent()`,
* optional extensions through `registerMenuCreator(...)`.

The menu UI is created by `createMenuTab()` and added to the editor top bar.

## FileMenu

`FileMenu` handles project operations:

* New,
* Open,
* Recent Projects,
* Save,
* Save As,
* Settings,
* Exit.

Each entry shows the chord it is currently bound to in the [keymap](./keymap.md).

**Recent Projects** lists recently opened project files, newest first, and opens one directly. Projects whose file is gone are left out, and the branch ends with an entry that clears the list. **Settings → Behavior → Recent Projects To Remember** sets how many are listed; `0` hides the branch.

<VersionBadge version="2.2.40" label="Changed" icon="tag" /> The list only contains projects of the types registered on this editor's `FileMenu`. Before 2.2.40, every editor shared one list.

Register project types in your editor:

```java
@Override
protected void initMenus() {
    super.initMenus();
    fileMenu.addProjectProvider(ShopProjectType.TYPE);
}
```

Append custom entries to the New menu:

```java
fileMenu.registerNewMenuCreator((tab, menu) -> {
    menu.leaf(Icons.ADD_FILE, "shop.import", this::openImportDialog);
});
```

Append entries to the File menu itself:

```java
fileMenu.registerMenuCreator((tab, menu) -> {
    menu.crossLine();
    menu.leaf("shop.export", this::exportProject);
});
```

## ViewMenu

`ViewMenu` currently exposes window size / GUI scale entries backed by `AppearanceSettings`.

## Custom MenuTab

For a custom top-level menu, create a `MenuTab` subclass.

```java
public class ShopMenu extends MenuTab {
    public ShopMenu(Editor editor) {
        super(editor);
    }

    @Override
    protected TreeBuilder.Menu createDefaultMenu() {
        return TreeBuilder.Menu.start()
                .leaf(Icons.ADD_FILE, "shop.menu.new_entry", this::newEntry)
                .leaf(Icons.SAVE, "shop.menu.export", this::exportShop)
                .crossLine()
                .branch("shop.menu.tools", tools -> {
                    tools.leaf("shop.menu.validate", this::validateShop);
                    tools.leaf("shop.menu.reload_preview", this::reloadPreview);
                });
    }

    @Override
    protected Component getComponent() {
        return Component.translatable("shop.menu");
    }

    private void newEntry() {
        // Create a new shop entry.
    }

    private void exportShop() {
        // Export current project data.
    }

    private void validateShop() {
        // Validate current project data.
    }

    private void reloadPreview() {
        // Refresh a preview view.
    }
}
```

Then add the menu tab from your editor:

```java
public class ShopEditor extends Editor {
    public final ShopMenu shopMenu = new ShopMenu(this);

    @Override
    protected void initMenus() {
        super.initMenus();
        menuContainer.addChild(shopMenu.createMenuTab());
    }
}
```

## Dynamic Menu Entries

Use `registerMenuCreator(...)` when another system needs to append entries without subclassing the menu.

```java
var subscription = shopMenu.registerMenuCreator((tab, menu) -> {
    menu.crossLine();
    menu.leaf("shop.menu.debug_dump", this::dumpDebugInfo);
});
```

The returned `ISubscription` removes the extension:

```java
subscription.unsubscribe();
```

This is useful for temporary project views, plugins, or debug tools that only exist while a specific project is open.

## Menu Building

Most editor menus are built with `TreeBuilder.Menu`:

* `leaf(name, action)` adds a clickable command.
* `leaf(icon, name, action)` adds a command with an icon.
* `branch(name, builder)` adds a submenu.
* `crossLine()` adds a separator.
* `disabledLeaf(name)` / `disabledLeaf(icon, name)` adds an entry that is shown dimmed and cannot be picked. Clicking it leaves the menu open. <VersionBadge version="2.2.42" label="Since" icon="tag" />

Use `disabledLeaf` when hiding an entry would hide that the action exists at all, and it is only unavailable here.

Menu item names are translation keys. Keep them stable, just like view names and project type names.

Do not write shortcuts into menu translations. Use `Keymap#menuLabel(actionId, translationKey)` to append the chord the user has bound:

```java
menu.leaf(Icons.PLAY, editor.getKeymap().menuLabel(MyIds.RUN_PREVIEW, "shop.menu.run_preview"), this::runPreview);
```
