# Get Start
The UI Editor is a powerful built-in visual editor provided by ldlib. You can use it to easily design your UI, use it in your own mods, or use it through [Java / KubeJS](../code/load_ui_file.md).

## 1. Get Start 

### How to open the UI Editor
In general, you can open it by command`/ldlib ui_editor`, which will use `./minecraft/ldlib/..` as its workspace.

![image](https://user-images.githubusercontent.com/18493855/207100937-f389592e-9d36-4ae6-a737-b872022567dd.png)

### Main Screen

![image](https://user-images.githubusercontent.com/18493855/207102856-193f52f7-088d-4f8c-b71f-abc9f6856790.png)

1. Menu: New/Save/Open UI projects. You can also import/export `Resources` here.
2. Configurator: Basically all the setup happens here.
3. Resources: available resources, e.g. `color`, `texture`, `lang entries`.

### Create a new project
When you first use it, click it to create an empty UI project. (If you are making UI for MBD, select the MBD project)

![image](https://user-images.githubusercontent.com/18493855/207104553-d56a2266-98b2-43b7-8903-3c3810a9558c.png)

No surprise, you'll see the follow case.

![image](https://user-images.githubusercontent.com/18493855/207105549-c750ce31-9c4e-4420-87fd-09d0f2544594.png)

1. ToolBox: Contains all the available UI widgets(components).
2. Root Widget: The whole project has one and only one root widget, which is created by the system and you cannot delete it.


## 2. Basic
![image](https://user-images.githubusercontent.com/18493855/207110268-b75967b0-69c1-4263-9bc6-aef33f9f43d9.png)

1. red frame are selected widgets.
2. blue frame is the widget that mouse is hovering over it.

### Multi-Select
Press `ctrl` to multi-select / cancle-select widget.

### Drag Selected Widgets
![image](https://user-images.githubusercontent.com/18493855/207109182-7c549ca1-f4b5-4e89-8d3a-57d5348200d1.png)

1. Hold down `alt` + `left-clicked`, if you see the arrows (all directions) then you can drag it.
2. Anyway, you could also modify position by a configurator.

### Scale Selected Widgets
![image](https://user-images.githubusercontent.com/18493855/207111279-a0e1e27e-fcb1-4c9b-accc-5c8d9d0ef267.png)

1. Hold down `alt` + `right-clicked`, if you see the arrows (right bottom) then you can scale it.
2. Anyway, you could also modify size by a configurator.

### Add a Widget
All widgets (except the Root) need to be added to a `father (parent)` widget that accepts it, and we call such `father (parent)` widget as `Group Type` widget (e.g. `Group`, `Tab Group`, `Scrollable Group`).
 
![image](https://user-images.githubusercontent.com/18493855/207111943-d6e4c404-f2e7-4c1d-ac5f-5889581dc4c8.png)

1. You can find all available widgets in the toolbox.
2. Drag a widget into a `Group Type` widget. 
3. Rendering a green frame if such widget can accept it.

### Move widget from one Groug to another Group
Sometimes you may want to modify the parent control. 

1. You can do this by the menu (right-clicking page) and cut/copy to the selected parent widget. 
2. A better way is to press the `shift`and move it into the new Group.

![image](https://user-images.githubusercontent.com/18493855/207114595-a94ee85b-816b-4a1a-a3c9-c5f023600a90.png)
Rendering a green frame if such widget can accept it.

### Adjust Children Widgets Order
In general, all the `Group` widgets have a `children` tab in its configurator, showing all children, you can adjust their order by dragging.

![image](https://user-images.githubusercontent.com/18493855/207114994-ea851fe4-c9f3-4367-ac8d-145d24384e2c.png)

### Menu
Right-click the page to open the menu.

![image](https://user-images.githubusercontent.com/18493855/207116177-93860255-510c-4602-91ca-f6d85e1d649a.png)

1. All operations will be performed on selected widgets.
2. Basic operations
3. Align: availabe when you select multi widgets.







