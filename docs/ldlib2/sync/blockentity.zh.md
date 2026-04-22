# 管理块实体{{ version_badge("2.1.0", label="Since", icon="tag") }}
通过实现`ISyncPersistRPCBlockEntity`，您可以将所有同步和持久性代码委托给LDLib2。您不需要任何额外的代码，只需设置 `syncStorage` 和注释即可。
```java
public class MyBlockEntity extends BlockEntity implements ISyncPersistRPCBlockEntity {
    @Getter
    private final FieldManagedStorage syncStorage = new FieldManagedStorage(this);

    @Persisted
    @DescSynced
    @UpdateListener(methodName = "onIntValueChanged")
    private int intValue = 10;
    @Persisted
    @DescSynced
    @DropSaved
    @RequireRerender
    private ItemStack itemStack = ItemStack.EMPTY;

    public MyBlockEntity(BlockPos pWorldPosition, BlockState pBlockState) {
        super(...);
    }

    private void onIntValueChanged(int oldValue, int newValue) {
        LDLib2.LOGGER.info("Int value changed from {} to {}", oldValue, newValue);
    }

    @RPCMethod
    public void rpcMsg(String msg) {
    if (level.isClient) { // receive 
        LDLib2.LOGGER.info("Received RPC from server: {}", message);
    } else { // send
        rpcToTracking("rpcMsg", msg)
    }
}
```

!!!笔记实际上，`ISyncPersistRPCBlockEntity`是由`ISyncBlockEntity`、`IRPCBlockEntity`、`IPersistManagedHolder`、`IBlockEntityManaged`组成的。如果需要不少功能或者想要进行细粒度控制，您可以选择其中的部分功能。
!!!警告如果启用了 `useAsyncThread()`（默认返回 ture）。您必须小心线程安全问题。例如，`notifyPersistence()`将在线程中触发。一般来说，你不需要担心，LDLib2 会处理所有情况。
