# 模组集成配方

<VersionBadge version="Minecraft 1.21.1 / MBD2 21.0.11" label="当前 API" icon="tag" />

<figure><img src="/assets/multiblocked2/integrations/integration-map.png" alt="MBD2 当前模组集成与配方 capability 总览"><figcaption>只有已加载且在 21.0.11 注册的 capability 才拥有可运行的 builder 方法。</figcaption></figure>

以下方法只有对应模组加载时才能调用。

```js
ServerEvents.recipes(event => {
  event.recipes.example.integration_test()
    .id('example:integration/create')
    .duration(100)
    .inputRPM(64)
    .inputStress(1024)
    .rotationCondition(32, 256, 512, 4096)

  event.recipes.example.integration_test()
    .id('example:integration/mekanism')
    .duration(100)
    .inputChemicals('100x mekanism:oxygen')
    .inputHeat(500)
    .mekTemperatureCondition(300, 1200)

  event.recipes.example.integration_test()
    .id('example:integration/pneumaticcraft')
    .duration(100)
    .inputPNCPressure(2.0)
    .inputPNCAir(1000)
    .inputPNCHeat(350)
    .pncPressureCondition(false, 1.5, 4.9)
    .pncTemperatureCondition(300, 500)

  event.recipes.example.integration_test()
    .id('example:integration/natures_aura')
    .duration(100)
    .inputAura(5000)
})
```

<VersionBadge version="Minecraft 1.20.1 / MBD2 1.0.x" label="旧/停用 API" icon="tag" />

`inputMana`、`inputEU`、`inputEmber` 及对应输出方法在 21.0.11 源码中已被注释，不能作为当前示例使用。Mekanism 1.21.1 统一为 chemical，旧 `inputGas`、`inputSlurry`、`inputPigment`、`inputInfuse` 也不是当前 builder 方法。
