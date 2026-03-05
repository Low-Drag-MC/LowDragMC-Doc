# TabView

{{ version_badge("2.2.1", label="Since", icon="tag") }}

`TabView` 是一个选项卡面板容器。它维护一行可水平滚动的 [`Tab`](tab.md){ data-preview } 标签头和一个显示当前选中选项卡内容的内容面板。切换选项卡时会显示新内容并隐藏其他内容。

在编辑器中只能添加 `Tab`（及其子类）作为子元素。

!!! note ""
    [UIElement](../element.md){ data-preview } 中记录的所有内容（布局、样式、事件、数据绑定等）同样适用于此组件。

---

## 使用方法

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
            // add settings content children here
        }
        tab("Info") {
            // add info content children here
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

每个 `<tab>` 元素是一个选项卡头；其 `<tab-content>` 子元素描述当该选项卡激活时显示的内容面板。

---

## 内部结构

| 索引 | 字段 | CSS 类名 | 描述 |
| ----- | ----- | --------- | ----------- |
| `0` | `tabContentContainer` | `.__tab-view_tab_content_container__` | 容纳所有内容元素的面板（仅显示当前激活的内容）。 |
| `1` | `tabHeaderContainer` | `.__tab-view_tab_header_container__` | 选项卡头行（包含 `tabScroller`）。 |

`tabScroller` 是嵌套在 `tabHeaderContainer` 内的 `ScrollerView`：

| 字段 | CSS 类名 | 描述 |
| ----- | --------- | ----------- |
| `tabScroller` | `.__tab-view_tab_scroller__` | 容纳所有选项卡头的水平滚动视图。 |

---

## 字段

| 名称 | 类型 | 访问权限 | 描述 |
| ---- | ---- | ------ | ----------- |
| `tabHeaderContainer` | `UIElement` | `public final` | 选项卡头行的容器。 |
| `tabScroller` | `ScrollerView` | `public final` | 容纳选项卡头的水平滚动器。 |
| `tabContentContainer` | `UIElement` | `public final` | 所有内容面板的容器。 |
| `tabContents` | `BiMap<Tab, UIElement>` | `private`（有 getter） | 选项卡头 ↔ 内容面板的双向映射。 |
| `selectedTab` | `Tab` | `private`（有 getter/可为 null） | 当前选中的选项卡。 |

---

## 方法

| 方法 | 返回值 | 描述 |
| ------ | ------- | ----------- |
| `addTab(Tab, UIElement)` | `TabView` | 添加新选项卡及其内容面板。如果是第一个则自动选中。 |
| `addTab(Tab, UIElement, int)` | `TabView` | 在指定索引处插入选项卡。 |
| `removeTab(Tab)` | `TabView` | 移除选项卡及其内容。如果移除的是当前选中项则选中下一个。 |
| `selectTab(Tab)` | `TabView` | 选中指定选项卡，显示其内容并隐藏其他内容。 |
| `clear()` | `TabView` | 移除所有选项卡和内容。 |
| `setOnTabSelected(Consumer<Tab>)` | — | 当任意选项卡被选中时调用的回调。 |
| `tabHeaderContainer(Consumer<UIElement>)` | `TabView` | 配置标签头容器。 |
| `tabScroller(Consumer<ScrollerView>)` | `TabView` | 配置标签头滚动器。 |
| `tabContentContainer(Consumer<UIElement>)` | `TabView` | 配置内容容器。 |
