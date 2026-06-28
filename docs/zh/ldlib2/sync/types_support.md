# 类型支持
<VersionBadge version="2.0.0" label="自" icon="tag" />

LDLib2 已经为同步和持久化提供了大量的类型支持。

## 内置支持
::: info
请查看 [GitHub](https://github.com/Low-Drag-MC/LDLib2/blob/1.21/src/main/java/com/lowdragmc/lowdraglib2/syncdata/AccessorRegistries.java) 以获取最新的支持列表。
:::

- Java 中的原生类型（数字、布尔值、字符串、枚举等）

| 类型                           | 优先级   | 只读 |
| ------------------------------ | -------- | ----- |
| `int` / `Integer`              | `-1`     | -     |
| `long` / `Long`                | `-1`     | -     |
| `float` / `Float`              | `-1`     | -     |
| `double` / `Double`            | `-1`     | -     |
| `boolean` / `Boolean`          | `-1`     | -     |
| `byte` / `Byte`                | `-1`     | -     |
| `short` / `Short`              | `-1`     | -     |
| `char` / `Character`           | `-1`     | -     |
| `String`                       | `-1`     | -     |
| `Enum&lt;?&gt;`                      | `-1`     | -     |
| `Number`                       | `1000`   | -     |
| `UUID`                         | `100`    | -     |
| `T[]`                          | `-1`     | 取决于 `T` |
| `Collection&lt;?&gt;`                | `-1`     | ✅     |
| `Map&lt;K, V&gt;`                    | `-1`     | ✅     |

::: info Map 支持
<VersionBadge version="2.2.8" label="自" icon="tag" />

从 **2.2.8** 起，LDLib2 支持对 `Map&lt;K, V&gt;` 进行同步和持久化。`K` 和 `V` 都会通过各自的 accessor 处理，因此 key 和 value 的类型本身也必须是受支持的类型。

Map 会作为只读容器管理。当 key 和 value 的 accessor 都是 direct 时，LDLib2 可以在反序列化时清空并重建 map。如果 key 或 value 类型是 read-only，则两侧的 map 结构必须已经匹配，或者在字段上使用 `@ReadOnlyManaged` 来序列化并重建结构。
:::

- Minecraft 中的类型（Block、Item、Fluid 等）

| 类型                            | 优先级   | 只读 |
| ------------------------------- | -------- | ----- |
| `Block`                         | `100`    | -     |
| `Item`                          | `100`    | -     |
| `Fluid`                         | `100`    | -     |
| `EntityType&lt;?&gt;`                 | `100`    | -     |
| `BlockEntityType&lt;?&gt;`            | `100`    | -     |
| `BlockState`                    | `100`    | -     |
| `ResourceLocation`              | `100`    | -     |
| `AABB`                          | `1000`   | -     |
| `BlockPos`                      | `1000`   | -     |
| `FluidStack`                    | `1000`   | -     |
| `ItemStack`                     | `1000`   | -     |
| `RecipeHolder&lt;?&gt;`               | `1000`   | -     |
| `Tag`                           | `2000`   | -     |
| `Component`                     | `2000`   | -     |
| `INBTSerializable&lt;?&gt;`           | `2000`   | ✅    |

- LDLib2 或其他模组中的类型。

| 类型              | 优先级   | 只读 |
| ----------------- | -------- | ----- |
| `UIEvent`         | `100`    | -     |
| `Position`        | `100`    | -     |
| `Size`            | `100`    | -     |
| `Pivot`           | `100`    | -     |
| `Range`           | `100`    | -     |
| `Vector3f`        | `1000`   | -     |
| `Vector4f`        | `1000`   | -     |
| `Vector2f`        | `1000`   | -     |
| `Vector2i`        | `1000`   | -     |
| `Quaternionf`     | `1000`   | -     |
| `IGuiTexture`     | `1000`   | -     |
| `IRenderer`       | `1000`   | -     |
| `IResourcePath`   | `1000`   | -     |
| `IManaged`        | `1500`   | ✅    |


## 添加自定义类型支持
要添加对新类型的支持，你需要注册该类型的 `IAccessor&lt;TYPE&gt;`。所有类型可以分为两组：`direct`（直接）和 `read-only`（只读）。

::: info
- `direct` 指的是可以为空，并且在管理生命周期内有已知方法可以创建该类型新实例的类型。
- `read-only` 指的是在管理生命周期内不能为空且不可变的类型（例如 `INBTSerializable&lt;?&gt;` 和 `Collection&lt;?&gt;`）。所有修改都应通过其 API 完成。
:::

你可以使用 `AccessorRegistries.registerAccessor` 来注册访问器。一般来说，你可以在任何地方注册你的访问器，但我们建议在 [LDLibPlugin#onLoad](../java_integration.md#ldlibplugin) 中进行。

---

### 注册一个 direct 类型
你可以使用 `CustomDirectAccessor` 轻松注册新类型。

::: info 什么是 Mark？
Mark 是管理生命周期中的一个快照。LDLib2 会为当前值生成 mark 并在之后进行比较，以确定其是否发生了变化。
如果未定义 Mark，它将存储当前值作为 mark。如果类型的内部值是不可变的（例如 UUID、ResourceLocation），这是可行的。否则，你最好设置一种获取 mark 的方式。
:::

| 方法             | 是否可选 | 说明 |
| ---------------- | -------- | ---- |
| `codec`          | 必需     | 提供用于持久化的 codec |
| `streamCodec`    | 必需     | 提供用于同步的 StreamCodec |
| `customMark`     | 可选     | 提供获取和比较 mark 的函数 |
| `copyMark`       | 可选     | 从值中复制 mark。这将使用 `Objects#equals(Object, Object)` 来比较 mark。请确保对象支持 `Object#equals(Object)`。 |
| `codecMark`      | 可选     | 这将使用 `JavaOps` 基于当前值生成 mark。 |

```java
AccessorRegistries.registerAccessor(CustomDirectAccessor.builder(Quaternionf.class)
    .codec(ExtraCodecs.QUATERNIONF)
    .streamCodec(ByteBufCodecs.QUATERNIONF)
    .copyMark(Quaternionf::new)
    .build());

AccessorRegistries.registerAccessor(CustomDirectAccessor.builder(ItemStack.class)
    .codec(ItemStack.OPTIONAL_CODEC)
    .streamCodec(ItemStack.OPTIONAL_STREAM_CODEC)
    .customMark(ItemStack::copy, ItemStack::matches)
    .build());
```

---

### 注册一个 read-only 类型

一般来说，你并不真的需要这样做。因为你可以让你自己的类继承自 `INBTSerializable`。
如果你确实需要，请实现 `IReadOnlyAccessor&lt;TYPE&gt;` 并注册它，查看代码注释以获取更多使用细节。
