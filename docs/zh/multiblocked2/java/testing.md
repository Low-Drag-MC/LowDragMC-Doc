# 测试 Java 扩展

<VersionBadge version="21.0.11" label="MBD2" icon="tag" />

<figure><img src="/assets/multiblocked2/editor/multiblock-pattern.png" alt="由 LDLib2 UI test harness 生成的真实客户端 MBD2 编辑器截图"><figcaption>编辑器注册和交互使用客户端内测试；codec 与 handler 模拟仍由单元测试覆盖。</figcaption></figure>

应将 capability 与 Trait 一起测试。仅测试 codec 无法发现复制、模拟修改状态、IO 方向错误，或 handler 从未被配方逻辑发现等问题。

## 最低测试矩阵

| 领域 | 必须覆盖的情况 |
| --- | --- |
| 注册 | Registry 包含准确稳定名称；可选 `modID` 保护行为正确 |
| 序列化 | 定义、条件和内容 codec 往返不丢字段 |
| Trait 持久化 | 存储值经过方块实体保存/加载仍存在，非法值被限制 |
| 模拟 | `simulate=true` 返回正确 remainder 且不修改状态 |
| 提交 | `simulate=false` 只修改一次，并返回与模拟预测相同的 remainder |
| IO | IN 消耗机器存储；OUT 填充；不兼容 handler IO 原样返回内容 |
| Slot 路由 | 命名内容只到达公开对应 slot name 的 handler |
| 多 Handler | remainder 传给下一个 handler；`isDistinct` 行为符合预期 |
| UI/XEI | 模板绑定不产生类型转换或 ID 缺失；正确展示 per-tick 与概率 |
| 生命周期 | unload/removal 时释放 cache/listener |

## 直接测试 Handler 的模式

```java
var trait = getHeatTrait(machine);
trait.setStored(500);
var handler = trait.getRecipeHandlerTraits().getFirst();

var simulatedLeft = handler.handleRecipe(
    IO.IN, recipe, List.of(400), null, true);
assertNull(simulatedLeft);
assertEquals(500, trait.getStored());

var committedLeft = handler.handleRecipe(
    IO.IN, recipe, List.of(400), null, false);
assertNull(committedLeft);
assertEquals(100, trait.getStored());
```

还要测试部分处理：从只有 `500` 的存储请求 `700`，应返回 `[200]`，提交后存储为零。

## GameTest

使用 NeoForge GameTest 测试方块 capability 暴露、多方块代理、自动 IO、依赖世界的条件和完整配方逻辑状态转换。软依赖测试类只能在 `ModList.isLoaded(...)` 保护内加载；否则注解发现可能提前加载缺失模组的类。
