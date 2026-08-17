# Proxy Recipe Types

<VersionBadge version="Minecraft 1.21.1 / MBD2 21.0.11" label="Current API" icon="tag" />

<figure><img src="/assets/multiblocked2/recipes/recipe-type.png" alt="Recipe Type Inspector area for proxy sources and Fuel Recipe Types"><figcaption>Enable proxy sources in the editor; KubeJS receives a filtering event for each converted result.</figcaption></figure>

A recipe transfer proxy converts a vanilla or mod Recipe Type into the target `MBDRecipeType`. It is not a Trait and does not provide machine IO.

## Workflow

1. Add the proxy source in the target Recipe Type editor settings.
2. Save and publish the Recipe Type.
3. Subscribe to `onTransferProxyRecipe` with the target MBD Recipe Type ID.
4. Inspect the source IDs, source recipe, and initial `mbdRecipe`.
5. Cancel recipes that should not import, or replace the conversion result.

```js
// kubejs/server_scripts/mbd2_proxy.js
MBDRecipeTypeEvents.onTransferProxyRecipe('example:electric_furnace', wrapper => {
  const event = wrapper.event

  // Accept only the vanilla smelting source.
  if (`${event.proxyTypeId}` !== 'minecraft:smelting') {
    event.setCanceled(true)
    return
  }

  // mbdRecipe may be null when a source cannot be converted automatically.
  if (event.mbdRecipe === null) {
    console.warn(`Could not transfer ${event.proxyRecipeId}`)
  }
})
```

| Field | Meaning |
| --- | --- |
| `recipeType` | Target MBD Recipe Type |
| `proxyTypeId` / `proxyType` | Source Recipe Type ID/object |
| `proxyRecipeId` / `proxyRecipe` | Source recipe ID/object |
| `mbdRecipe` | Nullable conversion result |

For normal machine IO, add Traits and use recipe `slotName`. KubeJS does not currently expose a stable fluent builder for complete proxy configuration; author that part in the editor.
