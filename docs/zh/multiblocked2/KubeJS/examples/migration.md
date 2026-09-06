# 1.20.1 KubeJS 迁移速查

<VersionBadge version="Minecraft 1.20.1 / MBD2 1.0.x" label="来源版本" icon="tag" />
<VersionBadge version="Minecraft 1.21.1 / MBD2 21.1.1" label="目标版本" icon="tag" />

| 旧示例 | 1.21.1 写法 | 状态 |
| --- | --- | --- |
| `onEvent('recipes', e => ...)` | `ServerEvents.recipes(e => ...)` | KubeJS 事件语法迁移 |
| `.inputItem(...)` | `.inputItems(...)` | 使用当前 schema 方法 |
| `.inputFluid(...)` | `.inputFluids(...)` | 使用 `SizedFluidIngredient` |
| `.setPerTick(true)` | `.perTick(true)` 或 `.perTick(r => ...)` | 已重命名 |
| `.setChance(0.2)` | `.chance(0.2)` 或 callback | 已重命名 |
| `.isFuel(true)` | 在 Recipe Type 编辑器配置 Fuel Recipe Types | 当前 builder 无此方法 |
| `.inputGas/.inputSlurry/.inputPigment/.inputInfuse` | `.inputChemicals(...)` | Mekanism 统一 chemical |
| `.inputGases/.inputInfusions/.inputSlurries/.inputPigments` | `.inputChemicals(...)` | 旧官方 Wiki 的复数写法同样已移除 |
| `.inputMana/.inputEU/.inputEmber` | 无当前 KJS builder | 21.1.1 已停用 |
| `.inputFluids('water 1000')` | `.inputFluids('1000x minecraft:water')` | 当前 sized ingredient 格式 |
| `.addData('key', '{...}')` | `addDataString` 或传入真正的 `Tag` | `addData` 参数不是 JSON 字符串 |
| `ui.getFirstWidgetById(...)` | `ui.selectId(...).findFirst().orElse(null)` | 新 UIElement 树 |
| `widget.setOnPressCallback(...)` | `addEventListener` / `addServerEventListener` | 新 UI 事件系统 |

```js
// 1.20.1 legacy — 只用于识别
onEvent('recipes', event => {
  event.recipes.mbd2.crusher()
    .inputItem('minecraft:iron_ingot')
    .setPerTick(true)
    .inputFE(20)
    .isFuel(true)
})
```

```js
// 1.21.1 current
ServerEvents.recipes(event => {
  event.recipes.example.crusher()
    .id('example:crusher/iron')
    .inputItems('minecraft:iron_ingot')
    .perTick(r => r.inputFE(20))
})
```

不要机械替换 namespace：builder 路径来自你实际注册的 Recipe Type ID。燃料不再是单条配方的 `.isFuel(true)` 标记，而是配方类型设置中的 fuel recipe type 集合。

旧 Wiki 把 `slotName` 注释为 Trait 名称，这是错误的；当前值应匹配 Trait definition 公开的 recipe slot name。`uiName` 则匹配 Recipe Viewer UI 内容控件名。
