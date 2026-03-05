# CodeEditor

{{ version_badge("2.2.1", label="Since", icon="tag") }}

`CodeEditor` 继承自 [`TextArea`](text-area.md){ data-preview }，并添加了语法高亮、代码折叠和编辑器级别的快捷键支持。默认使用内置的 JetBrains Mono Bold 字体。

在 `TextArea` 基础上增加的快捷键：

| 快捷键 | 操作 |
| -------- | ------ |
| `Tab` | 在光标位置插入两个空格。 |
| `Ctrl+/` | 切换当前行或选中内容的 `//` 行注释。 |
| `Enter` | 插入新行并保留上一行的前导缩进。 |

[`TextArea`](text-area.md){ data-preview } 的所有功能（样式、值绑定、验证器、滚动条等）在此同样适用。

!!! note ""
    [UIElement](../element.md){ data-preview } 中记录的所有内容（布局、样式、事件、数据绑定等）在此同样适用。

---

## 用法

=== "Java"

    ```java
    var editor = new CodeEditor();
    editor.setLanguage(Languages.JSON);
    editor.setValue(new String[] { "{", "  \"key\": \"value\"", "}" }, false);
    editor.setLinesResponder(lines -> System.out.println(String.join("\n", lines)));
    parent.addChild(editor);
    ```

=== "Kotlin"

    ```kotlin
    codeEditor({
        language(Languages.JSON)
        layout = { width(300.px); height(200.px) }
    }) { }
    ```

=== "KubeJS"

    ```js
    let editor = new CodeEditor();
    editor.setLanguage(Languages.JSON);
    editor.setValue(["{", "  \"key\": \"value\"", "}"], false);
    parent.addChild(editor);
    ```

---

## XML

```xml
<code-editor>{"key": "value"}</code-editor>
```

文本内容按换行符分割为行（与 `TextArea` 相同）。

---

## 字段

| 名称 | 类型 | 访问权限 | 描述 |
| ---- | ---- | ------ | ----------- |
| `syntaxParser` | `SyntaxParser` | `private`（有 getter） | 用于高亮的行词法解析器。 |
| `styleManager` | `StyleManager` | `getter/setter` | 应用于词法类型的配色方案。默认值：`StyleManager.DEFAULT`。 |

---

## 方法

| 方法 | 返回值 | 描述 |
| ------ | ------- | ----------- |
| `setLanguage(ILanguageDefinition)` | `CodeEditor` | 设置语法高亮的语言（如 `Languages.JSON`、`Languages.SNBT`）。 |
| `getLanguage()` | `ILanguageDefinition` | 返回当前语言。 |

[`TextArea`](text-area.md){ data-preview } 的所有方法也可使用。
