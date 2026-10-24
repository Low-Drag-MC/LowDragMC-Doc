# Menus

Editor 菜单基于 `MenuTab` 构建。

一个 tab 提供：

* `createDefaultMenu()`
* `getComponent()`
* 可通过 `registerMenuCreator(...)` 追加扩展

菜单 UI 由 `createMenuTab()` 创建，并添加到 Editor 顶部栏。

## FileMenu

`FileMenu` 处理项目操作：

* New
* Open
* Recent Projects
* Save
* Save As
* Settings
* Exit

每一项都会显示它在 [keymap](./keymap.md) 中当前绑定的 chord。

**Recent Projects** 按时间倒序列出最近打开的项目文件，点击即可直接打开。文件已不存在的项目不会列出，分支末尾有一个清空列表的菜单项。**Settings → Behavior → Recent Projects To Remember** 控制列出的数量；设为 `0` 时隐藏该分支。

<VersionBadge version="2.2.40" label="Changed" icon="tag" /> 列表只包含在当前 Editor 的 `FileMenu` 上注册过的项目类型的项目。2.2.40 之前，所有 Editor 共用一个列表。

在 Editor 中注册项目类型：

```java
@Override
protected void initMenus() {
    super.initMenus();
    fileMenu.addProjectProvider(ShopProjectType.TYPE);
}
```

向 New 菜单追加自定义项：

```java
fileMenu.registerNewMenuCreator((tab, menu) -> {
    menu.leaf(Icons.ADD_FILE, "shop.import", this::openImportDialog);
});
```

向 File 菜单本身追加项：

```java
fileMenu.registerMenuCreator((tab, menu) -> {
    menu.crossLine();
    menu.leaf("shop.export", this::exportProject);
});
```

## ViewMenu

`ViewMenu` 当前提供窗口大小 / GUI scale 项，背后使用 `AppearanceSettings`。

## 自定义 MenuTab

如果需要自定义顶层菜单，创建一个 `MenuTab` 子类。

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
}
```

然后在 Editor 中添加菜单 tab：

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

## 动态菜单项

当其他系统需要在不继承菜单的情况下追加项时，使用 `registerMenuCreator(...)`。

```java
var subscription = shopMenu.registerMenuCreator((tab, menu) -> {
    menu.crossLine();
    menu.leaf("shop.menu.debug_dump", this::dumpDebugInfo);
});
```

返回的 `ISubscription` 可用于移除扩展：

```java
subscription.unsubscribe();
```

适合只在特定项目打开时存在的临时项目 View、插件或调试工具。

## 构建菜单

大多数编辑器菜单通过 `TreeBuilder.Menu` 构建：

* `leaf(name, action)` 添加可点击命令。
* `leaf(icon, name, action)` 添加带图标命令。
* `branch(name, builder)` 添加子菜单。
* `crossLine()` 添加分隔线。
* `disabledLeaf(name)` / `disabledLeaf(icon, name)` 添加一个变暗显示、无法选择的菜单项，点击它不会关闭菜单。<VersionBadge version="2.2.42" label="自" icon="tag" />

当隐藏某一项会让用户不知道该操作存在、而它只是在此处不可用时，使用 `disabledLeaf`。

菜单项名称是翻译 key。和 View name、ProjectType name 一样，保持稳定。

不要把快捷键写进菜单翻译。使用 `Keymap#menuLabel(actionId, translationKey)` 在名称后追加用户绑定的 chord：

```java
menu.leaf(Icons.PLAY, editor.getKeymap().menuLabel(MyIds.RUN_PREVIEW, "shop.menu.run_preview"), this::runPreview);
```
