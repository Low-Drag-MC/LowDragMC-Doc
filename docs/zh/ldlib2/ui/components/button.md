# Button

{{ version_badge("2.2.1", label="自", icon="tag") }}

`Button` 是一个可点击的 UI 组件，内置文本标签、响应状态的纹理（普通 / 悬停 / 按下），以及可选的头部或尾部图标装饰。

从内部结构来看，`Button` 是一个水平 flex 行，包含一个**内部的** [`TextElement`](#text) 作为其标签。由于它是一个普通的 `UIElement` 容器，你可以在标签旁边添加额外的子元素 —— 最常见的方式是通过 [`addPreIcon`](#icon-decorations) 和 [`addPostIcon`](#icon-decorations)。

!!! note ""
    [UIElement](element.md){ data-preview } 上记录的所有内容（布局、样式、事件、数据绑定等）同样适用于此处。

---

## 用法

=== "Java"

    ```java
    var button = new Button();
    button.setText("my.button.label", true); // 可翻译的标签
    button.setOnClick(event -> {
        // 左键点击时在客户端执行
    });
    button.setOnServerClick(event -> {
        // 左键点击时在服务端执行
    });
    parent.addChild(button);
    ```

=== "Kotlin"

    ```kotlin
    button({
        text("my.button.label")
        onClick = { event -> /* 客户端 */ }
        onServerClick = { event -> /* 服务端 */ }
    }) {
        // 如有需要，可添加额外的子元素
    }
    ```

=== "KubeJS"

    ```js
    let button = new Button();
    button.setText(Component.literal("Click me"));   // 字面量
    button.setText("my.key", true);                  // 可翻译
    button.setOnClick(e => {
        // 客户端点击处理器
    });
    parent.addChild(button);
    ```

---

## XML

```xml
<!-- 带有可翻译标签的简单按钮 -->
<button text="my.button.label"/>

<!-- 空文本属性会隐藏标签（调用 noText()） -->
<button text=""/>

<!-- 为内部 TextElement 设置样式 -->
<button text="my.button.label">
    <internal index="0">
        <!-- TextElement 的属性 / 子元素写在这里 -->
    </internal>
</button>
```

| XML 属性 | 类型 | 描述 |
| -------- | ---- | ---- |
| `text` | `string` | 设置标签文本。传入空字符串以隐藏文本元素。 |

---

## 内部结构

Button 包含一个由组件拥有的内部元素：

| 索引 | 类型 | CSS 选择器 | 描述 |
| ---- | ---- | ---------- | ---- |
| `0` | `TextElement` | `button > text:internal` | 标签文本元素 |

由于该标签是**内部**的，无法通过常规子元素操作来重新定位或移除。你仍然可以通过 LSS 选择器来定位它：

```css
/* 仅定位按钮自身的文本，而非你作为子元素添加的任何文本 */
button > text:internal {
    font-size: 10;
    text-color: #FFFFFF;
}
```

---

## 文本

### `setText` / `noText` / `enableText`

控制按钮内显示的标签文本。

=== "Java"

    ```java
    button.setText("my.translation.key", true);  // 可翻译
    button.setText("Literal label", false);       // 字面量
    button.noText();                              // 隐藏标签
    button.enableText();                          // 重新显示
    ```

=== "Kotlin"

    ```kotlin
    button({
        text("my.translation.key")   // 可翻译（默认）
        // 或直接赋值 Component：
        // text = Component.literal("Literal label")
        noText()                     // 隐藏文本元素
    }) { }
    ```

=== "KubeJS"

    ```js
    button.setText(Component.literal("Literal label"));
    button.setText("my.key", true);   // 可翻译
    button.noText();
    button.enableText();
    ```

### `textStyle`

以流式 API 配置内部 `TextElement` 的文本渲染：

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
    // 构建完成后直接访问内部 TextElement
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

## 图标装饰

在标签前或标签后添加纹理图标。每个图标的大小会匹配按钮高度并保持宽高比。

=== "Java"

    ```java
    button.addPreIcon(Sprites.ICON_WRENCH);    // 文本前的图标
    button.addPostIcon(Sprites.ICON_WRENCH);   // 文本后的图标
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

要创建一个纯图标按钮，请同时调用 `noText()` 和 `addPreIcon`：

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

## 按钮样式

`ButtonStyle` 保存三个随状态变化的背景纹理。活动纹理会根据当前的[交互状态](#state)自动切换。

!!! info ""
    #### <p style="font-size: 1rem;">base-background</p>

    在 `DEFAULT`（空闲）状态下渲染的纹理，当按钮未激活时（`isActive = false`）也会使用该纹理。

    默认值：`Sprites.RECT_RD`

    === "Java"

        ```java
        button.buttonStyle(style -> style.baseTexture(myTexture));
        // 或：
        button.getButtonStyle().baseTexture(myTexture);
        ```

    === "Kotlin"

        ```kotlin
        button({ buttonStyle = { baseTexture(myTexture) } }) { }
        // 或构建完成后：
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

    在 `HOVERED` 状态下渲染的纹理。

    默认值：`Sprites.RECT_RD_LIGHT`

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

    在 `PRESSED` 状态下渲染的纹理（鼠标按键按住时）。

    默认值：`Sprites.RECT_RD_DARK`

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

## 事件与点击处理器

Button 在 `UIElement` 的标准事件系统之上提供了两个便捷的 setter：

| 方法 | 端 | 触发条件 |
| ---- | -- | -------- |
| `setOnClick(UIEventListener)` | 客户端 | `MOUSE_DOWN` 且为左键（button 0） |
| `setOnServerClick(UIEventListener)` | 服务端 | `MOUSE_DOWN` 且为左键（button 0） |

=== "Java"

    ```java
    button.setOnClick(event -> {
        // 鼠标按下时立即在客户端调用
        System.out.println("clicked on client");
    });

    button.setOnServerClick(event -> {
        // 玩家点击时在服务端调用
        player.sendSystemMessage(Component.literal("clicked!"));
    });
    ```

=== "Kotlin"

    ```kotlin
    // 通过 ButtonSpec（推荐）
    button({
        onClick = { event -> /* 客户端 */ }
        onServerClick = { event -> /* 服务端 */ }
    }) { }

    // 或通过标准 events 代码块
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
    // 通过事件监听器实现服务端处理：
    button.addServerEventListener(UIEvents.MOUSE_DOWN, e => {
        // 在服务端运行
    });
    ```

!!! note ""
    `setOnClick` 仅对**左**鼠标键点击触发（`event.button == 0`）。对于其他鼠标键，请直接使用 `addEventListener(UIEvents.MOUSE_DOWN, ...)`。

---

## 状态

Button 自动追踪其当前的视觉状态：

| 状态 | 条件 |
| ---- | ---- |
| `DEFAULT` | 无交互 |
| `HOVERED` | 鼠标悬停在按钮上 |
| `PRESSED` | 鼠标左键按住 |

当 `isActive` 为 `false` 时，按钮始终使用 `base-background` 渲染，并忽略鼠标输入。

你可以在 Java / Kotlin 中通过 `button.getState()` 读取当前状态。你无法从外部设置它 —— 它由组件内置的事件监听器内部管理。

---

## 字段

> `Button` 特有的字段。基础字段请参见 [UIElement § 字段](element.md#fields){ data-preview }。

| 名称 | 类型 | 访问权限 | 描述 |
| ---- | ---- | -------- | ---- |
| `text` | `TextElement` | `public final` | 内部标签元素。可直接访问以更改文本样式或内容。 |
| `buttonStyle` | `ButtonStyle` | `private` (getter) | 保存三种状态纹理。 |
| `state` | `Button.State` | `private` (getter) | 当前视觉状态（`DEFAULT` / `HOVERED` / `PRESSED`）。 |

---

## 方法

> `Button` 特有的方法。完整的基础 API 请参见 [UIElement § 方法](element.md#methods){ data-preview }。

| 方法 | 返回 | 描述 |
| ---- | ---- | ---- |
| `setText(String, boolean)` | `Button` | 设置标签文本。`true` = 可翻译，`false` = 字面量。 |
| `noText()` | `Button` | 隐藏内部 `TextElement`。 |
| `enableText()` | `Button` | 重新显示内部 `TextElement`。 |
| `textStyle(Consumer<TextStyle>)` | `Button` | 以流式 API 配置内部文本样式。 |
| `addPreIcon(IGuiTexture)` | `Button` | 在文本前插入一个方形图标元素。 |
| `addPostIcon(IGuiTexture)` | `Button` | 在文本后追加一个方形图标元素。 |
| `buttonStyle(Consumer<ButtonStyle>)` | `Button` | 以流式 API 配置 `ButtonStyle`。 |
| `getButtonStyle()` | `ButtonStyle` | 直接返回 `ButtonStyle` 实例。 |
| `setOnClick(UIEventListener)` | `Button` | 设置客户端点击处理器（替换之前的）。 |
| `setOnServerClick(UIEventListener)` | `Button` | 添加服务端点击监听器。 |
| `getState()` | `Button.State` | 返回当前交互状态。 |