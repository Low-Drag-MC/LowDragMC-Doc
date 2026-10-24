# Asset Browser

<VersionBadge version="2.2.33" label="自" icon="tag" />

`AssetBrowser` 是游戏目录下 `ldlib2` 文件夹的文件浏览器。它的用法类似 Unity 的 Project 窗口：左侧是文件夹树，右侧以网格或列表显示选中文件夹的内容。

它就是 `ResourceView` 中固定在各资源类型 tab 前面的 **Assets** tab。加载或关闭项目时它都会保留。

<figure>
<img src="/assets/ldlib2/editor/asset-browser.png" alt="Asset browser with a folder tree on the left and resource thumbnails on the right">
<figcaption>
Assets tab。已加载资源类型能读取的文件会显示该类型的缩略图。
</figcaption>
</figure>

已加载的 `Resource` 类型能读取的文件会显示该类型的缩略图，并在该类型的编辑器中打开。项目文件通过其 `ProjectType` 打开。其余文件都是普通文件，可以重命名、复制、移动或删除。

从 Editor 获取浏览器：

```java
AssetBrowser browser = editor.resourceView.getAssetBrowser();
```

## 文件操作 { #working-with-files }

| 操作 | 方式 |
| --- | --- |
| 打开 | 双击。资源在其类型的编辑器中打开；项目文件通过 `ProjectType#openProject` 打开；文件夹在浏览器中打开。 |
| 新建 | 右键空白处 → **New** → 新文件夹，或任一已加载类型的资源。资源项与资源面板提供的相同。资源只能在当前打开的文件夹中创建；在其他文件夹上，菜单改为提供 **Open Folder In Browser**。 |
| 重命名、复制、剪切、粘贴、删除 | 右键文件或文件夹。 |
| Duplicate | 右键资源文件，在旁边生成一份副本。 |
| 移动 | 把文件拖到网格或树中的另一个文件夹上。 |
| Copy Path | 右键文件。复制带类型的资源路径；普通文件则复制绝对路径。 |
| 在系统中打开文件夹 | 右键 → **Open Folder**。 |
| 从桌面导入 | 从系统文件管理器拖入文件。弹出的菜单提供 **Copy into "folder"**，以及每种能读取这些文件的资源类型对应的 **Import as \<type\>**。 |

移动操作会记录到 Editor 的历史中，可以撤销。删除资源文件会经过其资源类型，因此同样可以撤销。

浏览器每 10 tick 检查一次当前文件夹的外部变化。

## 工具栏 { #toolbar }

| 控件 | 说明 |
| --- | --- |
| 搜索框 | 按名称过滤当前文件夹。 |
| 搜索范围 | 在"当前文件夹"和"根目录下全部内容"之间切换。自 2.2.42。 |
| 排序 | Name、Type、Size 或 Date Modified；升序或降序。文件夹总是排在前面。 |
| 类型过滤 | 只显示选中的资源类型。 |
| 显示全部文件 | 同时列出没有任何已加载资源类型能读取的文件。 |
| 列表 / 网格、预览大小 | 显示模式和格子大小。格子大小只属于浏览器本身，不会改动资源类型保存的显示设置。 |

## 全局搜索 { #global-search }

<VersionBadge version="2.2.42" label="自" icon="tag" />

点击搜索框旁边的范围按钮，即可按名称搜索根目录下的全部内容，而不只是当前文件夹。搜索过程中结果会陆续加入网格，面包屑位置显示状态信息。

右键某个结果 → **Show In Folder**，会打开它所在的文件夹并选中该文件。

全局搜索在找到 2000 个结果后停止，只显示前 500 个。缩小搜索范围即可看到其余结果。

## 把文件夹用作资源提供器 { #use-a-folder-as-a-resource-provider }

<VersionBadge version="2.2.42" label="自" icon="tag" />

右键文件夹 → **Use As Resource Provider**，然后选择资源类型。该文件夹会成为该类型的 `FileResourceProvider`，并出现在资源面板中。只会列出该文件夹尚未作为 provider 的类型。

```java
// 该文件夹已经是该类型的 file provider 时返回 false
browser.addFileProvider(TexturesResource.INSTANCE.getResourceInstance(), folder);
```

## 接收其他 View 的拖放 { #accept-drops-from-other-views }

<VersionBadge version="2.2.42" label="自" icon="tag" />

默认情况下，浏览器只接受它自己的文件和来自桌面的文件。添加一个 `DropHandler`，即可让用户把其他 View 的拖拽 payload 放到文件夹上，并在那里写成文件：

```java
editor.resourceView.getAssetBrowser().addDropHandler(new AssetBrowser.DropHandler() {
    @Override
    public boolean accepts(Object payload, File directory) {
        return payload instanceof ShopEntryReference;
    }

    @Override
    public void drop(Object payload, File directory) {
        var entry = (ShopEntryReference) payload;
        writeShopEntryFile(entry, new File(directory, entry.name() + ".shop_entry.nbt"));
    }
});
```

目标是指针下方的文件夹格子；放在空白处时则是当前打开的文件夹。第一个 `accepts` 返回 `true` 的 handler 处理此次拖放，之后网格会刷新。用 `removeDropHandler` 移除 handler。

从浏览器中开始的拖拽 payload 是 `AssetBrowser.DraggedAssets`，其中携带被拖动的 `File`。

## 项目文件 { #project-files }

<VersionBadge version="2.2.42" label="自" icon="tag" />

`ProjectType` 决定自己的文件如何打开，以及它们的右键菜单提供什么：

```java
public class ShopProjectType extends ProjectType {
    public static final ShopProjectType TYPE = new ShopProjectType();

    private ShopProjectType() {
        super("project.shop", ".shop.nbt", ShopProject::new);
    }

    @Override
    public void openProject(Editor editor, File file) throws Exception {
        if (file.getName().endsWith(".generated.shop.nbt")) {
            Dialog.showNotification("shop.generated.title", "shop.generated.tips", null).show(editor);
            return;
        }
        super.openProject(editor, file);
    }

    @Override
    public void appendFileMenu(Editor editor, File file, TreeBuilder.Menu menu) {
        menu.leaf("shop.menu.export", () -> exportShop(file));
        menu.disabledLeaf("shop.menu.publish");
    }
}
```

File 菜单的 Open、Recent Projects 以及浏览器中的双击都会调用 `openProject`。默认实现加载该文件。如果某种类型的文件并非都应该直接编辑，可以改为给出说明或打开别的内容。文件无法加载时抛出异常，调用方会告知用户。

`appendFileMenu` 在浏览器中该文件菜单的 **Open** 之后添加菜单项。`TreeBuilder.Menu#disabledLeaf` 添加一个变暗显示、无法选择的菜单项。

`ProjectType#getIcon(File)` 返回单个文件的图标。覆写它可以显示每个项目自己的缩略图；请缓存结果，因为列出文件夹时每个条目都会调用一次。

## 浏览器 API { #browser-api }

| 方法 | 说明 |
| --- | --- |
| `setRoot(File)` | 更换根文件夹。不存在时会创建。 |
| `openDirectory(File)` / `getCurrentDirectory()` | 打开或读取当前显示的文件夹。 |
| `revealFile(File)` | 打开文件所在文件夹并选中该文件。 |
| `setGlobalSearch(boolean)` | 设置搜索范围。 |
| `setSortMode(SortMode)` / `setSortAscending(boolean)` | `NAME`、`TYPE`、`SIZE` 或 `MODIFIED`。 |
| `toggleTypeFilter(Resource)` / `clearTypeFilter()` | 按资源类型过滤。 |
| `setShowAllFiles(boolean)` | 列出不是资源的文件。 |
| `setDisplayMode(DisplayMode)` / `setUiWidth(int)` | 网格或列表，以及格子大小。 |
| `requestGridRebuild()` | 在下一次更新时重建网格。 |

开启 **Settings → Behavior → Restore Asset Browser Folder When Opening Project** 后，浏览器会重新打开该项目上次打开时显示的文件夹。
