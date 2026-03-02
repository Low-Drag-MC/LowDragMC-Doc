# 按钮
{{ version_badge("2.2.1", label="Since", icon="tag") }}
`Button` 是一个可点击的 UI 组件，具有内置文本标签、状态反应纹理（正常/悬停/按下）以及可选的前导或尾随图标装饰。
在内部，`Button` 是一个水平弹性行，拥有单个 **内部** [`TextElement`](#text) 作为其标签。因为它是一个常规的 `UIElement` 容器，所以您可以在标签旁边添加额外的子项 - 最常见的是通过 [`addPreIcon`](#icon-decorations) 和 [`addPostIcon`](#icon-decorations)。
!!!笔记 ””[UIElement](element.md){ data-preview } 上记录的所有内容（布局、样式、事件、数据绑定等）也适用于此处。
---

＃＃ 用法
===“Java”
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

===“科特林”
    ```kotlin
    button({
        text("my.button.label")
        onClick = { event -> /* client-side */ }
        onServerClick = { event -> /* server-side */ }
    }) {
        // add extra children if needed
    }
    ```

===“KubeJS”
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

| XML Attribute | Type | Description |
| ------------- | ---- | ----------- |
| `text` | `string` | Sets the label text. Pass an empty string to hide the text element. |

---

## 内部结构
按钮包含该组件拥有的一个内部元素：
| Index | Type | CSS selector | Description |
| ----- | ---- | ------------ | ----------- |
| `0` | `TextElement` | `button > text:internal` | The label text element |

由于标签是**内部**，因此无法通过正常的子操作重新定位或删除它。您仍然可以使用 LSS 选择器来定位它：
```css
/* Targets only the button's own text, not any text you add as a child */
button > text:internal {
    font-size: 10;
    text-color: #FFFFFF;
}
```

---

＃＃ 文本
### `setText` / `noText` / `enableText`
控制按钮内显示的标签文本。
===“Java”
    ```java
    button.setText("my.translation.key", true);  // translated
    button.setText("Literal label", false);       // literal
    button.noText();                              // hide the label
    button.enableText();                          // show it again
    ```

===“科特林”
    ```kotlin
    button({
        text("my.translation.key")   // translated (default)
        // or assign a Component directly:
        // text = Component.literal("Literal label")
        noText()                     // hides the text element
    }) { }
    ```

===“KubeJS”
    ```js
    button.setText(Component.literal("Literal label"));
    button.setText("my.key", true);   // translated
    button.noText();
    button.enableText();
    ```

###`textStyle`
流畅地配置内部`TextElement`的文本渲染：
===“Java”
    ```java
    button.textStyle(style -> style
        .textColor(0xFFFFFF)
        .fontSize(9)
        .textShadow(true)
    );
    ```

===“科特林”
    ```kotlin
    // Access the internal TextElement directly after build
    button.text.textStyle {
        textColor(0xFFFFFF)
        fontSize(9f)
        textShadow(true)
    }
    ```

===“KubeJS”
    ```js
    button.textStyle(style => style
        .textColor(0xFFFFFF)
        .fontSize(9)
        .textShadow(true)
    );
    ```

---

## 图标装饰
在标签之前或之后添加纹理图标。每个图标的大小都与按钮高度相匹配并保持其纵横比。
===“Java”
    ```java
    button.addPreIcon(Sprites.ICON_WRENCH);    // icon before text
    button.addPostIcon(Sprites.ICON_WRENCH);   // icon after text
    ```

===“科特林”
    ```kotlin
    button.addPreIcon(Sprites.ICON_WRENCH)
    button.addPostIcon(Sprites.ICON_WRENCH)
    ```

===“KubeJS”
    ```js
    button.addPreIcon(Sprites.ICON_WRENCH);
    button.addPostIcon(Sprites.ICON_WRENCH);
    ```

要创建仅图标按钮，请与`addPreIcon`一起调用`noText()`：
===“Java”
    ```java
    new Button()
        .noText()
        .addPreIcon(myIcon)
        .layout(l -> l.size(14));
    ```

===“科特林”
    ```kotlin
    button({ noText(); buttonStyle = { /* ... */ } }) {
        api { addPreIcon(myIcon) }
    }
    ```

---

## 按钮样式
`ButtonStyle` 拥有三个与状态相关的背景纹理。活动纹理会根据当前[interaction state](#state)自动更改。
!!!信息“”#### <p style="font-size: 1rem;">基础背景</p>
在`DEFAULT`（空闲）状态以及按钮处于非活动状态（`isActive = false`）时渲染的纹理。
默认值：`Sprites.RECT_RD`
===“Java”
        ```java
        button.buttonStyle(style -> style.baseTexture(myTexture));
        // or:
        button.getButtonStyle().baseTexture(myTexture);
        ```

===“科特林”
        ```kotlin
        button({ buttonStyle = { baseTexture(myTexture) } }) { }
        // or after build:
        button.buttonStyleDsl { baseTexture(myTexture) }
        ```

===“LSS”
        ```css
        button {
            base-background: rect(#4a4a4a, 2);
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">悬停背景</p>
在`HOVERED`状态下渲染的纹理。
默认值：`Sprites.RECT_RD_LIGHT`
===“Java”
        ```java
        button.buttonStyle(style -> style.hoverTexture(myTexture));
        ```

===“科特林”
        ```kotlin
        button({ buttonStyle = { hoverTexture(myTexture) } }) { }
        ```

===“LSS”
        ```css
        button {
            hover-background: rect(#5a5a5a, 2);
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">按下背景</p>
在 `PRESSED` 状态下渲染的纹理（按住鼠标按钮时）。
默认值：`Sprites.RECT_RD_DARK`
===“Java”
        ```java
        button.buttonStyle(style -> style.pressedTexture(myTexture));
        ```

===“科特林”
        ```kotlin
        button({ buttonStyle = { pressedTexture(myTexture) } }) { }
        ```

===“LSS”
        ```css
        button {
            pressed-background: rect(#3a3a3a, 2);
        }
        ```

---

## 事件和点击处理程序
Button 在`UIElement` 的标准事件系统之上提供了两个方便的设置器：
| Method | Side | Trigger |
| ------ | ---- | ------- |
| `setOnClick(UIEventListener)` | Client | `MOUSE_DOWN` with left button (button 0) |
| `setOnServerClick(UIEventListener)` | Server | `MOUSE_DOWN` with left button (button 0) |

===“Java”
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

===“科特林”
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

===“KubeJS”
    ```js
    button.setOnClick(e => {
        console.log("clicked on client");
    });
    // Server-side via event listener:
    button.addServerEventListener(UIEvents.MOUSE_DOWN, e => {
        // runs on server
    });
    ```

!!!笔记 ””`setOnClick` 仅在单击**左**鼠标按钮时触发 (`event.button == 0`)。对于其他鼠标按钮，直接使用`addEventListener(UIEvents.MOUSE_DOWN, ...)`。
---

＃＃ 状态
按钮自动跟踪其当前的视觉状态：
| State | Condition |
| ----- | --------- |
| `DEFAULT` | No interaction |
| `HOVERED` | Mouse is over the button |
| `PRESSED` | Left mouse button held down |

当`isActive` 为`false` 时，按钮始终以`base-background` 呈现并忽略鼠标输入。
您可以通过`button.getState()`读取Java/Kotlin中的当前状态。您无法在外部设置它 - 它由组件的内置事件侦听器在内部管理。
---

## 字段
> 特定于 `Button` 的字段。请参阅 [UIElement § Fields](element.md#fields){ data-preview } 了解基本字段。
| Name | Type | Access | Description |
| ---- | ---- | ------ | ----------- |
| `text` | `TextElement` | `public final` | The internal label element. Access directly to change text style or content. |
| `buttonStyle` | `ButtonStyle` | `private` (getter) | Holds the three state textures. |
| `state` | `Button.State` | `private` (getter) | Current visual state (`DEFAULT` / `HOVERED` / `PRESSED`). |

---

＃＃ 方法
> `Button` 特有的方法。请参阅 [UIElement § Methods](element.md#methods){ data-preview } 了解完整的基础 API。
| Method | Returns | Description |
| ------ | ------- | ----------- |
| `setText(String, boolean)` | `Button` | Sets label text. `true` = translatable, `false` = literal. |
| `noText()` | `Button` | Hides the internal `TextElement`. |
| `enableText()` | `Button` | Shows the internal `TextElement` again. |
| `textStyle(Consumer<TextStyle>)` | `Button` | Configures the internal text style fluently. |
| `addPreIcon(IGuiTexture)` | `Button` | Inserts a square icon element before the text. |
| `addPostIcon(IGuiTexture)` | `Button` | Appends a square icon element after the text. |
| `buttonStyle(Consumer<ButtonStyle>)` | `Button` | Configures `ButtonStyle` fluently. |
| `getButtonStyle()` | `ButtonStyle` | Returns the `ButtonStyle` instance directly. |
| `setOnClick(UIEventListener)` | `Button` | Sets the client-side click handler (replaces previous). |
| `setOnServerClick(UIEventListener)` | `Button` | Adds a server-side click listener. |
| `getState()` | `Button.State` | Returns the current interaction state. |
