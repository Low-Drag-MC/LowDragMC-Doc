# 机器特效（Photon）

<VersionBadge version="21.1.1" label="Since" icon="tag" />
<VersionBadge version="Photon 2.2.5" label="需要" icon="tag" />

机器可以播放 [Photon](../../photon2/) 粒子特效：在某个状态期间持续播放，或者由[蓝图](../blueprints/)在某个时刻触发。特效在机器项目的 **Machine FX** 视图里创作和预览，并按名字引用。

<figure>
<img src="/assets/multiblocked2/fx/machine-fx-playing.png" alt="Machine FX 编辑器：左侧状态树与 FX 库，中间带粒子的机器预览与时间轴，右侧 Inspector 中的特效配置">
<figcaption>Machine FX 视图。一个视图同时管理两份列表——每状态特效和命名库——并在机器上预览选中的那一个。</figcaption>
</figure>

::: info Photon 是可选的
`MachineFXConfig` 只包含一个 `ResourceLocation` 和几个数字，不含任何 Photon 类型。装着 Photon 创作的定义，在没有 Photon 的客户端或服务器上照样加载，只是特效不播放。编辑器里的 fx 选择器仍然存在，只是搜不到东西。
:::

## 两份列表

| 列表 | 归属 | 起止 | 用于 |
| --- | --- | --- | --- |
| **状态特效** | 某个[机器状态](./states-and-rendering.md) | 随状态自动开始和结束 | 「这台机器工作时长什么样」 |
| **FX 库** | Machine Settings | 按名字手动触发 | 某个瞬间：合成完成、爆炸、爆发 |

状态特效遵循与 `renderer`、`shape`、`machineSound` 相同的继承规则：开关**关闭**表示*沿用父状态的列表*，而不是*没有特效*。真的想要安静的状态应该打开开关并留空列表。

状态特效也是唯一能被后来才靠近的玩家看到的一种。`playMachineFX` 只到达**当下**正在追踪该区块的玩家。

## 一条特效的配置

<figure>
<img src="/assets/multiblocked2/fx/machine-fx-configuration.png" alt="Inspector 显示 MachineFXConfig 的字段：名称、FX、偏移、旋转、缩放、延迟、强制结束、替换已有、跟随朝向、最大距离">
<figcaption>一条特效的完整配置。</figcaption>
</figure>

| 字段 | 默认 | 含义 |
| --- | --- | --- |
| `Name` | `fx` | 播放时使用的标识符，也是蓝图触发它用的名字 |
| `FX` | `photon:example` | Photon 特效 id，`namespace:path` 形式——不带 `fx/` 前缀，不带 `.fx` 后缀 |
| `Offset` | `0,0,0` | 相对机器方块中心的偏移 |
| `Rotation` | `0,0,0` | 角度 |
| `Scale` | `1,1,1` | |
| `Delay` | `0` | 开始前等待的 tick 数 |
| `Forced Death` | 关 | 停止时立刻丢弃剩余粒子，而不是让它们自然消散 |
| `Replace Existing` | 关 | 同一标识符下已有特效时是否替换。关闭可以让每 tick 调用一次「播放」成为幂等操作 |
| `Follow Facing` | 开 | 按机器正面朝向旋转 offset 和 rotation |
| `Max Distance` | `64` | 特效允许**开始**的最远玩家距离 |

`Max Distance` 是开始门槛而不是剔除：方块实体在整个已加载区块半径内 tick，而不是渲染距离内，没有这个限制的话一台刚进入范围的机器就会生成一套没人看得见的粒子系统。已经在播放的特效会一直播到状态结束或区块卸载。

## 预览

中间面板会在机器模型上播放选中的特效，并带播放控制和时间轴。

<figure>
<img src="/assets/multiblocked2/fx/machine-fx-view.png" alt="Machine FX 视图，含状态树、机器预览和播放时间轴">
<figcaption>播放、停止、重播、拖到任意 tick。预览使用带种子的随机源，所以同一条特效每次重播画面一致——这才让「对比这次改动和上次」有意义。</figcaption>
</figure>

## 从蓝图触发

`mbd2/machine/fx` 分组有四个节点：

| 节点 | 作用 |
| --- | --- |
| **Play Machine FX** | 播放机器 FX 库里的一条命名特效 |
| **Stop Machine FX** | 停止某标识符下正在播放的特效 |
| **Emit Photon FX** | 就地描述并播放一条特效——id、偏移、旋转、缩放、延迟 |
| **Kill Photon FX** | 停止就地特效 |

优先用 **Play Machine FX**：库里的条目可以在编辑器里创作和预览。只有当蓝图需要*计算*出特效而不是*挑选*特效时才用 **Emit Photon FX**。

四个节点都会从服务端转发到追踪中的客户端，所以挂在服务端事件上的蓝图也可以触发它们。

::: tip 标识符是同一个命名空间
`playMachineFX` 和 `emitPhotonFx` 共用标识符空间，状态特效占用 `state:` 前缀。用已占用的标识符再开一条，要么被拒绝要么替换，取决于 `Replace Existing`——所以在状态持续期间每 tick 调用 **Play Machine FX** 是空操作，而不是粒子风暴。
:::

## 检查清单

1. 创作或安装 Photon 特效，记下它的 id。
2. 持续特效加进某个状态的列表；触发式特效加进机器的 FX 库。
3. 除非特效要保持世界对齐，否则打开 `Follow Facing`。
4. 预览它，拖到你关心的那一 tick，对着模型检查偏移。
5. 粒子密集的特效调低 `Max Distance`。
6. 在没有装 Photon 的客户端上测一次：机器必须仍然能加载。
