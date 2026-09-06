# 蓝图节点参考

<VersionBadge version="21.1.1" label="MBD2" icon="tag" />

MBD2 在 `mbd2/…` 下提供 235 个节点。它们和 KilaGraph 的通用节点——数学、逻辑、字符串、列表、映射、流程控制以及 `mc.*` 原版节点——在同一个面板里。

<figure>
<img src="/assets/multiblocked2/blueprints/node-library.png" alt="蓝图节点库面板，列出节点分组及其条目">
<figcaption>从画布打开的节点库。分组就是下面这些 `mbd2/…` 路径。</figcaption>
</figure>

每个节点在编辑器里都自带说明，所以本页是一张面板地图，而不是逐节点清单。

<figure>
<img src="/assets/multiblocked2/blueprints/node-description.png" alt="蓝图节点说明面板，显示节点摘要与每个端口的文档">
<figcaption>选中节点会显示它做什么、每个端口是什么意思。先读那里；本页只告诉你去哪里找。</figcaption>
</figure>

## Info 节点与 Info block

有几个分组用的是两层结构。**Info 节点**——*Machine Info*、*Recipe Logic Info*、*Recipe Info*——接受一个 `target`，并通过 `Add Block` 按钮容纳若干 **Info block**，每个 block 把一个属性读到自己的输出引脚上。

这也是 `mbd2/machine` 有 38 个条目的原因：其中大多数是 *Machine Info* 的 block，而不是独立节点。`target` 不连线时，节点读取蓝图自己的机器、它的配方逻辑、或事件里的配方。

## 分组

### `mbd2/event`

**33 个节点。**每个机器事件一个入口节点，外加三个写回事件的节点：**Cancel Event**、**Set Event Recipe**、**Set Machine Drops**、**Set Interaction Result**、**Set Item Interaction Result**。

入口节点：On Load、Machine Removed、Machine Placed、Machine Tick、Client Tick、Neighbor Changed、Machine Drops、Open UI、Build UI、Use Without Item、Use Item On、Use Catalyst、State Changed、Structure Formed、Structure Invalid、Custom Data Updated、Animation Keyframe、Recipe Status Changed、Recipe Modify (Before)、Recipe Modify (After)、Before Recipe Working、On Recipe Working、On Recipe Waiting、After Recipe Working、On Consume Inputs、On Recipe Finish、Fuel Recipe Modify、Fuel Burning Finish。

::: warning
**Fuel Burning Finish** 在 `21.1.1` 中不会被派发。**Use Item On** 没有 KubeJS 对应项——这是唯一能脚本化它的途径。
:::

### `mbd2/machine` 与 `mbd2/machine/action`

**分别 38 个和 27 个节点。**机器自身的读写：状态、tier、名称、定义、坐标、正面朝向、level、方块状态、方块实体、自定义数据、offset timer、`Is Client`、`Every N Ticks`，以及 Trait 查找。action 分组是写入侧——**Set Machine State**、**Set Machine Tier**、**Set Custom Data**、**Merge Custom Data**、**Set Front Facing**、**Drop Item**、**Mark Dirty**、**Notify Block Update**、**Schedule Render Update**、**Play State Sound**、**Trigger Animation**——外加完整的 [runtime value](../editor/runtime-values.md) 接口：

| 读 | 写 |
| --- | --- |
| Get Runtime Bool / Int / Decimal / Text / IO / Box | Set Runtime Value (Boolean / Number / Decimal / Text / IO / Box) |
| Is Runtime Value Overridden、Runtime Value Names | Clear Runtime Value、Clear All Runtime Values |
| Auto IO Info、Auto World IO Info、Get Auto IO Side、Get Capability IO Side | Set Auto IO Enabled / Side / Interval、Set Auto World IO Enabled / Side / Interval / Speed / Range、Set Capability IO Side |

改自定义数据请用 **Merge Custom Data**，而不是「读—改—写」：这个 tag 是按内容而非按引用做变更追踪的，就地合并既正确又更省。

### `mbd2/machine/redstone`

**8 个节点。**`Get Redstone Signal`、`Get Direct Signal`、`Get Analog Signal` 及对应的 `Set`，外加 `Can Connect Redstone` 和 `Update Signal`。这些是机器**自己输出**的信号和按面读取。

要问「从任意方向到达这个方块的最强信号是多少」，用 KilaGraph 的原版 **Redstone Power** 节点（`mc.redstone`），喂给它机器的 `Level` 和 `Position`——`redstone_control` 就是这么做的。

### `mbd2/machine/fx`

**4 个节点。** **Play Machine FX** / **Stop Machine FX** 触发机器 [FX 库](../editor/machine-fx.md)里的命名条目。**Emit Photon FX** / **Kill Photon FX** 直接接受特效 id。四个都是客户端侧。

### `mbd2/multiblock`

**9 个节点。**`Is Formed`、`Is Formed And Valid`、`Multiblock Parts`、`Part Positions`、`Part Machine`、`Controller Machine`、`Part Controllers`、`Structure Error`、`Check Pattern`。在单方块机器上它们返回空而不是报错，所以把用到它们的蓝图绑到单方块机器上是无害的。

### `mbd2/recipe` 与 `mbd2/recipe/logic`

**分别 40 个和 26 个节点。**`mbd2/recipe` 读取并**重写**配方：时长、优先级、data、id、XEI 可见性、per-tick 标记，以及完整的内容增删改查——`Recipe Content Count`、`Recipe Content At`、`Add Recipe Content`、`Set Recipe Content`、`Remove Recipe Content`、`Clear Recipe Contents`、`Content Of`、`Content With`、`Content Value`、`Content Index Of Slot`，还有给没有类型化构造节点的 capability 准备的 NBT 通道（`Content To Nbt` / `Content From Nbt`）。`Scale Recipe` 和 `Content Modifier` 系列节点施加数量、时长、并行倍率。

`mbd2/recipe/logic` 是调度器：`Status`、`Progress`、`Progress Percent`、`Max Progress`、`Is Working` / `Waiting` / `Idle` / `Suspended` / `Active`、`Waiting Reason`、燃料状态、`Running Recipe`、`Origin Recipe Id`、`Continuous Running Time`——以及写入侧的 `Set Progress`、`Set Recipe Duration`、`Set Recipe Status`、`Set Working Enabled`、`Set Waiting`、`Interrupt Recipe`、`Mark Recipe Dirty`、`Reset Recipe Logic`。

::: info 重写配方
只能在 `Recipe Modify (Before/After)` 里，而且只能改副本——用 `Copy Recipe` / `Deep Copy Recipe` 复制、修改、再交给 **Set Event Recipe**。改注册表里的配方会影响所有机器。
:::

各模组的类型化内容构造节点在子分组里：`mbd2/recipe/create`（Rotation）、`mbd2/recipe/mekanism`（Chemical）、`mbd2/recipe/pneumaticcraft`（Pressure/Air）。物品、流体、实体的 ingredient 节点在 `mbd2/recipe` 本体。

### `mbd2/trait` 及其子分组

**六个分组共 32 个节点。**`mbd2/trait` 把 Trait 解析成类型化 handler：**Trait Item Handler**、**Trait Fluid Handler**、**Trait Energy Storage**、**Trait Definition**。其余分组在 handler 上操作：

| 分组 | 节点 |
| --- | --- |
| `mbd2/trait/item` | Slot Count、Slot Limit、Is Item Valid、Insert Item、Insert Item Into Slot、Extract Item From Slot、Set Slot |
| `mbd2/trait/energy` | Energy Info、Receive Energy、Extract Energy |
| `mbd2/trait/mekanism` | Trait Chemical Handler、Trait Heat Handler、Chemical Tank Count/Contents、Insert/Extract Chemical、Add Heat、Heat Info |
| `mbd2/trait/pneumaticcraft` | Trait Air Handler、Trait Heat Exchanger、Air Info、Add Air、Heat Exchanger Info、Add Exchanger Heat |
| `mbd2/trait/ae2` | Trait ME Storage、ME Insert、ME Extract、ME Item Count |

**Extract Item From Slot** 打开 `simulate` 就是读取槽位的方式——没有单独的「窥视」节点，忘了这个开关会真的吃掉玩家的物品。

### `mbd2/io`

**4 个节点。**`IO Info`、`IO Of Name`、`IO Choose`、`Next IO`——给需要传递 `IO` 值的图用，例如一个 auto IO 面的循环切换器。

### 可选整合

| 分组 | 需要 | 节点 |
| --- | --- | --- |
| `mbd2/naturesaura` | Nature's Aura | Aura In Area、Drain Aura、Store Aura |
| `mbd2/ars_nouveau` | Ars Nouveau | Source In Area、Take Source、Give Source |

它们只在对应模组加载时出现，和 Trait、capability 一样。

### `mbd2/ui`

**1 个节点。** **Set Item** 把 `ItemStack` 放进 UI 物品槽。UI 蓝图需要的其余能力——加载模板、按 id 选中、添加子元素、附加样式表、加 class、监听事件——都是 LDLib2 的通用 UI 节点。见 [Auto IO 面板](./built-in.md#auto-io-面板)。
