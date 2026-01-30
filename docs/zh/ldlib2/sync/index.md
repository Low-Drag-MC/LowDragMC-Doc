# 介绍
{{ version_badge("2.0.0", label="Since", icon="tag") }}

在 Minecraft 模组开发中，最重复且容易出错的任务之一就是处理**服务器与客户端之间的数据同步**以及**数据持久化**。

无论你是在处理：
- **方块实体**
- **实体**
- **屏幕 / GUI**
- **任何你希望处理的对象**

...你总是会面临相同的三个问题：

1.  **数据应该在何时同步？** (每刻？变化时？打开GUI时？)
2.  **应该同步哪些数据？** (哪些字段需要处理？)
3.  **应该如何序列化或保存？** (NBT 读写？)

!!! warning "为什么这是个问题？"
    尽管同步和持久化本身并不困难，**但想要干净地实现它们通常需要大量样板代码**：
    - 重复的 NBT 读写逻辑
    - 手动的网络数据包
    - 散布在各处的重复同步逻辑
    - 容易导致客户端/服务器状态不同步
    - 难以阅读和维护的代码
    - 由不必要的同步调用引起的性能问题

---

## Mojang 编解码器系统的局限性

现代 Minecraft 引入了 `Codec` 和 `StreamCodec` 系统，这极大地简化了**数据结构的定义**。

然而：

!!! note "Codec 有助于解决*格式*问题，但无助于*同步*"
    要在模组中实际使用 Codec，你仍然需要：
    - 手动定义编解码器结构
    - 编写编码/解码逻辑
    - 显式触发同步
    - 管理数据包
    - 向客户端分发更新

Codec 减少了*格式化方面的痛苦*，但**并没有减少同步/持久化代码的数量**。

---

## 简化同步与持久化

为了解决这些长期存在的问题，**LDLib2 提供了一个基于注解的数据管理框架**，它能够：
- 在 `服务器` 和 `客户端` 之间自动同步数据。
- 自动处理任何类的持久化。
- 检测更改并仅同步所需内容。
- 将序列化任务卸载到后台线程（支持多核）。
- 以声明式方式工作——只需注解字段，即可完成。

目标很简单：

!!! tip "核心理念：*你不应该手动编写同步或序列化代码*"
    声明一个字段*是什么* —— LDLib2 来处理它是如何同步和保存的。

下面是一个最小示例，展示了在 `原版 (Forge)` 和 `LDLib2` 之间通常需要编写的代码量。

(点击选项卡切换代码)

=== "❌原版 / Forge 风格实现"
    ```java
    public class ExampleBE extends BlockEntity {

        private int energy = 0;
        private String owner = "";

        @Override
        public void saveAdditional(CompoundTag tag) {
            super.saveAdditional(tag);
            tag.putInt("Energy", energy);
            tag.putString("Owner", owner);
        }

        @Override
        public void load(CompoundTag tag) {
            super.load(tag);
            energy = tag.getInt("Energy");
            owner = tag.getString("Owner");
        }

        @Override
        public CompoundTag getUpdateTag() {
            CompoundTag tag = new CompoundTag();
            saveAdditional(tag);
            return tag;
        }

        @Override
        public void onDataPacket(Connection net, ClientboundBlockEntityDataPacket pkt) {
            load(pkt.getTag());
        }

        protected void syncAndSave() {
            if (!level.isClientSide) {
                setChanged();
                level.sendBlockUpdated(worldPosition, getBlockState(), getBlockState(), 3);
            }
        }

        public void setEnergy(int newEnergy) {
            if (this.energy != newEnergy) {
                this.energy = newEnergy;
                syncAndSave();
            }
        }

        public void setOwner(String newOwner) {
            if (this.energy != newOwner) {
                this.energy = newOwner;
                syncAndSave();
            }
        }
    }
    ```
=== "✅ 使用 LDLib2"
    ```java
    public class ExampleBE extends BlockEntity implements ISyncPersistRPCBlockEntity {
        @Getter
        private final FieldManagedStorage syncStorage = new FieldManagedStorage(this);

        // 你的字段
        @Persisted
        @DescSynced
        public int energy = 0;

        @Persisted
        @DescSynced
        public String owner = "";
    }
    ```

    如对比所示，**LDLib2** 提供的注解驱动系统比传统的原版或 Forge 风格方法要简洁得多，且表达能力更强。

你不需要任何额外的样板代码。
每当 `energy` 或 `owner` 发生变化时，LDLib2 将自动处理：
- 变更检测
- 服务器 → 客户端同步
- 数据持久化

...而无需你手动调用任何同步或保存函数。

---

## 不仅仅是减少代码量

使用原版 Forge 工作流时，如果你想优化同步——例如**仅同步选定的字段**，或**仅同步已更改的字段**——你最终往往会编写更复杂的代码：
- 手动脏标志跟踪
- 自定义数据包结构
- 显式的服务器/客户端处理器
- 重复的读写逻辑
- 分离的持久化和同步系统
- 多层的条件逻辑

如果你想要**客户端 → 服务器**同步，则必须创建并注册你自己的网络数据包。

这会导致大量代码碎片化，使得代码库更难维护。

---

### LDLib2 提供了更精细和现代的系统

相比之下，**LDLib2 的框架是细粒度、声明式且完全基于事件的**。

它提供：
- **自动变更检测**
  仅同步已修改的字段。
- **选择性同步**
  如果需要，你仍然可以手动请求字段级同步。
- **自动持久化**
  用 `@Persisted` 标记任何字段，它会自动序列化。
- **现代双向 RPC**
  你可以使用 LDLib2 内置的 RPC 事件系统进行**客户端 → 服务器**或**服务器 → 客户端**数据传输，而无需编写数据包。
- **后台（异步）序列化**
  大型或复杂的数据可以在主线程外进行序列化。
- **清晰、一致的结构**
  所有同步和持久化逻辑都是集中且声明式的。

由于这种设计，LDLib2 的系统不仅更易用，而且**功能更强大**、**扩展性更好**、**维护起来也容易得多**。

---

### 同步与持久化的现代方法

LDLib2 将模式从：

> “每次使用数据时都手动同步和序列化。”

转变为：

> “定义一次你的数据。
> LDLib2 负责其余一切。”

这带来了：
- 更少的代码
- 更少的错误
- 更好的性能
- 跨模组的一致结构
- 更易于调试
- 在现代 CPU 上更好的并行性

在接下来的页面中，你将学习如何：
- 使用 `@Persisted`、`@DescSynced` 和其他注解
- 管理自定义数据结构
- 创建 RPC 事件
- 执行手动（可选）细粒度同步
- 将 LDLib2 与方块实体、实体和 GUI 系统集成

LDLib2 旨在提供一个**完整、现代且高度可定制的同步框架**，适用于几乎所有的模组开发场景。

---

## 简化 Codec 与序列化

虽然现代的 Codec 和 StreamCodec 系统无疑非常强大，并为新版 Minecraft 的序列化带来了巨大改进，但**定义和使用一个 Codec 仍然远非易事**。LDLib2 提供了一种更简单、基于注解的方法。

=== "❌原版 / Forge 风格实现"
    ```java
    public class MyObject implements INBTSerializable<CompoundTag> {
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

        // for INBTSerializable
        @Override
        public CompoundTag serializeNBT(HolderLookup.Provider provider) {
            var tag = new CompoundTag();
            tag.putString("rl", resourceLocation.toString());
            tag.putString("enum", enumValue.toString());
            tag.put("item", ItemStack.OPTIONAL_CODEC.encodeStart(provider.createSerializationContext(NbtOps.INSTANCE), itemstack).getOrThrow());
            return tag;
        }

        @Override
        public void deserializeNBT(HolderLookup.Provider provider, CompoundTag nbt) {
            resourceLocation = ResourceLocation.parse(nbt.getString("rl"));
            enumValue = Direction.byName(nbt.getString("enum"));
            itemstack = ItemStack.OPTIONAL_CODEC.parse(provider.createSerializationContext(NbtOps.INSTANCE), nbt.get("item")).getOrThrow();
        }
    }
    ```
=== "✅ 使用 LDLib2"
    ```java
    public class MyObject implements IPersistedSerializable {
        public final static Codec<MyObject> CODEC = PersistedParser.createCodec(MyObject::new);
        
        @Persisted(key = "rl")
        private ResourceLocation resourceLocation = LDLib2.id("test");
        @Persisted(key = "enum")
        private Direction enumValue = Direction.NORTH;
        @Persisted(key = "item")
        private ItemStack itemstack = ItemStack.EMPTY;

        // IPersistedSerializable 继承自 INBTSerializable，你不需要手动实现它
    }
    ```

### 为什么这更好

使用原版/Forge 风格的 Codec 时，你必须：
- 在编解码器中定义每个字段
- 手动映射 getter 方法
- 管理编码/解码错误
- 处理注册表操作

这导致了高昂的样板代码成本和维护难度。

!!! note "LDLib2 的优势"
    LDLib2 可以**为你的类自动生成完整的 Codec**，使用：
    ```java
    PersistedParser.createCodec(MyObject::new)
    ```
    你不再需要手动列出每个字段或定义它们的编码方式。

    只要一个字段用 `@Persisted` 注解，LDLib2 就会将其包含在生成的 Codec 中。

---

### 完整的 NBT 支持（无需额外代码）

通过实现 `IPersistedSerializable`，你的类将获得：
- 处理注册表操作的能力
- 自动 NBT 序列化
- 自动 NBT 反序列化
- 与任何期望 `INBTSerializable` 的系统的完全兼容性