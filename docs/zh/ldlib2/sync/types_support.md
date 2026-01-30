# 类型支持
{{ version_badge("2.0.0", label="Since", icon="tag") }}

LDLib2 已经为同步和持久化提供了大量的类型支持。

## 内置支持
!!! note inline end
    请查看 [github](https://github.com/Low-Drag-MC/LDLib2/blob/1.21/src/main/java/com/lowdragmc/lowdraglib2/syncdata/AccessorRegistries.java) 以获取最新的支持列表。

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
| `Enum<?>`                      | `-1`     | -     |
| `Number`                       | `1000`   | -     |
| `UUID`                         | `100`    | -     |
| `T[]`                          | `-1`     | 取决于 `T` |
| `Collection<?>`                | `-1`     | ✅     |

- Minecraft 中的类型（方块、物品、流体等）

| 类型                            | 优先级   | 只读 |
| ------------------------------- | -------- | ----- |
| `Block`                         | `100`    | -     |
| `Item`                          | `100`    | -     |
| `Fluid`                         | `100`    | -     |
| `EntityType<?>`                 | `100`    | -     |
| `BlockEntityType<?>`            | `100`    | -     |
| `BlockState`                    | `100`    | -     |
| `ResourceLocation`              | `100`    | -     |
| `AABB`                          | `1000`   | -     |
| `BlockPos`                      | `1000`   | -     |
| `FluidStack`                    | `1000`   | -     |
| `ItemStack`                     | `1000`   | -     |
| `RecipeHolder<?>`               | `1000`   | -     |
| `Tag`                           | `2000`   | -     |
| `Component`                     | `2000`   | -     |
| `INBTSerializable<?>`           | `2000`   | ✅    |

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
要添加对新类型的支持，你需要注册该类型的 `IAccessor<TYPE>`。所有类型可以分为两组：`direct`（直接）和 `read-only`（只读）。

!!! important
    - `direct` 指的是可以为空，并且在管理生命周期内有已知方法可以创建该类型新实例的类型。
    - `read-only` 指的是在管理生命周期内不能为空且不可变的类型（例如 `INBTSerializable<?>` 和 `Collection<?>`）。所有修改都应通过其 API 完成。

你可以使用 `AccessorRegistries.registerAccessor` 来注册访问器。一般来说，你可以在任何地方注册你的访问器，但我们建议在 [LDLibPlugin#onLoad](../java_integration.md#ldlibplugin) 中进行。

---

### 注册一个 direct 类型
你可以使用 `CustomDirectAccessor` 轻松注册新类型。

!!! note inline end "什么是 Mark？"
    Mark 是管理生命周期中的一个快照。LDLib2 会为当前值生成 mark 并在之后进行比较，以确定其是否发生了变化。
    如果未定义 Mark，它将存储当前值作为 mark。如果类型的内部值是不可变的（例如 UUID、ResourceLocation），这是可行的。否则，你最好设置一种获取 mark 的方式。

| 方法             | 是否可选 | 说明 |
| ---------------- | -------- | ---- |
| `codec`          | 必需     | 提供用于持久化的编解码器 |
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
如果你确实需要，请实现 `IReadOnlyAccessor<TYPE>` 并注册它，查看代码注释以获取更多使用细节。