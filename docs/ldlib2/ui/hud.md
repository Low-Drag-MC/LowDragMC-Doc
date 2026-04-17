# HUD Overlays

{{ version_badge("2.2.1", label="Since", icon="tag") }}

LDLib2 lets you render a full `ModularUI` as a HUD layer using the `ModularHudLayer` interface. The UI fills the entire screen, auto-resizes on window resize, and ticks every frame.

---

## `ModularHudLayer`

`ModularHudLayer` is a `@FunctionalInterface` that extends NeoForge's `LayeredDraw.Layer`. Implementing it requires only one method:

```java
@Nullable ModularUI getModularUI();
```

The default `render` implementation calls `getModularUI()` each frame, validates/re-initialises the `ModularUI` whenever the window is resized, and then renders it at full screen size.

---

## Registering a HUD layer

Subscribe to `RegisterGuiLayersEvent` on the **client mod event bus** and register your layer. Use `Suppliers.memoize` to defer UI construction until first render — resources and the world are not yet available at mod init time.

```java
@OnlyIn(Dist.CLIENT)
@EventBusSubscriber(modid = MyMod.MOD_ID, bus = EventBusSubscriber.Bus.MOD, value = Dist.CLIENT)
public class MyClientEvents {

    @SubscribeEvent
    public static void onRegisterGuiLayers(RegisterGuiLayersEvent event) {
        // Delay construction — resources are not ready at registration time
        var muiCache = Suppliers.memoize(() -> ModularUI.of(UI.of(
            buildHudRoot()
        )));

        // registerAboveAll  — rendered on top of all vanilla HUD elements
        // registerAboveAll  / registerBelow(id, ...) for fine-grained ordering
        event.registerAboveAll(MyMod.id("my_hud"), (ModularHudLayer) muiCache::get);
    }

    private static UIElement buildHudRoot() {
        return new UIElement()
            .layout(l -> l.widthPercent(100).heightPercent(100).paddingAll(10));
    }
}
```

!!! warning "Do not build the UI eagerly"
    Stylesheets, sprites, and world state are **not available** when `RegisterGuiLayersEvent` fires.
    Always wrap creation in `Suppliers.memoize(...)` or an equivalent lazy supplier so the `ModularUI` is built on the first render tick, not at registration time.

---

## Sizing and layout

The `ModularUI` is initialised (and re-initialised on resize) to the **full window width × height**. Use percent-based sizes and padding to position your HUD elements:

```java
new UIElement()
    .layout(l -> l
        .widthPercent(100)
        .heightPercent(100)
        .paddingAll(10)    // 10 px inset from each edge
        .gapAll(4)         // gap between children
    )
    .addChildren(
        // top-left icon
        new UIElement()
            .layout(l -> l.width(50).height(50))
            .style(s -> s.background(Sprites.BORDER1_RT1))
            .addChild(new UIElement()
                .layout(l -> l.widthPercent(100).heightPercent(100))
                .style(s -> s.background(new ItemStackTexture(Items.DIAMOND)))
            ),

        // health bar bound to the local player
        new ProgressBar()
            .bindDataSource(SupplierDataSource.of(() ->
                Optional.ofNullable(Minecraft.getInstance().player)
                    .map(p -> p.getHealth() / p.getMaxHealth())
                    .orElse(1f)
            ))
            .label(l -> l.setText("health"))
            .layout(l -> l.width(100))
    );
```

For absolute positioning (e.g. pinning to a corner), use `position: absolute` in LSS or `.positionAbsolute()` in the layout builder with explicit `left`/`top`/`right`/`bottom` offsets.

---

## Layer ordering

`RegisterGuiLayersEvent` mirrors NeoForge's `LayeredDraw` API:

| Method | Description |
| ------ | ----------- |
| `registerAboveAll(id, layer)` | Rendered above every vanilla HUD element. |
| `registerBelowAll(id, layer)` | Rendered below every vanilla HUD element. |
| `registerAbove(existingId, id, layer)` | Rendered immediately above a specific vanilla layer. |
| `registerBelow(existingId, id, layer)` | Rendered immediately below a specific vanilla layer. |

Vanilla layer IDs are found in `VanillaGuiLayers` (e.g. `VanillaGuiLayers.CROSSHAIR`, `VanillaGuiLayers.HOTBAR`).
