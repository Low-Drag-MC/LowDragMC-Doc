# Traits and Persistent Data

<VersionBadge version="Minecraft 1.21.1 / MBD2 21.1.1" label="Current API" icon="tag" />

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

Copy and call `setCustomData` so the persisted and synchronised update listeners run. Do not mutate the old `CompoundTag` reference and assume LDLib2 notices.

Custom data is `@DescSynced`, so it is also the channel for anything the **client** has to see — a value a UI draws, for instance. [Runtime values](../../editor/runtime-values.md) are not synced and cannot be used for that.

## Override a Trait's configuration for one machine

```js
MBDMachineEvents.onPlaced('example:processor', wrapper => {
  const machine = wrapper.event.machine
  const items = machine.getTraitByName('input_items')
  if (items === null) return

  // this placed machine only; saved with the block, never sent to clients
  items.setAutoIOEnabled(true)
  items.setAutoIOSide('up', IO.IN)
  items.setAutoIOInterval(10)
  machine.setMachineLevel(2)
})
```

See [Runtime values](../../editor/runtime-values.md) for every key and the string-addressed form.

## Fail fast in development

```js
function requireTrait(machine, name) {
  const trait = machine.getTraitByName(name)
  if (trait === null) {
    throw new Error(`Machine ${machine.definition.id()} has no trait '${name}'`)
  }
  return trait
}
```
