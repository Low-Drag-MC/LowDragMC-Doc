# SceneEditor

`SceneEditor` 是一个可嵌入的 3D 编辑组件。它可以放在 `View` 中，也可以放在任意 LDLib2 UI 布局中。

它提供：

* 顶部栏；
* `Scene`；
* 正交 / 透视相机切换；
* 右键相机移动；
* 移动时滚轮调整速度；
* transform gizmo 栏；
* translate / rotate / scale 模式。

## Scene Objects

`IScene` 通过 UUID 管理 scene object。

`ISceneObject` 是基础对象协议。它提供：

* `Transform`；
* scene attach / detach 生命周期；
* 子对象遍历；
* tick 和 frame update hooks。

`SceneObject` 是默认实现。

`ISceneInteractable` 通过 `Ray` 和 `VoxelShape` 添加鼠标命中检测，以及 click / release / drag 回调。

`ISceneRendering` 添加渲染 hook，并在 `drawInternal(...)` 前应用对象 transform。

`TransformGizmo` 可以绑定一个 `Transform`，并用 translate、rotate 或 scale 模式更新它。

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

`TestSceneEditor` 是完整最小 screen 的最佳源码参考。
