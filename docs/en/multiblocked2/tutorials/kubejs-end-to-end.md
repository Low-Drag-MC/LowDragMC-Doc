# KubeJS Tutorial: Register Definitions and Add Recipes

<VersionBadge version="21.1.1" label="MBD2" icon="tag" />

This tutorial registers a recipe type and a base machine definition during KubeJS startup, then creates recipes and targeted behavior in server scripts. It also shows the exact point where a KubeJS-only machine reaches its current authoring limit.

<figure>
<img src="/assets/multiblocked2/recipes/recipe-type.png" alt="MBD2 Recipe Type and built-in recipe view corresponding to definitions and recipes registered from KubeJS">
<figcaption>After startup registration, KubeJS recipes target the recipe-type ID represented by this editor project.</figcaption>
</figure>

## Script layout

```text
kubejs/
├─ startup_scripts/
│  └─ mbd2_registry.js
└─ server_scripts/
   ├─ mbd2_recipes.js
   └─ mbd2_events.js
```

Registry definitions must be in `startup_scripts`. Recipes and runtime events belong in `server_scripts`.

## 1. Register a recipe type at startup

Create `kubejs/startup_scripts/mbd2_registry.js`:

```js
MBDRegistryEvents.recipeType(event => {
  const type = event.createRecipeType('example:crushing')
  console.info(`[MBD2] registered recipe type ${type.registryName}`)
})
```

MBD2 registers a KubeJS recipe schema from this ID. The ID mapping is exact:

```text
example:crushing -> event.recipes.example.crushing()
```

Changing this script requires a full game/server restart. `/reload` cannot recreate registries or generated schemas.

## 2. Register a base machine definition

Add to the same startup file:

```js
MBDRegistryEvents.machine(event => {
  event.create('single', 'example:scripted_machine')

  // The other currently registered key is:
  // event.create('multiblock', 'example:scripted_multiblock')
})
```

`single` and `multiblock` are the only supported KubeJS machine type keys in 21.1.1. The event keeps the returned Java builder and calls `build()` after all startup handlers finish.

::: warning This is a registration shell
The public KubeJS API does not configure the complete state machine, renderer, Traits, UI, Recipe Logic, or multiblock Pattern. The shell can register a definition/block, but it has no documented operational item IO and does not automatically reference `example:crushing`. Do not invent fluent builder calls from old examples. Use the [hybrid tutorial](./hybrid-editor-kubejs.md) for a working processing machine.
:::

## 3. Restart and verify startup

Fully restart, then inspect `logs/kubejs/startup.log`. Both messages/errors must be resolved before writing a recipe.

You can query already registered values in their matching startup events:

```js
MBDRegistryEvents.recipeType(event => {
  const type = event.getRecipeType('example:crushing')
  if (type === null) throw new Error('example:crushing was not registered')
})

MBDRegistryEvents.machine(event => {
  const machine = event.getMachine('example:scripted_machine')
  // A builder created earlier in this same event is still pending and is not returned here.
})
```

Do not create the same ID from both Java and KubeJS. Registry ownership should have one source.

## 4. Add recipes in a server script

Create `kubejs/server_scripts/mbd2_recipes.js`:

```js
ServerEvents.recipes(event => {
  event.recipes.example.crushing()
    .id('example:crush_iron')
    .duration(100)
    .priority(0)
    .inputItems('minecraft:iron_ingot')
    .outputItems('9x minecraft:iron_nugget')

  event.recipes.example.crushing()
    .id('example:crush_gold')
    .duration(80)
    .priority(-10) // lower numbers are considered first
    .inputItems('minecraft:gold_ingot')
    .perTick(r => r.inputFE(20))
    .chance(0.25, r => r.outputItems('minecraft:raw_gold'))
    .outputItems('9x minecraft:gold_nugget')
})
```

Rules to keep:

- Always set a namespaced `.id(...)`.
- `duration` is in machine working ticks.
- Lower `priority` values are tried first.
- Callback modifiers such as `perTick(r => ...)` and `chance(value, r => ...)` restore builder state after the callback.
- Optional methods such as `inputFE` require the machine to have a matching Trait/handler; adding content does not create storage.

After the recipe type exists, changes to this server script can use `/reload`.

## 5. Add targeted runtime behavior

Create `kubejs/server_scripts/mbd2_events.js`:

```js
MBDMachineEvents.onRecipeStatusChanged('example:scripted_machine', wrapper => {
  const { machine, oldStatus, newStatus } = wrapper.event
  console.info(`[MBD2] ${machine.definition.id()}: ${oldStatus} -> ${newStatus}`)
})

MBDMachineEvents.onUseWithoutItem('example:scripted_machine', wrapper => {
  const { machine } = wrapper.event
  console.info(`[MBD2] state is ${machine.recipeLogic.status}`)
})
```

The first argument is a machine-definition ID, not a block tag, recipe ID, or recipe-type ID. Keep mutation server-side and avoid heavy work in `onTick`/`onRecipeWorking`.

## 6. Remove or replace a recipe

```js
ServerEvents.recipes(event => {
  event.remove({ id: 'example:crush_gold' })

  event.recipes.example.crushing()
    .id('example:crush_gold_v2')
    .duration(60)
    .inputItems('minecraft:gold_ingot')
    .outputItems('12x minecraft:gold_nugget')
})
```

`removeInputs(capability)` and `removeOutputs(capability)` are builder-content operations; they are not global recipe removal methods.

## Troubleshooting

| Symptom | Cause/check |
| --- | --- |
| `event.recipes.example.crushing` is missing | Startup script failed, ID spelling differs, or no full restart occurred |
| Recipe appears in a viewer but never runs | No operational machine references the type, or matching IO Traits are missing |
| Machine block exists but UI/IO is absent | Expected for a base KubeJS definition; use an editor/Java definition |
| Optional method throws during startup/reload | Integration mod/capability is not registered |
| Event never fires | Wrong target machine ID, wrong side, or an event name not emitted by the base machine |

Continue with the [complete recipe builder reference](../KubeJS/recipe.md) and [machine event reference](../KubeJS/event.md).
