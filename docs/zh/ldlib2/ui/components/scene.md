# Scene

{{ version_badge("2.2.1", label="自", icon="tag") }}

`Scene` 在 GUI 元素内部渲染一个可交互的 3D Minecraft 世界视图。它使用 `WorldSceneRenderer` 从 `TrackedDummyWorld` 中绘制一组方块。该视口支持：

- **拖拽旋转** — 按住左键并拖拽以环绕相机。
- **滚轮缩放** — 鼠标滚轮改变缩放级别。
- **方块交互** — 点击时会报告击中方块的位置和面。
- **FBO 模式** — 以任意分辨率渲染到帧缓冲对象中。

!!! note ""
    [UIElement](element.md){ data-preview } 上记录的所有内容（布局、样式、事件、数据绑定等）同样适用于此处。

---

## 用法

=== "Java"

    ```java
    var scene = new Scene();

    // 根据关卡创建场景：
    scene.createScene(level); // 或 createScene(level, useFBO, size)

    // 填充要渲染的方块：
    var blocks = List.of(BlockPos.ZERO, new BlockPos(1, 0, 0));
    scene.setRenderedCore(blocks);

    // 监听点击事件：
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
| `renderer` | `WorldSceneRenderer` (nullable) | `private` (getter, client-only) | 底层场景渲染器。 |
| `dummyWorld` | `TrackedDummyWorld` (nullable) | `private` (getter) | 保存渲染方块的虚拟世界。 |
| `draggable` | `boolean` | `getter/setter` | 相机是否可通过拖拽旋转。默认值：`true`。 |
| `scalable` | `boolean` | `getter/setter` | 鼠标滚轮是否改变缩放。默认值：`true`。 |
| `intractable` | `boolean` | `getter/setter` | 是否报告方块点击。默认值：`true`。 |
| `renderFacing` | `boolean` | `getter/setter` | 是否绘制面高亮。默认值：`true`。 |
| `renderSelect` | `boolean` | `getter/setter` | 是否绘制选中方块高亮。默认值：`true`。 |
| `showHoverBlockTips` | `boolean` | `getter/setter` | 是否为悬停方块显示悬停提示。默认值：`false`。 |
| `tickWorld` | `boolean` | `getter/setter` | `dummyWorld` 是否每帧 tick。默认值：`true`。 |
| `useOrtho` | `boolean` | `private` (getter) | 使用正交投影时为 `true`。 |
| `useCache` | `boolean` | `private` (getter) | 使用缓存缓冲区时为 `true`。 |
| `autoReleased` | `boolean` | `private` (getter) | 移除时是否释放渲染器资源。默认值：`true`。 |
| `center` | `Vector3f` | `private` (getter) | 相机注视目标（世界空间）。 |
| `rotationPitch` | `float` | `private` (getter) | 相机俯仰角，单位为度。默认值：`25`。 |
| `rotationYaw` | `float` | `private` (getter) | 相机偏航角，单位为度。默认值：`-135`。 |
| `zoom` | `float` | `private` (getter) | 相机距离。默认值：`5`。 |
| `onSelected` | `BiConsumer<BlockPos, Direction>` | `getter/setter` | 点击方块时调用的回调。 |
| `lastHoverPosFace` | `BlockPosFace` (nullable) | `private` (getter) | 当前鼠标下方的方块/面。 |
| `lastClickPosFace` | `BlockPosFace` (nullable) | `private` (getter) | 上次点击的方块/面。 |
| `lastSelectedPosFace` | `BlockPosFace` (nullable) | `private` (getter) | 上次选中的方块/面。 |

---

## 方法

| 方法 | 返回 | 描述 |
| ------ | ------- | ----------- |
| `createScene(Level)` | `Scene` | 使用给定关卡初始化渲染器（立即模式）。 |
| `createScene(Level, boolean, Size)` | `Scene` | 以给定分辨率初始化，可选 FBO 渲染。 |
| `setRenderedCore(Collection<BlockPos>)` | `Scene` | 设置要渲染的方块；自动调整相机。 |
| `setRenderedCore(Collection<BlockPos>, ISceneBlockRenderHook)` | `Scene` | 使用自定义渲染钩子设置方块。 |
| `setRenderedCore(Collection<BlockPos>, ISceneBlockRenderHook, boolean)` | `Scene` | 设置方块；`autoCamera` 控制是否重新定位相机。 |
| `useCacheBuffer(boolean)` | `Scene` | 启用或禁用编译后的绘制调用缓存。 |
| `useOrtho(boolean)` | `Scene` | 在透视投影和正交投影之间切换。 |
| `setOrthoRange(float)` | `Scene` | 设置正交投影范围（仅在启用正交时有效）。 |
| `setCenter(Vector3f)` | `Scene` | 设置世界空间中的相机注视目标。 |
| `setZoom(float)` | `Scene` | 设置相机缩放距离。 |
| `setCameraYawAndPitch(float yaw, float pitch)` | `Scene` | 立即设置相机偏航角和俯仰角。 |
| `setCameraYawAndPitchAnima(float yaw, float pitch, int duration)` | `Scene` | 在 `duration` tick 内将相机动画到给定的偏航角和俯仰角。 |
| `needCompileCache()` | `void` | 将缓存标记为脏，以便在下一帧重新编译。 |
| `releaseRendererResource()` | `void` | 释放渲染器持有的 GPU 资源。 |
| `setBeforeWorldRender(Consumer<Scene>)` | `Scene` | 设置每次世界渲染通道前调用的钩子（仅限客户端）。 |
| `setAfterWorldRender(Consumer<Scene>)` | `Scene` | 设置每次世界渲染通道后调用的钩子。 |