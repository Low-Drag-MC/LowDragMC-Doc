# Accessors

`IConfiguratorAccessor&lt;T&gt;` 是 Java 类型和 configurator UI 之间的桥梁。当 `ConfiguratorParser` 找到普通的 `@Configurable` 字段时，会执行类似下面的流程：

```java
IConfiguratorAccessor accessor = ConfiguratorAccessors.findByType(field.getGenericType());
Configurator configurator = accessor.create(name, getter, setter, forceUpdate, field, owner);
```

Accessor 决定自己是否支持该字段类型，提供默认值，并创建具体的 `Configurator`。

## 内置类型支持

LDLib2 在 `ldlib2:configurator_accessor` 中注册了许多客户端 accessor。

| 类型族 | Java 类型 | 说明 |
| --- | --- | --- |
| Boolean | `boolean`, `Boolean` | 使用 toggle。 |
| Numbers | `int`, `long`, `float`, `double`, `short`, `byte` 以及 boxed 类型 | 支持 `@ConfigNumber`、`@DefaultValue` 和 `@ConfigColor`。 |
| String | `String`, `String[]` | `String[]` 会作为多行字符串编辑。 |
| Enum | 任意 enum 类型 | 支持 `@ConfigSelector`；实现 `StringRepresentable` 时使用 serialized name。 |
| Text | `Component` | Component 文本 configurator。 |
| Minecraft registry values | `Block`, `Item`, `Fluid`, `EntityType&lt;?&gt;` | 通常使用 registry search/selector UI。 |
| Resource IDs | `ResourceLocation` | 支持 `@ConfigRL` 的 font 和 tag-key 模式。 |
| Item/fluid stacks | `ItemStack`, `FluidStack` | 面向物品/流体的 configurator。 |
| NBT | `Tag` | 编辑原始 NBT/tag 数据。 |
| Position/shape | `BlockPos`, `AABB`, `Range` | 使用数值 group。 |
| LDLib UI data | `Position`, `Size`, `Pivot`, `LengthPercent`, `Translate2D` | 常见 UI layout/style 数据类型。 |
| JOML math | `Vector2f`, `Vector2i`, `Vector3f`, `Vector3i`, `Vector4f`, `Vector4i`, `Quaternionf` | 使用组合数值 configurator。 |
| Scene refs | `TransformRef` | Scene editor 相关的 transform reference。 |
| Render/UI resources | `IGuiTexture`, `IRenderer` | 选择注册过的实现，并编辑该实现自己的 configurable 数据。 |
| Arrays | `T[]` | 基于子类型 accessor 的动态 wrapper。 |
| Collections | `Collection&lt;T&gt;`，通常是 `List&lt;T&gt;` 或 `Set&lt;T&gt;` | 基于子类型 accessor 的动态 wrapper；支持 `@ConfigList`。 |

数组和集合是动态处理的。LDLib2 会先找到子类型 accessor，然后用 `ArrayConfiguratorAccessor` 或 `CollectionConfiguratorAccessor` 包起来。

如果类型不在表中，仍可以通过这些方式支持：

* 字段使用 `@Configurable(subConfigurable = true)`；
* 注册自定义 `IConfiguratorAccessor`；
* 在 `buildConfigurator(...)` 中手动构建 UI；
* list 使用 `@ConfigList(configuratorMethod = "...")` 提供 item UI。

## 自定义 Accessor

当某个领域类型总是应该使用同一种编辑控件时，创建 accessor。

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

`@LDLRegisterClient` 会让这个 accessor 在客户端可被 `ConfiguratorAccessors.findByType(...)` 找到。

## 如何选择扩展点

如果映射是类型级别的，比如所有 `Currency` 都应该用同一个 selector，就使用自定义 accessor。

如果 UI 依赖某个 owner 对象或某个具体字段，优先使用 `@ConfigList(configuratorMethod = "...")`、`@ConfigSearch` 或手动 `buildConfigurator(...)`。

如果默认 UI 足够，但写入值时需要校验或副作用，使用 `@ConfigSetter`。
