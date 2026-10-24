# 加载、列出与缓存 FX

![由 Photon Provider 解析的项目资源](/assets/photon2/resource-material.webp)

*FX 查询与编辑器 Resource Provider 最终都会从当前 Resource Stack 解析带 Namespace 的文件。*

`FXHelper` 通过 Minecraft 客户端 Resource Manager 解析 `.fx` 文件。

## ID 与资源路径

```text
FX ID:         mymod:combat/hit
资源路径:       assets/mymod/fx/combat/hit.fx
```

传给 API 的 `ResourceLocation` 不包含 `fx/` 前缀和 `.fx` 后缀。

```java
ResourceLocation id = ResourceLocation.fromNamespaceAndPath("mymod", "combat/hit");
FX fx = FXHelper.getFX(id); // 使用 Cache；加载/反序列化失败时为 null
```

`getFX(id, false)` 只为本次调用绕过 Definition Cache，适合诊断或特殊 Reload Flow，不应每 Tick 使用。

请在渲染线程上调用 `getFX`。某个 ID 的第一次调用会当场读取文件并构建定义，这一步可能编译 Shader。首次播放需要的其余内容（Shader 变体、纹理、子发射器生成的特效）在那次播放中加载。想把这些工作全部移出游戏过程，请[预加载](./preloading.md)该特效。

## FX 实例 {#fx-instances}

<VersionBadge version="2.2.9" label="自" icon="tag" />

包含 [FX 实例](../fx-instances.md)的 `.fx` 会在读取时烘焙：`getFX` 按 ID 加载每个源特效，并把其中的对象放进定义。之后 Runtime 里只有普通对象，`findObject` 可以按名字找到放置进来的对象。

- 源特效必须能在运行时按 ID 加载。普通 `.fx` 导出只引用它们；`.fxpack` 导出会把它们打包进去。
- 源特效缺失时什么都不会放置。实例对象仍留在特效中，内容为空，日志中会给出缺失的 ID。
- 源特效与放置它们的特效一起缓存，也一起被遗忘。

## 列出效果

<VersionBadge version="2.2.4" label="资源列表缓存" icon="tag" />

```java
List<ResourceLocation> effects = FXHelper.listAllFX();
```

返回的不可变列表包括 Mod Jar、普通 Resource Pack、编辑器注入资源目录和挂载的 `.fxpack`。它按 Namespace、Path 排序并缓存，因为遍历全部 Pack 的成本很高。

## 清除缓存

```java
int definitionsRemoved = FXHelper.clearCache();
```

Resource Reload 会自动清除 Definition Cache 和 Listing Cache。`clearCache()` 不会销毁已经创建的 Runtime；这些 Runtime 持有自己的对象数据，仍会正常结束或等待显式 Destroy。

<VersionBadge version="2.2.9" label="自" icon="tag" />

```java
FXHelper.invalidate(List.of(id));
```

`invalidate(ids)` 只遗忘给定的特效，以及把其中任何一个作为 FX 实例放置的特效，同时丢弃列表缓存。其他已加载的特效仍留在缓存中。下一次 `getFX` 会重新读取被遗忘的特效。两个方法都会增加 `FXHelper.generation()`；这对预加载特效意味着什么，见[重载与缓存](./preloading.md#reloads-and-the-cache)。

加载失败会返回 `null`，并在 Photon Logger 中记录资源 ID/路径与异常。把 `null` 当作正常的缺失/损坏资源结果处理，尤其是可选 Resource Pack 不存在时。

## FX Pack 挂载

FX Pack 以最低优先级、隐藏的客户端 Resource Pack 挂载。其中的 `assets/<namespace>/fx/...` 对 `getFX()` 与 `listAllFX()` 的行为与 Jar/普通 Pack 完全相同。Mod、Resource Pack 和编辑器的资源目录优先级都更高，它们中谁提供了同一 ID，就使用谁的。

Photon 会挂载：

- 直接放在 `<gameDir>/photon/fxpacks/` 中的 `.fxpack` 文件。子文件夹中的文件不会加载。
- Mod Jar 根目录 `fxpacks/` 下的 `.fxpack` 文件和解压后的 Pack 文件夹。

新的 Pack 文件要到下一次资源重载（F3+T）时才会被发现，与普通 Resource Pack 相同。

<VersionBadge version="2.2.9" label="Changed" icon="tag" />

从 2.2.9 起，编辑器会就地改写已经挂载的 Pack。导出进去或从中移除的特效会立即生效，无需重载：Photon 只遗忘发生变化的特效，下一次 `getFX` 读取的就是新版本，常驻特效也会在后台重新[预加载](./preloading.md)。已经在播放的 Runtime 继续使用创建时的定义。编辑器一侧的操作见[分发与 FX Pack](../distribution.md)。

## 安全持有方式

可以缓存 `ResourceLocation` 或加载的 `FX` Definition，但不要在不检查 `isValid()` 的情况下永久缓存一个 `FXRuntime`。Definition 可跨世界存在，已 Emit 的粒子 Runtime 不可以。
