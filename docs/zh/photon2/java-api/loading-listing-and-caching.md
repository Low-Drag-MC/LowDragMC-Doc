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

加载失败会返回 `null`，并在 Photon Logger 中记录资源 ID/路径与异常。把 `null` 当作正常的缺失/损坏资源结果处理，尤其是可选 Resource Pack 不存在时。

## FX Pack 挂载

FX Pack 以最低优先级、隐藏的客户端 Resource Pack 挂载。其中的 `assets/<namespace>/fx/...` 对 `getFX()` 与 `listAllFX()` 的行为与 Jar/普通 Pack 完全相同。更高优先级 Pack 可以覆盖同 ID。添加/移除 Pack 后，需要完成对应 Mount/Reload，Resource Manager 与 Cache 才能看到变化。

可以缓存 `ResourceLocation` 或加载的 `FX` Definition，但不要在不检查 `isValid()` 的情况下永久缓存一个 `FXRuntime`。Definition 可跨世界存在，已 Emit 的粒子 Runtime 不可以。
