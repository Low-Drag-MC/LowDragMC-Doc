# UI Xml

{{ version_badge("2.1.6", label="自", icon="tag") }}

LDLib2 允许你使用 **XML** 定义 UI，包括 **样式** 和 **组件树**。
这提供了一种类似 **HTML（H5）UI 开发** 的工作流，使 UI 结构清晰且声明式。

一个最简的 **UI XML 模板** 如下所示：

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<ldlib2-ui xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
           xsi:noNamespaceSchemaLocation="https://raw.githubusercontent.com/Low-Drag-MC/LDLib2/refs/heads/1.21/ldlib2-ui.xsd">
    <stylesheet location="ldlib2:lss/mc.lss"/>
    <style>
        .half-button {
            width: 50%
        }
    </style>
    <root class="panel_bg" style="width: 150; height: 300">
        <button text="click me!"/>
        <button class="half-button" text="half"/>
    </root>
</ldlib2-ui>
```

属性 `xsi:noNamespaceSchemaLocation` 指向 LDLib2 提供的 XSD 模式。
在 VS Code、IntelliJ IDEA 或其他 IDE 中编辑 XML 时，该模式可提供：

* 语法高亮
* 验证与错误检查
* 自动补全与提示

## 加载 UI Xml 并进行设置

你可以通过以下方式加载并使用 UI XML 文件：

<figure markdown="span">
  ![编辑器外观](./assets/xml_path.png){ width="80%" }
</figure>

=== "Java"

    ```java
    var xml = XmlUtils.loadXml(ResourceLocation.parse("ldlib2:tuto.xml"));
    if (xml != null) {
        var ui = UI.of(xml);

        // 查找元素并在此处进行数据绑定或逻辑设置
        var buttons = ui.select(".button_container > button").toList(); // 通过选择器
        var container = ui.selectRegex("container").findFirst().orElseThrow(); // 通过 id 正则表达式
    }
    ```
=== "KubeJS"

    ```js
    let xml = XmlUtils.loadXml(ResourceLocation.parse("ldlib2:tuto.xml"));
    if (xml != null) {
        let ui = UI.of(xml);
        
        // 查找元素并在此处进行数据绑定或逻辑设置
        let buttons = ui.select(".button_container > button").toList(); // 通过选择器
        let container = ui.selectRegex("container").findFirst().orElseThrow(); // 通过 id 正则表达式
    }
    ```

!!! info
    `XmlUtils` 还提供了其他加载 XML 文档的方式，例如从字符串或输入流加载。
    请选择最适合你使用场景的方法。


## XML 语法概览

LDLib2 UI XML 使用**声明式语法**来描述 **UI 结构** 及其 **样式**，类似于 HTML + CSS。

在顶层，`<ldlib2-ui>` 根节点定义了一个完整的 UI 文档。
在其内部，你可以描述 **样式**、**外部样式表** 和 **组件树**。

### 样式表

!!! note inline end
    在阅读本章之前，请先阅读 [LSS 页面](./preliminary/stylesheet.md)。
你可以使用 `<stylesheet>` 标签引用外部 LSS 文件：

```xml
<stylesheet location="ldlib2:lss/mc.lss"/>
```

这允许你复用共享样式，或让资源包全局覆盖 UI 外观。

### 嵌入式样式

可以使用 **LSS（LDLib Style Sheet）** 语法在 `<style>` 块中定义内联样式：

```xml
<style>
    label:host {
        vertical-align: center;
        horizontal-align: center;
    }
    .flex-1 {
        flex: 1;
    }
    .bg {
        background: sprite(ldlib2:textures/gui/icon.png)
    }
</style>
```

### 内联样式属性

对于快速调整，样式也可以直接在元素上设置：

```xml
<button style="height: 30; align-items: center;"/>
```

内联样式的优先级高于样式表规则。

### 组件树

UI 布局在 `<root>` 下被描述为**元素树**。
每个 XML 节点对应一个 UI 组件，嵌套关系定义了父子关系。

属性用于配置组件属性，子节点用于定义结构。

---

简而言之：

* **`<stylesheet>`** → 加载外部样式
* **`<style>`** → 定义嵌入式样式
* **`style` 属性** → 内联样式
* **XML 层级结构** → UI 组件树

这使得 UI 定义清晰、易读且易于维护。
