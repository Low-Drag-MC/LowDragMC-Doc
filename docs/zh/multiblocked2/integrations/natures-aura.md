# Nature's Aura

<VersionBadge version="21.1.1" label="MBD2" icon="tag" />

Nature's Aura 集成读取并修改机器周围世界中的灵气；它不是私有储罐，也不是有侧面的 NeoForge 存储 capability。

<figure>
<img src="/assets/multiblocked2/integrations/natures-aura.png" alt="MBD2 Machine Traits 编辑器显示 Nature's Aura handler 半径设置">
<figcaption>Aura Handler Trait 在通用配方路由字段之外提供可配置半径。</figcaption>
</figure>

## 增加的接口

| 层 | 名称 | 用途 |
| --- | --- | --- |
| 配方 capability | `natures_aura` | 整数灵气输入/输出 |
| Trait | `aura_handler` | 世界区域灵气配方 handler 与 UI provider |
| KubeJS | `inputAura(int)`、`outputAura(int)` | 消耗/产生灵气 |

添加一个 `aura_handler` Trait；不允许多个实例。`radius` 范围是 1–64 格。生成的条形 UI 调用 `IAuraChunk.getAuraInArea(level, machinePos, radius)` 并显示当前数量。

```js
ServerEvents.recipes(event => {
  event.recipes.example.aura_infuser()
    .id('example:aura_infused_stone')
    .duration(100)
    .perTick(r => r.inputAura(25))
    .inputItems('minecraft:stone')
    .outputItems('minecraft:amethyst_block')
})
```

输入从周围区域移除灵气，输出向区域增加灵气。由于资源属于世界，附近的 Nature's Aura 设备和其他 MBD 机器会竞争同一环境；半径同时影响显示测量值与 handler 有效区域。

## 设计与测试建议

- 需要可见的渐进消耗/产出时使用 per-tick 内容；一次性内容在对应配方阶段处理。
- 必须在最终世界位置与群系测试，不能只看编辑器预览。
- 测试半径重叠的两台机器和区块边界。
- 在 UI 中保留生成的灵气标签，让玩家能诊断配方停滞。
- 不要描述管道、侧面或存储容量：此 Trait 操作 aura chunk，不暴露普通储罐。
