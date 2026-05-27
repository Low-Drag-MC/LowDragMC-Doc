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

## IProject

`IProject` 是运行时项目数据。

常用方法：

* `initNewProject()`：创建新项目时调用。
* `onLoad(Editor)`：挂载项目 View、加载运行时状态、选择资源。
* `onClosed(Editor)`：移除项目 View，释放运行时状态。
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

`FileMenu` 会自动处理 New、Open、Save 和 Save As。
