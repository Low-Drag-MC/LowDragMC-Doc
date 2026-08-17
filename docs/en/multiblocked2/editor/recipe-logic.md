# Configuring Recipe Logic

<VersionBadge version="21.0.11" label="MBD2" icon="tag" />

Recipe logic connects one machine definition to one `MBDRecipeType`. It searches only when the machine has compatible handler proxies for recipe content.

<figure>
<img src="/assets/multiblocked2/recipes/recipe-type.png" alt="MBD2 Recipes view showing a recipe type, example recipe, and Fuel Recipe Config in Inspector">
<figcaption>Recipe logic points at a registered recipe type; its fuel configuration and viewer visibility belong to that type.</figcaption>
</figure>

## Settings

| Setting | Effect |
| --- | --- |
| Enable | Creates/uses recipe logic for the machine |
| Recipe type | Registry ID searched by this machine |
| Recipe damping value | Delay/backoff around repeated searches; larger values reduce search frequency |
| Consume inputs after working | Defers normal input consumption until completion; use only when failure/abort behavior is understood |
| Always search recipe | Forces repeated search behavior instead of relying only on handler change notifications |
| Always modify recipe | Runs recipe modification flow consistently; required by upgrade systems using `onBeforeRecipeModify` |
| Recipe modifiers | Apply amount, duration, or parallel transformations configured by machine/part logic |

## Wiring checklist

1. Register or export the recipe type before the machine definition is resolved.
2. Select its exact namespaced ID.
3. Add at least one handler trait for every capability used by candidate recipes.
4. Set handler IO for each recipe direction.
5. Test normal and per-tick content separately.
6. Add `waiting` and `working` states if the visuals should reflect status.
7. Test recipe-viewer lookup from the generated UI.

Conditions are evaluated again while working. A recipe may wait when weather, redstone, rotation, heat, pressure, or another condition changes; this is different from resetting progress unless machine logic explicitly does so.

See [Recipe lifecycle](../recipes/recipe-lifecycle.md) for the execution model.
