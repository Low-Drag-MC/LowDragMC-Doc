# 代理配方类型

<VersionBadge version="Minecraft 1.21.1 / MBD2 21.0.11" label="当前 API" icon="tag" />

<figure><img src="/assets/multiblocked2/recipes/recipe-type.png" alt="Recipe Type Inspector 中配置代理来源和 Fuel Recipe Types 的区域"><figcaption>代理来源在编辑器中启用；KubeJS 只接收每个转换结果的过滤事件。</figcaption></figure>

配方传输代理把原版或模组 Recipe Type 转换为目标 `MBDRecipeType`。它不是 Trait，也不会自动为机器提供 IO。

## 工作流

1. 在目标 Recipe Type 的编辑器设置中添加 proxy source。
2. 保存并发布 Recipe Type。
3. 用目标 MBD Recipe Type ID 订阅 `onTransferProxyRecipe`。
4. 检查来源 ID、来源配方和初始 `mbdRecipe`。
5. 取消不应导入的配方，或替换转换结果。

```js
// kubejs/server_scripts/mbd2_proxy.js
MBDRecipeTypeEvents.onTransferProxyRecipe('example:electric_furnace', wrapper => {
  const event = wrapper.event

  // 只接受原版 smelting 来源。
  if (`${event.proxyTypeId}` !== 'minecraft:smelting') {
    event.setCanceled(true)
    return
  }

  // 某些来源无法自动转换时 mbdRecipe 可能为 null。
  if (event.mbdRecipe === null) {
    console.warn(`Could not transfer ${event.proxyRecipeId}`)
  }
})
```

| 字段 | 含义 |
| --- | --- |
| `recipeType` | 目标 MBD Recipe Type |
| `proxyTypeId` / `proxyType` | 来源 Recipe Type ID/对象 |
| `proxyRecipeId` / `proxyRecipe` | 来源配方 ID/对象 |
| `mbdRecipe` | 可为 null 的转换结果 |

普通机器 IO 请添加 Trait，并在配方中使用 `slotName`。KubeJS 当前没有公开用于创建完整 proxy 配置的稳定 fluent builder；该部分应由编辑器完成。
