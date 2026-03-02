# 代码编辑器
{{ version_badge("2.2.1", label="Since", icon="tag") }}
`CodeEditor` 扩展了 [`TextArea`](text-area.md){ data-preview } 并添加了语法突出显示、代码折叠和编辑器质量的键盘快捷键。默认情况下，它使用内置的 JetBrains Mono Bold 字体。
`TextArea` 上的其他快捷方式：
| Shortcut | Action |
| -------- | ------ |
| `Tab` | Inserts two spaces at the cursor. |
| `Ctrl+/` | Toggles `//` line comments on the current line or selection. |
| `Enter` | Inserts a new line and preserves the leading indentation of the previous line. |

[`TextArea`](text-area.md){ data-preview } 中的所有内容（样式、值绑定、验证器、滚动器等）也适用于此。
!!!笔记 ””[UIElement](../element.md){ data-preview } 上记录的所有内容（布局、样式、事件、数据绑定等）也适用于此处。
---

＃＃ 用法
===“Java”
    ```java
    var editor = new CodeEditor();
    editor.setLanguage(Languages.JSON);
    editor.setValue(new String[] { "{", "  \"key\": \"value\"", "}" }, false);
    editor.setLinesResponder(lines -> System.out.println(String.join("\n", lines)));
    parent.addChild(editor);
    ```

===“科特林”
    ```kotlin
    codeEditor({
        language(Languages.JSON)
        layout = { width(300.px); height(200.px) }
    }) { }
    ```

===“KubeJS”
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

文本内容按换行符分割成行（与`TextArea`相同）。
---

## 字段
| Name | Type | Access | Description |
| ---- | ---- | ------ | ----------- |
| `syntaxParser` | `SyntaxParser` | `private` (getter) | The parser that tokenises lines for highlighting. |
| `styleManager` | `StyleManager` | `getter/setter` | The colour scheme applied to token types. Default: `StyleManager.DEFAULT`. |

---

＃＃ 方法
| Method | Returns | Description |
| ------ | ------- | ----------- |
| `setLanguage(ILanguageDefinition)` | `CodeEditor` | Sets the language for syntax highlighting (e.g. `Languages.JSON`, `Languages.SNBT`). |
| `getLanguage()` | `ILanguageDefinition` | Returns the current language. |

[`TextArea`](text-area.md){ data-preview } 中的所有方法也可用。