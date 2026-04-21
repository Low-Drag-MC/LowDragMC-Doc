# 自定义代理配方类型的转换

`Proxy Recipetype` 在 mbd2 中并不总是能够完美运行。例如，如果某些配方包含 mbd2 无法识别的输入类型，它们将无法被转换。

此外，玩家可能希望过滤某些配方，或修改持续时间、输入项等。我们提供了一个事件 `onTransferProxyRecipe`，允许你接管转换处理过程。
```js
MBDRecipeTypeEvents.onTransferProxyRecipe("mbd2:recipe_type_id", e => {
    let event = e.event;
    const {recipeType, proxyTypeId, proxyType, proxyRecipeId, proxyRecipe} = event;

    // 确保配方类型正确
    if (proxyTypeId === "create:haunting") {
        let input = proxyRecipe.getIngredients()[0]; // 我们假设原料有且仅有一个物品。
        let output = proxyRecipe.getResultItem(null);
        console.log("input: ", input);
        console.log("output: ", output);
        // 将其转换为 mbd2 配方
        var recipe = recipeType.recipeBuilder() // 与通过 KJS 事件创建配方相同
            .id(proxyRecipeId + "_mbd2")
            .duration(400)
            .inputItems(input)
            .outputItems(output)
            .chance(0)
            .inputFluids("water 1000")
            .chance(1)
            .buildMBDRecipe();

        // 如果你想跳过此配方
        // event.mbdRecipe = null;
        // 设置结果
        event.mbdRecipe = recipe;
    }
})
```