# UITemplateElement

<VersionBadge version="2.2.1" label="Since" icon="tag" />

`UITemplateElement` loads a saved [`UITemplate`](../editor.md) resource and inserts its children and stylesheets into itself at runtime. It is used to reuse UI layouts created in the editor without duplicating code.

Circular template references are detected and logged as errors.

::: info
Everything documented on [UIElement](element.md) (layout, styles, events, data bindings, etc.) applies here too.
:::

---

## Usage

<DocTabs>
<DocTab title="Java">

```java
var tmpl = new UITemplateElement(IResourcePath.parse("mymod:my_panel"));
parent.addChild(tmpl);

// Change the template at runtime:
tmpl.setTemplate(IResourcePath.parse("mymod:other_panel"));
```

</DocTab>
<DocTab title="Kotlin">

```kotlin
uiTemplate("mymod:my_panel") { }
```

</DocTab>
<DocTab title="KubeJS">

```js
let tmpl = new UITemplateElement();
tmpl.setTemplate(IResourcePath.parse("mymod:my_panel"));
parent.addChild(tmpl);
```

</DocTab>
</DocTabs>

---

## XML

```xml
<template path="mymod:my_panel"/>
```

| XML Attribute | Type | Description |
| ------------- | ---- | ----------- |
| `path` | `string` | Resource path of the `UITemplate` to load (e.g. `mymod:my_panel`). |

---

## Fields

| Name | Type | Access | Description |
| ---- | ---- | ------ | ----------- |
| `path` | `IResourcePath` (nullable) | `private` (getter) | The currently loaded template path. |
| `template` | `UITemplate` (nullable) | `private` (getter) | The resolved `UITemplate` instance. |

---

## Methods

| Method | Returns | Description |
| ------ | ------- | ----------- |
| `setTemplate(IResourcePath)` | `UITemplateElement` | Loads a new template, replacing the current children and styles. Pass `null` to clear. |
