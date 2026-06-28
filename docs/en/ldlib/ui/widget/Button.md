# ButtonWidget

<img src="../assets/button.png" alt="Image title" width="30%" class="md-img-right">

The ButtonWidget is a UI widget representing a clickable button in the GUI system

## Basic properties

All properties can be accessed via Java / KubeJS.


| Field       | Description                          |
| :---------- | :----------------------------------- |
| `isClicked`       | is the button clicked currently |

---

## APIs

### `setButtonTexture()`

Equal to the [`setBackground`](index.md#setbackground).

<DocTabs>
<DocTab title="Java / KubeJS">

``` java 
button.setButtonTexture(ResourceBorderTexture.BUTTON_COMMON, new TextTexture("Button"));
```

</DocTab>
</DocTabs>

---

### `setClickedTexture()`

Remove child widget from it.

<DocTabs>
<DocTab title="Java / KubeJS">

``` java 
button.setClickedTexture(ResourceBorderTexture.BUTTON_COMMON, new TextTexture("Clicked"));
```

</DocTab>
</DocTabs>

---

### `setOnPressCallback()`

Used to bind functional logic.

`ClickData` provides mouse state information:

1. `clickData.button`: mouse button id number.

    | button       | Description                          |
    | :---------- | :----------------------------------- |
    | `0`       | left button |
    | `1`       | right button |
    | `2`       | middle button |

2. `clickData.isShiftClick`: is the shift key typed.
3. `clickData.isCtrlClick`: is the ctrl key typed.
3. `clickData.isRemote`: is the remote enverionment.

<DocTabs>
<DocTab title="Java">

``` java 
button.setOnPressCallback(clickData -> {
    if (clickData.isRemote) { // can be used to check trigger side

    }
});
```

</DocTab>
<DocTab title="KubeJS">

``` javascript 
button.setOnPressCallback(clickData => {
    if (clickData.isRemote) { // can be used to check trigger side

    }
});
```

</DocTab>
</DocTabs>

---
