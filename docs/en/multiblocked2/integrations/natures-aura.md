# Nature's Aura

<VersionBadge version="21.0.11" label="MBD2" icon="tag" />

Nature's Aura integration reads and modifies aura in the world around the machine. It is not a private tank or a sided NeoForge storage capability.

<figure>
<img src="/assets/multiblocked2/integrations/natures-aura.png" alt="MBD2 Machine Traits editor showing the Nature's Aura handler radius setting">
<figcaption>The Aura Handler Trait exposes its authored radius alongside common recipe-routing fields.</figcaption>
</figure>

## Added surface

| Layer | Name | Purpose |
| --- | --- | --- |
| Recipe capability | `natures_aura` | Integer aura input/output |
| Trait | `aura_handler` | World-area aura recipe handler and UI provider |
| KubeJS | `inputAura(int)`, `outputAura(int)` | Consume/produce aura |

Add one `aura_handler` Trait; multiple instances are disallowed. Set `radius` from 1 to 64 blocks. Its generated bar UI reads `IAuraChunk.getAuraInArea(level, machinePos, radius)` and displays the current amount.

```js
ServerEvents.recipes(event => {
  event.recipes.example.aura_infuser()
    .id('example:aura_infused_stone')
    .duration(100)
    .perTick(r => r.inputAura(25))
    .inputItems('minecraft:stone')
    .outputItems('minecraft:amethyst_block')
})
```

Input removes aura from the surrounding area; output adds aura. Because the resource is world-facing, nearby Nature's Aura devices and other MBD machines compete for the same environment. Radius changes both the displayed measurement and the handler's effective area.

## Design and test guidance

- Prefer per-tick content for visible gradual drain/production; one-time content is handled at its recipe phase.
- Test at the final world location and biome, not only in editor preview.
- Test two machines with overlapping radii and chunk boundaries.
- Provide the generated aura label in the UI so a stalled recipe is diagnosable.
- Do not document pipes, faces, or a stored capacity: this Trait operates on aura chunks and exposes no ordinary tank.
