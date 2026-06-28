# TextElement

<VersionBadge version="2.2.1" label="自" icon="tag" />

`TextElement` 是一个底层文本渲染元素。它显示一个 `Component`（Minecraft 富文本对象），支持配置字体、大小、颜色、对齐方式、换行和滚动行为。

大多数场景下，建议使用 [`Label`](label.md)（支持数据绑定）或 [`Button`](button.md)、[`Toggle`](toggle.md) 等控件内置的文本标签。

::: info
[UIElement](element.md) 中记录的所有内容（布局、样式、事件、数据绑定等）也适用于此元素。
:::

---

## 用法

<DocTabs>
<DocTab title="Java">

```java
var text = new TextElement();
text.setText("my.translation.key", true);  // 可翻译
text.textStyle(style -> style
    .fontSize(12)
    .textColor(0xFFFF00)
    .textShadow(false)
    .textAlignHorizontal(Horizontal.CENTER)
);
parent.addChild(text);
```

</DocTab>
<DocTab title="Kotlin">

```kotlin
text({
    layout { width(80).height(18) }
    textStyle {
        fontSize(12f)
        textColor(0xFFFF00)
        textAlignHorizontal(Horizontal.CENTER)
    }
}) { }
```

</DocTab>
<DocTab title="KubeJS">

```js
let text = new TextElement();
text.setText(Component.literal("Hello world"));
text.textStyle(style => style.fontSize(12).textColor(0xFFFF00));
parent.addChild(text);
```

</DocTab>
</DocTabs>

---

## XML

文本内容通过元素的子节点读取，使用 Minecraft 的 component 格式：

```xml
<!-- 通过纯文本节点设置字面文本 -->
<text>Hello World</text>

<!-- 通过 translate 子元素设置可翻译文本 -->
<text><translate key="my.translation.key"/></text>

<!-- 多个内联组件会被拼接 -->
<text>Prefix: <translate key="my.key"/></text>
```

::: info
`TextElement` 在 XML 中不能添加布局子元素——只能添加文本内容。
:::

---

## 文本样式

`TextStyle` 控制渲染文本的所有视觉属性。

::: info
#### <p style="font-size: 1rem;">font-size</p>

每行文本的高度（像素）。

默认值：`9`

<DocTabs>
<DocTab title="Java">

```java
text.textStyle(style -> style.fontSize(12));
```

</DocTab>
<DocTab title="LSS">

```css
text {
    font-size: 12;
}
```

</DocTab>
</DocTabs>

:::

::: info
#### <p style="font-size: 1rem;">text-color</p>

文本的 ARGB 颜色。使用 `0xRRGGBB`（alpha 默认为完全不透明）。

默认值：`0xFFFFFF`（白色）

<DocTabs>
<DocTab title="Java">

```java
text.textStyle(style -> style.textColor(0xFFFF00));
```

</DocTab>
<DocTab title="LSS">

```css
text {
    text-color: #FFFF00;
}
```

</DocTab>
</DocTabs>

:::

::: info
#### <p style="font-size: 1rem;">text-shadow</p>

是否在文本下方绘制阴影。

默认值：`true`

<DocTabs>
<DocTab title="Java">

```java
text.textStyle(style -> style.textShadow(false));
```

</DocTab>
<DocTab title="LSS">

```css
text {
    text-shadow: false;
}
```

</DocTab>
</DocTabs>

:::

::: info
#### <p style="font-size: 1rem;">font</p>

要使用的字体资源位置。

默认值：原版默认字体（`minecraft:default`）

<DocTabs>
<DocTab title="Java">

```java
text.textStyle(style -> style.font(ResourceLocation.parse("minecraft:uniform")));
```

</DocTab>
<DocTab title="LSS">

```css
text {
    font: "minecraft:uniform";
}
```

</DocTab>
</DocTabs>

:::

::: info
#### <p style="font-size: 1rem;">horizontal-align</p>

文本行在元素内的水平对齐方式。可选值：`LEFT`、`CENTER`、`RIGHT`。

默认值：`LEFT`

<DocTabs>
<DocTab title="Java">

```java
text.textStyle(style -> style.textAlignHorizontal(Horizontal.CENTER));
```

</DocTab>
<DocTab title="LSS">

```css
text {
    horizontal-align: CENTER;
}
```

</DocTab>
</DocTabs>

:::

::: info
#### <p style="font-size: 1rem;">vertical-align</p>

文本块在元素内的垂直对齐方式。可选值：`TOP`、`CENTER`、`BOTTOM`。

默认值：`TOP`

<DocTabs>
<DocTab title="Java">

```java
text.textStyle(style -> style.textAlignVertical(Vertical.CENTER));
```

</DocTab>
<DocTab title="LSS">

```css
text {
    vertical-align: CENTER;
}
```

</DocTab>
</DocTabs>

:::

::: info
#### <p style="font-size: 1rem;">text-wrap</p>

控制文本超出元素宽度时的行为。

默认值：`NONE`

| 值 | 行为 |
| ----- | --------- |
| `NONE` | 不换行；文本显示在一行，可能会溢出。 |
| `WRAP` | 文本换行到多行。 |
| `ROLL` | 文本以连续循环的方式水平滚动。 |
| `HOVER_ROLL` | 仅当鼠标悬停在元素上时文本才水平滚动。 |
| `HIDE` | 文本被裁剪为一行；溢出部分被隐藏。 |

<DocTabs>
<DocTab title="Java">

```java
text.textStyle(style -> style.textWrap(TextWrap.WRAP));
```

</DocTab>
<DocTab title="LSS">

```css
text {
    text-wrap: WRAP;
}
```

</DocTab>
</DocTabs>

:::

::: info
#### <p style="font-size: 1rem;">roll-speed</p>

`ROLL` / `HOVER_ROLL` 滚动的速度倍数。值越大滚动越快。

默认值：`1.0`

<DocTabs>
<DocTab title="Java">

```java
text.textStyle(style -> style.rollSpeed(2f));
```

</DocTab>
<DocTab title="LSS">

```css
text {
    roll-speed: 2;
}
```

</DocTab>
</DocTabs>

:::

::: info
#### <p style="font-size: 1rem;">line-spacing</p>

文本换行时行与行之间的额外像素间距。

默认值：`1`

<DocTabs>
<DocTab title="Java">

```java
text.textStyle(style -> style.lineSpacing(3f));
```

</DocTab>
<DocTab title="LSS">

```css
text {
    line-spacing: 3;
}
```

</DocTab>
</DocTabs>

:::

::: info
#### <p style="font-size: 1rem;">adaptive-height</p>

当设为 `true` 时，元素的高度会自动调整以适应所有文本行。

默认值：`false`

<DocTabs>
<DocTab title="Java">

```java
text.textStyle(style -> style.adaptiveHeight(true));
```

</DocTab>
<DocTab title="LSS">

```css
text {
    adaptive-height: true;
}
```

</DocTab>
</DocTabs>

:::

::: info
#### <p style="font-size: 1rem;">adaptive-width</p>

当设为 `true` 时，元素的宽度会自动调整以适应第一行文本。

默认值：`false`

<DocTabs>
<DocTab title="Java">

```java
text.textStyle(style -> style.adaptiveWidth(true));
```

</DocTab>
<DocTab title="LSS">

```css
text {
    adaptive-width: true;
}
```

</DocTab>
</DocTabs>

:::

---

## 字段

| 名称 | 类型 | 访问权限 | 描述 |
| ---- | ---- | ------ | ----------- |
| `textStyle` | `TextStyle` | `private`（有 getter） | 此元素文本的样式对象。 |
| `text` | `Component` | `private`（有 getter） | 当前的文本 `Component`。 |

---

## 方法

| 方法 | 返回值 | 描述 |
| ------ | ------- | ----------- |
| `setText(String, boolean)` | `TextElement` | 设置文本。`true` = 可翻译，`false` = 字面文本。 |
| `setText(Component)` | `TextElement` | 直接从 `Component` 设置文本。 |
| `textStyle(Consumer&lt;TextStyle&gt;)` | `TextElement` | 流式配置 `TextStyle`。 |
| `recompute()` | `void` | 强制重新布局文本行（样式或大小变化时会自动调用）。 |
| `getText()` | `Component` | 返回当前文本。 |
