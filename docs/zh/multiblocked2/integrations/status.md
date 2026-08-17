# 集成状态与工具模组

<VersionBadge version="21.0.11" label="MBD2" icon="tag" />

<figure>
<img src="/assets/multiblocked2/integrations/status.png" alt="MBD2 Add Trait 注册表显示测试环境已安装模组所暴露的可选集成条目">
<figcaption>实时编辑器注册表为下方标记“可用”的 capability 集成提供运行时证据。</figcaption>
</figure>

| 模组 | 21.0.11 状态 | 公开接口 |
| --- | --- | --- |
| Mekanism | 可用 | 化学品、热、温度 |
| Create | 部分/运行时可用 | 转动 capability/condition/Trait；KubeJS 动力 builder 和编辑器 project 路径禁用 |
| PneumaticCraft | 可用 | 压力/空气、热、条件 |
| Nature's Aura | 可用 | 灵气 capability/Trait |
| Applied Energistics 2 | 可用 | ME Interface 与 Pattern Provider Trait |
| KubeJS | 可用 | Registry、生成配方 schema、机器/配方类型事件 |
| JEI / REI / EMI | 可用工具 | 配方/多方块展示，不提供机器存储 |
| Jade | 可用工具 | 机器信息 provider，不改变配方行为 |
| GeckoLib | 可用渲染 | 动画 renderer 与客户端关键帧桥接 |
| Botania / GTCEu / Embers / Photon | 未公开 | 类仍存在，但关键注册/调用被注释或未激活 |

不要给休眠集成发布可运行示例。历史 `inputMana`、`inputEU`、`inputEmber` 和 Photon 机器 FX 路径不是此基线支持的入口。

查看器中，`isXEIVisible` 控制配方类型分类是否可见，配方 `isXEIHidden` 控制单条配方；`uiName` 把内容路由到自定义组件，默认生成 ID 为 `@<capability>_<io>_<index>`。Jade 只报告信息。GeckoLib 动画回调应只影响视觉，除非另有服务端权威逻辑执行玩法改变。

## 发布验收

使用准确的可选模组集合启动，确认每个 Trait/capability/condition 出现，执行输入与输出配方，测试所有暴露侧，重启世界，再检查选定配方查看器。任何可选模组版本变化后都要重复测试。
