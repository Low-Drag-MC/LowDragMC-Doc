# SplitView

{{ version_badge("2.2.1", label="自", icon="tag") }}

`SplitView` 是一个双面板容器，其分隔条可以通过拖拽来调整两个面板的大小。目前注册了两种具体的变体：

- **`split-view-horizontal`** — 左右分割，带有垂直分隔条。
- **`split-view-vertical`** — 上下分割，带有水平分隔条。

分隔条的位置以**百分比**（0–100%）表示。拖拽分隔条可实时调整其位置。

!!! note ""
    [UIElement](element.md){ data-preview } 中记录的所有内容（布局、样式、事件、数据绑定等）同样适用于此处。

---

## 用法

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
        <!-- 左侧面板内容 -->
    </first>
    <second>
        <!-- 右侧面板内容 -->
    </second>
</split-view-horizontal>

<split-view-vertical percentage="50">
    <first>
        <!-- 顶部面板内容 -->
    </first>
    <second>
        <!-- 底部面板内容 -->
    </second>
</split-view-vertical>
```

| XML 属性 | 类型 | 描述 |
| ------------- | ---- | ----------- |
| `percentage` | `float` | 初始分隔条位置（0–100）。默认值：`50`。 |

`<first>` 和 `<second>` 子元素用于配置两个面板。

---

## 内部结构

| 字段 | CSS 类 | 描述 |
| ----- | --------- | ----------- |
| `first` | `.__split_view_first__` | 第一个面板（水平方向为左侧，垂直方向为顶部）。 |
| `second` | `.__split_view_second__` | 第二个面板（水平方向为右侧，垂直方向为底部）。 |

---

## 字段

| 名称 | 类型 | 访问权限 | 描述 |
| ---- | ---- | ------ | ----------- |
| `first` | `UIElement` | `public final` | 第一个面板。 |
| `second` | `UIElement` | `public final` | 第二个面板。 |
| `borderSize` | `float` | `getter/setter` | 可拖拽分隔条的点击区域宽度。默认值：`2`。 |
| `minPercentage` | `float` | `getter/setter` | 允许的最小分隔条百分比。默认值：`5`。 |
| `maxPercentage` | `float` | `getter/setter` | 允许的最大分隔条百分比。默认值：`95`。 |

---

## 方法

### 通用

| 方法 | 返回值 | 描述 |
| ------ | ------- | ----------- |
| `first(UIElement)` | `SplitView` | 替换第一个面板的内容。 |
| `second(UIElement)` | `SplitView` | 替换第二个面板的内容。 |
| `setPercentage(float)` | `SplitView` | 设置分隔条位置，限制在 `[minPercentage, maxPercentage]` 范围内。 |
| `getPercentage()` | `float` | 以百分比形式返回当前分隔条位置。 |
| `setBorderSize(float)` | `SplitView` | 设置可拖拽分隔条的宽度。 |
| `setMinPercentage(float)` | `SplitView` | 设置分隔条的下限。 |
| `setMaxPercentage(float)` | `SplitView` | 设置分隔条的上限。 |

### 仅水平方向

| 方法 | 返回值 | 描述 |
| ------ | ------- | ----------- |
| `left(UIElement)` | `Horizontal` | `first()` 的别名。 |
| `right(UIElement)` | `Horizontal` | `second()` 的别名。 |

### 仅垂直方向

| 方法 | 返回值 | 描述 |
| ------ | ------- | ----------- |
| `top(UIElement)` | `Vertical` | `first()` 的别名。 |
| `bottom(UIElement)` | `Vertical` | `second()` 的别名。 |
