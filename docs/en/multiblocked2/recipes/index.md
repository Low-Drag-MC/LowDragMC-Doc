# Recipe System

<VersionBadge version="21.0.11" label="MBD2" icon="tag" />

An `MBDRecipeType` groups MBD recipes. A machine selects one recipe type; recipe logic finds a matching recipe by asking its traits to handle each input and output capability.

<figure>
<img src="/assets/multiblocked2/recipes/recipe-type.png" alt="MBD2 Recipes editor showing the recipe type, a built-in wiki_smelting recipe, and recipe-type Inspector fields">
<figcaption>A Recipe Type project owns its built-in recipes, fuel settings, proxy sources, and viewer visibility.</figcaption>
</figure>

## Recipe contents

Each entry has a direction (`input` or `output`) and a `RecipeCapability`. Entries can also be:

| Field | Meaning |
| --- | --- |
| `perTick` | Consume or produce while the recipe works instead of at its boundary |
| `chance` | Base probability for this entry |
| `tierChanceBoost` | Additional probability per machine level |
| `slotName` | Limit handling to the named trait |
| `uiName` | Bind display to a named recipe-viewer UI widget |

`duration` defaults to `100` ticks in the KubeJS builder. `priority` orders candidate recipes. Use [KubeJS recipes](../KubeJS/recipe.md) for runnable builder examples.

## Conditions and custom data

Conditions are evaluated by recipe logic before work begins. Recipe custom data is an NBT compound available to machine logic and event integrations; it does not create a trait or automatically change behavior.

Next: [Capabilities and conditions](./capabilities-and-conditions.md).
