# Traits and Persistent Data

<VersionBadge version="Minecraft 1.21.1 / MBD2 21.0.11" label="Current API" icon="tag" />

<figure><img src="/assets/multiblocked2/integrations/built-in-capabilities.png" alt="Item, fluid, and energy Traits addressable by name in the machine Inspector"><figcaption>Script names must exactly match each editor Trait definition name.</figcaption></figure>

## Items, fluids, and FE

```js
MBDMachineEvents.onUseWithoutItem('example:processor', wrapper => {
  const machine = wrapper.event.machine
  const items = machine.getTraitByName('input_items')
  const fluids = machine.getTraitByName('coolant')
  const energy = machine.getTraitByName('energy')

  if (items !== null) {
    const simulated = items.storage.extractItem(0, 1, true)
    console.info(`Slot 0 can extract: ${simulated}`)
  }
  if (fluids !== null && fluids.storages.length > 0) {
    console.info(`Tank 0: ${fluids.storages[0].fluid}`)
  }
  if (energy !== null) {
    console.info(`Energy: ${energy.storage.energyStored}/${energy.storage.maxEnergyStored}`)
  }
})
```

Trait names come from the editor. Returned members belong to the concrete Java Trait; MBD2 has no unified JavaScript storage facade.

## Safely update machine custom data

```js
MBDMachineEvents.onUseWithoutItem('example:processor', wrapper => {
  const machine = wrapper.event.machine
  const updated = machine.customData.copy()
  updated.putInt('uses', updated.getInt('uses') + 1)
  machine.setCustomData(updated)
})
```

Copy and call `setCustomData` so persisted/synchronized update listeners run. Do not mutate the old `CompoundTag` reference and assume LDLib2 detects an internal change.

```js
function requireTrait(machine, name) {
  const trait = machine.getTraitByName(name)
  if (trait === null) {
    throw new Error(`Machine ${machine.definition.id()} has no trait '${name}'`)
  }
  return trait
}
```
