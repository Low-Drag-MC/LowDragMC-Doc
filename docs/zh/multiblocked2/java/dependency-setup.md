# Gradle 依赖配置

<VersionBadge version="21.0.11" label="MBD2" icon="tag" />

使用 FirstDark snapshots 仓库，让 NeoForge 1.21.1 模组在编译期依赖 MBD2。下面的 21.0.11 坐标已与实际 Maven metadata 核对。

[![MBD2 Maven](https://img.shields.io/badge/dynamic/xml?url=https%3A%2F%2Fmaven.firstdark.dev%2Fsnapshots%2Fcom%2Flowdragmc%2Fmultiblocked2%2FMultiblocked2--1.21--1.21.1%2Fmaven--metadata.xml&query=%2F%2Fmetadata%2Fversioning%2Flatest&label=MBD2%20NeoForge%201.21.1&cacheSeconds=300)](https://maven.firstdark.dev/#/snapshots/com/lowdragmc/multiblocked2/Multiblocked2-1.21-1.21.1)

## `gradle.properties`

```properties
minecraft_version=1.21.1
mbd2_version=21.0.11
ldlib2_version=2.2.35
```

MBD2 21.0.11 的发布 metadata 将 LDLib2 2.2.31 声明为 runtime 依赖，而当前 MBD2 源码工作区使用 2.2.35 编译。Java 扩展会直接导入 LDLib2 的注解、Configurator、UI 与同步 API，因此应显式固定 LDLib2 版本。

## Groovy `build.gradle`

```gradle
repositories {
    maven {
        name = "FirstDark snapshots"
        url = uri("https://maven.firstdark.dev/snapshots")
    }
}

dependencies {
    implementation("com.lowdragmc.multiblocked2:" +
            "Multiblocked2-1.21-${minecraft_version}:${mbd2_version}")

    implementation("com.lowdragmc.ldlib2:" +
            "ldlib2-neoforge-${minecraft_version}:${ldlib2_version}:all")
}
```

MBD2 artifact 名同时包含分支系列 `1.21` 和准确 Minecraft 版本 `1.21.1`。使用上述属性后，最终坐标为：

```text
com.lowdragmc.multiblocked2:Multiblocked2-1.21-1.21.1:21.0.11
```

不要继续使用旧 1.20.1 文档中的 `com.lowdragmc.multiblocked2:Multiblocked2:<minecraft>-<version>`。

## Kotlin DSL

```kotlin
repositories {
    maven("https://maven.firstdark.dev/snapshots") {
        name = "FirstDark snapshots"
    }
}

dependencies {
    implementation(
        "com.lowdragmc.multiblocked2:" +
            "Multiblocked2-1.21-${property("minecraft_version")}:" +
            property("mbd2_version")
    )
    implementation(
        "com.lowdragmc.ldlib2:" +
            "ldlib2-neoforge-${property("minecraft_version")}:" +
            "${property("ldlib2_version")}:all"
    )
}
```

## NeoForge 与 Java 要求

| 要求 | 当前 MBD2 工作区 |
| --- | --- |
| Minecraft | `1.21.1` |
| Java toolchain | Java 21 |
| NeoForge | 源码工作区使用 `21.1.219`；模组范围从 `21.1.217` 开始 |
| LDLib2 | 源码工作区使用 `2.2.35` |
| MBD2 mod ID | `mbd2` |

```gradle
java {
    toolchain.languageVersion = JavaLanguageVersion.of(21)
}
```

## 可选集成 API

核心依赖已经足够编写机器、配方、Trait 和条件扩展。只有源码确实导入某个集成模组的 API 时才添加 `compileOnly`；需要启动开发环境验证集成时，再把模组加入开发 runtime。

```gradle
dependencies {
    // 示例模式；坐标与版本应以集成模组官方配置为准。
    compileOnly("mekanism:Mekanism:${mekanism_version}:api")
    runtimeOnly("mekanism:Mekanism:${mekanism_version}")
}
```

使用 `@LDLRegister(modID = "...")` 或加载器检查保护可选集成注册。`compileOnly` 只是不打包依赖，并不能阻止未受保护的类在缺少对应模组时加载失败。

## 验证依赖解析

```powershell
./gradlew.bat dependencies --configuration compileClasspath
./gradlew.bat compileJava
```

确认依赖报告中只有一个 MBD2 和一个兼容的 LDLib2 版本。如果 IDE 仍无法解析 MBD2 包，先确认仓库声明位于真正负责依赖解析的工程，再刷新 Gradle project。

::: warning 分发
不要把 MBD2/LDLib2 shade 或 relocate 进自己的模组。若缺少它们时模组无法运行，应在 `neoforge.mods.toml` 中声明 required dependency。
:::
