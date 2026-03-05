# XEI 集成

{{ version_badge("2.2.1", label="Since", icon="tag") }}

LDLib2 为三个最流行的配方查看器模组提供了一流的支持：

| 模组 | 缩写 | 状态 |
| --- | ---- | ---- |
| Just Enough Items | JEI | 下文已记录 |
| Roughly Enough Items | REI | 即将推出 |
| Enough Mod Items | EMI | 即将推出 |

该集成基于事件驱动：LDLib2 在 JEI/REI/EMI 回调期间触发自定义的 `UIEvent`，并通过正常的 UI 元素树进行分发。你使用静态辅助方法来响应这些事件，而不是直接实现 JEI/REI/EMI 接口。

---

## JEI

### 注册配方类别

继承 `ModularUIRecipeCategory<T>`，其中 `T` 是你的配方类型。基类会自动处理缓存、渲染和事件分发。你只需要提供：

- **`getRecipeType()`** — `RecipeType<T>` 标识符。
- **`getTitle()`** — JEI 类别列表中显示的名称。
- **`getWidth()` / `getHeight()`** — 配方视图的像素尺寸。
- **构造函数参数** — 一个 `IModularUIProvider<T>`（即 `T -> ModularUI`），用于为给定配方构建 UI。

然后在标注了 `@JeiPlugin` 的类中注册类别和配方：

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
// 实例方法的方法引用：
super(MyRecipe::createModularUI);

// 或者使用 lambda：
super(recipe -> ModularUI.of(UI.of(buildRoot(recipe)), stylesheets));
```

该提供者对每个配方只调用一次，结果会被缓存 10 秒。`ModularUI.init(width, height)` 由基类自动调用。

---

### 显示 ModularUI

一旦类别注册完成，LDLib2 会直接在 JEI 的配方视图中渲染你的 `ModularUI`——无需额外代码。`ModularUI` 从你的提供者创建，初始化为 `(getWidth(), getHeight())`，并作为 JEI 小部件嵌入。

要让你的 UI 对 JEI 真正有用（配方聚焦、槽位提示、原料高亮），你需要连接下面描述的三种 XEI 事件。

---

### XEI 事件

所有集成都通过分发到元素树的 `UIEvent` 处理。通常你**不需要**直接监听这些事件——而是使用 `LDLibJEIPlugin` 上的静态辅助方法或内置的槽位快捷方法。

| 常量 (`JEIUIEvents.*`) | 触发时机 | `event.customData` 类型 |
| ---------------------- | -------- | ----------------------- |
| `CLICKABLE_INGREDIENT` | 用户在活动界面中悬停/点击元素 | `IClickableIngredientFactory` |
| `GHOST_INGREDIENT` | 用户开始从 JEI 拖拽原料 | `JEITargetsTypedHandler<I>` |
| `RECIPE_INGREDIENT` | JEI 收集原料以注册聚焦 | `JEIRecipeIngredientHandler` |
| `RECIPE_WIDGET` | JEI 收集槽位小部件用于悬停/提示 | `JEIRecipeWidgetHandler` |

---

### 静态辅助方法 (`LDLibJEIPlugin`)

#### `clickableIngredient` — 从活动界面查找槽位

让用户**点击你活动 GUI 中的元素**来打开所显示内容的 JEI 原料页面（用途/配方）。在元素的构造函数或设置代码中附加一次：

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

让用户**从 JEI 拖拽原料到你的元素中**（幽灵/虚拟原料）。提供一个谓词来接受或拒绝，以及一个消费者来接收放置的原料：

```java
LDLibJEIPlugin.ghostIngredient(
    filterSlotElement,
    VanillaTypes.ITEM_STACK,
    typed -> true,                           // 接受任何物品
    item  -> filterSlotElement.setFilter(item)
);
```

对于流体，使用 `NeoForgeTypes.FLUID_STACK` 作为类型。

`ItemSlot.xeiPhantom()` / `FluidSlot.xeiPhantom()` 是用于虚拟/过滤槽位的便捷包装器。

---

#### `recipeIngredient` — 提供聚焦原料

向 JEI 注册元素的原料，使配方聚焦（查找匹配原料时高亮显示）能够工作。在配方 UI 工厂中为每个含有原料的元素调用一次：

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

`IngredientIO` 值：

| 值 | JEI 角色 | 描述 |
| -- | -------- | ---- |
| `INPUT` | `INPUT` | 配方消耗此原料。 |
| `OUTPUT` | `OUTPUT` | 配方产出此原料。 |
| `CATALYST` | `CATALYST` | 需要但不消耗。 |
| `NONE` | `RENDER_ONLY` | 仅显示；不参与聚焦。 |

---

#### `recipeSlot` — 附加槽位覆盖层用于悬停和提示

在元素上添加一个**不可见的 JEI 槽位小部件**，使鼠标悬停时显示 JEI 原料提示和标签内容信息。提供当前显示的原料，以及可选的所有原料备选项（用于标签提示）：

```java
LDLibJEIPlugin.recipeSlot(
    inputSlot,
    // 主要显示的原料：
    () -> LDLibJEIPlugin.createTypedIngredient(VanillaTypes.ITEM_STACK, inputSlot.getItem()).orElse(null),
    // 所有备选项（例如标签成员）；可为 null 以省略标签提示：
    () -> tagItems.stream()
            .map(i -> LDLibJEIPlugin.<ItemStack>createTypedIngredient(VanillaTypes.ITEM_STACK, i).orElse(null))
            .toList()
);
```

---

### 内置槽位快捷方法

`ItemSlot` 和 `FluidSlot` 暴露了链式辅助方法，使用合理的默认值调用上述三个静态辅助方法：

| 方法 | 功能 |
| ---- | ---- |
| `xeiRecipeIngredient(IngredientIO)` | 为槽位当前的物品/流体调用 `LDLibJEIPlugin.recipeIngredient(...)`。 |
| `xeiRecipeSlot()` | 使用槽位的物品/流体调用 `LDLibJEIPlugin.recipeSlot(...)`；无概率显示。 |
| `xeiRecipeSlot(IngredientIO, float chance)` | 同上，但当 `chance < 1` 时还会显示概率覆盖层。 |
| `xeiPhantom()` | 注册 `ghostIngredient` 以便可以从 JEI 拖拽物品到槽位中。 |

所有四个方法都返回 `this` 以支持链式调用。

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

对于活动（非配方）界面，如果你希望用户从 JEI 拖拽原料到虚拟/过滤槽位：

```java
// 在你的 UIElement 设置中（例如在 BlockEntity GUI 工厂内）：
var filterSlot = new ItemSlot().xeiPhantom();

// 或者为自定义元素手动设置：
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

继承 `ModularUIDisplayCategory<T>`，其中 `T` 实现 `ModularUIDisplay` 标记接口。结构与 JEI 类似，有两个关键区别：

- 在 REI 中配方对象称为 **display**；它实现 `ModularUIDisplay` 而不是普通类。
- 宽度方法接收 display 作为参数：`getDisplayWidth(T display)`。

`ModularUIDisplay` 会自动将 `getInputEntries()` 和 `getOutputEntries()` 委托给通过 `RECIPE_INGREDIENT` 事件从 UI 收集的原料数据——无需额外工作。

```java
// MyRecipeDisplay.java
public class MyRecipeDisplay implements ModularUIDisplay {
    // 在这里存储你的配方数据
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
| `FOCUSED_STACK` | 用户在活动界面中悬停/点击元素 | —（由处理器设置为 `CompoundEventResult`） |
| `DRAGGABLE_STACK_BOUNDS` | 用户开始从 REI 拖拽堆叠 | `REIDraggableStackBoundsHandler` |
| `ACCEPT_DRAGGABLE_STACK` | 用户将堆叠放置到界面上 | `REIDraggableStackBoundsHandler` |
| `RECIPE_INGREDIENT` | REI 收集原料用于聚焦/搜索 | `REIRecipeIngredientHandler` |
| `RECIPE_WIDGET` | REI 收集槽位小部件用于悬停/提示 | `REIRecipeWidgetHandler` |

---

### 静态辅助方法 (`LDLibREIPlugin`)

#### `focusedStack` — 从活动界面查找原料

REI 版本的 JEI `clickableIngredient`。当用户悬停或点击时，REI 会打开原料的用途/配方页面：

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

REI 将拖放分为两个事件。为可放置元素注册两者：

```java
// 当用户拖拽匹配的堆叠时显示放置区域高亮：
LDLibREIPlugin.draggableStackBounds(
    filterSlotElement,
    VanillaEntryTypes.ITEM,
    stack -> true    // 接受任何物品
);

// 处理实际的放置：
LDLibREIPlugin.acceptDraggableStack(
    filterSlotElement,
    VanillaEntryTypes.ITEM,
    stack -> true,
    stack -> filterSlotElement.setFilter(stack.getValue())
);
```

对于流体，使用 `VanillaEntryTypes.FLUID`。

`ItemSlot.xeiPhantom()` / `FluidSlot.xeiPhantom()` 会自动注册两个事件。

---

#### `recipeIngredient` — 提供聚焦原料

与 JEI 版本相同的用途，但提供者返回 `List<EntryIngredient>`：

```java
LDLibREIPlugin.recipeIngredient(inputSlot, IngredientIO.INPUT, () ->
    List.of(EntryIngredients.of(inputSlot.getItem()))
);

LDLibREIPlugin.recipeIngredient(outputSlot, IngredientIO.OUTPUT, () ->
    List.of(EntryIngredients.of(outputSlot.getItem()))
);
```

`ModularUIDisplay` 的 `getInputEntries()` / `getOutputEntries()` 默认实现会自动查询这些——你不需要覆写它们。

---

#### `recipeSlot` — 附加槽位覆盖层用于悬停和提示

与 JEI 不同，`recipeSlot` 接受一个 `IngredientIO` 参数，以便 REI 可以将槽位标记为输入或输出：

```java
LDLibREIPlugin.recipeSlot(
    inputSlot,
    IngredientIO.INPUT,
    () -> EntryStacks.of(inputSlot.getItem()),       // 显示的堆叠
    () -> tagItems.stream().map(EntryStacks::of).toList()  // 所有备选项；可为 null
);
```

---

### 内置槽位快捷方法

`ItemSlot` 和 `FluidSlot` 通过与 JEI 相同的链式方法连接所有三个 REI 辅助方法——`xeiRecipeIngredient()`、`xeiRecipeSlot()`、`xeiRecipeSlot(io, chance)` 和 `xeiPhantom()` 内部会同时调用 `LDLibREIPlugin`、`LDLibJEIPlugin` 和 `LDLibEMIPlugin`。

---

## EMI

### 注册配方

为你的配方类继承 `ModularUIEMIRecipe`。`EmiRecipeCategory` 是标准的 EMI 类型——类别本身不需要 LDLib 包装器。你的配方将 `IModularUIProvider<ModularUIEMIRecipe>` 传递给 `super()` 构造函数。

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

// Category — 纯 EMI，不需要 LDLib 基类：
class MyEmiRecipeCategory extends EmiRecipeCategory {
    public MyEmiRecipeCategory() {
        super(MyMod.id("my_recipe"), EmiStack.of(MyItems.MACHINE));
    }
}
```

`ModularUIEMIRecipe` 通过收集通过 `RECIPE_INGREDIENT` 事件从 UI 发出的原料数据，自动实现 `getInputs()`、`getCatalysts()` 和 `getOutputs()`。

---

### XEI 事件

| 常量 (`EMIUIEvents.*`) | 触发时机 | `event.customData` 类型 |
| ---------------------- | -------- | ----------------------- |
| `STACK_PROVIDER` | 用户在活动界面中悬停/点击元素 | `EmiStackInteraction`（由处理器设置） |
| `RENDER_DRAG_HANDLER` | 用户拖拽时 EMI 需要放置区域边界 | `EMIDragDropHandler` |
| `DROP_STACK_HANDLER` | 用户将堆叠放置到界面上 | `EmiIngredient` |
| `RECIPE_INGREDIENT` | EMI 收集输入/输出/催化剂 | `EMIRecipeIngredientHandler` |
| `RECIPE_WIDGET` | EMI 收集槽位小部件用于悬停/提示 | `EMIRecipeWidgetHandler` |

---

### 静态辅助方法 (`LDLibEMIPlugin`)

#### `stackProvider` — 从活动界面查找原料

EMI 版本的 JEI `clickableIngredient`。返回一个 `EmiStackInteraction` 来告诉 EMI 要查找什么：

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

与 REI 类似，EMI 将拖放分为可视阶段和放置阶段：

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

`ItemSlot.xeiPhantom()` / `FluidSlot.xeiPhantom()` 会自动注册两者。

---

#### `recipeIngredient` — 提供输入/输出/催化剂

提供者返回 `List<EmiIngredient>`：

```java
LDLibEMIPlugin.recipeIngredient(inputSlot, IngredientIO.INPUT, () ->
    List.of(EmiIngredient.of(List.of(EmiStack.of(inputSlot.getItem()))))
);

LDLibEMIPlugin.recipeIngredient(catalystSlot, IngredientIO.CATALYST, () ->
    List.of(EmiStack.of(catalystSlot.getItem()))
);
```

`ModularUIEMIRecipe` 会自动将 `getInputs()`、`getCatalysts()` 和 `getOutputs()` 委托给收集的数据。

---

#### `recipeSlot` — 附加槽位覆盖层用于悬停和提示

EMI 的 `recipeSlot` 是三者中最简单的——没有角色或全部原料参数：

```java
LDLibEMIPlugin.recipeSlot(
    inputSlot,
    () -> EmiStack.of(inputSlot.getItem())
);
```

---

### 内置槽位快捷方法

相同的 `ItemSlot` / `FluidSlot` 方法（`xeiRecipeIngredient`、`xeiRecipeSlot`、`xeiPhantom`）在单次调用中同时连接 EMI、JEI 和 REI。
