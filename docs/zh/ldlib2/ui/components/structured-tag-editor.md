# StructuredTagEditor

<VersionBadge version="2.2.9" label="Since" icon="tag" />

`StructuredTagEditor` 以树结构编辑 NBT `Tag`。它支持基本 Tag、列表、复合 Tag 和 NBT 数组，用户不必为每项修改手写 SNBT。

<figure>
<img src="/assets/ldlib2/structured-tag-editor.png" alt="展开 CompoundTag 的 StructuredTagEditor">
<figcaption>
展开后的 <code>CompoundTag</code>。每一行显示键名、NBT 类型，以及对应的值编辑器或摘要。
</figcaption>
</figure>

```java
var editor = new StructuredTagEditor()
        .setCompoundTagOnly()
        .setValue(tag, false)
        .setTagResponder(updated -> save(updated));
```

编辑器会复制传入的 Tag。将回调参数视为编辑结果；若要长期保存请再次复制。

| API | 说明 |
| --- | --- |
| `setValue(Tag, boolean)` | 替换正在编辑的值。 |
| `setTagResponder(Consumer<Tag>)` | 接收每次通过校验的修改。 |
| `setTagValidator(Predicate<Tag>)` | 拒绝不符合应用规则的值。 |
| `setCompoundTagOnly()` | 根节点仅允许 `CompoundTag`。 |
| `setListOnly()` | 根节点仅允许 `ListTag`。 |
| `setAny()` | 允许所有 Tag 类型。 |

## TagField 集成

`TagField` 的编辑按钮会打开此编辑器。已有的 `setCompoundTagOnly()`、`setListOnly()` 与校验器会传递给对话框，使用标准字段时不需要额外配置。
