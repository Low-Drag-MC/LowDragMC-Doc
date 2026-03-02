# 介绍{{ version_badge("2.0.0", label="Since", icon="tag") }}
Minecraft mod 开发中最重复且最容易出错的任务之一是处理**服务器和客户端之间的数据同步**，以及**数据持久化**。
无论您正在与：- **块实体**- **实体**- **屏幕/GUI**- **任何你想要的物体**
...您将始终面临同样的三个问题：
1. **什么时候应该同步数据？**（每个tick？变化时？打开gui？）2. **应该同步哪些数据？**（应该处理哪些字段？）3. **应该如何序列化或保存？**（nbt io？）
!!!警告“为什么这是一个问题？”虽然同步和持久化本质上并不困难，但**干净地编写它们通常需要大量的样板代码**：
    - 重复NBT读/写逻辑    - 手动网络数据包    - 重复的同步逻辑分布在各个类中    - 轻松地使客户端/服务器状态不同步    - 难以阅读和难以维护的代码    - 不必要的同步调用导致的性能问题
---

## Mojang 编解码系统的局限性
现代 Minecraft 引入了 `Codec` 和 `StreamCodec` 系统，这极大地简化了**数据结构定义**。
然而：
!!!注意“编解码器有助于*格式化*，但不有助于*同步*”要在 mod 中实际使用 Codec，您仍然需要：
    - 手动定义编解码器结构    - 编写编码/解码逻辑    - 显式触发同步    - 管理数据包    - 向客户端发送更新
编解码器减少*格式化痛苦*，但**不会减少同步/持久代码的数量**。
---

## 简化同步和持久化
为了解决这些长期存在的问题，**LDLib2 提供了一个基于注释的数据管理框架**，它：
- 自动同步`server`和`client`之间的数据。- 自动处理任何类的持久性。- 检测更改并仅同步需要的内容。- 将序列化卸载到后台线程（多核友好）。- 以声明方式工作——只需注释字段，就完成了。
目标很简单：
!!!提示“核心思想：*您不应该手动编写同步或序列化代码*”声明字段*是什么* —LDLib2 处理同步和保存的方式。
下面是一个最小的示例，显示了您通常会在 `Vanilla (forge)` 和 `LDLib2` 之间编写多少代码。
（点击标签可切换代码）
===“❌Vanilla / Forge 风格的实现”    ```java
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
===“✅ 使用 LDLib2”    ```java
    public class ExampleBE extends BlockEntity implements ISyncPersistRPCBlockEntity {
        @Getter
        private final FieldManagedStorage syncStorage = new FieldManagedStorage(this);

        // your fields
        @Persisted
        @DescSynced
        public int energy = 0;

        @Persisted
        @DescSynced
        public String owner = "";
    }
    ```

从比较中可以看出，**LDLib2** 提供的注释驱动系统比传统的普通或 Forge 风格的方法要简单得多，并且更具表现力。
您不需要任何额外的样板。每当`energy`或`owner`发生变化时，LDLib2将自动处理：
- 变化检测- 服务器→客户端同步- 数据持久化
...无需您手动调用任何同步或保存功能。
---


## 不仅仅是更少的代码行
使用普通 Forge 工作流程，如果您想要优化同步（例如同步**仅选定的字段**，或同步**仅已更改的字段**），您通常最终会编写更复杂的代码：
- 手动脏标志跟踪- 自定义数据包结构- 显式服务器/客户端处理程序- 重复的读/写逻辑- 独立的持久性和同步系统- 多层条件逻辑
如果您想要**客户端 → 服务器**同步，则必须创建并注册您自己的网络数据包。
这会导致大量碎片，并使代码库更难维护。
---

### LDLib2 提供了更细粒度和现代的系统
相比之下，**LDLib2 的框架是细粒度的、声明性的、完全基于事件的**。
它提供：
- **自动变化检测**仅同步修改的字段。- **选择性同步**如果需要，您仍然可以手动请求字段级同步。- **自动持久化**用 `@Persisted` 标记任何字段，它会自动序列化。- **现代双向 RPC**您可以使用 LDLib2 的内置 RPC 事件系统来代替编写数据包**客户端→服务器**或**服务器→客户端**数据传输。- **后台（异步）序列化**大型或复杂的数据可以在主线程之外进行序列化。- **干净、一致的结构**所有同步和持久性逻辑都是集中式和声明性的。
由于这样的设计，LDLib2的系统不仅更容易使用，而且**更强大**，**更具可扩展性**，并且**更容易维护**。
---

### 同步和持久化的现代方法
LDLib2 将模型从：
> “每次使用时手动同步和序列化数据。”
到：
> “定义一次数据。> LDLib2 会处理剩下的事情。”
这导致：
- 更少的代码- 更少的错误- 更好的表现- 一致的跨模组结构- 更容易调试- 现代 CPU 上更好的并行性
在接下来的几页中，您将学习如何：
- 使用`@Persisted`、`@DescSynced`等注解- 管理自定义数据结构- 创建 RPC 事件- 执行手动（可选）细粒度同步- 将 LDLib2 与 BlockEntities、实体和 GUI 系统集成
LDLib2 旨在提供一个**完整、现代且高度可定制的同步框架**，适用于几乎任何模组场景。
---

## 简化编解码器和序列化
虽然现代编解码器和 StreamCodec 系统无可否认地强大，并且为较新的 Minecraft 版本中的序列化带来了巨大的改进，但**定义和使用编解码器仍然远非轻松**。 LDLib2 提供了一种更简单的、注释驱动的方法。
===“❌Vanilla / Forge 风格的实现”    ```java
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
===“✅ 使用 LDLib2”    ```java
    public class MyObject implements IPersistedSerializable {
        public final static Codec<MyObject> CODEC = PersistedParser.createCodec(MyObject::new);
        
        @Persisted(key = "rl")
        private ResourceLocation resourceLocation = LDLib2.id("test");
        @Persisted(key = "enum")
        private Direction enumValue = Direction.NORTH;
        @Persisted(key = "item")
        private ItemStack itemstack = ItemStack.EMPTY;

        // IPersistedSerializable is inherited from INBTSerializable you don't need to implement it manually
    }
    ```

### 为什么这样更好
使用普通/Forge 编解码器时，您必须：
- 定义编解码器中的每个字段- 手动映射 getter- 管理编码/解码错误- 应对注册表操作
这导致样板成本较高且维护困难。
!!!注意“LDLib2的优势”LDLib2 可以使用以下命令为您的类自动生成完整的编解码器    ```java
    PersistedParser.createCodec(MyObject::new)
    ```  
您不再需要手动列出每个字段或定义它们的编码方式。
只要某个字段用`@Persisted`注释，LDLib2就会将其包含在生成的编解码器中。
---

### 完全 NBT 支持（无需额外代码）
通过实施`IPersistedSerializable`，您的班级将获得：
- 应对注册表操作- 自动NBT序列化- 自动NBT反序列化- 与任何期望 `INBTSerializable` 的系统完全兼容