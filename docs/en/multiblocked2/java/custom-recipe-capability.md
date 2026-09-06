# Custom Recipe Capability

<VersionBadge version="21.1.1" label="MBD2" icon="tag" />

<figure><img src="/assets/multiblocked2/integrations/mekanism.png" alt="Mekanism Chemical Tank editor controls created by a registered custom recipe capability and Trait"><figcaption>Mekanism is a complete in-tree example: typed recipe content is paired with an editor-configurable storage Trait.</figcaption></figure>

`RecipeCapability<T>` defines a kind of recipe content. It owns conversion, copying, editor controls, preview rendering, and recipe-viewer rendering. It does not store anything in a machine; a trait and handler provide that half.

This example adds integer “heat units” (`HU`). It reuses MBD2's `SerializerInteger` because the content is a scalar integer.

## 1. Implement and register the capability

```java
public final class HeatUnitsCapability extends RecipeCapability<Integer> {
    @LDLRegister(name = "heat_units", registry = "mbd2:recipe_capability")
    public static final HeatUnitsCapability CAP = new HeatUnitsCapability();

    private HeatUnitsCapability() {
        super("heat_units", SerializerInteger.INSTANCE);
    }

    @Override
    public Integer createDefaultContent() {
        return 100;
    }

    @Override
    public UIElement createPreview(Supplier<Integer> content) {
        return new Label().bindDataSource(SupplierDataSource.of(() ->
            Component.literal(content.get() + " HU")));
    }

    @Override
    public UIElement createXEITemplate() {
        return new Label().setText("0 HU");
    }

    @Override
    public void bindXEIWidget(UIElement element, Content content, IO io) {
        if (element instanceof Label label) {
            String suffix = content.perTick ? " HU/t" : " HU";
            label.setText(Component.literal(of(content.content) + suffix));
        }
    }

    @Override
    public void createContentConfigurator(
            ConfiguratorGroup father,
            Supplier<Integer> supplier,
            Consumer<Integer> onUpdate) {
        // supplier::get, not supplier — NumberConfigurator takes Supplier<Number>,
        // and Supplier<Integer> is not one.
        father.addConfigurators(new NumberConfigurator(
            "recipe.capability.examplemod.heat_units",
            supplier::get,
            number -> onUpdate.accept(number.intValue()),
            100,
            true
        ).setRange(1, Integer.MAX_VALUE));
    }

    @Override
    public Component getLeftErrorInfo(List<Integer> left) {
        int missing = left.stream().mapToInt(Integer::intValue).sum();
        return Component.literal(missing + " HU");
    }
}
```

The annotation must be on a loaded `public static` field. MBD2 scans it, registers the value under `heat_units`, and then freezes `MBDRegistries.RECIPE_CAPABILITIES`.

Two optional overrides are worth knowing: `xeiLayoutType()` returns `SLOT` or `BAR` and decides where the recipe viewer places the widget, and `calculateAmount(List<T>)` supplies the number a progress display shows. `ArsSourceRecipeCapability` in MBD2's own source is the shortest complete scalar example.

## 2. Understand the serializer contract

For a custom `T`, implement `IContentSerializer<T>`:

| Method | Responsibility |
| --- | --- |
| `of(Object)` | Convert Java/KubeJS/editor input into canonical `T`; reject or define fallback for unsupported types |
| `copyInner(T)` | Cheap copy used during recipe searches |
| `deepCopyInner(T)` | Independent copy for mutation; the default uses the codec |
| `copyWithModifier(T, ContentModifier)` | Apply parallel/chance/tier amount modifiers |
| `codec()` | Persistent recipe encoding |
| `streamCodec()` | Network encoding for registry-friendly buffers |

Mutable content must never return itself from `copyInner` unless all search and handler code treats it as immutable. Scalar serializers may return the same boxed value.

## 3. Use it in Java and KubeJS

```java
recipeType.recipeBuilder(id)
    .input(HeatUnitsCapability.CAP, 400)
    .output(HeatUnitsCapability.CAP, 50)
    .duration(100)
    .saveAsBuiltinRecipe();
```

```js
ServerEvents.recipes(event => {
  const heat = MBDRegistries.RECIPE_CAPABILITIES.get('heat_units')
  if (heat === null) throw new Error('heat_units capability is not registered')

  event.recipes.example.heat_press()
    .id('example:anneal_plate')
    .inputs(heat, 400)
    .outputs(heat, 50)
})
```

`MBDRegistries` is a global KubeJS binding — no `Java.loadClass` needed.

The KubeJS call reaches `RecipeCapability#of`, which delegates to the serializer's `of(Object)`. Make conversion errors explicit; silently returning zero creates recipes that appear valid but do nothing.

## 4. Complete the engine

The capability is usable only after a runtime handler returns it from `getRecipeCapability()`. Continue with [Custom traits](./custom-trait.md) to implement storage and simulate/commit handling.
