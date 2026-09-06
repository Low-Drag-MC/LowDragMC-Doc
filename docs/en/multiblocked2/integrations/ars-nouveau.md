# Ars Nouveau

<VersionBadge version="21.1.1" label="Since" icon="tag" />

Ars Nouveau integration adds **Source** as a recipe capability, two ways of paying for it, and a condition that only looks. Source is a plain integer everywhere in Ars Nouveau, so there is nothing to model beyond an amount.

<figure>
<img src="/assets/multiblocked2/integrations/ars-nouveau.png" alt="MBD2 Machine Traits editor showing the Ars Nouveau Source Storage trait with capacity, max receive, max extract and expose-to-devices settings">
<figcaption>The `ars_source_storage` Trait: a Source buffer the machine carries itself.</figcaption>
</figure>

## What is added

| Layer | Registry name | Purpose |
| --- | --- | --- |
| Recipe capability | `ars_source` | Integer Source input/output |
| Trait | `ars_source_storage` | A Source buffer on the machine, exposed as an Ars Nouveau capability |
| Trait | `ars_nearby_source` | Spends the Source in the jars around the machine |
| Condition | `ars_source_nearby` | Checks nearby Source without spending it |
| KubeJS | `inputSource(int)`, `outputSource(int)`, `arsSourceNearbyCondition(radius, min, max)` | |

All entries are conditional on mod ID `ars_nouveau`.

## Two ways to pay

A recipe written against `ars_source` works with either trait. Pick one:

| | `ars_source_storage` | `ars_nearby_source` |
| --- | --- | --- |
| Where Source comes from | A buffer on the machine | Source jars within `radius` |
| Wiring needed | Relays or auto IO fill the buffer | None — drops into an existing jar farm |
| Exposes a capability | Yes, per side | No |
| Auto IO | Yes | No |
| Visible to other Ars devices | With `expose_to_devices` | n/a |

::: warning They are mutually exclusive
`ars_nearby_source` declares itself incompatible with `ars_source_storage`, so a machine can carry one or the other. Both answer the same capability, and with `expose_to_devices` on, the buffer would also be one of the providers the scan counts — a machine holding 60 Source next to no jars would advertise 120 and start a recipe it cannot pay for.

A machine that wants both a buffer *and* a supply from the neighbourhood already has one: the storage trait's auto IO pulls from an adjacent Source Jar.
:::

## Source storage

| Setting | Default | Meaning |
| --- | --- | --- |
| `capacity` | `10000` | Buffer size |
| `maxReceive` / `maxExtract` | `10000` | External transfer limits — not the recipe's cost |
| `exposeToDevices` | on | Whether the rest of Ars Nouveau can see this machine as a Source provider |
| Auto IO, capability IO, fancy renderer | | As for any storage trait |

Structurally this is the Ars Nouveau twin of `forge_energy_storage`, plus the provider registration that makes relays and devices see the machine at all.

## Nearby source

<figure>
<img src="/assets/multiblocked2/integrations/ars-nouveau-nearby.png" alt="MBD2 Inspector showing the Ars Nouveau Nearby Source trait with radius, scan interval and particles settings">
<figcaption>`ars_nearby_source`: how every Ars Nouveau device except the relays works.</figcaption>
</figure>

| Setting | Range | Default | Meaning |
| --- | --- | --- | --- |
| `radius` | 1–64 | `10` | How far to look for jars |
| `scanInterval` | 1–200 | `20` | Ticks between scans |
| `particles` | | on | Draw the take/give particle trail |

::: info Why there is a scan interval
Recipe matching runs on a background executor, and counting jars walks the block entities in range — which is not safe off the game thread. The simulate half answers from a cache the server tick refreshes every `scanInterval` ticks. Lowering it makes the machine react faster and costs a scan more often; raising it does the reverse.

Consequently the trait cannot be optimistic during simulation the way `aura_handler` is: per-tick IO runs whenever the match succeeded, so an optimistic answer would let a per-tick Source cost run for free.
:::

## Recipes

```js
ServerEvents.recipes(event => {
  // spend Source
  event.recipes.example.source_infuser()
    .id('example:source_infused_stone')
    .duration(100)
    .inputSource(250)
    .inputItems('minecraft:stone')
    .outputItems('minecraft:amethyst_block')

  // produce Source
  event.recipes.example.source_infuser()
    .id('example:source_generation')
    .duration(100)
    .inputItems('minecraft:amethyst_shard')
    .outputSource(500)
})
```

Put the content inside `perTick(...)` for a continuous drain, exactly as with FE.

## Condition

```js
ServerEvents.recipes(event => {
  event.recipes.example.source_infuser()
    .id('example:only_when_stocked')
    .duration(100)
    .arsSourceNearbyCondition(8, 500, 10000)   // radius, min, max
    .inputItems('minecraft:stone')
    .outputItems('minecraft:calcite')
})
```

`arsSourceNearbyCondition` **spends nothing**. Use it for a recipe that should only run in a well-stocked area — or, with `setReverse`, only in a depleted one. Its count is taken live rather than from `ars_nearby_source`'s cache, so it works on any machine and never depends on another trait's IO direction.

A recipe that must both check and consume needs the condition **and** `inputSource`.

## Failure checklist

- Trait missing in the editor: Ars Nouveau was absent during registry discovery.
- Recipe never starts with `ars_nearby_source`: check `radius`, and remember the cache is up to `scanInterval` ticks old.
- Other Ars devices ignore the machine: `exposeToDevices` is off, or the machine uses `ars_nearby_source`, which exposes nothing.
- Cannot add both Source traits: expected — see above.
