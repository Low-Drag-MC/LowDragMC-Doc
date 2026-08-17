# Custom Trait and Recipe Handler

<VersionBadge version="21.0.11" label="MBD2" icon="tag" />

<figure><img src="/assets/multiblocked2/integrations/built-in-capabilities.png" alt="Trait definition in the editor list with its generated configuration controls in Inspector"><figcaption>A correctly registered TraitDefinitionType supplies the list entry; its configurable definition supplies the Inspector controls.</figcaption></figure>

A custom recipe capability describes content; a trait supplies machine-local state and a handler that can consume or produce it. MBD2 creates one runtime trait for each `TraitDefinition` attached to a machine.

This page completes the `heat_units` capability from the previous page.

## 1. Define the editor-facing type

```java
@Getter
@Setter
public final class HeatBufferTraitDefinition
        extends RecipeCapabilityTraitDefinition {

    @LDLRegister(
        name = "heat_buffer",
        registry = "mbd2:trait_definition_type",
        group = "trait",
        priority = -100
    )
    public static final TraitDefinitionType<HeatBufferTraitDefinition> TYPE =
        new TraitDefinitionType<>("heat_buffer", "trait") {
            @Override
            public HeatBufferTraitDefinition createDefinition() {
                return new HeatBufferTraitDefinition();
            }
        };

    @Configurable(name = "config.examplemod.heat_buffer.capacity")
    @ConfigNumber(range = {1, Integer.MAX_VALUE})
    private int capacity = 10_000;

    @Override
    public ITrait createTrait(MBDMachine machine) {
        return new HeatBufferTrait(machine, this);
    }

    @Override
    public TraitDefinitionType<?> type() {
        return TYPE;
    }

    @Override
    public IGuiTexture getIcon() {
        return new ItemStackTexture(Items.BLAZE_POWDER);
    }
}
```

`RecipeCapabilityTraitDefinition` already provides editor fields for:

| Field | Runtime effect |
| --- | --- |
| `name` | Stable trait identifier used by scripts and recipe `slotName` |
| `priority` | Ordering among definitions |
| `recipeHandlerIO` | Whether the handler accepts recipe input, output, or both |
| `isDistinct` | Prevents contents of this capability being combined across handlers |
| `slotNames` | Names this handler advertises for targeted recipe content |

Override `allowMultiple()` or `isCompatibleWith(other)` only when duplicates or combinations would be invalid. Return `isMandatory() == true` only for a definition automatically added by a specialized machine type.

## 2. Implement persistent runtime state

```java
@Getter
public final class HeatBufferTrait extends RecipeCapabilityTrait {
    public static final ManagedFieldHolder MANAGED_FIELD_HOLDER =
        new ManagedFieldHolder(HeatBufferTrait.class);

    @Persisted
    @DescSynced
    private int stored;

    private final HeatRecipeHandler recipeHandler = new HeatRecipeHandler();

    public HeatBufferTrait(MBDMachine machine, HeatBufferTraitDefinition definition) {
        super(machine, definition);
    }

    @Override
    public ManagedFieldHolder getFieldHolder() {
        return MANAGED_FIELD_HOLDER;
    }

    @Override
    public HeatBufferTraitDefinition getDefinition() {
        return (HeatBufferTraitDefinition) super.getDefinition();
    }

    public void setStored(int value) {
        int next = Math.clamp(value, 0, getDefinition().getCapacity());
        if (next == stored) return;
        stored = next;
        notifyListeners();
    }

    @Override
    public List<IRecipeHandlerTrait<?>> getRecipeHandlerTraits() {
        return List.of(recipeHandler);
    }
```

`@Persisted` writes the field to the machine block entity. `@DescSynced` includes it in initial/description synchronization. Use the LDLib2 sync annotations appropriate to the field's actual update frequency; persistent data and client-visible data are separate decisions.

## 3. Implement simulate and commit

```java
    private final class HeatRecipeHandler extends RecipeHandlerTrait<Integer> {
        private HeatRecipeHandler() {
            super(HeatBufferTrait.this, HeatUnitsCapability.CAP);
        }

        @Override
        public List<Integer> handleRecipeInner(
                IO io,
                MBDRecipe recipe,
                List<Integer> left,
                @Nullable String slotName,
                boolean simulate) {
            if (!compatibleWith(io)) return left;

            int requested = left.stream().mapToInt(Integer::intValue).sum();
            int handled;

            if (io == IO.IN) {
                handled = Math.min(stored, requested);
                if (!simulate) setStored(stored - handled);
            } else {
                int room = getDefinition().getCapacity() - stored;
                handled = Math.min(room, requested);
                if (!simulate) setStored(stored + handled);
            }

            int remaining = requested - handled;
            return remaining == 0 ? null : List.of(remaining);
        }
    }
}
```

The return value is a protocol:

- `null` means the handler completed all remaining content.
- A non-empty list is passed to later handlers/proxies.
- `simulate == true` must calculate the same result without changing state.
- `simulate == false` runs on the authoritative path and may commit the exact simulated operation.

MBD2 calls `preWorking` when recipe logic enters working and `postWorking` when it leaves. Override those on the handler for reservations or external transactions, not for ordinary scalar storage.

## 4. Add it to a machine

In the editor, add **Heat Buffer**, set a stable trait name such as `heat`, select recipe IO, and set capacity. In Java:

```java
var heat = new HeatBufferTraitDefinition();
heat.setName("heat");
heat.setCapacity(20_000);
heat.setRecipeHandlerIO(IO.BOTH);
heat.getSlotNames().add("main_heat");

machineSettings.addTraitDefinition(heat);
```

A recipe using `.slotName("main_heat")` will only reach handlers advertising that name. The definition's `name` is used by `machine.getTraitByName("heat")`; it is a different concept from `slotNames`.

## 5. Optional UI support

Implement `IUIProviderTrait` on the definition when the editor should generate a widget:

```java
@Override
public TraitUILayoutType getTraitUILayoutType() {
    return TraitUILayoutType.BAR;
}

@Override
public void createTraitUITemplate(UIElement container) {
    container.addChild(new ProgressBar()
        .setId(uiId())
        .layout(layout -> layout.height(14)));
}

@Override
public void initTraitUI(ITrait trait, UI ui) {
    if (!(trait instanceof HeatBufferTrait heat)) return;
    ui.selectId(uiId(), ProgressBar.class).forEach(bar ->
        bar.bind(DataBindingBuilder.floatValS2C(() ->
            (float) heat.getStored() / heat.getDefinition().getCapacity()
        ).build()));
}
```

`uiId()` is `ui:<trait-name>`. Use server-to-client bindings for authoritative values; do not trust a client widget as storage.

## 6. Optional NeoForge block capability

If pipes or another mod must query the trait, extend `SimpleCapabilityTraitDefinition<T, C>` and `SimpleCapabilityTrait<T, C>`. Its nested `Type` registers the block capability on every MBD machine block entity and on proxy parts:

```java
public static final BlockCapability<IHeatStorage, @Nullable Direction> HEAT =
    BlockCapability.createSided(
        ResourceLocation.fromNamespaceAndPath("examplemod", "heat"),
        IHeatStorage.class);

public static final SimpleCapabilityTraitDefinition.Type<
        IHeatStorage, @Nullable Direction, HeatBufferTraitDefinition> TYPE =
    new SimpleCapabilityTraitDefinition.Type<>("heat_buffer", "trait") {
        @Override protected BlockCapability<IHeatStorage, @Nullable Direction> getCapability() {
            return HEAT;
        }

        @Override protected IHeatStorage merge(List<IHeatStorage> values) {
            return new HeatStorageList(values);
        }

        @Override public HeatBufferTraitDefinition createDefinition() {
            return new HeatBufferTraitDefinition();
        }
    };
```

The runtime trait implements `getCapContent(IO capabilityIO)` and returns a wrapper that enforces insertion/extraction direction. `merge` must preserve IO restrictions and simulation semantics when several traits or proxied controller capabilities are combined.

## Runtime lifecycle

`ITrait` provides `onMachineLoad`, `onChunkUnloaded`, `onMachineUnLoad`, `onMachineRemoved`, drop, neighbor-change, `serverTick`, and `clientTick` hooks. Register external listeners/caches on load and release them on unload/removal. Keep gameplay mutation on the server.
