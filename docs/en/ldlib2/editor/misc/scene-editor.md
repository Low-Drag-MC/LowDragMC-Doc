# SceneEditor

`SceneEditor` is an embeddable 3D editing component. It can be placed inside a `View` or any other LDLib2 UI layout.

It provides:

* a top bar,
* a `Scene`,
* orthographic / perspective camera switch,
* right mouse camera movement,
* mouse wheel movement speed changes while moving,
* a transform gizmo bar,
* translate / rotate / scale modes.

## Scene Objects

`IScene` owns scene objects by UUID.

`ISceneObject` is the base object contract. It provides:

* a `Transform`,
* scene attach/detach lifecycle,
* child traversal,
* tick and frame update hooks.

`SceneObject` is the default implementation.

`ISceneInteractable` adds mouse hit testing through `Ray` and `VoxelShape`, plus click/release/drag callbacks.

`ISceneRendering` adds rendering hooks and applies the object's transform before `drawInternal(...)`.

`TransformGizmo` can target a `Transform` and update it in translate, rotate, or scale mode.

## Minimal Use

```java
var sceneEditor = new SceneEditor();
sceneEditor.layout(layout -> {
    layout.widthPercent(100);
    layout.flex(1);
});

sceneEditor.scene
        .createScene(player.level())
        .setTickWorld(true)
        .useCacheBuffer();

var object = new BlockModelObject();
object.transform().position(player.position().toVector3f().add(0, 1, 0));

sceneEditor.addSceneObject(object);
sceneEditor.setTransformGizmoTarget(object.transform());
```

`TestSceneEditor` is the best source reference for a complete minimal screen.
