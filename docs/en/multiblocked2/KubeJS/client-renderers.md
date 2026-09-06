# Script Block Entity Renderers

<VersionBadge version="Minecraft 1.21.1 / MBD2 21.1.1" label="Since" icon="tag" />

A client script can register named render callbacks. A machine state then points at one through the **Custom Script** renderer, and the callback draws whatever it likes with the machine's `PoseStack` and `MultiBufferSource`.

This is the escape hatch for visuals no model or GeckoLib animation can express — a beam, a laser, a projected hologram, a wireframe.

## 1. Register the renderer

`registerCustomRenderers` fires on the client after client scripts finish loading. It is not targeted at a machine.

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

`register(name)` returns a builder; `register(name, callback)` is shorthand for `register(name).onRender(callback)`.

## 2. Point a machine at it

In the machine editor, set a state's renderer to **Custom Script**, choose the registered name from the selector, and fill in the optional `data` compound. The lookup happens per frame, so editing the script and reloading client resources (<kbd>F3</kbd>+<kbd>T</kbd>) takes effect without touching the machine definition.

`data` is free-form NBT handed to the callback, so one script can back several machines:

```js
MBDClientEvents.registerCustomRenderers(event => {
  event.register('mypack:beam', ctx => {
    const height = ctx.data.contains('height') ? ctx.data.getInt('height') : 64
    // draw something `height` blocks tall
  })
})
```

## Builder

| Method | Default | Effect |
| --- | --- | --- |
| `onRender(callback)` | — | Required; a renderer without it draws nothing |
| `viewDistance(blocks)` | `64` | How far from the camera it keeps drawing |
| `renderOffScreen(bool)` | `false` | Draw even when the bounding box is off screen |
| `boundingBox((be, data) => AABB)` | one block | Compute the visible scope per block entity |
| `boundingBoxInflate(x, y, z)` / `(amount)` | — | Grow the default one-block box |
| `infiniteBoundingBox()` | — | Never cull; also sets `renderOffScreen` |

Prefer `boundingBoxInflate` over `infiniteBoundingBox`: the latter forces the machine into the global block-entity list.

## Render context

| Field | Type |
| --- | --- |
| `blockEntity` | The block entity being rendered — **not necessarily a machine**; it can be a proxy part |
| `data` | The `CompoundTag` configured on the renderer instance. Never null |
| `partialTick` | float |
| `poseStack` | A stack of its own, seeded with the current transform |
| `bufferSource` | `MultiBufferSource` |
| `packedLight`, `packedOverlay` | int |

| Method | Returns |
| --- | --- |
| `getPos()` | `BlockPos` |
| `getBlockState()` | `BlockState` |
| `getLevel()` | nullable `Level` |
| `getMachine()` | The `MBDMachine`, or `null` if the block entity is not one |
| `getGameTime()` | `long`, or 0 before the block entity is in a level |

::: warning A renderer that throws is disabled
The first exception is logged with a stack trace and the renderer is skipped for the rest of the session, or until client scripts reload. That is deliberate — a broken script reports once instead of crashing the game or spamming the log sixty times a second. Fix it and reload client scripts to re-enable it.
:::

::: info Pose stack safety
The callback gets its own `PoseStack` seeded with the current transform, so an unbalanced `pushPose` in a script cannot trip vanilla's "Pose stack not empty" check.
:::

## Boundaries

- Client only. Nothing here changes world state; use a [machine event](./event.md) for that.
- `getMachine()` can return `null`. Check it before reading machine state.
- The renderer name lives in the machine definition; renaming it in the script breaks every machine pointing at it, and the selector will show the old name as missing.
- Requires KubeJS: the `custom_script` renderer is registered with `modID = "kubejs"`.
