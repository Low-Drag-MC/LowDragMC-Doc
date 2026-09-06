# Runtime Recipe Modification

<VersionBadge version="Minecraft 1.21.1 / MBD2 21.1.1" label="Current API" icon="tag" />

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

Read `event.recipe`, copy it with `toBuilder()`, modify the builder, and assign the new `MBDRecipe` back. Never mutate the shared registry recipe. `onBeforeRecipeModify` is cancellable; use `onAfterRecipeModify` to observe the final copy.
