# Getting Started

<VersionBadge version="2.2.44" label="Since" icon="tag" />

This page adds `ldlib2-compose` to a mod, then opens a client-only screen and a menu built from composables.

::: tip
The short version of the setup is also on the Java Integration page, under [Optional module: ldlib2-compose](../../java_integration.md#optional-module-ldlib2-compose). Compose is not part of the LDLib2 jar: none of the APIs below are available until the dependency is added.
:::

## Requirements

| Requirement | Version |
| --- | --- |
| Minecraft / NeoForge | 1.21.1. Builds for 26.x are not published yet; see [Versions](#versions). |
| LDLib2 | 2.2.44 or later |
| `ldlib2-compose` | `21.0.0.1` or later on the 1.21 line |
| Kotlin | `org.jetbrains.kotlin.jvm` **and** `org.jetbrains.kotlin.plugin.compose`, both 2.1.20 |

Composable functions must be written in Kotlin. The Compose compiler plugin only processes Kotlin sources, so Java cannot declare a `@Composable` function or lambda. Java code can still create a `ComposeElement` whose content comes from Kotlin.

## Versions

`ldlib2-compose` is built separately for each Minecraft version, and its version number says which one.

| Version | Minecraft | Meaning |
| --- | --- | --- |
| `21.0.0.1` | 1.21.x | First release for 1.21.x |
| `21.0.0.2` | 1.21.x | Next release for 1.21.x |
| `26.1.0.1` | 26.1 | First release for 26.1 (not published yet) |

- The first two parts name the Minecraft line the jar is built for: `21.0` is 1.21.x, `26.1` is 26.1. The last two parts count this module's releases on that line.
- The artifact name carries the Minecraft version as well, like the core: `ldlib2-compose-1.21.1` goes with `ldlib2-neoforge-1.21.1`.
- Each release states the oldest LDLib2 it needs. `21.0.0.1` needs LDLib2 2.2.44.
- Only 1.21.1 is published so far.

::: warning One jar per Minecraft version
A jar only runs on the Minecraft line it was built for, because it is compiled against that line's Minecraft and LDLib2 classes. Always take the artifact named after your Minecraft version.
:::

## Add the dependency

`ldlib2-compose` is published to Maven only. Players never install it on its own, so your mod ships it as Jar-in-Jar.

```groovy
plugins {
    id 'org.jetbrains.kotlin.jvm' version '2.1.20'
    // Must be the same version as kotlin.jvm, or @Composable code will not compile.
    id 'org.jetbrains.kotlin.plugin.compose' version '2.1.20'
}

repositories {
    maven { url = "https://maven.firstdark.dev/snapshots" }
    maven {
        // androidx.annotation / androidx.collection, pulled in by the Compose runtime.
        url = "https://maven.google.com"
        content { includeGroupByRegex "androidx\\..*" }
    }
}

jarJar.enable()

dependencies {
    implementation "com.lowdragmc.ldlib2:ldlib2-compose-1.21.1:21.0.0.1"
    jarJar(group: 'com.lowdragmc.ldlib2', name: 'ldlib2-compose-1.21.1') {
        version { require '[21.0.0.1,)'; prefer '21.0.0.1' }
    }
}
```

The single `jarJar` line is enough. It bundles the `-all` jar of `ldlib2-compose`, which already embeds the Compose runtime, and NeoForge unpacks nested Jar-in-Jar recursively. Do not add the runtime libraries to your own `jarJar` as well.

`require` plus `prefer` lets NeoForge keep the newest copy when several mods bundle `ldlib2-compose`.

Declare both mods in `neoforge.mods.toml`:

```toml
[[dependencies.yourmod]]
modId = "ldlib2"            # installed by the player
type = "required"
versionRange = "[2.2.44,)"

[[dependencies.yourmod]]
modId = "ldlib2_compose"    # inside your jar
type = "required"
versionRange = "[21.0.0.1,)"
```

::: warning Startup check
At startup, `ldlib2-compose` checks that it can load the Compose runtime. If a mod bundles the plain jar instead of the `-all` jar, the game stops with `ldlib2-compose could not load the Compose runtime it ships with`. Fix the `jarJar` declaration of the mod that bundles it.
:::

## A client-only screen

`composeModularUI` builds a `ModularUI` whose root is a `ComposeElement`. Open it with `ModularUIScreen` like any other client-only UI:

```kotlin
@Composable
fun Counter() {
    var count by remember { mutableStateOf(0) }

    Column(layout = { width(120.px); padding { all(6.px) }; gap { all(4.px) } }) {
        Text("Clicked $count times")
        Button(onClick = { count++ }, text = "Click")
    }
}

fun openCounter() {
    val mc = Minecraft.getInstance()
    val mui = composeModularUI(mc.player, StylesheetManager.MODERN) { Counter() }
    mc.setScreen(ModularUIScreen(mui, Component.literal("Counter")))
}
```

| Function | Returns |
| --- | --- |
| `composeUI(vararg stylesheets: ResourceLocation, stateKey: String? = null, content)` | `UI` |
| `composeUI(stylesheets: List<Stylesheet>, stateKey: String? = null, content)` | `UI` |
| `composeModularUI(player: Player? = null, vararg stylesheets: ResourceLocation, stateKey: String? = null, content)` | `ModularUI` |

`stateKey` keeps `rememberSaveable` state across closing and reopening the screen. See [State and Sync](./state-and-sync.md#remembersaveable).

## Inside an existing tree

`ComposeElement` is a regular `UIElement`. Add it anywhere in a tree built with Java, the Kotlin DSL or XML:

```kotlin
parent.addChild(ComposeElement { Counter() })
```

The first composition runs inside the constructor, so the children exist as soon as it returns. Call `setContent { ... }` to replace the content, and `dispose()` to tear the composition down for good.

## A menu

In a menu, `createUI` runs on both sides. Build the `ComposeElement` there, so both sides have it, and add it to the tree:

```kotlin
class MyBlock(properties: BlockBehaviour.Properties) : Block(properties), BlockUIMenuType.BlockUI {

    override fun useWithoutItem(state: BlockState, level: Level, pos: BlockPos,
                                player: Player, hit: BlockHitResult): InteractionResult {
        if (!level.isClientSide) BlockUIMenuType.openUI(player as ServerPlayer, pos)
        return InteractionResult.SUCCESS
    }

    override fun createUI(holder: BlockUIMenuType.BlockUIHolder): ModularUI {
        val root = UIElement()
        root.addChild(ComposeElement { MachinePanel() })
        return ModularUI.of(UI.of(root, StylesheetManager.MODERN), holder.player)
    }
}
```

The composition itself only runs on the client. On the server, `ComposeElement` only records its content.

::: warning Register outside the composition
Sync values, RPC events and menu slots are matched between the two sides by registration order. Anything that registers must be created in `createUI`, outside the composition: data bindings, `setOnServerClick`, `addServerEventListener`, `InventorySlots`, or an `ItemSlot` bound to a container. See [State and Sync](./state-and-sync.md#server-driven-ui).
:::

## Running in development

Run the game with `gradlew runClient`, or with an IDE run configuration that calls that Gradle task.

::: warning IntelliJ coroutine agent
If the first Compose screen fails with `IllegalAccessError: class kotlin.coroutines.jvm.internal.DebugProbesKt ... cannot access class kotlinx.coroutines.debug.internal.DebugProbesImpl`, IntelliJ has attached its coroutine debug agent. NeoForge's module layer rejects what that agent does. Turn it off in the IDE settings (search for "coroutine agent"), or launch with `gradlew runClient`. This cannot happen outside a development environment.
:::
