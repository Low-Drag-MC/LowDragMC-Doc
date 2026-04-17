# HUD 覆盖层

{{ version_badge("2.2.1", label="Since", icon="tag") }}

LDLib2 允许你使用 `ModularHudLayer` 接口将完整的 `ModularUI` 渲染为 HUD 层。UI 会填充整个屏幕，在窗口大小改变时自动调整，并且每帧都会进行 tick 更新。

---

## `ModularHudLayer`

`ModularHudLayer` 是一个 `@FunctionalInterface`，继承自 NeoForge 的 `LayeredDraw.Layer`。实现它只需要一个方法：

```java
@Nullable ModularUI getModularUI();
```

默认的 `render` 实现会在每帧调用 `getModularUI()`，在窗口大小改变时验证/重新初始化 `ModularUI`，然后以全屏尺寸渲染它。

---

## 注册 HUD 层

在**客户端 mod 事件总线**上订阅 `RegisterGuiLayersEvent` 并注册你的层。使用 `Suppliers.memoize` 来延迟 UI 构建直到首次渲染——资源和世界在 mod 初始化时尚不可用。

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

!!! warning "不要急切地构建 UI"
    当 `RegisterGuiLayersEvent` 触发时，样式表、精灵图和世界状态都**不可用**。
    始终将创建包装在 `Suppliers.memoize(...)` 或等效的延迟供应器中，以便 `ModularUI` 在首次渲染 tick 时构建，而不是在注册时。

---

## 尺寸和布局

`ModularUI` 以**完整的窗口宽度 × 高度**进行初始化（并在调整大小时重新初始化）。使用基于百分比的尺寸和内边距来定位你的 HUD 元素：

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

对于绝对定位（例如固定到角落），在 LSS 中使用 `position: absolute` 或在布局构建器中使用 `.positionAbsolute()` 并配合显式的 `left`/`top`/`right`/`bottom` 偏移值。

---

## 层级顺序

`RegisterGuiLayersEvent` 对应 NeoForge 的 `LayeredDraw` API：

| 方法 | 描述 |
| ------ | ----------- |
| `registerAboveAll(id, layer)` | 在所有原版 HUD 元素之上渲染。 |
| `registerBelowAll(id, layer)` | 在所有原版 HUD 元素之下渲染。 |
| `registerAbove(existingId, id, layer)` | 在特定原版层之上紧邻渲染。 |
| `registerBelow(existingId, id, layer)` | 在特定原版层之下紧邻渲染。 |

原版层 ID 可在 `VanillaGuiLayers` 中找到（例如 `VanillaGuiLayers.CROSSHAIR`、`VanillaGuiLayers.HOTBAR`）。
