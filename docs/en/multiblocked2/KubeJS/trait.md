# Accessing Traits

<VersionBadge version="Minecraft 1.21.1 / MBD2 21.0.11" label="Current API" icon="tag" />

<figure><img src="/assets/multiblocked2/integrations/built-in-capabilities.png" alt="Named machine Traits and the Item Slot fields that KubeJS accesses at runtime"><figcaption>Use the authored Trait name shown in Inspector, then validate the returned runtime Trait's Java type.</figcaption></figure>

Machine events expose the runtime machine. Retrieve a Trait by its editor name, check it exists, then use only the API of that Trait's actual Java class.

```js
MBDMachineEvents.onUseWithoutItem('example:crusher', wrapper => {
  const machine = wrapper.event.machine
  const itemTrait = machine.getTraitByName('input_items')
  if (itemTrait === null) return

  const storage = itemTrait.storage
  const first = storage.getStackInSlot(0)
  // Use storage insert/extract methods; do not mutate ItemStack in place.
})
```

`machine.additionalTraits` contains the runtime Traits attached to that exact machine. Names are configured in the editor; renaming one breaks script lookup and may also break UI bindings.

## Three different identifiers

| Identifier | Defined on | Used by |
| --- | --- | --- |
| Trait `name` | Trait definition in the machine project | `getTraitByName(name)` and UI ID `ui:<name>` |
| `slotNames` | `RecipeCapabilityTraitDefinition` | Recipe `slotName(...)` routing |
| Capability name | `RecipeCapability` registry | Recipe content grouping and generic `inputs/outputs` |

A Trait named `input_items` can expose slot names `primary` and `catalyst` while handling the registered `item` recipe capability. These strings are not interchangeable.

```js
function requireTrait(machine, name) {
  const trait = machine.getTraitByName(name)
  if (trait === null) {
    throw new Error(`Machine ${machine.definition.id()} has no trait named ${name}`)
  }
  return trait
}
```

Use fail-fast lookup during development. In a published pack, log once and skip optional behavior so a renamed Trait does not spam every tick.

## Common Java-backed surfaces

| Trait | Common runtime member | Backing API |
| --- | --- | --- |
| Item slot | `storage` | Item handler insert/extract/query |
| Fluid tank | `storages` | Fluid storage list |
| Forge Energy | `storage` | FE receive/extract/query |
| Mekanism chemical | `storages` | Chemical storage list |
| Mekanism heat | `container` | Heat container |
| Pneumatic air | `handler` | Air/pressure handler |
| Pneumatic heat | `handler` | Heat exchanger |

There is no single MBD2 JavaScript storage interface. Exact methods come from the backing Java API and may vary with an integration version.

## Safe observation and mutation

```js
MBDMachineEvents.onUseWithoutItem('example:charger', wrapper => {
  const { machine } = wrapper.event
  const items = machine.getTraitByName('output')
  const energy = machine.getTraitByName('energy')
  if (items === null || energy === null) return

  const stack = items.storage.getStackInSlot(0)
  const stored = energy.storage.energyStored
  console.info(`${stack} / ${stored} FE`)
})
```

For mutation, call the backing API's `insertItem`/`extractItem`, `fill`/`drain`, or `receiveEnergy`/`extractEnergy` methods and respect their `simulate` argument. Never edit a returned stack/tank object in place and assume the handler notices.

## Multiblock scope

`additionalTraits` and `getTraitByName` inspect the current controller or part only. During recipe matching, a formed controller can aggregate recipe-logic Traits from its parts, but a script lookup on the controller does **not** automatically search every part by name.

For normal controller/part IO, configure Pattern capability proxies, `traitNameFilter`, `capabilityIO`, and `autoIO` in the editor. Traverse the part API from JavaScript only for behavior the proxy system cannot express, and first verify that the machine is a formed multiblock controller.

## Do not bypass the recipe engine

Direct Trait mutation is suitable for explicit interactions or administrative behavior. It is usually wrong in `onRecipeWorking`: the engine already performs simulation, distinct-handler routing, per-tick handling, and commit. Consuming the same storage again from an event creates duplication or deficits when multiple handlers/proxies exist.

::: warning Server authority
Treat Traits as Java runtime objects, not stable JSON. Keep storage mutations on the server. Client events may read synchronized values for rendering but must not perform authoritative resource changes.
:::
