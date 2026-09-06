# Applied Energistics 2

<VersionBadge version="21.1.1" label="MBD2" icon="tag" />

AE2 集成增加两种参与 ME 网络的机器 Trait，同时处理 MBD2 已有的 `item` 与 `fluid` 配方 capability；它不会新增名为 `ae2` 的配方 capability。

<figure>
<img src="/assets/multiblocked2/integrations/ae2.png" alt="MBD2 Machine Traits 编辑器显示 AE2 ME Interface 的物品与流体缓存设置">
<figcaption>`ae2_me_interface` Trait 配置，包括槽位数与物品/流体容量。</figcaption>
</figure>

## Trait 对比

| Trait | 增加内容 | 设置 |
| --- | --- | --- |
| `ae2_me_interface` | 托管网格节点、接口逻辑/配置/存储、物品与流体配方 handler | `slotSize`、`itemCapacity`、`fluidCapacity`、IO/侧面 |
| `ae2_me_pattern_provider` | 需要频道的网格节点、编码样板槽、输入/返还缓存、物品与流体配方 handler | `slotSize`、`patternSize`、`itemCapacity`、`fluidCapacity`、IO/侧面 |

每种 Trait 只允许一个实例，而且定义声明两者互不兼容；应创建不同机器变体，不要假设编辑器允许同时添加。两者都会在允许侧暴露 `AECapabilities.ME_STORAGE`、`GENERIC_INTERNAL_INV`、`IN_WORLD_GRID_NODE_HOST`。`IO.NONE` 的侧面没有线缆连接；样板供应器在其他侧报告智能线缆连接。

## ME 接口流程

1. 添加 `ae2_me_interface`，配置槽数和每种 key 的物品/流体容量。
2. 在接线面允许 capability IO。
3. 在机器 UI 绑定生成的 `AEInterfaceSlot`（`<trait-ui-id>_0`、`_1`……）。
4. 使用普通 `item`/`fluid` 配方内容；配方 handler 操作接口的配置/内部存储。
5. 连接已供电 AE2 网络，并在游戏中配置接口槽。

```js
ServerEvents.recipes(event => {
  event.recipes.example.network_processor()
    .id('example:network_processing')
    .duration(60)
    .inputItems('minecraft:gold_ingot')
    .inputFluids('100x minecraft:water')
    .outputItems('minecraft:clock')
})
```

## 样板供应器流程

添加 `ae2_me_pattern_provider`，配置样板槽与处理缓存槽，并绑定 `AEPatternProviderSlot` UI。编码输入/输出与某条 MBD 配方一致的 AE2 处理样板。AE2 推送样板时，集成先模拟插入，再插入输入，使机器通过普通物品/流体配方搜索处理；输出/返还必须装入供应器缓存并送回网络。

供应器节点需要频道。样板槽、处理存储和返还存储都会持久化；破坏机器时，保留内容先加入掉落物，然后清理逻辑。

## 边界与排错

- 此处只有 MBD `item`、`fluid` capability handler；FE、化学品、灵气、实体和自定义 capability 不会自动兼容样板。
- 看见线缆不代表网格已启动、供电并有可用频道。
- 样板输入可能已进入但没有 MBD 配方匹配；逐项比较物品/流体数量、配方类型、条件与输出空间。
- 定义把 `itemCapacity` 限制为 1–64；`fluidCapacity` 接受正整数。
- 测试区块卸载/重载、破坏机器后的内容恢复、返还缓存已满和网络重连。
