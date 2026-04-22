# Interact with Traits

You can obtain machine trait by name.

```javascript
// reuturn the first match trait.
let trait = machine.getTraitByName("item item_trait") 

let allTraits = machine.additionalTraits;
```

## Trait APIs
### Item
more APIs can be found [here](https://github.com/Low-Drag-MC/LDLib-MultiLoader/blob/1.20.1/common/src/main/java/com/lowdragmc/lowdraglib/misc/ItemStackTransfer.java)
```javascript
let trait = machine.getTraitByName("item_trait") 
let storage = trait.storage;
let stored = storage.getStackInSlot(0);
storage.insertItem(0, "16x apple", true) // index, item stack, simulate
```
---
### Fluid
more APIs can be found [here](https://github.com/Low-Drag-MC/LDLib-MultiLoader/blob/1.20.1/common/src/main/java/com/lowdragmc/lowdraglib/misc/FluidStorage.java)
```javascript
let trait = machine.getTraitByName("fluid_trait") 
let storages = trait.storages;
let stored = storages[0].getFluid();
storages[0].setFluid(0, "water 1000")
```
---
### Forge Energy
more APIs can be found [here](https://github.com/Low-Drag-MC/Multiblocked2/blob/1.20.1/src/main/java/com/lowdragmc/mbd2/common/trait/forgeenergy/CopiableEnergyStorage.java)
```javascript
let trait = machine.getTraitByName("forge_energy_trait") 
let storage = trait.storage;
let stored = storage.getEnergyStored();
let maxStored = storage.getMaxEnergyStored();
storage.receiveEnergy(1024, false) // fe, simulate
storage.extractEnergy(1024, false) // fe, simulate
```
---
### Botania Mana
more APIs can be found [here](https://github.com/Low-Drag-MC/Multiblocked2/blob/1.20.1/src/main/java/com/lowdragmc/mbd2/integration/botania/trait/CopiableManaPool.java)
```javascript
let trait = machine.getTraitByName("botania_mana_trait") 
let storage = trait.storage;
let stored = storage.getCurrentMana();
storage.receiveMana(1024) // input mana
storage.receiveMana(-1024) // output mana
```
---
### Create rpm / stress
```javascript
let trait = machine.getTraitByName("create_trait") 
let available_stress = trait.getMachine().getHolder().scheduleWorkingRPM(4, false) // rpm, simulate
let available_stress = trait.getMachine().getHolder().scheduleWorking(256, false) // stress, simulate
```
---
### Ember
more APIs can be found [here](https://github.com/Low-Drag-MC/Multiblocked2/blob/1.20.1/src/main/java/com/lowdragmc/mbd2/integration/embers/trait/CopiableEmberCapability.java)
```javascript
let trait = machine.getTraitByName("ember_trait") 
let storage = trait.storage;
let stored = storage.getEmber();
let capacity = storage.getEmberCapacity();
storage.addAmount(1024, false) // ember, simulate
storage.removeAmount(1024, false) // ember, simulate
```
---
### GTM energy
more APIs can be found [here](https://github.com/Low-Drag-MC/Multiblocked2/blob/1.20.1/src/main/java/com/lowdragmc/mbd2/integration/gtm/trait/CopiableEnergyContainer.java)
```javascript
let trait = machine.getTraitByName("gtm_energy_trait") 
let container = trait.container;
let stored = container.getEnergyStored();
let capacity = container.getEnergyCapacity();
container.changeEnergy(1024) // energyToAdd
```
---
### Mek Chemical
more APIs can be found [here](https://github.com/Low-Drag-MC/Multiblocked2/blob/1.20.1/src/main/java/com/lowdragmc/mbd2/integration/mekanism/trait/chemical/ChemicalStorage.java)
```javascript
let trait = machine.getTraitByName("mek_chemical_trait") 
let storages = trait.storages;
let stored = storages[0].getStack();
storages[0].setStack(stored) // did not check how to create a chemical instance via kjs
```
---
### Mek Heat
more APIs can be found [here](https://github.com/Low-Drag-MC/Multiblocked2/blob/1.20.1/src/main/java/com/lowdragmc/mbd2/integration/mekanism/trait/heat/CopiableHeatContainer.java)
```javascript
let trait = machine.getTraitByName("mek_heat_trait") 
let container = trait.container;
let stored = container.getTemperature(0); // capacitor
let stocapacityred = container.getHeatCapacity(0); // capacitor
container.handleHeat(0, 1000) // capacitor, transfer value
```
---
### PNC Pressure / Air
more APIs can be found [here](https://github.com/Low-Drag-MC/Multiblocked2/blob/1.20.1/src/main/java/com/lowdragmc/mbd2/integration/pneumaticcraft/trait/pressure/CopiableAirHandler.java)
```javascript
let trait = machine.getTraitByName("pnc_pressure_trait") 
let handler = trait.handler;
let stored = handler.getAir();
let maxPressure = handler.maxPressure();
handler.addAir(16); // added air
handler.setPressure(4) // addAir(((int) (pressure * getVolume())) - getAir());
```
---
### PNC heat
more APIs can be found [here](https://github.com/Low-Drag-MC/Multiblocked2/blob/1.20.1/src/main/java/com/lowdragmc/mbd2/integration/pneumaticcraft/trait/heat/HeatExchanger.java)
```javascript
let trait = machine.getTraitByName("pnc_heat_trait") 
let handler = trait.handler;
let temp = handler.getTemperature();
let cap = handler.getThermalCapacity();
handler.setTemperature(300); // temperature
```