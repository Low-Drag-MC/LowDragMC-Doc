# Type Handles

`TypeHandle` is NGT's serializable type identity.

Ports, variables, constants, options, icons, colors, default values, and value editors all use it. A handle stores a stable string id, then resolves the runtime Java type and editor metadata through `TypeHandleHelpers`.

## Create Handles

Use `fromType(...)` for ordinary Java types:

```java
TypeHandle floatType = TypeHandleHelpers.fromType(Float.class);
TypeHandle directionType = TypeHandleHelpers.fromType(Direction.class);
```

Primitive classes are converted to wrappers, so `float.class` and `Float.class` resolve to the same kind of handle.

Use `customType(...)` when the graph needs a named type that does not map cleanly to a Java class, or when you want a stable custom id:

```java
TypeHandle damageType = TypeHandleHelpers.customType(
        DamageProfile.class,
        "mymod:damage_profile",
        "Damage Profile"
);
```

The `uniqueId` must stay stable. It is serialized in graph data, ports, variables, constants, and options.

## TypeHandle API

| Method | Use |
| ------ | --- |
| `getIdentification()` | Serialized id string. |
| `getName()` | Resolved type name, or custom id for custom handles. |
| `getFriendlyName()` | Human-readable name shown in UI. |
| `resolve()` | Runtime Java `Type`. |
| `getIcon()` | UI icon for this type. |
| `getTypeColor()` | Color used by ports and type UI. |
| `getDefaultValue()` | Default value supplier result. |
| `resolveConfigurable()` | Value editor factory. |
| `isAssignableFrom(TypeHandle)` | Type compatibility helper. |
| `isCustomTypeHandle()` | Whether the handle came from custom registration. |

## Built-in Handles

Built-in handles live in `TypeHandles`.

| Handle | Use |
| ------ | --- |
| `BOOL` | Boolean values. |
| `FLOAT`, `DOUBLE`, `INT`, `LONG` | Numeric values. |
| `STRING` | Text values. |
| `COLOR` | Integer color with color configurator. |
| `DIRECTION` | Minecraft direction. |
| `BLOCK`, `ITEM`, `FLUID` | Minecraft registry values. |
| `ENTITY_TYPE` | Entity type values. |
| `ITEM_STACK`, `FLUID_STACK` | Stack values. |
| `EXECUTION_FLOW` | Flow-only ports. |
| `SUBGRAPH` | Internal subgraph marker. |
| `MISSING_PORT` | Placeholder for missing ports after graph migration. |

`TypeHandles.init()` is called during LDLib2 common initialization.

## Register Metadata

After creating a handle, register metadata with `TypeHandleHelpers`.

```java
TypeHandle profileType = TypeHandleHelpers.customType(
        DamageProfile.class,
        "mymod:damage_profile",
        "Damage Profile"
);

TypeHandleHelpers.setCustomColor(profileType, 0xFFFFAA33);
TypeHandleHelpers.setCustomIcon(profileType, MyIcons.DAMAGE);
TypeHandleHelpers.setCustomDefaultValue(profileType, DamageProfile::empty);
```

Use `setCustomColorAndIcon(...)` when both should be set together:

```java
TypeHandleHelpers.setCustomColorAndIcon(profileType, 0xFFFFAA33, MyIcons.DAMAGE);
```

## Register a Configurator

The configurator controls how constants, input-port values, options, and variable defaults are edited.

```java
TypeHandleHelpers.setCustomConfigurable(profileType, (value, type) ->
        IConfigurable.create(group -> {
            group.addConfigurator(new DamageProfileConfigurator(
                    "",
                    value::getValue,
                    value::setValue,
                    value.forceUpdate()
            ));
        })
);
```

If no custom configurable is registered, `ITypeConfigurable.DEFAULT` tries to use LDLib2 Configurable accessors for the resolved Java type. Enums use an enum selector automatically.

For one-off UI overrides, set the configurator on the option or input port instead:

```java
context.addInputPort("amount", Float.class)
        .withConfigurable(myPortConfigurable)
        .build();

context.addOption("mode", Mode.class)
        .withConfigurable(myOptionConfigurable);
```

## Constants

Constants are typed values backed by `TypeHandle`.

They are used by:

* constant nodes,
* input port embedded values,
* node options,
* variable default values.

The handle decides the value editor, default value, type color, and icon. Individual options and input ports can override the default configurator or codec:

```java
context.addInputPort("amount", Float.class)
        .withDefaultValue(1f)
        .withCodec(Codec.FLOAT)
        .build();
```

Use `withoutSerialization()` for runtime-only values that should not be saved.

## Graph Type Lists

Graph definitions use type handles to control editor choices.

```java
@Override
public @Nullable List<TypeHandle> getSupportTypes() {
    return List.of(TypeHandles.FLOAT, TypeHandles.COLOR, TypeHandles.BOOL);
}

@Override
public @Nullable List<TypeHandle> getLibrarySupportTypes() {
    return List.of(TypeHandles.FLOAT, TypeHandles.COLOR);
}

@Override
public @Nullable List<TypeHandle> getVariableSupportTypes() {
    return List.of(TypeHandles.FLOAT, TypeHandles.BOOL);
}
```

`getSupportTypes()` is the base list. `getLibrarySupportTypes()` controls constant nodes in the item library. `getVariableSupportTypes()` controls blackboard variable choices.
