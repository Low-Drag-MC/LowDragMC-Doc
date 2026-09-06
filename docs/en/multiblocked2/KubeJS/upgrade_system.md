# Dynamic Recipe Modification

<VersionBadge version="Minecraft 1.21.1 / MBD2 21.1.1" label="Current API" icon="tag" />

Use `onBeforeRecipeModify` to replace the selected runtime recipe for one machine definition. This is the supported route for upgrades that change duration, parallelism, or contents at runtime.

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

Enable the machine's recipe-modification behavior in the editor when using this hook. Always build a new recipe; do not mutate a cached shared recipe.
