# 选择器
{{ version_badge("2.2.1", label="Since", icon="tag") }}
`Selector<T>` 是一个通用的下拉选择器。单击它会打开候选项目的浮动列表；单击某个项目即可将其选中，并可以选择关闭下拉列表。每个候选都由可配置的`UIElementProvider<T>` 呈现。当候选数超过[`max-item`](#max-item)时，列表切换为可滚动`ScrollerView`。
!!!笔记 ””[UIElement](../element.md){ data-preview } 上记录的所有内容（布局、样式、事件、数据绑定等）也适用于此处。
---

＃＃ 用法
===“Java”
    ```java
    var selector = new Selector<String>();
    selector.setCandidates(List.of("Alpha", "Beta", "Gamma"));
    selector.setSelected("Alpha");
    selector.setOnValueChanged(value -> {
        System.out.println("Selected: " + value);
    });
    parent.addChild(selector);
    ```

===“科特林”
    ```kotlin
    selector<String>({
        candidates("Alpha", "Beta", "Gamma")
        selected("Alpha")
        onChange { value -> println("Selected: $value") }
    }) { }
    ```

===“KubeJS”
    ```js
    let sel = new Selector();
    sel.setCandidates(["Alpha", "Beta", "Gamma"]);
    sel.setSelected("Alpha");
    sel.setOnValueChanged(v => { console.log("Selected: " + v); });
    parent.addChild(sel);
    ```

### 自定义候选人用户界面
默认情况下，每个候选显示为其 `toString()` 文本。提供自定义提供程序以按照您喜欢的方式呈现项目：
===“Java”
    ```java
    selector.setCandidateUIProvider(candidate ->
        new UIElement()
            .addChild(new Label().setText(candidate.displayName(), false))
    );
    ```

===“科特林”
    ```kotlin
    selector<MyItem>({
        candidateUI { item ->
            element { /* build custom row for item */ }
        }
    }) { }
    ```

---

## XML
```xml
<!-- String selector with static candidates -->
<selector default-value="Beta">
    <candidate>Alpha</candidate>
    <candidate>Beta</candidate>
    <candidate>Gamma</candidate>
</selector>
```

| XML Attribute | Type | Description |
| ------------- | ---- | ----------- |
| `default-value` | `string` | Pre-selects a candidate by its string value. |

| XML Child | Description |
| --------- | ----------- |
| `<candidate>` | Adds a string candidate to the list. The element's text content is used as the value. |

---

## 内部结构
| Index | Field | Type | CSS class | Description |
| ----- | ----- | ---- | --------- | ----------- |
| `0` | `display` | `UIElement` | — | The main display bar (contains `preview` and `buttonIcon`). |

以下子级嵌套在内部结构中，可以通过 CSS 类定位：
| Field | CSS class | Description |
| ----- | --------- | ----------- |
| `preview` | `.__selector_preview__` | Shows the currently-selected item's UI. |
| `buttonIcon` | `.__selector_button-icon__` | The dropdown arrow icon on the right. |
| `dialog` | `.__selector_dialog__` | The floating dropdown panel (attached to root when open). |
| `listView` | `.__selector_list-view__` | Direct list used when count ≤ `max-item`. |
| `scrollerView` | `.__selector_scroller-view__` | Scrollable list used when count > `max-item`. |

---

## 选择器样式
`SelectorStyle` 控制下拉菜单覆盖的外观和行为。
!!!信息“”#### <p style="font-size: 1rem;">焦点覆盖</p>
当选择器栏悬停或聚焦时，在选择器栏上绘制纹理。
默认值：`Sprites.RECT_RD_T_SOLID`
===“Java”
        ```java
        selector.selectorStyle(style -> style.focusOverlay(myHighlight));
        ```

===“LSS”
        ```css
        selector {
            focus-overlay: rect(#FFFFFF33, 2);
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">最大项目</p>
平面 `listView` 中渲染的最大项目数。当候选列表较长时，将使用`ScrollerView` 代替。
默认值：`5`
===“Java”
        ```java
        selector.selectorStyle(style -> style.maxItemCount(8));
        ```

===“科特林”
        ```kotlin
        selector<String>({ }) { withMaxItems(8) }
        ```

===“LSS”
        ```css
        selector {
            max-item: 8;
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">视图高度</p>
当候选数超过`max-item`时`ScrollerView`的高度。
默认值：`50`
===“Java”
        ```java
        selector.selectorStyle(style -> style.scrollerViewHeight(80f));
        ```

===“科特林”
        ```kotlin
        selector<String>({ }) { withScrollHeight(80f) }
        ```

===“LSS”
        ```css
        selector {
            view-height: 80;
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">show-overlay</p>
悬停和选定的候选项是否用半透明覆盖层突出显示。
默认值：`true`
===“Java”
        ```java
        selector.selectorStyle(style -> style.showOverlay(false));
        ```

===“LSS”
        ```css
        selector {
            show-overlay: false;
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">选择后关闭</p>
玩家选择项目后下拉列表是否自动关闭。
默认值：`true`
===“Java”
        ```java
        selector.selectorStyle(style -> style.closeAfterSelect(false));
        ```

===“科特林”
        ```kotlin
        selector<String>({ }) { closeOnSelect() }
        ```

===“LSS”
        ```css
        selector {
            close-after-select: false;
        }
        ```

---

## 值绑定
`Selector<T>` 扩展了 `BindableUIElement<T>`，因此它支持标准数据绑定 API：
===“Java”
    ```java
    selector.bind(DataBindingBuilder.string(
        () -> config.getMode(),
        mode -> config.setMode(mode)
    ).build());
    ```

有关完整详细信息，请参阅[Data Bindings](../data_bindings.md){ data-preview }。
---

## 字段
| Name | Type | Access | Description |
| ---- | ---- | ------ | ----------- |
| `display` | `UIElement` | `public final` | The main display bar. |
| `preview` | `UIElement` | `public final` | Shows the selected item's UI. |
| `buttonIcon` | `UIElement` | `public final` | The dropdown arrow icon. |
| `dialog` | `UIElement` | `public final` | The floating dropdown panel. |
| `listView` | `UIElement` | `public final` | Flat list used for short candidate lists. |
| `scrollerView` | `ScrollerView` | `public final` | Scrollable list used for long candidate lists. |
| `selectorStyle` | `SelectorStyle` | `private` (getter) | Current selector style. |
| `candidates` | `List<T>` | `private` (getter) | Current candidate list. |
| `value` | `T` | `private` (getter/nullable) | Currently selected value. |

---

＃＃ 方法
| Method | Returns | Description |
| ------ | ------- | ----------- |
| `setCandidates(List<T>)` | `Selector<T>` | Replaces the candidate list and rebuilds the dropdown. |
| `setCandidateUIProvider(UIElementProvider<T>)` | `Selector<T>` | Sets a custom factory for rendering each candidate. |
| `setSelected(T)` | `Selector<T>` | Selects a value and notifies listeners. |
| `setOnValueChanged(Consumer<T>)` | `Selector<T>` | Registers a listener for value changes. |
| `selectorStyle(Consumer<SelectorStyle>)` | `Selector<T>` | Configures `SelectorStyle` fluently. |
| `show()` | `void` | Opens the dropdown. |
| `hide()` | `void` | Closes the dropdown. |
| `isOpen()` | `boolean` | Returns `true` if the dropdown is currently open. |
| `getValue()` | `T` | Returns the currently selected value (may be `null`). |
