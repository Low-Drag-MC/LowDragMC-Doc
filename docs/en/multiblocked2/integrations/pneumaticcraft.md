# PneumaticCraft: Repressurized

<VersionBadge version="21.0.11" label="MBD2" icon="tag" />

PneumaticCraft integration has two independent systems: pressure/air storage and heat-exchanger temperature. Do not route one through the other's Trait.

<figure>
<img src="/assets/multiblocked2/integrations/pneumaticcraft.png" alt="MBD2 Machine Traits editor showing PneumaticCraft pressure limits and connection settings">
<figcaption>The pressure handler's volume, pressure limits, connection IO, and automation settings.</figcaption>
</figure>

## What is added

| Layer | Registry name | KubeJS |
| --- | --- | --- |
| Recipe capability | `pneumatic_pressure_air` | `inputPNCPressure`, `outputPNCPressure`, `inputPNCAir`, `outputPNCAir` |
| Recipe capability | `pneumatic_heat` | `inputPNCHeat`, `outputPNCHeat` |
| Trait | `pneumatic_pressure_air_handler` | Pressure/air storage and `PNCCapabilities.AIR_HANDLER_MACHINE` |
| Trait | `pneumatic_heat_exchanger` | Heat exchanger storage/capability |
| Condition | `pneumatic_pressure` | Pressure or air range, selected by `isAir` |
| Condition | `pneumatic_temperature` | Temperature range |

## Pressure and air

Add `pneumatic_pressure_air_handler`. Configure volume, max pressure, danger pressure, critical pressure, connection IO/sides, and auto IO. Only one instance is allowed per machine definition.

Pressure and air use the same recipe capability but a typed flag changes the meaning. `inputPNCPressure(2.0)` is not equivalent to `inputPNCAir(2)`. The condition follows the same distinction:

```js
ServerEvents.recipes(event => {
  event.recipes.example.compressor()
    .id('example:compressed_part')
    .duration(120)
    .pncPressureCondition(false, 2.0, 5.0) // false: pressure
    .perTick(r => r.inputPNCAir(20))
    .inputItems('minecraft:iron_ingot')
    .outputItems('minecraft:iron_block')
})
```

For `pncPressureCondition(isAir, min, max)`, `true` checks air amount and `false` checks pressure. The condition does not drain either value. Use capability content for consumption/production.

## Heat exchanger

Add `pneumatic_heat_exchanger`, configure capacity/conductivity-facing options and auto IO, then use `inputPNCHeat`/`outputPNCHeat`. `pncTemperatureCondition(min, max)` only observes its temperature.

```js
ServerEvents.recipes(event => {
  event.recipes.example.thermopress()
    .id('example:heated_pressing')
    .duration(80)
    .pncTemperatureCondition(373, 773)
    .perTick(r => r.inputPNCHeat(1.5))
    .inputItems('minecraft:copper_ingot')
    .outputItems('minecraft:copper_block')
})
```

## Safety and validation

Treat danger/critical pressure as gameplay safety settings, not recipe ranges. Test below-minimum, in-range, above-maximum, danger, and critical states. Verify tube connection on every allowed face, active auto IO direction, and behavior when the recipe output cannot be accepted. Use separate UI widgets for pressure/air and temperature so players know why a condition fails.
