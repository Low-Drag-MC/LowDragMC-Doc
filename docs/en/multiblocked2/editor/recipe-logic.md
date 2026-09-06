# Configuring Recipe Logic

<VersionBadge version="21.1.1" label="MBD2" icon="tag" />

Recipe logic connects one machine definition to one `MBDRecipeType`. It searches only when the machine has compatible handler proxies for recipe content.

<figure>
<img src="/assets/multiblocked2/recipes/recipe-type.png" alt="MBD2 Recipes view showing a recipe type, example recipe, and Fuel Recipe Config in Inspector">
<figcaption>Recipe logic points at a registered recipe type; its fuel configuration and viewer visibility belong to that type.</figcaption>
</figure>

## Settings

| Setting | Runtime value key | Effect |
| --- | --- | --- |
| Enable | `recipe_logic.enable` | Whether recipe logic runs at all |
| Recipe type | — | The registry ID this machine searches |
| Recipe damping value | `recipe_logic.damping` | **Progress lost per waiting tick**, floored at zero. `0` freezes progress while waiting |
| Consume inputs after working | `recipe_logic.consume_inputs_after_working` | Defer normal input consumption to completion. Every working tick re-simulates the inputs, and losing them interrupts the recipe |
| Always search recipe | `recipe_logic.always_search` | Force a fresh recipe-type search after each completed recipe instead of reusing the cached one |
| Always modify recipe | `recipe_logic.always_modify` | Re-apply modifiers every cycle. Needed when tier, upgrades or machine data can change the effective recipe between runs |
| Recipe modifiers | — | Amount, duration and parallel transformations applied to the matched recipe |

Every keyed setting is also a [runtime value](./runtime-values.md), so a blueprint, a script or a UI can change it for **one placed machine** without touching the definition.

## Wiring checklist

1. Register or export the recipe type before the machine definition is resolved.
2. Select its exact namespaced ID.
3. Add at least one handler trait for every capability used by candidate recipes.
4. Set handler IO for each recipe direction.
5. Test normal and per-tick content separately.
6. Add `waiting` and `working` states if the visuals should reflect status.
7. Test recipe-viewer lookup from the generated UI.

Conditions are evaluated again while working. A recipe may wait when weather, redstone, rotation, heat, pressure or another condition changes; waiting is not the same as resetting, and how much progress waiting costs is the damping value.

See [Recipe lifecycle](../recipes/recipe-lifecycle.md) for the execution model, and [Blueprints](../blueprints/) for rewriting a matched recipe rather than only scaling it.
