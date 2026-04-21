# 简介与配置

开发者在维护 `Remote` 与 `Server` 之间的数据同步以及数据持久化时总是感到十分繁琐。通常情况下，开发者不得不编写大量关于序列化和网络数据包处理的代码。

<span style="color: red;">取而代之：</span>LDLib 提供了一套基于注解的强大同步/持久化系统。你可以轻松地为你的 `BlockEntity` 处理所有同步/持久化逻辑，无需任何额外代码。

## 配置

若要为你的方块实体使用 SyncData 系统，可以让你的类实现 `IManagedBlockEntity` 和 `IManaged`。

### `IAsyncAutoSyncBlockEntity`

建议你使用 `IAsyncAutoSyncBlockEntity` 替代 `IManagedBlockEntity`，它可以让你无需理会 `markDirty`，所有工作都将由 SyncData 系统自动完成，你无需关心其他任何事情。

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
然后你就可以享受 SyncData 系统带来的便利了！！

### `IAutoPersistBlockEntity`

如果你想通过 `@Persisted` 将数据持久化到 NBT，也请实现此接口。

你可以将 `@DropSaved` 字段保存到 ItemStack：
```java
IAutoPersistBlockEntity.saveManagedPersistentData(tag, true);

// 例如，方块克隆
@Override
public ItemStack getCloneItemStack(BlockGetter level, BlockPos pos, BlockState state) {
    ItemStack itemStack = super.getCloneItemStack(level, pos, state);
    if (getBlockEntity(level, pos) instanceof IAutoPersistBlockEntity dropSave) {
        dropSave.saveManagedPersistentData(itemStack.getOrCreateTag(), true);
    }
    return itemStack;
}
```

也可以从 ItemStack 加载：

```java
IAutoPersistBlockEntity.loadManagedPersistentData(tag);

//例如，放置方块
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

## 监听托管字段变化

有时你需要监听字段的变化，例如当某个字段同步到客户端时安排渲染更新。
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

## 在初始化代码中使用 `@Persisted` 字段

这些字段的加载通常发生在区块加载期间，这并不能保证可以安全地执行任何额外操作。

如果初始化逻辑需要访问任何 `@Persisted` 字段的值，则需要将其安排在下一刻执行：

```java
public void onLoad() {
    if (!LDLib.isRemote()) {
        getLevel().getServer().tell(new TickTask(0, this::initialize));
    }
}

public void initialize() {
    // 在此编写初始化代码
}
```
