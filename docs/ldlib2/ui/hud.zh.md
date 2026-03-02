# HUD 叠加
{{ version_badge("2.2.1", label="Since", icon="tag") }}
LDLib2 允许您使用 `ModularHudLayer` 接口将完整的 `ModularUI` 渲染为 HUD 层。 UI 填充整个屏幕，在窗口大小调整时自动调整大小，并勾选每一帧。
---

##`ModularHudLayer`
`ModularHudLayer`是`@FunctionalInterface`，扩展了NeoForge的`LayeredDraw.Layer`。实现它只需要一种方法：
```java
@Nullable ModularUI getModularUI();
```

默认的`render`实现每帧调用`getModularUI()`，每当调整窗口大小时验证/重新初始化`ModularUI`，然后以全屏尺寸渲染它。
---

## 注册HUD层
在**客户端 mod 事件总线**上订阅 `RegisterGuiLayersEvent` 并注册您的层。使用`Suppliers.memoize`将UI构建推迟到第一次渲染——资源和世界在mod初始化时还不可用。
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

!!!警告“不要急于构建 UI”当`RegisterGuiLayersEvent` 触发时，样式表、精灵和世界状态**不可用**。始终将创建包装在 `Suppliers.memoize(...)` 或等效的惰性供应商中，以便 `ModularUI` 构建在第一个渲染标记上，而不是在注册时构建。
---

## 尺寸和布局
`ModularUI` 被初始化（并在调整大小时重新初始化）为 **全窗口宽度 × 高度**。使用基于百分比的尺寸和填充来定位 HUD 元素：
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

对于绝对定位（例如固定到角落），请在 LSS 中使用 `position: absolute` 或在布局生成器中使用 `.positionAbsolute()` 并具有显式 `left`/`top`/`right`/`bottom` 偏移量。
---

## 层排序
`RegisterGuiLayersEvent` 镜像 NeoForge 的 `LayeredDraw` API：
| Method | Description |
| ------ | ----------- |
| `registerAboveAll(id, layer)` | Rendered above every vanilla HUD element. |
| `registerBelowAll(id, layer)` | Rendered below every vanilla HUD element. |
| `registerAbove(existingId, id, layer)` | Rendered immediately above a specific vanilla layer. |
| `registerBelow(existingId, id, layer)` | Rendered immediately below a specific vanilla layer. |

普通图层 ID 可在`VanillaGuiLayers` 中找到（例如`VanillaGuiLayers.CROSSHAIR`、`VanillaGuiLayers.HOTBAR`）。