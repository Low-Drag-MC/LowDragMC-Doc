# ToggleGroup

{{ version_badge("2.2.1", label="自", icon="tag") }}

`ToggleGroupElement` 是一个布局容器，会自动为添加到其中的所有 [`Toggle`](toggle.md){ data-preview } 子元素管理一个 [`Toggle.ToggleGroup`](toggle.md#toggle-group)。你无需手动调用 `toggle.setToggleGroup(group)` —— 当子元素被添加或移除时，该元素会自动完成这一操作。

!!! note ""
    在 [UIElement](element.md){ data-preview } 中记录的所有内容（布局、样式、事件、数据绑定等）同样适用于此处。

---

## 用法

=== "Java"

    ```java
    var group = new ToggleGroupElement();
    group.getToggleGroup().setAllowEmpty(false);

    group.addChild(new Toggle().setText("Option A", true).setOn(true));
    group.addChild(new Toggle().setText("Option B", true));
    group.addChild(new Toggle().setText("Option C", true));

    // 获取当前激活的 Toggle
    Toggle active = group.getToggleGroup().getCurrentToggle();
    ```

=== "Kotlin"

    ```kotlin
    val group = ToggleGroupElement()

    group.addChild(toggle({ text("Option A"); isOn = true }) { })
    group.addChild(toggle({ text("Option B") }) { })
    group.addChild(toggle({ text("Option C") }) { })
    ```

=== "KubeJS"

    ```js
    let group = new ToggleGroupElement();
    group.addChild(new Toggle().setText("Option A", true).setOn(true));
    group.addChild(new Toggle().setText("Option B", true));
    ```

---

## XML

```xml
<toggle-group>
    <toggle text="Option A" is-on="true"/>
    <toggle text="Option B"/>
    <toggle text="Option C"/>
</toggle-group>
```

!!! warning ""
    在 XML 编辑器中，只有 `Toggle`（及其子类）可以作为子元素添加。其他元素类型将被拒绝。

---

## Toggle Group 行为

| 属性 | 默认值 | 描述 |
| -------- | ------- | ----------- |
| `allowEmpty` | `false` | 为 `false` 时，始终至少有一个 Toggle 处于激活状态。为 `true` 时，所有 Toggle 都可以关闭。 |
| `currentToggle` | nullable | 当前选中的 `Toggle`，当 `allowEmpty = true` 且未选中任何项时为 `null`。 |

=== "Java"

    ```java
    var group = new ToggleGroupElement();
    group.getToggleGroup().setAllowEmpty(true);

    Toggle current = group.getToggleGroup().getCurrentToggle(); // 可能为 null
    ```

=== "Kotlin"

    ```kotlin
    val groupEl = ToggleGroupElement()
    groupEl.toggleGroup.allowEmpty = true

    val current: Toggle? = groupEl.toggleGroup.currentToggle
    ```

---

## 字段

| 名称 | 类型 | 访问权限 | 描述 |
| ---- | ---- | ------ | ----------- |
| `toggleGroup` | `Toggle.ToggleGroup` | `public final` | 共享的 `ToggleGroup` 实例。 |

---

## 方法

> 继承自 [UIElement](element.md#methods){ data-preview } 的所有方法。

当你调用 `addChild` / `removeChild` 时，`ToggleGroupElement` 会重写这些方法，以自动将任何 `Toggle` 子元素注册 / 注销到内部的 `ToggleGroup` 中。