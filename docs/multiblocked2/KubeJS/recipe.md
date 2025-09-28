# Recipe Creation

Add recipes to the recipe type (`id = mbd2:blender`).

```javascript
// server script
ServerEvents.recipes((event) => {
    // add recipes here
    event.recipes.mbd2.blender()
        // recipe id is optional, but we recommend to set a unique id
        .id("mbd2:recipe_id")
        // duration in tick
        .duration(400)
        // hight priority will be handled first
        .priority(-1)
        // mark this recipe as a fuel recipe
        .isFuel(true)
        // item
        .inputItems("minecraft:apple", "4x minecraft:oak_log")
        .outputItems("4x minecraft:apple")
        // item durability
        .inputItemsDurability("16x flint_and_steel") // 16x refer to the durability value
        .outputItemsDurability("16x flint_and_steel") // 16x refer to the durability value
        // fluid
        .inputFluids("water 1000")
        .outputFluids("lava 2000")
        // entity
        .inputEntities("4x minecraft:pig")
        .outputEntities("4x minecraft:pig")
        // forge energy
        .inputFE(1000)
        .outputFE(2000)
        // create stress
        .inputStress(1024)
        .outputStress(2048)
        .inputRPM(4)
        .outputRPM(4)
        // botaina mana
        .inputMana(100)
        .outputMana(200)
        // natures aura
        .inputAura(50)
        .outputAura(50)
        // mek heat
        .inputHeat(100)
        .outputHeat(200)
        // gtm eu
        .inputEU(100)
        .outputEU(200)
        // mek chemicals
        .inputGases("100x mekanism:hydrogen")
        .outputGases("200x mekanism:oxygen")
            // .inputInfusions(...) 
            // .outputInfusions(...) 
            // .inputSlurries(...)
            // .outputSlurries(...)
            // .inputPigments(...)
            // .outputPigments(...)
        // ember
        .inputEmber(256)
        .outputEmber(256)
        // pnc pressure / air
        .inputPNCPressure(10)
        .outputPNCPressure(10)
        .inputPNCAir(40)
        .outputPNCAir(40)
        // pnc heat
        .inputPNCHeat(100)
        .outputPNCHeat(200)
        // per tick (consume / generate per tick)
        .perTick(builder => builder
            .inputFluids("10x lava") 
        )
        // chance
        .chance(0.5, builder => builder
            .inputFluids("10x lava")
        )
        // tier chance boost (the final chance = chance + tierChanceBoost * machineLevel)
        .tierChanceBoost(0.1, builder => builder
            .inputFluids("10x lava")
        )
        // slot name (ingredient can only be consumed/filled from given slot name (trait name))
        .slotName("input_tank", builder => builder
            .inputFluids("10x lava")
        )
        // ui name (ingredient displays in the xei recipe ui (widget id) by a given ui name)
        .uiName("input_tank", builder => builder
            .inputFluids("10x lava")
        )
        // builtin condtions
        .dimension("minecraft:overworld") // dimension id
        .biome("minecraft:plains") // biome id
        .machineLevel(2) // min machine level
        .positionY(-10, 64) // min y, max y
        .raining(0.5, 1) // min level, max level
        .thundering(0.5, 1) // min level, max level
        .blocksInStructure(0, 100, "minecraft:stone") // min count, max count, blocks
        .dayTime(true) // is day
        .light(0, 15, 0, 15, true) // min sky light, max sky light, min block light, max block light, can see sky
        .redstoneSignal(7, 15) // min signal, max signal
        // mod conditions
        .rotationCondition(4, 16, 256, 1024) // min RPM, max RPM, min stress, max stress
        .mekTemperatureCondition(0, 250) // min temperatue,  max temperatue
        .pncTemperatureCondition(0, 256) // min temperatue,  max temperatue
        .pncPressureCondition(false, 10, 16) // is air, min value (air / pressure), max value (air / pressure)
        // custom data
        .addData("key", '{"temperature": 32}')
        .addDataString("key", "value")
        .addDataNumber("key", 32)
        .addDataBoolean("key", true)
})
```

More apis and details can be found here: [MBDRecipeSchema](https://github.com/Low-Drag-MC/Multiblocked2/blob/1.20.1/src/main/java/com/lowdragmc/mbd2/integration/kubejs/recipe/MBDRecipeSchema.java)
