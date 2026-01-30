# 管理 BlockEntity
{{ version_badge("2.1.0", label="Since", icon="tag") }}

通过实现 `ISyncPersistRPCBlockEntity`，你可以将所有同步和持久化代码委托给 LDLib2。
你不需要任何额外的代码，只需设置好 `syncStorage` 和注解即可。

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
    if (level.isClient) { // 接收端
        LDLib2.LOGGER.info("Received RPC from server: {}", message);
    } else { // 发送端
        rpcToTracking("rpcMsg", msg)
    }
}
```

!!! note
    实际上，`ISyncPersistRPCBlockEntity` 由 `ISyncBlockEntity`、`IRPCBlockEntity`、`IPersistManagedHolder`、`IBlockEntityManaged` 组成。
    如果你只需要其中部分功能，或者想要进行更精细的控制，可以选择只实现它们中的一部分。

!!! warning
    如果你启用了 `useAsyncThread()`（默认返回 true）。你必须注意线程安全问题。例如，`notifyPersistence()` 将在一个线程中被触发。
    通常，你不需要担心它，LDLib2 会处理所有情况。