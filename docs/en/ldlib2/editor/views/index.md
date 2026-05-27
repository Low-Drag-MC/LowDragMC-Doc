# View System

`View` is the base unit of editor content. A view is what appears inside a tab in a `ViewContainer`.

A custom editor usually provides one or more views:

* a main canvas,
* a list or tree,
* a code editor,
* a preview,
* a graph editor,
* a custom inspector-like panel.

## View

`View` extends `UIElement`, so you build its content with normal LDLib2 UI elements.

Important properties:

* `name`: the view id and translation key.
* `icon`: optional tab icon.
* `canRemove`: whether the tab can be closed by the user.
* `dynamicName`: optional runtime tab title.
* `onRemove`: optional removal callback.

```java
var view = new View("editor.view.shop_items", Icons.FILE);
view.addChild(itemList);
placeView(view, () -> leftWindow.getLeftTop());
```

Use a subclass when the view has meaningful behavior:

```java
public class ShopItemsView extends View {
    public ShopItemsView(ShopEditor editor) {
        super("editor.view.shop_items", Icons.FILE);
        addChild(createItemList(editor));
    }
}
```

## ViewContainer

`ViewContainer` is the tabbed panel that owns views. It handles tab creation through `View.createTab()`.

It supports:

* selecting views,
* reordering tabs,
* moving views between containers,
* collapsing and expanding the panel,
* removing empty panels when possible.

Most code should not construct `ViewContainer` directly. Add views through the editor's anchor windows or `placeView(...)`.

## Built-in Views

`Editor` creates three built-in views:

* `InspectorView`
* `HistoryView`
* `ResourceView`

`ResourceView` belongs to the resource system branch because it is only one piece of the resource workflow. `InspectorView` and `HistoryView` are covered as built-in views.
