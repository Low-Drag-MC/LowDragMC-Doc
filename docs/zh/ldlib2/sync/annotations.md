# 注解
{{ version_badge("2.1.0", label="Since", icon="tag") }}

本页面展示了所有注解及其用法。

!!! note "LDLib 开发工具"
    ![图片标题](../assets/plugin.png){ width="60%" align=right }

    如果您打算使用 LDLib2 进行开发，我们强烈建议您安装我们的 IDEA 插件 [LDLib 开发工具](https://plugins.jetbrains.com/plugin/28032-ldlib-dev-tool)。
    该插件具有以下功能：

    - 代码高亮
    - 语法检查
    - 代码跳转
    - 自动补全
    - 其他功能

    这些功能将极大地帮助您利用 LDLib2 的特性。特别是，LDLib2 的所有注解都已得到使用支持。

## 通用注解

### `@DescSynced`
注解一个字段，该字段的值（服务器端）应同步到客户端（具体来说是 `remote` 端）。

```java
@DescSynced
int a;

@DescSynced
private ItemStack b = ItemStack.EMPTY;

@DescSynced
private List<ResourceLocation> c = new ArrayList<>();
```

---

### `@Persisted`
注解一个字段，该字段的值（服务器端）将被写入/读取到/自 BlockEntity 的 NBT 中。

`String key()` 表示 NBT 中的标签名。默认值 —— 使用字段名代替。

```java
@Persisted(key = "fluidAmount")
int value = 100;
@Persisted
boolean isWater = true;
```

其 NBT/JSON 看起来如下：
```json
{
  "fluidAmount": 100,
  "isWater": true
}
```

`boolean subPersisted()` 如果为 true，它将基于其`非空`实例包装字段的内部值。

这对于不允许创建新实例的 `final` 实例非常有用。如果字段设置了 `subPersisted = true`，LDLib2 将执行以下操作：

- 如果字段继承自 `INBTSerializable<?>`，它将尝试使用其 API 进行序列化。
- 否则，它将序列化字段的内部值并将其包装为一个映射。

```java
@Persisted(subPersisted = true) // 这里使用 @Persisted 也可以，因为 INBTSerializable 作为只读字段也受支持。
private final INBTSerializable<CompoundTag> stackHandler = new ItemStackHandler(5);
@Persisted(subPersisted = true)
private final TestContainer testContainer = new TestContainer();

public static class TestContainer {
    @Persisted
    private Vector3f vector3fValue = new Vector3f(0, 0, 0);
    @Persisted
    private int[] intArray = new int[]{1, 2, 3};
}
```

其 NBT/JSON 看起来如下：
```json
{
    "stackHandler": {
        "Size": 5,
        "Items": [],
    },
    "testContainer": {
        "vector3fValue": [0, 0, 0],
        "intArray": [1, 2, 3],
    }
}
```

---

### `@LazyManaged`
 一个注解，标记一个字段为惰性管理。这意味着该字段将仅通过手动标记为脏。
 此注解对于不频繁更新的字段，或批量更新的字段很有用。

```java
@DescSynced
@Persisted
int a;

@DescSynced 
@Persisted
@LazyManaged // 修正了原文中的拼写错误 LayzManaged -> LazyManaged
int b;

public void setA(int value) {
    this.a = value;  // 通常会自动同步/持久化
}

public void setB(int value) {
    this.b = value;
    markDirty("b"); // 手动通知更改
}
```

---

### `@ReadOnlyManaged`
此注解用于标记一个由用户管理的只读字段。

`只读` 类型（例如 `IManaged` 和 `INBTSerializable<?>`）要求字段非空且字段实例不会更改（一个 final 字段）。

!!! note "什么是 `只读` 类型？"
    `只读` 类型指的是那些始终非空且不可变，并且不确定如何创建该类型新实例的字段。更多详情请参阅 [支持的类型](./types_support.md){ data-preview }。

因为我们不知道如何为这些类型创建新实例。在这种情况下，您可以使用此注解，并提供方法，
通过 `serializeMethod()` 从服务器存储唯一 ID，并通过 `deserializeMethod()` 在客户端创建新实例。

此外，您可以通过 `onDirtyMethod()` 提供方法来控制字段是否已更改。

- `onDirtyMethod`: 指定一个方法用于自定义脏检查。返回是否已更改。
    ```java
    boolean methodName();
    ```
- `serializeMethod`: 返回给定实例的唯一 ID (`Tag`)。
    ```java
    Tag methodName(@Nonnull T obj);
    ```
- `deserializeMethod`: 通过给定的 ID 创建实例。
    ```java
    T methodName(@Nonnull Tag tag)
    ```

同步过程（持久化类似）

```mermaid
flowchart LR

    A[开始: 检查只读字段] --> B{UID == 之前的快照?}

    %% 步骤 1
    B -- 否 --> C[标记字段为脏<br/>存储最新快照] --> D[同步 UID + 值<br/>通知远程更新]
    B -- 是 --> E{值变脏了?}

    %% 步骤 2
    E -- 否 --> Z[结束]
    E -- 是 --> F{有 onDirtyMethod 吗?}

    F -- 是 --> G[使用自定义方法<br/>检查脏状态]
    F -- 否 --> H[使用注册的只读类型<br/>检查脏状态]

    %% 步骤 3
    G --> I[字段变脏] --> D
    H --> I

    %% 远程端
    D --> R[远程接收更新] --> S{UID 相等?}

    %% 步骤 4
    S -- 否 --> T[通过 deserializeMethod<br/>创建新实例] --> U[通过只读类型更新值] --> Z
    S -- 是 --> U --> Z
```

1. 为了检查 `只读` 字段是否有内部更改，LDLib2 将首先检查唯一 ID 是否与之前的快照相等。
    - 如果`不相等`，则标记此字段为脏，并存储最新快照。
    - 如果`相等`，则转到步骤 2。
2. 检查值是否与之前的快照相比变脏了。
    - 如果未设置 `onDirtyMethod`，LDLib2 将根据注册的 `只读` 类型检查脏状态。
    - 如果设置了，则使用自定义方法检查是否变脏。
3. 如果字段变脏了。LDLib2 将同步 UID 和值数据，并要求远程（客户端）更新值。
4. 当远程接收到更改时，它将首先检查 UID。
    - 如果不相等，则先基于 `deserializeMethod` 创建一个新实例。
    - 然后基于注册的 `只读` 类型更新值。

示例

```java
@Persisted
@DescSynced // 修正了原文中的拼写错误 @DescSync -> @DescSynced
@ReadOnlyManaged(serializeMethod = "testGroupSerialize", deserializeMethod = "testGroupDeserialize")
private final List<TestGroup> groupList = new ArrayList<>();

public static class TestGroup implements IPersistedSerializable {
    @Persisted
    private Range rangeValue = Range.of(0, 1);
    @Persisted
    private Direction enumValue = Direction.NORTH;
    @Persisted
    private Vector3i vector3iValue = new Vector3i(0, 0, 0);
}

public IntTag testGroupSerialize(List<TestGroup> groups) {
    return IntTag.valueOf(groups.size());
}

public List<TestGroup> testGroupDeserialize(IntTag tag) {
    var groups = new ArrayList<TestGroup>();
    for (int i = 0; i < tag.getAsInt(); i++) {
        groups.add(new TestGroup());
    }
    return groups;
}
```
!!! note
    在此示例中，`onDirtyMethod` 不是必需的。因为 `TestGroup` 继承自 `IPersistedSerializable`，而 `IPersistedSerializable` 又继承自 `INBTSerializable<?>`。因此，它是一个受支持的 `只读` 类型。

---

### `@RPCMethod`
注解一个方法，您可以在服务器和远程端之间发送 RPC 数据包。只要参数支持同步，您可以自由定义方法的参数，并且可以在类中的任何位置发送 RPC。
这对于传播事件（`c->s` / `s->c`）很有用。
!!! note
    如果 `RPCSender` 被定义为方法的第一个参数。LDLib2 将提供发送者信息。

确保所有参数与注解方法的参数匹配。

```java
@RPCMethod
public void rpcTestA(RPCSender sender, String message) {
    if (sender.isServer()) {
        LDLib2.LOGGER.info("Received RPC from server: {}", message);
    } else {
        LDLib2.LOGGER.info("Received RPC from client: {}", message);
    }
}

@RPCMethod
public void rpcTestB(ItemStack item) {
    LDLib2.LOGGER.info("Received RPC: {}", item);
}

// 发送 RPC 的方法
public void sendMsgToPlayer(ServerPlayer player, String msg) {
    rpcToServer(player, "rpcTestA", msg); // 修正了缺少的分号
}

public void sendMsgToAllTrackingPlayers(ServerPlayer player, String msg) {
    rpcToTracking("rpcTestA", msg); // 修正了缺少的分号
}

public void sendMsgToServer(ItemStack item) {
    rpcToServer("rpcTestB", item); // 修正了缺少的分号
}
```

* `rpcToTracking`: 如果此区块在远程玩家的客户端中已加载（被追踪），则发送给所有远程玩家。
* `rpcToPlayer`: 发送给特定玩家。
* `rpcToServer`: 发送给服务器。

```java
@RPCMethod
public void rpcTest(String msg) {
    if (level.isClientSide) { // 接收 // 修正了 level.isClient -> level.isClientSide
        LDLib2.LOGGER.info("Received RPC from server: {}", msg); // 修正了参数名 message -> msg
    } else { // 发送
        rpcToTracking("rpcTest", msg); // 修正了缺少的分号
    }
}
```
在此示例中，您可以在一个方法内发送和接收消息，这是一种简洁的方法。

---

### `@UpdateListener`
使用此注解在远程端添加一个同步接收的监听器。

指定当注解字段从服务器更新时，要调用的方法（远程端）的名称。

第一个参数是旧值，第二个参数是新值。

```java
@DescSynced
@UpdateListener(methodName = "onIntValueChanged")
private int intValue = 10;

private void onIntValueChanged(int oldValue, int newValue) {
    LDLib2.LOGGER.info("Int value changed from {} to {}", oldValue, newValue);
}
```

---

### `@ConditionalSynced`
通常，所有用 `@DescSynced` 注解的字段在更改时都会同步。
但是，您可能希望控制是否同步，例如，条件同步。

LDLib2 提供此注解，允许您精细控制字段是否应同步。

```java
@Configurable // 注意：此示例中的 @Configurable 可能来自其他上下文或文档错误，在 LDLib2 同步上下文中常见的是 @DescSynced
@ConditionalSynced(methodName = "shouldSync")
int intField = 10;

public boolean shouldSync(int value) {
    return value > 0;
}
```

---

### `@SkipPersistedValue`
通常，所有用 `@Persisted` 注解的字段在持久化期间都会被序列化。
但是，您可能希望跳过序列化，例如，减少输出大小，跳过未更改的值等。

LDLib2 提供此注解，允许您精细控制字段是否应序列化。

```java
@Persisted
int intField = 10;

@SkipPersistedValue(field = "intField")
public boolean skipIntFieldPersisted(int value) {
    // 10 是这个类的初始值，没有必要存储它。
    return value == 10;
}
```

---

## `BlockEntity` 专用注解
!!! note
    这些注解专为 `BlockEntity` 设计，在使用前请查阅 [管理 BlockEntity](./blockentity.md){ data-preview }。

### `@DropSaved`
有时，您希望在破坏方块时将字段值存储到掉落物中。
此注解用于标记一个字段要保存到掉落物中。但是，使用前还需要额外的代码工作。
```java
public class MyBlock extends Block {
    @Override
    public void setPlacedBy(Level level, BlockPos pos, BlockState state, @Nullable LivingEntity placer, ItemStack stack) {
        if (!level.isClientSide) {
            if (level.getBlockEntity(pos) instanceof IPersistManagedHolder persistManagedHolder) {
                // 如果您愿意，可以使用其他 DataComponents。
                Optional.ofNullable(stack.get(DataComponents.CUSTOM_DATA)).ifPresent(customData -> {
                    persistManagedHolder.loadManagedPersistentData(customData.copyTag());
                });
            }
        }
    }

    @Override
    protected List<ItemStack> getDrops(BlockState state, LootParams.Builder params) {
        var opt = Optional.ofNullable(params.getOptionalParameter(LootContextParams.BLOCK_ENTITY));
        if (opt.isPresent() && opt.get() instanceof IPersistManagedHolder persistManagedHolder) {
            var drop = new ItemStack(this);
            var tag = new CompoundTag();
            persistManagedHolder.saveManagedPersistentData(tag, true);
            drop.set(DataComponents.CUSTOM_DATA, CustomData.of(tag));
            // 如果您愿意，可以将这部分移到 LootTable 中。
            return List.of(drop);
        }
        return super.getDrops(state, params);
    }

    @Override
    public ItemStack getCloneItemStack(BlockState state, HitResult target, LevelReader level, BlockPos pos, Player player) {
        // 如果您想克隆一个带有掉落数据的物品，别忘了这个
        if (level.getBlockEntity(pos) instanceof IPersistManagedHolder persistManagedHolder) {
            var clone = new ItemStack(this);
            var tag = new CompoundTag();
            persistManagedHolder.saveManagedPersistentData(tag, true);
            clone.set(DataComponents.CUSTOM_DATA, CustomData.of(tag));
            return clone;
        }
        return super.getCloneItemStack(state, target, level, pos, player);
    }
}

public class MyBlockEntity extends BlockEntity implements ISyncPersistRPCBlockEntity {
    @Persisted
    private int intValue = 10;
    @Persisted
    @DropSaved
    private ItemStack itemStack = ItemStack.EMPTY;
}
```
经过上述设置后，MyBlockEntity 中的 `itemStack` 值将在破坏和克隆时存储到物品堆中。
并且存储在物品堆中的值将在放置后恢复。

---

### `@RequireRerender`
当注解字段更新时（从服务器同步），将安排区块渲染更新。要使用此功能，您的 BlockEntity 必须继承自 `IBlockEntityManaged`。

```java
public class MyBlockEntity extends BlockEntity implements ISyncPersistRPCBlockEntity {
    @Persisted
    @DescSynced // 修正了原文中的拼写错误 @DescSync -> @DescSynced
    @RequireRerender
    private int color = -1;
}
```
它实际上等同于
```java
public class MyBlockEntity extends BlockEntity implements ISyncPersistRPCBlockEntity {
    @Persisted
    @DescSynced // 修正了原文中的拼写错误 @DescSync -> @DescSynced
    private int color = -1;

    public MyBlockEntity(BlockPos pos, BlockState state) {
        super(...)
        ...
        addSyncUpdateListener("color", this::onColorUpdated); // 添加监听器
    }

    private Consumer<Object> onColorUpdated(ManagedKey managedKey, Object currentValue) { // 修正了返回类型，原代码片段有误
        return newValue -> scheduleRenderUpdate();
    }

    public void scheduleRenderUpdate() {
        var level = getLevel();
        if (level != null) {
            if (level.isClientSide) {
                var state = getBlockState();
                level.sendBlockUpdated(getBlockPos(), state, state, 1 << 3); // 通知区块重新渲染
            }
        }
    }
}
```