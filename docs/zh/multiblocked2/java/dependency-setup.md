# Gradle 依赖配置

<VersionBadge version="21.1.1" label="MBD2" icon="tag" />

用 FirstDark snapshots 仓库为 NeoForge 1.21.1 模组编译 MBD2 依赖。

[![MBD2 Maven](https://img.shields.io/badge/dynamic/xml?url=https%3A%2F%2Fmaven.firstdark.dev%2Fsnapshots%2Fcom%2Flowdragmc%2Fmultiblocked2%2FMultiblocked2--1.21--1.21.1%2Fmaven--metadata.xml&query=%2F%2Fmetadata%2Fversioning%2Flatest&label=MBD2%20NeoForge%201.21.1&cacheSeconds=300)](https://maven.firstdark.dev/#/snapshots/com/lowdragmc/multiblocked2/Multiblocked2-1.21-1.21.1)

## `gradle.properties`

```properties
minecraft_version=1.21.1
neo_version=21.1.238
mbd2_version=21.1.1
ldlib2_version=2.2.39.a
```

请显式固定 LDLib2 版本：Java 扩展会直接导入它的注解、Configurator、UI 类与同步 API，而 MBD2 自己声明的范围（`[2.2.39.a,)`）只是下界，不是固定值。

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

MBD2 的构件名同时包含分支系列（`1.21`）和确切的 Minecraft 版本（`1.21.1`），所以上面这组值解析出来的坐标是：

```text
com.lowdragmc.multiblocked2:Multiblocked2-1.21-1.21.1:21.1.1
```

不要使用 1.20.1 的旧坐标 `com.lowdragmc.multiblocked2:Multiblocked2:<minecraft>-<version>`。

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

## MBD2 自身的依赖要求

| 要求 | `21.1.1` |
| --- | --- |
| Minecraft | `1.21.1` |
| Java toolchain | 21 |
| NeoForge | 编译于 `21.1.238`；声明范围 `[21.1.217,)` |
| LDLib2 | `2.2.39.a`；声明范围 `[2.2.39.a,)`——**必需** |
| KilaGraph | `21.1.0.13`；声明范围 `[21.1.0.12,)`——**必需**，已 jar-in-jar 打包 |
| Photon | `2.2.5`+——**可选**，只有[机器特效](../editor/machine-fx.md)需要 |
| 模组 ID | `mbd2` |

```gradle
java {
    toolchain.languageVersion = JavaLanguageVersion.of(21)
}
```

KilaGraph 已经打包在 MBD2 的 jar 里，所以不需要声明；但如果你的扩展要添加蓝图节点，请用同版本把它加到 `compileOnly`。

## 可选整合 API

核心依赖足以编写机器、配方、Trait 与条件扩展。只有当你的源码导入了某个模组的 API 时才把它加到 `compileOnly`；需要启动测试该整合时再加到开发运行时。

```gradle
dependencies {
    // 示例写法；请使用该整合的官方坐标与版本。
    compileOnly("mekanism:Mekanism:${mekanism_version}:api")
    runtimeOnly("mekanism:Mekanism:${mekanism_version}")
}
```

可选注册请用 `@LDLRegister(modID = "...")` 或加载判断保护。`compileOnly` 能避免打包，但不能阻止未受保护的类因引用缺失模组而抛 `NoClassDefFoundError`。

::: tip 验证保护是否真的有效
配置一个把可选模组从运行时 classpath 中移除的 run 并启动它。MBD2 对 Photon 和 PneumaticCraft 就是这么做的——只有「模组缺席」的运行才能证明软依赖真的软。
:::

## 验证解析结果

```powershell
./gradlew.bat dependencies --configuration compileClasspath
./gradlew.bat compileJava
```

确认报告里只有一个 MBD2 和一个兼容的 LDLib2。IDE 仍然提示 MBD2 包未解析时，刷新 Gradle 项目。

::: warning 分发
不要把 MBD2 或 LDLib2 shade / relocate 进你的模组。请在 `neoforge.mods.toml` 里把它们声明为必需依赖。
:::
