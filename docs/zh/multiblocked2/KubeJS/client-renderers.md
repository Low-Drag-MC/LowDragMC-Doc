# 脚本方块实体渲染器

<VersionBadge version="Minecraft 1.21.1 / MBD2 21.1.1" label="Since" icon="tag" />

客户端脚本可以注册命名的渲染回调。机器状态再通过 **Custom Script** 渲染器指向其中一个，回调就能用机器的 `PoseStack` 和 `MultiBufferSource` 画任意东西。

这是模型和 GeckoLib 动画都表达不了的视觉效果的出口——光束、激光、投影全息、线框。

## 1. 注册渲染器

`registerCustomRenderers` 在客户端脚本加载完成后触发，它不针对某台机器。

```js
// kubejs/client_scripts/mbd2_renderers.js
const BeaconRenderer = Java.loadClass('net.minecraft.client.renderer.blockentity.BeaconRenderer')

MBDClientEvents.registerCustomRenderers(event => {
  event.register('mypack:beam', ctx => {
    BeaconRenderer.renderBeaconBeam(ctx.poseStack, ctx.bufferSource, BeaconRenderer.BEAM_LOCATION,
      ctx.partialTick, 1, ctx.gameTime, 0, 256, ctx.data.getInt('color'), 0.2, 0.25)
  }).viewDistance(256).boundingBoxInflate(0, 256, 0)
})
```

`register(name)` 返回一个 builder；`register(name, callback)` 是 `register(name).onRender(callback)` 的简写。

## 2. 让机器指向它

在机器编辑器里把某个状态的渲染器设为 **Custom Script**，从下拉里选择已注册的名字，并填写可选的 `data` 复合标签。查找是逐帧进行的，所以改完脚本重载客户端资源（<kbd>F3</kbd>+<kbd>T</kbd>）即可生效，不用动机器定义。

`data` 是交给回调的自由格式 NBT，所以一份脚本可以服务多台机器：

```js
MBDClientEvents.registerCustomRenderers(event => {
  event.register('mypack:beam', ctx => {
    const height = ctx.data.contains('height') ? ctx.data.getInt('height') : 64
    // draw something `height` blocks tall
  })
})
```

## Builder

| 方法 | 默认 | 效果 |
| --- | --- | --- |
| `onRender(callback)` | — | 必填；没有它的渲染器什么都不画 |
| `viewDistance(blocks)` | `64` | 距摄像机多远仍然绘制 |
| `renderOffScreen(bool)` | `false` | 包围盒离开屏幕后仍然绘制 |
| `boundingBox((be, data) => AABB)` | 一个方块 | 逐方块实体计算可见范围 |
| `boundingBoxInflate(x, y, z)` / `(amount)` | — | 在默认单方块盒上外扩 |
| `infiniteBoundingBox()` | — | 从不剔除；同时打开 `renderOffScreen` |

优先用 `boundingBoxInflate` 而不是 `infiniteBoundingBox`：后者会把机器塞进全局方块实体列表。

## 渲染上下文

| 字段 | 类型 |
| --- | --- |
| `blockEntity` | 正在渲染的方块实体——**不一定是机器**，也可能是代理部件 |
| `data` | 渲染器实例上配置的 `CompoundTag`，永不为 null |
| `partialTick` | float |
| `poseStack` | 一份独立的栈，已经带上当前变换 |
| `bufferSource` | `MultiBufferSource` |
| `packedLight`、`packedOverlay` | int |

| 方法 | 返回 |
| --- | --- |
| `getPos()` | `BlockPos` |
| `getBlockState()` | `BlockState` |
| `getLevel()` | 可空的 `Level` |
| `getMachine()` | `MBDMachine`，方块实体不是机器时返回 `null` |
| `getGameTime()` | `long`，方块实体还没进入世界时为 0 |

::: warning 抛异常的渲染器会被禁用
第一次异常会带堆栈记录下来，随后该渲染器在本次会话（或直到客户端脚本重载）内被跳过。这是有意的——坏脚本报告一次，而不是让游戏崩溃或每秒刷六十条日志。修好后重载客户端脚本即可恢复。
:::

::: info PoseStack 安全性
回调拿到的是一份独立的、已带当前变换的 `PoseStack`，所以脚本里不配对的 `pushPose` 不会触发原版的 "Pose stack not empty" 检查。
:::

## 边界

- 仅客户端。这里不改变世界状态，需要改就用[机器事件](./event.md)。
- `getMachine()` 可能返回 `null`，读机器状态之前先判断。
- 渲染器名字保存在机器定义里；在脚本里改名会让所有指向它的机器失效，下拉框会把旧名字显示为缺失。
- 需要 KubeJS：`custom_script` 渲染器是以 `modID = "kubejs"` 注册的。
