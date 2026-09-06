# Mod Integration Recipes

<VersionBadge version="Minecraft 1.21.1 / MBD2 21.1.1" label="Current API" icon="tag" />

Every builder method below **throws** when its mod is absent, so a pack where the mod is optional has to guard the call.

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

The machine still needs the matching Trait — a capability row never creates a tank, a buffer or a network node. See the [integration pages](../../integrations/) for which Trait handles which capability.

<VersionBadge version="Minecraft 1.20.1 / MBD2 1.0.x" label="Removed" icon="tag" />

`inputMana`, `inputEU` and `inputEmber` (with their outputs) are commented out in `21.1.1` and do not exist. Mekanism 1.21.1 uses unified chemicals, so `inputGas`, `inputSlurry`, `inputPigment` and `inputInfuse` are all `inputChemicals` now.
