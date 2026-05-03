# XEI Integration

{{ version_badge("2.2.1", label="Since", icon="tag") }}

LDLib2 provides first-class support for the three most popular recipe-viewer mods:

| Mod | Abbreviation | Status |
| --- | ------------ | ------ |
| Just Enough Items | JEI | Documented below |
| Roughly Enough Items | REI | Coming soon |
| Enough Mod Items | EMI | Coming soon |

The integration is event-driven: LDLib2 fires custom `UIEvent`s during JEI/REI/EMI callbacks and dispatches them through the normal UI element tree. You react to those events using static helper methods rather than implementing JEI/REI/EMI interfaces directly.

---

## JEI

### Registering a Recipe Category

Extend `ModularUIRecipeCategory<T>` where `T` is your recipe type. The base class handles caching, rendering, and event dispatch automatically. You only need to provide:

- **`getRecipeType()`** — the `RecipeType<T>` identifier.
- **`getTitle()`** — display name shown in JEI's category list.
- **`getWidth()` / `getHeight()`** — pixel dimensions of the recipe view.
- **Constructor argument** — an `IModularUIProvider<T>` (i.e. `T -> ModularUI`) that builds the UI for a given recipe.

Then register the category and recipes inside a class annotated with `@JeiPlugin`:

```java
// MyRecipeCategory.java
public class MyRecipeCategory extends ModularUIRecipeCategory<MyRecipe> {

    public static final RecipeType<MyRecipe> TYPE =
        new RecipeType<>(MyMod.id("my_recipe"), MyRecipe.class);

    private final IDrawable icon;

    public MyRecipeCategory(IJeiHelpers helpers) {
        super(recipe -> recipe.createModularUI());   // IModularUIProvider<MyRecipe>
        this.icon = helpers.getGuiHelper().createDrawableItemLike(MyItems.MACHINE);
    }

    @Override public RecipeType<MyRecipe> getRecipeType() { return TYPE; }
    @Override public Component getTitle()                  { return Component.translatable("category.mymod.my_recipe"); }
    @Override public IDrawable getIcon()                   { return icon; }
    @Override public int getWidth()                        { return MyRecipe.WIDTH; }
    @Override public int getHeight()                       { return MyRecipe.HEIGHT; }
}
```

```java
// MyJEIPlugin.java
@JeiPlugin
public class MyJEIPlugin implements IModPlugin {

    @Override
    public ResourceLocation getPluginUid() {
        return MyMod.id("jei_plugin");
    }

    @Override
    public void registerCategories(IRecipeCategoryRegistration reg) {
        reg.addRecipeCategories(new MyRecipeCategory(reg.getJeiHelpers()));
    }

    @Override
    public void registerRecipes(IRecipeRegistration reg) {
        reg.addRecipes(MyRecipeCategory.TYPE, MyRecipeManager.getAllRecipes());
    }
}
```

#### `IModularUIProvider<T>`

`IModularUIProvider<T>` is a functional interface equivalent to `Function<T, ModularUI>`. The simplest way to implement it is a method reference:

```java
// Method reference to an instance method:
super(MyRecipe::createModularUI);

// Or a lambda:
super(recipe -> ModularUI.of(UI.of(buildRoot(recipe)), stylesheets));
```

The provider is called once per recipe and the result is cached for 10 seconds. `ModularUI.init(width, height)` is called automatically by the base class.

---

### Displaying a ModularUI

Once the category is registered, LDLib2 renders your `ModularUI` directly inside JEI's recipe view — no extra code required. The `ModularUI` is created from your provider, initialised to `(getWidth(), getHeight())`, and embedded as a JEI widget.

To make your UI actually useful to JEI (recipe focus, slot tooltips, ingredient highlighting), you need to wire up the three kinds of XEI events described below.

---

### XEI Events

All integration is handled via `UIEvent`s dispatched through the element tree. You normally do **not** listen to these events directly — instead use the static helpers on `LDLibJEIPlugin` or the built-in slot shortcut methods.

| Constant (`JEIUIEvents.*`) | When fired | `event.customData` type |
| -------------------------- | ---------- | ----------------------- |
| `CLICKABLE_INGREDIENT` | User hovers/clicks an element in a live screen | `IClickableIngredientFactory` |
| `GHOST_INGREDIENT` | User starts dragging an ingredient from JEI | `JEITargetsTypedHandler<I>` |
| `RECIPE_INGREDIENT` | JEI collects ingredients to register for focus | `JEIRecipeIngredientHandler` |
| `RECIPE_WIDGET` | JEI collects slot widgets for hover/tooltip | `JEIRecipeWidgetHandler` |

---

### Static Helpers (`LDLibJEIPlugin`)

#### `clickableIngredient` — slot lookup from live screens

Lets the user **click an element in your live GUI** to open the JEI ingredient page (uses/recipes) for whatever is currently displayed. Attach it once in your element's constructor or setup code:

```java
// When the user clicks the element, JEI opens the ingredient lookup
LDLibJEIPlugin.clickableIngredient(myElement, () -> {
    var item = myElement.getCurrentItem();
    if (item == null || item.isEmpty()) return null;
    return LDLibJEIPlugin.createTypedIngredient(VanillaTypes.ITEM_STACK, item).orElse(null);
});
```

`ItemSlot` and `FluidSlot` call this automatically when `allowXEILookup` is `true` (the default).

---

#### `ghostIngredient` — accept dragged ingredients

Lets users **drag an ingredient from JEI into your element** (ghost / phantom ingredient). Supply a predicate to accept or reject, and a consumer that receives the placed ingredient:

```java
LDLibJEIPlugin.ghostIngredient(
    filterSlotElement,
    VanillaTypes.ITEM_STACK,
    typed -> true,                           // accept any item
    item  -> filterSlotElement.setFilter(item)
);
```

For fluids use `NeoForgeTypes.FLUID_STACK` as the type.

`ItemSlot.xeiPhantom()` / `FluidSlot.xeiPhantom()` are convenience wrappers for phantom/filter slots.

---

#### `recipeIngredient` — provide focus ingredients

Registers the ingredients of an element with JEI so that recipe focus (highlight when a matching ingredient is looked up) works. Call this once per ingredient-bearing element inside your recipe UI factory:

```java
// Inside createModularUI() / IModularUIProvider:
LDLibJEIPlugin.recipeIngredient(inputSlot, IngredientIO.INPUT, () -> {
    var typed = LDLibJEIPlugin.createTypedIngredient(VanillaTypes.ITEM_STACK, inputSlot.getItem());
    return typed.map(List::of).orElse(List.of());
});

LDLibJEIPlugin.recipeIngredient(outputSlot, IngredientIO.OUTPUT, () -> {
    var typed = LDLibJEIPlugin.createTypedIngredient(VanillaTypes.ITEM_STACK, outputSlot.getItem());
    return typed.map(List::of).orElse(List.of());
});
```

`IngredientIO` values:

| Value | JEI role | Description |
| ----- | -------- | ----------- |
| `INPUT` | `INPUT` | Recipe consumes this ingredient. |
| `OUTPUT` | `OUTPUT` | Recipe produces this ingredient. |
| `CATALYST` | `CATALYST` | Required but not consumed. |
| `NONE` | `RENDER_ONLY` | Displayed only; not part of focus. |

---

#### `recipeSlot` — attach slot overlay for hover and tooltips

Adds an **invisible JEI slot widget** over the element so that mousing over it shows the JEI ingredient tooltip and tag content info. Provide the currently displayed ingredient and optionally all ingredient alternatives (for tag tooltips):

```java
LDLibJEIPlugin.recipeSlot(
    inputSlot,
    // Primary displayed ingredient:
    () -> LDLibJEIPlugin.createTypedIngredient(VanillaTypes.ITEM_STACK, inputSlot.getItem()).orElse(null),
    // All alternatives (e.g. tag members); may be null to omit tag tooltip:
    () -> tagItems.stream()
            .map(i -> LDLibJEIPlugin.<ItemStack>createTypedIngredient(VanillaTypes.ITEM_STACK, i).orElse(null))
            .toList()
);
```

---

### Built-in Slot Shortcuts

`ItemSlot` and `FluidSlot` expose fluent helper methods that call the three static helpers above with sensible defaults:

| Method | What it does |
| ------ | ------------ |
| `xeiRecipeIngredient(IngredientIO)` | Calls `LDLibJEIPlugin.recipeIngredient(...)` for the slot's current item/fluid. |
| `xeiRecipeSlot()` | Calls `LDLibJEIPlugin.recipeSlot(...)` with the slot's item/fluid; no chance display. |
| `xeiRecipeSlot(IngredientIO, float chance)` | Same, but also shows a chance overlay when `chance < 1`. |
| `xeiPhantom()` | Registers `ghostIngredient` so JEI items can be dragged into the slot. |

All four methods return `this` for chaining.

---

### Full Recipe UI Example

```java
public class MyRecipe {
    public static final int WIDTH = 170;
    public static final int HEIGHT = 120;

    public final ItemStack input;
    public final ItemStack output;
    public final FluidStack catalyst;

    public ModularUI createModularUI() {
        return ModularUI.of(UI.of(
            new UIElement()
                .layout(l -> l.widthPercent(100).heightPercent(100))
                .addChildren(
                    // Input item
                    new ItemSlot()
                        .setItem(input)
                        .xeiRecipeIngredient(IngredientIO.INPUT)
                        .xeiRecipeSlot(),

                    new UIElement()
                        .layout(l -> l.height(18).aspectRatio(1))
                        .style(s -> s.backgroundTexture(Icons.RIGHT_ARROW_NO_BAR)),

                    // Output item
                    new ItemSlot()
                        .setItem(output)
                        .xeiRecipeIngredient(IngredientIO.OUTPUT)
                        .xeiRecipeSlot(),

                    // Catalyst fluid
                    new FluidSlot()
                        .setFluid(catalyst)
                        .xeiRecipeIngredient(IngredientIO.CATALYST)
                        .xeiRecipeSlot()
                )
                .layout(l -> l.flexDirection(FlexDirection.ROW))
        ), List.of(StylesheetManager.INSTANCE.getStylesheetSafe(StylesheetManager.MC)));
    }
}
```

```java
public class MyRecipeCategory extends ModularUIRecipeCategory<MyRecipe> {

    public static final RecipeType<MyRecipe> TYPE =
        new RecipeType<>(MyMod.id("my_recipe"), MyRecipe.class);

    public MyRecipeCategory(IJeiHelpers helpers) {
        super(MyRecipe::createModularUI);
        this.icon = helpers.getGuiHelper().createDrawableItemLike(MyItems.MACHINE);
    }

    @Override public RecipeType<MyRecipe> getRecipeType() { return TYPE; }
    @Override public Component getTitle() { return Component.translatable("category.mymod.my_recipe"); }
    @Override public IDrawable getIcon() { return icon; }
    @Override public int getWidth() { return MyRecipe.WIDTH; }
    @Override public int getHeight() { return MyRecipe.HEIGHT; }
    private final IDrawable icon;
}
```

---

### Ghost Ingredient in a Live Screen

For a live (non-recipe) screen where you want users to drag ingredients from JEI into a phantom/filter slot:

```java
// In your UIElement setup (e.g. inside a BlockEntity GUI factory):
var filterSlot = new ItemSlot().xeiPhantom();

// Or manually for custom element:
LDLibJEIPlugin.ghostIngredient(
    myCustomElement,
    VanillaTypes.ITEM_STACK,
    typed -> myFilter.accepts(typed.getIngredient()),
    item  -> myFilter.setItem(item)
);
```

---

### Clickable Ingredient in a Live Screen

For custom elements that display an item/fluid but aren't an `ItemSlot`/`FluidSlot`:

```java
LDLibJEIPlugin.clickableIngredient(myDisplayElement, () -> {
    var stack = myDisplayElement.getDisplayedFluid();
    if (stack == null || stack.isEmpty()) return null;
    return LDLibJEIPlugin.createTypedIngredient(NeoForgeTypes.FLUID_STACK, stack).orElse(null);
});
```

---

## REI

### Registering a Recipe Category

Extend `ModularUIDisplayCategory<T>` where `T` implements the `ModularUIDisplay` marker interface. The structure mirrors JEI, with two key differences:

- The recipe object is called a **display** in REI; it implements `ModularUIDisplay` instead of being a plain class.
- The width method receives the display as an argument: `getDisplayWidth(T display)`.

`ModularUIDisplay` automatically delegates `getInputEntries()` and `getOutputEntries()` to the ingredient data collected from your UI via `RECIPE_INGREDIENT` events — no extra work needed.

```java
// MyRecipeDisplay.java
public class MyRecipeDisplay implements ModularUIDisplay {
    // Store your recipe data here
    public final MyRecipe recipe;

    public MyRecipeDisplay(MyRecipe recipe) { this.recipe = recipe; }

    @Override
    public CategoryIdentifier<?> getCategoryIdentifier() {
        return MyRecipeCategory.IDENTIFIER;
    }
}
```

```java
// MyRecipeCategory.java
public class MyRecipeCategory extends ModularUIDisplayCategory<MyRecipeDisplay> {

    public static final CategoryIdentifier<MyRecipeDisplay> IDENTIFIER =
        CategoryIdentifier.of(MyMod.MOD_ID, "my_recipe");

    private final Renderer icon;

    public MyRecipeCategory() {
        super(display -> display.recipe.createModularUI());   // IModularUIProvider<MyRecipeDisplay>
        this.icon = EntryStacks.of(MyItems.MACHINE);
    }

    @Override public CategoryIdentifier<MyRecipeDisplay> getCategoryIdentifier() { return IDENTIFIER; }
    @Override public Component getTitle()                                         { return Component.translatable("category.mymod.my_recipe"); }
    @Override public Renderer getIcon()                                           { return icon; }
    @Override public int getDisplayWidth(MyRecipeDisplay display)                 { return MyRecipe.WIDTH; }
    @Override public int getDisplayHeight()                                       { return MyRecipe.HEIGHT; }
}
```

```java
// MyREIPlugin.java
@REIPluginClient
public class MyREIPlugin implements REIClientPlugin {

    @Override
    public void registerCategories(CategoryRegistry registry) {
        registry.add(new MyRecipeCategory());
        registry.addWorkstations(MyRecipeCategory.IDENTIFIER, EntryStacks.of(MyItems.MACHINE));
    }

    @Override
    public void registerDisplays(DisplayRegistry registry) {
        MyRecipeManager.getAllRecipes()
            .forEach(r -> registry.add(new MyRecipeDisplay(r)));
    }
}
```

---

### XEI Events

| Constant (`REIUIEvents.*`) | When fired | `event.customData` type |
| -------------------------- | ---------- | ----------------------- |
| `FOCUSED_STACK` | User hovers/clicks an element in a live screen | — (set by handler to `CompoundEventResult`) |
| `DRAGGABLE_STACK_BOUNDS` | User starts dragging a stack from REI | `REIDraggableStackBoundsHandler` |
| `ACCEPT_DRAGGABLE_STACK` | User drops a stack onto the screen | `REIDraggableStackBoundsHandler` |
| `RECIPE_INGREDIENT` | REI collects ingredients for focus/search | `REIRecipeIngredientHandler` |
| `RECIPE_WIDGET` | REI collects slot widgets for hover/tooltip | `REIRecipeWidgetHandler` |

---

### Static Helpers (`LDLibREIPlugin`)

#### `focusedStack` — ingredient lookup from live screens

REI's equivalent of JEI's `clickableIngredient`. When the user hovers or clicks, REI opens the ingredient's uses/recipes page:

```java
LDLibREIPlugin.focusedStack(myElement, () -> {
    var item = myElement.getCurrentItem();
    if (item == null || item.isEmpty()) return null;
    return EntryStacks.of(item);   // returns EntryStack<?> or null
});
```

`ItemSlot` and `FluidSlot` call this automatically when `allowXEILookup` is `true`.

---

#### `draggableStackBounds` + `acceptDraggableStack` — accept dragged ingredients

REI splits drag-and-drop into two events. Register both for a droppable element:

```java
// Show drop zone highlight while user is dragging a matching stack:
LDLibREIPlugin.draggableStackBounds(
    filterSlotElement,
    VanillaEntryTypes.ITEM,
    stack -> true    // accept any item
);

// Handle the actual drop:
LDLibREIPlugin.acceptDraggableStack(
    filterSlotElement,
    VanillaEntryTypes.ITEM,
    stack -> true,
    stack -> filterSlotElement.setFilter(stack.getValue())
);
```

For fluids, use `VanillaEntryTypes.FLUID`.

`ItemSlot.xeiPhantom()` / `FluidSlot.xeiPhantom()` register both events automatically.

---

#### `recipeIngredient` — provide focus ingredients

Same purpose as the JEI equivalent, but the provider returns `List<EntryIngredient>`:

```java
LDLibREIPlugin.recipeIngredient(inputSlot, IngredientIO.INPUT, () ->
    List.of(EntryIngredients.of(inputSlot.getItem()))
);

LDLibREIPlugin.recipeIngredient(outputSlot, IngredientIO.OUTPUT, () ->
    List.of(EntryIngredients.of(outputSlot.getItem()))
);
```

The `ModularUIDisplay` default implementations of `getInputEntries()` / `getOutputEntries()` query these automatically — you do not need to override them.

---

#### `recipeSlot` — attach slot overlay for hover and tooltips

Unlike JEI, `recipeSlot` takes an `IngredientIO` parameter so REI can mark the slot as input or output:

```java
LDLibREIPlugin.recipeSlot(
    inputSlot,
    IngredientIO.INPUT,
    () -> EntryStacks.of(inputSlot.getItem()),       // displayed stack
    () -> tagItems.stream().map(EntryStacks::of).toList()  // all alternatives; may be null
);
```

---

### Built-in Slot Shortcuts

`ItemSlot` and `FluidSlot` wire up all three REI helpers via the same chainable methods as JEI — `xeiRecipeIngredient()`, `xeiRecipeSlot()`, `xeiRecipeSlot(io, chance)`, and `xeiPhantom()` internally call `LDLibREIPlugin` as well as `LDLibJEIPlugin` and `LDLibEMIPlugin`.

---

## EMI

### Registering a Recipe

Extend `ModularUIEMIRecipe` for your recipe class. The `EmiRecipeCategory` is a standard EMI type — no LDLib wrapper is needed for the category itself. Your recipe passes an `IModularUIProvider<ModularUIEMIRecipe>` to the `super()` constructor.

```java
// MyEmiRecipe.java
public class MyEmiRecipe extends ModularUIEMIRecipe {

    private final MyEmiRecipeCategory category;
    private final MyRecipe recipe;

    public MyEmiRecipe(MyEmiRecipeCategory category, MyRecipe recipe) {
        super(self -> recipe.createModularUI());   // IModularUIProvider<ModularUIEMIRecipe>
        this.category = category;
        this.recipe = recipe;
    }

    @Override public EmiRecipeCategory getCategory()  { return category; }
    @Override public ResourceLocation getId()          { return MyMod.id("my_recipe/" + recipe.getId()); }
    @Override public int getDisplayWidth()             { return MyRecipe.WIDTH; }
    @Override public int getDisplayHeight()            { return MyRecipe.HEIGHT; }
}
```

```java
// MyEmiPlugin.java
@EmiEntrypoint
public class MyEmiPlugin implements EmiPlugin {

    @Override
    public void register(EmiRegistry registry) {
        var category = new MyEmiRecipeCategory();
        registry.addCategory(category);
        registry.addWorkstation(category, EmiStack.of(MyItems.MACHINE));

        MyRecipeManager.getAllRecipes()
            .forEach(r -> registry.addRecipe(new MyEmiRecipe(category, r)));
    }
}

// Category — plain EMI, no LDLib base class needed:
class MyEmiRecipeCategory extends EmiRecipeCategory {
    public MyEmiRecipeCategory() {
        super(MyMod.id("my_recipe"), EmiStack.of(MyItems.MACHINE));
    }
}
```

`ModularUIEMIRecipe` automatically implements `getInputs()`, `getCatalysts()`, and `getOutputs()` by collecting the ingredient data emitted from your UI via `RECIPE_INGREDIENT` events.

---

### XEI Events

| Constant (`EMIUIEvents.*`) | When fired | `event.customData` type |
| -------------------------- | ---------- | ----------------------- |
| `STACK_PROVIDER` | User hovers/clicks an element in a live screen | `EmiStackInteraction` (set by handler) |
| `RENDER_DRAG_HANDLER` | EMI needs drop-zone bounds while user drags | `EMIDragDropHandler` |
| `DROP_STACK_HANDLER` | User drops a stack onto the screen | `EmiIngredient` |
| `RECIPE_INGREDIENT` | EMI collects inputs/outputs/catalysts | `EMIRecipeIngredientHandler` |
| `RECIPE_WIDGET` | EMI collects slot widgets for hover/tooltip | `EMIRecipeWidgetHandler` |

---

### Static Helpers (`LDLibEMIPlugin`)

#### `stackProvider` — ingredient lookup from live screens

EMI's equivalent of JEI's `clickableIngredient`. Return an `EmiStackInteraction` to tell EMI what to look up:

```java
LDLibEMIPlugin.stackProvider(myElement, () -> {
    var item = myElement.getCurrentItem();
    if (item == null || item.isEmpty()) return EmiStackInteraction.EMPTY;
    return new EmiStackInteraction(EmiStack.of(item));
});
```

`ItemSlot` and `FluidSlot` call this automatically when `allowXEILookup` is `true`.

---

#### `renderDragHandler` + `dropStackHandler` — accept dragged ingredients

Like REI, EMI splits drag-and-drop into a visual phase and a drop phase:

```java
// Show drop bounds while dragging:
LDLibEMIPlugin.renderDragHandler(
    filterSlotElement,
    ingredient -> ingredient.getEmiStacks().stream().anyMatch(s -> s.isItem())
);

// Handle the actual drop:
LDLibEMIPlugin.dropStackHandler(
    filterSlotElement,
    ingredient -> ingredient.getEmiStacks().stream().anyMatch(s -> s.isItem()),
    ingredient -> filterSlotElement.setFilter(ingredient.getEmiStacks().get(0).getItemStack())
);
```

`ItemSlot.xeiPhantom()` / `FluidSlot.xeiPhantom()` register both automatically.

---

#### `recipeIngredient` — provide inputs/outputs/catalysts

The provider returns `List<EmiIngredient>`:

```java
LDLibEMIPlugin.recipeIngredient(inputSlot, IngredientIO.INPUT, () ->
    List.of(EmiIngredient.of(List.of(EmiStack.of(inputSlot.getItem()))))
);

LDLibEMIPlugin.recipeIngredient(catalystSlot, IngredientIO.CATALYST, () ->
    List.of(EmiStack.of(catalystSlot.getItem()))
);
```

`ModularUIEMIRecipe` delegates `getInputs()`, `getCatalysts()`, and `getOutputs()` to the collected data automatically.

---

#### `recipeSlot` — attach slot overlay for hover and tooltips

EMI's `recipeSlot` is the simplest of the three — no role or all-ingredients parameters:

```java
LDLibEMIPlugin.recipeSlot(
    inputSlot,
    () -> EmiStack.of(inputSlot.getItem())
);
```

---

### Built-in Slot Shortcuts

The same `ItemSlot` / `FluidSlot` methods (`xeiRecipeIngredient`, `xeiRecipeSlot`, `xeiPhantom`) wire up EMI alongside JEI and REI in a single call.
