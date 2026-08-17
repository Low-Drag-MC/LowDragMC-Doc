# 调试机器与配方

<VersionBadge version="21.0.11" label="MBD2" icon="tag" />

使用 MBD gadgets 区分结构失败和配方失败。先修复注册与机器接线，再调试脚本回调。

<figure>
<img src="/assets/multiblocked2/editor/multiblock-pattern.png" alt="MBD2 Multiblock Pattern 编辑器显示控制器层重复规则诊断">
<figcaption>进入世界测试结构前，应先解决这里显示的控制器层重复规则等编辑器诊断。</figcaption>
</figure>

## 多方块调试器

在预期控制器上使用。它可以区分“不是控制器”、结构已成功成型和谓词不匹配信息。从第一个不匹配开始处理：后续位置可能只是因为朝向或重复已经被错误解析。

检查控制器朝向、层轴、控制器 placeholder、重复范围、精确/部分状态以及催化剂候选。

## 配方调试器

在具有配方逻辑的机器上使用。启用配方修饰器或 KubeJS 事件时，对比原始匹配和修改后配方。失败通常属于四层之一：

| 层 | 常见原因 |
| --- | --- |
| 配方类型 | ID 错误、配方未加载、把 XEI 隐藏误认为不存在 |
| 条件 | 当前世界/机器前置条件失败 |
| 路由 | 无匹配 Trait、配方 IO 错误、`slotName` 不匹配、distinct handler 行为 |
| 存储 | 过滤器、容量、数量、速率或输出空间阻止模拟 |

## 有用的开发检查

- 构造后只记录一次机器定义、配方类型、capability 和 condition registry key。
- 检查 `machine.getAdditionalTraits()`，以及每个 handler 的 capability、IO、slot name 和 distinct 标记。
- 比较模拟前后的 handler 状态；模拟期间发生任何变化都是 bug。
- 先只测试一种配方内容，再加入 per-tick、概率和条件。
- 同时验证服务端行为与客户端 UI/XEI 渲染。
