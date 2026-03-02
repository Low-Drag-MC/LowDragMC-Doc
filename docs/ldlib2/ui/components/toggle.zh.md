# 切换
{{ version_badge("2.2.1", label="Since", icon="tag") }}
`Toggle` 是一个可检查的 UI 组件 - 一个带有标记图标和可选标签的方形按钮。单击可切换其 `on/off` 状态。可以将多个切换链接到 [`ToggleGroup`](#toggle-group) 以进行独占（类似单选按钮）选择。
在内部，`Toggle` 是一个水平弹性行，包含 **`Button`** （内部带有标记图标的可点击框）和 **`Label`** （文本标签）。两者都是**内部**孩子。
!!!笔记 ””[UIElement](../element.md){ data-preview } 上记录的所有内容（布局、样式、事件、数据绑定等）也适用于此处。
---

＃＃ 用法
===“Java”
    ```java
    var toggle = new Toggle();
    toggle.setText("my.toggle.label", true); // translated
    toggle.setOn(true);
    toggle.setOnToggleChanged(isOn -> {
        // called whenever the state changes
    });
    parent.addChild(toggle);
    ```

===“科特林”
    ```kotlin
    toggle({
        text("my.toggle.label")
        isOn = true
        onToggle { isOn -> /* state changed */ }
    }) {
        // add extra children if needed
    }
    ```

===“KubeJS”
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

| XML Attribute | Type | Description |
| ------------- | ---- | ----------- |
| `text` | `string` | Sets the label text. Pass an empty string to hide the label. |
| `is-on` | `boolean` | Initial on/off state. Default: `false`. |

---

## 内部结构
Toggle 包含两个内部元素：
| Index | Field | Type | CSS class | Description |
| ----- | ----- | ---- | --------- | ----------- |
| `0` | `toggleButton` | `Button` | `.__toggle_button__` | The clickable square box (contains the mark icon). |
| `1` | `toggleLabel` | `Label` | `.__toggle_label__` | The text label to the right of the box. |

**标记图标**位于`toggleButton`内部，可以通过CSS定位：
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

## 切换样式
`ToggleStyle` 控制框按钮纹理和标记/取消标记图标。
!!!信息“”#### <p style="font-size: 1rem;">基础背景/悬停背景</p>
空闲和悬停状态下内部`Button`的纹理（委托给`ButtonStyle`）。
默认值：`Sprites.RECT_DARK` / `Sprites.RECT_DARK` + 白色边框
===“Java”
        ```java
        toggle.toggleStyle(style -> {
            style.baseTexture(myIdleTexture);   // sets both base & pressed
            style.hoverTexture(myHoverTexture);
        });
        ```

===“科特林”
        ```kotlin
        toggle({ toggleStyle = {
            baseTexture(myIdleTexture)
            hoverTexture(myHoverTexture)
        } }) { }
        ```

===“LSS”
        ```css
        toggle > button.__toggle_button__ {
            base-background: rect(#4a4a4a, 2);
            hover-background: rect(#5a5a5a, 2);
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">unmark-background</p>
当开关处于 **关闭** 状态时，框中显示的图标。
默认值：无（透明）
===“Java”
        ```java
        toggle.toggleStyle(style -> style.unmarkTexture(myUncheckedIcon));
        ```

===“科特林”
        ```kotlin
        toggle({ toggleStyle = { unmarkTexture(myUncheckedIcon) } }) { }
        ```

===“LSS”
        ```css
        toggle {
            unmark-background: sprite("mymod:textures/gui/unchecked.png");
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">标记背景</p>
当开关处于**打开**状态时，框中显示的图标。
默认值：`Icons.CHECK_SPRITE`
===“Java”
        ```java
        toggle.toggleStyle(style -> style.markTexture(myCheckedIcon));
        ```

===“科特林”
        ```kotlin
        toggle({ toggleStyle = { markTexture(myCheckedIcon) } }) { }
        ```

===“LSS”
        ```css
        toggle {
            mark-background: sprite("mymod:textures/gui/checked.png");
        }
        ```

---

## 切换组
`ToggleGroup` 链接多个`Toggle` 实例，以便一次只能有一个实例处于活动状态（如单选按钮组）。当`allowEmpty` 为`false`（默认）时，至少有一个切换始终处于活动状态。
===“Java”
    ```java
    var group = new Toggle.ToggleGroup();
    // group.setAllowEmpty(true); // allow all toggles to be off

    var t1 = new Toggle().setText("Option A", true).setToggleGroup(group);
    var t2 = new Toggle().setText("Option B", true).setToggleGroup(group);
    var t3 = new Toggle().setText("Option C", true).setToggleGroup(group);

    group.getCurrentToggle(); // the currently active Toggle (or null if allowEmpty)
    ```

===“科特林”
    ```kotlin
    val group = Toggle.ToggleGroup()

    val t1 = toggle({ text("Option A"); toggleGroup = group }) { }
    val t2 = toggle({ text("Option B"); toggleGroup = group }) { }
    val t3 = toggle({ text("Option C"); toggleGroup = group }) { }
    ```

===“KubeJS”
    ```js
    let group = new Toggle.ToggleGroup();
    let t1 = new Toggle().setText("Option A", true).setToggleGroup(group);
    let t2 = new Toggle().setText("Option B", true).setToggleGroup(group);
    ```

!!!提示 ””使用 [`ToggleGroupElement`](toggle-group.md){ data-preview } 通过 XML/编辑器自动管理组 - 它会在添加子项时注册它们，并在删除时取消注册它们。
---

＃＃ 文本
### `setText` / `noText` / `enableText`
控制切换框右侧显示的标签。
===“Java”
    ```java
    toggle.setText("my.translation.key", true);  // translated
    toggle.setText("Literal label", false);        // literal
    toggle.noText();                               // hide the label
    toggle.enableText();                           // show it again
    ```

===“科特林”
    ```kotlin
    toggle({
        text("my.translation.key")   // translated (default)
        noText()                      // hides the label
    }) { }
    ```

===“KubeJS”
    ```js
    toggle.setText(Component.literal("Literal label"));
    toggle.setText("my.key", true);
    toggle.noText();
    toggle.enableText();
    ```

---

## 值绑定
`Toggle` 扩展了`BindableUIElement<Boolean>`，因此它与数据绑定系统集成：
===“Java”
    ```java
    toggle.bind(DataBindingBuilder.bool(
        () -> myState.isEnabled(),
        val -> myState.setEnabled(val)
    ).build());
    ```

有关完整详细信息，请参阅[Data Bindings](../data_bindings.md){ data-preview }。
---

## 字段
| Name | Type | Access | Description |
| ---- | ---- | ------ | ----------- |
| `toggleButton` | `Button` | `public final` | The inner clickable box. |
| `markIcon` | `UIElement` | `public final` | The icon element inside the box. |
| `toggleLabel` | `Label` | `public final` | The label element to the right. |
| `toggleStyle` | `ToggleStyle` | `private` (getter) | Current toggle style. |
| `isOn` | `boolean` | `private` (getter) | Current on/off state. |
| `toggleGroup` | `ToggleGroup` | `private` (getter/nullable) | The group this toggle belongs to. |

---

＃＃ 方法
| Method | Returns | Description |
| ------ | ------- | ----------- |
| `setOn(boolean)` | `Toggle` | Sets the on/off state and notifies listeners. |
| `setToggleGroup(ToggleGroup)` | `Toggle` | Joins a `ToggleGroup`. Pass `null` to leave the group. |
| `setOnToggleChanged(BooleanConsumer)` | `Toggle` | Registers a listener for state changes. |
| `setText(String, boolean)` | `Toggle` | Sets label text. `true` = translatable. |
| `noText()` | `Toggle` | Hides the label. |
| `enableText()` | `Toggle` | Shows the label. |
| `toggleStyle(Consumer<ToggleStyle>)` | `Toggle` | Configures `ToggleStyle` fluently. |
| `toggleButton(Consumer<Button>)` | `Toggle` | Configures the inner `Button` directly. |
| `toggleLabel(Consumer<Label>)` | `Toggle` | Configures the label directly. |
| `markIcon(Consumer<UIElement>)` | `Toggle` | Configures the mark icon element directly. |
| `getValue()` | `Boolean` | Returns the current on/off state. |
