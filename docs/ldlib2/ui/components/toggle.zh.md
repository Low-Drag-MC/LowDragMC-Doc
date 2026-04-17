# Toggle

{{ version_badge("2.2.1", label="Since", icon="tag") }}

`Toggle` 是一个可勾选的 UI 组件 — 一个带有标记图标和可选标签的方形按钮。点击可切换其 `开/关` 状态。多个 Toggle 可以链接到一个 [`ToggleGroup`](#toggle-group) 中实现互斥选择（类似单选按钮）。

在内部，`Toggle` 是一个水平 flex 行，包含一个 **`Button`**（带有标记图标的可点击方框）和一个 **`Label`**（文本标签）。两者都是 **internal** 子元素。

!!! note ""
    [UIElement](../element.md){ data-preview } 中记录的所有内容（布局、样式、事件、数据绑定等）同样适用于此组件。

---

## 用法

=== "Java"

    ```java
    var toggle = new Toggle();
    toggle.setText("my.toggle.label", true); // translated
    toggle.setOn(true);
    toggle.setOnToggleChanged(isOn -> {
        // called whenever the state changes
    });
    parent.addChild(toggle);
    ```

=== "Kotlin"

    ```kotlin
    toggle({
        text("my.toggle.label")
        isOn = true
        onToggle { isOn -> /* state changed */ }
    }) {
        // add extra children if needed
    }
    ```

=== "KubeJS"

    ```js
    let toggle = new Toggle();
    toggle.setText("my.toggle.label", true);
    toggle.setOn(true);
    toggle.setOnToggleChanged(isOn => { /* ... */ });
    parent.addChild(toggle);
    ```

---

## XML

```xml
<!-- Simple toggle with a translated label -->
<toggle text="my.toggle.label"/>

<!-- Toggle in the on state -->
<toggle text="my.toggle.label" is-on="true"/>

<!-- Empty text attribute hides the label (calls noText()) -->
<toggle text=""/>

<!-- Style internals -->
<toggle text="my.toggle.label">
    <internal index="0">
        <!-- Button (the square box) attributes / children -->
    </internal>
    <internal index="1">
        <!-- Label attributes -->
    </internal>
</toggle>
```

| XML 属性 | 类型 | 描述 |
| ------------- | ---- | ----------- |
| `text` | `string` | 设置标签文本。传入空字符串可隐藏标签。 |
| `is-on` | `boolean` | 初始开/关状态。默认：`false`。 |

---

## 内部结构

Toggle 包含两个 internal 元素：

| 索引 | 字段 | 类型 | CSS 类 | 描述 |
| ----- | ----- | ---- | --------- | ----------- |
| `0` | `toggleButton` | `Button` | `.__toggle_button__` | 可点击的方形框（包含标记图标）。 |
| `1` | `toggleLabel` | `Label` | `.__toggle_label__` | 方框右侧的文本标签。 |

**标记图标** 位于 `toggleButton` 内部，可通过 CSS 进行样式设置：

```css
/* Style the mark / unmark icon */
.__toggle_mark-icon__ {
    /* override size, padding, etc. */
}

/* Target the label specifically */
toggle > label.__toggle_label__ {
    font-size: 9;
    text-color: #CCCCCC;
}
```

---

## Toggle 样式

`ToggleStyle` 控制方框按钮的纹理以及标记/未标记图标。

!!! info ""
    #### <p style="font-size: 1rem;">base-background / hover-background</p>

    内部 `Button` 在空闲和悬停状态下的纹理（委托给 `ButtonStyle`）。

    默认：`Sprites.RECT_DARK` / `Sprites.RECT_DARK` + 白色边框

    === "Java"

        ```java
        toggle.toggleStyle(style -> {
            style.baseTexture(myIdleTexture);   // sets both base & pressed
            style.hoverTexture(myHoverTexture);
        });
        ```

    === "Kotlin"

        ```kotlin
        toggle({ toggleStyle = {
            baseTexture(myIdleTexture)
            hoverTexture(myHoverTexture)
        } }) { }
        ```

    === "LSS"

        ```css
        toggle > button.__toggle_button__ {
            base-background: rect(#4a4a4a, 2);
            hover-background: rect(#5a5a5a, 2);
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">unmark-background</p>

    当 Toggle 处于 **关闭** 状态时，方框内显示的图标。

    默认：无（透明）

    === "Java"

        ```java
        toggle.toggleStyle(style -> style.unmarkTexture(myUncheckedIcon));
        ```

    === "Kotlin"

        ```kotlin
        toggle({ toggleStyle = { unmarkTexture(myUncheckedIcon) } }) { }
        ```

    === "LSS"

        ```css
        toggle {
            unmark-background: sprite("mymod:textures/gui/unchecked.png");
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">mark-background</p>

    当 Toggle 处于 **开启** 状态时，方框内显示的图标。

    默认：`Icons.CHECK_SPRITE`

    === "Java"

        ```java
        toggle.toggleStyle(style -> style.markTexture(myCheckedIcon));
        ```

    === "Kotlin"

        ```kotlin
        toggle({ toggleStyle = { markTexture(myCheckedIcon) } }) { }
        ```

    === "LSS"

        ```css
        toggle {
            mark-background: sprite("mymod:textures/gui/checked.png");
        }
        ```

---

## Toggle Group

`ToggleGroup` 将多个 `Toggle` 实例链接在一起，使得同一时间只能有一个处于激活状态（类似单选按钮组）。当 `allowEmpty` 为 `false`（默认值）时，始终至少有一个 Toggle 处于激活状态。

=== "Java"

    ```java
    var group = new Toggle.ToggleGroup();
    // group.setAllowEmpty(true); // allow all toggles to be off

    var t1 = new Toggle().setText("Option A", true).setToggleGroup(group);
    var t2 = new Toggle().setText("Option B", true).setToggleGroup(group);
    var t3 = new Toggle().setText("Option C", true).setToggleGroup(group);

    group.getCurrentToggle(); // the currently active Toggle (or null if allowEmpty)
    ```

=== "Kotlin"

    ```kotlin
    val group = Toggle.ToggleGroup()

    val t1 = toggle({ text("Option A"); toggleGroup = group }) { }
    val t2 = toggle({ text("Option B"); toggleGroup = group }) { }
    val t3 = toggle({ text("Option C"); toggleGroup = group }) { }
    ```

=== "KubeJS"

    ```js
    let group = new Toggle.ToggleGroup();
    let t1 = new Toggle().setText("Option A", true).setToggleGroup(group);
    let t2 = new Toggle().setText("Option B", true).setToggleGroup(group);
    ```

!!! tip ""
    使用 [`ToggleGroupElement`](toggle-group.md){ data-preview } 可通过 XML / 编辑器自动管理组 — 它会在子元素添加时自动注册，移除时自动取消注册。

---

## 文本

### `setText` / `noText` / `enableText`

控制 Toggle 方框右侧显示的标签。

=== "Java"

    ```java
    toggle.setText("my.translation.key", true);  // translated
    toggle.setText("Literal label", false);        // literal
    toggle.noText();                               // hide the label
    toggle.enableText();                           // show it again
    ```

=== "Kotlin"

    ```kotlin
    toggle({
        text("my.translation.key")   // translated (default)
        noText()                      // hides the label
    }) { }
    ```

=== "KubeJS"

    ```js
    toggle.setText(Component.literal("Literal label"));
    toggle.setText("my.key", true);
    toggle.noText();
    toggle.enableText();
    ```

---

## 值绑定

`Toggle` 扩展了 `BindableUIElement<Boolean>`，因此可以与数据绑定系统集成：

=== "Java"

    ```java
    toggle.bind(DataBindingBuilder.bool(
        () -> myState.isEnabled(),
        val -> myState.setEnabled(val)
    ).build());
    ```

详情请参阅 [数据绑定](../data_bindings.md){ data-preview }。

---

## 字段

| 名称 | 类型 | 访问权限 | 描述 |
| ---- | ---- | ------ | ----------- |
| `toggleButton` | `Button` | `public final` | 内部可点击方框。 |
| `markIcon` | `UIElement` | `public final` | 方框内的图标元素。 |
| `toggleLabel` | `Label` | `public final` | 右侧的标签元素。 |
| `toggleStyle` | `ToggleStyle` | `private` (getter) | 当前 Toggle 样式。 |
| `isOn` | `boolean` | `private` (getter) | 当前开/关状态。 |
| `toggleGroup` | `ToggleGroup` | `private` (getter/nullable) | 此 Toggle 所属的组。 |

---

## 方法

| 方法 | 返回值 | 描述 |
| ------ | ------- | ----------- |
| `setOn(boolean)` | `Toggle` | 设置开/关状态并通知监听器。 |
| `setToggleGroup(ToggleGroup)` | `Toggle` | 加入一个 `ToggleGroup`。传入 `null` 可离开组。 |
| `setOnToggleChanged(BooleanConsumer)` | `Toggle` | 注册状态变化监听器。 |
| `setText(String, boolean)` | `Toggle` | 设置标签文本。`true` = 可翻译。 |
| `noText()` | `Toggle` | 隐藏标签。 |
| `enableText()` | `Toggle` | 显示标签。 |
| `toggleStyle(Consumer<ToggleStyle>)` | `Toggle` | 流式配置 `ToggleStyle`。 |
| `toggleButton(Consumer<Button>)` | `Toggle` | 直接配置内部 `Button`。 |
| `toggleLabel(Consumer<Label>)` | `Toggle` | 直接配置标签。 |
| `markIcon(Consumer<UIElement>)` | `Toggle` | 直接配置标记图标元素。 |
| `getValue()` | `Boolean` | 返回当前开/关状态。 |
