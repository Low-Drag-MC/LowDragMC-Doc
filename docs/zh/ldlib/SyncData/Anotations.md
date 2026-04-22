# 注解

我们在本页面展示所有注解及其用法。

### `@DescSynced`
注解一个字段，该字段的值（服务端）会被同步到客户端（具体地，`remote`）

如果字段同时被 `@LazyManaged` 注解，你需要手动告知它何时进行同步

``` java
@DescSynced
int a;
@DescSynced @LazyManaged
int b;

public void setA(int newValue) {
    a = newValue; // 通常会自动同步
}

public void setB(int newValue) {
    b = newValue;
    markDirty("b"); // 手动通知已更改
}
```

### `@Persisted`
注解一个字段，该字段的值（服务端）会被写入/读取到 BlockEntity 的 nbt 中。

-`String key()` 表示 nbt 中的标签名称。默认值 -- 使用字段名代替。

``` java
@Persisted(key = "fluidAmount")
int value = 100;
@Persisted
boolean isWater = true;
```
其 nbt 如下所示

```json
{
  "fluidAmount": 100,
  "isWater": true
}
```

### `@DropSaved`
注解一个字段，当你拾取（克隆）/ 挖掘此方块时，该字段的值会被保存到 `ItemStack` 的 nbt 中；当你将方块放置在世界中时，会从 `ItemStack` 加载该值。

### `@RPCMethod`
注解一个方法，你可以在不同端之间发送 RPC 数据包。只要参数支持同步，你可以自由定义方法的参数，并在类中的任何位置发送 rpc。

```java
public void update() {
    if (!isRemote()) {
        rpcToTracking("rpcLogic", Direction.UP, 100);
        rpcToPlayer(player, "rpcLogic", Direction.UP, 100);
    } else {
        rpcToServer("rpcLogic", Direction.UP, 100);
    }
}

@RPCMethod
public void rpcLogic(Direction value1, int value2) {
    // 执行你的逻辑
    if (isRemote()) {
        System.out.println("Recipe rpc from server");
    }
    if (isRemote()) {
        System.out.println("Recipe rpc from remote");
    }
}
```

* `rpcToTracking`: 如果此 blockentity 已加载（被跟踪）于所有远程玩家（remote）中，则发送给他们。
* `rpcToPlayer`: 发送给特定玩家
* `rpcToServer`: 发送给服务器。

### `@ReadOnlyManaged`

某些类类型不支持实例，它们必须是 `final` 且不可更改。（例如，带有 `ITagSerializable` 的类类型是只读的，它们可以被同步和持久化，但不能修改其实例引用）。如果你希望该字段不是 `final`，它可能是 `null`，并且实例可能会更改，你可以使用 `@ReadOnlyManaged`。

```java
@DescSynced
@Persisted
@ReadOnlyManaged(onDirtyMethod = "onCoverDirty", serializeMethod = "serializeCoverUid", deserializeMethod = "deserializeCoverUid")
private CoverBehavior up, down, north, south, west, east;

private boolean onCoverDirty(CoverBehavior coverBehavior) {
    if (coverBehavior != null) {
        for (IRef ref : coverBehavior.getSyncStorage().getNonLazyFields()) {
            ref.update();
        }
        return coverBehavior.getSyncStorage().hasDirtyFields();
    }
    return false;
}

private CompoundTag serializeCoverUid(CoverBehavior coverBehavior) {
    var uid = new CompoundTag();
    uid.putString("id", GTRegistries.COVERS.getKey(coverBehavior.coverDefinition).toString());
    uid.putInt("side", coverBehavior.attachedSide.ordinal());
    return uid;
}

private CoverBehavior deserializeCoverUid(CompoundTag uid) {
    var definitionId = new ResourceLocation(uid.getString("id"));
    var side = Direction.values()[uid.getInt("side")];
    var definition = GTRegistries.COVERS.get(definitionId);
    if (definition != null) {
        return definition.createCoverBehavior(this, side);
    }
    GTCEu.LOGGER.error("couldn't find cover definition {}", definitionId);
    throw new RuntimeException();
}
```

`onDirtyMethod`: 如果此字段有更改。

`serializeMethod`: 获取此字段的唯一标识符。

`deserializeMethod`: 如果字段的唯一标识符更改 / 从 `null` 设置为实例。为其创建新实例。

例如，上面的 `CoverBehavior` 是一个继承 `IManaged` 的类（因此 CoverBehavior 中的同步注解也能生效）。但其构造函数需要将 `BlockEntity` 传入其中，所以 SyncData 系统无法帮助创建其实例。我们可以使用这种方式来解决这个问题。
