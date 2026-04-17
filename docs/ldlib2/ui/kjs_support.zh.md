# KubeJS 集成

{{ version_badge("2.2.1", label="Since", icon="tag") }}

LDLib2 将其完整的 UI 系统暴露给 KubeJS 脚本 — 无需 Java 或 Kotlin。你可以完全通过 `.js` 文件打开 UI、构建元素树、应用样式表以及建立数据绑定。

---

## 打开 UI

主要入口点是 **`LDLib2UI`** 事件组和 **`LDLib2UIFactory`** 绑定。三种工厂类型涵盖了最常见的触发场景：

| 事件 | 工厂辅助方法 | 使用场景 |
| ----- | -------------- | -------- |
| `LDLib2UI.block(id, handler)` | `LDLib2UIFactory.openBlockUI(player, pos, id)` | 右键点击方块 |
| `LDLib2UI.item(id, handler)` | `LDLib2UIFactory.openHeldItemUI(player, hand, id)` | 右键点击手持物品 |
| `LDLib2UI.player(id, handler)` | `LDLib2UIFactory.openPlayerUI(player, id)` | 命令、按键绑定或任意触发器 |

完整用法、上下文字段和脚本放置规则请参阅 **[UI 工厂](factory.zh.md)** 页面。

---

## 在 KubeJS 中构建 UI

在 `LDLib2UI.*` 处理器内部，所有 UI 类都可以直接通过名称使用 — 无需导入：

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

浏览可用的组件、纹理和基础概念：

- **[UIElement 与布局](preliminary/layout.zh.md)** — flex/absolute 布局、尺寸、内边距、外边距
- **[样式表 (LSS)](preliminary/stylesheet.zh.md)** — 适用于所有元素的类 CSS 样式
- **[数据绑定](preliminary/data_bindings.zh.md)** — 响应式值绑定
- **[组件](components/element.zh.md)** — 所有内置元素（`Label`、`Button`、`ItemSlot`、`Scene` 等）
- **[纹理](textures/index.zh.md)** — `ColorRectTexture`、`SpriteTexture`、`SDFRectTexture` 等
- **[XEI 集成](xei_support.zh.md)** — JEI / REI / EMI 槽位和物品绑定

---

## 绑定可用性

`@KJSBindings` 标记了哪些类和方法被暴露。使用 `modId` 注解的类（例如 `@KJSBindings(modId = "jei")`）仅在对应 mod 加载时可用。所有核心 UI 类没有 mod 限制。