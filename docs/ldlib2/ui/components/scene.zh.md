# Scene

{{ version_badge("2.2.1", label="Since", icon="tag") }}

`Scene` 在 GUI 元素内渲染一个可交互的 3D Minecraft 世界视图。它使用 `WorldSceneRenderer` 从 `TrackedDummyWorld` 中绘制一组方块。视口支持：

- **拖拽旋转** — 左键拖拽以环绕相机。
- **滚轮缩放** — 鼠标滚轮改变缩放级别。
- **方块交互** — 点击时报告命中的方块位置和面。
- **FBO 模式** — 以任意分辨率渲染到帧缓冲对象。

!!! note ""
    [UIElement](../element.md){ data-preview } 中记录的所有内容（布局、样式、事件、数据绑定等）同样适用于此组件。

---

## 使用方法

=== "Java"

    ```java
    var scene = new Scene();

    // Create the scene from a level:
    scene.createScene(level); // or createScene(level, useFBO, size)

    // Populate blocks to render:
    var blocks = List.of(BlockPos.ZERO, new BlockPos(1, 0, 0));
    scene.setRenderedCore(blocks);

    // Listen for clicks:
    scene.setOnSelected((pos, face) ->
        System.out.println("Clicked " + pos + " face " + face)
    );

    parent.addChild(scene);
    ```

=== "Kotlin"

    ```kotlin
    scene({
        world(level)
        blocks(BlockPos.ZERO)
        onSelect { pos, face -> println("Clicked $pos $face") }
    }) { }
    ```

=== "KubeJS"

    ```js
    let s = new Scene();
    s.createScene(level);
    s.setRenderedCore([BlockPos.ZERO]);
    s.setOnSelected((pos, face) => { /* ... */ });
    parent.addChild(s);
    ```

---

## 字段

| 名称 | 类型 | 访问权限 | 描述 |
| ---- | ---- | ------ | ----------- |
| `renderer` | `WorldSceneRenderer`（可空） | `private`（getter，仅客户端） | 底层场景渲染器。 |
| `dummyWorld` | `TrackedDummyWorld`（可空） | `private`（getter） | 存放渲染方块的虚拟世界。 |
| `draggable` | `boolean` | `getter/setter` | 是否可通过拖拽旋转相机。默认值：`true`。 |
| `scalable` | `boolean` | `getter/setter` | 是否可通过鼠标滚轮改变缩放。默认值：`true`。 |
| `intractable` | `boolean` | `getter/setter` | 是否报告方块点击事件。默认值：`true`。 |
| `renderFacing` | `boolean` | `getter/setter` | 是否绘制面高亮。默认值：`true`。 |
| `renderSelect` | `boolean` | `getter/setter` | 是否绘制选中方块高亮。默认值：`true`。 |
| `showHoverBlockTips` | `boolean` | `getter/setter` | 是否显示悬停方块的工具提示。默认值：`false`。 |
| `tickWorld` | `boolean` | `getter/setter` | 是否每帧更新 `dummyWorld`。默认值：`true`。 |
| `useOrtho` | `boolean` | `private`（getter） | 使用正交投影时为 `true`。 |
| `useCache` | `boolean` | `private`（getter） | 使用缓存缓冲区时为 `true`。 |
| `autoReleased` | `boolean` | `private`（getter） | 移除时自动释放渲染器资源时为 `true`。默认值：`true`。 |
| `center` | `Vector3f` | `private`（getter） | 相机观察目标（世界坐标）。 |
| `rotationPitch` | `float` | `private`（getter） | 相机俯仰角（度）。默认值：`25`。 |
| `rotationYaw` | `float` | `private`（getter） | 相机偏航角（度）。默认值：`-135`。 |
| `zoom` | `float` | `private`（getter） | 相机距离。默认值：`5`。 |
| `onSelected` | `BiConsumer<BlockPos, Direction>` | `getter/setter` | 点击方块时调用的回调。 |
| `lastHoverPosFace` | `BlockPosFace`（可空） | `private`（getter） | 当前鼠标悬停的方块/面。 |
| `lastClickPosFace` | `BlockPosFace`（可空） | `private`（getter） | 上次点击的方块/面。 |
| `lastSelectedPosFace` | `BlockPosFace`（可空） | `private`（getter） | 上次选中的方块/面。 |

---

## 方法

| 方法 | 返回值 | 描述 |
| ------ | ------- | ----------- |
| `createScene(Level)` | `Scene` | 使用给定的 Level 初始化渲染器（立即模式）。 |
| `createScene(Level, boolean, Size)` | `Scene` | 使用可选的 FBO 渲染和指定分辨率进行初始化。 |
| `setRenderedCore(Collection<BlockPos>)` | `Scene` | 设置要渲染的方块；自动调整相机。 |
| `setRenderedCore(Collection<BlockPos>, ISceneBlockRenderHook)` | `Scene` | 设置方块并指定自定义渲染钩子。 |
| `setRenderedCore(Collection<BlockPos>, ISceneBlockRenderHook, boolean)` | `Scene` | 设置方块；`autoCamera` 控制是否重新定位相机。 |
| `useCacheBuffer(boolean)` | `Scene` | 启用或禁用编译的绘制调用缓存。 |
| `useOrtho(boolean)` | `Scene` | 在透视投影和正交投影之间切换。 |
| `setOrthoRange(float)` | `Scene` | 设置正交投影范围（仅在正交模式启用时生效）。 |
| `setCenter(Vector3f)` | `Scene` | 设置相机在世界坐标中的观察目标。 |
| `setZoom(float)` | `Scene` | 设置相机缩放距离。 |
| `setCameraYawAndPitch(float yaw, float pitch)` | `Scene` | 立即设置相机的偏航角和俯仰角。 |
| `setCameraYawAndPitchAnima(float yaw, float pitch, int duration)` | `Scene` | 在 `duration` tick 内将相机动画过渡到指定的偏航角和俯仰角。 |
| `needCompileCache()` | `void` | 将缓存标记为脏，以便在下一帧重新编译。 |
| `releaseRendererResource()` | `void` | 释放渲染器持有的 GPU 资源。 |
| `setBeforeWorldRender(Consumer<Scene>)` | `Scene` | 设置在每次世界渲染通道之前调用的钩子（仅客户端）。 |
| `setAfterWorldRender(Consumer<Scene>)` | `Scene` | 设置在每次世界渲染通道之后调用的钩子。 |
