# Minimal Complete Machine

<VersionBadge version="Minecraft 1.21.1 / MBD2 21.1.1" label="Current API" icon="tag" />

This is the smallest loop KubeJS can create by itself. Use the editor for production states, models, Traits, UI, and multiblock Patterns.

## 1. Register the recipe type and base machine

```js
// kubejs/startup_scripts/mbd2_registry.js
MBDRegistryEvents.recipeType(event => {
  event.createRecipeType('example:crusher')
})

MBDRegistryEvents.machine(event => {
  // The only registered builder keys are single and multiblock.
  event.create('single', 'example:crusher')
})
```

Restart the game. `createRecipeType` registers immediately; queued machine builders are built after all startup handlers finish.

## 2. Add a recipe

```js
// kubejs/server_scripts/mbd2_recipes.js
ServerEvents.recipes(event => {
  event.recipes.example.crusher()
    .id('example:crusher/iron_dust')
    .duration(100)
    .priority(0)
    .inputItems('minecraft:raw_iron')
    .perTick(r => r.inputFE(40))
    .outputItems('2x minecraft:iron_ingot')
})
```

## 3. Add interaction diagnostics

```js
// kubejs/server_scripts/mbd2_events.js
MBDMachineEvents.onUseWithoutItem('example:crusher', wrapper => {
  const machine = wrapper.event.machine
  wrapper.event.player.sendSystemMessage(
    Component.literal(`State: ${machine.machineStateName}`)
  )
})
```

::: warning KubeJS machine registration boundary
`event.create('single', id)` does not generate item/fluid/FE Traits, a Recipe UI, or a model. Finish the definition in the editor and keep the same stable ID for a production pack.
:::
