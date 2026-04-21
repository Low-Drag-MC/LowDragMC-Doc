# 从文件加载 UI

虽然通过代码创建 UI 具有更高的灵活性，但对新手而言，使用 [`UI 编辑器`](../ui_editor/index.md) 更加直观和简单。理想的做法是通过编辑器设计 UI 布局，再通过代码绑定 UI 功能逻辑。

!!! note "阅读前须知"
    请确保你已具备使用 [`UI 编辑器`](../ui_editor/index.md) 创建 UI 的基本知识，并准备好用于加载的 UI 文件。

加载 UI 文件非常简单，只需几行代码。假设你有一个 UI 文件位于 `.minecraft/ldlib/assets/ldlib/projects/ui/test_ui.ui`。

![Image title](../assets/project_location.png){ width="30%" style="display: block; margin: 0 auto;" }

你可以通过 `UIProject.loadUIFromFile(location)` 方法获取一个 `creator`。`creator` 会缓存资源以加速创建过程，对于同一项目的加载，建议将其存储起来。

!!! warning
    如果 UI 文件无法加载，`creator` 可能为 null。

=== "Java"

    ``` java 
    public WidgetGroup createUI() {
        var creator = UIProject.loadUIFromFile(new ResourceLocation("ldlib:test_ui"));
        // creator 会缓存资源以加速创建过程。
        // 对于同一项目的加载，你最好将其存储起来。
        return creator.get();
    }
    ```

=== "KubeJS"

    ``` javascript
    function createUI() {
        let creator = UIProject.loadUIFromFile("ldlib:test_ui");
        // creator 会缓存资源以加速创建过程。
        // 对于同一项目的加载，你最好将其存储起来。
        return creator.get();
    }
    ```

---

## 绑定 UI 功能逻辑

加载 UI 项目后，我们需要为其绑定功能逻辑。首先，需要获取控件的实例。LDLib 提供了两种方法来获取：

1. `List<Widget> getWidgetsById(regex)`：根据正则表达式获取所有匹配的控件，并返回所有结果。
2. `Widget getFirstWidgetById(regex)`：根据正则表达式获取所有匹配的控件，并返回第一个结果。

!!! note
    别忘了为需要的控件分配 `id`。
    ![Image title](../assets/id_field.png){ width="70%" style="display: block; margin: 0 auto;" }

=== "Java"

    ``` java 
    public WidgetGroup createUI() {
        var creator = UIProject.loadUIFromFile(new ResourceLocation("ldlib:test_ui.ui"));
        // creator 会缓存资源以加速创建过程。
        // 对于同一项目的加载，你最好将其存储起来。
        var root = creator.get();

        var button = root.getFirstWidgetById("button_id");
        if (button != null) {
            button.setOnPressCallback(clickData -> {
                System.out.println(clickData.isShiftClick);
            });
        }
        
        return root;
    }
    ```

=== "KubeJS"

    ``` javascript
    function createUI() {
        let creator = UIProject.loadUIFromFile("ldlib:test_ui.ui");
        // creator 会缓存资源以加速创建过程。
        // 对于同一项目的加载，你最好将其存储起来。
        let root = creator.get();

        let button = root.getFirstWidgetById("button_id");
        if (button != null) {
            button.setOnPressCallback(clickData => {
                console.log(clickData.isShiftClick);
            });
        }

        return root;
    }
    ```
