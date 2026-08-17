# Mod Integration Recipes

<VersionBadge version="Minecraft 1.21.1 / MBD2 21.0.11" label="Current API" icon="tag" />

<figure><img src="/assets/multiblocked2/integrations/integration-map.png" alt="Overview of current MBD2 mod integrations and recipe capabilities"><figcaption>Only loaded capabilities registered by 21.0.11 have runnable builder methods.</figcaption></figure>

These methods require the corresponding mod to be loaded.

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

<VersionBadge version="Minecraft 1.20.1 / MBD2 1.0.x" label="Legacy/disabled API" icon="tag" />

`inputMana`, `inputEU`, and `inputEmber` (and outputs) are commented out in 21.0.11. Mekanism 1.21.1 uses unified chemicals; old `inputGas`, `inputSlurry`, `inputPigment`, and `inputInfuse` are not current builder methods.
