# Java Integration
You can find the latest version from our [maven](https://maven.firstdark.dev/#/snapshots/com/lowdragmc).
```gradle
repositories{
    maven {
        name "firstdarkdev"
        url "https://maven.firstdark.dev/snapshots"
    }
}

dependencies {
    implementation fg.deobf("com.lowdragmc.ldlib:ldlib-forge-{minecraft_version}:{latest_version}") { transitive = false }
    implementation fg.deobf("com.lowdragmc.multiblocked2:Multiblocked2:{minecraft_version}-{latest_version}") { transitive = false }
}
```

# Multiblocked2 Registry Event
Multiblocked2 provides a Forge event ([`MBDRegistryEvent`](https://github.com/Low-Drag-MC/Multiblocked2/blob/1.20.1/src/main/java/com/lowdragmc/mbd2/common/event/MBDRegistryEvent.java)) for registries.

```java
public class MBDEvents {

    @SubscribeEvent
    public void onRegisterMachine(MBDRegistryEvent.Machine event) {
        System.out.println("Registering machine");
    }

    @SubscribeEvent
    public void onRegisterRecipeType(MBDRegistryEvent.MBDRecipeType event) {
        System.out.println("Registering recipe type");
    }

    // other events....
}

public void modInit() {
    IEventBus eventBus = FMLJavaModLoadingContext.get().getModEventBus();
    eventBus.register(new MBDEvents());
}
```

## Register machines via Java Code
Instead of place projecs files under the `.minecraft/assets/ldlib/mbd2/machine_type` directly, there are two ways to register machines via code.

### 1. Create and register machines via raw code
```java
@SubscribeEvent
public void onRegisterMachine(MBDRegistryEvent.Machine event) {
    var renderer = new IModelRenderer(MBD2.id("block/pedestal"));
    event.register(MBDMachineDefinition.builder()
            .id(MBD2.id("test_machine"))
                    .rootState(MachineState.builder()
                            .name("base")
                            .renderer(renderer)
                            .shape(Shapes.block())
                            .lightLevel(0)
                            .build())
            .blockProperties(ConfigBlockProperties.builder().build())
            .itemProperties(ConfigItemProperties.builder().build())
            .build());
}
```

### 2. Register project files from your mod resource assets
For example, you have such projects in your resource assets like this.

<img width="280" alt="image" src="https://github.com/user-attachments/assets/6ba5b196-cb83-4055-9788-db9960e05644">

## Register Machine Project 

event.registerFromResource(`mod class`, `project type`, `project resource`)

Available `project types` are below:

* single machine project: `single_machine`
* multiblock machine project: `multiblock`
* create kinematic machien project: `create_machine`

```java
@SubscribeEvent
public void onRegisterMachine(MBDRegistryEvent.Machine event) {
    event.registerFromResource(this.getClass(), "single_machine", "mbd2/machine/machine_project_file.sm");
}
```

## Register Recipe Type Project 

event.registerFromResource(`mod class`, `project resource`)

```java
@SubscribeEvent
public void onRegisterRecipeType(MBDRegistryEvent.MBDRecipeType event) {
    event.registerFromResource(this.getClass(), "mbd2/recipe_type/recipe_type_file.rt");
}
```