# Button

{{ version_badge("2.2.1", label="Since", icon="tag") }}

`Button` is a clickable UI component with a built-in text label, state-reactive textures (normal / hover / pressed), and optional leading or trailing icon decorations.

Internally, `Button` is a horizontal flex row that owns a single **internal** [`TextElement`](#text) as its label. Because it is a regular `UIElement` container, you can add extra children alongside the label — most commonly via [`addPreIcon`](#icon-decorations) and [`addPostIcon`](#icon-decorations).

!!! note ""
    Everything documented on [UIElement](element.md){ data-preview } (layout, styles, events, data bindings, etc.) applies here too.

---

## Usage

=== "Java"

    ```java
    var button = new Button();
    button.setText("my.button.label", true); // translated label
    button.setOnClick(event -> {
        // runs on the client when left-clicked
    });
    button.setOnServerClick(event -> {
        // runs on the server when left-clicked
    });
    parent.addChild(button);
    ```

=== "Kotlin"

    ```kotlin
    button({
        text("my.button.label")
        onClick = { event -> /* client-side */ }
        onServerClick = { event -> /* server-side */ }
    }) {
        // add extra children if needed
    }
    ```

=== "KubeJS"

    ```js
    let button = new Button();
    button.setText(Component.literal("Click me"));   // literal
    button.setText("my.key", true);                  // translated
    button.setOnClick(e => {
        // client-side click handler
    });
    parent.addChild(button);
    ```

---

## XML

```xml
<!-- Simple button with a translated label -->
<button text="my.button.label"/>

<!-- Empty text attribute hides the label (calls noText()) -->
<button text=""/>

<!-- Style the internal TextElement -->
<button text="my.button.label">
    <internal index="0">
        <!-- TextElement attributes / children go here -->
    </internal>
</button>
```

| XML Attribute | Type | Description |
| ------------- | ---- | ----------- |
| `text` | `string` | Sets the label text. Pass an empty string to hide the text element. |

---

## Internal Structure

Button contains one internal element owned by the component:

| Index | Type | CSS selector | Description |
| ----- | ---- | ------------ | ----------- |
| `0` | `TextElement` | `button > text:internal` | The label text element |

Because the label is **internal**, it cannot be repositioned or removed through normal child manipulation. You can still target it with LSS selectors:

```css
/* Targets only the button's own text, not any text you add as a child */
button > text:internal {
    font-size: 10;
    text-color: #FFFFFF;
}
```

---

## Text

### `setText` / `noText` / `enableText`

Controls the label text displayed inside the button.

=== "Java"

    ```java
    button.setText("my.translation.key", true);  // translated
    button.setText("Literal label", false);       // literal
    button.noText();                              // hide the label
    button.enableText();                          // show it again
    ```

=== "Kotlin"

    ```kotlin
    button({
        text("my.translation.key")   // translated (default)
        // or assign a Component directly:
        // text = Component.literal("Literal label")
        noText()                     // hides the text element
    }) { }
    ```

=== "KubeJS"

    ```js
    button.setText(Component.literal("Literal label"));
    button.setText("my.key", true);   // translated
    button.noText();
    button.enableText();
    ```

### `textStyle`

Fluently configure the internal `TextElement`'s text rendering:

=== "Java"

    ```java
    button.textStyle(style -> style
        .textColor(0xFFFFFF)
        .fontSize(9)
        .textShadow(true)
    );
    ```

=== "Kotlin"

    ```kotlin
    // Access the internal TextElement directly after build
    button.text.textStyle {
        textColor(0xFFFFFF)
        fontSize(9f)
        textShadow(true)
    }
    ```

=== "KubeJS"

    ```js
    button.textStyle(style => style
        .textColor(0xFFFFFF)
        .fontSize(9)
        .textShadow(true)
    );
    ```

---

## Icon Decorations

Add a texture icon before or after the label. Each icon is sized to match the button height and maintains its aspect ratio.

=== "Java"

    ```java
    button.addPreIcon(Sprites.ICON_WRENCH);    // icon before text
    button.addPostIcon(Sprites.ICON_WRENCH);   // icon after text
    ```

=== "Kotlin"

    ```kotlin
    button.addPreIcon(Sprites.ICON_WRENCH)
    button.addPostIcon(Sprites.ICON_WRENCH)
    ```

=== "KubeJS"

    ```js
    button.addPreIcon(Sprites.ICON_WRENCH);
    button.addPostIcon(Sprites.ICON_WRENCH);
    ```

To create an icon-only button, call `noText()` together with `addPreIcon`:

=== "Java"

    ```java
    new Button()
        .noText()
        .addPreIcon(myIcon)
        .layout(l -> l.size(14));
    ```

=== "Kotlin"

    ```kotlin
    button({ noText(); buttonStyle = { /* ... */ } }) {
        api { addPreIcon(myIcon) }
    }
    ```

---

## Button Style

`ButtonStyle` holds three state-dependent background textures. The active texture changes automatically based on the current [interaction state](#state).

!!! info ""
    #### <p style="font-size: 1rem;">base-background</p>

    The texture rendered in the `DEFAULT` (idle) state, and also when the button is inactive (`isActive = false`).

    Default: `Sprites.RECT_RD`

    === "Java"

        ```java
        button.buttonStyle(style -> style.baseTexture(myTexture));
        // or:
        button.getButtonStyle().baseTexture(myTexture);
        ```

    === "Kotlin"

        ```kotlin
        button({ buttonStyle = { baseTexture(myTexture) } }) { }
        // or after build:
        button.buttonStyleDsl { baseTexture(myTexture) }
        ```

    === "LSS"

        ```css
        button {
            base-background: rect(#4a4a4a, 2);
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">hover-background</p>

    The texture rendered in the `HOVERED` state.

    Default: `Sprites.RECT_RD_LIGHT`

    === "Java"

        ```java
        button.buttonStyle(style -> style.hoverTexture(myTexture));
        ```

    === "Kotlin"

        ```kotlin
        button({ buttonStyle = { hoverTexture(myTexture) } }) { }
        ```

    === "LSS"

        ```css
        button {
            hover-background: rect(#5a5a5a, 2);
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">pressed-background</p>

    The texture rendered in the `PRESSED` state (while the mouse button is held down).

    Default: `Sprites.RECT_RD_DARK`

    === "Java"

        ```java
        button.buttonStyle(style -> style.pressedTexture(myTexture));
        ```

    === "Kotlin"

        ```kotlin
        button({ buttonStyle = { pressedTexture(myTexture) } }) { }
        ```

    === "LSS"

        ```css
        button {
            pressed-background: rect(#3a3a3a, 2);
        }
        ```

---

## Events & Click Handlers

Button provides two convenience setters on top of the standard event system from `UIElement`:

| Method | Side | Trigger |
| ------ | ---- | ------- |
| `setOnClick(UIEventListener)` | Client | `MOUSE_DOWN` with left button (button 0) |
| `setOnServerClick(UIEventListener)` | Server | `MOUSE_DOWN` with left button (button 0) |

=== "Java"

    ```java
    button.setOnClick(event -> {
        // called on the client immediately on mouse-down
        System.out.println("clicked on client");
    });

    button.setOnServerClick(event -> {
        // called on the server when the player clicks
        player.sendSystemMessage(Component.literal("clicked!"));
    });
    ```

=== "Kotlin"

    ```kotlin
    // Via ButtonSpec (recommended)
    button({
        onClick = { event -> /* client-side */ }
        onServerClick = { event -> /* server-side */ }
    }) { }

    // Or via standard events block
    button {
        events {
            UIEvents.MOUSE_DOWN += { event ->
                if (event.button == 0) { /* ... */ }
            }
        }
        serverEvents {
            UIEvents.MOUSE_DOWN += { event -> /* ... */ }
        }
    }
    ```

=== "KubeJS"

    ```js
    button.setOnClick(e => {
        console.log("clicked on client");
    });
    // Server-side via event listener:
    button.addServerEventListener(UIEvents.MOUSE_DOWN, e => {
        // runs on server
    });
    ```

!!! note ""
    `setOnClick` fires only for **left** mouse button clicks (`event.button == 0`). For other mouse buttons, use `addEventListener(UIEvents.MOUSE_DOWN, ...)` directly.

---

## State

Button tracks its current visual state automatically:

| State | Condition |
| ----- | --------- |
| `DEFAULT` | No interaction |
| `HOVERED` | Mouse is over the button |
| `PRESSED` | Left mouse button held down |

When `isActive` is `false`, the button is always rendered with `base-background` and ignores mouse input.

You can read the current state in Java / Kotlin via `button.getState()`. You cannot set it externally — it is managed internally by the component's built-in event listeners.

---

## Fields

> Fields specific to `Button`. See [UIElement § Fields](element.md#fields){ data-preview } for the base fields.

| Name | Type | Access | Description |
| ---- | ---- | ------ | ----------- |
| `text` | `TextElement` | `public final` | The internal label element. Access directly to change text style or content. |
| `buttonStyle` | `ButtonStyle` | `private` (getter) | Holds the three state textures. |
| `state` | `Button.State` | `private` (getter) | Current visual state (`DEFAULT` / `HOVERED` / `PRESSED`). |

---

## Methods

> Methods specific to `Button`. See [UIElement § Methods](element.md#methods){ data-preview } for the full base API.

| Method | Returns | Description |
| ------ | ------- | ----------- |
| `setText(String, boolean)` | `Button` | Sets label text. `true` = translatable, `false` = literal. |
| `noText()` | `Button` | Hides the internal `TextElement`. |
| `enableText()` | `Button` | Shows the internal `TextElement` again. |
| `textStyle(Consumer<TextStyle>)` | `Button` | Configures the internal text style fluently. |
| `addPreIcon(IGuiTexture)` | `Button` | Inserts a square icon element before the text. |
| `addPostIcon(IGuiTexture)` | `Button` | Appends a square icon element after the text. |
| `buttonStyle(Consumer<ButtonStyle>)` | `Button` | Configures `ButtonStyle` fluently. |
| `getButtonStyle()` | `ButtonStyle` | Returns the `ButtonStyle` instance directly. |
| `setOnClick(UIEventListener)` | `Button` | Sets the client-side click handler (replaces previous). |
| `setOnServerClick(UIEventListener)` | `Button` | Adds a server-side click listener. |
| `getState()` | `Button.State` | Returns the current interaction state. |
