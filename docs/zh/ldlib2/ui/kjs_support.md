# KubeJS 集成

{{ version_badge("2.2.1", label="自", icon="tag") }}

LDLib2 将其完整的 UI 系统暴露给 KubeJS 脚本——无需 Java 或 Kotlin。你可以直接从 `.js` 文件打开 UI、构建元素树、应用样式表并连接数据绑定。

---

## 打开 UI

主要入口点是 **`LDLib2UI`** 事件组和 **`LDLib2UIFactory`** 绑定。三种工厂类型覆盖了最常见的触发器：

| 事件 | Factory helper | 使用时机 |
| ---- | -------------- | -------- |
| `LDLib2UI.block(id, handler)` | `LDLib2UIFactory.openBlockUI(player, pos, id)` | 右键点击方块时 |
| `LDLib2UI.item(id, handler)` | `LDLib2UIFactory.openHeldItemUI(player, hand, id)` | 手持物品右键点击时 |
| `LDLib2UI.player(id, handler)` | `LDLib2UIFactory.openPlayerUI(player, id)` | 命令、按键绑定等任意触发方式 |

完整用法、上下文字段以及脚本放置规则详见 **[UI Factory](factory.md)** 页面。

---

## 在 KubeJS 中构建 UI

在 `LDLib2UI.*` 处理器内部，所有 UI 类都可以直接通过名称使用——无需导入：

```javascript
LDLib2UI.block("mymod:example", event => {
    event.modularUI = ModularUI.of(UI.of(
        new UIElement()
            .addClass("panel_bg")
            .addChildren(
                new Label().setText("Hello from KubeJS"),
                new Button().setText("Click me").setOnClick(e => {
                    // 此处编写服务端逻辑
                })
            )
    ), event.player);
});
```

浏览可用的组件、纹理和基础概念：

- **[UIElement & layout](preliminary/layout.md)** — flex/absolute 布局、尺寸、内边距、外边距
- **[Stylesheet (LSS)](preliminary/stylesheet.md)** — 类 CSS 样式，适用于所有元素
- **[Data bindings](preliminary/data_bindings.md)** — 响应式值绑定
- **[Components](components/element.md)** — 所有内置元素（`Label`、`Button`、`ItemSlot`、`Scene`……）
- **[Textures](textures/index.md)** — `ColorRectTexture`、`SpriteTexture`、`SDFRectTexture`……
- **[XEI integration](xei_support.md)** — JEI / REI / EMI 槽位与原料关联

---

## 绑定可用性

`@KJSBindings` 标记了哪些类和方法被暴露。带有 `modId` 注解的类（例如 `@KJSBindings(modId = "jei")`）仅当对应模组加载时才可用。所有核心 UI 类均无模组限制。