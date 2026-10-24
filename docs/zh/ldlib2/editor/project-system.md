# Project System

项目是编辑器正在编辑的数据文档。大多数真正的编辑器都需要项目系统。

## ProjectType

`ProjectType` 描述一种项目：

```java
public static final ProjectType TYPE = ProjectType.of(
        Icons.FILE,
        "project.shop",
        ".shop.nbt",
        ShopProject::new
);
```

它提供：

* 图标；
* 翻译 key / 名称；
* 文件后缀；
* 项目创建器；
* 默认加载、保存、dirty 检查。

默认实现使用 NBT 保存项目数据。如果需要自定义格式，覆写 `loadProjectFromFile`、`saveProjectToFile` 和 `isProjectDirty`。

`UIXmlProjectType` 是文本持久化的参考示例。它把 XML 保存为普通文本文件，而不是 NBT。

### 打开文件与文件菜单 { #opening-files-and-their-menu }

<VersionBadge version="2.2.42" label="自" icon="tag" />

| 方法 | 说明 |
| --- | --- |
| `openProject(Editor, File)` | File 菜单的 Open、Recent Projects 以及 [Asset Browser](./resources/asset-browser.md) 中的双击都会调用它。默认把文件加载进 Editor。对于不应直接编辑的文件，可以覆写它，例如给出说明或打开别的内容。文件无法加载时抛出异常。 |
| `appendFileMenu(Editor, File, Menu)` | 在 Asset Browser 中该类型文件菜单的 **Open** 之后添加菜单项。默认为空。 |
| `getIcon(File)` | 单个项目文件的图标，显示在 Recent Projects 和 Asset Browser 中。默认使用类型图标。如果需要读取文件，请缓存结果。自 2.2.34。 |

示例见 [项目文件](./resources/asset-browser.md#project-files)。

## IProject

`IProject` 是运行时项目数据。

常用方法：

* `initNewProject()`：创建新项目时调用。
* `onLoad(Editor)`：挂载项目 View、注册项目快捷键、加载运行时状态、选择资源。
* `onClosed(Editor)`：移除项目 View、注销项目快捷键，释放运行时状态。
* `serializeProject(provider)`：保存项目数据。
* `deserializeProject(provider, tag)`：加载项目数据。
* `getResources()`：向资源面板暴露资源类型。

在 Editor 中注册项目类型：

```java
@Override
protected void initMenus() {
    super.initMenus();
    fileMenu.addProjectProvider(ShopProjectType.TYPE);
}
```

`FileMenu` 会自动处理 New、Open、Recent Projects、Save 和 Save As。

Editor 的生命周期比项目长，因此项目在 `onLoad` 中添加的所有东西都必须在 `onClosed` 中移除。对于快捷键，保存 `editor.getKeymap().registerAll(...)` 返回的 `ISubscription` 并注销它。见 [注册 Action](./keymap.md#from-a-project)。
