# Built-in Resource Capabilities

<VersionBadge version="21.1.1" label="MBD2" icon="tag" />

These five capabilities require no optional mod. They are also the reference model for understanding external integrations.

<figure>
<img src="/assets/multiblocked2/integrations/built-in-capabilities.png" alt="MBD2 Machine Traits editor listing item, fluid, Forge Energy, and entity handlers with Item Slot settings in Inspector">
<figcaption>Built-in handlers in the Trait list and the editor-generated Item Slot configuration.</figcaption>
</figure>

## Exact mapping

| Recipe capability | Machine Trait | KubeJS methods | Runtime meaning |
| --- | --- | --- | --- |
| `item` | `item_slot` | `inputItems`, `outputItems` | Consume/insert item stacks |
| `item_durability` | `item_slot` | `inputItemsDurability`, `outputItemsDurability` | Damage/repair an existing damageable item |
| `fluid` | `fluid_tank` | `inputFluids`, `outputFluids` | Drain/fill NeoForge fluids |
| `forge_energy` | `forge_energy_storage` | `inputFE`, `outputFE` | Extract/receive integer FE |
| `entity` | `entity_handler` | `inputEntities`, `outputEntities` | Match/remove or spawn entities in a configured AABB |

`IO.IN` always means the recipe takes something from the machine-side handler; `IO.OUT` gives something to it. For `item_durability`, that means input **adds damage** and output **removes damage**.

## Item and durability

Add `item_slot`. Configure `slotSize`, `slotLimit`, whether equal items may occupy multiple slots, item/tag filtering, and the three independent directions of access:

- **Recipe IO** decides whether recipes may consume from or produce into this Trait.
- **GUI IO** decides whether players may place/take stacks in its bound widgets.
- **Capability IO / auto IO** decides what adjacent automation can see and whether the machine actively pulls/pushes.

The Trait exposes NeoForge `Capabilities.ItemHandler.BLOCK`. Generated widget IDs are `<trait-ui-id>_0`, `_1`, and so on. If two item Traits exist, assign names and route recipe content with `slotName`; otherwise any compatible handler may satisfy it.

Durability content does not consume the tool stack. The item must already be present, match the ingredient, and be damageable. Requesting 10 durability as input raises its damage value by up to 10; requesting 10 as output repairs up to 10 existing damage.

## Fluid

Add `fluid_tank`. `tankSize` creates independent tanks and `capacity` applies to each tank. Configure same-fluid behavior, fluid/tag filters, recipe/GUI/capability IO, active world IO speed/range, and optional in-world fluid rendering.

The Trait exposes `Capabilities.FluidHandler.BLOCK`. Fluid amounts are in the units accepted by `SizedFluidIngredient`; use explicit amounts in scripts.

## Forge Energy

Add `forge_energy_storage`. `capacity` is stored energy; `maxReceive` and `maxExtract` limit external transfers. They are not the recipe's per-tick cost. Set recipe content as per-tick when power should be drawn every working tick.

The Trait exposes `Capabilities.EnergyStorage.BLOCK`. Recipe `IN` extracts from storage and recipe `OUT` receives into it. A full output buffer can therefore block recipe completion.

## Entity

Add `entity_handler` and configure its AABB relative to the machine, transformed by front facing. Input handlers rescan alive entities every 20 server ticks. Input content matches entities in that cached area and removes matched entities during real execution; output content creates entities and places them in the area.

Entity handlers expose no ordinary item/fluid-style storage capability. Plan for the one-second scan cadence and protect spawn areas from obstruction or unintended mobs.

## Complete KubeJS example

```js
ServerEvents.recipes(event => {
  event.recipes.example.assembler()
    .id('example:charged_cutting')
    .duration(100)
    .inputItems('2x minecraft:iron_ingot')
    .inputItemsDurability('1x minecraft:diamond_pickaxe')
    .inputFluids('250x minecraft:water')
    .perTick(r => r.inputFE(40))
    .outputItems('minecraft:iron_block')
})
```

The machine definition must contain compatible `item_slot`, `fluid_tank`, and `forge_energy_storage` Traits. This builder does not add them.

## Acceptance test

Test each handler with recipe simulation first, then real execution. Verify insufficient input refuses to start, full output waits instead of deleting output, per-tick shortage pauses/stops according to RecipeLogic, side configuration matches external automation, and contents survive a world restart.
