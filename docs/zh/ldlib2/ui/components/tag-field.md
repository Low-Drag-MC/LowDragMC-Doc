# TagField

<VersionBadge version="2.2.1" label="自" icon="tag" />

`TagField` 是一个 NBT 标签输入框。它封装了一个 [`TextField`](text-field.md)，并为 NBT 文本提供了语法高亮显示（字符串为绿色、数字为金色、布尔值为紫色、括号为水色、分隔符为灰色、键为紫色）。无效输入将以错误颜色显示。

该字段的值为 `Tag`（任何 NBT 类型）。`TagField` 继承自 `BindableUIElement&lt;Tag&gt;`。

::: info
在 [UIElement](element.md) 中记录的所有内容（布局、样式、事件、数据绑定等）同样适用于此处。
:::

---

## 用法

<DocTabs>
<DocTab title="Java">

```java
var tagField = new TagField();
tagField.setCompoundTagOnly(); // 仅接受 CompoundTag
tagField.setTagResponder(tag -> System.out.println("Tag: " + tag));
parent.addChild(tagField);

// 设置初始值
tagField.setValue(new CompoundTag(), false);
```

</DocTab>
<DocTab title="Kotlin">

```kotlin
tagField({
    onTagChanged { tag -> println("Tag: $tag") }
}) {
    api { setCompoundTagOnly() }
}
```

</DocTab>
<DocTab title="KubeJS">

```js
let field = new TagField();
field.setCompoundTagOnly();
field.setTagResponder(tag => { /* use tag */ });
parent.addChild(field);
```

</DocTab>
</DocTabs>
---

## 内部结构

| 字段 | CSS 类 | 描述 |
| ---- | ------ | ---- |
| `textField` | `.__tag-field_text-field__` | 带有语法高亮格式化器的底层 `TextField`。|

---

## 值绑定

`TagField` 继承自 `BindableUIElement&lt;Tag&gt;`：

<DocTabs>
<DocTab title="Java">

```java
tagField.bind(DataBindingBuilder.create(
    () -> config.getNbt(),
    tag -> config.setNbt(tag)
).build());
```

</DocTab>
</DocTabs>
更多详情请参见 [数据绑定](../preliminary/data_bindings.md)。

---

## 字段

| 名称 | 类型 | 访问权限 | 描述 |
| ---- | ---- | -------- | ---- |
| `textField` | `TextField` | `public final` | 带有 NBT 语法高亮的内部文本输入框。|
| `value` | `Tag` | `private`（getter）| 当前的 NBT 值（为空时为 `EndTag.INSTANCE`）。|

---

## 方法

| 方法 | 返回 | 描述 |
| ---- | ---- | ---- |
| `setValue(Tag, boolean)` | `TagField` | 设置 NBT 值；第二个参数控制是否发出通知。|
| `setTagValidator(Predicate&lt;Tag&gt;)` | `TagField` | 设置自定义验证器。无效输入将以错误颜色显示。|
| `setTagResponder(Consumer&lt;Tag&gt;)` | `TagField` | 注册一个监听器，在每次有效更改时调用。|
| `setCompoundTagOnly()` | `TagField` | 仅接受 `CompoundTag`。|
| `setListOnly()` | `TagField` | 仅接受 `ListTag`。|
| `setAny()` | `TagField` | 接受任何 NBT 标签类型（默认）。|
