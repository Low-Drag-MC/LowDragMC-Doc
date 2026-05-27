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

## IProject

`IProject` is the live project data.

Important methods:

* `initNewProject()`: called when a new project is created.
* `onLoad(Editor)`: attach project views, load runtime state, select resources.
* `onClosed(Editor)`: remove project views and release runtime state.
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

`FileMenu` then handles New, Open, Save, and Save As for that project type.
