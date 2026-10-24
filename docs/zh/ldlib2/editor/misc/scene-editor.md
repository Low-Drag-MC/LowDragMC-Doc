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

`TransformGizmo` 绑定一个 `ITransform`，并用 translate、rotate 或 scale 模式更新它。

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

## Transform Gizmo { #transform-gizmo }

<figure>
<img src="/assets/ldlib2/scene-gizmo.png" alt="Transform gizmo in translate, rotate, and scale mode">
<figcaption>
从左到右依次为 translate、rotate、scale 模式下的 transform gizmo。
</figcaption>
</figure>

gizmo 绘制在场景之上，每次左键点击都由它先处理。从手柄上开始的拖拽不会传给它后面的对象。

| 模式 | 手柄 | 效果 | 版本 |
| --- | --- | --- | --- |
| Translate | 轴向箭头 | 沿一个轴移动。 | |
| Translate | 平面手柄 | 在两个轴构成的平面内移动。 | |
| Translate | 中心方块（`FREE`） | 在屏幕平面内自由移动。 | 2.2.39 |
| Rotate | 轴向圆环 | 绕一个轴旋转。自 2.2.39 起，每个圆环只绘制靠近相机的一半，背后有一个淡淡的球体轮廓。 | |
| Rotate | 外圈（`SCREEN`） | 在屏幕平面内、绕相机视线方向旋转。 | 2.2.38 |
| Rotate | 球体内部（`TRACKBALL`） | 自由旋转，抓住的点跟随光标。 | 2.2.38 |
| Scale | 轴向方块 | 缩放一个轴。 | |
| Scale | 平面手柄 | 缩放它所跨的两个轴。 | 2.2.39 |
| Scale | 中心方块（`UNIFORM`） | 等比缩放三个轴。 | 2.2.39 |

手柄列表见 `TransformGizmo.Handle`。在透视和正交相机下，gizmo 在屏幕上的大小都保持不变。

<VersionBadge version="2.2.42" label="自" icon="tag" /> 拖动手柄时按右键可以取消拖拽。目标会回到拖拽开始时的位置，并调用更新回调。不在拖动 gizmo 时，右键仍然用于移动相机。

### Gizmo 目标 { #gizmo-targets }

<VersionBadge version="2.2.38" label="自" icon="tag" />

gizmo 可以驱动任何实现了 `com.lowdragmc.lowdraglib2.math.ITransform` 的对象，而不只是 scene object 的 `Transform`。`Transform` 实现了 `ITransform`，原有的 `Transform` 重载仍然保留。

```java
sceneEditor.setTransformGizmoTarget(myTransform, () -> markDirty());
```

当你的对象不是 scene object 时使用它，例如它们的数据必须能在专用服务器上加载，或者它们已有自己的层级结构。你不再需要用一个代理 `Transform` 去镜像它们。

`ITransform` 的 getter 遵循两种不同的规则：

| Getter | 返回 | 规则 |
| --- | --- | --- |
| `position()`、`rotation()` | 世界空间 | 归你所有的快照，可以作为拖拽锚点保存。 |
| `localPosition()`、`localRotation()`、`localScale()` | 局部空间 | 只读视图，可能就是实时字段。不要修改或保存它；通过 setter 修改。 |

没有世界空间缩放：经过旋转父级的世界空间缩放无法表示为相对父级的变换。gizmo 写入世界位置、世界旋转和局部缩放。

世界矩阵来自别处的实现（例如受动画驱动的骨骼）可以拒绝世界空间写入。

::: warning 2.2.38 的二进制不兼容变更
`TransformGizmo#getTargetTransform()` 现在返回 `ITransform` 而不是 `Transform`。针对旧版 LDLib2 编译、调用了它的代码必须重新编译；需要 `Transform` 时请强制转换结果。
:::

## 点击对象 { #clicking-objects }

<VersionBadge version="2.2.39" label="Changed" icon="tag" />

场景中的左键点击按以下顺序分发：

1. gizmo（如果处于激活状态）。
2. 鼠标射线命中其碰撞形状的每个 `ISceneInteractable`，由近到远。
3. 碰撞形状为空的 interactable，按遍历顺序。

第一个 `onMouseClick(ray)` 返回 `true` 时停止分发。有碰撞形状但未被射线命中的 interactable 不会收到点击。

2.2.39 之前，每个 interactable 都会收到每一次点击，结果再合并起来，因此重叠的对象都会认为自己被点击了。
