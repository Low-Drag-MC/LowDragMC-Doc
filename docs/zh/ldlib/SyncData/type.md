# 类型支持

此处我们列出所有内置支持的类，以及如何为某个类添加支持。

## 内置支持：
* `Primitive`：`int`、`boolean`、`Integer`、`String`、……
* `Enum`
* `NBT`
* `FriendlyBuf`
* `UUID`
* `ResourceLocation`
* `Component`
* `Recipe`
* `ItemStack`
* `FluidStack`（ldlib）
* `BlockPos`
* `Size`
* `Position`
* `IGuiTexture`
* `Array`：T[] value……（如果 T 受支持）
* `Collection`：Set<T>、List<T>……（如果 T 受支持）
* `ITagSerializable`：如果类继承自 `ITagSerializable`，则它也可以被同步/持久化，但字段应为 `final`。
* `IManaged`：如果类继承自 `IManaged`，则它也可以被同步/持久化，但字段应为 `final`。此外，Imanaged 中的 syndata 注解也可以被处理。

## 额外支持：
为某个新类添加支持的最简单方式是创建一个 `Accessor`。
```java
public class GTRecipeAccessor extends CustomObjectAccessor<GTRecipe> {

    public GTRecipeAccessor() {
        super(GTRecipe.class, true); // 字段类，此 accessor 是否对其子类可用
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
注册 accessor
```java
TypedPayloadRegistries.register(Class<T> clazz, Supplier<T> factory, IAccessor accessor, int priority)
```
* `clazz`：payload 类。一般而言，它与 accessor 中使用的 payload 相同。此处的 payload 仅用于持久化。你可以在 accessor 中使用不同的 payload 并检查正确的类型。
* `factory`：payload 实例
* `accessor`：accessor
* `priority`：优先级（如果此字段可被多个 accessor 处理）

Forge：
```java
@LDLibPlugin
public class LDLibPlugin implements ILDLibPlugin {
    @Override
    public void onLoad() {
        // 在 ldlib 插件中
        register(FriendlyBufPayload.class, FriendlyBufPayload::new, new GTRecipeAccessor(), 1000);
    }
}
```

Fabric：
添加一个 entrypoints：
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
        // 在 ldlib 插件中
        register(FriendlyBufPayload.class, FriendlyBufPayload::new, new GTRecipeAccessor(), 1000);
    }
}
```
