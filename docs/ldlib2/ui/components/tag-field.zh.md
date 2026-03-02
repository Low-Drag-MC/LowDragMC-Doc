# 标记字段
{{ version_badge("2.2.1", label="Since", icon="tag") }}
`TagField` 是NBT 标签输入字段。它包装了 [`TextField`](text-field.md){ data-preview } 并提供 NBT 文本的语法突出显示渲染（绿色字符串、金色数字、紫色布尔值、浅绿色括号、灰色分隔符和紫色键）。无效输入以错误颜色显示。
该字段的值是 `Tag`（任何 NBT 类型）。 `TagField` 扩展`BindableUIElement<Tag>`。
!!!笔记 ””[UIElement](../element.md){ data-preview } 上记录的所有内容（布局、样式、事件、数据绑定等）也适用于此处。
---

＃＃ 用法
===“Java”
    ```java
    var tagField = new TagField();
    tagField.setCompoundTagOnly(); // accept only CompoundTag
    tagField.setTagResponder(tag -> System.out.println("Tag: " + tag));
    parent.addChild(tagField);

    // Set initial value
    tagField.setValue(new CompoundTag(), false);
    ```

===“科特林”
    ```kotlin
    tagField({
        onTagChanged { tag -> println("Tag: $tag") }
    }) {
        api { setCompoundTagOnly() }
    }
    ```

===“KubeJS”
    ```js
    let field = new TagField();
    field.setCompoundTagOnly();
    field.setTagResponder(tag => { /* use tag */ });
    parent.addChild(field);
    ```

---

## 内部结构
| Field | CSS class | Description |
| ----- | --------- | ----------- |
| `textField` | `.__tag-field_text-field__` | The underlying `TextField` with syntax-highlight formatter. |

---

## 值绑定
`TagField` 扩展`BindableUIElement<Tag>`：
===“Java”
    ```java
    tagField.bind(DataBindingBuilder.create(
        () -> config.getNbt(),
        tag -> config.setNbt(tag)
    ).build());
    ```

有关完整详细信息，请参阅[Data Bindings](../data_bindings.md){ data-preview }。
---

## 字段
| Name | Type | Access | Description |
| ---- | ---- | ------ | ----------- |
| `textField` | `TextField` | `public final` | The internal text input with NBT syntax highlighting. |
| `value` | `Tag` | `private` (getter) | Current NBT value (`EndTag.INSTANCE` when empty). |

---

＃＃ 方法
| Method | Returns | Description |
| ------ | ------- | ----------- |
| `setValue(Tag, boolean)` | `TagField` | Sets the NBT value; second param controls notification. |
| `setTagValidator(Predicate<Tag>)` | `TagField` | Sets a custom validator. Invalid input is shown in the error color. |
| `setTagResponder(Consumer<Tag>)` | `TagField` | Registers a listener called on each valid change. |
| `setCompoundTagOnly()` | `TagField` | Accepts only `CompoundTag`. |
| `setListOnly()` | `TagField` | Accepts only `ListTag`. |
| `setAny()` | `TagField` | Accepts any NBT tag type (default). |
