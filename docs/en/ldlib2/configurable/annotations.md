# Annotations

Annotations describe how a field should appear in the generated property UI. `ConfiguratorParser` reads them at runtime and creates configurators under a `ConfiguratorGroup`.

## @Configurable

`@Configurable` marks a field or type as editable.

```java
@Configurable(
        name = "Speed",
        tips = "Blocks per second",
        collapse = false,
        forceUpdate = true
)
public float speed = 1.0f;
```

Common options:

* `name`: label shown in the UI. If empty, the field or class name is used.
* `showName`: hide the label when set to `false`.
* `tips`: tooltip lines.
* `collapse`: initial collapsed state for groups and list-like configurators.
* `canCollapse`: whether the user can collapse the group.
* `forceUpdate`: passed to the created configurator. Use it when edits should immediately update the target.
* `subConfigurable`: treat the field value as a nested object and build its fields.
* `subFlattenConfigurable`: place a nested object's fields directly in the parent group.
* `subFlattenPersisted`: flatten a nested object's serialized data into the parent data.
* `persisted`: include this field in `PersistedParser` serialization. This is `true` by default.

```java
@Configurable(name = "Transform", subConfigurable = true)
public TransformData transform = new TransformData();
```

Because `persisted` defaults to `true`, a `@Configurable` field also behaves like a persisted field for serialization:

```java
public class ShopEntry implements IPersistedSerializable {
    @Configurable(name = "Price")
    public int price = 10; // serialized by PersistedParser

    @Configurable(name = "Preview Only", persisted = false)
    public boolean previewOnly = false; // editor UI only
}
```

Use `@Configurable` when a field should be editable and saved. Use `@Persisted` when it should be saved but does not need editor UI. The serialization behavior is covered in [PersistedParser](../sync/PersistedParser.md){ data-preview }.

## Default Values

`@DefaultValue` is shared by many accessors, not only numbers. It can provide default numbers, strings, or booleans when a configurator needs a fallback value or when an array/list creates a new element.

```java
@Configurable
@DefaultValue(stringValue = "minecraft:stone")
private ResourceLocation texture = ResourceLocation.withDefaultNamespace("stone");

@Configurable
@DefaultValue(booleanValue = true)
private boolean enabled = true;
```

Accessors read the part they support. Number accessors use `numberValue`, string-like accessors use `stringValue`, and boolean accessors use `booleanValue`.

## Numbers

Use `@ConfigNumber` for range and mouse-wheel step.

```java
@Configurable(name = "Scale")
@ConfigNumber(range = {0.1, 8.0}, wheel = 0.1)
@DefaultValue(numberValue = 1.0)
public float scale = 1.0f;
```

## Colors

`@ConfigColor` makes an integer use a color picker.

```java
@Configurable(name = "Tint")
@ConfigColor
public int color = 0xffffffff;
```

`@ConfigHDR` is used by HDR color configurators when the target type supports that path.

## Selectors

Enum fields become selectors automatically. `@ConfigSelector` can limit candidates, limit visible items, or create extra rows based on the selected value.

```java
@Configurable(name = "Mode")
@ConfigSelector(candidate = {"basic", "advanced"}, max = 4)
public Mode mode = Mode.BASIC;
```

For conditional sub-configurators, provide a method name:

```java
@Configurable(name = "Mode")
@ConfigSelector(subConfiguratorBuilder = "buildModeOptions")
public Mode mode = Mode.BASIC;

private void buildModeOptions(Mode mode, ConfiguratorGroup group) {
    if (mode == Mode.ADVANCED) {
        group.addConfigurator(new BooleanConfigurator("Debug", () -> debug, v -> debug = v, false, true));
    }
}
```

## Lists And Arrays

Arrays and collections are displayed with `ArrayConfiguratorGroup`. `@ConfigList` controls add, remove, reorder, default element creation, and custom element UI.

```java
@Configurable(name = "Rewards")
@ConfigList(addDefaultMethod = "newReward", canReorder = true)
public List<Reward> rewards = new ArrayList<>();

private Reward newReward() {
    return new Reward();
}
```

Without `@ConfigList`, LDLib2 still builds a list UI. It finds the element type, finds the element accessor, and creates one child configurator per element. For `List<Boolean>`, each row uses `BooleanAccessor`; for `List<Reward>`, each row needs either a supported accessor, a custom accessor, or a custom item configurator.

`@ConfigList` options:

* `canAdd`: whether the add button is shown.
* `canRemove`: whether rows can be removed.
* `canReorder`: whether rows can be moved.
* `addDefaultMethod`: method on the owner object that creates a new item.
* `configuratorMethod`: method on the owner object that creates the UI for each item.

Use `configuratorMethod` when each list item needs a custom configurator:

```java
@ConfigList(configuratorMethod = "createRewardConfigurator")
public List<Reward> rewards = new ArrayList<>();

private Configurator createRewardConfigurator(Supplier<Reward> getter, Consumer<Reward> setter) {
    return getter.get().createDirectConfigurator();
}
```

The `configuratorMethod` signature must be:

```java
private Configurator methodName(Supplier<T> getter, Consumer<T> setter)
```

The `addDefaultMethod` signature must be:

```java
private T methodName()
```

For nested configurable values, a common pattern is:

```java
@Configurable
@ConfigList(
        configuratorMethod = "buildEntryConfigurator",
        addDefaultMethod = "newEntry"
)
private final List<Entry> entries = new ArrayList<>();

private Configurator buildEntryConfigurator(Supplier<Entry> getter, Consumer<Entry> setter) {
    Entry entry = getter.get();
    return entry == null ? new Configurator() : entry.createDirectConfigurator();
}

private Entry newEntry() {
    return new Entry();
}
```

The generated list configurator owns the add/remove/reorder UI. Your item configurator only needs to edit one element.

## Search Fields

`@ConfigSearch` replaces normal type-based UI with a `SearchComponentConfigurator`. The named method must return `SearchComponentConfigurator.ISearchConfigurator`.

```java
@Configurable(name = "Block")
@ConfigSearch(searchConfiguratorMethod = "createBlockSearch")
public Block block = Blocks.STONE;
```

Use it when a field should be selected from a large dynamic set: blocks, items, recipes, custom registry entries, graph nodes, resources, or any data that is not comfortable as a fixed selector.

The method named by `searchConfiguratorMethod` is called on the owner object. It should return an object that tells the configurator how to find candidates and how to display them.

```java
private SearchComponentConfigurator.ISearchConfigurator<Block> createBlockSearch() {
    return new SearchComponentConfigurator.ISearchConfigurator<>() {
        @Override
        public Block defaultValue() {
            return Blocks.STONE;
        }

        @Override
        public void search(String word, IResultHandler<Block> handler) {
            String lower = word.toLowerCase();
            for (ResourceLocation key : BuiltInRegistries.BLOCK.keySet()) {
                if (key.toString().toLowerCase().contains(lower)) {
                    handler.acceptResult(BuiltInRegistries.BLOCK.get(key));
                }
            }
        }

        @Override
        public String resultText(Block value) {
            return BuiltInRegistries.BLOCK.getKey(value).toString();
        }
    };
}
```

Important methods:

* `defaultValue()`: fallback value used by the configurator.
* `search(String, IResultHandler<T>)`: push matching results into the handler.
* `resultText(T)`: text shown for a selected value or result row.
* `candidateUIProvider()`: optional custom row UI, usually icon plus text.

Search may run while the user types. Keep it responsive, and return quickly if your implementation checks `Thread.currentThread().isInterrupted()`.

## Setters

By default, parsed fields are written directly. Use `@ConfigSetter` when a field needs validation, side effects, or cache updates.

```java
@Configurable
private int size = 16;

@ConfigSetter(field = "size")
private void setSize(int size) {
    this.size = Math.max(1, size);
    rebuildPreview();
}
```

## Headers And Resource Locations

`@ConfigHeader` inserts a section title before the annotated field.

```java
@ConfigHeader("Display")
@Configurable
public String title = "";
```

`@ConfigRL` specializes `ResourceLocation` fields. Built-in modes include font IDs and item, block, entity type, and fluid tag keys.

```java
@Configurable(name = "Font")
@ConfigRL(ConfigRL.Type.FONT)
public ResourceLocation font = ResourceLocation.withDefaultNamespace("default");
```
