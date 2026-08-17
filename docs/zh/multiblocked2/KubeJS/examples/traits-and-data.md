# Trait 与持久数据

<VersionBadge version="Minecraft 1.21.1 / MBD2 21.0.11" label="当前 API" icon="tag" />

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

复制后再 `setCustomData`，可触发持久化/同步字段的更新监听。不要只修改旧 `CompoundTag` 引用并假设 LDLib2 会检测内部变化。

## 可复用的必需 Trait helper

```js
function requireTrait(machine, name) {
  const trait = machine.getTraitByName(name)
  if (trait === null) {
    throw new Error(`Machine ${machine.definition.id()} has no trait '${name}'`)
  }
  return trait
}
```
