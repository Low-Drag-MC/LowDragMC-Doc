# Project System

Projects are optional, but most real editors need them. A project is the saved document or asset root being edited.

## ProjectType

`ProjectType` describes a kind of project:

```java
public static final ProjectType TYPE = ProjectType.of(
        Icons.FILE,
        "project.shop",
        ".shop.nbt",
        ShopProject::new
);
```

It provides:

* icon,
* translation key/name,
* file suffix,
* project factory,
* default load/save/dirty checks.

The default implementation stores project data as NBT. Override `loadProjectFromFile`, `saveProjectToFile`, and `isProjectDirty` for custom formats.

`UIXmlProjectType` is the reference example for text persistence. It stores XML as a plain file instead of NBT.

### Opening Files and Their Menu

<VersionBadge version="2.2.42" label="Since" icon="tag" />

| Method | Description |
| --- | --- |
| `openProject(Editor, File)` | Called by the File menu's Open, Recent Projects, and a double-click in the [Asset Browser](./resources/asset-browser.md). The default loads the file into the editor. Override it for files that should not be edited directly, for example to explain or open something else. Throw when the file cannot be loaded. |
| `appendFileMenu(Editor, File, Menu)` | Adds entries after **Open** in the asset browser's menu for one of this type's files. Empty by default. |
| `getIcon(File)` | The icon of one project file, shown in Recent Projects and the asset browser. Defaults to the type's icon. Cache the result if it reads the file. Since 2.2.34. |

See [Project Files](./resources/asset-browser.md#project-files) for an example.

## IProject

`IProject` is the live project data.

Important methods:

* `initNewProject()`: called when a new project is created.
* `onLoad(Editor)`: attach project views, register project shortcuts, load runtime state, select resources.
* `onClosed(Editor)`: remove project views, unregister project shortcuts, and release runtime state.
* `serializeProject(provider)`: save project data.
* `deserializeProject(provider, tag)`: load project data.
* `getResources()`: expose resource types to the editor resource panel.

Register the type in your editor:

```java
@Override
protected void initMenus() {
    super.initMenus();
    fileMenu.addProjectProvider(ShopProjectType.TYPE);
}
```

`FileMenu` then handles New, Open, Recent Projects, Save, and Save As for that project type.

The editor outlives the project, so anything the project adds in `onLoad` must be removed in `onClosed`. For shortcuts, keep the `ISubscription` returned by `editor.getKeymap().registerAll(...)` and unsubscribe it. See [Register Actions](./keymap.md#from-a-project).
