# Selector

{{ version_badge("2.2.1", label="自", icon="tag") }}

`Selector<T>` 是一个通用的下拉选择器。点击它会弹出一个悬浮的候选项目列表；点击某个项目即可选中它，并可选择关闭下拉列表。每个候选项目都由可配置的 `UIElementProvider<T>` 渲染。当候选数量超过 [`max-item`](#max-item) 时，列表会切换为可滚动的 `ScrollerView`。

!!! note ""
    所有在 [UIElement](element.md){ data-preview } 中记录的内容（布局、样式、事件、数据绑定等）同样适用于此处。

---

## 用法

=== "Java"

    ```java
    var selector = new Selector<String>();
    selector.setCandidates(List.of("Alpha", "Beta", "Gamma"));
    selector.setSelected("Alpha");
    selector.setOnValueChanged(value -> {
        System.out.println("Selected: " + value);
    });
    parent.addChild(selector);
    ```

=== "Kotlin"

    ```kotlin
    selector<String>({
        candidates("Alpha", "Beta", "Gamma")
        selected("Alpha")
        onChange { value -> println("Selected: $value") }
    }) { }
    ```

=== "KubeJS"

    ```js
    let sel = new Selector();
    sel.setCandidates(["Alpha", "Beta", "Gamma"]);
    sel.setSelected("Alpha");
    sel.setOnValueChanged(v => { console.log("Selected: " + v); });
    parent.addChild(sel);
    ```

### 自定义候选项目 UI

默认情况下，每个候选项目以其 `toString()` 文本显示。你可以提供自定义 provider 来按任意方式渲染项目：

=== "Java"

    ```java
    selector.setCandidateUIProvider(candidate ->
        new UIElement()
            .addChild(new Label().setText(candidate.displayName(), false))
    );
    ```

=== "Kotlin"

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

| XML 属性 | 类型 | 描述 |
| ------------- | ---- | ----------- |
| `default-value` | `string` | 根据其字符串值预选一个候选项目。 |

| XML 子元素 | 描述 |
| --------- | ----------- |
| `<candidate>` | 向列表中添加一个字符串候选项目。元素的文本内容用作值。 |

---

## 内部结构

| 索引 | 字段 | 类型 | CSS class | 描述 |
| ----- | ----- | ---- | --------- | ----------- |
| `0` | `display` | `UIElement` | — | 主显示栏（包含 `preview` 和 `buttonIcon`）。 |

以下子元素嵌套在内部结构中，可以通过 CSS class 进行定位：

| 字段 | CSS class | 描述 |
| ----- | --------- | ----------- |
| `preview` | `.__selector_preview__` | 显示当前选中项目的 UI。 |
| `buttonIcon` | `.__selector_button-icon__` | 右侧的下拉箭头图标。 |
| `dialog` | `.__selector_dialog__` | 悬浮下拉面板（打开时附加到根元素）。 |
| `listView` | `.__selector_list-view__` | 当数量 ≤ `max-item` 时直接使用的列表。 |
| `scrollerView` | `.__selector_scroller-view__` | 当数量 > `max-item` 时使用的可滚动列表。 |

---

## Selector 样式

`SelectorStyle` 控制下拉覆盖层的外观和行为。

!!! info ""
    #### <p style="font-size: 1rem;">focus-overlay</p>

    当 Selector 被悬停或获得焦点时，绘制在其上方的纹理。

    默认值：`Sprites.RECT_RD_T_SOLID`

    === "Java"

        ```java
        selector.selectorStyle(style -> style.focusOverlay(myHighlight));
        ```

    === "LSS"

        ```css
        selector {
            focus-overlay: rect(#FFFFFF33, 2);
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">max-item</p>

    在平面 `listView` 中渲染的最大项目数。当候选列表更长时，将改用 `ScrollerView`。

    默认值：`5`

    === "Java"

        ```java
        selector.selectorStyle(style -> style.maxItemCount(8));
        ```

    === "Kotlin"

        ```kotlin
        selector<String>({ }) { withMaxItems(8) }
        ```

    === "LSS"

        ```css
        selector {
            max-item: 8;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">view-height</p>

    当候选数量超过 `max-item` 时，`ScrollerView` 的高度。

    默认值：`50`

    === "Java"

        ```java
        selector.selectorStyle(style -> style.scrollerViewHeight(80f));
        ```

    === "Kotlin"

        ```kotlin
        selector<String>({ }) { withScrollHeight(80f) }
        ```

    === "LSS"

        ```css
        selector {
            view-height: 80;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">show-overlay</p>

    悬停和选中的候选项目是否以半透明覆盖层高亮显示。

    默认值：`true`

    === "Java"

        ```java
        selector.selectorStyle(style -> style.showOverlay(false));
        ```

    === "LSS"

        ```css
        selector {
            show-overlay: false;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">close-after-select</p>

    玩家选择项目后，下拉列表是否自动关闭。

    默认值：`true`

    === "Java"

        ```java
        selector.selectorStyle(style -> style.closeAfterSelect(false));
        ```

    === "Kotlin"

        ```kotlin
        selector<String>({ }) { closeOnSelect() }
        ```

    === "LSS"

        ```css
        selector {
            close-after-select: false;
        }
        ```

---

## 值绑定

`Selector<T>` 继承自 `BindableUIElement<T>`，因此支持标准的数据绑定 API：

=== "Java"

    ```java
    selector.bind(DataBindingBuilder.string(
        () -> config.getMode(),
        mode -> config.setMode(mode)
    ).build());
    ```

详见 [数据绑定](../preliminary/data_bindings.md){ data-preview }。

---

## 字段

| 名称 | 类型 | 访问权限 | 描述 |
| ---- | ---- | ------ | ----------- |
| `display` | `UIElement` | `public final` | 主显示栏。 |
| `preview` | `UIElement` | `public final` | 显示选中项目的 UI。 |
| `buttonIcon` | `UIElement` | `public final` | 下拉箭头图标。 |
| `dialog` | `UIElement` | `public final` | 悬浮下拉面板。 |
| `listView` | `UIElement` | `public final` | 用于短候选列表的平面列表。 |
| `scrollerView` | `ScrollerView` | `public final` | 用于长候选列表的可滚动列表。 |
| `selectorStyle` | `SelectorStyle` | `private` (getter) | 当前 Selector 样式。 |
| `candidates` | `List<T>` | `private` (getter) | 当前候选列表。 |
| `value` | `T` | `private` (getter/nullable) | 当前选中的值。 |

---

## 方法

| 方法 | 返回类型 | 描述 |
| ------ | ------- | ----------- |
| `setCandidates(List<T>)` | `Selector<T>` | 替换候选列表并重建下拉菜单。 |
| `setCandidateUIProvider(UIElementProvider<T>)` | `Selector<T>` | 设置用于渲染每个候选项目的自定义工厂。 |
| `setSelected(T)` | `Selector<T>` | 选择一个值并通知监听器。 |
| `setOnValueChanged(Consumer<T>)` | `Selector<T>` | 注册一个值变化监听器。 |
| `selectorStyle(Consumer<SelectorStyle>)` | `Selector<T>` | 流畅地配置 `SelectorStyle`。 |
| `show()` | `void` | 打开下拉菜单。 |
| `hide()` | `void` | 关闭下拉菜单。 |
| `isOpen()` | `boolean` | 如果下拉菜单当前处于打开状态，则返回 `true`。 |
| `getValue()` | `T` | 返回当前选中的值（可能为 `null`）。 |
