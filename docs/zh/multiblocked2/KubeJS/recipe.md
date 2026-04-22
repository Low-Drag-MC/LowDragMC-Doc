# 配方创建

将配方添加到配方类型（`id = mbd2:blender`）。

```javascript
// 服务端脚本
ServerEvents.recipes((event) => {
    // 在此处添加配方
    event.recipes.mbd2.blender()
        // recipe id 是可选的，但我们建议设置一个唯一的 id
        .id("mbd2:recipe_id")
        // 持续时间，单位为 tick
        .duration(400)
        // 优先级越高越先被处理
        .priority(-1)
        // 将此配方标记为燃料配方
        .isFuel(true)
        // 物品
        .inputItems("minecraft:apple", "4x minecraft:oak_log")
        .outputItems("4x minecraft:apple")
        // 物品耐久度
        .inputItemsDurability("16x flint_and_steel") // 16x 指耐久度数值
        .outputItemsDurability("16x flint_and_steel") // 16x 指耐久度数值
        // 流体
        .inputFluids("water 1000")
        .outputFluids("lava 2000")
        // 实体
        .inputEntities("4x minecraft:pig")
        .outputEntities("4x minecraft:pig")
        // Forge Energy
        .inputFE(1000)
        .outputFE(2000)
        // Create 应力
        .inputStress(1024)
        .outputStress(2048)
        .inputRPM(4)
        .outputRPM(4)
        // Botania 魔力
        .inputMana(100)
        .outputMana(200)
        // Nature's Aura 灵气
        .inputAura(50)
        .outputAura(50)
        // Mek 热量
        .inputHeat(100)
        .outputHeat(200)
        // GTM EU
        .inputEU(100)
        .outputEU(200)
        // Mek 化学品
        .inputGases("100x mekanism:hydrogen")
        .outputGases("200x mekanism:oxygen")
            // .inputInfusions(...)
            // .outputInfusions(...)
            // .inputSlurries(...)
            // .outputSlurries(...)
            // .inputPigments(...)
            // .outputPigments(...)
        // Embers 余烬
        .inputEmber(256)
        .outputEmber(256)
        // PNC 压力 / 空气
        .inputPNCPressure(10)
        .outputPNCPressure(10)
        .inputPNCAir(40)
        .outputPNCAir(40)
        // PNC 热量
        .inputPNCHeat(100)
        .outputPNCHeat(200)
        // 每 tick（每 tick 消耗 / 生成）
        .perTick(builder => builder
            .inputFluids("10x lava")
        )
        // 概率
        .chance(0.5, builder => builder
            .inputFluids("10x lava")
        )
        // 等级概率加成（最终概率 = 概率 + tierChanceBoost * machineLevel）
        .tierChanceBoost(0.1, builder => builder
            .inputFluids("10x lava")
        )
        // 槽位名称（原料只能从指定的槽位名称（trait 名称）中被消耗 / 填充）
        .slotName("input_tank", builder => builder
            .inputFluids("10x lava")
        )
        // UI 名称（原料通过给定的 UI 名称在 XEI 配方 UI 中显示（widget id））
        .uiName("input_tank", builder => builder
            .inputFluids("10x lava")
        )
        // 内置条件
        .dimension("minecraft:overworld") // 维度 id
        .biome("minecraft:plains") // 生物群系 id
        .machineLevel(2) // 最低机器等级
        .positionY(-10, 64) // 最小 y，最大 y
        .raining(0.5, 1) // 最小等级，最大等级
        .thundering(0.5, 1) // 最小等级，最大等级
        .blocksInStructure(0, 100, "minecraft:stone") // 最小数量，最大数量，方块
        .dayTime(true) // 是否为白天
        .light(0, 15, 0, 15, true) // 最小天空光照，最大天空光照，最小方块光照，最大方块光照，能否看到天空
        .redstoneSignal(7, 15) // 最小信号，最大信号
        // 模组条件
        .rotationCondition(4, 16, 256, 1024) // 最小 RPM，最大 RPM，最小应力，最大应力
        .mekTemperatureCondition(0, 250) // 最低温度，最高温度
        .pncTemperatureCondition(0, 256) // 最低温度，最高温度
        .pncPressureCondition(false, 10, 16) // 是否为空气，最小值（空气 / 压力），最大值（空气 / 压力）
        // 自定义数据
        .addData("key", '{"temperature": 32}')
        .addDataString("key", "value")
        .addDataNumber("key", 32)
        .addDataBoolean("key", true)
})
```

更多 API 和详情可在此处查看：[MBDRecipeSchema](https://github.com/Low-Drag-MC/Multiblocked2/blob/1.20.1/src/main/java/com/lowdragmc/mbd2/integration/kubejs/recipe/MBDRecipeSchema.java)
