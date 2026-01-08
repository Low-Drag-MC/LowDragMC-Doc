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

| LSS Name | Property Type | Code Usage | Description |
|---------|---------------|------------|-------------|
| `display` | `YogaDisplay` | `layout.display(FLEX)` | Controls whether the element participates in layout. `FLEX` enables normal layout, `NONE` removes the element from layout calculation. |
| `layout-direction` | `YogaDirection` | `layout.layoutDirection(LTR)` | Sets the layout direction. Usually inherited from parent. |
| `flex-basis` | `StyleSizeLength` | `layout.flexBasis(100)` | Sets the initial main size before flex grow/shrink. Supports **point**, **percent**, and **auto**. |
| `flex` | `FloatOptional` | `layout.flex(1)` | Makes the element flexible along the main axis. |
| `flex-grow` | `FloatOptional` | `layout.flexGrow(1)` | Controls how much the element grows when extra space is available. |
| `flex-shrink` | `FloatOptional` | `layout.flexShrink(1)` | Controls how much the element shrinks when space is insufficient. |
| `flex-direction` | `YogaFlexDirection` | `layout.flexDirection(ROW)` | Defines the main axis direction, e.g. `ROW` or `COLUMN`. |
| `flex-wrap` | `YogaWrap` | `layout.flexWrap(WRAP)` | Controls whether children wrap into multiple lines. |
| `position` | `YogaPositionType` | `layout.position(ABSOLUTE)` | Sets positioning mode. `RELATIVE` participates in layout, `ABSOLUTE` does not affect siblings. |
| `top / right / bottom / left` | `StyleLength` | `layout.top(10)` | Offsets used when `position` is `RELATIVE` or `ABSOLUTE`. |
| `margin-*` | `StyleLength` | `layout.marginTop(5)` | Sets outer spacing around the element. |
| `padding-*` | `StyleLength` | `layout.paddingLeft(8)` | Sets inner spacing between border and content. |
| `gap-*` | `StyleLength` | `layout.rowGap(6)` | Sets spacing between children in flex layouts. |
| `width` | `StyleSizeLength` | `layout.width(100)` | Sets element width. Supports **point**, **percent**, and **auto** modes. |
| `height` | `StyleSizeLength` | `layout.height(50)` | Sets element height. Supports **point**, **percent**, and **auto** modes. |
| `min-width / min-height` | `StyleSizeLength` | `layout.minWidth(20)` | Sets the minimum size constraint. |
| `max-width / max-height` | `StyleSizeLength` | `layout.maxHeight(200)` | Sets the maximum size constraint. |
| `aspect-rate` | `FloatOptional` | `layout.aspectRate(1)` | Locks width–height ratio. Useful for square or icon elements. |
| `overflow` | `YogaOverflow` | `layout.overflow(HIDDEN)` | Controls how overflowing content is handled. |
| `align-items` | `YogaAlign` | `layout.alignItems(CENTER)` | Aligns children along the cross axis (container property). |
| `justify-content` | `YogaJustify` | `layout.justifyContent(CENTER)` | Aligns children along the main axis (container property). |
| `align-self` | `YogaAlign` | `layout.alignSelf(CENTER)` | Overrides cross-axis alignment for a single element. |
| `align-content` | `YogaAlign` | `layout.alignContent(CENTER)` | Aligns wrapped lines when `flex-wrap` is enabled. |


---

## Xml

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

---

### Focus & Interaction

| Method           | Signature     | Description                                          |
| ---------------- | ------------- | ---------------------------------------------------- |
| `focus()`        | `void`        | Requests focus for this element.                     |
| `blur()`         | `void`        | Clears focus if this element is focused.             |
| `isFocused()`    | `boolean`     | Returns true if this element is focused.             |
| `isHover()`      | `boolean`     | Returns true if mouse is directly over this element. |
| `isChildHover()` | `boolean`     | Returns true if a child is hovered.                  |
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
