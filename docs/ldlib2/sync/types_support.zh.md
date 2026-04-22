# 类型支持{{ version_badge("2.0.0", label="Since", icon="tag") }}
LDLib2 已经为同步和持久性提供了大量类型支持。
## 内置支持!!!注意行内结束检查[github](https://github.com/Low-Drag-MC/LDLib2/blob/1.21/src/main/java/com/lowdragmc/lowdraglib2/syncdata/AccessorRegistries.java)以获取最新的支持列表。
- java 中的本机类型（数字、布尔值、字符串、枚举等）
| Type(s)                      | Priority | Read-only |
| ---------------------------- | -------- | ---------- |
| `int` / `Integer`            | `-1`     | -         |
| `long` / `Long`              | `-1`     | -         |
| `float` / `Float`            | `-1`     | -         |
| `double` / `Double`          | `-1`     | -         |
| `boolean` / `Boolean`        | `-1`     | -         |
| `byte` / `Byte`              | `-1`     | -         |
| `short` / `Short`            | `-1`     | -         |
| `char` / `Character`         | `-1`     | -         |
| `String`                     | `-1`     | -         |
| `Enum<?>`                    | `-1`     | -         |
| `Number`                     | `1000`   | -         |
| `UUID`                       | `100`    | -         |
| `T[]`                        | `-1`     | depeends on `T` |
| `Collection<?>`              | `-1`     | ✅         |

- 我的世界中的类型（块、物品、流体等）
| Type(s)                         | Priority | Read-only |
| ------------------------------- | -------- | ---------- |
| `Block`                         | `100`    | -         |
| `Item`                          | `100`    | -         |
| `Fluid`                         | `100`    | -         |
| `EntityType<?>`                 | `100`    | -         |
| `BlockEntityType<?>`            | `100`    | -         |
| `BlockState`                    | `100`    | -         |
| `ResourceLocation`              | `100`    | -         |
| `AABB`                          | `1000`   | -         |
| `BlockPos`                      | `1000`   | -         |
| `FluidStack`                    | `1000`   | -         |
| `ItemStack`                     | `1000`   | -         |
| `RecipeHolder<?>`               | `1000`   | -         |
| `Tag`                           | `2000`   | -         |
| `Component`                     | `2000`   | -         |
| `INBTSerializable<?>`           | `2000`   | ✅        |

- LDLib2 或其他类型。
| Type(s)         | Priority | Read-only |
| --------------- | -------- | ---------- |
| `UIEvent`       | `100`    | -         |
| `Position`      | `100`    | -         |
| `Size`          | `100`    | -         |
| `Pivot`         | `100`    | -         |
| `Range`         | `100`    | -         |
| `Vector3f`      | `1000`   | -         |
| `Vector4f`      | `1000`   | -         |
| `Vector2f`      | `1000`   | -         |
| `Vector2i`      | `1000`   | -         |
| `Quaternionf`   | `1000`   | -         |
| `IGuiTexture`   | `1000`   | -         |
| `IRenderer`     | `1000`   | -         |
| `IResourcePath` | `1000`   | -         |
| `IManaged`      | `1500`   | ✅        |


## 添加自定义类型支持要添加新类型的支持，您需要注册该类型的`IAccessor<TYPE>`。所有类型可分为两组，`direct` 和`read-only`。
!!!重要的    - `direct`指的是可以为空的类型，并且有已知的方法可以在管理生命周期中创建该类型的新实例。    - `read-only` 是指在管理生命周期内不能为空且不可变的类型。 （例如 INBTSerialized<?> amd Collection<?>）。所有修改都应通过其 API 完成。
您可以使用`AccessorRegistries.registerAccessor`来注册访问器。一般来说，您可以在任何地方注册您的访问器，但我们建议在[LDLibPlugin#onLoad](../java_integration.md#ldlibplugin) 中进行注册。
---

### 注册直接类型您可以使用`CustomDirectAccessor`轻松注册新类型。
!!!注意内联结尾“马克是什么？”标记是管理生命周期的一个快照。 LDLib2会对当前值生成标记，并在以后进行比较以确定是否有变化。如果未定义标记。它将存储当前值作为标记。如果类型的内部值是不可变的，它就可以工作。 （例如 UUID、资源位置）。否则，你最好设置一个获取标记的方式。
| Method         | Optional | Note |
| --------------- | -------- | ---------- |
| `codec`         | Required        | Provide a codec for persistence |
| `streamCodec`   | Required   | Provide a StreamCodec for synchronization        |
| `customMark`   | Optional   | Provide functions to get and compare marks        |
| `copyMark`   | Optional   | Copy the mark from the value. This will use the `Objects#equals(Object, Object)` to compare the mark. Make sure the object supports `Object#equals(Object)`.        |
| `codecMark`   | Optional   | This will use the `JavaOps` to generate the mark based on current value. |

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

### 注册只读类型
一般来说，你并不真正需要它。因为，您可以创建自己的类来继承`INBTSerializable`。如果您确实需要，请实现`IReadOnlyAccessor<TYPE>`并注册，更多使用细节请查看代码注释。