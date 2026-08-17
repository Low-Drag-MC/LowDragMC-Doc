# 运行时配方修改

<VersionBadge version="Minecraft 1.21.1 / MBD2 21.0.11" label="当前 API" icon="tag" />

<figure><img src="/assets/multiblocked2/recipes/recipe-type.png" alt="运行时修改前的已注册基础配方"><figcaption>事件只替换当前机器使用的配方副本，不修改此注册基础数据。</figcaption></figure>

```js
MBDMachineEvents.onBeforeRecipeModify('example:crusher', wrapper => {
  const event = wrapper.event
  const upgrades = event.machine.getTraitByName('speed_upgrades')
  if (upgrades === null) return

  const count = upgrades.storage.getStackInSlot(0).count
  if (count <= 0) return

  const builder = event.recipe.toBuilder()
  builder.duration(Math.max(20, Math.ceil(event.recipe.duration * (1 - count * 0.1))))
  event.setRecipe(builder.buildMBDRecipe())
})
```

规则：

1. 读取当前匹配到的 `event.recipe`。
2. 用 `toBuilder()` 创建副本。
3. 修改 builder。
4. 将新 `MBDRecipe` 写回事件。

不要直接修改 registry 中共享的配方对象。`onBeforeRecipeModify` 可取消；`onAfterRecipeModify` 适合观察最终副本或执行不再需要影响匹配的逻辑。
