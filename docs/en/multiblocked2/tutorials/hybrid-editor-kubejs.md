# Hybrid Tutorial: Editor Machine with KubeJS Recipes

<VersionBadge version="21.1.1" label="MBD2" icon="tag" />

This is the recommended production workflow for a modpack-friendly machine: the editor owns the complete machine and recipe-type definitions, Java registers those exported products, and KubeJS owns recipes and optional behavior.

<figure>
<img src="/assets/multiblocked2/editor/machine-ui.png" alt="Editor-authored Machine UI used by a Java-registered machine whose recipes are supplied by KubeJS">
<figcaption>In the hybrid workflow the exported project owns this UI, while KubeJS supplies the recipes bound into it.</figcaption>
</figure>

## Ownership model

| Layer | Owner | Why |
| --- | --- | --- |
| Machine states, renderer, Traits, UI, pattern | Editor product registered by Java | Full supported authoring model |
| Recipe-type UI and proxies | Editor `.rt` product registered by Java | Stable viewer/runtime configuration |
| Individual recipes | KubeJS server scripts | Pack authors can reload and override them |
| Special behavior | KubeJS targeted events or Java extension | Choose by complexity and simulation needs |

Do not also call `MBDRegistryEvents.machine.create` or `createRecipeType` for IDs that Java already registers.

## 1. Register only the exported definitions in Java

```java
@Mod(ExampleMod.MOD_ID)
public final class ExampleMod {
    public static final String MOD_ID = "examplemod";

    public ExampleMod(IEventBus modBus) {
        modBus.addListener(MBDContent::registerRecipeTypes);
        modBus.addListener(MBDContent::registerMachines);
    }
}
```

```java
public final class MBDContent {
    public static void registerRecipeTypes(MBDRegistryEvent.MBDRecipeType event) {
        event.registerFromResource(
            ExampleMod.class,
            "examplemod/mbd/recipe_types/crushing.rt"
        );
    }

    public static void registerMachines(MBDRegistryEvent.Machine event) {
        event.registerFromResource(
            ExampleMod.class,
            "single_machine",
            "examplemod/mbd/machines/crusher.sm"
        );
    }
}
```

The `.sm` product must reference the same `examplemod:crushing` ID stored by the `.rt` product.

## 2. Do not create startup definitions in KubeJS

No `MBDRegistryEvents.recipeType` or `MBDRegistryEvents.machine` script is needed. After a full restart, MBD2's KubeJS plugin sees the Java-registered recipe type and generates:

```js
event.recipes.example.crushing()
```

If that builder is absent, fix Java/resource registration first; creating a duplicate KubeJS type would hide the real ownership problem.

## 3. Add pack recipes

```js
// kubejs/server_scripts/examplemod_crushing.js
ServerEvents.recipes(event => {
  event.recipes.example.crushing()
    .id('examplepack:crushing/iron')
    .duration(100)
    .inputItems('#c:ingots/iron')
    .outputItems('9x minecraft:iron_nugget')

  event.recipes.example.crushing()
    .id('examplepack:crushing/wet_copper')
    .duration(160)
    .inputItems('#c:ingots/copper')
    .perTick(r => r.inputFE(40))
    .slotName('water_input', r =>
      r.inputFluids('250x minecraft:water'))
    .outputItems('minecraft:copper_block')
})
```

The machine product must provide item, fluid, and FE handlers matching these contents. `slotName('water_input', ...)` additionally requires a Trait definition whose `slotNames` contains `water_input`; the Trait `name` itself is a different identifier.

## 4. Add behavior only where the recipe engine cannot express it

```js
MBDMachineEvents.onRecipeStatusChanged('examplemod:crusher', wrapper => {
  const { machine, oldStatus, newStatus } = wrapper.event
  console.debug(`${machine.definition.id()}: ${oldStatus} -> ${newStatus}`)
})

MBDMachineEvents.onRecipeWaiting('examplemod:crusher', wrapper => {
  const logic = wrapper.event.machine.recipeLogic
  console.debug(`Crusher waiting: ${logic.waitingReason}`)
})
```

Use recipe conditions for eligibility and Traits/handlers for resource accounting. Events should not duplicate inputs, outputs, simulation, or progress management.

## 5. Reload matrix

| Changed file | Required action |
| --- | --- |
| KubeJS server recipe/event script | `/reload` normally suffices |
| KubeJS startup registry script | Full restart |
| Java class or dependency | Recompile and restart |
| Packaged `.rt`, `.sm`, `.mb` | Rebuild resources and restart |
| Editor working project not yet exported | Export product, then restart registration |

## 6. Acceptance test

1. Start with no startup-script errors.
2. Confirm Java logs load `examplemod:crushing` before `examplemod:crusher`.
3. Give/place `examplemod:crusher`.
4. Confirm UI widgets bind to the authored Traits.
5. Confirm the KubeJS recipe appears in JEI/REI/EMI.
6. Insert all normal inputs and provide per-tick resources.
7. Observe `IDLE -> WORKING -> IDLE` and verify outputs once.
8. `/reload`, change only recipe duration, and confirm the next execution uses the new value.

If a recipe appears but does not run, use the [RecipeLogic search/setup flow](../recipes/recipe-lifecycle.md#search-pipeline) to check conditions, normal output capacity, per-tick IO, and Trait routing in that order.
