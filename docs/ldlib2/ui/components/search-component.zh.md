# 搜索组件
{{ version_badge("2.2.1", label="Since", icon="tag") }}
`SearchComponent<T>` 是一个通用的搜索和选择小部件。它显示当前所选值的预览，单击时会打开一个浮动对话框，其中包含文本字段和匹配候选值的列表。候选者由 `ISearchUI<T>` 实现生成，该实现可以在客户端上运行或委托给服务器。
`SearchComponent` 扩展`BindableUIElement<T>`，因此所选值与数据绑定系统集成。
!!!笔记 ””[UIElement](../element.md){ data-preview } 上记录的所有内容（布局、样式、事件、数据绑定等）也适用于此处。
---

＃＃ 用法
===“Java”
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

===“科特林”
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

===“KubeJS”
    ```js
    let search = new SearchComponent();
    // ISearchUI must be provided programmatically.
    parent.addChild(search);
    ```

---

## 内部结构
| CSS class | Description |
| --------- | ----------- |
| `.__search-component_preview__` | Preview area showing the selected value. |
| `.__search-component_text-field__` | Text input shown when the component is open. |
| `.__search-component_dialog__` | Floating overlay dialog containing the candidate list. |
| `.__search-component_list-view__` | Plain list (used when candidates ≤ `max-item`). |
| `.__search-component_scroller-view__` | Scrollable list (used when candidates > `max-item`). |

---

## 搜索风格
!!!信息“”#### <p style="font-size: 1rem;">焦点覆盖</p>
当组件悬停或聚焦时在组件上绘制的纹理。
默认值：`Sprites.RECT_RD_T_SOLID`
===“Java”
        ```java
        search.searchStyle(style -> style.focusOverlay(myTexture));
        ```

===“LSS”
        ```css
        search-component {
            focus-overlay: rect(#FFFFFF22, 2);
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">最大项目</p>
在切换到`scrollerView` 之前，平面`listView` 中显示的最大结果数。
默认值：`5`
===“Java”
        ```java
        search.searchStyle(style -> style.maxItemCount(10));
        ```

===“LSS”
        ```css
        search-component {
            max-item: 10;
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">视图高度</p>
当候选数超过`max-item`时`scrollerView`的高度。
默认值：`50`
===“Java”
        ```java
        search.searchStyle(style -> style.scrollerViewHeight(80f));
        ```

===“LSS”
        ```css
        search-component {
            view-height: 80;
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">show-overlay</p>
是否突出显示悬停和选定的候选行。
默认值：`true`
===“Java”
        ```java
        search.searchStyle(style -> style.showOverlay(false));
        ```

===“LSS”
        ```css
        search-component {
            show-overlay: false;
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">选择后关闭</p>
选择候选人后对话框是否自动关闭。
默认值：`true`
===“Java”
        ```java
        search.searchStyle(style -> style.closeAfterSelect(false));
        ```

===“LSS”
        ```css
        search-component {
            close-after-select: false;
        }
        ```

---

##`ISearchUI<T>`接口
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
| Name | Type | Access | Description |
| ---- | ---- | ------ | ----------- |
| `textField` | `TextField` | `public final` | The text input for entering search words. |
| `preview` | `UIElement` | `public final` | Container showing the selected value's UI. |
| `dialog` | `UIElement` | `public final` | The floating candidate dialog (attached to the root). |
| `listView` | `UIElement` | `public final` | Flat list container (visible when ≤ `max-item` results). |
| `scrollerView` | `ScrollerView` | `public final` | Scrollable list (visible when > `max-item` results). |
| `searchStyle` | `SearchStyle` | `private` (getter) | Current style. |
| `value` | `T` (nullable) | `private` (getter) | The currently selected value. |
| `searchOnServer` | `boolean` | `private` (getter) | `true` when search is delegated to the server. |

---

＃＃ 方法
| Method | Returns | Description |
| ------ | ------- | ----------- |
| `setSearchUI(ISearchUI<T>)` | `SearchComponent<T>` | Sets the search logic provider. |
| `setCandidateUIProvider(UIElementProvider<T>)` | `SearchComponent<T>` | Sets the factory that builds the UI for each candidate. |
| `setSearchOnServer(Class<T[]>)` | `SearchComponent<T>` | Enables server-side search (RPC). |
| `setSelected(T)` | `SearchComponent<T>` | Selects a value and notifies listeners. |
| `setSelected(T, boolean)` | `SearchComponent<T>` | Selects a value; second param controls notification. |
| `setOnValueChanged(Consumer<T>)` | `SearchComponent<T>` | Registers a listener for value changes. |
| `searchStyle(Consumer<SearchStyle>)` | `SearchComponent<T>` | Configures style fluently. |
| `show()` | `void` | Opens the candidate dialog. |
| `hide()` | `void` | Closes the candidate dialog. |
| `isOpen()` | `boolean` | Returns `true` when the dialog is visible. |
