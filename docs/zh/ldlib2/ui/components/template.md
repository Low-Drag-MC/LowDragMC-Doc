# UITemplateElement

{{ version_badge("2.2.1", label="自", icon="tag") }}

`UITemplateElement` 会加载一个已保存的 [`UITemplate`](../ui_template.md){ data-preview } 资源，并在运行时将它的子元素和样式表插入到自身中。它用于复用在编辑器中创建的 UI 布局，而无需重复编写代码。

循环模板引用会被检测并记录为错误。

!!! note ""
    [UIElement](element.md){ data-preview } 中记录的所有内容（布局、样式、事件、数据绑定等）同样适用于此处。

---

## 用法

=== "Java"

    ```java
    var tmpl = new UITemplateElement(IResourcePath.parse("mymod:my_panel"));
    parent.addChild(tmpl);

    // 在运行时更换模板：
    tmpl.setTemplate(IResourcePath.parse("mymod:other_panel"));
    ```

=== "Kotlin"

    ```kotlin
    uiTemplate("mymod:my_panel") { }
    ```

=== "KubeJS"

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

| XML 属性 | 类型 | 描述 |
| -------- | ---- | ---- |
| `path` | `string` | 要加载的 `UITemplate` 的资源路径（例如 `mymod:my_panel`）。 |

---

## 字段

| 名称 | 类型 | 访问权限 | 描述 |
| ---- | ---- | -------- | ---- |
| `path` | `IResourcePath` (nullable) | `private` (getter) | 当前已加载的模板路径。 |
| `template` | `UITemplate` (nullable) | `private` (getter) | 解析后的 `UITemplate` 实例。 |

---

## 方法

| 方法 | 返回 | 描述 |
| ---- | ---- | ---- |
| `setTemplate(IResourcePath)` | `UITemplateElement` | 加载新模板，替换当前的子元素和样式。传入 `null` 以清除。 |
