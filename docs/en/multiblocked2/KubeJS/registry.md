# Registry Events

<VersionBadge version="Minecraft 1.21.1 / MBD2 21.0.11" label="Current API" icon="tag" />

<figure><img src="/assets/multiblocked2/integrations/integration-map.png" alt="MBD2 editor menu populated after definition registries are finalized during startup"><figcaption>Startup registry changes become editor-visible only after a restart completes registration.</figcaption></figure>

Registry events run only from `kubejs/startup_scripts`. They change MBD2 definition registries before Minecraft blocks, items, block entities, and generated KubeJS recipe schemas are finalized. A `/reload` is not enough; restart the game/server after changing these scripts.

## Register a recipe type

```js
// kubejs/startup_scripts/mbd2_registry.js
MBDRegistryEvents.recipeType(event => {
  const crusher = event.createRecipeType('example:crusher')
  console.info(`Registered ${crusher.registryName}`)
})
```

`createRecipeType(id)` constructs and immediately registers an `MBDRecipeType`. Its ID becomes the generated recipe schema path:

```js
event.recipes.example.crusher()
```

Prefer exporting a configured `.rt` editor product through Java resource registration when the recipe type needs editor-authored UI, proxy mappings, or other full configuration. The KubeJS function creates the base object; it is not a fluent mirror of every Java/editor setting.

## Register a basic machine definition

```js
MBDRegistryEvents.machine(event => {
  event.create('single', 'example:scripted_machine')
  event.create('multiblock', 'example:scripted_multiblock')
})
```

Supported builder keys in 21.0.11 are exactly:

| Key | Java builder supplied by MBD2 | Result |
| --- | --- | --- |
| `single` | `MBDMachineDefinition.builder()` | Base single-block definition |
| `multiblock` | `MultiblockMachineDefinition.builder()` | Base multiblock definition |

The event stores builders and calls `build()` after every startup handler has run. Creating the same ID twice replaces the pending builder in that event. `kinetic` is not registered; Create's old KubeJS kinetic builder path is disabled in current source.

::: warning Definition completeness
The returned Java builder does not have KubeJS documentation or a supported fluent surface for the entire MBD2 editor model. Use the editor to author states, renderers, traits, UI, recipe logic, and patterns, export `.sm`/`.mb`, then register the product from a Java mod. KubeJS is the supported place for recipes and event behavior around that definition.
:::

## Query and remove

```js
MBDRegistryEvents.recipeType(event => {
  const existing = event.getRecipeType('example:crusher') // object or null
  if (existing !== null) {
    console.info(existing.registryName)
  }

  // Only do this deliberately: generated schema and dependent machines disappear.
  // event.removeRecipeType('example:obsolete')
})

MBDRegistryEvents.machine(event => {
  const existing = event.getMachine('example:crusher') // object or null
  // event.removeMachine('example:obsolete')
})
```

`getMachine` reads already-registered definitions, not a builder still pending in the same event. `removeMachine` removes both a pending builder with that ID and the registered definition. Removal can invalidate editor projects, recipes, blocks, worlds, and scripts, so reserve it for controlled compatibility migrations.

## ID and load-order checklist

1. Always use a namespaced ID such as `example:crusher`.
2. Put registry calls in `startup_scripts`, never `server_scripts`.
3. Restart after changing a registry script.
4. Check `logs/kubejs/startup.log` before debugging recipes.
5. Verify the recipe type exists before calling `event.recipes.example.crusher()`.
6. Keep registry IDs stable after publishing a pack; they are persistent identifiers, not display names.
