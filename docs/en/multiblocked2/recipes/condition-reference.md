# Recipe Condition Reference

<VersionBadge version="21.1.1" label="MBD2" icon="tag" />

Conditions are checked during matching and while a recipe works. All values describe the machine/controller position or runtime machine unless noted otherwise.

## Built-in conditions

| Registry name | Parameters | KubeJS method | Test |
| --- | --- | --- | --- |
| `dimension` | dimension ID | `dimension(id)` | Current level dimension equals ID |
| `biome` | biome ID | `biome(id)` | Biome at machine position equals ID |
| `pos_y` | min, max | `positionY(min, max)` | Controller Y is inside inclusive range |
| `day_time` | `isDay` | `dayTime(boolean)` | Level day/night state matches |
| `rain` | min, max | `raining(min, max)` | Rain level is inside range |
| `thunder` | min, max | `thundering(min, max)` | Thunder level is inside range |
| `light` | sky min/max, block min/max, can-see-sky | `light(...)` | Light channels and sky visibility match |
| `redstone_signal` | min, max (`0..15`) | `redstoneSignal(min, max)` | Best neighboring signal is inside range |
| `block` | min count, max count, candidate blocks | `blocksInStructure(...)` | Formed structure contains a matching count |
| `machine_level` | minimum level | `machineLevel(level)` | Machine level satisfies requirement |
| `machine_custom_data` | compound, custom-data-only flag | `machineData(tag, flag)` | Required NBT is contained in custom or full machine data |

Ranges are inclusive. `machine_custom_data` performs a containment-style check by merging the required compound into a copy and comparing it with the source data.

## Optional conditions

| Registry name | Dependency | KubeJS method | Test |
| --- | --- | --- | --- |
| `create_rotation` | Create | `rotationCondition(minRPM, maxRPM, minStress, maxStress)` | Available/working rotation values are within ranges |
| `mekanism_heat` | Mekanism | `mekTemperatureCondition(min, max)` | Mekanism temperature is within range |
| `pneumatic_temperature` | PneumaticCraft | `pncTemperatureCondition(min, max)` | Pneumatic heat-exchanger temperature is within range |
| `pneumatic_pressure` | PneumaticCraft | `pncPressureCondition(isAir, min, max)` | Selected air amount or pressure is within range |
| `ars_source_nearby` | Ars Nouveau | `arsSourceNearbyCondition(radius, min, max)` | Source held by jars within `radius` is inside the range |

A condition method for a mod that is not loaded **throws** when the script runs, so guard it in a pack where the mod is optional.

## OR, AND, and reverse

The default `RecipeCondition#isOr()` returns `true`. MBD2 groups conditions by registered type: alternatives of the same type use OR; groups of different types use AND. `reverse` negates each individual test before grouping.

```java
builder.addCondition(new BiomeCondition(PLAINS));
builder.addCondition(new BiomeCondition(DESERT)); // plains OR desert
builder.addCondition(new PositionYCondition(0, 64)); // AND Y 0..64
```

In the editor, enable a condition's reverse field for “must not match.” In Java, call `.setReverse(true)`. A custom condition should not invert its own `test` result.
