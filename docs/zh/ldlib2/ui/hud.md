# HUD 覆盖层

{{ version_badge("2.2.1", label="自", icon="tag") }}

LDLib2 允许你使用 `ModularHudLayer` 接口将完整的 `ModularUI` 渲染为 HUD 覆盖层。UI 将填满整个屏幕，在窗口大小改变时自动调整，并且每帧都会 tick。

---

## `ModularHudLayer`

`ModularHudLayer` 是一个 `@FunctionalInterface`，继承自 NeoForge 的 `LayeredDraw.Layer`。实现它只需要一个方法：

```java
@Nullable ModularUI getModularUI();
```

默认的 `render` 实现会在每帧调用 `getModularUI()`，在窗口大小改变时验证并重新初始化 `ModularUI`，然后以全屏尺寸渲染它。

---

## 注册 HUD 层

在**客户端 Mod 事件总线**上订阅 `RegisterGuiLayersEvent` 并注册你的层。使用 `Suppliers.memoize` 来延迟 UI 构建直到首次渲染——资源和世界在 Mod 初始化时尚不可用。

```java
@OnlyIn(Dist.CLIENT)
@EventBusSubscriber(modid = MyMod.MOD_ID, bus = EventBusSubscriber.Bus.MOD, value = Dist.CLIENT)
public class MyClientEvents {

    @SubscribeEvent
    public static void onRegisterGuiLayers(RegisterGuiLayersEvent event) {
        // 延迟构建——注册时资源尚未就绪
        var muiCache = Suppliers.memoize(() -> ModularUI.of(UI.of(
            buildHudRoot()
        )));

        // registerAboveAll  —— 在所有原版 HUD 元素之上渲染
        // registerAboveAll / registerBelow(id, ...) 可精确控制层级顺序
        event.registerAboveAll(MyMod.id("my_hud"), (ModularHudLayer) muiCache::get);
    }

    private static UIElement buildHudRoot() {
        return new UIElement()
            .layout(l -> l.widthPercent(100).heightPercent(100).paddingAll(10));
    }
}
```

!!! warning "不要急切地构建 UI"
    当 `RegisterGuiLayersEvent` 触发时，样式表、Sprite 和世界状态都**不可用**。
    务必将创建过程包装在 `Suppliers.memoize(...)` 或等效的延迟供应器中，使 `ModularUI` 在首次渲染 tick 时构建，而非注册时。

---

## 尺寸和布局

`ModularUI` 初始化时会使用**完整窗口宽度 × 高度**（并在调整大小时重新初始化）。使用百分比尺寸和内边距来定位 HUD 元素：

```java
new UIElement()
    .layout(l -> l
        .widthPercent(100)
        .heightPercent(100)
        .paddingAll(10)    // 每侧内缩 10 像素
        .gapAll(4)         // 子元素之间的间距
    )
    .addChildren(
        // 左上角图标
        new UIElement()
            .layout(l -> l.width(50).height(50))
            .style(s -> s.background(Sprites.BORDER1_RT1))
            .addChild(new UIElement()
                .layout(l -> l.widthPercent(100).heightPercent(100))
                .style(s -> s.background(new ItemStackTexture(Items.DIAMOND)))
            ),

        // 绑定到本地玩家的生命值条
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

对于绝对定位（例如固定到某个角落），可在 LSS 中使用 `position: absolute`，或在布局构建器中使用 `.positionAbsolute()` 并配合显式的 `left`/`top`/`right`/`bottom` 偏移值。

---

## 层级顺序

`RegisterGuiLayersEvent` 对应 NeoForge 的 `LayeredDraw` API：

| 方法 | 描述 |
| ------ | ----------- |
| `registerAboveAll(id, layer)` | 在所有原版 HUD 元素之上渲染。 |
| `registerBelowAll(id, layer)` | 在所有原版 HUD 元素之下渲染。 |
| `registerAbove(existingId, id, layer)` | 在特定原版层上方紧邻渲染。 |
| `registerBelow(existingId, id, layer)` | 在特定原版层下方紧邻渲染。 |

原版层 ID 可在 `VanillaGuiLayers` 中找到（例如 `VanillaGuiLayers.CROSSHAIR`、`VanillaGuiLayers.HOTBAR`）。
