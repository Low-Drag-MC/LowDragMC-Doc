# Java 集成
你可以从我们的 [maven](https://maven.firstdark.dev/#/snapshots/com/lowdragmc) 获取最新版本。
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

# Multiblocked2 注册事件
Multiblocked2 提供了一个 Forge 事件 ([`MBDRegistryEvent`](https://github.com/Low-Drag-MC/Multiblocked2/blob/1.20.1/src/main/java/com/lowdragmc/mbd2/common/event/MBDRegistryEvent.java)) 用于注册。

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

## 通过 Java 代码注册机器
除了直接将项目文件放在 `.minecraft/assets/ldlib/mbd2/machine_type` 目录下，还有两种方式可以通过代码注册机器。

### 1. 通过原生代码创建并注册机器
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

### 2. 从模组资源文件中注册项目文件
例如，你在资源文件中拥有如下项目。

<img width="280" alt="image" src="https://github.com/user-attachments/assets/6ba5b196-cb83-4055-9788-db9960e05644">

## 注册机器项目 

event.registerFromResource(`mod class`, `project type`, `project resource`)

可用的 `project types` 如下：

* 单机项目：`single_machine`
* 多方块机器项目：`multiblock`
* Create 动力机器项目：`create_machine`

```java
@SubscribeEvent
public void onRegisterMachine(MBDRegistryEvent.Machine event) {
    event.registerFromResource(this.getClass(), "single_machine", "mbd2/machine/machine_project_file.sm");
}
```

## 注册配方类型项目 

event.registerFromResource(`mod class`, `project resource`)

```java
@SubscribeEvent
public void onRegisterRecipeType(MBDRegistryEvent.MBDRecipeType event) {
    event.registerFromResource(this.getClass(), "mbd2/recipe_type/recipe_type_file.rt");
}
```
