# SplitView

{{ version_badge("2.2.1", label="Since", icon="tag") }}

`SplitView` 是一个双窗格容器，其分隔线可拖动以调整窗格大小。提供两个具体变体：

- **`split-view-horizontal`** — 左右分割，使用垂直分隔线。
- **`split-view-vertical`** — 上下分割，使用水平分隔线。

分隔线位置以**百分比**（0–100%）表示。拖动边框可实时调整。

!!! note ""
    [UIElement](../element.md){ data-preview } 中记录的所有内容（布局、样式、事件、数据绑定等）同样适用于此组件。

---

## 基本用法

=== "Java"

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

=== "Kotlin"

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

=== "KubeJS"

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
        <!-- 左侧窗格内容 -->
    </first>
    <second>
        <!-- 右侧窗格内容 -->
    </second>
</split-view-horizontal>

<split-view-vertical percentage="50">
    <first>
        <!-- 顶部窗格内容 -->
    </first>
    <second>
        <!-- 底部窗格内容 -->
    </second>
</split-view-vertical>
```

| XML 属性 | 类型 | 描述 |
| ------------- | ---- | ----------- |
| `percentage` | `float` | 分隔线初始位置（0–100）。默认值：`50`。 |

`<first>` 和 `<second>` 子元素用于配置两个窗格。

---

## 内部结构

| 字段 | CSS 类 | 描述 |
| ----- | --------- | ----------- |
| `first` | `.__split_view_first__` | 第一窗格（水平布局时为左侧，垂直布局时为顶部）。 |
| `second` | `.__split_view_second__` | 第二窗格（水平布局时为右侧，垂直布局时为底部）。 |

---

## 字段

| 名称 | 类型 | 访问 | 描述 |
| ---- | ---- | ------ | ----------- |
| `first` | `UIElement` | `public final` | 第一窗格。 |
| `second` | `UIElement` | `public final` | 第二窗格。 |
| `borderSize` | `float` | `getter/setter` | 可拖动边框的点击区域宽度。默认值：`2`。 |
| `minPercentage` | `float` | `getter/setter` | 分隔线允许的最小百分比。默认值：`5`。 |
| `maxPercentage` | `float` | `getter/setter` | 分隔线允许的最大百分比。默认值：`95`。 |

---

## 方法

### 通用方法

| 方法 | 返回值 | 描述 |
| ------ | ------- | ----------- |
| `first(UIElement)` | `SplitView` | 替换第一窗格的内容。 |
| `second(UIElement)` | `SplitView` | 替换第二窗格的内容。 |
| `setPercentage(float)` | `SplitView` | 设置分隔线位置，限制在 `[minPercentage, maxPercentage]` 范围内。 |
| `getPercentage()` | `float` | 返回当前分隔线位置的百分比值。 |
| `setBorderSize(float)` | `SplitView` | 设置可拖动边框的宽度。 |
| `setMinPercentage(float)` | `SplitView` | 设置分隔线的下限。 |
| `setMaxPercentage(float)` | `SplitView` | 设置分隔线的上限。 |

### 水平分割专用

| 方法 | 返回值 | 描述 |
| ------ | ------- | ----------- |
| `left(UIElement)` | `Horizontal` | `first()` 的别名。 |
| `right(UIElement)` | `Horizontal` | `second()` 的别名。 |

### 垂直分割专用

| 方法 | 返回值 | 描述 |
| ------ | ------- | ----------- |
| `top(UIElement)` | `Vertical` | `first()` 的别名。 |
| `bottom(UIElement)` | `Vertical` | `second()` 的别名。 |
