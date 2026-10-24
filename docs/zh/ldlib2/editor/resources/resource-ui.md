# Resource UI

<figure>
<img src="/assets/ldlib2/editor/resource-view-tab-strip.png" alt="Resource panel with a widened tab strip down the left and the Assets tab open">
<figcaption>
资源面板。左侧 tab 栏被拉宽，资源 tab 在固定的 Assets tab 下方排成两列。
</figcaption>
</figure>

资源面板有四个主要区域：

1. **Resource type tabs**  
   每个 tab 切换到一种 `Resource&lt;?&gt;` 类型，例如 texture、color、UI template，或你的项目自定义资源类型。固定在最前面的 **Assets** tab 打开 [Asset Browser](./asset-browser.md)。

2. **Built-in resource providers**  
   由代码注册的 provider。Built-in resource 通常是示例、默认值或内部资产，一般只读。

3. **Additional resource providers**  
   用户或项目额外添加的 provider，例如文件夹资源。这里适合放可编辑的用户资源。

4. **Resource contents**  
   `ResourceProviderContainer` 的内容区域。它显示选中 provider 的资源，并处理选择、编辑、拖拽、复制、重命名和删除。

资源面板由三层组成。

`ResourceView` 是内置编辑器 View。它在固定的 Assets tab 之后为每种 `Resource&lt;?&gt;` 创建一个 tab，并保存当前选中的 `ResourceInstance`。

`ResourceContainer&lt;T&gt;` 是某一种资源类型的内容。左侧列出 provider，右侧显示选中 provider 的资源。

`ResourceProviderContainer&lt;T&gt;` 渲染某个 provider 中的资源。

## Tab 栏 { #tab-strip }

<VersionBadge version="2.2.41" label="自" icon="tag" />

用户可以自行调整资源 tab 栏：

* 拖动 tab 栏与内容之间的分界线来调整 tab 栏粗细；
* 沿 tab 栏拖动某个 tab 来重排；
* 右键 tab 栏 → **Tab Strip**，把它放在左侧（默认）、右侧、顶部或底部；
* **Visible Tabs** 隐藏或显示单个资源类型；
* **Fit Tabs to One Line** 把粗细交还给主题，**Reset Tab Layout** 恢复全部设置。

tab 栏变粗后可以容纳多行 tab：一旦有空间，tab 就会换到下一行。仍然放不下的 tab 可以用滚轮滚动。

这些布局按 Editor 类保存在 `ldlib2/editor_layouts/resource_views.nbt` 中。覆写 `ResourceView#layoutKeyOf(Editor)` 可以让多个 Editor 共用一套布局，或给会被多次创建的 Editor 一个稳定的 key。在代码中也可以通过 `setPlacement(...)`、`setStripSize(...)`、`fitStripSize()` 和 `resetTabLayout()` 修改同样的设置。

## Provider UI

每个 provider 通过 `IResourceProvider.createProviderToggle()` 提供 toggle。File provider 会添加打开文件夹按钮。Built-in provider 使用只读资源图标。

右键 provider 列表可以创建支持 custom instance 的 `ResourceProviderType`。

## Resource UI

`ResourceProviderContainer` 支持：

* grid 和 list 显示；
* 选择资源；
* 双击编辑；
* 拖拽 payload；
* 复制路径；
* 添加资源；
* 复制资源；
* 重命名资源；
* 删除资源；
* provider 专属右键菜单；
* 搜索和排序（2.2.42）。

### 复制与 Duplicate { #copy-and-duplicate }

<VersionBadge version="2.2.38" label="Changed" icon="tag" />

**Copy Resource To** 会打开一个对话框，询问目标位置和名称。可选目标是该资源类型所有可写的 provider，而不只是当前 provider，因此只读内置库中的资源也可以复制到可编辑的位置。复制可以撤销。

如果想不弹对话框、原地复制，调用 `duplicateResource(path)`，它会在同一个 provider 中写入一个 `_copy` 资源。`copyResource(path)` 是带对话框的版本。

### 只打开不编辑 { #open-without-editing }

<VersionBadge version="2.2.38" label="自" icon="tag" />

`canOpen` 决定双击是否打开资源，`canEdit` 决定资源能否被修改。默认情况下 `canOpen` 跟随 `canEdit`。

如果某种资源类型的编辑器有只读模式，可以放宽 `canOpen`。对于不能编辑的资源，菜单项会显示为 **View** 而不是 **Edit**：

```java
container.setCanOpen(path -> true);
```

UI template 和 graph 就是这样做的，因此内置的 template 和 graph 会以只读方式打开。

### 搜索和排序 { #search-and-sort }

<VersionBadge version="2.2.42" label="自" icon="tag" />

工具栏有一个按名称过滤该 provider 资源的搜索框，以及一个排序按钮。排序模式定义在 `Resource.SortMode` 中：`DEFAULT`（provider 自身顺序）、`NAME`、`MODIFIED` 和 `SIZE`。`MODIFIED` 和 `SIZE` 只对 file provider 提供。排序模式和方向保存在 `ResourceInstance` 上，因此对该类型的所有 provider 生效。

| 方法 | 说明 |
| --- | --- |
| `setSearchText(String)` / `getSearchText()` | 设置或读取搜索文本。 |
| `matchesSearch(path)` | 资源是否通过当前搜索。 |
| `setSortMode(Resource.SortMode)` | 修改排序模式。 |
| `setSortAscending(boolean)` | 修改排序方向。 |

常用 hook：

```java
container.setAddDefault(() -> new ShopEntry());
container.setOnEdit((view, path) -> openShopEntryEditor(path));
container.setOnMenu((view, menu) -> menu.leaf("shop.validate", this::validate));
container.setOnDragProvider(path -> resourceProvider.getResource(path));
```

在资源类型层面自定义：

```java
@Override
public ResourceProviderContainer<ShopEntry> createResourceProviderContainer(IResourceProvider<ShopEntry> provider) {
    return new ResourceProviderContainer<>(provider)
            .setAddDefault(ShopEntry::new)
            .setOnEdit((container, path) -> edit(container, path));
}
```

资源编辑通常应该走 `HistoryView`，这样 undo / redo 能和其他编辑器操作保持一致。

## 自定义显示

使用 `setUiSupplier(...)` 渲染每个资源项。

```java
@Override
public ResourceProviderContainer<ShopEntry> createResourceProviderContainer(IResourceProvider<ShopEntry> provider) {
    return super.createResourceProviderContainer(provider)
            .setAddDefault(ShopEntry::new)
            .setUiSupplier(path -> {
                var entry = provider.getResource(path);
                return new UIElement()
                        .layout(layout -> {
                            layout.widthPercent(100);
                            layout.heightPercent(100);
                        })
                        .addChild(new Label().setText(entry == null ? "missing" : entry.displayName()));
            });
}
```

`ColorsResource` 用它绘制颜色矩形。`TexturesResource` 用它绘制纹理本身。

## 自定义编辑

使用 `setOnEdit(...)` 处理双击编辑或右键菜单编辑。

```java
.setOnEdit((container, path) -> {
    var entry = provider.getResource(path);
    if (entry == null) return;

    container.getEditor().inspectorView.inspect(entry, configurator -> {
        container.markResourceDirty(path);
    });
})
```

如果编辑会替换资源值，推入 history action：

```java
container.getEditor().historyView.pushHistory(
        Component.translatable("shop.edit_entry"),
        EditAction.of(
                () -> {
                    provider.addResource(path, newEntry);
                    container.reloadSpecificResource(path);
                },
                () -> {
                    provider.addResource(path, oldEntry);
                    container.reloadSpecificResource(path);
                }
        )
);
```

## 自定义拖拽

当拖拽资源时需要提供非原始资源值的对象，使用 `setOnDragProvider(...)`。

```java
.setOnDragProvider(path -> new ShopEntryReference(path))
```

`TexturesResource` 使用这个模式拖拽 `UIResourceTexture` 引用，而不是直接拖拽 texture 对象。

## 自定义右键菜单

使用 `setOnMenu(...)` 添加资源专属命令。

```java
.setOnMenu((container, menu) -> {
    if (container.getSelected() != null) {
        menu.branch("shop.copy", branch -> {
            branch.leaf("shop.copy_path", () ->
                    ClipboardManager.INSTANCE.copyDirect(container.getSelected().getPathWithType()));
            branch.leaf("shop.copy_id", () ->
                    ClipboardManager.INSTANCE.copyDirect(container.getSelected().getResourceName()));
        });
    }
})
```

如果行为属于资源类型本身，放在 `Resource&lt;T&gt;` 子类里。若行为取决于资源来源，则使用 provider hook。
