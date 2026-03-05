# Switch

{{ version_badge("2.2.1", label="Since", icon="tag") }}

`Switch` 是一个带动画效果的开关切换组件，外观为滑动的药丸形状。切换时，内部指示器会以平滑的 CSS 过渡效果从一端滑动到另一端。它没有文本标签——如果需要描述性文字，请使用 [`Label`](label.md){ data-preview } 或 [`Toggle`](toggle.md){ data-preview }。

从内部结构看，`Switch` 是一个包含**弹性占位符**（`placeholder`）和**方形指示器**（`markIcon`）的水平弹性行。占位符在切换时从 `flex: 0` 增长到 `flex: 1`，将指示器推到另一侧。

!!! note ""
    [UIElement](../element.md){ data-preview } 中记录的所有内容（布局、样式、事件、数据绑定等）同样适用于此。

---

## 用法

=== "Java"

    ```java
    var sw = new Switch();
    sw.setOn(true);
    sw.setOnSwitchChanged(isOn -> {
        // called whenever the state changes
    });
    parent.addChild(sw);
    ```

=== "Kotlin"

    ```kotlin
    switch({
        isOn = true
        onSwitch { isOn -> /* state changed */ }
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
<!-- Default off switch -->
<switch/>

<!-- Switch in the on state -->
<switch is-on="true"/>
```

| XML 属性 | 类型 | 描述 |
| ------------- | ---- | ----------- |
| `is-on` | `boolean` | 初始开关状态。默认：`false`。 |

---

## 内部结构

Switch 包含两个内部元素：

| 索引 | 字段 | 类型 | CSS 类 | 描述 |
| ----- | ----- | ---- | --------- | ----------- |
| `0` | `placeholder` | `UIElement` | — | 弹性占位符，通过伸缩来实现指示器动画。 |
| `1` | `markIcon` | `UIElement` | `.__switch_mark-icon__` | 滑动的方形指示器。 |

---

## Switch 样式

`SwitchStyle` 控制四种纹理：两种状态下的容器背景和两种状态下的指示器纹理。

!!! info ""
    #### <p style="font-size: 1rem;">base-background</p>

    开关处于**关闭**状态时的容器背景。

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

    开关处于**开启**状态时的容器背景。

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

    开关处于**关闭**状态时滑动指示器的纹理。

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

    开关处于**开启**状态时滑动指示器的纹理。

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

详情请参阅 [数据绑定](../data_bindings.md){ data-preview }。

---

## 字段

| 名称 | 类型 | 访问权限 | 描述 |
| ---- | ---- | ------ | ----------- |
| `placeholder` | `UIElement` | `public final` | 驱动滑动动画的弹性占位符。 |
| `markIcon` | `UIElement` | `public final` | 可见的滑动指示器。 |
| `switchStyle` | `SwitchStyle` | `private` (getter) | 当前开关样式。 |
| `isOn` | `boolean` | `private` (getter) | 当前开关状态。 |

---

## 方法

| 方法 | 返回值 | 描述 |
| ------ | ------- | ----------- |
| `setOn(boolean)` | `Switch` | 设置开关状态并通知监听器。 |
| `setOnSwitchChanged(BooleanConsumer)` | `Switch` | 注册状态变化监听器。 |
| `switchStyle(Consumer<SwitchStyle>)` | `Switch` | 流式配置 `SwitchStyle`。 |
| `getValue()` | `Boolean` | 返回当前开关状态。 |
