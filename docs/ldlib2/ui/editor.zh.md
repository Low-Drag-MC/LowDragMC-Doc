# 用户界面编辑器
{{ version_badge("2.1.5", label="Since", icon="tag") }}
!!!警告内联结束该命令只能在`single player`世界下使用。
LDLib2提供了一个可视化编辑器来支持UI创建。使用命令打开 UI 编辑器。
```shell
/ldlib2_ui_editor
```

<figure markdown="span">![Editor apperance](./assets/editor_01.png){宽度=“80%”}</figure>
UI 编辑器支持两种通过可视化创建 UI 的方法：
* `UI XML`* `UI Template`
---

## 用户界面 XML
单击 **`File → New → UI XML File`** 创建新的 UI XML 文件。您还可以单击 **`Open`** 加载现有 XML 文件。
<figure markdown="span">![Editor appearance](./assets/editor_new_xml.png){宽度=“80%”}</figure>
<figure markdown="span">![Editor appearance](./assets/editor_xml.png){宽度=“80%”}</figure>
打开后，您可以编辑 XML 并直接在编辑器中查看 UI 的**实时预览**。有关更多 xml 详细信息，请查看 [UI Xml](./xml.md){ data-preview }
!!!提示您还可以使用外部 IDE（例如 VS Code 或 IntelliJ IDEA）编辑 XML 文件。当您保存更改时，预览将自动更新。
---

## 用户界面模板
**UI 模板** 类似于 **UI XML**，用于定义 UI 内容（包括**样式**和**组件树**）。
主要区别是：
- UI 模板可以使用 **UI 编辑器**进行**可视化**。- 保存的 UI 模板可以在其他 **UI XML** 文件或 **UI 模板** 中作为 **模板组件** 重用。
与 UI XML 文件不同，**UI 模板由 LDLib2 的资源系统管理**。要创建一个，请使用**资源面板**：
<figure markdown="span">![Editor appearance](./assets/editor_template.png){宽度=“100%”}</figure>
**步骤：**
1. 选择 **UI** 资源类别。2. 选择或创建**资源提供者**。3. 右键单击并创建一个**UI模板**，然后双击它进入编辑模式。
### 编辑你的模板
打开UI Template后，您将看到以下编辑器界面：
<figure markdown="span">![Editor appearance](./assets/editor_view.png){宽度=“100%”}</figure>
1. **样式配置器**编辑内置样式、添加或删除外部样式表以及检查应用的样式。
2. **用户界面树**显示完整的 UI 层次结构。您可以通过上下文菜单创建或删除组件、选择多个元素或拖动以重新排序层次结构。
3. **元素配置器**显示当前所选元素的可配置属性。
4. **预览**提供 UI 的实时预览。
使用 UI 编辑器，您可以直观地配置 **布局**、**样式** 和其他设置。如果您了解*初步*部分中介绍的概念，则编辑器应该易于使用。对于具有特殊配置选项的组件，请参阅其各自的文档页面。
### 加载 UI 模板和设置有两种方法可以加载和使用 UI 模板。
1. 您还可以将其移动到您的资源中并通过`ResourceLoaction`加载它。2. 如果资源在ldlib2文件夹下，可以右键该资源获取资源路径并加载。
<figure markdown="span">![Editor appearance](./assets/template_path.png){宽度=“100%”}</figure>
===“Java”
    ```java
    @Override
    public ModularUI createUI(Player player) {
        var ui = Optional.ofNullable(UIResource.INSTANCE.getResourceInstance()
                // resource location based
                .getResource(new FilePath(ResourceLoaction.parse("ldlib2:resources/examples/example_layout.ui.nbt"))))

                // file based
                //.getResource(new FilePath(new File(LDLib2.getAssetsDir(), "ldlib2/resources/examples/example_layout.ui.nbt"))) // LDLib2.getAssetsDir() = ".minecraft/ldlib2/assets"

                .map(UITemplate::createUI)
                .orElseGet(UI::empty);

        // find elemetns and do data bindings or logic setup here
        var buttons = ui.select(".button_container > button").toList(); // by selector
        var container = ui.selectRegex("container").findFirst().orElseThrow(); // by id regex

        return ModularUI.of(ui, player);
    }
    ```

===“KubeJS”
    ```js
    function createUIFromUIResource(path) {
        return UIResource.INSTANCE.getResourceInstance().getResource(path).createUI();
    }

    function createUI(player) {
        // file based
        let ui = createUIFromUIResource("file(./ldlib2/assets/ldlib2/resources/global/modern_styles.ui.nbt)")

        // resource location based
        // let ui = createUIFromUIResource("pack(ldlib2:resources/global/modern_styles.ui.nbt)")

        // find elemetns and do data bindings or logic setup here
        let buttons = ui.select(".button_container > button").toList(); // by selector
        let container = ui.selectRegex("container").findFirst().orElseThrow(); // by id regex

        return ModularUI.of(ui, player)
    }
    ```

### 加载事件
保存的 **UI 模板** 仅定义视觉结构和样式 - 默认情况下不包括运行时逻辑。在大多数情况下，您加载模板，然后在代码中手动附加处理程序或绑定。
但是，如果您想**在不同的上下文中重用相同的 UI**，每次都重复相同的设置逻辑会变得乏味。
为了解决这个问题，**LDLib2 提供了一个钩子事件**，允许您在 UI 模板调用 `createUI()`** 时注入逻辑，这样您就可以在创建过程中自动配置返回的 `UI`。
```java
@SubscribeEvent
public static void onUICreated(UITemplate.CreateUI event) {
    var template = event.template;
    var ui = event.ui;
    // do initialization here
}
```

---

## 用户界面模拟
单击编辑器顶部的**绿色播放按钮**进入**模拟模式**。这允许您与 UI 交互并验证其行为。
<figure markdown="span">![Editor appearance](./assets/editor_simulation.png){宽度=“100%”}</figure>