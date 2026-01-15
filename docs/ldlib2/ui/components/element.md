# UIElement

{{ version_badge("2.1.0", label="Since", icon="tag") }}

`UIElement` is the most fundamental and commonly used UI component in LDLib2.
All UI components inherit from it.

Conceptually, it is similar to the `#!html <div/>` element in HTML: a general-purpose container that can be styled, laid out, and extended with behaviors.

Because of that, everything introduced in this page also applies to all other UI components in LDLib2—so please make sure to read it carefully.

---

## Usages

=== "Java"

    ```java
    var element = new UIElement();
    element.style(style -> style.background(MCSprites.RECT));
    element.layout(layout -> layout.width(40).height(40));
    element.setFocusable(true)
    element.addEventListener(UIEvents.MOUSE_DOWN, e -> e.currentElement.focus());
    root.addChild(element);
    ```

=== "KubeJS"

    ```js
    let element = new UIElement();
    element.style(style => style.background(MCSprites.RECT));
    element.layout(layout => layout.width(40).height(40));
    element.setFocusable(true)
    element.addEventListener(UIEvents.MOUSE_DOWN, e => e.currentElement.focus());
    root.addChild(element);
    ```
---

## Xml
```xml
<element id="my_id" class="class1 class2" focusable="false" visible="true" active="true" style="background: #fff; width: 50">
    <!-- add children here -->
    <button text="click me!"/>
    <inventory-slots/>
</element>
```

---

## Styles

!!! note "Layout"
    layout attributes are actually styles as well.

UIElement styles (include layouts) can be accessed as below:
=== "Java"

    ```java
    element.style(style -> style.background(...));
    element.layout(layout -> layout.width(...));
    element.getStyle().background(...);
    element.getLayout().width(...);
    ```

=== "KubeJS"

    ```js
    element.style(style -=> style.background(...));
    element.layout(layout => layout.width(...));
    element.getStyle().background(...);
    element.getLayout().width(...);
    ```
### Layout Properties

You'd better read [Layout](../preliminary/layout.md){ data-preview } before using.

!!! info ""
    #### <p style="font-size: 1rem;">display</p>

    Controls whether the element participates in layout. `FLEX` enables normal layout, `NONE` removes the element from layout calculation. `CONTENTS` doesn't affect layout but render its children.

    === "Java"

        ```java
        layout.display(YogaDisplay.FLEX);
        element.setDisplay(false); // equals to layout.display(YogaDisplay.NONE);
        ```

    === "LSS"

        ```css
        element {
            display: flex;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">layout-direction</p>

    Sets the layout direction. Usually inherited from parent.

    === "Java"

        ```java
        layout.layoutDirection(YogaDirection.LTR);
        ```

    === "LSS"

        ```css
        element {
            layout-direction: ltr;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">flex-basis</p>

    Sets the initial main size before flex grow/shrink. Supports **point**, **percent**, and **auto**.

    === "Java"

        ```java
        layout.flexBasis(1);
        ```

    === "LSS"

        ```css
        element {
            flex-basis: 1;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">flex</p>

    Makes the element flexible along the main axis.

    === "Java"

        ```java
        layout.flex(1);
        ```

    === "LSS"

        ```css
        element {
            flex: 1;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">flex-grow</p>

    Controls how much the element grows when extra space is available.

    === "Java"

        ```java
        layout.flexGrow(1);
        ```

    === "LSS"

        ```css
        element {
            flex-grow: 1;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">flex-shrink</p>

    Controls how much the element shrinks when space is insufficient.

    === "Java"

        ```java
        layout.flexShrink(1);
        ```

    === "LSS"

        ```css
        element {
            flex-shrink: 1;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">flex-direction</p>

    Defines the main axis direction, e.g. `ROW` or `COLUMN`.

    === "Java"

        ```java
        layout.flexDirection(YogaFlexDirection.ROW);
        ```

    === "LSS"

        ```css
        element {
            flex-direction: row;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">flex-wrap</p>

    Controls whether children wrap into multiple lines.

    === "Java"

        ```java
        layout.flexWrap(YogaWrap.WRAP);
        ```

    === "LSS"

        ```css
        element {
            flex-wrap: wrap;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">position</p>

    Sets positioning mode. `RELATIVE` participates in layout, `ABSOLUTE` does not affect siblings.

    === "Java"

        ```java
        layout.position(YogaPositionType.ABSOLUTE);
        ```

    === "LSS"

        ```css
        element {
            position: absolute;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">top / right / bottom / left / start / end / horizontal / vertical / all</p>

    Offsets used when `position` is `RELATIVE` or `ABSOLUTE`.

    === "Java"

        ```java
        layout.top(10);
        layout.leftPercent(30); // 30%
        layout.allAuto()
        ```

    === "LSS"

        ```css
        element {
            top: 10;
            left: 30%;
            all: auto;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">margin-*</p> 
    
    `*`: top / right / bottom / left / start / end / horizontal / vertical / all

    Sets outer spacing around the element.

    === "Java"

        ```java
        layout.marginTop(5);
        layout.marginAll(3);
        ```

    === "LSS"

        ```css
        element {
            margin-top: 5;
            margin-all: 3;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">padding-*</p>

    `*`: top / right / bottom / left / start / end / horizontal / vertical / all

    Sets inner spacing between border and content.

    === "Java"

        ```java
        layout.paddingLeft(8);
        ```

    === "LSS"

        ```css
        element {
            padding-left: 8;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">gap-*</p>

    `*`: top / right / bottom / left / start / end / horizontal / vertical / all

    Sets spacing between children in flex layouts.

    === "Java"

        ```java
        layout.rowGap(6);
        ```

    === "LSS"

        ```css
        element {
            row-gap: 6;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">width</p>

    Sets element width. Supports **point**, **percent**, and **auto** modes.

    === "Java"

        ```java
        layout.width(100);
        layout.widthPercent(20); // 20%
        ```

    === "LSS"

        ```css
        element {
            width: 100;
            width: 20%;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">height</p>

    Sets element height. Supports **point**, **percent**, and **auto** modes.

    === "Java"

        ```java
        layout.height(50);
        ```

    === "LSS"

        ```css
        element {
            height: 50;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">min-width / min-height</p>

    Sets the minimum size constraint.

    === "Java"

        ```java
        layout.minWidth(20);
        ```

    === "LSS"

        ```css
        element {
            min-width: 20;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">max-width / max-height</p>

    Sets the maximum size constraint.

    === "Java"

        ```java
        layout.maxHeight(200);
        ```

    === "LSS"

        ```css
        element {
            max-height: 200;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">aspect-rate</p>

    Locks width–height ratio. Useful for square or icon elements.

    === "Java"

        ```java
        layout.aspectRate(1);
        ```

    === "LSS"

        ```css
        element {
            aspect-rate: 1;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">overflow</p>

    Controls how overflowing content is handled. If 'hidden', the content beyond the boundary will be hidden.

    === "Java"

        ```java
        layout.overflow(YogaOverflow.HIDDEN);
        element.setOverflowVisible(false); // equals to layout.overflow(YogaOverflow.HIDDEN);
        ```

    === "LSS"

        ```css
        element {
            overflow: hidden;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">align-items</p>

    Aligns children along the cross axis (container property).

    === "Java"

        ```java
        layout.alignItems(YogaAlign.CENTER);
        ```

    === "LSS"

        ```css
        element {
            align-items: center;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">justify-content</p>

    Aligns children along the main axis (container property).

    === "Java"

        ```java
        layout.justifyContent(YogaJustify.CENTER);
        ```

    === "LSS"

        ```css
        element {
            justify-content: center;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">align-self</p>

    Overrides cross-axis alignment for a single element.

    === "Java"

        ```java
        layout.alignSelf(YogaAlign.CENTER);
        ```

    === "LSS"

        ```css
        element {
            align-self: center;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">align-content</p>

    Aligns wrapped lines when `flex-wrap` is enabled.

    === "Java"

        ```java
        layout.alignContent(YogaAlign.CENTER);
        ```

    === "LSS"

        ```css
        element {
            align-content: center;
        }
        ```

---

### Basic Properties

!!! info ""
    #### <p style="font-size: 1rem;">background</p>

    Sets the background rendering of below the element, such as color, rect, image.


    === "Java"

        ```java
        layout.background(MCSprites.BORDER);
        ```

    === "LSS"
        Check [Texture in LSS](../textures/lss.md) for lss supports.

        ```css
        element {
            background: #FFF;
            background: rect(#2ff, 3);
            background: sprite(ldlib2:textures/gui/icon.png);
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">overlay</p>

    Controls overlay rendering drawn above the element content.

    === "Java"

        ```java
        layout.overlay(...);
        ```

    === "LSS"
        Check [Texture in LSS](../textures/lss.md) for lss supports.

        ```css
        element {
            overlay: #FFF;
            overlay: rect(#2ff, 3);
            overlay: sprite(ldlib2:textures/gui/icon.png);
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">tooltips</p>

    Defines tooltip content displayed when hovering the element.

    === "Java"

        ```java
        layout.tooltips("tips.0"， "tips.1");
        layout.appendTooltips("tips.2");
        ```

    === "LSS"

        ```css
        element {
            tooltips: this is my tooltips;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">z-index</p>

    Controls the stacking order of the element. Higher values appear above lower ones.

    === "Java"

        ```java
        layout.zIndex(1);
        ```

    === "LSS"

        ```css
        element {
            z-index: 1;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">opacity</p>

    Sets the transparency level of the element. `0` is fully transparent, `1` is fully opaque.

    === "Java"

        ```java
        layout.opacity(0.8f);
        ```

    === "LSS"

        ```css
        element {
            opacity: 0.8;
        }
        ```


!!! info ""
    #### <p style="font-size: 1rem;">overflow-clip</p>

    If element's overflow is set `hidden`, clips elements rendering based on given texture's red channel. 

    <div style="text-align: center;">
        <video controls>
        <source src="../../assets/overflow-clip.mp4" type="video/mp4">
        Your browser does not support video.
        </video>
    </div>

    === "Java"

        ```java
        layout.overflowClip(true);
        ```

    === "LSS"
        Check [Texture in LSS](../textures/lss.md) for lss supports.

        ```css
        element {
            overflow-clip: sprite(ldlib2:textures/gui/icon.png);
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">transform-2d</p>

    Applies 2D transformations such as translate, scale, or rotate.

    === "Java"

        ```java
        layout.transform2D(Transform2D.identity().scale(0.5f));
        element.transform(transform -> transform.translate(10, 0))
        ```

    === "LSS"

        ```css
        element {
            transform: translate(10, 20) rotate(45) scale(2， 2) pivot(0.5, 0.5);
            transform: translateX(10) scale(0.5);
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">transition</p>

    Defines animated transitions between property changes.

    <div style="text-align: center;">
        <video controls>
        <source src="../../assets/transition.mp4" type="video/mp4">
        Your browser does not support video.
        </video>
    </div>

    === "Java"

        ```java
        layout.transition(new Transition(Map.of(YogaProperties.HEIGHT, new Animation(1, 0, Eases.LINEAR))));
        ```

    === "LSS"

        ```css
        element {
            transition: width 1;
            transition: background 0.8 quad_in_out,
                        transform 0.3;
        }
        ```


---
## States

### `isVisible`
When `isVisible` is set to `false`, the element and all of its children will no longer be rendered.  
Unlike `display: NONE`, this does **not** affect layout calculation.  
Elements with `isVisible = false` are also excluded from hit-testing, so many UI events (such as clicks) will not be triggered.

### `isActive`
When `isActive` is set to `false`, the element may lose its interactive behavior—for example, buttons can no longer be clicked—and the element will no longer receive `tick` events.

!!! note
    When `isActive` is set to `false`, a `__disabled__` class is automatically added to the element.  
    You can use the following LSS selectors to style active and inactive states:

    ```css
    selector.__disabled__ {
    }

    selector:not(.__disabled__) {
    }
    ```

### `focusable`
Elements are `focusable: false` by default. Some components, such as `TextField`, are focusable by design, but you can still manually change an element’s focusable state.  
Only when `focusable` is set to `true` can an element be focused via `focus()` or by mouse interaction.

!!! note
    When an element is in the `focused` state, a `__focused__` class is automatically added.  
    You can style focused and unfocused states using the following LSS selectors:

    ```css
    selector.__focused__ {
    }

    selector:not(.__focused__) {
    }
    ```

### `isInternalUI`
This is a special state that indicates whether an element is an internal part of a component.  
For example, a `button` contains an internal `text` element used for rendering its label.

Semantically, internal elements are not allowed to be added, removed, or reordered directly.  
However, you can still edit their styles and manage their child elements via the editor or XML.  
In the editor, internal elements are displayed in gray in the hierarchy view.

In XML, you can access internal elements using the `#!xml <internal index="..."/>` tag, where `index` specifies which internal element to reference:

```xml
<button>
    <!-- obtain the internal text component here -->
    <internal index="0">
    </internal>
</button>
```
!!! note ""
    In LSS, you can use :host and :internal to explicitly target host or internal elements. By default, selectors match both unless constrained.
    ```css
    button > text {
    }

    button > text:internal {
    }

    button > text:host {
    }
    ```
---

## Fields

> Only public or protected fields that are externally observable or configurable are listed.

| Name           | Type          | Access                  | Description                                              |
| -------------- | ------------- | ----------------------- | -------------------------------------------------------- |
| `layoutNode`   | `YogaNode`    | protected (getter)      | Underlying Yoga node used for layout calculation.        |
| `modularUI`    | `ModularUI`   | private (getter)        | The `ModularUI` instance this element belongs to.        |
| `id`           | `String`      | private (getter/setter) | Element ID, used by selectors and queries.               |
| `classes`      | `Set<String>` | private (getter)        | CSS-like class list applied to this element.             |
| `styleBag`     | `StyleBag`    | private (getter)        | Stores resolved style candidates and computed styles.    |
| `styles`       | `List<Style>` | private (getter)        | Inline styles attached to this element.                  |
| `layoutStyle`  | `LayoutStyle` | private (getter)        | Layout-related style wrapper (Yoga-based).               |
| `style`        | `BasicStyle`  | private (getter)        | Basic visual styles (background, opacity, zIndex, etc.). |
| `isVisible`    | `boolean`     | private (getter/setter) | Whether the element is visible.                          |
| `isActive`     | `boolean`     | private (getter/setter) | Whether the element participates in logic and events.    |
| `focusable`    | `boolean`     | private (getter/setter) | Whether the element can receive focus.                   |
| `isInternalUI` | `boolean`     | private (getter)        | Marks internal (component-owned) elements.               |

---

## Methods

### Layout & Geometry

| Method                        | Signature                                 | Description                                              |
| ----------------------------- | ----------------------------------------- | -------------------------------------------------------- |
| `getLayout()`                 | `LayoutStyle`                             | Returns the layout style controller.                     |
| `layout(...)`                 | `UIElement layout(Consumer<LayoutStyle>)` | Modify layout properties fluently.                       |
| `node(...)`                   | `UIElement node(Consumer<YogaNode>)`      | Directly modify the underlying Yoga node.                |
| `getPositionX()`              | `float`                                   | Absolute X position on screen.                           |
| `getPositionY()`              | `float`                                   | Absolute Y position on screen.                           |
| `getSizeWidth()`              | `float`                                   | Computed width of the element.                           |
| `getSizeHeight()`             | `float`                                   | Computed height of the element.                          |
| `getContentX()`               | `float`                                   | X position of content area (excluding border & padding). |
| `getContentY()`               | `float`                                   | Y position of content area.                              |
| `getContentWidth()`           | `float`                                   | Width of content area.                                   |
| `getContentHeight()`          | `float`                                   | Height of content area.                                  |
| `adaptPositionToScreen()`     | `void`                                    | Adjusts position to stay within screen bounds.           |
| `adaptPositionToElement(...)` | `void`                                    | Adjusts position to stay inside another element.         |

---

### Tree Structure

| Method               | Signature                             | Description                                       |
| -------------------- | ------------------------------------- | ------------------------------------------------- |
| `getParent()`        | `UIElement`                           | Returns parent element, or `null`.                |
| `getChildren()`      | `List<UIElement>`                     | Returns an unmodifiable list of children.         |
| `addChild(...)`      | `UIElement addChild(UIElement)`       | Adds a child element.                             |
| `addChildren(...)`   | `UIElement addChildren(UIElement...)` | Adds multiple children.                           |
| `removeChild(...)`   | `boolean removeChild(UIElement)`      | Removes a child element.                          |
| `removeSelf()`       | `boolean`                             | Removes this element from its parent.             |
| `clearAllChildren()` | `void`                                | Removes all children.                             |
| `isAncestorOf(...)`  | `boolean`                             | Checks if this element is an ancestor of another. |
| `getStructurePath()` | `ImmutableList<UIElement>`            | Path from root to this element.                   |

---

### Style & Classes

| Method             | Signature                                    | Description                                         |
| ------------------ | -------------------------------------------- | --------------------------------------------------- |
| `style(...)`       | `UIElement style(Consumer<BasicStyle>)`      | Modify inline visual styles.                        |
| `lss(...)`         | `UIElement lss(String, Object)`              | Apply a stylesheet-style property programmatically. |
| `addClass(...)`    | `UIElement addClass(String)`                 | Adds a CSS-like class.                              |
| `removeClass(...)` | `UIElement removeClass(String)`              | Removes a class.                                    |
| `hasClass(...)`    | `boolean`                                    | Checks if the class exists.                         |
| `transform(...)`   | `UIElement transform(Consumer<Transform2D>)` | Applies a 2D transform.                             |
| `animation()`      | `StyleAnimation`                             | Starts a style animation targeting this element.    |
| `animation(a -> {})`| `StyleAnimation`                            | Starts a style animation targeting this element. (always works, when the `ModularUI` valid)    |

---

### Focus & Interaction

| Method           | Signature     | Description                                          |
| ---------------- | ------------- | ---------------------------------------------------- |
| `focus()`        | `void`        | Requests focus for this element.                     |
| `blur()`         | `void`        | Clears focus if this element is focused.             |
| `isFocused()`    | `boolean`     | Returns true if this element is focused.             |
| `isHover()`      | `boolean`     | Returns true if mouse is directly over this element. |
| `isSelfOrChildHover()` | `boolean`     | Returns true if a slef or child is hovered.                  |
| `startDrag(...)` | `DragHandler` | Starts a drag operation.                             |

---

### Events

| Method                               | Signature                                                      | Description                              |
| ------------------------------------ | -------------------------------------------------------------- | ---------------------------------------- |
| `addEventListener(...)`              | `UIElement addEventListener(String, UIEventListener)`          | Registers a bubble-phase event listener. |
| `addEventListener(..., true)`        | `UIElement addEventListener(String, UIEventListener, boolean)` | Registers a capture-phase listener.      |
| `removeEventListener(...)`           | `void`                                                         | Removes an event listener.               |
| `stopInteractionEventsPropagation()` | `UIElement`                                                    | Stops mouse & drag event propagation.    |

---

### Client–Server Sync & RPC

| Method                     | Signature   | Description                                |
| -------------------------- | ----------- | ------------------------------------------ |
| `addSyncValue(...)`        | `UIElement` | Registers a synced value.                  |
| `removeSyncValue(...)`     | `UIElement` | Unregisters a synced value.                |
| `addRPCEvent(...)`         | `UIElement` | Registers an RPC event.                    |
| `sendEvent(...)`           | `void`      | Sends an RPC event to server.              |
| `sendEvent(..., callback)` | `<T> void`  | Sends an RPC event with response callback. |

---

### Rendering

| Method                       | Signature | Description                            |
| ---------------------------- | --------- | -------------------------------------- |
| `isDisplayed()`              | `boolean` | Returns true if display is not `NONE`. |
