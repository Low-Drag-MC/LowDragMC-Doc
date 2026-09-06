# Accessing Traits

<VersionBadge version="Minecraft 1.21.1 / MBD2 21.1.1" label="Current API" icon="tag" />

Machine events expose the runtime machine. Look a Trait up by the name it was given in the editor, check it exists, then use the API of that Trait's actual Java class — MBD2 has no unified JavaScript storage facade.

```js
MBDMachineEvents.onUseWithoutItem('example:crusher', wrapper => {
  const machine = wrapper.event.machine
  const items = machine.getTraitByName('input_items')
  if (items === null) return

  const first = items.storage.getStackInSlot(0)
  const simulated = items.storage.extractItem(0, 1, true)
  console.info(`${first} / can extract ${simulated} / ${items.storage.slots} slots`)
})
```

| Expression | Gives |
| --- | --- |
| `machine.getTraitByName(name)` | The Trait, or `null` |
| `machine.additionalTraits` | Every Trait on **this** machine, as a Java `List<ITrait>` |
| `trait.definition.name` | A Trait's authored name. There is no `trait.name` |
| `trait.definition` | The editor-side definition, with its configured fields |

## Three different identifiers

| Identifier | Defined on | Used by |
| --- | --- | --- |
| Trait `name` | The Trait definition in the machine project | `getTraitByName(name)`, generated widget ID `ui:<name>` |
| `slotNames` | `RecipeCapabilityTraitDefinition` | Recipe `slotName(...)` routing |
| Capability name | The `RecipeCapability` registry | Recipe content grouping and generic `inputs`/`outputs` |

A Trait named `input_items` can advertise slot names `primary` and `catalyst` while handling the registered `item` capability. The three are not interchangeable.

## Common runtime surfaces

| Trait | Member | Backing API |
| --- | --- | --- |
| `item_slot` | `storage` | `IItemHandler`: `getStackInSlot`, `insertItem`, `extractItem`, `slots` |
| `fluid_tank` | `storages` | A list of fluid tanks |
| `forge_energy_storage` | `storage` | `IEnergyStorage`: `energyStored`, `maxEnergyStored`, `receiveEnergy`, `extractEnergy` |
| `chemical_tank` | `storages` | Mekanism chemical tanks |
| `mek_heat_container` | `container` | Mekanism heat container |
| `pneumatic_pressure_air_handler` | `handler` | PNC air/pressure handler |
| `pneumatic_heat_exchanger` | `handler` | PNC heat exchanger |
| `ars_source_storage` | `storage` | Source buffer |

Exact methods come from the backing Java API and can change with an integration version. Call `insertItem` / `extractItem`, `fill` / `drain`, `receiveEnergy` / `extractEnergy` and respect their `simulate` argument; never edit a returned stack or tank object in place and expect the handler to notice.

## Fail fast while developing

```js
function requireTrait(machine, name) {
  const trait = machine.getTraitByName(name)
  if (trait === null) {
    throw new Error(`Machine ${machine.definition.id()} has no trait named ${name}`)
  }
  return trait
}
```

In a published pack, log once and skip the optional behaviour instead — a renamed Trait would otherwise spam every tick.

## Overriding a Trait's configuration

Every editor setting on a Trait is also a [runtime value](../editor/runtime-values.md), overridable for one placed machine:

```js
const slots = machine.getTraitByName('input_items')
slots.runtimeValues.set('auto_io.enable', true)
slots.runtimeValues.set('auto_io.front', 'OUT')
slots.setAutoIOInterval(10)
slots.clearAutoIO()
```

## Multiblock scope

`additionalTraits` and `getTraitByName` inspect the **current** controller or part only. A formed controller aggregates recipe-logic handlers from its parts during matching, but a script lookup on the controller does not search the parts by name.

For normal controller/part IO, configure Pattern capability proxies, `traitNameFilter`, `capabilityIO` and `autoIO` in the editor. Traverse the part API from JavaScript only for behaviour the proxy system cannot express, and check that the machine is a formed controller first.

## Do not bypass the recipe engine

Direct Trait mutation is right for an explicit interaction or an administrative action. It is usually wrong inside `onRecipeWorking`: the engine already simulates, routes across distinct handlers, applies per-tick content and commits. Consuming the same storage again from an event creates duplication or deficits as soon as more than one handler or proxy exists.

::: warning Server authority
Keep storage mutations on the server. Client events may read synchronised values for rendering, but must not perform authoritative resource changes.
:::
