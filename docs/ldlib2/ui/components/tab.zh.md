# 选项卡
{{ version_badge("2.2.1", label="Since", icon="tag") }}
`Tab` 是单个选项卡标题元素。它显示一个文本标签，并根据它是空闲、悬停还是选中来更改其背景纹理。选项卡通常在 [`TabView`](tab-view.md){ data-preview } 内管理，它处理选择逻辑。
!!!笔记 ””[UIElement](../element.md){ data-preview } 上记录的所有内容（布局、样式、事件、数据绑定等）也适用于此处。
---

＃＃ 用法
选项卡通常与 `TabView` 一起创建：
===“Java”
    ```java
    var tabView = new TabView();

    var tab1 = new Tab().setText("Settings");
    var tab2 = new Tab().setText("Info");

    tabView.addTab(tab1, new UIElement()); // tab + its content pane
    tabView.addTab(tab2, new UIElement());
    parent.addChild(tabView);
    ```

===“科特林”
    ```kotlin
    tabView({ }) {
        tab("Settings") { /* add settings content children here */ }
        tab("Info") { /* add info content children here */ }
    }
    ```

---

## XML
```xml
<tab-view>
    <tab text="Settings">
        <tab-content>
            <!-- children of the Settings pane go here -->
        </tab-content>
    </tab>
    <tab text="Info">
        <tab-content>
            <!-- children of the Info pane go here -->
        </tab-content>
    </tab>
</tab-view>
```

!!!笔记 ””`Tab` 通常放置为 `<tab-view>` 的直接 XML 子级。 `<tab-content>` 元素指定与此选项卡关联的内容窗格。
| XML Attribute | Type | Description |
| ------------- | ---- | ----------- |
| `text` | `string` | Label text (literal, not translated). |

---

## 内部结构
| Index | Field | CSS class | Description |
| ----- | ----- | --------- | ----------- |
| `0` | `text` | `.__tab_text__` | The `Label` element showing the tab text. |

---

## 标签样式
`TabStyle` 镜像`Button` 的三态纹理系统，但使用三种状态：**空闲**、**悬停**和**选定**。
!!!信息“”#### <p style="font-size: 1rem;">基础背景</p>
选项卡空闲时的背景（未选择、未悬停）。
默认值：`Sprites.TAB_DARK`
===“Java”
        ```java
        tab.tabStyle(style -> style.baseTexture(myIdleTexture));
        ```

===“LSS”
        ```css
        tab {
            base-background: sprite("mymod:textures/gui/tab_idle.png");
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">悬停背景</p>
当鼠标悬停在选项卡上时的背景。
默认值：`Sprites.TAB_WHITE`
===“Java”
        ```java
        tab.tabStyle(style -> style.hoverTexture(myHoverTexture));
        ```

===“LSS”
        ```css
        tab {
            hover-background: sprite("mymod:textures/gui/tab_hover.png");
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">按下背景</p>
**选择**选项卡时的背景（`pressed-background` 属性重复用于选定状态）。
默认值：`Sprites.TAB`
===“Java”
        ```java
        tab.tabStyle(style -> style.selectedTexture(mySelectedTexture));
        ```

===“LSS”
        ```css
        tab {
            pressed-background: sprite("mymod:textures/gui/tab_selected.png");
        }
        ```

---

## CSS 状态
当选择一个选项卡时，它会获得 CSS 类`.__tab_selected__`。关联的内容元素获得`.__tab_content_selected__`。
---

## 字段
| Name | Type | Access | Description |
| ---- | ---- | ------ | ----------- |
| `text` | `Label` | `public final` | The label element. |
| `tabStyle` | `TabStyle` | `private` (getter) | Current tab style. |

---

＃＃ 方法
| Method | Returns | Description |
| ------ | ------- | ----------- |
| `setText(String)` | `Tab` | Sets the label text (literal). |
| `setText(String, boolean)` | `Tab` | Sets label text. `true` = translatable. |
| `setText(Component)` | `Tab` | Sets label from a `Component`. |
| `setDynamicText(Supplier<Component>)` | `Tab` | Binds label to a data supplier for live updates. |
| `textStyle(Consumer<TextElement.TextStyle>)` | `Tab` | Configures the label's text style fluently. |
| `tabStyle(Consumer<TabStyle>)` | `Tab` | Configures `TabStyle` fluently. |
| `setOnTabSelected(Runnable)` | — | Callback invoked when this tab is selected. |
| `setOnTabUnselected(Runnable)` | — | Callback invoked when this tab is deselected. |
| `getContent()` | `UIElement` (nullable) | Returns the content pane from the parent `TabView`. |
| `getTabView()` | `TabView` (nullable) | Returns the parent `TabView`. |
