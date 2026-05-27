# Accessors

`IConfiguratorAccessor<T>` is the bridge between a Java type and a configurator UI. When `ConfiguratorParser` finds a normal `@Configurable` field, it asks:

```java
IConfiguratorAccessor accessor = ConfiguratorAccessors.findByType(field.getGenericType());
Configurator configurator = accessor.create(name, getter, setter, forceUpdate, field, owner);
```

The accessor decides whether it supports the field type, supplies a default value, and creates the concrete `Configurator`.

## Built-in Type Families

LDLib2 registers many client accessors in `ldlib2:configurator_accessor`.

Built-in support:

| Type family | Java types | Notes |
| --- | --- | --- |
| Boolean | `boolean`, `Boolean` | Uses a toggle. |
| Numbers | `int`, `long`, `float`, `double`, `short`, `byte` and boxed types | Supports `@ConfigNumber`, `@DefaultValue`, and `@ConfigColor`. |
| String | `String`, `String[]` | `String[]` is edited as multiple string rows. |
| Enum | any enum type | Supports `@ConfigSelector`; `StringRepresentable` names are used when available. |
| Text | `Component` | Component text configurator. |
| Minecraft registry values | `Block`, `Item`, `Fluid`, `EntityType<?>` | Usually backed by registry search/selector UI. |
| Resource IDs | `ResourceLocation` | Supports `@ConfigRL` for font and tag-key modes. |
| Item and fluid stacks | `ItemStack`, `FluidStack` | Uses item/fluid oriented configurators. |
| NBT | `Tag` | Edits raw NBT/tag data. |
| Position and shape | `BlockPos`, `AABB`, `Range` | Uses numeric field groups. |
| LDLib UI data | `Position`, `Size`, `Pivot`, `LengthPercent`, `Translate2D` | Common UI layout/style data types. |
| JOML math | `Vector2f`, `Vector2i`, `Vector3f`, `Vector3i`, `Vector4f`, `Vector4i`, `Quaternionf` | Uses grouped numeric configurators. |
| Scene references | `TransformRef` | Used by scene-editor related data. |
| Render/UI resources | `IGuiTexture`, `IRenderer` | Lets users choose registered implementations and edit their configurable data. |
| Arrays | `T[]` | Dynamic wrapper around the child type's accessor. |
| Collections | `Collection<T>`, usually `List<T>` or `Set<T>` | Dynamic wrapper around the child type's accessor; supports `@ConfigList`. |

Arrays and collections are handled dynamically. LDLib2 finds the child accessor first, then wraps it in `ArrayConfiguratorAccessor` or `CollectionConfiguratorAccessor`.

If a type is not listed here, it can still work when:

* it is inside a field marked `@Configurable(subConfigurable = true)`;
* it has a custom `IConfiguratorAccessor`;
* you build its UI manually in `buildConfigurator(...)`;
* a list uses `@ConfigList(configuratorMethod = "...")` to provide item UI.

## Custom Accessor

Create an accessor when you have a domain type that should always use the same editor control.

```java
@LDLRegisterClient(name = "shop_currency", registry = "ldlib2:configurator_accessor")
public class CurrencyAccessor implements IConfiguratorAccessor<Currency> {
    @Override
    public boolean test(Class<?> type) {
        return type == Currency.class;
    }

    @Override
    public Currency defaultValue(@Nullable Field field, @Nullable Class<?> type) {
        return Currency.EMPTY;
    }

    @Override
    public Configurator create(
            String name,
            Supplier<Currency> supplier,
            Consumer<Currency> consumer,
            boolean forceUpdate,
            @Nullable Field field,
            @Nullable Object owner
    ) {
        return new SelectorConfigurator<>(
                name,
                supplier,
                consumer,
                Currency.EMPTY,
                forceUpdate,
                CurrencyRegistry.getAll(),
                Currency::id
        );
    }
}
```

The registry annotation makes the accessor available to `ConfiguratorAccessors.findByType(...)` on the client.

## Choosing An Extension Point

Use a custom accessor when the mapping is type-wide: every `Currency` should use the same selector.

Use `@ConfigList(configuratorMethod = "...")`, `@ConfigSearch`, or manual `buildConfigurator(...)` when the UI depends on one owner object or one specific field.

Use `@ConfigSetter` when the default UI is fine, but writing the value needs validation or side effects.
