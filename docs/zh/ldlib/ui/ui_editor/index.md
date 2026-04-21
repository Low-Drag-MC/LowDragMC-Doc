# 入门指南

UI编辑器是由ldlib提供的强大内置可视化编辑器。你可以使用它轻松设计UI，在自己的模组中使用，或者通过 [Java / KubeJS](../code/load_ui_file.md) 来调用。

## 1. 入门

### 如何打开UI编辑器

通常情况下，你可以使用命令 `/ldlib ui_editor` 打开编辑器，它会将 `./minecraft/ldlib/..` 作为工作目录。

![image](https://user-images.githubusercontent.com/18493855/207100937-f389592e-9d36-4ae6-a737-b872022567dd.png)

### 主界面

![image](https://user-images.githubusercontent.com/18493855/207102856-193f52f7-088d-4f8c-b71f-abc9f6856790.png)

1. 菜单栏：新建/保存/打开UI项目。你也可以在这里导入/导出 `资源`。
2. 配置器：基本上所有的设置都在这里进行。
3. 资源：可用的资源，例如 `颜色`、`纹理`、`语言条目`。

### 创建新项目

首次使用时，点击此处创建一个空的UI项目。（如果你是为MBD制作UI，请选择MBD项目）

![image](https://user-images.githubusercontent.com/18493855/207104553-d56a2266-98b2-43b7-8903-3c3810a9558c.png)

不出意外，你会看到以下界面。

![image](https://user-images.githubusercontent.com/18493855/207105549-c750ce31-9c4e-4420-87fd-09d0f2544594.png)

1. 工具箱：包含所有可用的UI控件（组件）。
2. 根控件：整个项目有且仅有一个根控件，它由系统创建，你无法删除。


## 2. 基础操作

![image](https://user-images.githubusercontent.com/18493855/207110268-b75967b0-69c1-4263-9bc6-aef33f9f43d9.png)

1. 红色框表示已选中的控件。
2. 蓝色框表示鼠标当前悬停的控件。

### 多选

按住 `ctrl` 键可以进行多选/取消选择控件。

### 拖动选中的控件

![image](https://user-images.githubusercontent.com/18493855/207109182-7c549ca1-f4b5-4e89-8d3a-57d5348200d1.png)

1. 按住 `alt` + `左键点击`，如果你看到箭头（所有方向），那么你就可以拖动它。
2. 当然，你也可以通过配置器修改位置。

### 缩放选中的控件

![image](https://user-images.githubusercontent.com/18493855/207111279-a0e1e27e-fcb1-4c9b-accc-5c8d9d0ef267.png)

1. 按住 `alt` + `右键点击`，如果你看到箭头（右下角），那么你就可以缩放它。
2. 当然，你也可以通过配置器修改大小。

### 添加控件

所有控件（除了根控件）都需要添加到一个接受它的 `父控件` 中，我们称这种 `父控件` 为 `组类型` 控件（例如 `Group`、`Tab Group`、`Scrollable Group`）。

![image](https://user-images.githubusercontent.com/18493855/207111943-d6e4c404-f2e7-4c1d-ac5f-5889581dc4c8.png)

1. 你可以在工具箱中找到所有可用的控件。
2. 将控件拖入 `组类型` 控件中。
3. 如果该控件可以接受它，会显示绿色框。

### 将控件从一个组移动到另一个组

有时你可能需要修改父控件。

1. 你可以通过菜单（右键点击页面）来剪切/复制到选中的父控件。
2. 更好的方法是按住 `shift` 键并将它移动到新组中。

![image](https://user-images.githubusercontent.com/18493855/207114595-a94ee85b-816b-4a1a-a3c9-c5f023600a90.png)

如果该控件可以接受它，会显示绿色框。

### 调整子控件顺序

通常情况下，所有的 `Group` 控件在其配置器中都有一个 `children` 选项卡，显示所有子控件，你可以通过拖动来调整它们的顺序。

![image](https://user-images.githubusercontent.com/18493855/207114994-ea851fe4-c9f3-4367-ac8d-145d24384e2c.png)

### 菜单

右键点击页面打开菜单。

![image](https://user-images.githubusercontent.com/18493855/207116177-93860255-510c-4602-91ca-6fd85e1d649a.png)

1. 所有操作都将在选中的控件上执行。
2. 基础操作。
3. 对齐：当你选择多个控件时可用。
