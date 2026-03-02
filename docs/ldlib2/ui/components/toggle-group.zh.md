# 切换组
{{ version_badge("2.2.1", label="Since", icon="tag") }}
`ToggleGroupElement` 是一个布局容器，它自动管理添加到其中的所有 [`Toggle`](toggle.md){ data-preview } 子级的 [`Toggle.ToggleGroup`](toggle.md#toggle-group) 。您不需要手动调用`toggle.setToggleGroup(group)` - 当添加或删除子元素时，该元素会为您执行此操作。
!!!笔记 ””[UIElement](../element.md){ data-preview } 上记录的所有内容（布局、样式、事件、数据绑定等）也适用于此处。
---

＃＃ 用法
===“Java”
    ```java
    var group = new ToggleGroupElement();
    group.getToggleGroup().setAllowEmpty(false);

    group.addChild(new Toggle().setText("Option A", true).setOn(true));
    group.addChild(new Toggle().setText("Option B", true));
    group.addChild(new Toggle().setText("Option C", true));

    // Retrieve the currently-active toggle
    Toggle active = group.getToggleGroup().getCurrentToggle();
    ```

===“科特林”
    ```kotlin
    val group = ToggleGroupElement()

    group.addChild(toggle({ text("Option A"); isOn = true }) { })
    group.addChild(toggle({ text("Option B") }) { })
    group.addChild(toggle({ text("Option C") }) { })
    ```

===“KubeJS”
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

!!!警告 ””只有 `Toggle`（及其子类）可以在 XML 编辑器中添加为子类。其他元素类型将被拒绝。
---

## 切换组行为
| Property | Default | Description |
| -------- | ------- | ----------- |
| `allowEmpty` | `false` | When `false`, at least one toggle is always active. When `true`, all toggles can be off. |
| `currentToggle` | nullable | The currently selected `Toggle`, or `null` when `allowEmpty = true` and none is selected. |

===“Java”
    ```java
    var group = new ToggleGroupElement();
    group.getToggleGroup().setAllowEmpty(true);

    Toggle current = group.getToggleGroup().getCurrentToggle(); // may be null
    ```

===“科特林”
    ```kotlin
    val groupEl = ToggleGroupElement()
    groupEl.toggleGroup.allowEmpty = true

    val current: Toggle? = groupEl.toggleGroup.currentToggle
    ```

---

## 字段
| Name | Type | Access | Description |
| ---- | ---- | ------ | ----------- |
| `toggleGroup` | `Toggle.ToggleGroup` | `public final` | The shared `ToggleGroup` instance. |

---

＃＃ 方法
> 继承[UIElement](../element.md#methods){ data-preview } 的所有方法。
当您调用 `addChild` / `removeChild` 时，`ToggleGroupElement` 会覆盖这些方法，以自动向内部 `ToggleGroup` 注册/取消注册任何 `Toggle` 子级。