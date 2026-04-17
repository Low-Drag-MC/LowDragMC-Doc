# Button

{{ version_badge("2.2.1", label="Since", icon="tag") }}

`Button` 是一个可点击的 UI 组件，内置文本标签、状态响应纹理（普通 / 悬停 / 按下），以及可选的前置或后置图标装饰。

在内部，`Button` 是一个水平 flex 行，拥有一个 **内部** [`TextElement`](#text) 作为其标签。因为它是一个常规的 `UIElement` 容器，你可以在标签旁边添加额外的子元素——最常见的是通过 [`addPreIcon`](#icon-decorations) 和 [`addPostIcon`](#icon-decorations)。

!!! note ""
    [UIElement](element.md){ data-preview } 上记录的所有内容（布局、样式、事件、数据绑定等）在这里同样适用。

---

## 使用方法

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

| XML 属性 | 类型 | 描述 |
| -------- | ---- | ---- |
| `text` | `string` | 设置标签文本。传入空字符串可隐藏文本元素。 |

---

## 内部结构

Button 包含一个由组件拥有的内部元素：

| 索引 | 类型 | CSS 选择器 | 描述 |
| ---- | ---- | ---------- | ---- |
| `0` | `TextElement` | `button > text:internal` | 标签文本元素 |

因为标签是 **内部** 的，它不能通过常规的子元素操作来重新定位或移除。你仍然可以使用 LSS 选择器来定位它：

```css
/* Targets only the button's own text, not any text you add as a child */
button > text:internal {
    font-size: 10;
    text-color: #FFFFFF;
}
```

---

## 文本

### `setText` / `noText` / `enableText`

控制按钮内部显示的标签文本。

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

流畅地配置内部 `TextElement` 的文本渲染：

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

## 图标装饰

在标签前后添加纹理图标。每个图标的大小与按钮高度匹配，并保持其宽高比。

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

要创建仅图标按钮，可以同时调用 `noText()` 和 `addPreIcon`：

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

`ButtonStyle` 包含三个状态相关的背景纹理。活动纹理会根据当前的[交互状态](#state)自动切换。

!!! info ""
    #### <p style="font-size: 1rem;">base-background</p>

    在 `DEFAULT`（空闲）状态下渲染的纹理，以及当按钮处于非激活状态（`isActive = false`）时也使用此纹理。

    默认值：`Sprites.RECT_RD`

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

    在 `PRESSED` 状态下渲染的纹理（鼠标按钮按下时）。

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

Button 在 `UIElement` 的标准事件系统之上提供了两个便捷的设置方法：

| 方法 | 端 | 触发条件 |
| ---- | -- | -------- |
| `setOnClick(UIEventListener)` | 客户端 | 左键（按钮 0）的 `MOUSE_DOWN` |
| `setOnServerClick(UIEventListener)` | 服务端 | 左键（按钮 0）的 `MOUSE_DOWN` |

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
    `setOnClick` 仅对 **左** 键点击（`event.button == 0`）触发。对于其他鼠标按钮，请直接使用 `addEventListener(UIEvents.MOUSE_DOWN, ...)`。

---

## 状态

Button 会自动跟踪其当前的视觉状态：

| 状态 | 条件 |
| ---- | ---- |
| `DEFAULT` | 无交互 |
| `HOVERED` | 鼠标悬停在按钮上 |
| `PRESSED` | 左键按下 |

当 `isActive` 为 `false` 时，按钮始终使用 `base-background` 渲染，并忽略鼠标输入。

你可以在 Java / Kotlin 中通过 `button.getState()` 读取当前状态。你无法从外部设置它——它由组件内置的事件监听器内部管理。

---

## 字段

> `Button` 特有的字段。基类字段请参阅 [UIElement § Fields](element.md#fields){ data-preview }。

| 名称 | 类型 | 访问权限 | 描述 |
| ---- | ---- | -------- | ---- |
| `text` | `TextElement` | `public final` | 内部标签元素。直接访问以更改文本样式或内容。 |
| `buttonStyle` | `ButtonStyle` | `private`（有 getter） | 持有三个状态纹理。 |
| `state` | `Button.State` | `private`（有 getter） | 当前视觉状态（`DEFAULT` / `HOVERED` / `PRESSED`）。 |

---

## 方法

> `Button` 特有的方法。完整的基类 API 请参阅 [UIElement § Methods](element.md#methods){ data-preview }。

| 方法 | 返回值 | 描述 |
| ---- | ------ | ---- |
| `setText(String, boolean)` | `Button` | 设置标签文本。`true` = 可翻译，`false` = 字面量。 |
| `noText()` | `Button` | 隐藏内部 `TextElement`。 |
| `enableText()` | `Button` | 重新显示内部 `TextElement`。 |
| `textStyle(Consumer<TextStyle>)` | `Button` | 流畅地配置内部文本样式。 |
| `addPreIcon(IGuiTexture)` | `Button` | 在文本前插入一个方形图标元素。 |
| `addPostIcon(IGuiTexture)` | `Button` | 在文本后追加一个方形图标元素。 |
| `buttonStyle(Consumer<ButtonStyle>)` | `Button` | 流畅地配置 `ButtonStyle`。 |
| `getButtonStyle()` | `ButtonStyle` | 直接返回 `ButtonStyle` 实例。 |
| `setOnClick(UIEventListener)` | `Button` | 设置客户端点击处理器（替换之前的）。 |
| `setOnServerClick(UIEventListener)` | `Button` | 添加服务端点击监听器。 |
| `getState()` | `Button.State` | 返回当前交互状态。 |
