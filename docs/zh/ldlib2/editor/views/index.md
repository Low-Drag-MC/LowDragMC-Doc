# View System

`View` 是编辑器内容的基本单位。一个 View 会作为 tab 显示在 `ViewContainer` 中。

自定义编辑器通常会提供一个或多个 View：

* 主画布；
* 列表或树；
* 代码编辑器；
* 预览；
* 图编辑器；
* 自定义 Inspector 类面板。

## View

`View` 继承自 `UIElement`，因此可以用普通 LDLib2 UI 元素构建内容。

重要属性：

* `name`：View id 和翻译 key。
* `icon`：可选 tab 图标。
* `canRemove`：用户是否可以关闭 tab。
* `dynamicName`：可选运行时标题。
* `onRemove`：可选移除回调。

```java
var view = new View("editor.view.shop_items", Icons.FILE);
view.addChild(itemList);
placeView(view, () -> leftWindow.getLeftTop());
```

当 View 有实际行为时，推荐创建子类：

```java
public class ShopItemsView extends View {
    public ShopItemsView(ShopEditor editor) {
        super("editor.view.shop_items", Icons.FILE);
        addChild(createItemList(editor));
    }
}
```

## ViewContainer

`ViewContainer` 是承载 View 的标签面板。它通过 `View.createTab()` 创建 tab。

它支持：

* 选择 View；
* 重排 tab；
* 在容器之间移动 View；
* 折叠和展开面板；
* 在可能时移除空面板。

大多数代码不需要直接创建 `ViewContainer`。通过 Editor 的默认区域或 `placeView(...)` 添加 View 即可。

## Built-in Views

`Editor` 默认创建三个内置 View：

* `InspectorView`
* `HistoryView`
* `ResourceView`

`ResourceView` 属于资源系统分支，因为它只是资源工作流的一部分。`InspectorView` 和 `HistoryView` 在 Built-in Views 页面介绍。
