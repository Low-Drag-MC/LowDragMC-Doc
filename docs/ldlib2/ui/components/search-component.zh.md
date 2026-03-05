# SearchComponent

{{ version_badge("2.2.1", label="Since", icon="tag") }}

`SearchComponent<T>` 是一个通用的搜索选择组件。它显示当前选中值的预览，点击后会打开一个浮动对话框，包含文本输入框和匹配候选项列表。候选项由 `ISearchUI<T>` 实现提供，可在客户端运行或委托给服务端执行。

`SearchComponent` 继承自 `BindableUIElement<T>`，因此选中的值可与数据绑定系统集成。

!!! note ""
    [UIElement](../element.md){ data-preview } 中记录的所有内容（布局、样式、事件、数据绑定等）在此同样适用。

---

## 用法

=== "Java"

    ```java
    var search = new SearchComponent<String>();
    search.setSearchUI(new SearchComponent.ISearchUI<>() {
        @Override
        public String resultText(String value) { return value; }
        @Override
        public void onResultSelected(String value) { }
        @Override
        public void search(String word, IResultHandler<String> find) {
            List.of("Alpha", "Beta", "Gamma").stream()
                .filter(s -> s.toLowerCase().contains(word.toLowerCase()))
                .forEach(find::handle);
        }
    });
    search.setOnValueChanged(v -> System.out.println("Selected: " + v));
    parent.addChild(search);
    ```

=== "Kotlin"

    ```kotlin
    searchComponent<String>({
        searchUI {
            resultText { it }
            onSelected { v -> println("Selected: $v") }
            search { word, find ->
                listOf("Alpha", "Beta", "Gamma")
                    .filter { it.lowercase().contains(word.lowercase()) }
                    .forEach(find::handle)
            }
        }
    }) { }
    ```

=== "KubeJS"

    ```js
    let search = new SearchComponent();
    // ISearchUI must be provided programmatically.
    parent.addChild(search);
    ```

---

## 内部结构

| CSS 类 | 描述 |
| --------- | ----------- |
| `.__search-component_preview__` | 显示选中值的预览区域。 |
| `.__search-component_text-field__` | 组件打开时显示的文本输入框。 |
| `.__search-component_dialog__` | 包含候选项列表的浮动对话框。 |
| `.__search-component_list-view__` | 普通列表（候选项数量 ≤ `max-item` 时使用）。 |
| `.__search-component_scroller-view__` | 可滚动列表（候选项数量 > `max-item` 时使用）。 |

---

## 搜索样式

!!! info ""
    #### <p style="font-size: 1rem;">focus-overlay</p>

    当组件被悬停或聚焦时绘制的覆盖纹理。

    默认值：`Sprites.RECT_RD_T_SOLID`

    === "Java"

        ```java
        search.searchStyle(style -> style.focusOverlay(myTexture));
        ```

    === "LSS"

        ```css
        search-component {
            focus-overlay: rect(#FFFFFF22, 2);
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">max-item</p>

    在切换到 `scrollerView` 之前，平铺 `listView` 中显示的最大结果数量。

    默认值：`5`

    === "Java"

        ```java
        search.searchStyle(style -> style.maxItemCount(10));
        ```

    === "LSS"

        ```css
        search-component {
            max-item: 10;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">view-height</p>

    当候选项数量超过 `max-item` 时，`scrollerView` 的高度。

    默认值：`50`

    === "Java"

        ```java
        search.searchStyle(style -> style.scrollerViewHeight(80f));
        ```

    === "LSS"

        ```css
        search-component {
            view-height: 80;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">show-overlay</p>

    是否高亮显示悬停和选中的候选行。

    默认值：`true`

    === "Java"

        ```java
        search.searchStyle(style -> style.showOverlay(false));
        ```

    === "LSS"

        ```css
        search-component {
            show-overlay: false;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">close-after-select</p>

    选中候选项后是否自动关闭对话框。

    默认值：`true`

    === "Java"

        ```java
        search.searchStyle(style -> style.closeAfterSelect(false));
        ```

    === "LSS"

        ```css
        search-component {
            close-after-select: false;
        }
        ```

---

## `ISearchUI<T>` 接口

实现此接口以提供搜索逻辑：

```java
public interface ISearchUI<T> extends ISearch<T> {
    /** Convert a result value to its text representation. */
    String resultText(T value);

    /** Called when the user selects a candidate. */
    void onResultSelected(@Nullable T value);

    /** Perform the search; call find.handle(result) for each match. */
    void search(String word, IResultHandler<T> find);
}
```

---

## 字段

| 名称 | 类型 | 访问修饰符 | 描述 |
| ---- | ---- | ------ | ----------- |
| `textField` | `TextField` | `public final` | 用于输入搜索词的文本输入框。 |
| `preview` | `UIElement` | `public final` | 显示选中值 UI 的容器。 |
| `dialog` | `UIElement` | `public final` | 浮动候选对话框（附加到根元素）。 |
| `listView` | `UIElement` | `public final` | 平铺列表容器（结果数量 ≤ `max-item` 时可见）。 |
| `scrollerView` | `ScrollerView` | `public final` | 可滚动列表（结果数量 > `max-item` 时可见）。 |
| `searchStyle` | `SearchStyle` | `private`（有 getter） | 当前样式。 |
| `value` | `T`（可空） | `private`（有 getter） | 当前选中的值。 |
| `searchOnServer` | `boolean` | `private`（有 getter） | 为 `true` 时搜索委托给服务端执行。 |

---

## 方法

| 方法 | 返回值 | 描述 |
| ------ | ------- | ----------- |
| `setSearchUI(ISearchUI<T>)` | `SearchComponent<T>` | 设置搜索逻辑提供者。 |
| `setCandidateUIProvider(UIElementProvider<T>)` | `SearchComponent<T>` | 设置为每个候选项构建 UI 的工厂。 |
| `setSearchOnServer(Class<T[]>)` | `SearchComponent<T>` | 启用服务端搜索（RPC）。 |
| `setSelected(T)` | `SearchComponent<T>` | 选中一个值并通知监听器。 |
| `setSelected(T, boolean)` | `SearchComponent<T>` | 选中一个值；第二个参数控制是否通知。 |
| `setOnValueChanged(Consumer<T>)` | `SearchComponent<T>` | 注册值变化监听器。 |
| `searchStyle(Consumer<SearchStyle>)` | `SearchComponent<T>` | 流式配置样式。 |
| `show()` | `void` | 打开候选对话框。 |
| `hide()` | `void` | 关闭候选对话框。 |
| `isOpen()` | `boolean` | 对话框可见时返回 `true`。 |
