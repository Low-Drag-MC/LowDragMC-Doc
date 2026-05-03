# Introduction
{{ version_badge("2.0.0", label="Since", icon="tag") }}

One of the most repetitive and error-prone tasks in Minecraft mod development is handling  
**data synchronization between server and client**, as well as **data persistence**.

Whether you are working with:  
- **Block Entities**  
- **Entities**  
- **Screens / GUIs**  
- **Any object that you want**  

...you will always face the same three questions:

1. **When should the data be synchronized?** (per tick？on change？open gui？)
2. **What data should be synchronized?** (which fields should be handled?)
3. **How should it be serialized or saved?** (nbt io?)

!!! warning "Why is this such a problem?"
    Although synchronization and persistence are not inherently difficult,  **writing them cleanly usually requires a large amount of boilerplate code**:  

    - Repeated NBT read/write logic  
    - Manual networking packets  
    - Duplicate sync logic spread across classes  
    - Easily desynchronized client/server states  
    - Hard-to-read and hard-to-maintain code  
    - Performance issues caused by unnecessary sync calls

---

## The Limitations of Mojang’s Codec System

Modern Minecraft introduces the `Codec` and `StreamCodec` systems,  
which greatly simplify **data structure definition**.

However:

!!! note "Codec helps with *format*, but not with *syncing*"
    To actually use Codec in a mod, you still need to:

    - Manually define codec structures  
    - Write encode/decode logic  
    - Explicitly trigger synchronization  
    - Manage packets  
    - Dispatch updates to the client  

Codec reduces *formatting pain*,  
but **does not reduce the amount of sync/persistence code**.

---

## Simplifying synchronization and persistence

To solve these long-standing issues, **LDLib2 provides an annotation-based data management framework** that:

- Automatically synchronizes data between `server` and `client`.
- Automatically handles persistence for any classes.
- Detects changes and syncs only what is needed.
- Offloads serialization to background threads (multi-core friendly).
- Works declaratively—just annotate fields, and you’re done. 

The goal is simple:

!!! tip "Core idea: *You should not write sync or serialization code manually*"
    Declare what a field *is* —  
    LDLib2 handles how it is synced and saved.

Below is a minimal example showing how much code you would normally write between `Vanilla (forge)` and `LDLib2`. 

(click the tab to switch code)

=== "❌Vanilla / Forge-style Implementation"
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
=== "✅ With LDLib2"
    ```java
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

    As you can see from the comparison, the annotation-driven system provided by **LDLib2** is dramatically simpler and far more expressive than the traditional vanilla or Forge-style approach.

You do not need any additional boilerplate.  
Whenever `energy` or `owner` changes, LDLib2 will automatically handle:

- change detection  
- server → client synchronization  
- data persistence

…without requiring you to manually call any sync or save function.

---


## More Than Just Fewer Lines of Code

With the vanilla Forge workflow, if you want to optimize synchronization—such as syncing **only selected fields**, or syncing **only fields that have changed**—you often end up writing even more complex code:

- manual dirty-flag tracking  
- custom packet structures  
- explicit server/client handlers  
- duplicated read/write logic  
- separate persistence and sync systems  
- multiple layers of conditional logic  

And if you want **client → server** synchronization, you must create and register your own networking packets.

This leads to a lot of fragmentation and makes the codebase harder to maintain.

---

### LDLib2 Provides a More Granular and Modern System

In contrast, **LDLib2’s framework is fine-grained, declarative, and fully event-based**.

It provides:

- **Automatic change detection**  
  Only modified fields are synchronized.
- **Selective synchronization**  
  You can still manually request field-level sync if you need to.
- **Automatic persistence**  
  Mark any field with `@Persisted` and it is serialized automatically.
- **Modern bidirectional RPC**  
  Instead of writing packets, you can use LDLib2’s built-in RPC event system for  
  **client → server** or **server → client** data transfer.
- **Background (asynchronous) serialization**  
  Large or complex data can be serialized off the main thread.
- **Clean, consistent structure**  
  All sync and persistence logic is centralized and declarative.

Because of this design, LDLib2’s system is not only easier to use,  
but also **more powerful**, **more scalable**, and **far easier to maintain**.

---

### A Modern Approach to Sync & Persistence

LDLib2 shifts the model from:

> “Manually synchronize and serialize data every time you use it.”

to:

> “Define your data once.  
> LDLib2 takes care of the rest.”

This results in:

- less code  
- fewer bugs  
- better performance  
- a consistent cross-mod structure  
- easier debugging  
- better parallelism on modern CPUs  

In the following pages, you will learn how to:

- use `@Persisted`, `@DescSynced`, and other annotations  
- manage custom data structures  
- create RPC events  
- perform manual (optional) fine-grained sync  
- integrate LDLib2 with BlockEntities, Entities, and GUI systems  

LDLib2 aims to provide a **complete, modern, and highly customizable synchronization framework** suitable for almost any modding scenario.

---

## Simplifying Codec & Serialization

While the modern Codec and StreamCodec systems are undeniably powerful and bring a huge improvement to serialization in newer Minecraft versions, **defining and using a Codec is still far from effortless**. LDLib2 offers a simpler, annotation-driven approach.

=== "❌Vanilla / Forge-style Implementation"
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
=== "✅ With LDLib2"
    ```java
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

### Why This Is Better

With vanilla/Forge Codec usage, you must:

- define every field in the codec  
- manually map getters  
- manage encode/decode errors
- cope with registry ops

This leads to high boilerplate cost and maintenance difficulty.

!!! note "LDLib2's Advantage"
    LDLib2 can **automatically generate a full Codec** for your class using  
    ```java
    PersistedParser.createCodec(MyObject::new)
    ```  
    You no longer need to manually list each field or define how they are encoded.

    As long as a field is annotated with `@Persisted`, LDLib2 includes it in the generated Codec.

---

### Full NBT Support (No Extra Code Required)

By implementing `IPersistedSerializable`, your class gains:

- cope with registry ops
- automatic NBT serialization  
- automatic NBT deserialization  
- full compatibility with any system expecting `INBTSerializable`  
