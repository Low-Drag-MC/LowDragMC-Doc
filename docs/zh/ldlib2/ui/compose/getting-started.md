# 快速开始

<VersionBadge version="2.2.44" label="自" icon="tag" />

本页把 `ldlib2-compose` 加进模组，然后打开一个由 composable 构建的纯客户端界面和一个菜单。

::: tip
简要的安装步骤也写在 Java 集成页的[可选模块：ldlib2-compose](../../java_integration.md#optional-module-ldlib2-compose)。Compose 不在 LDLib2 的 jar 里：添加依赖之前，下面的 API 都用不了。
:::

## 前置条件

| 依赖 | 版本 |
| --- | --- |
| Minecraft / NeoForge | 1.21.1。26.x 的构建尚未发布，见[版本号](#versions)。 |
| LDLib2 | 2.2.44 或更高 |
| `ldlib2-compose` | 1.21 版本线上的 `21.0.0.1` 或更高 |
| Kotlin | `org.jetbrains.kotlin.jvm` **和** `org.jetbrains.kotlin.plugin.compose`，都为 2.1.20 |

Composable 函数必须用 Kotlin 编写。Compose 编译器插件只处理 Kotlin 源码，所以 Java 无法声明 `@Composable` 函数或 lambda。Java 代码仍然可以创建一个内容来自 Kotlin 的 `ComposeElement`。

## 版本号 {#versions}

`ldlib2-compose` 针对每个 Minecraft 版本单独构建，版本号本身就说明了它对应哪个版本。

| 版本号 | Minecraft | 含义 |
| --- | --- | --- |
| `21.0.0.1` | 1.21.x | 1.21.x 的第一个版本 |
| `21.0.0.2` | 1.21.x | 1.21.x 的下一个版本 |
| `26.1.0.1` | 26.1 | 26.1 的第一个版本（尚未发布） |

- 前两段是 jar 所针对的 Minecraft 版本线：`21.0` 对应 1.21.x，`26.1` 对应 26.1。后两段是本模块在这条版本线上的发布序号。
- artifact 名同样带 Minecraft 版本，和核心库一致：`ldlib2-compose-1.21.1` 对应 `ldlib2-neoforge-1.21.1`。
- 每个版本都会注明所需的最低 LDLib2 版本。`21.0.0.1` 需要 LDLib2 2.2.44。
- 目前只发布了 1.21.1。

::: warning 每个 Minecraft 版本一个 jar
一个 jar 只能用在它所针对的 Minecraft 版本线上，因为它是针对该版本线的 Minecraft 和 LDLib2 类编译的。请始终使用以你的 Minecraft 版本命名的 artifact。
:::

## 添加依赖

`ldlib2-compose` 只发布到 Maven。玩家不会单独安装它，所以由你的模组以 Jar-in-Jar 方式带上。

```groovy
plugins {
    id 'org.jetbrains.kotlin.jvm' version '2.1.20'
    // 必须与 kotlin.jvm 版本一致，否则 @Composable 代码无法编译。
    id 'org.jetbrains.kotlin.plugin.compose' version '2.1.20'
}

repositories {
    maven { url = "https://maven.firstdark.dev/snapshots" }
    maven {
        // Compose runtime 依赖的 androidx.annotation / androidx.collection。
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

一行 `jarJar` 就够了。它打包的是 `ldlib2-compose` 的 `-all` jar，里面已经内嵌了 Compose runtime，而 NeoForge 会递归解包嵌套的 Jar-in-Jar。不要再把 runtime 库加进你自己的 `jarJar`。

`require` 加 `prefer` 的写法让 NeoForge 在多个模组都带了 `ldlib2-compose` 时保留最新的一份。

在 `neoforge.mods.toml` 里声明两个模组：

```toml
[[dependencies.yourmod]]
modId = "ldlib2"            # 由玩家安装
type = "required"
versionRange = "[2.2.44,)"

[[dependencies.yourmod]]
modId = "ldlib2_compose"    # 在你的 jar 里
type = "required"
versionRange = "[21.0.0.1,)"
```

::: warning 启动检查
`ldlib2-compose` 启动时会检查能否加载 Compose runtime。如果某个模组打包的是普通 jar 而不是 `-all` jar，游戏会以 `ldlib2-compose could not load the Compose runtime it ships with` 停止。请修正打包它的那个模组的 `jarJar` 声明。
:::

## 纯客户端界面

`composeModularUI` 构建一个根元素为 `ComposeElement` 的 `ModularUI`。像其他纯客户端 UI 一样，用 `ModularUIScreen` 打开：

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

| 函数 | 返回 |
| --- | --- |
| `composeUI(vararg stylesheets: ResourceLocation, stateKey: String? = null, content)` | `UI` |
| `composeUI(stylesheets: List<Stylesheet>, stateKey: String? = null, content)` | `UI` |
| `composeModularUI(player: Player? = null, vararg stylesheets: ResourceLocation, stateKey: String? = null, content)` | `ModularUI` |

`stateKey` 让 `rememberSaveable` 状态在关闭并重新打开界面后保留。见[状态与同步](./state-and-sync.md#remembersaveable)。

## 放进已有的树

`ComposeElement` 是一个普通的 `UIElement`。可以把它加到用 Java、Kotlin DSL 或 XML 构建的任何树里：

```kotlin
parent.addChild(ComposeElement { Counter() })
```

第一次组合在构造函数里执行，所以构造返回时子元素就已经存在。调用 `setContent { ... }` 替换内容，调用 `dispose()` 永久销毁组合。

## 菜单

在菜单中，`createUI` 会在两端都执行。在那里构建 `ComposeElement`，让两端都有它，然后加进树里：

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

组合本身只在客户端运行。在服务端，`ComposeElement` 只记录它的内容。

::: warning 在组合之外注册
同步值、RPC 事件和菜单槽位按注册顺序在两端之间对应。任何会注册的东西都必须在 `createUI` 里、组合之外创建：数据绑定、`setOnServerClick`、`addServerEventListener`、`InventorySlots`，或绑定到容器的 `ItemSlot`。见[状态与同步](./state-and-sync.md#server-driven-ui)。
:::

## 开发环境运行

用 `gradlew runClient` 启动游戏，或者用调用该 Gradle 任务的 IDE 运行配置。

::: warning IntelliJ 协程调试 agent
如果第一个 Compose 界面以 `IllegalAccessError: class kotlin.coroutines.jvm.internal.DebugProbesKt ... cannot access class kotlinx.coroutines.debug.internal.DebugProbesImpl` 失败，说明 IntelliJ 挂上了它的协程调试 agent，而 NeoForge 的模块层不允许这个 agent 做的改写。在 IDE 设置里搜索 "coroutine agent" 并关闭它，或者改用 `gradlew runClient` 启动。这在开发环境之外不会发生。
:::
