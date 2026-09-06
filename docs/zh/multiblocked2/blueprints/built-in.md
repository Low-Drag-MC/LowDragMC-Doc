# 内置蓝图

<VersionBadge version="21.1.1" label="MBD2" icon="tag" />

MBD2 自带十二张蓝图。每张只做一件大多数整合包都想要的事，同时也是一份可读的示例：打开它，读画布上的便签，复制到自己的资源库里再改。

机器通过 `built-in(mbd2:<name>)` 引用它们。它们保存在内存中，所以在没有内容目录的专用服务器上也能解析；编辑器以**只读**方式打开它们，要修改请用 **Copy** 复制一份。

<figure>
<img src="/assets/multiblocked2/blueprints/copy-dialog.png" alt="蓝图资源库面板列出十二张内置蓝图，并在 redstone_control 上打开了 Copy Resource To 对话框">
<figcaption>蓝图资源库，用 **Copy** 把 `redstone_control` 复制到可写的资源库里。</figcaption>
</figure>

## 叠加使用，不要合并

机器的蓝图列表是一条有序流水线，所以「红石控制 + 超频 + 额外产出」是**三条绑定**，而不是一张带开关的图。任何需要加一个「模式」参数才值得发布的东西，都应该拆成两张蓝图。

## 十二张

| 蓝图 | 挂在 | 参数 |
| --- | --- | --- |
| [`redstone_control`](#redstone-control) | Machine Tick | `requiresSignal` `false`、`threshold` `1` |
| [`comparator_progress`](#comparator-progress) | Machine Tick | `invert` `false` |
| [`environment_gate`](#environment-gate) | Before Recipe Working | `needsRain` `false` |
| [`overclock`](#overclock) | Recipe Modify (Before) | `speedPerTier` `2`、`costPerTier` `4`、`maxOverclocks` `4` |
| [`upgrade_slots`](#upgrade-slots) | Recipe Modify (Before) | `traitName` `item_slot`、`slot` `0`、`upgradeItem` 糖、`speedPerUpgrade` `0.5`、`maxUpgrades` `4` |
| [`part_count_bonus`](#part-count-bonus) | Recipe Modify (Before) | `speedPerPart` `0.05`、`maxSpeedup` `3` |
| [`upkeep`](#upkeep) | On Recipe Working | `traitName` `fluid_tank`、`amountPerTick` `10`、`reason` `Out of coolant` |
| [`chance_output`](#chance-output) | On Recipe Finish | `bonusItem` 金粒、`chance` `0.1`、`traitName` `item_slot` |
| [`output_swap`](#output-swap) | Recipe Modify (Before) | `product` 粗铁 |
| [`heat_buildup`](#heat-buildup) | Machine Tick + Recipe Modify | `heatPerTick` `1`、`coolPerTick` `2`、`maxHeat` `1000`、`bonusAtMaxHeat` `2` |
| [`auto_io_panel`](#auto-io-面板) | Build UI | `trait` `""`、`name` `""` |
| [`debug_probe`](#debug-probe) | Use Item On | `probeItem` 木棍 |

---

## Redstone control

每 tick 读取到达机器的最强红石信号，用它设置配方逻辑的 working-enabled 标记。`requiresSignal` 关闭表示「有电就停」，开启表示「有电才转」。

<figure>
<img src="/assets/multiblocked2/blueprints/builtin-redstone-control.png" alt="redstone_control 图：Read、Decide、Act 三个分组">
<figcaption>最短的完整蓝图：一个事件、一次读取、一次判断、一次写入。</figcaption>
</figure>

它读**任意面**，和红石灯一样。把 **Redstone Power** 换成 **Get Redstone Signal** 并给它一个面，就变成定向的。

## Comparator progress

把配方进度（0..1）映射到 0-15 并写入机器的模拟信号，紧贴机器放一个比较器就能读到。`invert` 翻转方向。

<figure>
<img src="/assets/multiblocked2/blueprints/builtin-comparator-progress.png" alt="comparator_progress 图：Progress Percent 经 Remap 与 To Int 进入 Set Analog Signal">
<figcaption>`Remap → To Int → Set Analog Signal` 链。把 `Progress Percent` 换掉就能改报罐子或槽位的填充度。</figcaption>
</figure>

这里不是简单的 `progress * 15`：那样会把整整一级比较器信号花在「还没开始」上。

## Environment gate

天气不符合 `needsRain` 时拒绝开始配方。已经在跑的配方不受影响，会正常跑完。

<figure>
<img src="/assets/multiblocked2/blueprints/builtin-environment-gate.png" alt="environment_gate 图：机器 Level 接入原版 Level Info 天气读取，再进入 Cancel Event">
<figcaption>从机器通向世界的桥：机器自己的 `Level` 属性接到原版 `mc.*` 节点上。</figcaption>
</figure>

它挂在 **Before Recipe Working** 上——那是还能说「不」的事件。控制某件事**是否**发生属于这里；控制它**进行期间**的条件属于 **On Recipe Working**，见 `upkeep`。

## Overclock

把机器 tier 当作超频次数，按次把时长除以 `speedPerTier`、把输入乘以 `costPerTier`。默认值下 tier 2 快 4 倍、耗材 16 倍。tier 0 什么都不改。

<figure>
<img src="/assets/multiblocked2/blueprints/builtin-overclock.png" alt="overclock 图：机器 tier 经幂运算，接 Scale Recipe 修饰器和单独的 Set Recipe Duration">
<figcaption>缩放输入和设置时长是两个节点——`Scale Recipe` 没法让它们朝相反方向变化。</figcaption>
</figure>

按 tier 而不是按当前储电：配方的代价不该取决于它碰巧什么时候开始。

## Upgrade slots

看指定物品 Trait 的某个槽位，如果里面是 `upgradeItem`，就把时长除以 `1 + 数量 * speedPerUpgrade`。这是 Mekanism / Thermal 的形态。

<figure>
<img src="/assets/multiblocked2/blueprints/builtin-upgrade-slots.png" alt="upgrade_slots 图：一次模拟取出、一次物品判断和一次时长除法">
<figcaption>`Extract Item From Slot` 打开 `simulate` 就是「读槽位而不清空它」。</figcaption>
</figure>

给机器加一个小的物品 Trait 专门放升级件，并且**不要**把它挂进配方 IO，否则升级件会被当成配方输入。

## Part count bonus

统计已成型结构的部件数量，把时长除以 `1 + 数量 * speedPerPart`，上限 `maxSpeedup`。在没有成型的机器上数量为 0，什么都不变。

<figure>
<img src="/assets/multiblocked2/blueprints/builtin-part-count-bonus.png" alt="part_count_bonus 图：Multiblock Parts 接列表长度再接时长除法">
<figcaption>所有部件一视同仁。部件列表已经引出到引脚上，加一个 `For Each` 配 `Definition Id` 判断就是很自然的下一步。</figcaption>
</figure>

## Upkeep

每个工作 tick 从指定流体 Trait 抽 `amountPerTick` mB，罐子空了就让机器停滞，并在 UI 里显示 `reason`。

<figure>
<img src="/assets/multiblocked2/blueprints/builtin-upkeep.png" alt="upkeep 图：每个工作 tick 抽流体，失败时 Set Waiting">
<figcaption>停滞会保留已完成的进度；补上流体后机器继续。</figcaption>
</figure>

想改成扣电，把那两个 trait/抽取节点换成 **Trait Energy Storage** 和 **Extract Energy** 即可。

## Chance output

每完成一次配方掷一次 `chance`，成功就把 `bonusItem` 塞进指定物品 Trait。

<figure>
<img src="/assets/multiblocked2/blueprints/builtin-chance-output.png" alt="chance_output 图：On Recipe Finish 接随机判定与物品插入">
<figcaption>挂在 **On Recipe Finish** 而不是 After Recipe Working——产物必须已经存在。</figcaption>
</figure>

槽位满了额外产物会被丢弃，和普通产物一样。

## Output swap

把配方的所有物品产出替换成 `product`。流体产出不受影响，配方仍然要匹配它原本的**输入**。

<figure>
<img src="/assets/multiblocked2/blueprints/builtin-output-swap.png" alt="output_swap 图：先 Clear Recipe Contents（OUT 侧）再 Add Recipe Content">
<figcaption>删掉 `Clear` 节点它就变成「追加」而不是「替换」。在 `IN` 侧做同样的清空与添加，就能改机器消耗什么。</figcaption>
</figure>

这张图证明了蓝图能改配方**换什么**，而不只是换多少。

## Heat buildup

机器工作时升温、空闲时降温，越热越快，在 `maxHeat` 时达到 `bonusAtMaxHeat` 倍速。

<figure>
<img src="/assets/multiblocked2/blueprints/builtin-heat-buildup.png" alt="heat_buildup 图：写在自定义数据里的每 tick 热量累加，喂给时长系数">
<figcaption>热量保存在机器自定义数据的 `heat` 键下，因此能挺过区块卸载，也能绑进机器 UI。</figcaption>
</figure>

同一套机制适用于任何「机器需要记住的东西」：维护计数、冷却时间、蓄力值。它只在热量真的变化的 tick 才写自定义数据。

## Auto IO 面板

在机器界面旁边加一条页签条，展开某个页签后显示机器的六个面，点击某个面循环切换该面的 auto IO——无、输入、输出、双向。这个设置是一个 [runtime value](../editor/runtime-values.md)，只属于那一台放置的机器，并且会存盘。

<figure>
<img src="/assets/multiblocked2/blueprints/auto-io-collapsed.png" alt="机器界面左侧叠着两个小的 auto IO 页签把手">
<figcaption>收起状态：每张绑定的蓝图一个把手，沿机器面板旁边的条带叠放。</figcaption>
</figure>

<figure>
<img src="/assets/multiblocked2/blueprints/auto-io-expanded.png" alt="展开的 auto IO 页签，显示六个面组成的十字和逐面提示">
<figcaption>展开后，鼠标悬停在顶面上。颜色来自 `lss/mbd2_auto_io.lss`，不是图里写死的。</figcaption>
</figure>

| 参数 | 含义 |
| --- | --- |
| `trait` | 要配置的 Trait 名，与 Trait 列表里显示的一致 |
| `name` | 页签标题；留空则用 Trait 自己的名字 |

如果该 Trait 不支持 auto IO，什么都不会添加。用不同的 `trait` 绑定多次，页签会沿条带**叠起来**——它们追加到同一个共享容器里，而不是各建各的面板；展开的面板会把下面的页签往下推，而不是压在它们上面。

条带定位在机器面板之外，所以追加页签永远不会挪动机器自己的内容。

<figure>
<img src="/assets/multiblocked2/blueprints/builtin-auto-io-panel.png" alt="auto_io_panel 图：UI 模板加载、元素选择、class 赋值与点击监听">
<figcaption>这里每一个节点都是通用节点。不存在一个把活儿藏在单个引脚背后的「auto IO 面板节点」。</figcaption>
</figure>

它为所有 UI 蓝图演示了两点：外观是整合包可替换的样式表；客户端通过机器的 `@DescSynced` 自定义数据得知每个面的状态——因为 runtime value 是服务端的，从不发送。

`lss/mbd2_auto_io.lss` 是作为**合并**样式表加载的，所以整合包只要在同一路径下放自己的文件、只写不认同的那几条规则就能改外观，后加载的整合包优先。样式表挂在页签条上而不是整个界面上，所以它里面的规则不会漏进机器自己的 UI。

## Debug probe

手持 `probeItem` 右键机器，它会在聊天栏报告机器状态、tier 和配方状态。点击会被消耗，所以拿着探针时不会打开 UI。

<figure>
<img src="/assets/multiblocked2/blueprints/builtin-debug-probe.png" alt="debug_probe 图：Use Item On、物品判断、字符串拼接与聊天消息">
<figcaption>往某个 Info 节点里加一个 block 并拼进消息即可——节点列表里的每一项读取方式都一样。</figcaption>
</figure>

这是判断机器是否处于你以为的状态的最快方式，而且不需要脚本或命令。
