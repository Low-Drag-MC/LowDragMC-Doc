# XEI集成
{{ version_badge("2.2.1", label="Since", icon="tag") }}
LDLib2 为三种最流行的菜谱查看器模组提供一流的支持：
| Mod | Abbreviation | Status |
| --- | ------------ | ------ |
| Just Enough Items | JEI | Documented below |
| Roughly Enough Items | REI | Coming soon |
| Enough Mod Items | EMI | Coming soon |

集成是事件驱动的：LDLib2 在 JEI/REI/EMI 回调期间触发自定义 `UIEvent`，并通过正常的 UI 元素树调度它们。您可以使用静态帮助器方法对这些事件做出反应，而不是直接实现 JEI/REI/EMI 接口。
---

## 杰伊
### 注册食谱类别
扩展`ModularUIRecipeCategory<T>`，其中`T` 是您的配方类型。基类自动处理缓存、渲染和事件分派。您只需提供：
- **`getRecipeType()`** — `RecipeType<T>` 标识符。- **`getTitle()`** — JEI 类别列表中显示的显示名称。- **`getWidth()` / `getHeight()`** — 配方视图的像素尺寸。- **构造函数参数** — 为给定配方构建 UI 的 `IModularUIProvider<T>`（即 `T -> ModularUI`）。
然后在用`@JeiPlugin`注释的类中注册类别和食谱：
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

####`IModularUIProvider<T>`
`IModularUIProvider<T>` 是与`Function<T, ModularUI>` 等效的功能接口。实现它的最简单方法是方法引用：
```java
// Method reference to an instance method:
super(MyRecipe::createModularUI);

// Or a lambda:
super(recipe -> ModularUI.of(UI.of(buildRoot(recipe)), stylesheets));
```

每个配方调用一次提供程序，结果会缓存 10 秒。 `ModularUI.init(width, height)` 由基类自动调用。
---

### 显示模块化UI
注册类别后，LDLib2 会直接在 JEI 的配方视图中呈现您的`ModularUI` - 无需额外的代码。 `ModularUI` 由您的提供商创建，初始化为 `(getWidth(), getHeight())`，并嵌入为 JEI 小部件。
为了使您的 UI 对 JEI 真正有用（食谱焦点、插槽工具提示、成分突出显示），您需要连接下面描述的三种 XEI 事件。
---

### XEI 活动
所有集成均通过通过元素树调度的 `UIEvent`s 进行处理。您通常**不**直接监听这些事件 - 而是使用 `LDLibJEIPlugin` 上的静态帮助器或内置插槽快捷方式方法。
| Constant (`JEIUIEvents.*`) | When fired | `event.customData` type |
| -------------------------- | ---------- | ----------------------- |
| `CLICKABLE_INGREDIENT` | User hovers/clicks an element in a live screen | `IClickableIngredientFactory` |
| `GHOST_INGREDIENT` | User starts dragging an ingredient from JEI | `JEITargetsTypedHandler<I>` |
| `RECIPE_INGREDIENT` | JEI collects ingredients to register for focus | `JEIRecipeIngredientHandler` |
| `RECIPE_WIDGET` | JEI collects slot widgets for hover/tooltip | `JEIRecipeWidgetHandler` |

---

### 静态助手 (`LDLibJEIPlugin`)
#### `clickableIngredient` — 从实时屏幕查找插槽
让用户**单击实时 GUI 中的元素**来打开当前显示的任何内容的 JEI 成分页面（用途/配方）。将其附加到元素的构造函数或设置代码中：
```java
// When the user clicks the element, JEI opens the ingredient lookup
LDLibJEIPlugin.clickableIngredient(myElement, () -> {
    var item = myElement.getCurrentItem();
    if (item == null || item.isEmpty()) return null;
    return LDLibJEIPlugin.createTypedIngredient(VanillaTypes.ITEM_STACK, item).orElse(null);
});
```

当`allowXEILookup` 是`true`（默认）时，`ItemSlot` 和`FluidSlot` 自动调用此函数。
---

#### `ghostIngredient` — 接受拖动的成分
让用户**将成分从 JEI 拖到您的元素中**（幽灵/幻影成分）。提供接受或拒绝的谓词，以及接收所放置成分的消费者：
```java
LDLibJEIPlugin.ghostIngredient(
    filterSlotElement,
    VanillaTypes.ITEM_STACK,
    typed -> true,                           // accept any item
    item  -> filterSlotElement.setFilter(item)
);
```

对于流体，使用 `NeoForgeTypes.FLUID_STACK` 作为类型。
`ItemSlot.xeiPhantom()` / `FluidSlot.xeiPhantom()` 是幻像/过滤器插槽的便捷包装。
---

#### `recipeIngredient` — 提供重点成分
使用 JEI 注册元素的成分，以便配方焦点（查找匹配成分时突出显示）起作用。配方 UI 工厂中的每个成分承载元素调用一次：
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

`IngredientIO`值：
| Value | JEI role | Description |
| ----- | -------- | ----------- |
| `INPUT` | `INPUT` | Recipe consumes this ingredient. |
| `OUTPUT` | `OUTPUT` | Recipe produces this ingredient. |
| `CATALYST` | `CATALYST` | Required but not consumed. |
| `NONE` | `RENDER_ONLY` | Displayed only; not part of focus. |

---

#### `recipeSlot` — 附加用于悬停和工具提示的插槽覆盖层
在元素上添加**不可见的 JEI 槽小部件**，以便将鼠标悬停在其上显示 JEI 成分工具提示和标签内容信息。提供当前显示的成分和可选的所有成分替代品（用于标签工具提示）：
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

### 内置插槽快捷键
`ItemSlot` 和 `FluidSlot` 公开了流畅的帮助器方法，这些方法使用合理的默认值调用上面的三个静态帮助器：
| Method | What it does |
| ------ | ------------ |
| `xeiRecipeIngredient(IngredientIO)` | Calls `LDLibJEIPlugin.recipeIngredient(...)` for the slot's current item/fluid. |
| `xeiRecipeSlot()` | Calls `LDLibJEIPlugin.recipeSlot(...)` with the slot's item/fluid; no chance display. |
| `xeiRecipeSlot(IngredientIO, float chance)` | Same, but also shows a chance overlay when `chance < 1`. |
| `xeiPhantom()` | Registers `ghostIngredient` so JEI items can be dragged into the slot. |

所有四种方法都返回 `this` 进行链接。
---

### 完整食谱 UI 示例
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

### 实时屏幕中的幽灵成分
对于实时（非食谱）屏幕，您希望用户将成分从 JEI 拖到幻影/过滤器插槽中：
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

### 实时屏幕中可点击的成分
对于显示项目/流体但不是 `ItemSlot`/`FluidSlot` 的自定义元素：
```java
LDLibJEIPlugin.clickableIngredient(myDisplayElement, () -> {
    var stack = myDisplayElement.getDisplayedFluid();
    if (stack == null || stack.isEmpty()) return null;
    return LDLibJEIPlugin.createTypedIngredient(NeoForgeTypes.FLUID_STACK, stack).orElse(null);
});
```

---

##雷伊
### 注册食谱类别
扩展`ModularUIDisplayCategory<T>`，其中`T` 实现`ModularUIDisplay` 标记接口。该结构与 JEI 相似，但有两个主要区别：
- 配方对象在REI中被称为**显示**；它实现`ModularUIDisplay`而不是一个普通的类。- width 方法接收显示作为参数：`getDisplayWidth(T display)`。
`ModularUIDisplay` 自动将 `getInputEntries()` 和 `getOutputEntries()` 委托给通过 `RECIPE_INGREDIENT` 事件从 UI 收集的成分数据 — 无需额外工作。
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

### XEI 活动
| Constant (`REIUIEvents.*`) | When fired | `event.customData` type |
| -------------------------- | ---------- | ----------------------- |
| `FOCUSED_STACK` | User hovers/clicks an element in a live screen | — (set by handler to `CompoundEventResult`) |
| `DRAGGABLE_STACK_BOUNDS` | User starts dragging a stack from REI | `REIDraggableStackBoundsHandler` |
| `ACCEPT_DRAGGABLE_STACK` | User drops a stack onto the screen | `REIDraggableStackBoundsHandler` |
| `RECIPE_INGREDIENT` | REI collects ingredients for focus/search | `REIRecipeIngredientHandler` |
| `RECIPE_WIDGET` | REI collects slot widgets for hover/tooltip | `REIRecipeWidgetHandler` |

---

### 静态助手 (`LDLibREIPlugin`)
#### `focusedStack` — 从实时屏幕查找成分
REI 相当于 JEI 的`clickableIngredient`。当用户将鼠标悬停或单击时，REI 将打开成分的用途/配方页面：
```java
LDLibREIPlugin.focusedStack(myElement, () -> {
    var item = myElement.getCurrentItem();
    if (item == null || item.isEmpty()) return null;
    return EntryStacks.of(item);   // returns EntryStack<?> or null
});
```

当`allowXEILookup` 为`true` 时，`ItemSlot` 和`FluidSlot` 自动调用此函数。
---

#### `draggableStackBounds` + `acceptDraggableStack` — 接受拖动的成分
REI 将拖放分为两个事件。为可放置元素注册这两个元素：
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

对于流体，请使用 `VanillaEntryTypes.FLUID`。
`ItemSlot.xeiPhantom()` / `FluidSlot.xeiPhantom()` 自动注册这两个事件。
---

#### `recipeIngredient` — 提供重点成分
与 JEI 等效的目的相同，但提供者返回 `List<EntryIngredient>`：
```java
LDLibREIPlugin.recipeIngredient(inputSlot, IngredientIO.INPUT, () ->
    List.of(EntryIngredients.of(inputSlot.getItem()))
);

LDLibREIPlugin.recipeIngredient(outputSlot, IngredientIO.OUTPUT, () ->
    List.of(EntryIngredients.of(outputSlot.getItem()))
);
```

`getInputEntries()` / `getOutputEntries()` 的 `ModularUIDisplay` 默认实现会自动查询这些 - 您不需要覆盖它们。
---

#### `recipeSlot` — 附加用于悬停和工具提示的插槽覆盖层
与 JEI 不同，`recipeSlot` 采用 `IngredientIO` 参数，因此 REI 可以将插槽标记为输入或输出：
```java
LDLibREIPlugin.recipeSlot(
    inputSlot,
    IngredientIO.INPUT,
    () -> EntryStacks.of(inputSlot.getItem()),       // displayed stack
    () -> tagItems.stream().map(EntryStacks::of).toList()  // all alternatives; may be null
);
```

---

### 内置插槽快捷键
`ItemSlot` 和 `FluidSlot` 通过与 JEI 相同的可链接方法连接所有三个 REI 助手 — `xeiRecipeIngredient()`、`xeiRecipeSlot()`、`xeiRecipeSlot(io, chance)` 和 `xeiPhantom()` 内部调用 `LDLibREIPlugin` 以及 `LDLibJEIPlugin` 和 `LDLibEMIPlugin`。
---

## 电磁干扰
### 注册食谱
为您的食谱类扩展`ModularUIEMIRecipe`。 `EmiRecipeCategory` 是标准 EMI 类型 — 该类别本身不需要 LDLib 包装器。您的配方将 `IModularUIProvider<ModularUIEMIRecipe>` 传递给 `super()` 构造函数。
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

`ModularUIEMIRecipe`通过`RECIPE_INGREDIENT`事件收集从UI发出的成分数据，自动实现`getInputs()`、`getCatalysts()`和`getOutputs()`。
---

### XEI 活动
| Constant (`EMIUIEvents.*`) | When fired | `event.customData` type |
| -------------------------- | ---------- | ----------------------- |
| `STACK_PROVIDER` | User hovers/clicks an element in a live screen | `EmiStackInteraction` (set by handler) |
| `RENDER_DRAG_HANDLER` | EMI needs drop-zone bounds while user drags | `EMIDragDropHandler` |
| `DROP_STACK_HANDLER` | User drops a stack onto the screen | `EmiIngredient` |
| `RECIPE_INGREDIENT` | EMI collects inputs/outputs/catalysts | `EMIRecipeIngredientHandler` |
| `RECIPE_WIDGET` | EMI collects slot widgets for hover/tooltip | `EMIRecipeWidgetHandler` |

---

### 静态助手 (`LDLibEMIPlugin`)
#### `stackProvider` — 从实时屏幕查找成分
EMI 相当于 JEI 的`clickableIngredient`。返回 `EmiStackInteraction` 告诉 EMI 要查找什么：
```java
LDLibEMIPlugin.stackProvider(myElement, () -> {
    var item = myElement.getCurrentItem();
    if (item == null || item.isEmpty()) return EmiStackInteraction.EMPTY;
    return new EmiStackInteraction(EmiStack.of(item));
});
```

当`allowXEILookup` 为`true` 时，`ItemSlot` 和`FluidSlot` 自动调用此函数。
---

#### `renderDragHandler` + `dropStackHandler` — 接受拖动的成分
与 REI 一样，EMI 将拖放分为可视阶段和放置阶段：
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

`ItemSlot.xeiPhantom()` / `FluidSlot.xeiPhantom()` 都会自动注册。
---

#### `recipeIngredient` — 提供输入/输出/催化剂
提供者返回`List<EmiIngredient>`：
```java
LDLibEMIPlugin.recipeIngredient(inputSlot, IngredientIO.INPUT, () ->
    List.of(EmiIngredient.of(List.of(EmiStack.of(inputSlot.getItem()))))
);

LDLibEMIPlugin.recipeIngredient(catalystSlot, IngredientIO.CATALYST, () ->
    List.of(EmiStack.of(catalystSlot.getItem()))
);
```

`ModularUIEMIRecipe`自动将`getInputs()`、`getCatalysts()`和`getOutputs()`委托给收集到的数据。
---

#### `recipeSlot` — 附加用于悬停和工具提示的插槽覆盖层
EMI 的 `recipeSlot` 是三个参数中最简单的 — 无作用或全成分参数：
```java
LDLibEMIPlugin.recipeSlot(
    inputSlot,
    () -> EmiStack.of(inputSlot.getItem())
);
```

---

### 内置插槽快捷键
相同的 `ItemSlot` / `FluidSlot` 方法（`xeiRecipeIngredient`、`xeiRecipeSlot`、`xeiPhantom`）在一次调用中将 EMI 与 JEI 和 REI 一起连接。