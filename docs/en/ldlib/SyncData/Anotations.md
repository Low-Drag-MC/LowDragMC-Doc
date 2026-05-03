# Anotations

We show all anotations and their usage in this page.

### `@DescSynced`
Annotate a field, the value of this field (server side) will be synced to the client side (specifically, `remote`)

if field also be annotated with `@LazyManaged`, you need to manually tell him when to synchronize

``` java
@DescSynced
int a;
@DescSynced @LazyManaged
int b;

public void setA(int newValue) {
    a = newValue; // will be synced automatically, in general
}

public void setB(int newValue) {
    b = newValue;
    markDirty("b"); // mannually notify chagned
}
```

### `@Persisted`
Annotate a field, the value of this field (server side) will be written/read to/from BlockEntities' nbt. 

-`String key()` represent tag name in nbt. default -- use field name instead.

``` java
@Persisted(key = "fluidAmount")
int value = 100;
@Persisted
boolean isWater = true;
```
its nbt looks like

```json
{
  "fluidAmount": 100,
  "isWater": true
}
```

### `@DropSaved`
Annotate a field, the value of this field will be saved to `Itemstack`'s nbt when you pick(clone) / harvest this block, and loaded from `ItemStack` when you place the block in the world.

### `@RPCMethod`
Annotate a method, you can send RPC packet between different sides. You are free to define the parameters of the methodas long as the parameters support sync, and send rpc anywhere in your class.

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
    // do your logic
    if (isRemote()) {
        System.out.println("Recipe rpc from server");
    }
    if (isRemote()) {
        System.out.println("Recipe rpc from remote");
    }
}
```

* `rpcToTracking`: send to all remote players if this blockentity is loaded(tracked) in their remotes.
* `rpcToPlayer`: send to a specfic player
* `rpcToServer`: send to server.

### `@ReadOnlyManaged`

Some class types do not support instance, and they must be `final` and cannot be changed. (e.g. class type with `ITagSerializable` is read only, they can be synchronized and persisted, but cannot modify their instance references). If you want this field not to be `finnal`, it may be `null`, and the instance may changed, you can use `@ReadOnlyManaged`.

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

`onDirtyMethod`: if this field has changes.

`serializeMethod`: get a unique id of this field.

`deserializeMethod`: if field's unique id changed / set from `null` to instance. create a new instance for it.

For example, `CoverBehavior` above is a calss inherit `IManaged`(so sync annotations in CoverBehavior also works). but it's constructor need to pass `BlockEntity` into it, so SyncData system couldn't help create its instance. we can use this way to address it.
