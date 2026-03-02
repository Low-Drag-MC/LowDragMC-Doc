# 转变
{{ version_badge("2.2.1", label="Since", icon="tag") }}
`Switch` 是一个动画开/关开关，看起来像一个滑动药丸。切换时，内部指示器会通过平滑的 CSS 过渡从一端滑动到另一端。它没有文本标签 - 如果需要描述性文本，请使用 [`Label`](label.md){ data-preview } 或 [`Toggle`](toggle.md){ data-preview }。
在内部，`Switch` 是一个水平弯曲行，包含一个 **弯曲间隔** (`placeholder`) 和一个 **方形指示器** (`markIcon`)。切换时，垫片从`flex: 0` 增长到`flex: 1`，将指示器推向远端。
!!!笔记 ””[UIElement](../element.md){ data-preview } 上记录的所有内容（布局、样式、事件、数据绑定等）也适用于此处。
---

＃＃ 用法
===“Java”
    ```java
    var sw = new Switch();
    sw.setOn(true);
    sw.setOnSwitchChanged(isOn -> {
        // called whenever the state changes
    });
    parent.addChild(sw);
    ```

===“科特林”
    ```kotlin
    switch({
        isOn = true
        onSwitch { isOn -> /* state changed */ }
    }) { }
    ```

===“KubeJS”
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

| XML Attribute | Type | Description |
| ------------- | ---- | ----------- |
| `is-on` | `boolean` | Initial on/off state. Default: `false`. |

---

## 内部结构
开关包含两个内部元件：
| Index | Field | Type | CSS class | Description |
| ----- | ----- | ---- | --------- | ----------- |
| `0` | `placeholder` | `UIElement` | — | Flex spacer that grows/shrinks to animate the indicator. |
| `1` | `markIcon` | `UIElement` | `.__switch_mark-icon__` | The sliding square indicator. |

---

## 切换风格
`SwitchStyle`控制四个纹理：每个状态下的容器背景和每个状态下的指示器纹理。
!!!信息“”#### <p style="font-size: 1rem;">基础背景</p>
开关**关闭**时的容器背景。
默认值：`Sprites.RECT_RD_DARK`
===“Java”
        ```java
        sw.switchStyle(style -> style.baseTexture(myOffBg));
        ```

===“科特林”
        ```kotlin
        switch({ switchStyle = { baseTexture(myOffBg) } }) { }
        ```

===“LSS”
        ```css
        switch {
            base-background: rect(#3a3a3a, 4);
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">按下背景</p>
开关打开**时的容器背景。
默认值：`Sprites.RECT_RD_T`
===“Java”
        ```java
        sw.switchStyle(style -> style.pressedTexture(myOnBg));
        ```

===“科特林”
        ```kotlin
        switch({ switchStyle = { pressedTexture(myOnBg) } }) { }
        ```

===“LSS”
        ```css
        switch {
            pressed-background: rect(#3d7a4f, 4);
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">unmark-background</p>
开关**关闭**时滑动指示器的纹理。
默认值：`Sprites.RECT_RD`
===“Java”
        ```java
        sw.switchStyle(style -> style.unmarkTexture(myOffIndicator));
        ```

===“科特林”
        ```kotlin
        switch({ switchStyle = { unmarkTexture(myOffIndicator) } }) { }
        ```

===“LSS”
        ```css
        switch {
            unmark-background: rect(#888888, 3);
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">标记背景</p>
开关打开**时滑动指示器的纹理。
默认值：`Sprites.RECT_RD`
===“Java”
        ```java
        sw.switchStyle(style -> style.markTexture(myOnIndicator));
        ```

===“科特林”
        ```kotlin
        switch({ switchStyle = { markTexture(myOnIndicator) } }) { }
        ```

===“LSS”
        ```css
        switch {
            mark-background: rect(#FFFFFF, 3);
        }
        ```

---

## 值绑定
`Switch` 扩展了`BindableUIElement<Boolean>`，因此它与数据绑定系统集成：
===“Java”
    ```java
    sw.bind(DataBindingBuilder.bool(
        () -> config.isEnabled(),
        val -> config.setEnabled(val)
    ).build());
    ```

有关完整详细信息，请参阅[Data Bindings](../data_bindings.md){ data-preview }。
---

## 字段
| Name | Type | Access | Description |
| ---- | ---- | ------ | ----------- |
| `placeholder` | `UIElement` | `public final` | The flex spacer that drives the slide animation. |
| `markIcon` | `UIElement` | `public final` | The visible sliding indicator. |
| `switchStyle` | `SwitchStyle` | `private` (getter) | Current switch style. |
| `isOn` | `boolean` | `private` (getter) | Current on/off state. |

---

＃＃ 方法
| Method | Returns | Description |
| ------ | ------- | ----------- |
| `setOn(boolean)` | `Switch` | Sets the on/off state and notifies listeners. |
| `setOnSwitchChanged(BooleanConsumer)` | `Switch` | Registers a listener for state changes. |
| `switchStyle(Consumer<SwitchStyle>)` | `Switch` | Configures `SwitchStyle` fluently. |
| `getValue()` | `Boolean` | Returns the current on/off state. |
