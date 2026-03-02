# UI模板元素
{{ version_badge("2.2.1", label="Since", icon="tag") }}
`UITemplateElement` 加载已保存的 [`UITemplate`](../ui_template.md){ data-preview } 资源，并在运行时将其子项和样式表插入到自身中。它用于重用在编辑器中创建的 UI 布局，而无需重复代码。
循环模板引用被检测并记录为错误。
!!!笔记 ””[UIElement](../element.md){ data-preview } 上记录的所有内容（布局、样式、事件、数据绑定等）也适用于此处。
---

＃＃ 用法
===“Java”
    ```java
    var tmpl = new UITemplateElement(IResourcePath.parse("mymod:my_panel"));
    parent.addChild(tmpl);

    // Change the template at runtime:
    tmpl.setTemplate(IResourcePath.parse("mymod:other_panel"));
    ```

===“科特林”
    ```kotlin
    uiTemplate("mymod:my_panel") { }
    ```

===“KubeJS”
    ```js
    let tmpl = new UITemplateElement();
    tmpl.setTemplate(IResourcePath.parse("mymod:my_panel"));
    parent.addChild(tmpl);
    ```

---

## XML
```xml
<template path="mymod:my_panel"/>
```

| XML Attribute | Type | Description |
| ------------- | ---- | ----------- |
| `path` | `string` | Resource path of the `UITemplate` to load (e.g. `mymod:my_panel`). |

---

## 字段
| Name | Type | Access | Description |
| ---- | ---- | ------ | ----------- |
| `path` | `IResourcePath` (nullable) | `private` (getter) | The currently loaded template path. |
| `template` | `UITemplate` (nullable) | `private` (getter) | The resolved `UITemplate` instance. |

---

＃＃ 方法
| Method | Returns | Description |
| ------ | ------- | ----------- |
| `setTemplate(IResourcePath)` | `UITemplateElement` | Loads a new template, replacing the current children and styles. Pass `null` to clear. |
