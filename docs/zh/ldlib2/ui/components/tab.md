# Tab

{{ version_badge("2.2.1", label="Since", icon="tag") }}

`Tab` 是单个选项卡头元素。它显示文本标签，并根据空闲、悬停或选中状态切换背景纹理。选项卡通常在 [`TabView`](tab-view.md){ data-preview } 内部管理，由其处理选择逻辑。

!!! note ""
    [UIElement](../element.md){ data-preview } 中记录的所有内容（布局、样式、事件、数据绑定等）同样适用于此组件。

---

## 使用方法

选项卡通常与 `TabView` 一起创建：

=== "Java"

    ```java
    var tabView = new TabView();

    var tab1 = new Tab().setText("Settings");
    var tab2 = new Tab().setText("Info");

    tabView.addTab(tab1, new UIElement()); // tab + its content pane
    tabView.addTab(tab2, new UIElement());
    parent.addChild(tabView);
    ```

=== "Kotlin"

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

!!! note ""
    `Tab` 通常作为 `<tab-view>` 的直接 XML 子元素。`<tab-content>` 元素指定与此选项卡关联的内容面板。

| XML 属性 | 类型 | 描述 |
| ------------- | ---- | ----------- |
| `text` | `string` | 标签文本（字面量，不翻译）。 |

---

## 内部结构

| 索引 | 字段 | CSS 类名 | 描述 |
| ----- | ----- | --------- | ----------- |
| `0` | `text` | `.__tab_text__` | 显示选项卡文本的 `Label` 元素。 |

---

## Tab 样式

`TabStyle` 与 `Button` 的三态纹理系统相似，但三种状态分别用于**空闲**、**悬停**和**选中**。

!!! info ""
    #### <p style="font-size: 1rem;">base-background</p>

    选项卡空闲时（未选中、未悬停）的背景。

    默认值：`Sprites.TAB_DARK`

    === "Java"

        ```java
        tab.tabStyle(style -> style.baseTexture(myIdleTexture));
        ```

    === "LSS"

        ```css
        tab {
            base-background: sprite("mymod:textures/gui/tab_idle.png");
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">hover-background</p>

    鼠标悬停在选项卡上时的背景。

    默认值：`Sprites.TAB_WHITE`

    === "Java"

        ```java
        tab.tabStyle(style -> style.hoverTexture(myHoverTexture));
        ```

    === "LSS"

        ```css
        tab {
            hover-background: sprite("mymod:textures/gui/tab_hover.png");
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">pressed-background</p>

    选项卡**选中**时的背景（`pressed-background` 属性被复用为选中状态）。

    默认值：`Sprites.TAB`

    === "Java"

        ```java
        tab.tabStyle(style -> style.selectedTexture(mySelectedTexture));
        ```

    === "LSS"

        ```css
        tab {
            pressed-background: sprite("mymod:textures/gui/tab_selected.png");
        }
        ```

---

## CSS 状态

当选项卡被选中时，会获得 CSS 类 `.__tab_selected__`。关联的内容元素会获得 `.__tab_content_selected__`。

---

## 字段

| 名称 | 类型 | 访问权限 | 描述 |
| ---- | ---- | ------ | ----------- |
| `text` | `Label` | `public final` | 标签元素。 |
| `tabStyle` | `TabStyle` | `private`（有 getter） | 当前选项卡样式。 |

---

## 方法

| 方法 | 返回值 | 描述 |
| ------ | ------- | ----------- |
| `setText(String)` | `Tab` | 设置标签文本（字面量）。 |
| `setText(String, boolean)` | `Tab` | 设置标签文本。`true` = 可翻译。 |
| `setText(Component)` | `Tab` | 从 `Component` 设置标签。 |
| `setDynamicText(Supplier<Component>)` | `Tab` | 将标签绑定到数据供应器以实现实时更新。 |
| `textStyle(Consumer<TextElement.TextStyle>)` | `Tab` | 以流式方式配置标签的文本样式。 |
| `tabStyle(Consumer<TabStyle>)` | `Tab` | 以流式方式配置 `TabStyle`。 |
| `setOnTabSelected(Runnable)` | — | 当此选项卡被选中时调用的回调。 |
| `setOnTabUnselected(Runnable)` | — | 当此选项卡被取消选中时调用的回调。 |
| `getContent()` | `UIElement`（可空） | 返回来自父 `TabView` 的内容面板。 |
| `getTabView()` | `TabView`（可空） | 返回父 `TabView`。 |
