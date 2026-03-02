# 标签视图
{{ version_badge("2.2.1", label="Since", icon="tag") }}
`TabView` 是一个选项卡式面板容器。它维护一个水平可滚动的行 [`Tab`](tab.md){ data-preview } 标题和一个显示当前所选选项卡内容的内容窗格。切换选项卡会显示新内容并隐藏所有其他内容。
只有`Tab`（及其子类）可以在编辑器中添加为子类。
!!!笔记 ””[UIElement](../element.md){ data-preview } 上记录的所有内容（布局、样式、事件、数据绑定等）也适用于此处。
---

＃＃ 用法
===“Java”
    ```java
    var tabView = new TabView();

    var content1 = new UIElement();
    content1.addChild(new Label().setText("Settings content", false));

    var content2 = new UIElement();
    content2.addChild(new Label().setText("Info content", false));

    tabView.addTab(new Tab().setText("Settings"), content1);
    tabView.addTab(new Tab().setText("Info"), content2);

    tabView.setOnTabSelected(tab -> System.out.println("Selected: " + tab));
    parent.addChild(tabView);
    ```

===“科特林”
    ```kotlin
    tabView({
        onTabSelected { tab -> println("Selected: $tab") }
    }) {
        tab("Settings") {
            // add settings content children here
        }
        tab("Info") {
            // add info content children here
        }
    }
    ```

===“KubeJS”
    ```js
    let tv = new TabView();
    let content1 = new UIElement();
    let content2 = new UIElement();
    tv.addTab(new Tab().setText("A"), content1);
    tv.addTab(new Tab().setText("B"), content2);
    parent.addChild(tv);
    ```

---

## XML
```xml
<tab-view>
    <tab text="Settings">
        <tab-content>
            <label>Settings content here</label>
        </tab-content>
    </tab>
    <tab text="Info">
        <tab-content>
            <label>Info content here</label>
        </tab-content>
    </tab>
</tab-view>
```

每个`<tab>`元素都是一个tab header；它的 `<tab-content>` 子项描述了该选项卡处于活动状态时显示的内容窗格。
---

## 内部结构
| Index | Field | CSS class | Description |
| ----- | ----- | --------- | ----------- |
| `0` | `tabContentContainer` | `.__tab-view_tab_content_container__` | Pane that holds all content elements (only the active one is displayed). |
| `1` | `tabHeaderContainer` | `.__tab-view_tab_header_container__` | Row of tab headers (contains the `tabScroller`). |

`tabScroller` 是嵌套在`tabHeaderContainer` 内的`ScrollerView`：
| Field | CSS class | Description |
| ----- | --------- | ----------- |
| `tabScroller` | `.__tab-view_tab_scroller__` | Horizontally-scrollable view holding all tab headers. |

---

## 字段
| Name | Type | Access | Description |
| ---- | ---- | ------ | ----------- |
| `tabHeaderContainer` | `UIElement` | `public final` | Container for the tab header row. |
| `tabScroller` | `ScrollerView` | `public final` | Horizontal scroller holding the tab headers. |
| `tabContentContainer` | `UIElement` | `public final` | Container for all content panes. |
| `tabContents` | `BiMap<Tab, UIElement>` | `private` (getter) | Bidirectional map of tab headers ↔ content panes. |
| `selectedTab` | `Tab` | `private` (getter/nullable) | The currently-selected tab. |

---

＃＃ 方法
| Method | Returns | Description |
| ------ | ------- | ----------- |
| `addTab(Tab, UIElement)` | `TabView` | Appends a new tab and its content pane. Selects it if it is the first. |
| `addTab(Tab, UIElement, int)` | `TabView` | Inserts a tab at a specific index. |
| `removeTab(Tab)` | `TabView` | Removes a tab and its content. Selects the next tab if the removed one was selected. |
| `selectTab(Tab)` | `TabView` | Selects a tab, showing its content and hiding all others. |
| `clear()` | `TabView` | Removes all tabs and content. |
| `setOnTabSelected(Consumer<Tab>)` | — | Callback invoked when any tab is selected. |
| `tabHeaderContainer(Consumer<UIElement>)` | `TabView` | Configures the header container. |
| `tabScroller(Consumer<ScrollerView>)` | `TabView` | Configures the header scroller. |
| `tabContentContainer(Consumer<UIElement>)` | `TabView` | Configures the content container. |
