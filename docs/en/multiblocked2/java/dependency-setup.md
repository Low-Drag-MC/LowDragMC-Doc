# Gradle Dependency Setup

<VersionBadge version="21.1.1" label="MBD2" icon="tag" />

Use the FirstDark snapshots repository to compile a NeoForge 1.21.1 mod against MBD2.

[![MBD2 Maven](https://img.shields.io/badge/dynamic/xml?url=https%3A%2F%2Fmaven.firstdark.dev%2Fsnapshots%2Fcom%2Flowdragmc%2Fmultiblocked2%2FMultiblocked2--1.21--1.21.1%2Fmaven--metadata.xml&query=%2F%2Fmetadata%2Fversioning%2Flatest&label=MBD2%20NeoForge%201.21.1&cacheSeconds=300)](https://maven.firstdark.dev/#/snapshots/com/lowdragmc/multiblocked2/Multiblocked2-1.21-1.21.1)

## `gradle.properties`

```properties
minecraft_version=1.21.1
neo_version=21.1.238
mbd2_version=21.1.1
ldlib2_version=2.2.39.a
```

Pin LDLib2 explicitly: Java extensions import its annotations, configurators, UI classes and sync APIs directly, and MBD2's own declared range (`[2.2.39.a,)`) is a lower bound, not a pin.

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

The MBD2 artifact name contains both the branch family (`1.21`) and the exact Minecraft version (`1.21.1`), so the resolved coordinate for the values above is:

```text
com.lowdragmc.multiblocked2:Multiblocked2-1.21-1.21.1:21.1.1
```

Do not use the 1.20.1 coordinate `com.lowdragmc.multiblocked2:Multiblocked2:<minecraft>-<version>`.

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

## What MBD2 itself requires

| Requirement | `21.1.1` |
| --- | --- |
| Minecraft | `1.21.1` |
| Java toolchain | 21 |
| NeoForge | Built against `21.1.238`; declared range `[21.1.217,)` |
| LDLib2 | `2.2.39.a`; declared range `[2.2.39.a,)` — **required** |
| KilaGraph | `21.1.0.13`; declared range `[21.1.0.12,)` — **required**, jar-in-jar'd |
| Photon | `2.2.5`+ — **optional**, needed only for [machine effects](../editor/machine-fx.md) |
| Mod ID | `mbd2` |

```gradle
java {
    toolchain.languageVersion = JavaLanguageVersion.of(21)
}
```

KilaGraph is bundled inside the MBD2 jar, so you do not declare it — but if your extension adds blueprint nodes, add it to `compileOnly` at the same version.

## Optional integration APIs

The core dependency is enough for machine, recipe, Trait and condition extensions. Add an integration mod to `compileOnly` only when your source imports that mod's API, and to the development runtime when you need to launch and test it.

```gradle
dependencies {
    // Example pattern; use the integration's official coordinate and version.
    compileOnly("mekanism:Mekanism:${mekanism_version}:api")
    runtimeOnly("mekanism:Mekanism:${mekanism_version}")
}
```

Guard optional registration with `@LDLRegister(modID = "...")` or a loader check. `compileOnly` prevents bundling; it does not prevent a `NoClassDefFoundError` from an unguarded class that references a missing mod.

::: tip Verify that the guard works
Configure a run that removes the optional mod from the runtime classpath and launch it. MBD2 does exactly this for Photon and PneumaticCraft — an absent-mod run is the only thing that proves a soft dependency is really soft.
:::

## Verify resolution

```powershell
./gradlew.bat dependencies --configuration compileClasspath
./gradlew.bat compileJava
```

Confirm the report contains exactly one MBD2 and one compatible LDLib2. If the IDE still shows unresolved MBD2 packages, refresh the Gradle project.

::: warning Distribution
Do not shade or relocate MBD2 or LDLib2 into your mod. Declare them as required dependencies in `neoforge.mods.toml`.
:::
