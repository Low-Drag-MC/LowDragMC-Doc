# VirtualScrollerView

<VersionBadge version="2.2.18" label="Since" icon="tag" />

`VirtualScrollerView<T>` 是只挂载视口附近行的可滚动列表。普通 `ScrollerView` 会创建过多 UI 元素时，应使用它处理长列表。

<figure>
<img src="/assets/ldlib2/virtual-scroller-view.png" alt="VirtualScrollerView 显示 500 项列表中的可见部分">
<figcaption>
列表共有 500 项，但只挂载视口附近的行；滚动条仍表示完整数据集的位置与长度。
</figcaption>
</figure>

```java
var list = new VirtualScrollerView<String>()
        .setItems(entries)
        .setItemUIProvider(text -> new Label().setText(text));
list.virtualScrollerViewStyle(style -> style
        .estimatedItemHeight(18)
        .overscanPixels(36));
```

## 数据与行

| API | 说明 |
| --- | --- |
| `setItems(List<T>)` | 替换数据列表并重新挂载可见行。 |
| `setItemUIProvider(UIElementProvider<T>)` | 为每个可见项创建 UI。 |
| `setBeforeMountItems(Runnable)` | 重建行前执行；可用于清理临时行状态。 |
| `refreshVisibleItems()` | 外部数据变化后重建可见行。 |
| `scrollToTop()` | 滚动到列表开头。 |

行会在滚动时重新创建。选中状态、编辑值等持久状态应保存在数据模型中，不能只保存在已挂载行的实例内。

## 高度模式

| 属性 | 说明 |
| --- | --- |
| `virtual-item-height-mode` | `FIXED` 对所有行使用估计高度；`VARIABLE` 测量已挂载行。 |
| `virtual-estimated-item-height` | 初始行高，单位像素；应尽量接近实际高度。 |
| `virtual-overscan-pixels` | 在视口上下额外渲染的区域。 |

::: tip

短列表或静态内容使用普通 `ScrollerView` 即可。虚拟化适用于列表规模而不是单项视觉复杂度造成的性能问题。

:::
