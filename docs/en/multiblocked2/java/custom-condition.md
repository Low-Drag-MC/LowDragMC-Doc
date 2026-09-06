# Custom Recipe Condition

<VersionBadge version="21.1.1" label="MBD2" icon="tag" />

A `RecipeCondition` answers whether a recipe may run for one `RecipeLogic`. It should inspect world or machine state without consuming resources or mutating the world.

## Complete example

```java
@Getter
@Setter
@NoArgsConstructor
@LDLRegister(name = "moon_phase", registry = "mbd2:recipe_condition")
public final class MoonPhaseCondition extends RecipeCondition {
    @Configurable(name = "recipe.condition.examplemod.moon_phase")
    @ConfigNumber(range = {0, 7}, type = ConfigNumber.Type.INTEGER)
    private int phase;

    public MoonPhaseCondition(int phase) {
        this.phase = Math.clamp(phase, 0, 7);
    }

    @Override
    public Component getTooltips() {
        return Component.translatable(
            "recipe.condition.examplemod.moon_phase.tooltip", phase);
    }

    @Override
    public IGuiTexture getIcon() {
        return new ItemStackTexture(Items.CLOCK);
    }

    @Override
    public boolean test(MBDRecipe recipe, RecipeLogic logic) {
        return logic.getMachine().getLevel().getMoonPhase() == phase;
    }
}
```

The no-argument constructor is required because the condition registry creates a fresh instance for `PersistedParser`. `@Configurable` fields become editor controls and are encoded by `RecipeCondition.CODEC` through the registered condition type.

## Add it to recipes

```java
builder.addCondition(new MoonPhaseCondition(0));

// Reverse is applied by MBDRecipe, not inside test().
builder.addCondition(new MoonPhaseCondition(4).setReverse(true));
```

For KubeJS, either expose a convenience method in your own integration or pass an instance to the existing `addCondition(condition)` method when the class is allowed to scripts.

## Combination and reverse semantics

- `test(...)` returns the positive condition only. MBD2 compares the result with `isReverse()`.
- `RecipeCondition#isOr()` defaults to `true`. Conditions with the same registered type are grouped as alternatives: at least one must pass.
- Different registered types are combined with AND.
- Override `isOr()` to return `false` when every instance of your condition must pass independently.

For example, two `biome` conditions mean “biome A OR biome B”; a biome condition plus a height condition means “biome matches AND height matches.”

## Failure and side rules

`test` is called during recipe matching and while working conditions are checked. Keep it deterministic and cheap. Do not load chunks, spawn entities, edit NBT, or consume a capability. Use a trait handler or machine event for mutation.
