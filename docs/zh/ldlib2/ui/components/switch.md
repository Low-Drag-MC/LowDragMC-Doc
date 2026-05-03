# Switch

{{ version_badge("2.2.1", label="自", icon="tag") }}

`Switch` 是一个带动画效果的开/关切换器，外观呈滑动胶囊状。切换时，内部的指示器会从一端平滑滑到另一端，带有流畅的 CSS 过渡效果。它本身没有文字标签——如果你需要描述性文字，请使用 [`Label`](label.md){ data-preview } 或 [`Toggle`](toggle.md){ data-preview }。

从内部结构来看，`Switch` 是一个水平 flex 行，包含一个 **flex 占位元素**（`placeholder`）和一个 **方形指示器**（`markIcon`）。切换时，占位元素的 `flex` 值从 `0` 增长到 `1`，将指示器推至另一侧。

!!! note ""
    [UIElement](element.md){ data-preview } 中介绍的所有内容（布局、样式、事件、数据绑定等）同样适用于此处。

---

## 用法

=== "Java"

    ```java
    var sw = new Switch();
    sw.setOn(true);
    sw.setOnSwitchChanged(isOn -> {
        // 当状态变化时调用
    });
    parent.addChild(sw);
    ```

=== "Kotlin"

    ```kotlin
    switch({
        isOn = true
        onSwitch { isOn -> /* 状态已改变 */ }
    }) { }
    ```

=== "KubeJS"

    ```js
    let sw = new Switch();
    sw.setOn(true);
    sw.setOnSwitchChanged(isOn => { /* ... */ });
    parent.addChild(sw);
    ```

---

## XML

```xml
<!-- 默认关闭状态的 Switch -->
<switch/>

<!-- 开启状态的 Switch -->
<switch is-on="true"/>
```

| XML 属性 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `is-on` | `boolean` | 初始开/关状态。默认值：`false`。 |

---

## 内部结构

Switch 包含两个内部元素：

| 索引 | 字段 | 类型 | CSS 类 | 描述 |
| ----- | ----- | ---- | --------- | ----------- |
| `0` | `placeholder` | `UIElement` | — | 控制指示器滑动的 flex 占位元素。 |
| `1` | `markIcon` | `UIElement` | `.__switch_mark-icon__` | 滑动的方形指示器。 |

---

## Switch 样式

`SwitchStyle` 控制四张纹理：容器在两种状态下的背景，以及指示器在两种状态下的纹理。

!!! info ""
    #### <p style="font-size: 1rem;">base-background</p>

    Switch 处于**关闭**状态时的容器背景。

    默认值：`Sprites.RECT_RD_DARK`

    === "Java"

        ```java
        sw.switchStyle(style -> style.baseTexture(myOffBg));
        ```

    === "Kotlin"

        ```kotlin
        switch({ switchStyle = { baseTexture(myOffBg) } }) { }
        ```

    === "LSS"

        ```css
        switch {
            base-background: rect(#3a3a3a, 4);
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">pressed-background</p>

    Switch 处于**开启**状态时的容器背景。

    默认值：`Sprites.RECT_RD_T`

    === "Java"

        ```java
        sw.switchStyle(style -> style.pressedTexture(myOnBg));
        ```

    === "Kotlin"

        ```kotlin
        switch({ switchStyle = { pressedTexture(myOnBg) } }) { }
        ```

    === "LSS"

        ```css
        switch {
            pressed-background: rect(#3d7a4f, 4);
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">unmark-background</p>

    Switch 处于**关闭**状态时，滑动指示器的纹理。

    默认值：`Sprites.RECT_RD`

    === "Java"

        ```java
        sw.switchStyle(style -> style.unmarkTexture(myOffIndicator));
        ```

    === "Kotlin"

        ```kotlin
        switch({ switchStyle = { unmarkTexture(myOffIndicator) } }) { }
        ```

    === "LSS"

        ```css
        switch {
            unmark-background: rect(#888888, 3);
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">mark-background</p>

    Switch 处于**开启**状态时，滑动指示器的纹理。

    默认值：`Sprites.RECT_RD`

    === "Java"

        ```java
        sw.switchStyle(style -> style.markTexture(myOnIndicator));
        ```

    === "Kotlin"

        ```kotlin
        switch({ switchStyle = { markTexture(myOnIndicator) } }) { }
        ```

    === "LSS"

        ```css
        switch {
            mark-background: rect(#FFFFFF, 3);
        }
        ```

---

## 值绑定

`Switch` 继承自 `BindableUIElement<Boolean>`，因此它可以与数据绑定系统集成：

=== "Java"

    ```java
    sw.bind(DataBindingBuilder.bool(
        () -> config.isEnabled(),
        val -> config.setEnabled(val)
    ).build());
    ```

详细信息请参阅 [数据绑定](../preliminary/data_bindings.md){ data-preview }。

---

## 字段

| 名称 | 类型 | 访问权限 | 描述 |
| ---- | ---- | ------ | ----------- |
| `placeholder` | `UIElement` | `public final` | 驱动滑动动画的 flex 占位元素。 |
| `markIcon` | `UIElement` | `public final` | 可见的滑动指示器。 |
| `switchStyle` | `SwitchStyle` | `private` (getter) | 当前 Switch 样式。 |
| `isOn` | `boolean` | `private` (getter) | 当前开/关状态。 |

---

## 方法

| 方法 | 返回 | 描述 |
| ------ | ------- | ----------- |
| `setOn(boolean)` | `Switch` | 设置开/关状态并通知监听器。 |
| `setOnSwitchChanged(BooleanConsumer)` | `Switch` | 注册状态变化的监听器。 |
| `switchStyle(Consumer<SwitchStyle>)` | `Switch` | 以流式方式配置 `SwitchStyle`。 |
| `getValue()` | `Boolean` | 返回当前开/关状态。 |
