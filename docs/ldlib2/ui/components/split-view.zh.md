# 分割视图
{{ version_badge("2.2.1", label="Since", icon="tag") }}
`SplitView` 是一个两窗格容器，可以拖动其分隔线来调整窗格大小。注册了两个具体变体：
- **`split-view-horizontal`** — 用垂直分隔线左/右分割。- **`split-view-vertical`** — 使用水平分隔线进行顶部/底部分割。
分隔线位置以**百分比** (0–100 %) 表示。拖动边框可以实时调整它。
!!!笔记 ””[UIElement](../element.md){ data-preview } 上记录的所有内容（布局、样式、事件、数据绑定等）也适用于此处。
---

＃＃ 用法
===“Java”
    ```java
    var split = new SplitView.Horizontal();
    split.left(leftContent);
    split.right(rightContent);
    split.setPercentage(30f);
    parent.addChild(split);

    var vsplit = new SplitView.Vertical();
    vsplit.top(topContent);
    vsplit.bottom(bottomContent);
    parent.addChild(vsplit);
    ```

===“科特林”
    ```kotlin
    splitViewHorizontal({ split(30f) }) {
        withLeft(leftElement)
        withRight(rightElement)
    }

    splitViewVertical {
        withTop(topElement)
        withBottom(bottomElement)
    }
    ```

===“KubeJS”
    ```js
    let split = new SplitViewHorizontal();
    split.left(leftContent);
    split.right(rightContent);
    split.setPercentage(30);
    parent.addChild(split);
    ```

---

## XML
```xml
<split-view-horizontal percentage="30">
    <first>
        <!-- left pane content -->
    </first>
    <second>
        <!-- right pane content -->
    </second>
</split-view-horizontal>

<split-view-vertical percentage="50">
    <first>
        <!-- top pane content -->
    </first>
    <second>
        <!-- bottom pane content -->
    </second>
</split-view-vertical>
```

| XML Attribute | Type | Description |
| ------------- | ---- | ----------- |
| `percentage` | `float` | Initial divider position (0–100). Default: `50`. |

`<first>` 和 `<second>` 子元素配置两个窗格。
---

## 内部结构
| Field | CSS class | Description |
| ----- | --------- | ----------- |
| `first` | `.__split_view_first__` | First pane (left for horizontal, top for vertical). |
| `second` | `.__split_view_second__` | Second pane (right for horizontal, bottom for vertical). |

---

## 字段
| Name | Type | Access | Description |
| ---- | ---- | ------ | ----------- |
| `first` | `UIElement` | `public final` | First pane. |
| `second` | `UIElement` | `public final` | Second pane. |
| `borderSize` | `float` | `getter/setter` | Width of the draggable border hit area. Default: `2`. |
| `minPercentage` | `float` | `getter/setter` | Minimum allowed divider percentage. Default: `5`. |
| `maxPercentage` | `float` | `getter/setter` | Maximum allowed divider percentage. Default: `95`. |

---

＃＃ 方法
＃＃＃ 常见的
| Method | Returns | Description |
| ------ | ------- | ----------- |
| `first(UIElement)` | `SplitView` | Replaces the content of the first pane. |
| `second(UIElement)` | `SplitView` | Replaces the content of the second pane. |
| `setPercentage(float)` | `SplitView` | Sets the divider position, clamped to `[minPercentage, maxPercentage]`. |
| `getPercentage()` | `float` | Returns the current divider position as a percentage. |
| `setBorderSize(float)` | `SplitView` | Sets the draggable border width. |
| `setMinPercentage(float)` | `SplitView` | Sets the lower bound for the divider. |
| `setMaxPercentage(float)` | `SplitView` | Sets the upper bound for the divider. |

### 仅水平
| Method | Returns | Description |
| ------ | ------- | ----------- |
| `left(UIElement)` | `Horizontal` | Alias for `first()`. |
| `right(UIElement)` | `Horizontal` | Alias for `second()`. |

### 仅垂直
| Method | Returns | Description |
| ------ | ------- | ----------- |
| `top(UIElement)` | `Vertical` | Alias for `first()`. |
| `bottom(UIElement)` | `Vertical` | Alias for `second()`. |
