# 入门{{ version_badge("2.1.0", label="Since", icon="tag") }}
在本节中，我们将逐步为您提供一些示例。
### 教程 1：在屏幕上创建并显示`ModularUI`
让我们从一个简单的 UI 开始。`ModularUI` 充当 UI 的运行时管理器 — 处理您定义的所有元素的生命周期、渲染和交互。它采用 `UI` 实例和可选的 `Player` 作为输入。检查 [ModularUI page](./preliminary/modularui.md){ data-preview } 了解更多详细信息。
```java
private static ModularUI createModularUI() {
    // create a root element
    var root = new UIElement();
    root.addChildren(
            // add a label to display text
            new Label().setText("My First UI"),
            // add a button with text
            new Button().setText("Click Me!"),
            // add an element to display an image based on a resource location
            new UIElement().layout(layout -> layout.width(80).height(80))
                    .style(style -> style.background(
                            SpriteTexture.of("ldlib2:textures/gui/icon.png"))
                    )
    ).style(style -> style.background(Sprites.BORDER)); // set a background for the root element
    // create a UI
    var ui = UI.of(root);
    // return a modular UI for runtime instance
    return ModularUI.of(ui);
}
```

接下来，我们需要显示我们的 UI。与大多数迫使您使用专用屏幕类的 UI 库不同，LDLib2 提供了一个通用解决方案，用于在您选择的任何屏幕内渲染 `ModularUI` 并与之交互。这意味着您可以在屏幕初始化阶段创建并初始化`ModularUI`，如下所示。
```java
@OnlyIn(Dist.CLIENT)
public class MyScreen extends Screen {
    // .....

    // initial
    @Override
    public void init() {
        super.init();
        var modularUI = createModularUI();
        modularUI.setScreenAndInit(this);
        this.addRenderableWidget(modularUI.getWidget());
    }

    // .....
}
```

!!!信息“快速测试”如果您不想处理`screen`的代码并显示。我们还为您提供`ModularUIScreen`。检查 [screen and menu page](./preliminary/screen_and_menu.md){ data-preview } 了解更多详细信息。
    ```java
    public static void openScreenUI() {
        var modularUI = createModularUI();
        minecraft.setScreen(new ModularUIScreen(modularUI, Component.empty()));
    }
    ```
    
<figure markdown="span">![Tuto 1](./assets/gs_s1.png){宽度=“80%”}</figure>
---

### 教程 2：更好的布局和风格很好，它可以工作 - 但布局和样式仍然不理想。例如，我们想要向根元素添加填充，在组件之间引入一些间距，并使标签居中对齐。感谢瑜伽，我们确实需要处理布局代码。检查 [layout page](./preliminary/layout.md){ data-preview } 了解更多详细信息。让我们通过改进 UI 的布局和风格来改进它。
```java hl_lines="7-8 17-18" 
private static ModularUI createModularUI() {
    // create a root element
    var root = new UIElement();
    root.addChildren(
            // add a label to display text
            new Label().setText("My First UI")
                    // center align text
                    .textStyle(textStyle -> textStyle.textAlignHorizontal(Horizontal.CENTER)),
            // add a button with text
            new Button().setText("Click Me!"),
            // add an element to display an image based on a resource location
            new UIElement().layout(layout -> layout.width(80).height(80))
                    .style(style -> style.background(
                            SpriteTexture.of("ldlib2:textures/gui/icon.png"))
                    )
    ).style(style -> style.background(Sprites.BORDER)); // set a background for the root element
    // set padding and gap for children elements
    root.layout(layout -> layout.paddingAll(7).gapAll(5));
    // create a UI
    var ui = UI.of(root);
    // return a modular UI for runtime instance
    return ModularUI.of(ui);
}
```

<figure markdown="span">![Tutorial ２ Result](./assets/gs_s3.png){宽度=“80%”}</figure>
---

###教程3：组件交互和UI事件
让我们看看如何与组件交互。这里以按钮为例，`#!java setOnClick()` 是由按钮提供的。我们引入了两个将图像旋转 ±45° 的按钮。
```java hl_lines="15-26"
private static ModularUI createModularUI() {
    // create a root element
    var root = new UIElement();
    // add an element to display an image based on a resource location
    var image = new UIElement().layout(layout -> layout.width(80).height(80))
            .style(style -> style.background(
                    SpriteTexture.of("ldlib2:textures/gui/icon.png"))
            );
    root.addChildren(
            // add a label to display text
            new Label().setText("Interaction")
                    // center align text
                    .textStyle(textStyle -> textStyle.textAlignHorizontal(Horizontal.CENTER)),
            image,
            // add a container with the row flex direction
            new UIElement().layout(layout -> layout.flexDirection(YogaFlexDirection.ROW)).addChildren(
                    // a button to rotate the image -45°
                    new Button().setText("-45°")
                            .setOnClick(e -> image.transform(transform -> 
                                    transform.rotation(transform.rotation()-45))),
                    new UIElement().layout(layout -> layout.flex(1)), // occupies the remaining space
                    // a button to rotate the image 45°
                    new Button().setText("+45°")
                            .setOnClick(e -> image.transform(transform -> 
                                    transform.rotation(transform.rotation() + 45)))
            )
    ).style(style -> style.background(Sprites.BORDER)); // set a background for the root element
    // set padding and gap for children elements
    root.layout(layout -> layout.paddingAll(7).gapAll(5));
    // create a UI
    var ui = UI.of(root);
    // return a modular UI for runtime instance
    return ModularUI.of(ui);
}
```

<figure markdown="span">![Tutorial 3 Result](./assets/gs_s4.gif){宽度=“80%”}</figure>
在上一步中，我们使用`Button#setOnClick()`来处理交互。虽然这很方便，但它只是 Button 组件提供的 API 方法。
LDLib2 本身公开了一个完整且灵活的 UI 事件系统。任何 UIElement 都可以监听输入事件，例如鼠标单击、悬停、命令、生命周期、拖动、焦点、键盘输入等。查看 [event page](./preliminary/event.md){ data-preview } 了解更多详细信息。
通过将基本 UIElement 与事件侦听器和样式相结合，您可以实现完全自定义的交互式组件（包括按钮）。

```java hl_lines="17-26"
private static ModularUI createModularUI() {
    // create a root element
    var root = new UIElement();
    // add an element to display an image based on a resource location
    var image = new UIElement().layout(layout -> layout.width(80).height(80))
            .style(style -> style.background(
                    SpriteTexture.of("ldlib2:textures/gui/icon.png"))
            );
    root.addChildren(
            // add a label to display text
            new Label().setText("UI Event")
                    // center align text
                    .textStyle(textStyle -> textStyle.textAlignHorizontal(Horizontal.CENTER)),
            image,
            // add a container with the row flex direction
            new UIElement().layout(layout -> layout.flexDirection(YogaFlexDirection.ROW)).addChildren(
                    // implement the button by using ui events
                    new UIElement().addChild(new Label().setText("-45°").textStyle(textStyle -> textStyle.adaptiveWidth(true)))
                            .layout(layout -> layout.justifyItems(YogaJustify.CENTER).paddingHorizontal(3))
                            .style(style -> style.background(Sprites.BORDER1))
                            .addEventListener(UIEvents.MOUSE_DOWN, e -> image.transform(transform ->
                                    transform.rotation(transform.rotation()-45)))
                            .addEventListener(UIEvents.MOUSE_ENTER, e ->
                                    e.currentElement.style(style -> style.background(Sprites.BORDER1_DARK)), true)
                            .addEventListener(UIEvents.MOUSE_LEAVE, e ->
                                    e.currentElement.style(style -> style.background(Sprites.BORDER1)), true),
                    new UIElement().layout(layout -> layout.flex(1)), // occupies the remaining space
                    // a button to rotate the image 45°
                    new Button().setText("+45°")
                            .setOnClick(e -> image.transform(transform ->
                                    transform.rotation(transform.rotation() + 45)))
            )
    ).style(style -> style.background(Sprites.BORDER)); // set a background for the root element
    // set padding and gap for children elements
    root.layout(layout -> layout.paddingAll(7).gapAll(5));
    // create a UI
    var ui = UI.of(root);
    // return a modular UI for runtime instance
    return ModularUI.of(ui);
}
```

<figure markdown="span">![Tutorial 5 Result](./assets/gs_s5.gif){宽度=“80%”}</figure>
---

## 教程 4：UI 样式表
在[Tutorial 2](#tutorial-2-better-layout-and-style)中，我们通过直接在代码中配置布局和样式来改进布局和视觉外观。虽然这很有效，但随着 UI 的增长，内联布局和样式定义很快就会变得冗长且难以维护。
为了解决这个问题，LDLib2 引入了一个名为 `LSS` (LDLib2 StyleSheet) 的样式表系统。LSS 允许您以类似 CSS 的声明方式描述布局和样式属性，将视觉设计与 UI 结构分开。检查 [stylesheet page](./preliminary/stylesheet.md){ data-preview } 了解更多详细信息。
在下面的示例中，我们使用 LSS 重新实现步骤 3 中的布局和样式逻辑：
* 示例 1 演示了直接在 UI 元素上的 LSS 绑定* 示例 2 显示如何定义独立样式表并将其应用到 UI
===“示例1”
    ```java
    private static ModularUI createModularUI() {
        var root = new UIElement();
        root.addChildren(
                new Label().setText("LSS example")
                        .lss("horizontal-align", "center"),
                new Button().setText("Click Me!"),
                new UIElement()
                        .lss("width", 80)
                        .lss("height", 80)
                        .lss("background", "sprite(ldlib2:textures/gui/icon.png)")
        );
        root.lss("background", "built-in(ui-gdp:BORDER)");
        root.lss("padding-all", 7);
        root.lss("gap-all", 5);
        var ui = UI.of(root);
        return ModularUI.of(ui);
    }
    ```

===“示例2”
    ```java
    private static ModularUI createModularUI() {
        // set root with an ID
        var root = new UIElement().setId("root");
        root.addChildren(
                new Label().setText("LSS example"),
                new Button().setText("Click Me!"),
                // set the element with a class
                new UIElement().addClass("image")
        );
        var lss = """
            // id selector
            #root {
                background: built-in(ui-gdp:BORDER);
                padding-all: 7;
                gap-all: 5;
            }
            
            // class selector
            .image {
                width: 80;
                height: 80;
                background: sprite(ldlib2:textures/gui/icon.png);
            }
            
            // element selector
            #root label {
                horizontal-align: center;
            }
            """;
        var stylesheet = Stylesheet.parse(lss);
        // add stylesheets to ui
        var ui = UI.of(root, stylesheet);
        return ModularUI.of(ui);
    }
    ```

!!!信息“内置样式表”除了自定义 LSS 定义之外，LDLib2 还提供了几个涵盖最常见 UI 组件的**内置样式表**主题：
    - `#!java StylesheetManager.GDP`    - `#!java StylesheetManager.MC`    - `#!java StylesheetManager.MODERN`
这些内置样式表允许您通过最少的设置将一致的视觉样式应用于整个 UI。您可以通过 `StylesheetManager` 访问和管理它们，它充当所有可用样式表包的中央注册表。
```java
private static ModularUI createModularUI() {
    var root = new UIElement();
    root.layout(layout -> layout.width(100));
    root.addChildren(
            new Label().setText("Stylesheets"),
            new Button().setText("Click Me!"),
            new ProgressBar().setProgress(0.5f).label(label -> label.setText("Progress")),
            new Toggle().setText("Toggle"),
            new TextField().setText("Text Field"),
            new UIElement().layout(layout -> layout.setFlexDirection(YogaFlexDirection.ROW)).addChildren(
                    new ItemSlot().setItem(Items.APPLE.getDefaultInstance()),
                    new FluidSlot().setFluid(new FluidStack(Fluids.WATER, 1000))
            ),
            // list all stylesheets
            new Selector<ResourceLocation>()
                    .setSelected(StylesheetManager.GDP, false)
                    .setCandidates(StylesheetManager.INSTANCE.getAllPackStylesheets().stream().toList())
                    .setOnValueChanged(selected -> {
                        // switch to the selected stylesheet
                        var mui = root.getModularUI();
                        if (mui != null) {
                            mui.getStyleEngine().clearAllStylesheets();
                            mui.getStyleEngine().addStylesheet(StylesheetManager.INSTANCE.getStylesheetSafe(selected));
                        }
                    })
    );
    root.addClass("panel_bg");
    // use GDP stylesheets by default
    var ui = UI.of(root, StylesheetManager.INSTANCE.getStylesheetSafe(StylesheetManager.GDP)));
    return ModularUI.of(ui);
}
```

<figure markdown="span">![Tutorial 4 Result](./assets/gs_s6.gif){宽度=“80%”}</figure>
---

## 教程 5：数据绑定
LDLib2 为大多数数据驱动的 UI 组件提供内置数据绑定支持。这允许 UI 元素与底层数据保持同步，而无需手动更新逻辑。绑定系统基于`#!java IObserver<T>` 和`#!java IDataProvider<T>`。检查 [data bindings page](./preliminary/data_bindings.md){ data-preview } 了解更多详细信息。
在这个例子中：
- 共享的 AtomicInteger 充当单一事实来源- 按钮直接修改数值- TextField 通过观察者更新值- 数据变化时标签和进度条自动刷新
```java
private static ModularUI createModularUI() {
    // a value holder
    var valueHolder = new AtomicInteger(0);

    var root = new UIElement();
    root.addChildren(
            new Label().setText("Data Bindings")
                    .textStyle(textStyle -> textStyle.textAlignHorizontal(Horizontal.CENTER)),
            new UIElement().layout(layout -> layout.flexDirection(YogaFlexDirection.ROW)).addChildren(
                    // button to decrease the value
                    new Button().setText("-")
                            .setOnClick(e -> {
                                if (valueHolder.get() > 0) {
                                    valueHolder.decrementAndGet();
                                }
                            }),
                    new TextField()
                            .setNumbersOnlyInt(0, 100)
                            .setValue(String.valueOf(valueHolder.get()))
                            // bind an Observer to update the value holder
                            .bindObserver(value -> valueHolder.set(Integer.parseInt(value)))
                            // bind a DataSource to notify the value changes
                            .bindDataSource(SupplierDataSource.of(() -> String.valueOf(valueHolder.get())))
                            .layout(layout -> layout.flex(1)),
                    // button to increase the value
                    new Button().setText("+")
                            .setOnClick(e -> {
                                if (valueHolder.get() < 100) {
                                    valueHolder.incrementAndGet();
                                }
                            })
            ),
            // bind a DataSource to notify the value changes for label and progress bar
            new Label().bindDataSource(SupplierDataSource.of(() -> Component.literal("Binding: ").append(String.valueOf(valueHolder.get())))),
            new ProgressBar()
                    .setProgress(valueHolder.get() / 100f)
                    .bindDataSource(SupplierDataSource.of(() -> valueHolder.get() / 100f))
                    .label(label -> label.bindDataSource(SupplierDataSource.of(() -> Component.literal("Progress: ").append(String.valueOf(valueHolder.get())))))
    ).style(style -> style.background(Sprites.BORDER));
    root.layout(layout -> layout.width(100).paddingAll(7).gapAll(5));
    return ModularUI.of(UI.of(root));
}
```

<figure markdown="span">![Tutorial 5 Result](./assets/gs_s7.gif){宽度=“80%”}</figure>
---

## 教程 6：`ModularUI` 菜单
在之前的教程中，我们重点介绍了客户端屏幕内的渲染。这对于纯视觉或仅限客户端的界面非常有效。
然而，《我的世界》中的大多数现实世界 GUI 都是服务器客户端同步的。当 GUI 涉及游戏逻辑或持久数据时，服务器必须保持权威。在普通 Minecraft 中，这是通过 `Menu` 处理的，它管理服务器和客户端之间的同步。
与仅支持客户端渲染的 UI 库不同，LDLib2 为服务器支持的菜单提供一流的支持。您可以直接通过菜单使用`ModularUI`，无需额外的网络或同步代码。
让我们创建一个简单的基于菜单的 UI 来显示玩家的库存。
```java
private static ModularUI createModularUI(Player player) {
    var root = new UIElement();
    root.addChildren(
            new Label().setText("Menu UI"),
            // add player invotry 
            new InventorySlots()
    ).addClass("panel_bg");

    var ui = UI.of(root, StylesheetManager.INSTANCE.getStylesheetSafe(StylesheetManager.GDP));
    // pass the player to the Modular UI
    return ModularUI.of(ui, player);
}
```

您必须使用 `Player` 创建 `ModularUI`，这对于基于菜单的 UI 是必需的。此外，不仅是屏幕，您还应该为您的`Menu`初始化`ModularUI`：
* 初始化应该在创建之后、写入额外数据缓冲区之前完成。* 如有必要，请不要忘记设置正确的屏幕图像尺寸。
```java
public class MyContainerMenu extends AbstractContainerMenu {
    // you can do initialization in the constructor
    public MyContainerMenu(...) {
        super(...)
        
        var modularUI = createModularUI(player)
        // we have added mixin to make the AbstractContainerMenu implementing the interface
        if (this instanceof IModularUIHolderMenu holder) {
            holder.setModularUI(modularUI);
        }
    }

    // .....
}

public class MyContainerScreen extends AbstractContainerScreen<MyContainerMenu> {
    @Override
    public void init() {
        // the modular widget has already added + init by events
        this.imageWidth = (int) getMenu().getModularUI().getWidth();
        this.imageHeight = (int) getMenu().getModularUI().getHeight();
        super.init();
    }

    // .....
}
```

!!!信息“快速测试”要使用和打开基于菜单的UI，您需要注册自己的`MenuType`，LDLib2还提供`ModularUIContainerScreen`和`ModularUIContainerMenu`来帮助您快速设置。检查 [screen and menu page](./preliminary/screen_and_menu.md){ data-preview } 了解更多详细信息。
或者，您可以使用提供的 [factories](./factory.md){ data-preview } 更快地开始。它们允许您通过最少的设置为块、项目或玩家创建基于菜单的 UI，而无需处理手动注册或样板代码。在本例中，我们使用`PlayerUIMenuType` 进行快速演示。
    ```java
    public static final ResourceLocation UI_ID = LDLib2.id("unique_id");

    // register your ui somewhere, e.g. during your mod initialization.
    public static void registerPlayerUI() {
        PlayerUIMenuType.register(UI_ID, ignored -> player -> createModularUI(player));
    }
    
    public static void openMenuUI(Player player) {
        PlayerUIMenuType.openUI(player, UI_ID);
    }
    ```

<figure markdown="span">![Tutorial 6 Result](./assets/gs_s8.gif){宽度=“80%”}</figure>
---

## 教程7：Screen和Menu之间的通信
虽然 `InventorySlots` 开箱即用，但它们是预先打包的内置组件。在实际项目中，您通常需要更多地控制数据和事件在客户端屏幕和服务器端菜单之间的流动方式。
ModularUI 跨客户端和服务器提供对`data bindings` 和`event dispatch` 的全面支持。这使得客户端上的 UI 交互可以安全地触发服务器上的逻辑，并且服务器端状态更改可以自动更新 UI。检查 [data bindings page](./preliminary/data_bindings.md){ data-preview } 了解更多详细信息。
在这里，我们重点关注实用模式，以帮助您快速入门。
```java
// represents data on the server
private final ItemStackHandler itemHandler = new ItemStackHandler(2);
private final FluidTank fluidTank = new FluidTank(2000);
private boolean bool = true;
private String string = "hello";
private float number = 0.5f;

private static ModularUI createModularUI(Player player) {
    // create a root element
    var root = new UIElement();
    root.addChildren(
            // add a label to display text
            new Label().setText("Data Between Screen and Menu"),
            // bind storage to slots
            new UIElement().addChildren(
                    new ItemSlot().bind(itemHandler, 0),
                    new ItemSlot().bind(new ItemHandlerSlot(itemHandler, 1).setCanTake(p -> false)),
                    new FluidSlot().bind(fluidTank, 0)
            ).layout(l -> l.gapAll(2).flexDirection(YogaFlexDirection.ROW)),
            // bind value to the components
            new UIElement().addChildren(
                    new Switch().bind(DataBindingBuilder.bool(() -> bool, value -> bool = value).build()),
                    new TextField().bind(DataBindingBuilder.string(() -> string, value -> string = value).build()),
                    new Scroller.Horizontal().bind(DataBindingBuilder.floatVal(() -> number, value -> number = value).build()),
                    // read-only (s->c), always get data from the server and display on the client
                    new Label().bind(DataBindingBuilder.componentS2C(() -> Component.literal("s->c only: ")
                            .append(Component.literal(String.valueOf(bool)).withStyle(ChatFormatting.AQUA)).append(" ")
                            .append(Component.literal(string).withStyle(ChatFormatting.RED)).append(" ")
                            .append(Component.literal("%.2f".formatted(number)).withStyle(ChatFormatting.YELLOW)))
                            .build())
            ).layout(l -> l.gapAll(2)),
            // trigger ui events on the server side
            new Button().addServerEventListener(UIEvents.MOUSE_DOWN, e -> {
                if (fluidTank.getFluid().getFluid() == Fluids.WATER) {
                    fluidTank.setFluid(new FluidStack(Fluids.LAVA, 1000));
                } else {
                    fluidTank.setFluid(new FluidStack(Fluids.WATER, 1000));
                }
            }),
            // you could also use button.setOnServerClick(e -> { ... })
            new InventorySlots()
    );
    root.addClass("panel_bg");

    // pass the player to the Modular UI
    return ModularUI.of(UI.of(root, StylesheetManager.INSTANCE.getStylesheetSafe(StylesheetManager.MODERN)), player);
}
```

<figure markdown="span">![Tutorial 7 Result](./assets/gs_s9.gif){宽度=“80%”}</figure>
---

## 结束
这还远没有结束。为什么不尝试一下强大的[UI editor](./ui_editor/index.md){ data-preview } 呢？