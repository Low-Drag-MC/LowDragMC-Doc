# Recipe System

<VersionBadge version="21.1.1" label="MBD2" icon="tag" />

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
| `slotName` | Limit handling to Traits advertising that slot name |
| `uiName` | Bind display to a named recipe-viewer widget |

`duration` defaults to `100` ticks in the KubeJS builder. `priority` orders candidates — **lower values are tried first**. Use [KubeJS recipes](../KubeJS/recipe.md) for runnable builder examples.

## Conditions and custom data

Conditions are evaluated before work begins and again while the recipe works. Recipe custom data is an NBT compound available to machine logic, blueprints and event integrations; it does not create a Trait or change behaviour on its own.

## Changing a recipe at runtime

| Want | Use |
| --- | --- |
| Scale amounts, duration or parallel | Recipe modifiers on the machine's [recipe logic](../editor/recipe-logic.md) |
| Change **what** a recipe trades | A [blueprint](../blueprints/) on `Recipe Modify (Before)`, or [KubeJS](../KubeJS/upgrade_system.md) |
| Reject a candidate | A `RecipeCondition`, not an event |

Next: [Capabilities and conditions](./capabilities-and-conditions.md).
