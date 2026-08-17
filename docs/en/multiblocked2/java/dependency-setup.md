# Gradle Dependency Setup

<VersionBadge version="21.0.11" label="MBD2" icon="tag" />

Use the FirstDark snapshots repository to compile a NeoForge 1.21.1 mod against MBD2. The published 21.0.11 coordinates are verified against its Maven metadata.

[![MBD2 Maven](https://img.shields.io/badge/dynamic/xml?url=https%3A%2F%2Fmaven.firstdark.dev%2Fsnapshots%2Fcom%2Flowdragmc%2Fmultiblocked2%2FMultiblocked2--1.21--1.21.1%2Fmaven--metadata.xml&query=%2F%2Fmetadata%2Fversioning%2Flatest&label=MBD2%20NeoForge%201.21.1&cacheSeconds=300)](https://maven.firstdark.dev/#/snapshots/com/lowdragmc/multiblocked2/Multiblocked2-1.21-1.21.1)

## `gradle.properties`

```properties
minecraft_version=1.21.1
mbd2_version=21.0.11
ldlib2_version=2.2.35
```

MBD2 21.0.11 declares LDLib2 2.2.31 at runtime, while the current MBD2 source workspace compiles against 2.2.35. Pin LDLib2 explicitly because Java extensions import LDLib2 annotations, configurators, UI classes, and sync APIs directly.

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

The MBD2 artifact name contains both the branch family (`1.21`) and exact Minecraft version (`1.21.1`). For the values above, the resolved coordinate is:

```text
com.lowdragmc.multiblocked2:Multiblocked2-1.21-1.21.1:21.0.11
```

Do not use the old 1.20.1 coordinate `com.lowdragmc.multiblocked2:Multiblocked2:<minecraft>-<version>`.

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

## NeoForge and Java requirements

| Requirement | Current MBD2 workspace |
| --- | --- |
| Minecraft | `1.21.1` |
| Java toolchain | Java 21 |
| NeoForge | `21.1.219` in the source workspace; mod range starts at `21.1.217` |
| LDLib2 | `2.2.35` in the source workspace |
| MBD2 mod ID | `mbd2` |

```gradle
java {
    toolchain.languageVersion = JavaLanguageVersion.of(21)
}
```

## Optional integration APIs

The core dependency is enough for core machine, recipe, Trait, and condition extensions. Add an integration mod to `compileOnly` only when your source imports that mod's API; add it to the development runtime when you need to launch and test the integration.

```gradle
dependencies {
    // Example pattern; use the integration's official coordinate/version.
    compileOnly("mekanism:Mekanism:${mekanism_version}:api")
    runtimeOnly("mekanism:Mekanism:${mekanism_version}")
}
```

Guard optional integration registration with `@LDLRegister(modID = "...")` or a loader check. A `compileOnly` dependency prevents bundling; it does not prevent class loading failures if an unguarded class references a missing mod.

## Verify resolution

```powershell
./gradlew.bat dependencies --configuration compileClasspath
./gradlew.bat compileJava
```

Confirm that the dependency report contains exactly one MBD2 and one compatible LDLib2 version. If the IDE still shows unresolved MBD2 packages, refresh the Gradle project after confirming the repository is in the project that owns the relevant dependency resolution.

::: warning Distribution
Do not shade or relocate MBD2/LDLib2 into your mod. Declare them as required dependencies in `neoforge.mods.toml` when your mod cannot run without them.
:::
