# 访问 Trait

<VersionBadge version="Minecraft 1.21.1 / MBD2 21.0.11" label="当前 API" icon="tag" />

<figure><img src="/assets/multiblocked2/integrations/built-in-capabilities.png" alt="KubeJS 在运行时访问的命名机器 Trait 与 Item Slot 字段"><figcaption>使用 Inspector 中制作的 Trait 名称，并验证返回运行时 Trait 的实际 Java 类型。</figcaption></figure>

机器事件会暴露运行时机器。通过编辑器名称获取 Trait，检查它存在，再只使用该 Trait 实际 Java 类提供的 API。

```js
MBDMachineEvents.onUseWithoutItem('example:crusher', wrapper => {
  const machine = wrapper.event.machine
  const itemTrait = machine.getTraitByName('input_items')
  if (itemTrait === null) return

  const storage = itemTrait.storage
  const first = storage.getStackInSlot(0)
  // 使用 storage 的插入/提取方法；不要原地修改 ItemStack。
})
```

`machine.additionalTraits` 只包含当前机器附加的运行时 Trait。名称在编辑器中配置；更名会破坏脚本查询，也可能破坏 UI 绑定。

## 三种不同的标识符

| 标识符 | 定义位置 | 使用者 |
| --- | --- | --- |
| Trait `name` | 机器项目中的 Trait 定义 | `getTraitByName(name)` 与 UI ID `ui:<name>` |
| `slotNames` | `RecipeCapabilityTraitDefinition` | 配方 `slotName(...)` 路由 |
| Capability 名 | `RecipeCapability` registry | 配方内容分组与通用 `inputs/outputs` |

名为 `input_items` 的 Trait 可以公开 `primary`、`catalyst` 两个槽位名，同时处理注册名为 `item` 的配方 capability。这些字符串不能互换。

```js
function requireTrait(machine, name) {
  const trait = machine.getTraitByName(name)
  if (trait === null) {
    throw new Error(`Machine ${machine.definition.id()} has no trait named ${name}`)
  }
  return trait
}
```

开发阶段可快速失败；发布的整合包对可选行为应只记录一次并跳过，防止 Trait 更名后每 tick 刷屏。

## 常见 Java 后端接口

| Trait | 常见运行时成员 | 底层 API |
| --- | --- | --- |
| 物品槽 | `storage` | 物品 handler 插入/提取/查询 |
| 流体罐 | `storages` | 流体存储列表 |
| Forge Energy | `storage` | FE 接收/提取/查询 |
| Mekanism 化学品 | `storages` | 化学品存储列表 |
| Mekanism 热量 | `container` | Heat container |
| 气动工艺空气 | `handler` | Air/pressure handler |
| 气动工艺热量 | `handler` | Heat exchanger |

MBD2 没有统一的 JavaScript 存储接口。准确方法来自底层 Java API，并可能随集成版本变化。

## 安全观察与修改

```js
MBDMachineEvents.onUseWithoutItem('example:charger', wrapper => {
  const { machine } = wrapper.event
  const items = machine.getTraitByName('output')
  const energy = machine.getTraitByName('energy')
  if (items === null || energy === null) return

  const stack = items.storage.getStackInSlot(0)
  const stored = energy.storage.energyStored
  console.info(`${stack} / ${stored} FE`)
})
```

修改时调用底层 API 的 `insertItem`/`extractItem`、`fill`/`drain` 或 `receiveEnergy`/`extractEnergy`，并遵守 `simulate` 参数。不要原地修改返回的 stack/tank 对象并假设 handler 会检测到。

## 多方块作用域

`additionalTraits` 与 `getTraitByName` 只检查当前控制器或部件。配方匹配时，已成型控制器可以聚合部件的配方逻辑 Trait；但脚本在控制器上按名称查询时**不会**自动搜索所有部件。

常规控制器/部件 IO 应在编辑器中配置 Pattern capability proxy、`traitNameFilter`、`capabilityIO` 与 `autoIO`。只有代理系统无法表达时才从 JavaScript 遍历 part API，并先确认机器确实是已成型多方块控制器。

## 不要绕过配方引擎

直接修改 Trait 适合明确交互或管理行为，通常不适合放进 `onRecipeWorking`。引擎已经负责模拟、distinct handler 路由、per-tick 处理与提交；事件再次消耗相同存储会在多 handler/代理存在时造成复制或亏损。

::: warning 服务端权威
Trait 是 Java 运行时对象，不是稳定 JSON。存储修改只应在服务端进行。客户端事件可以读取同步值来渲染，但不能执行权威资源变更。
:::
