# Toggle

{{ version_badge("2.2.1", label="自", icon="tag") }}

`Toggle` 是一个可选中的 UI 组件——一个带有标记图标和可选标签的方形按钮。点击会切换其 `on/off` 状态。多个 Toggle 可以关联到一个 [`ToggleGroup`](#toggle-group) 中，实现互斥（类似单选按钮）的选择。

在内部，`Toggle` 是一个水平 flex 行，包含一个 **`Button`**（可点击的方块，内部有标记图标）和一个 **`Label`**（文本标签）。两者均为**内部**子元素。

!!! note ""
    [UIElement](element.md){ data-preview } 中记录的所有内容（布局、样式、事件、数据绑定等）同样适用于此处。

---

## 用法

=== "Java"

    ```java
    var toggle = new Toggle();
    toggle.setText("my.toggle.label", true); // 可翻译的
    toggle.setOn(true);
    toggle.setOnToggleChanged(isOn -> {
        // 状态变化时调用
    });
    parent.addChild(toggle);
    ```

=== "Kotlin"

    ```kotlin
    toggle({
        text("my.toggle.label")
        isOn = true
        onToggle { isOn -> /* 状态变化 */ }
    }) {
        // 如有需要可添加额外子元素
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
<!-- 带有可翻译标签的简单 Toggle -->
<toggle text="my.toggle.label"/>

<!-- 处于开启状态的 Toggle -->
<toggle text="my.toggle.label" is-on="true"/>

<!-- 空文本属性会隐藏标签（调用 noText()） -->
<toggle text=""/>

<!-- 样式内部元素 -->
<toggle text="my.toggle.label">
    <internal index="0">
        <!-- Button（方形方块）的属性 / 子元素 -->
    </internal>
    <internal index="1">
        <!-- Label 的属性 -->
    </internal>
</toggle>
```

| XML 属性 | 类型 | 描述 |
| -------- | ---- | ---- |
| `text` | `string` | 设置标签文本。传入空字符串以隐藏标签。 |
| `is-on` | `boolean` | 初始 on/off 状态。默认值：`false`。 |

---

## 内部结构

Toggle 包含两个内部元素：

| 索引 | 字段 | 类型 | CSS 类 | 描述 |
| ---- | ---- | ---- | ------ | ---- |
| `0` | `toggleButton` | `Button` | `.__toggle_button__` | 可点击的方形方块（包含标记图标）。 |
| `1` | `toggleLabel` | `Label` | `.__toggle_label__` | 方块右侧的文本标签。 |

**标记图标**位于 `toggleButton` 内部，可以通过 CSS 定位：

```css
/* 样式化标记 / 取消标记图标 */
.__toggle_mark-icon__ {
    /* 覆盖尺寸、内边距等 */
}

/* 专门定位标签 */
toggle > label.__toggle_label__ {
    font-size: 9;
    text-color: #CCCCCC;
}
```

---

## Toggle 样式

`ToggleStyle` 控制方块按钮的纹理以及标记/取消标记图标。

!!! info ""
    #### <p style="font-size: 1rem;">base-background / hover-background</p>

    内部 `Button` 在空闲和悬停状态下的纹理（委托给 `ButtonStyle`）。

    默认值：`Sprites.RECT_DARK` / `Sprites.RECT_DARK` + 白色边框

    === "Java"

        ```java
        toggle.toggleStyle(style -> {
            style.baseTexture(myIdleTexture);   // 同时设置 base 和 pressed
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

    Toggle 处于**关闭**状态时，方块内部显示的图标。

    默认值：无（透明）

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

    Toggle 处于**开启**状态时，方块内部显示的图标。

    默认值：`Icons.CHECK_SPRITE`

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

`ToggleGroup` 将多个 `Toggle` 实例关联起来，使得同一时间只有一个可以处于激活状态（类似单选按钮组）。当 `allowEmpty` 为 `false`（默认值）时，始终至少有一个 Toggle 处于激活状态。

=== "Java"

    ```java
    var group = new Toggle.ToggleGroup();
    // group.setAllowEmpty(true); // 允许所有 Toggle 都关闭

    var t1 = new Toggle().setText("Option A", true).setToggleGroup(group);
    var t2 = new Toggle().setText("Option B", true).setToggleGroup(group);
    var t3 = new Toggle().setText("Option C", true).setToggleGroup(group);

    group.getCurrentToggle(); // 当前激活的 Toggle（如果 allowEmpty 则为 null）
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
    使用 [`ToggleGroupElement`](toggle-group.md){ data-preview } 通过 XML / 编辑器自动管理分组——在子元素添加时自动注册，移除时自动注销。

---

## 文本

### `setText` / `noText` / `enableText`

控制 Toggle 方块右侧显示的标签。

=== "Java"

    ```java
    toggle.setText("my.translation.key", true);  // 可翻译的
    toggle.setText("Literal label", false);        // 字面量
    toggle.noText();                               // 隐藏标签
    toggle.enableText();                           // 再次显示
    ```

=== "Kotlin"

    ```kotlin
    toggle({
        text("my.translation.key")   // 可翻译的（默认）
        noText()                      // 隐藏标签
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

`Toggle` 继承自 `BindableUIElement<Boolean>`，因此可以与数据绑定系统集成：

=== "Java"

    ```java
    toggle.bind(DataBindingBuilder.bool(
        () -> myState.isEnabled(),
        val -> myState.setEnabled(val)
    ).build());
    ```

详细信息请参阅 [数据绑定](../preliminary/data_bindings.md){ data-preview }。

---

## 字段

| 名称 | 类型 | 访问权限 | 描述 |
| ---- | ---- | -------- | ---- |
| `toggleButton` | `Button` | `public final` | 内部可点击方块。 |
| `markIcon` | `UIElement` | `public final` | 方块内部的图标元素。 |
| `toggleLabel` | `Label` | `public final` | 右侧的标签元素。 |
| `toggleStyle` | `ToggleStyle` | `private`（getter） | 当前 Toggle 样式。 |
| `isOn` | `boolean` | `private`（getter） | 当前 on/off 状态。 |
| `toggleGroup` | `ToggleGroup` | `private`（getter/nullable） | 此 Toggle 所属的分组。 |

---

## 方法

| 方法 | 返回 | 描述 |
| ---- | -------- | ---- |
| `setOn(boolean)` | `Toggle` | 设置 on/off 状态并通知监听器。 |
| `setToggleGroup(ToggleGroup)` | `Toggle` | 加入一个 `ToggleGroup`。传入 `null` 以离开分组。 |
| `setOnToggleChanged(BooleanConsumer)` | `Toggle` | 注册状态变化的监听器。 |
| `setText(String, boolean)` | `Toggle` | 设置标签文本。`true` = 可翻译。 |
| `noText()` | `Toggle` | 隐藏标签。 |
| `enableText()` | `Toggle` | 显示标签。 |
| `toggleStyle(Consumer<ToggleStyle>)` | `Toggle` | 以流式方式配置 `ToggleStyle`。 |
| `toggleButton(Consumer<Button>)` | `Toggle` | 直接配置内部 `Button`。 |
| `toggleLabel(Consumer<Label>)` | `Toggle` | 直接配置标签。 |
| `markIcon(Consumer<UIElement>)` | `Toggle` | 直接配置标记图标元素。 |
| `getValue()` | `Boolean` | 返回当前 on/off 状态。 |