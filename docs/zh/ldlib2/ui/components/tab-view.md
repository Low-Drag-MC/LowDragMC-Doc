# TabView

{{ version_badge("2.2.1", label="自", icon="tag") }}

`TabView` 是一个带标签页的面板容器。它维护一行可水平滚动的 [`Tab`](tab.md){ data-preview } 标签头，以及一个用于显示当前选中标签内容的内容面板。切换标签页时会显示新内容并隐藏其他所有内容。

在编辑器中只有 `Tab`（及其子类）可以作为子元素添加。

!!! note ""
    [UIElement](element.md){ data-preview } 上记录的所有内容（布局、样式、事件、数据绑定等）同样适用于此处。

---

## 用法

=== "Java"

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

=== "Kotlin"

    ```kotlin
    tabView({
        onTabSelected { tab -> println("Selected: $tab") }
    }) {
        tab("Settings") {
            // 在此处添加设置内容的子元素
        }
        tab("Info") {
            // 在此处添加信息内容的子元素
        }
    }
    ```

=== "KubeJS"

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

每个 `<tab>` 元素是一个标签头；其子元素 `<tab-content>` 描述了当该标签页激活时显示的内容面板。

---

## 内部结构

| 索引 | 字段 | CSS 类 | 描述 |
| ---- | ---- | ------ | ---- |
| `0` | `tabContentContainer` | `.__tab-view_tab_content_container__` | 容纳所有内容元素的面板（仅显示当前激活的一个）。 |
| `1` | `tabHeaderContainer` | `.__tab-view_tab_header_container__` | 标签头行（包含 `tabScroller`）。 |

`tabScroller` 是一个嵌套在 `tabHeaderContainer` 内的 `ScrollerView`：

| 字段 | CSS 类 | 描述 |
| ---- | ------ | ---- |
| `tabScroller` | `.__tab-view_tab_scroller__` | 容纳所有标签头的可水平滚动视图。 |

---

## 字段

| 名称 | 类型 | 访问权限 | 描述 |
| ---- | ---- | -------- | ---- |
| `tabHeaderContainer` | `UIElement` | `public final` | 标签头行的容器。 |
| `tabScroller` | `ScrollerView` | `public final` | 容纳标签头的水平滚动器。 |
| `tabContentContainer` | `UIElement` | `public final` | 所有内容面板的容器。 |
| `tabContents` | `BiMap<Tab, UIElement>` | `private` (getter) | 标签头 ↔ 内容面板的双向映射。 |
| `selectedTab` | `Tab` | `private` (getter/nullable) | 当前选中的标签页。 |

---

## 方法

| 方法 | 返回 | 描述 |
| ---- | ---- | ---- |
| `addTab(Tab, UIElement)` | `TabView` | 追加一个新标签页及其内容面板。如果是第一个则自动选中。 |
| `addTab(Tab, UIElement, int)` | `TabView` | 在指定索引处插入一个标签页。 |
| `removeTab(Tab)` | `TabView` | 移除一个标签页及其内容。如果被移除的是当前选中的，则选中下一个标签页。 |
| `selectTab(Tab)` | `TabView` | 选中一个标签页，显示其内容并隐藏其他所有内容。 |
| `clear()` | `TabView` | 移除所有标签页和内容。 |
| `setOnTabSelected(Consumer<Tab>)` | — | 当任何标签页被选中时触发的回调。 |
| `tabHeaderContainer(Consumer<UIElement>)` | `TabView` | 配置标签头容器。 |
| `tabScroller(Consumer<ScrollerView>)` | `TabView` | 配置标签头滚动器。 |
| `tabContentContainer(Consumer<UIElement>)` | `TabView` | 配置内容容器。 |
