# Ars Nouveau

<VersionBadge version="21.1.1" label="Since" icon="tag" />

Ars Nouveau 整合把 **Source** 作为配方 capability 加入，提供两种支付方式，外加一个只观察的条件。Source 在 Ars Nouveau 里到处都是一个普通整数，所以除了数量之外没有别的要建模。

<figure>
<img src="/assets/multiblocked2/integrations/ars-nouveau.png" alt="MBD2 机器 Trait 编辑器显示 Ars Nouveau Source Storage Trait 的容量、最大接收、最大提取和对外暴露设置">
<figcaption>`ars_source_storage` Trait：机器自带的 Source 缓冲。</figcaption>
</figure>

## 加入了什么

| 层 | 注册名 | 用途 |
| --- | --- | --- |
| 配方 capability | `ars_source` | 整数 Source 输入/输出 |
| Trait | `ars_source_storage` | 机器自带的 Source 缓冲，并暴露为 Ars Nouveau capability |
| Trait | `ars_nearby_source` | 消耗机器周围源罐里的 Source |
| 条件 | `ars_source_nearby` | 检查附近 Source，但不消耗 |
| KubeJS | `inputSource(int)`、`outputSource(int)`、`arsSourceNearbyCondition(radius, min, max)` | |

所有条目都以模组 ID `ars_nouveau` 为条件。

## 两种支付方式

针对 `ars_source` 写的配方在两种 Trait 下都能工作。二选一：

| | `ars_source_storage` | `ars_nearby_source` |
| --- | --- | --- |
| Source 来自 | 机器自身的缓冲 | `radius` 内的源罐 |
| 需要布线 | 需要中继或 auto IO 灌满缓冲 | 不需要——直接接入已有的源罐农场 |
| 暴露 capability | 是，按面 | 否 |
| Auto IO | 支持 | 不支持 |
| 其他 Ars 设备可见 | 打开 `expose_to_devices` 时可见 | 不适用 |

::: warning 两者互斥
`ars_nearby_source` 声明自己与 `ars_source_storage` 不兼容，所以一台机器只能带其中一个。两者回答同一个 capability，而且在 `expose_to_devices` 打开时，缓冲本身也会成为扫描统计到的提供者之一——一台带 60 Source、旁边一个罐子都没有的机器会宣称自己有 120，然后开始一个它付不起的配方。

既想要缓冲又想要从周围取用的机器已经有办法了：storage Trait 的 auto IO 可以从相邻的源罐里抽。
:::

## Source 缓冲

| 设置 | 默认 | 含义 |
| --- | --- | --- |
| `capacity` | `10000` | 缓冲容量 |
| `maxReceive` / `maxExtract` | `10000` | 外部传输上限——不是配方的消耗量 |
| `exposeToDevices` | 开 | Ars Nouveau 的其余部分能否把这台机器看作 Source 提供者 |
| Auto IO、capability IO、fancy renderer | | 与任何存储型 Trait 相同 |

结构上这是 `forge_energy_storage` 的 Ars Nouveau 版本，外加让中继和设备能看见这台机器的提供者注册。

## 附近 Source

<figure>
<img src="/assets/multiblocked2/integrations/ars-nouveau-nearby.png" alt="MBD2 Inspector 显示 Ars Nouveau Nearby Source Trait 的半径、扫描间隔与粒子设置">
<figcaption>`ars_nearby_source`：除中继外每一个 Ars Nouveau 设备的工作方式。</figcaption>
</figure>

| 设置 | 范围 | 默认 | 含义 |
| --- | --- | --- | --- |
| `radius` | 1–64 | `10` | 搜索源罐的范围 |
| `scanInterval` | 1–200 | `20` | 两次扫描之间的 tick 数 |
| `particles` | | 开 | 绘制取用/给予的粒子轨迹 |

::: info 为什么有扫描间隔
配方匹配跑在后台线程上，而统计源罐要遍历范围内的方块实体——那在游戏线程之外做是不安全的。模拟阶段读取的是一份缓存，由服务端 tick 每 `scanInterval` tick 刷新一次。调小它机器反应更快、扫描更频繁；调大反之。

正因为如此，这个 Trait 不能像 `aura_handler` 那样在模拟阶段乐观地回答「可以」：只要*匹配*成功，per-tick IO 就会执行并忽略执行结果，乐观的模拟会让 per-tick 的 Source 消耗白嫖。
:::

## 配方

```js
ServerEvents.recipes(event => {
  // 消耗 Source
  event.recipes.example.source_infuser()
    .id('example:source_infused_stone')
    .duration(100)
    .inputSource(250)
    .inputItems('minecraft:stone')
    .outputItems('minecraft:amethyst_block')

  // 产出 Source
  event.recipes.example.source_infuser()
    .id('example:source_generation')
    .duration(100)
    .inputItems('minecraft:amethyst_shard')
    .outputSource(500)
})
```

需要持续消耗时把内容放进 `perTick(...)`，与 FE 完全一致。

## 条件

```js
ServerEvents.recipes(event => {
  event.recipes.example.source_infuser()
    .id('example:only_when_stocked')
    .duration(100)
    .arsSourceNearbyCondition(8, 500, 10000)   // 半径、最小值、最大值
    .inputItems('minecraft:stone')
    .outputItems('minecraft:calcite')
})
```

`arsSourceNearbyCondition` **不消耗任何东西**。用它表达「只在 Source 充足的区域运行」——配合 `setReverse` 也可以表达「只在枯竭区域运行」。它的统计是实时取的，不走 `ars_nearby_source` 的缓存，所以在任何机器上都有效，也不依赖另一个 Trait 的 IO 方向。

既要检查又要消耗的配方需要同时写条件**和** `inputSource`。

## 排查清单

- 编辑器里没有该 Trait：注册表发现阶段 Ars Nouveau 没有加载。
- 用 `ars_nearby_source` 时配方不开始：检查 `radius`，并记住缓存最多可能滞后 `scanInterval` tick。
- 其他 Ars 设备看不见这台机器：`exposeToDevices` 关闭了，或者机器用的是 `ars_nearby_source`——它不暴露任何东西。
- 两个 Source Trait 加不上：这是预期行为，见上文。
