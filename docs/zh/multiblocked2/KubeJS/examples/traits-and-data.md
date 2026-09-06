# Trait 与持久数据

<VersionBadge version="Minecraft 1.21.1 / MBD2 21.1.1" label="当前 API" icon="tag" />

<figure><img src="/assets/multiblocked2/integrations/built-in-capabilities.png" alt="机器 Inspector 中可由名称查询的物品、流体和能量 Trait"><figcaption>脚本名称必须与编辑器 Trait definition 的 name 完全一致。</figcaption></figure>

## 物品、流体和 FE

```js
MBDMachineEvents.onUseWithoutItem('example:processor', wrapper => {
  const machine = wrapper.event.machine
  const items = machine.getTraitByName('input_items')
  const fluids = machine.getTraitByName('coolant')
  const energy = machine.getTraitByName('energy')

  if (items !== null) {
    const simulated = items.storage.extractItem(0, 1, true)
    console.info(`Slot 0 can extract: ${simulated}`)
  }
  if (fluids !== null && fluids.storages.length > 0) {
    console.info(`Tank 0: ${fluids.storages[0].fluid}`)
  }
  if (energy !== null) {
    console.info(`Energy: ${energy.storage.energyStored}/${energy.storage.maxEnergyStored}`)
  }
})
```

Trait 名称由编辑器定义。返回对象的成员来自具体 Java Trait；MBD2 不提供统一 JavaScript 存储 facade。

## 安全更新机器自定义数据

```js
MBDMachineEvents.onUseWithoutItem('example:processor', wrapper => {
  const machine = wrapper.event.machine
  const updated = machine.customData.copy()
  updated.putInt('uses', updated.getInt('uses') + 1)
  machine.setCustomData(updated)
})
```

复制后再 `setCustomData`，才会触发持久化与同步字段的更新监听。不要只修改旧 `CompoundTag` 引用并假设 LDLib2 会察觉。

自定义数据带 `@DescSynced`，所以它也是把值送到**客户端**的通道——比如 UI 要画的东西。[Runtime value](../../editor/runtime-values.md) 不同步，不能用于此。

## 按机器覆盖 Trait 配置

```js
MBDMachineEvents.onPlaced('example:processor', wrapper => {
  const machine = wrapper.event.machine
  const items = machine.getTraitByName('input_items')
  if (items === null) return

  // 只作用于这一台机器；随方块存盘，从不发给客户端
  items.setAutoIOEnabled(true)
  items.setAutoIOSide('up', IO.IN)
  items.setAutoIOInterval(10)
  machine.setMachineLevel(2)
})
```

全部键与按名字访问的写法见 [Runtime value](../../editor/runtime-values.md)。

## 开发期快速失败

```js
function requireTrait(machine, name) {
  const trait = machine.getTraitByName(name)
  if (trait === null) {
    throw new Error(`Machine ${machine.definition.id()} has no trait '${name}'`)
  }
  return trait
}
```
