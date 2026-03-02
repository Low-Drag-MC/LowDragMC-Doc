# 场景
{{ version_badge("2.2.1", label="Since", icon="tag") }}
`Scene` 在 GUI 元素内呈现交互式 3D Minecraft 世界视图。它使用`WorldSceneRenderer`从`TrackedDummyWorld`绘制一组块。视口支持：
- **拖动以旋转** — 左键单击并拖动以绕相机旋转。- **滚动缩放** — 鼠标滚轮可更改缩放级别。- **块交互** — 单击报告击中块的位置和面。- **FBO 模式** — 以任意分辨率渲染到帧缓冲区对象中。
!!!笔记 ””[UIElement](../element.md){ data-preview } 上记录的所有内容（布局、样式、事件、数据绑定等）也适用于此处。
---

＃＃ 用法
===“Java”
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

===“科特林”
    ```kotlin
    scene({
        world(level)
        blocks(BlockPos.ZERO)
        onSelect { pos, face -> println("Clicked $pos $face") }
    }) { }
    ```

===“KubeJS”
    ```js
    let s = new Scene();
    s.createScene(level);
    s.setRenderedCore([BlockPos.ZERO]);
    s.setOnSelected((pos, face) => { /* ... */ });
    parent.addChild(s);
    ```

---

## 字段
| Name | Type | Access | Description |
| ---- | ---- | ------ | ----------- |
| `renderer` | `WorldSceneRenderer` (nullable) | `private` (getter, client-only) | The underlying scene renderer. |
| `dummyWorld` | `TrackedDummyWorld` (nullable) | `private` (getter) | The virtual world holding rendered blocks. |
| `draggable` | `boolean` | `getter/setter` | Whether the camera can be rotated by dragging. Default: `true`. |
| `scalable` | `boolean` | `getter/setter` | Whether the mouse wheel changes the zoom. Default: `true`. |
| `intractable` | `boolean` | `getter/setter` | Whether block clicks are reported. Default: `true`. |
| `renderFacing` | `boolean` | `getter/setter` | Whether face highlights are drawn. Default: `true`. |
| `renderSelect` | `boolean` | `getter/setter` | Whether selected block highlights are drawn. Default: `true`. |
| `showHoverBlockTips` | `boolean` | `getter/setter` | Whether a tooltip is shown for the hovered block. Default: `false`. |
| `tickWorld` | `boolean` | `getter/setter` | Whether `dummyWorld` is ticked every frame. Default: `true`. |
| `useOrtho` | `boolean` | `private` (getter) | `true` when using orthographic projection. |
| `useCache` | `boolean` | `private` (getter) | `true` when using a cached buffer. |
| `autoReleased` | `boolean` | `private` (getter) | `true` to release renderer resources when removed. Default: `true`. |
| `center` | `Vector3f` | `private` (getter) | Camera look-at target (world space). |
| `rotationPitch` | `float` | `private` (getter) | Camera pitch in degrees. Default: `25`. |
| `rotationYaw` | `float` | `private` (getter) | Camera yaw in degrees. Default: `-135`. |
| `zoom` | `float` | `private` (getter) | Camera distance. Default: `5`. |
| `onSelected` | `BiConsumer<BlockPos, Direction>` | `getter/setter` | Callback invoked when a block is clicked. |
| `lastHoverPosFace` | `BlockPosFace` (nullable) | `private` (getter) | The block/face currently under the mouse. |
| `lastClickPosFace` | `BlockPosFace` (nullable) | `private` (getter) | The block/face that was last clicked. |
| `lastSelectedPosFace` | `BlockPosFace` (nullable) | `private` (getter) | The last selected block/face. |

---

＃＃ 方法
| Method | Returns | Description |
| ------ | ------- | ----------- |
| `createScene(Level)` | `Scene` | Initialises the renderer with the given level (immediate mode). |
| `createScene(Level, boolean, Size)` | `Scene` | Initialises with optional FBO rendering at the given resolution. |
| `setRenderedCore(Collection<BlockPos>)` | `Scene` | Sets the blocks to render; auto-adjusts the camera. |
| `setRenderedCore(Collection<BlockPos>, ISceneBlockRenderHook)` | `Scene` | Sets blocks with a custom render hook. |
| `setRenderedCore(Collection<BlockPos>, ISceneBlockRenderHook, boolean)` | `Scene` | Sets blocks; `autoCamera` controls whether the camera is repositioned. |
| `useCacheBuffer(boolean)` | `Scene` | Enables or disables compiled draw-call cache. |
| `useOrtho(boolean)` | `Scene` | Switches between perspective and orthographic projection. |
| `setOrthoRange(float)` | `Scene` | Sets the orthographic projection range (only effective when ortho is enabled). |
| `setCenter(Vector3f)` | `Scene` | Sets the camera look-at target in world space. |
| `setZoom(float)` | `Scene` | Sets the camera zoom distance. |
| `setCameraYawAndPitch(float yaw, float pitch)` | `Scene` | Sets the camera yaw and pitch immediately. |
| `setCameraYawAndPitchAnima(float yaw, float pitch, int duration)` | `Scene` | Animates the camera to the given yaw and pitch over `duration` ticks. |
| `needCompileCache()` | `void` | Flags the cache as dirty so it is recompiled on the next frame. |
| `releaseRendererResource()` | `void` | Releases GPU resources held by the renderer. |
| `setBeforeWorldRender(Consumer<Scene>)` | `Scene` | Sets a hook called before each world render pass (client-only). |
| `setAfterWorldRender(Consumer<Scene>)` | `Scene` | Sets a hook called after each world render pass. |
