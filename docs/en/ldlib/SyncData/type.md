# Type Support

Here we list all the classes with built-in support and how to add support to a class.

## Built-in Supports:
* `Primitive`: `int`, `boolean`, `Integer`, `String`, ...
* `Enum`
* `NBT`
* `FriendlyBuf`
* `UUID`
* `ResourceLocation`
* `Component`
* `Recipe`
* `ItemStack`
* `FluidStack`(ldlib)
* `BlockPos`
* `Size`
* `Position`
* `IGuiTexture`
* `Array`: T[] value.... (if T is support)
* `Collection`: Set<T>, List<T>.... (if T is support)
* `ITagSerializable`: if class inherits from `ITagSerializable` it can also be synced/persisted but it should be a `final` field.
* `IManaged`: if class inherits from `IManaged` it can also be synced/persisted but it should be a `final` field. Besides, syndata annotations in Imanaged can also be handled.

## Addtional Supports:
The easiest way add support for a new class is to create an `Accessor`.
```java
public class GTRecipeAccessor extends CustomObjectAccessor<GTRecipe> {

    public GTRecipeAccessor() {
        super(GTRecipe.class, true); // field class, whether this accessor is available for its children class
    }

    @Override
    public ITypedPayload<?> serialize(AccessorOp accessorOp, GTRecipe gtRecipe) {
        FriendlyByteBuf serializedHolder = new FriendlyByteBuf(Unpooled.buffer());
        serializedHolder.writeUtf(gtRecipe.id.toString());
        GTRecipeSerializer.SERIALIZER.toNetwork(serializedHolder, gtRecipe);
        return FriendlyBufPayload.of(serializedHolder);
    }

    @Override
    public GTRecipe deserialize(AccessorOp accessorOp, ITypedPayload<?> payload) {
        if (payload instanceof FriendlyBufPayload buffer) {
            var id = new ResourceLocation(buffer.getPayload().readUtf());
            return GTRecipeSerializer.SERIALIZER.fromNetwork(id, buffer.getPayload());
        }
        return null;
    }
}
```
register accessors
```java
TypedPayloadRegistries.register(Class<T> clazz, Supplier<T> factory, IAccessor accessor, int priority)
```
* `clazz`: payload class, Generally speaking, it is the same as the payload used in the accessor. The payload here is persisted only. You can use different payloads in the accessor and check for the correct type.
* `factory`: payload instance
* `accessor`: accessor
* `priority`: priority (if this field can be handled by multi accessors)

Forge:
```java
@LDLibPlugin
public class LDLibPlugin implements ILDLibPlugin {
    @Override
    public void onLoad() {
        // in ldlib plugin
        register(FriendlyBufPayload.class, FriendlyBufPayload::new, new GTRecipeAccessor(), 1000);
    }
}
```

Fabric:
add an entrypoints:
```json
"entrypoints": {
    "ldlib_pugin": [
      "com.gregtechceu.gtceu.integration.ldlib.fabric.LDLibPlugin"
    ],
}
```
```java
public class LDLibPlugin implements ILDLibPlugin {
    @Override
    public void onLoad() {
        // in ldlib plugin
        register(FriendlyBufPayload.class, FriendlyBufPayload::new, new GTRecipeAccessor(), 1000);
    }
}
```

