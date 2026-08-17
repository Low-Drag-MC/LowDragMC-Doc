# 动态修改配方

<VersionBadge version="Minecraft 1.21.1 / MBD2 21.0.11" label="当前 API" icon="tag" />

<figure><img src="/assets/multiblocked2/recipes/recipe-type.png" alt="KubeJS 可为单个运行时机器复制并修改的基础配方"><figcaption>运行时升级 hook 替换所选配方的副本，不会修改此已注册基础配方。</figcaption></figure>

使用 `onBeforeRecipeModify` 为一个机器定义替换选中的运行时配方。这是实现升级系统在运行时更改时长、并行数或内容的支持方式。

```js
MBDMachineEvents.onBeforeRecipeModify('example:crusher', event => {
  const mbd = event.event
  const upgrades = mbd.machine.getTraitByName('upgrades')
  if (upgrades === null) return

  const count = upgrades.storage.getStackInSlot(0).count
  const builder = mbd.recipe.toBuilder()
  builder.duration(Math.max(20, Math.ceil(mbd.recipe.duration * (1 - count * 0.01))))
  mbd.setRecipe(builder.buildMBDRecipe())
})
```

使用此钩子时，请在编辑器中启用机器的配方修改行为。始终构建新配方；不要修改缓存的共享配方。
