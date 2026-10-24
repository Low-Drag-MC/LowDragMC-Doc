# Runtime Object 与 Transform

![Tornado 项目中经过 Transform 的对象层级](/assets/photon2/editor-tornado-overview.webp)

*Runtime Transform 更新编辑器中看到的存活对象树，不会修改共享 Authored `FX` 定义。*

每个 Runtime 都有一个始终存在的 Empty Root，其 UUID 为 `FXRuntime.ROOT_UUID`。没有显式 Parent 的 Authored Object 会在初始化时挂到 Root 下。

## 查找

```java
IFXObject byId = runtime.getSceneObject(uuid);
IFXObject firstNamed = runtime.findObject("muzzle");
List<IFXObject> allNamed = runtime.findObjects("spark");
IFXObject root = runtime.getRoot();
```

UUID 是 Parent Reference 与 Timeline Target 使用的稳定标识。Name 适合集成标签，但不保证唯一。未知 UUID/Name 返回 `null`，`findObjects` 则返回空列表。

## FX 实例放置的对象 {#objects-placed-by-fx-instances}

<VersionBadge version="2.2.9" label="自" icon="tag" />

[FX 实例](../fx-instances.md)放置的对象是普通的 Runtime 对象。它们挂在实例自己的对象下面，由实例的 Timeline 按实例自己的时钟驱动。

- 放置出来的对象不会保留它们在源特效中的 UUID，所以要按名字查找，不要使用从源特效里抄来的 UUID。
- 如果一个特效放置了同一个源两次，两份副本的名字相同。`findObjects` 会全部返回。
- 移动或缩放实例对象，会像普通父对象一样带动它放置的所有对象。

## 更新 Transform

```java
object.updatePos(new Vector3f(x, y, z));
object.updateRotation(new Quaternionf().rotationXYZ(rx, ry, rz)); // Radian
object.updateScale(new Vector3f(sx, sy, sz));
```

`IFXEffectExecutor.setRotation(x, y, z)` 便捷 Overload 接受 Degree；`IFXObject.updateRotation(Vector3f)` 与 JOML `rotationXYZ` 使用 Radian。混用会导致常见的 57.3 倍旋转错误。

Transform 遵循 Authored Parent Hierarchy。修改 Empty Parent 会影响 Descendant；已出生粒子是否继续跟随，取决于 Local/World/Custom Simulation Space。

## Tick 与 Frame Callback

自定义 Executor 中：

- `updateFXObjectTick` 用于 Lifecycle Check、离散游戏状态和确定性模拟输入。
- `updateFXObjectFrame` 接收 `partialTicks`，用于平滑 Anchor Transform。

两个 Callback 都会为每个 Emit 的 FX Object 调用。只想让逻辑每 Runtime 执行一次时，应检查 `object == runtime.root`。

## 不要修改共享 Config

普通 `FXRuntime` 中的对象持有 Runtime Copy 和命名 `RuntimeValue` Layer，应优先使用这些层。直接修改已加载 `FX` Definition 或 Internal Runtime 会影响后续播放、破坏 Renderer Batching 假设，并与 Timeline Restore 冲突。RuntimeValue 保留 Authored Fallback，使 `clear()` 的行为确定。
