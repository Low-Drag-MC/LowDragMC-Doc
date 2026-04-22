# 资源

`UI 项目`包含三种内置资源：`textures`（纹理）、`colors`（颜色）和 `lang entries`（语言条目）。
资源归项目所有，无法在项目之间共享。

如果你希望当前项目的资源可以在其他项目中使用，可以先`导出`这些资源，然后打开其他项目进行`导入`。

![image](https://user-images.githubusercontent.com/18493855/207118889-eb6a0d13-5991-4f92-b397-e32cb17e2d9a.png)


## 纹理

![image](https://user-images.githubusercontent.com/18493855/207118279-5bd121bc-7996-41c1-9971-31d977c9b9e5.png)

1. 已存储的纹理。
2. 添加新纹理，很高兴我们目前支持多种纹理类型 :)。
3. 值得注意的是，`empty` 是一个内置纹理，你无法删除它。

### 使用纹理

当你打开组件的配置时，会发现有些地方可以接受纹理（例如基础信息的背景），你可以将纹理拖入其中。

![image](https://user-images.githubusercontent.com/18493855/207120061-c1bed1fb-0aa4-4f23-aa8f-ff8768444e9a.png)

1. 拖拽纹理。
2. 如果该区域可以接受此纹理，则会显示绿色边框。

**注意：当你将纹理拖入组件时，默认会替换其背景图像。**

![image](https://user-images.githubusercontent.com/18493855/207120775-5f3dd588-782a-4258-9436-a78d1f9b8e4f.png)

### 编辑纹理

右键点击以打开菜单并编辑选中的纹理。

![image](https://user-images.githubusercontent.com/18493855/207121897-592cecfb-45e4-489e-9614-e6397f8d51ed.png)

1. 打开其配置器。
2. 修改纹理类型。一般来说你最好不要修改它，因为切换类型不会修改之前类型的引用。
3. 某些纹理会提供设置预览，你可以点击它来打开文件选择器。
4. 你可以通过设置 Transform（变换）来缩放、平移和旋转纹理。

**注意：你可以使用带变换的 GroupTexture（组合纹理）来创建更复杂的纹理。**

![image](https://user-images.githubusercontent.com/18493855/207123282-4fa17b0f-f82c-4ffb-b483-8d224cafc670.png)

1. 组合多个纹理。
2. 添加新图层。

**注意：你可以通过设置帧的起始和结束位置以及间隔时间来创建动画纹理。**

![image](https://user-images.githubusercontent.com/18493855/207124029-113ef4fd-e599-4a0c-b28c-467bd7141e1c.png)


## 颜色

### 使用颜色

当你打开配置时，会发现有些地方可以接受数字（例如标签组件的颜色），你可以将颜色拖入其中。

![image](https://user-images.githubusercontent.com/18493855/207125094-5c023c4d-8582-46fc-86cc-3b17171f4d3f.png)

1. 拖拽颜色。
2. 如果该区域可以接受此颜色，则会显示绿色边框。

**注意：当你将颜色拖入组件时，默认会将其背景替换为 Color Texture（颜色纹理）。**

![image](https://user-images.githubusercontent.com/18493855/207125654-4403fddd-7108-4873-84e8-bab76e5e95bc.png)

### 编辑颜色

右键点击以打开菜单并编辑选中的颜色。

![image](https://user-images.githubusercontent.com/18493855/207126473-73db777c-ebb9-4920-a102-90d40360fea2.png)

1. 拾取颜色（HSB 模式），你可以右键点击调色板来切换模式。
2. 预览。
3. 通过 ARGB 修改。

## 条目

Entries 存储键值对，可以将其视为一个语言文件。

当你打开配置时，会发现有些地方可以接受数字（例如标签组件的颜色），你可以将颜色拖入其中。
你可以填写本地化数据，然后直接导出到语言文件（开发中）

### 使用条目

![image](https://user-images.githubusercontent.com/18493855/207215664-ff2cfc9b-519d-4907-8683-2922f3ad4032.png)

1. 拖拽条目。
2. 如果该区域可以接受字符串，则会显示绿色边框。

**注意：当你将条目拖入组件时，默认会替换其悬停提示。**

![image](https://user-images.githubusercontent.com/18493855/207215796-5e61a6e1-bc90-47c4-9282-48c1474b48b6.png)

### 编辑条目

右键点击以打开菜单并编辑其值。

![image](https://user-images.githubusercontent.com/18493855/207215986-83e17a3f-fe3a-4fe5-9f71-fb3f0bbdf0b4.png)

1. 在此处输入你的文本。

你可以右键点击打开菜单并重命名其键。
