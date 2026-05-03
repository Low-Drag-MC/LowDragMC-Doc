# XEI 集成

{{ version_badge("2.2.1", label="自", icon="tag") }}

LDLib2 为三种最流行的配方查看器 Mod 提供了一流的支持：

| Mod | 缩写 | 状态 |
| --- | ---- | ---- |
| Just Enough Items | JEI | 如下文所述 |
| Roughly Enough Items | REI | 即将推出 |
| Enough Mod Items | EMI | 即将推出 |

集成采用事件驱动方式：LDLib2 在 JEI/REI/EMI 回调期间触发自定义 `UIEvent`，并通过正常的 UI 元素树进行分发。你可以通过静态辅助方法来响应这些事件，而无需直接实现 JEI/REI/EMI 接口。

---

## JEI

### 注册配方类别

继承 `ModularUIRecipeCategory<T>`，其中 `T` 是你的配方类型。基类会自动处理缓存、渲染和事件分发。你只需提供：

- **`getRecipeType()`** — `RecipeType<T>` 标识符。
- **`getTitle()`** — 在 JEI 的类别列表中显示的标题。
- **`getWidth()` / `getHeight()`** — 配方视图的像素尺寸。
- **构造参数** — 一个 `IModularUIProvider<T>`（即 `T -> ModularUI`），用于为给定配方构建 UI。

然后在带有 `@JeiPlugin` 注解的类中注册类别和配方：

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

`IModularUIProvider<T>` 是一个等价于 `Function<T, ModularUI>` 的函数式接口。最简单的实现方式是方法引用：

```java
// 引用实例方法：
super(MyRecipe::createModularUI);

// 或使用 Lambda：
super(recipe -> ModularUI.of(UI.of(buildRoot(recipe)), stylesheets));
```

Provider 对每个配方调用一次，结果会缓存 10 秒。`ModularUI.init(width, height)` 会由基类自动调用。

---

### 显示 ModularUI

类别注册完成后，LDLib2 会直接在 JEI 的配方视图中渲染你的 `ModularUI` —— 无需额外代码。`ModularUI` 由你的 Provider 创建，初始化为 `(getWidth(), getHeight())`，并嵌入为 JEI 的 Widget。

为了让你的 UI 在 JEI 中真正有用（配方聚焦、槽位悬停提示、原料高亮），你需要接入下面描述的三种 XEI 事件。

---

### XEI 事件

所有集成均通过 `UIEvent` 在元素树中分发处理。你通常**不**直接监听这些事件 —— 而是使用 `LDLibJEIPlugin` 上的静态辅助方法，或内置槽位快捷方法。

| 常量 (`JEIUIEvents.*`) | 触发时机 | `event.customData` 类型 |
| ---------------------- | -------- | ----------------------- |
| `CLICKABLE_INGREDIENT` | 用户在活动界面中悬停/点击元素时 | `IClickableIngredientFactory` |
| `GHOST_INGREDIENT` | 用户从 JEI 开始拖拽原料时 | `JEITargetsTypedHandler<I>` |
| `RECIPE_INGREDIENT` | JEI 收集用于聚焦注册的原料时 | `JEIRecipeIngredientHandler` |
| `RECIPE_WIDGET` | JEI 收集用于悬停/提示的槽位 Widget 时 | `JEIRecipeWidgetHandler` |

---

### 静态辅助方法 (`LDLibJEIPlugin`)

#### `clickableIngredient` — 活动界面中的槽位查找

让用户可以**点击活动 GUI 中的元素**，以打开该元素当前显示内容对应的 JEI 原料页面（用途/配方）。在你的元素构造或初始化代码中一次性附加：

```java
// 当用户点击元素时，JEI 会打开原料查找页面
LDLibJEIPlugin.clickableIngredient(myElement, () -> {
    var item = myElement.getCurrentItem();
    if (item == null || item.isEmpty()) return null;
    return LDLibJEIPlugin.createTypedIngredient(VanillaTypes.ITEM_STACK, item).orElse(null);
});
```

当 `allowXEILookup` 为 `true`（默认值）时，`ItemSlot` 和 `FluidSlot` 会自动调用此方法。

---

#### `ghostIngredient` — 接受拖拽的原料

让用户可以**从 JEI 拖拽原料到你的元素中**（幽灵/幻影原料）。提供一个谓词用于接受或拒绝，以及一个接收放置后原料的 Consumer：

```java
LDLibJEIPlugin.ghostIngredient(
    filterSlotElement,
    VanillaTypes.ITEM_STACK,
    typed -> true,                           // 接受任意物品
    item  -> filterSlotElement.setFilter(item)
);
```

对于流体，请使用 `NeoForgeTypes.FLUID_STACK` 作为类型。

`ItemSlot.xeiPhantom()` / `FluidSlot.xeiPhantom()` 是用于幻影/过滤槽位的便捷包装方法。

---

#### `recipeIngredient` — 提供聚焦原料

将元素的原料注册到 JEI，以便配方聚焦（当查找匹配原料时高亮）能够生效。在你的配方 UI 工厂中，每个承载原料的元素调用一次：

```java
// 在 createModularUI() / IModularUIProvider 内部：
LDLibJEIPlugin.recipeIngredient(inputSlot, IngredientIO.INPUT, () -> {
    var typed = LDLibJEIPlugin.createTypedIngredient(VanillaTypes.ITEM_STACK, inputSlot.getItem());
    return typed.map(List::of).orElse(List.of());
});

LDLibJEIPlugin.recipeIngredient(outputSlot, IngredientIO.OUTPUT, () -> {
    var typed = LDLibJEIPlugin.createTypedIngredient(VanillaTypes.ITEM_STACK, outputSlot.getItem());
    return typed.map(List::of).orElse(List.of());
});
```

`IngredientIO` 的值：

| 值 | JEI 角色 | 描述 |
| -- | -------- | ---- |
| `INPUT` | `INPUT` | 配方消耗此原料。 |
| `OUTPUT` | `OUTPUT` | 配方产出此原料。 |
| `CATALYST` | `CATALYST` | 必需但不会被消耗。 |
| `NONE` | `RENDER_ONLY` | 仅用于展示；不属于聚焦范围。 |

---

#### `recipeSlot` — 附加槽位覆盖层以实现悬停和提示

在元素上方添加一个**不可见的 JEI 槽位 Widget**，以便鼠标悬停时显示 JEI 的原料提示和标签内容信息。提供当前显示的原料，以及可选的所有原料替代项（用于标签提示）：

```java
LDLibJEIPlugin.recipeSlot(
    inputSlot,
    // 主要显示的原料：
    () -> LDLibJEIPlugin.createTypedIngredient(VanillaTypes.ITEM_STACK, inputSlot.getItem()).orElse(null),
    // 所有替代项（例如标签成员）；可以为 null 以省略标签提示：
    () -> tagItems.stream()
            .map(i -> LDLibJEIPlugin.<ItemStack>createTypedIngredient(VanillaTypes.ITEM_STACK, i).orElse(null))
            .toList()
);
```

---

### 内置槽位快捷方法

`ItemSlot` 和 `FluidSlot` 提供了流式辅助方法，使用合理的默认值调用上述三种静态辅助方法：

| 方法 | 作用 |
| ---- | ---- |
| `xeiRecipeIngredient(IngredientIO)` | 为槽位当前物品/流体调用 `LDLibJEIPlugin.recipeIngredient(...)`。 |
| `xeiRecipeSlot()` | 以槽位的物品/流体调用 `LDLibJEIPlugin.recipeSlot(...)`；不显示概率。 |
| `xeiRecipeSlot(IngredientIO, float chance)` | 同上，但在 `chance < 1` 时额外显示概率覆盖层。 |
| `xeiPhantom()` | 注册 `ghostIngredient`，使 JEI 物品可以拖拽到槽位中。 |

所有四个方法均返回 `this` 以支持链式调用。

---

### 完整配方 UI 示例

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
                    // 输入物品
                    new ItemSlot()
                        .setItem(input)
                        .xeiRecipeIngredient(IngredientIO.INPUT)
                        .xeiRecipeSlot(),

                    new UIElement()
                        .layout(l -> l.height(18).aspectRatio(1))
                        .style(s -> s.backgroundTexture(Icons.RIGHT_ARROW_NO_BAR)),

                    // 输出物品
                    new ItemSlot()
                        .setItem(output)
                        .xeiRecipeIngredient(IngredientIO.OUTPUT)
                        .xeiRecipeSlot(),

                    // 催化剂流体
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

### 活动界面中的幽灵原料

对于活动界面（非配方界面），如果你希望用户将 JEI 中的原料拖拽到幻影/过滤槽位中：

```java
// 在你的 UIElement 初始化代码中（例如 BlockEntity GUI 工厂内部）：
var filterSlot = new ItemSlot().xeiPhantom();

// 或为自定义元素手动设置：
LDLibJEIPlugin.ghostIngredient(
    myCustomElement,
    VanillaTypes.ITEM_STACK,
    typed -> myFilter.accepts(typed.getIngredient()),
    item  -> myFilter.setItem(item)
);
```

---

### 活动界面中的可点击原料

对于显示物品/流体但不是 `ItemSlot`/`FluidSlot` 的自定义元素：

```java
LDLibJEIPlugin.clickableIngredient(myDisplayElement, () -> {
    var stack = myDisplayElement.getDisplayedFluid();
    if (stack == null || stack.isEmpty()) return null;
    return LDLibJEIPlugin.createTypedIngredient(NeoForgeTypes.FLUID_STACK, stack).orElse(null);
});
```

---

## REI

### 注册配方类别

继承 `ModularUIDisplayCategory<T>`，其中 `T` 实现了 `ModularUIDisplay` 标记接口。结构与 JEI 类似，但有两个关键区别：

- REI 中的配方对象称为 **display**；它实现 `ModularUIDisplay`，而不是一个普通类。
- 宽度方法接收 display 作为参数：`getDisplayWidth(T display)`。

`ModularUIDisplay` 会自动将 `getInputEntries()` 和 `getOutputEntries()` 委托给通过 `RECIPE_INGREDIENT` 事件从 UI 收集到的原料数据 —— 无需额外工作。

```java
// MyRecipeDisplay.java
public class MyRecipeDisplay implements ModularUIDisplay {
    // 在此处存储你的配方数据
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

### XEI 事件

| 常量 (`REIUIEvents.*`) | 触发时机 | `event.customData` 类型 |
| ---------------------- | -------- | ----------------------- |
| `FOCUSED_STACK` | 用户在活动界面中悬停/点击元素时 | — (由处理器设置为 `CompoundEventResult`) |
| `DRAGGABLE_STACK_BOUNDS` | 用户从 REI 开始拖拽堆叠时 | `REIDraggableStackBoundsHandler` |
| `ACCEPT_DRAGGABLE_STACK` | 用户在界面上放下堆叠时 | `REIDraggableStackBoundsHandler` |
| `RECIPE_INGREDIENT` | REI 收集用于聚焦/搜索的原料时 | `REIRecipeIngredientHandler` |
| `RECIPE_WIDGET` | REI 收集用于悬停/提示的槽位 Widget 时 | `REIRecipeWidgetHandler` |

---

### 静态辅助方法 (`LDLibREIPlugin`)

#### `focusedStack` — 活动界面中的原料查找

REI 中等价于 JEI 的 `clickableIngredient`。当用户悬停或点击时，REI 会打开该原料的用途/配方页面：

```java
LDLibREIPlugin.focusedStack(myElement, () -> {
    var item = myElement.getCurrentItem();
    if (item == null || item.isEmpty()) return null;
    return EntryStacks.of(item);   // 返回 EntryStack<?> 或 null
});
```

当 `allowXEILookup` 为 `true` 时，`ItemSlot` 和 `FluidSlot` 会自动调用此方法。

---

#### `draggableStackBounds` + `acceptDraggableStack` — 接受拖拽的原料

REI 将拖拽操作拆分为两个事件。为可放置元素注册两者：

```java
// 在用户拖拽匹配堆叠时显示放置区域高亮：
LDLibREIPlugin.draggableStackBounds(
    filterSlotElement,
    VanillaEntryTypes.ITEM,
    stack -> true    // 接受任意物品
);

// 处理实际的放置：
LDLibREIPlugin.acceptDraggableStack(
    filterSlotElement,
    VanillaEntryTypes.ITEM,
    stack -> true,
    stack -> filterSlotElement.setFilter(stack.getValue())
);
```

对于流体，请使用 `VanillaEntryTypes.FLUID`。

`ItemSlot.xeiPhantom()` / `FluidSlot.xeiPhantom()` 会自动注册这两个事件。

---

#### `recipeIngredient` — 提供聚焦原料

与 JEI 的等价方法用途相同，但 Provider 返回 `List<EntryIngredient>`：

```java
LDLibREIPlugin.recipeIngredient(inputSlot, IngredientIO.INPUT, () ->
    List.of(EntryIngredients.of(inputSlot.getItem()))
);

LDLibREIPlugin.recipeIngredient(outputSlot, IngredientIO.OUTPUT, () ->
    List.of(EntryIngredients.of(outputSlot.getItem()))
);
```

`ModularUIDisplay` 的 `getInputEntries()` / `getOutputEntries()` 默认实现会自动查询这些数据 —— 你无需覆盖它们。

---

#### `recipeSlot` — 附加槽位覆盖层以实现悬停和提示

与 JEI 不同，`recipeSlot` 接收一个 `IngredientIO` 参数，以便 REI 可以将槽位标记为输入或输出：

```java
LDLibREIPlugin.recipeSlot(
    inputSlot,
    IngredientIO.INPUT,
    () -> EntryStacks.of(inputSlot.getItem()),       // 显示的堆叠
    () -> tagItems.stream().map(EntryStacks::of).toList()  // 所有替代项；可以为 null
);
```

---

### 内置槽位快捷方法

`ItemSlot` 和 `FluidSlot` 通过相同的链式方法接入全部三种 REI 辅助方法 —— `xeiRecipeIngredient()`、`xeiRecipeSlot()`、`xeiRecipeSlot(io, chance)` 和 `xeiPhantom()` 内部也会调用 `LDLibREIPlugin` 以及 `LDLibJEIPlugin` 和 `LDLibEMIPlugin`。

---

## EMI

### 注册配方

为你的配方类继承 `ModularUIEMIRecipe`。`EmiRecipeCategory` 是标准的 EMI 类型 —— 类别本身不需要 LDLib 包装器。你的配方向 `super()` 构造器传递一个 `IModularUIProvider<ModularUIEMIRecipe>`。

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

// Category — 纯 EMI，无需 LDLib 基类：
class MyEmiRecipeCategory extends EmiRecipeCategory {
    public MyEmiRecipeCategory() {
        super(MyMod.id("my_recipe"), EmiStack.of(MyItems.MACHINE));
    }
}
```

`ModularUIEMIRecipe` 会通过收集 UI 发出的 `RECIPE_INGREDIENT` 事件中的原料数据，自动实现 `getInputs()`、`getCatalysts()` 和 `getOutputs()`。

---

### XEI 事件

| 常量 (`EMIUIEvents.*`) | 触发时机 | `event.customData` 类型 |
| ---------------------- | -------- | ----------------------- |
| `STACK_PROVIDER` | 用户在活动界面中悬停/点击元素时 | `EmiStackInteraction` (由处理器设置) |
| `RENDER_DRAG_HANDLER` | EMI 需要用户拖拽时的放置区域边界 | `EMIDragDropHandler` |
| `DROP_STACK_HANDLER` | 用户在界面上放下堆叠时 | `EmiIngredient` |
| `RECIPE_INGREDIENT` | EMI 收集输入/输出/催化剂时 | `EMIRecipeIngredientHandler` |
| `RECIPE_WIDGET` | EMI 收集用于悬停/提示的槽位 Widget 时 | `EMIRecipeWidgetHandler` |

---

### 静态辅助方法 (`LDLibEMIPlugin`)

#### `stackProvider` — 活动界面中的原料查找

EMI 中等价于 JEI 的 `clickableIngredient`。返回一个 `EmiStackInteraction` 以告知 EMI 要查找什么：

```java
LDLibEMIPlugin.stackProvider(myElement, () -> {
    var item = myElement.getCurrentItem();
    if (item == null || item.isEmpty()) return EmiStackInteraction.EMPTY;
    return new EmiStackInteraction(EmiStack.of(item));
});
```

当 `allowXEILookup` 为 `true` 时，`ItemSlot` 和 `FluidSlot` 会自动调用此方法。

---

#### `renderDragHandler` + `dropStackHandler` — 接受拖拽的原料

与 REI 类似，EMI 将拖拽操作分为视觉阶段和放置阶段：

```java
// 拖拽时显示放置边界：
LDLibEMIPlugin.renderDragHandler(
    filterSlotElement,
    ingredient -> ingredient.getEmiStacks().stream().anyMatch(s -> s.isItem())
);

// 处理实际的放置：
LDLibEMIPlugin.dropStackHandler(
    filterSlotElement,
    ingredient -> ingredient.getEmiStacks().stream().anyMatch(s -> s.isItem()),
    ingredient -> filterSlotElement.setFilter(ingredient.getEmiStacks().get(0).getItemStack())
);
```

`ItemSlot.xeiPhantom()` / `FluidSlot.xeiPhantom()` 会自动注册这两个事件。

---

#### `recipeIngredient` — 提供输入/输出/催化剂

Provider 返回 `List<EmiIngredient>`：

```java
LDLibEMIPlugin.recipeIngredient(inputSlot, IngredientIO.INPUT, () ->
    List.of(EmiIngredient.of(List.of(EmiStack.of(inputSlot.getItem()))))
);

LDLibEMIPlugin.recipeIngredient(catalystSlot, IngredientIO.CATALYST, () ->
    List.of(EmiStack.of(catalystSlot.getItem()))
);
```

`ModularUIEMIRecipe` 会自动将 `getInputs()`、`getCatalysts()` 和 `getOutputs()` 委托给收集到的数据。

---

#### `recipeSlot` — 附加槽位覆盖层以实现悬停和提示

EMI 的 `recipeSlot` 是三者中最简单的 —— 不需要角色或所有原料参数：

```java
LDLibEMIPlugin.recipeSlot(
    inputSlot,
    () -> EmiStack.of(inputSlot.getItem())
);
```

---

### 内置槽位快捷方法

相同的 `ItemSlot` / `FluidSlot` 方法（`xeiRecipeIngredient`、`xeiRecipeSlot`、`xeiPhantom`）会在一次调用中同时接入 EMI、JEI 和 REI。
