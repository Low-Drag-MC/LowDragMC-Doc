# KubeJS 集成
{{ version_badge("2.2.1", label="Since", icon="tag") }}
LDLib2 将其完整的 UI 系统公开给 KubeJS 脚本 - 不需要 Java 或 Kotlin。您可以完全从 `.js` 文件打开 UI、构建元素树、应用样式表以及连接数据绑定。
---

## 打开用户界面
主要入口点是 **`LDLib2UI`** 事件组和 **`LDLib2UIFactory`** 绑定。三种工厂类型涵盖了最常见的触发器：
| Event | Factory helper | Use when |
| ----- | -------------- | -------- |
| `LDLib2UI.block(id, handler)` | `LDLib2UIFactory.openBlockUI(player, pos, id)` | Right-clicking a block |
| `LDLib2UI.item(id, handler)` | `LDLib2UIFactory.openHeldItemUI(player, hand, id)` | Right-clicking with an item |
| `LDLib2UI.player(id, handler)` | `LDLib2UIFactory.openPlayerUI(player, id)` | Commands, keybinds, any trigger |

完整的用法、上下文字段和脚本放置规则记录在 **[UI Factory](factory.md)** 页面上。
---

## 在 KubeJS 中构建 UI
在 `LDLib2UI.*` 处理程序内，所有 UI 类都可以通过名称直接使用 - 无需导入：
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

浏览可用的组件、纹理和初步概念：
- **[UIElement & layout](preliminary/layout.md)** — 弹性/绝对布局、大小、填充、边距- **[Stylesheet (LSS)](preliminary/stylesheet.md)** — 所有元素的类似 CSS 的样式- **[Data bindings](preliminary/data_bindings.md)** — 无功值接线- **[Components](components/element.md)** — 所有内置元素（`Label`、`Button`、`ItemSlot`、`Scene`、...）- **[Textures](textures/index.md)** — `ColorRectTexture`、`SpriteTexture`、`SDFRectTexture`、...- **[XEI integration](xei_support.md)** — JEI / REI / EMI 插槽和成分接线
---

## 绑定可用性
`@KJSBindings` 标记公开了哪些类和方法。用 `modId` 注释的类（例如 `@KJSBindings(modId = "jei")`）仅在加载该 mod 时可用。所有核心 UI 类都没有 mod 限制。