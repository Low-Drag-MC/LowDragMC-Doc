# PersistedParser

PersistedParser 是一个工具类，用于序列化和反序列化带有 `@Persisted` 或 `@Configurable` 注解的对象的字段。

## 序列化

```java
@EqualsAndHashCode
public class TestData implements IPersistedSerializable {
    @Persisted
    private float numberFloat = 0.0f;
    @Configurable
    private boolean booleanValue = false;
    @Persisted(key = "key")
    private String stringValue = "default";

    public TestData(float initialValue) {
        this.numberFloat = initialValue;
    }
}

var instance = new TestData(100f);
var output = PersistedParser.serialize(JsonOps.INSTANCE, instance, provider).result().get();
System.out.println(output);
var newInstance = new TestData(0f);
var data = PersistedParser.deserialize(JsonOps.INSTANCE, output, newInstance, provider);
System.out.println(newInstance.equals(instance));
```

控制台输出应为

```json
{
    "numberFloat": 100,
    "booleanValue": false,
    "stringValue": "default",
}
true
```

## 创建 Codec
PersistedParser 提供的另一个有用工具是基于注解创建 Codec。

```java
 public class MyObject implements IPersistedSerializable {
    public final static Codec<MyObject> CODEC = PersistedParser.createCodec(MyObject::new);
    
    @Persisted(key = "rl")
    private ResourceLocation resourceLocation = LDLib2.id("test");
    @Persisted(key = "enum")
    private Direction enumValue = Direction.NORTH;
    @Persisted(key = "item")
    private ItemStack itemstack = ItemStack.EMPTY;
}
```

等同于

```java
public class MyObject {
    public final static Codec<MyObject> CODEC = RecordCodecBuilder.create(instance -> instance.group(
            ResourceLocation.CODEC.fieldOf("rl").forGetter(MyObject::getResourceLocation),
            Direction.CODEC.fieldOf("enum").forGetter(MyObject::getEnumValue),
            ItemStack.OPTIONAL_CODEC.fieldOf("item").forGetter(MyObject::getItemstack)
    ).apply(instance, MyObject::new));

    private ResourceLocation resourceLocation = LDLib2.id("test");
    private Direction enumValue = Direction.NORTH;
    private ItemStack itemstack = ItemStack.EMPTY;

    public MyObject(ResourceLocation resourceLocation, Direction enumValue, ItemStack itemstack) {
        this.resourceLocation = resourceLocation;
        this.enumValue = enumValue;
        this.itemstack = itemstack;
    }

    public ResourceLocation getResourceLocation() {
        return resourceLocation;
    }

    public Direction getEnumValue() {
        return enumValue;
    }

    public ItemStack getItemstack() {
        return itemstack;
    }
}
```