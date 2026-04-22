# KubeJS Integration

{{ version_badge("2.2.1", label="Since", icon="tag") }}

LDLib2 exposes its full UI system to KubeJS scripts — no Java or Kotlin required. You can open UIs, build element trees, apply stylesheets, and wire up data bindings entirely from `.js` files.

---

## Opening a UI

The primary entry point is the **`LDLib2UI`** event group and the **`LDLib2UIFactory`** bindings. Three factory types cover the most common triggers:

| Event | Factory helper | Use when |
| ----- | -------------- | -------- |
| `LDLib2UI.block(id, handler)` | `LDLib2UIFactory.openBlockUI(player, pos, id)` | Right-clicking a block |
| `LDLib2UI.item(id, handler)` | `LDLib2UIFactory.openHeldItemUI(player, hand, id)` | Right-clicking with an item |
| `LDLib2UI.player(id, handler)` | `LDLib2UIFactory.openPlayerUI(player, id)` | Commands, keybinds, any trigger |

Full usage, context fields, and script placement rules are documented on the **[UI Factory](factory.md)** page.

---

## Building UIs in KubeJS

Inside a `LDLib2UI.*` handler, all UI classes are available directly by name — no imports needed:

```javascript
LDLib2UI.block("mymod:example", event => {
    event.modularUI = ModularUI.of(UI.of(
        new UIElement()
            .addClass("panel_bg")
            .addChildren(
                new Label().setText("Hello from KubeJS"),
                new Button().setText("Click me").setOnClick(e => {
                    // server-side logic here
                })
            )
    ), event.player);
});
```

Browse the available components, textures, and preliminary concepts:

- **[UIElement & layout](preliminary/layout.md)** — flex/absolute layout, size, padding, margin
- **[Stylesheet (LSS)](preliminary/stylesheet.md)** — CSS-like styling for all elements
- **[Data bindings](preliminary/data_bindings.md)** — reactive value wiring
- **[Components](components/element.md)** — all built-in elements (`Label`, `Button`, `ItemSlot`, `Scene`, …)
- **[Textures](textures/index.md)** — `ColorRectTexture`, `SpriteTexture`, `SDFRectTexture`, …
- **[XEI integration](xei_support.md)** — JEI / REI / EMI slot and ingredient wiring

---

## Binding Availability

`@KJSBindings` marks which classes and methods are exposed. Classes annotated with `modId` (e.g. `@KJSBindings(modId = "jei")`) are only available when that mod is loaded. All core UI classes have no mod restriction.
