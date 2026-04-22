# Introduction and Setup

Developers always feel annoying while maintain the data synchronization between the `Remote` and `Server`, as well as the data persistence. In general, dev has to write massive code about the serialization and network packet handling.

<span style="color: red;">INSTEAD:</span> LDLib provides a powerful sync/persisted system based on annotation. You can easily handle all sync/persisted logic for your `BlockEntity` without any addional code.

## Setup

To use SyncData system for your blockentity, you can make your class implement `IManagedBlockEntity` and `IManaged`.

### `IAsyncAutoSyncBlockEntity`
I suggest you use `IAsyncAutoSyncBlockEntity` instead of `IManagedBlockEntity`, whihc allow you to ignore `markDirty`, everything will be done by SyncData system, you no need to care about anything else.

```java
public class MyBlockEntity extends BlockEntity implements IAsyncAutoSyncBlockEntity, IAutoPersistBlockEntity, IManaged {
    protected static final ManagedFieldHolder MANAGED_FIELD_HOLDER = new ManagedFieldHolder(MyBlockEntity.class);
    private final FieldManagedStorage syncStorage = new FieldManagedStorage(this);

    @Override
    public ManagedFieldHolder getFieldHolder() {
        return MANAGED_FIELD_HOLDER;
    }

    @Override
    public IManagedStorage getSyncStorage() {
        return syncStorage;
    }

    @Override
    public void onChanged() {
        setChanged();
    }

    @Override
    public IManagedStorage getRootStorage() {
        return getSyncStorage();
    }
}
```
Then you can enjoy the benefits of the SyncData System!!

### `IAutoPersistBlockEntity`
If you want to persisted data to nbt via `@Persisted`, also implenet this interface. 

you can save `@DropSaved` fields to ItemStack:
```java
IAutoPersistBlockEntity.saveManagedPersistentData(tag, true);

// for example, block clone
@Override
public ItemStack getCloneItemStack(BlockGetter level, BlockPos pos, BlockState state) {
    ItemStack itemStack = super.getCloneItemStack(level, pos, state);
    if (getBlockEntity(level, pos) instanceof IAutoPersistBlockEntity dropSave) {
        dropSave.saveManagedPersistentData(itemStack.getOrCreateTag(), true);
    }
    return itemStack;
}
``` 

also lead from itemStack:

```java
IAutoPersistBlockEntity.loadManagedPersistentData(tag);

//for example, place a block
@Override
public void setPlacedBy(Level pLevel, BlockPos pPos, BlockState pState, @Nullable LivingEntity player, ItemStack pStack) {
    if (!pLevel.isClientSide) {
        if (getBlockEntity(level, pos) instanceof IAutoPersistBlockEntity dropSave) {
            CompoundTag tag = pStack.getTag();
            if (tag != null) {
                dropSave.loadManagedPersistentData(tag);
            }
        }
    }
}
```

## Listen Managed Field Changes
Sometimes you need to listen for a field changes, such as scheduling render updates when a field is synchronized to the client.
```java
public class MyBlockEntity extends BlockEntity implements IAsyncAutoSyncBlockEntity, IAutoPersistBlockEntity, IManaged {
    @Persisted
    boolean shouldRenderOverlay;

    public MyBlockEntity(.....) {
        if (LDLib.isRemote()) {
            addSyncUpdateListener("shouldRenderOverlay", this::fieldUpdated);
        }
    }
    
    protected void fieldUpdated(String fieldName, Object newValue, Object oldValue) {
        scheduleRenderUpdate();
    }
}
```

## Using `@Persisted` fields in initialization code

Loading those fields usually happens during the chunk load, which does not guarantee a safe environment to perform any additional operations.

If the initialization logic needs to access the values of any `@Persisted` fields, it needs to be scheduled to happen on the next tick instead:

```java
public void onLoad() {
    if (!LDLib.isRemote()) {
        getLevel().getServer().tell(new TickTask(0, this::initialize));
    }
}

public void initialize() {
    // init code here
}
```

