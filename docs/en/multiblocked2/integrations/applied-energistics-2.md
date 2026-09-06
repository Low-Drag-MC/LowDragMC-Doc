# Applied Energistics 2

<VersionBadge version="21.1.1" label="MBD2" icon="tag" />

AE2 integration adds two machine Traits that participate in an ME network while handling MBD2's existing `item` and `fluid` recipe capabilities. It does not add an `ae2` recipe capability.

<figure>
<img src="/assets/multiblocked2/integrations/ae2.png" alt="MBD2 Machine Traits editor showing AE2 ME Interface item and fluid buffer settings">
<figcaption>The `ae2_me_interface` Trait configuration, including slot count and item/fluid capacity.</figcaption>
</figure>

## Trait comparison

| Trait | Adds | Settings |
| --- | --- | --- |
| `ae2_me_interface` | Managed grid node, interface logic/config/storage, item and fluid recipe handlers | `slotSize`, `itemCapacity`, `fluidCapacity`, IO/sides |
| `ae2_me_pattern_provider` | Channel-requiring grid node, encoded-pattern inventory, input/return buffers, item and fluid recipe handlers | `slotSize`, `patternSize`, `itemCapacity`, `fluidCapacity`, IO/sides |

Each Trait is single-instance. Their definitions declare each other incompatible, so author separate machine variants instead of assuming both can be added in the editor. Both expose `AECapabilities.ME_STORAGE`, `GENERIC_INTERNAL_INV`, and `IN_WORLD_GRID_NODE_HOST` on allowed sides. A side with `IO.NONE` has no cable connection; the pattern provider reports a smart-cable connection otherwise.

## ME Interface workflow

1. Add `ae2_me_interface` and configure slot count and per-key item/fluid capacities.
2. Allow capability IO on the face that receives the cable.
3. Bind the generated `AEInterfaceSlot` widgets (`<trait-ui-id>_0`, `_1`, …) in the machine UI.
4. Use ordinary `item`/`fluid` recipe content. Recipe handlers work against the interface's configured/internal storage.
5. Connect a powered AE2 network and configure interface slots in-game.

```js
ServerEvents.recipes(event => {
  event.recipes.example.network_processor()
    .id('example:network_processing')
    .duration(60)
    .inputItems('minecraft:gold_ingot')
    .inputFluids('100x minecraft:water')
    .outputItems('minecraft:clock')
})
```

## Pattern Provider workflow

Add `ae2_me_pattern_provider`, configure pattern slots and processing-buffer slots, then bind its `AEPatternProviderSlot` UI. Encode an AE2 processing pattern whose inputs and outputs match an MBD recipe. When AE2 pushes a pattern, the integration simulates insertion first, inserts the inputs, and exposes them to the machine's normal item/fluid recipe search. Outputs/returns must fit the provider buffers and return to the network.

The provider node requires a channel. Pattern inventory, processing storage, and return inventory are persisted; breaking the machine adds retained contents to drops before clearing its logic.

## Boundaries and troubleshooting

- Only MBD `item` and `fluid` capabilities have handlers here. FE, chemicals, aura, entities, and custom capabilities do not become pattern-compatible automatically.
- A visible cable does not prove the grid is booted, powered, and has a channel.
- Pattern input may enter correctly while no MBD recipe matches; compare exact item/fluid amounts, recipe type, conditions, and output space.
- `itemCapacity` is limited to 1–64 by the definition; `fluidCapacity` accepts positive integers.
- Test chunk unload/reload, machine break/drop recovery, a full return buffer, and network reconnection.
