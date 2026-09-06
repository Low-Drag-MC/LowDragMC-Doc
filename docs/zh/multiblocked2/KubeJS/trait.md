# 访问 Trait

<VersionBadge version="Minecraft 1.21.1 / MBD2 21.1.1" label="当前 API" icon="tag" />

机器事件会给出运行时机器对象。按编辑器里给的名字查 Trait，判空，然后只使用该 Trait 实际 Java 类的 API——MBD2 没有统一的 JavaScript 存储门面。

```js
MBDMachineEvents.onUseWithoutItem('example:crusher', wrapper => {
  const machine = wrapper.event.machine
  const items = machine.getTraitByName('input_items')
  if (items === null) return

  const first = items.storage.getStackInSlot(0)
  const simulated = items.storage.extractItem(0, 1, true)
  console.info(`${first} / can extract ${simulated} / ${items.storage.slots} slots`)
})
```

| 表达式 | 得到 |
| --- | --- |
| `machine.getTraitByName(name)` | 该 Trait，或 `null` |
| `machine.additionalTraits` | **这一台**机器上的所有 Trait，Java `List<ITrait>` |
| `trait.definition.name` | Trait 的名字。没有 `trait.name` |
| `trait.definition` | 编辑器侧的定义对象，带它配置好的字段 |

## 三个不同的标识符

| 标识符 | 定义在 | 被谁使用 |
| --- | --- | --- |
| Trait `name` | 机器项目里的 Trait 定义 | `getTraitByName(name)`、生成控件 ID `ui:<name>` |
| `slotNames` | `RecipeCapabilityTraitDefinition` | 配方的 `slotName(...)` 路由 |
| Capability 名 | `RecipeCapability` 注册表 | 配方内容分组与通用的 `inputs`/`outputs` |

一个名为 `input_items` 的 Trait 可以声明 slot 名 `primary` 和 `catalyst`，同时处理注册名为 `item` 的 capability。三者不可互换。

## 常见运行时接口

| Trait | 成员 | 背后的 API |
| --- | --- | --- |
| `item_slot` | `storage` | `IItemHandler`：`getStackInSlot`、`insertItem`、`extractItem`、`slots` |
| `fluid_tank` | `storages` | 流体罐数组 |
| `forge_energy_storage` | `storage` | `IEnergyStorage`：`energyStored`、`maxEnergyStored`、`receiveEnergy`、`extractEnergy` |
| `chemical_tank` | `storages` | Mekanism 化学品罐 |
| `mek_heat_container` | `container` | Mekanism 热量容器 |
| `pneumatic_pressure_air_handler` | `handler` | PNC 空气/压力 handler |
| `pneumatic_heat_exchanger` | `handler` | PNC 热交换器 |
| `ars_source_storage` | `storage` | Source 缓冲 |

具体方法来自背后的 Java API，可能随整合模组版本变化。请调用 `insertItem` / `extractItem`、`fill` / `drain`、`receiveEnergy` / `extractEnergy` 并正确使用它们的 `simulate` 参数；绝不要就地修改返回的 stack 或罐子对象再指望 handler 能察觉。

## 开发期快速失败

```js
function requireTrait(machine, name) {
  const trait = machine.getTraitByName(name)
  if (trait === null) {
    throw new Error(`Machine ${machine.definition.id()} has no trait named ${name}`)
  }
  return trait
}
```

发布版整合包里应改成只记录一次日志并跳过可选行为——否则改名后的 Trait 会每 tick 刷屏。

## 覆盖 Trait 的配置

Trait 上的每一项编辑器设置同时也是一个 [runtime value](../editor/runtime-values.md)，可以为单台机器覆盖：

```js
const slots = machine.getTraitByName('input_items')
slots.runtimeValues.set('auto_io.enable', true)
slots.runtimeValues.set('auto_io.front', 'OUT')
slots.setAutoIOInterval(10)
slots.clearAutoIO()
```

## 多方块作用域

`additionalTraits` 和 `getTraitByName` 只检查**当前**这台控制器或部件。已成型的控制器在配方匹配时会聚合部件的配方 handler，但脚本在控制器上做的查找不会按名字去搜部件。

常规的控制器/部件 IO 请在编辑器里配置 Pattern capability 代理、`traitNameFilter`、`capabilityIO` 和 `autoIO`。只有代理系统表达不了的行为才需要从 JavaScript 遍历部件，而且要先确认机器确实是已成型的控制器。

## 不要绕过配方引擎

直接改 Trait 适合显式交互或管理性操作。在 `onRecipeWorking` 里这样做通常是错的：引擎已经做过模拟、跨 distinct handler 路由、per-tick 处理和提交。一旦存在多个 handler 或代理，在事件里再消耗一次同一个存储就会造成复制或亏空。

::: warning 服务端权威
存储修改留在服务端。客户端事件可以读取已同步的值用于渲染，但不能做权威性的资源变更。
:::
