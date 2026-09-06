# 模组整合配方

<VersionBadge version="Minecraft 1.21.1 / MBD2 21.1.1" label="当前 API" icon="tag" />

下面每个 builder 方法在对应模组缺席时都会**抛异常**，所以模组可选的整合包必须加判断。

```js
// kubejs/server_scripts/mbd2_integrations.js
ServerEvents.recipes(event => {
  if (Platform.isLoaded('create')) {
    event.recipes.example.integration_test()
      .id('example:integration/create')
      .duration(100)
      .inputRPM(64)
      .inputStress(1024)
      .rotationCondition(32, 256, 512, 4096)
  }

  if (Platform.isLoaded('mekanism')) {
    event.recipes.example.integration_test()
      .id('example:integration/mekanism')
      .duration(100)
      .inputChemicals('100x mekanism:oxygen')
      .inputHeat(500)
      .mekTemperatureCondition(300, 1200)
  }

  if (Platform.isLoaded('pneumaticcraft')) {
    event.recipes.example.integration_test()
      .id('example:integration/pneumaticcraft')
      .duration(100)
      .inputPNCPressure(2.0)
      .inputPNCAir(1000)
      .inputPNCHeat(350)
      .pncPressureCondition(false, 1.5, 4.9)
      .pncTemperatureCondition(300, 500)
  }

  if (Platform.isLoaded('naturesaura')) {
    event.recipes.example.integration_test()
      .id('example:integration/natures_aura')
      .duration(100)
      .inputAura(5000)
  }

  if (Platform.isLoaded('ars_nouveau')) {
    event.recipes.example.integration_test()
      .id('example:integration/ars_nouveau')
      .duration(100)
      .inputSource(250)
      .arsSourceNearbyCondition(8, 500, 10000)
  }
})
```

机器仍然需要对应的 Trait——一行 capability 内容永远不会凭空创建罐子、缓冲或网络节点。哪个 Trait 处理哪个 capability 见[整合页面](../../integrations/)。

<VersionBadge version="Minecraft 1.20.1 / MBD2 1.0.x" label="已移除" icon="tag" />

`inputMana`、`inputEU` 和 `inputEmber`（及其输出版本）在 `21.1.1` 中被注释掉，并不存在。Mekanism 1.21.1 使用统一化学品，所以 `inputGas`、`inputSlurry`、`inputPigment` 和 `inputInfuse` 现在都是 `inputChemicals`。
