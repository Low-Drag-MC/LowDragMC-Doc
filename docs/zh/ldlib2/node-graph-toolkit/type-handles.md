# Type Handles

`TypeHandle` 是 NGT 可序列化的类型身份。

端口、变量、常量、options、图标、颜色、默认值和值编辑器都使用它。Handle 存储一个稳定的字符串 id，然后通过 `TypeHandleHelpers` 解析运行时 Java 类型和编辑器元数据。

## 创建 Handles

普通 Java 类型使用 `fromType(...)`：

```java
TypeHandle floatType = TypeHandleHelpers.fromType(Float.class);
TypeHandle directionType = TypeHandleHelpers.fromType(Direction.class);
```

Primitive class 会转换为 wrapper，因此 `float.class` 和 `Float.class` 会解析为同一种 handle。

当图需要一个不能干净映射到 Java class 的命名类型，或者你需要稳定的自定义 id 时，使用 `customType(...)`：

```java
TypeHandle damageType = TypeHandleHelpers.customType(
        DamageProfile.class,
        "mymod:damage_profile",
        "Damage Profile"
);
```

`uniqueId` 必须保持稳定。它会序列化到图数据、端口、变量、常量和 options 中。

## TypeHandle API

| 方法 | 用途 |
| ---- | ---- |
| `getIdentification()` | 序列化 id 字符串。 |
| `getName()` | 解析后的类型名；自定义 handle 返回自定义 id。 |
| `getFriendlyName()` | UI 中显示的人类可读名称。 |
| `resolve()` | 运行时 Java `Type`。 |
| `getIcon()` | 该类型的 UI 图标。 |
| `getTypeColor()` | 端口和类型 UI 使用的颜色。 |
| `getDefaultValue()` | 默认值 supplier 的结果。 |
| `resolveConfigurable()` | 值编辑器工厂。 |
| `isAssignableFrom(TypeHandle)` | 类型兼容性辅助方法。 |
| `isCustomTypeHandle()` | 是否来自自定义注册。 |

## 内置 Handles

内置 handles 位于 `TypeHandles`。

| Handle | 用途 |
| ------ | ---- |
| `BOOL` | Boolean 值。 |
| `FLOAT`, `DOUBLE`, `INT`, `LONG` | 数值。 |
| `STRING` | 文本值。 |
| `COLOR` | 带颜色 configurator 的整数颜色。 |
| `DIRECTION` | Minecraft direction。 |
| `BLOCK`, `ITEM`, `FLUID` | Minecraft registry 值。 |
| `ENTITY_TYPE` | Entity type 值。 |
| `ITEM_STACK`, `FLUID_STACK` | Stack 值。 |
| `EXECUTION_FLOW` | 仅用于流程的端口。 |
| `SUBGRAPH` | 内部子图标记。 |
| `MISSING_PORT` | 图迁移后缺失端口的占位。 |

`TypeHandles.init()` 会在 LDLib2 common 初始化期间调用。

## 注册元数据

创建 handle 后，使用 `TypeHandleHelpers` 注册元数据。

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

当颜色和图标都需要设置时，使用 `setCustomColorAndIcon(...)`：

```java
TypeHandleHelpers.setCustomColorAndIcon(profileType, 0xFFFFAA33, MyIcons.DAMAGE);
```

## 注册 Configurator

Configurator 控制常量、输入端口值、options 和变量默认值如何编辑。

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

如果没有注册自定义 configurable，`ITypeConfigurable.DEFAULT` 会尝试为解析出的 Java 类型使用 LDLib2 Configurable accessor。Enums 会自动使用 enum selector。

一次性的 UI 覆盖可以直接设置在 option 或输入端口上：

```java
context.addInputPort("amount", Float.class)
        .withConfigurable(myPortConfigurable)
        .build();

context.addOption("mode", Mode.class)
        .withConfigurable(myOptionConfigurable);
```

## Constants

Constants 是由 `TypeHandle` 支持的类型化值。

它们用于：

* constant nodes，
* 输入端口内嵌值，
* 节点 options，
* 变量默认值。

Handle 决定值编辑器、默认值、类型颜色和图标。单个 option 和输入端口可以覆盖默认 configurator 或 codec：

```java
context.addInputPort("amount", Float.class)
        .withDefaultValue(1f)
        .withCodec(Codec.FLOAT)
        .build();
```

对于不应保存的运行时值，使用 `withoutSerialization()`。

## 图类型列表

图定义使用 type handles 控制编辑器选项。

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

`getSupportTypes()` 是基础列表。`getLibrarySupportTypes()` 控制 Item Library 中的 constant nodes。`getVariableSupportTypes()` 控制 Blackboard 变量选项。
