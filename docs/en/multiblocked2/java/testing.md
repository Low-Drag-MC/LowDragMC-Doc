# Testing Java Extensions

<VersionBadge version="21.0.11" label="MBD2" icon="tag" />

<figure><img src="/assets/multiblocked2/editor/multiblock-pattern.png" alt="Real-client MBD2 editor capture produced by the LDLib2 UI test harness"><figcaption>Use in-client tests for editor registration and interaction; unit tests still cover codecs and handler simulation.</figcaption></figure>

Test a capability and trait together. A codec-only test cannot detect duplication, simulation mutation, wrong IO direction, or a handler that is never discovered by recipe logic.

## Minimum test matrix

| Area | Required cases |
| --- | --- |
| Registration | Registry contains the exact stable name; optional `modID` guard behaves correctly |
| Serialization | Definition, condition, and content codec round-trip without losing fields |
| Trait persistence | Stored value survives block-entity save/load and clamps invalid values |
| Simulation | `simulate=true` returns the correct remainder and changes no state |
| Commit | `simulate=false` changes state once and returns the same remainder as simulation predicted |
| IO | IN consumes machine storage; OUT fills it; incompatible handler IO returns content unchanged |
| Slot routing | Named content reaches only handlers advertising that slot name |
| Multiple handlers | Remainder passes to the next handler; `isDistinct` produces the intended behavior |
| UI/XEI | Template binds without class casts or missing IDs; per-tick and chance annotations display |
| Lifecycle | Caches/listeners are released on unload and removal |

## Direct handler test pattern

```java
var trait = getHeatTrait(machine);
trait.setStored(500);
var handler = trait.getRecipeHandlerTraits().getFirst();

var simulatedLeft = handler.handleRecipe(
    IO.IN, recipe, List.of(400), null, true);
assertNull(simulatedLeft);
assertEquals(500, trait.getStored());

var committedLeft = handler.handleRecipe(
    IO.IN, recipe, List.of(400), null, false);
assertNull(committedLeft);
assertEquals(100, trait.getStored());
```

Also test partial handling: request `700` from a store of `500`, expect `[200]` and a final store of zero on commit.

## Game tests

Use NeoForge game tests for block capability exposure, multiblock proxying, automatic IO, world-dependent conditions, and full recipe-logic transitions. Soft-dependency test classes must only be loaded inside `ModList.isLoaded(...)` guards; annotation discovery can otherwise load absent-mod classes eagerly.
