# Customize Proxy RecipeTypes Transfer

`Proxy Recipetype` in mbd2 doesn't always work very well. For example, if some recipes contain input types that mbd2 does not know, they cannot be translated.

Furthermore, ppl may want to filter some recipes, or modify the duration, inputs, etc. 
We provide an event `onTransferProxyRecipe` to allow you to take over the transfer processing.
```js
MBDRecipeTypeEvents.onTransferProxyRecipe("mbd2:recipe_type_id", e => {
    let event = e.event;
    const {recipeType, proxyTypeId, proxyType, proxyRecipeId, proxyRecipe} = event;

    // make sure the recipe type is correct
    if (proxyTypeId === "create:haunting") {
        let input = proxyRecipe.getIngredients()[0]; // we assume the ingredients has and only has one item.
        let output = proxyRecipe.getResultItem(null);
        console.log("input: ", input);
        console.log("output: ", output);
        // convert it into a mbd2 recipe
        var recipe = recipeType.recipeBuilder() // same as create recipe via kjs event
            .id(proxyRecipeId + "_mbd2")
            .duration(400)
            .inputItems(input)
            .outputItems(output)
            .chance(0)
            .inputFluids("water 1000")
            .chance(1)
            .buildMBDRecipe();

        // If you want to skip this recipe
        // event.mbdRecipe = null;
        // set the result
        event.mbdRecipe = recipe;
    }
})
```