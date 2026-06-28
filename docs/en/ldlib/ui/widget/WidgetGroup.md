# WidgetGroup 

[ <DocIcon name="material-tag" /> `WidgetGroup`](WidgetGroup.md)

`WidgetGroup` is a container which can add child widgets. Widget inherints from `WidgetGroup` can add child widgets as well. 

::: info
We will add a [ <DocIcon name="material-tag" /> `WidgetGroup`](WidgetGroup.md) for all widget inherints from it.
:::

---

## Basic properties

All properties can be accessed via Java / KubeJS.


| Field       | Description                          |
| :---------- | :----------------------------------- |
| `widgets`       | all child widgets  |
| `layout`       | layout of child widgets |
| `layoutPadding`       | padding offset |

<DocTabs>
<DocTab title="Java">

``` java 
for (var child in group.widgets) {

}
```

</DocTab>
<DocTab title="KubeJS">

``` javascript
for (let child of group.widgets) {

}
```

</DocTab>
</DocTabs>

::: warning
**DO NOT** add widget to the `group.widgets` directly!! please check below methods.
:::

---

## APIs

### `addWidgets()`

Add child widgets to it **in order**.

<DocTabs>
<DocTab title="Java / KubeJS">

``` java 
var button = ...;
var label = ...;
group.addWidgets(button, label);
```

</DocTab>
</DocTabs>

---

### `removeWidget() / clearAllWidgets()`

Remove child widget from it.

<DocTabs>
<DocTab title="Java / KubeJS">

``` java 
var child = group.getFirstWidgetById("button_id");
group.removeWidget(child);
group.clearAllWidget();
```

</DocTab>
</DocTabs>

---

### `waitToAdded() / waitToRemoved()`

Basically equals to the `addWidgets()` and `removeWidget()`. However, these two methods is useful for iteration and multi-thread. It handles widget in the next tick (in main thread).
