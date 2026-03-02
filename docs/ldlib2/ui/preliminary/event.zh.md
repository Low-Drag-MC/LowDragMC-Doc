# 事件
{{ version_badge("2.1.0", label="Since", icon="tag") }}
LDLib2 UI 提供向 UI 元素传达用户操作或通知的事件。事件系统与 [HTML events](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Events#what_is_an_event) 共享相同的术语和事件命名。
---

## 调度事件
事件系统侦听来自 ModularUI 或手动触发的事件，然后使用 `UIEventDispatcher` 将这些事件分派给 UI 元素。事件调度程序为其发送的每个事件确定适当的调度策略。一旦确定，调度员就会执行策略。
### 事件传播每个事件阶段都有自己的调度行为。每个事件类型的行为分为两个阶段：
- `Capture Phase`：在捕获阶段发送到元素的事件。- `Bubbles Phase`：在冒泡阶段发送到元素的事件。
事件调度程序选择事件`target`后，计算事件的传播路径。传播路径是接收事件的 UI 元素的有序列表。传播路径按以下顺序发生：
1. 该路径从 UI 元素树的根部开始，向下到达`target`。这是捕获阶段。2. 事件目标接收事件。3. 然后该事件沿着树向根部上升。这是泡沫上升阶段。
<figure markdown="span" style="width: 60%">![alt text](../assets/event_phase.png)<figcaption>传播路径</figcaption></figure>

大多数事件都会发送到传播路径上的所有元素。有些事件跳过冒泡阶段，有些事件仅发送到事件目标。
### 事件目标
当`UIEvent` 沿着传播路径行进时，`UIEvent.currentElement` 被更新为**当前处理**事件的元素。这使得很容易知道“哪个元素正在运行我的监听器”。
在事件侦听器中，LDLib2 区分两个重要的元素引用：
- **`UIEvent.target`**：事件**发起**的元素（调度目标）。- **`UIEvent.relatedTarget`（可选）**：其他元素可能参与某些事件。- **`UIEvent.currentElement`**：监听器当前正在执行的元素。
`target` 在调度开始之前确定，并且在传播期间**不会改变**。`currentElement` 随着调度员在树中移动（捕获→目标→气泡）而变化。
### 停止传播
LDLib2 提供两种级别的取消：
- `event.stopPropagation()`阻止事件到达**后面的元素和后面的阶段**（捕获/气泡将停止）。
- `event.stopImmediatePropagation()`停止当前元素上的其他侦听器运行，并停止进一步传播。
---

## 注册事件监听器
LDLib2 使用 **类似 DOM 的事件模型**：事件通过 UI 树传播，并且可以为以下任一事件注册侦听器：
- **气泡相**（默认）- **捕获阶段**（设置`useCapture = true`）
使用 `addEventListener(eventType, listener)` 注册一个 **bubble-phase** 监听器：
===“Java”
    ```java
    var root = new UIElement().setId("root");
    var button = new UIElement().setId("button");
    root.addChild(button);

    // UIEvents.CLICK == "mouseClick"
    button.addEventListener(UIEvents.CLICK, e -> {
        LDLib2.LOGGER.info("Bubble listener: current={}, target={}",
                e.currentElement.getId(), e.target.getId());
    });
    ```

===“KubeJS”
    ```js
    let root = new UIElement().setId("root");
    let button = new UIElement().setId("button");
    root.addChild(button);

    // UIEvents.CLICK == "mouseClick"
    button.addEventListener(UIEvents.CLICK, e => {
        console.log(`Bubble listener: current=${e.currentElement.getId()}, target=${e.target.getId()}`);
    });
    ```

要注册捕获阶段侦听器，请传递 true 作为第三个参数：
===“Java”
    ```java
    root.addEventListener(UIEvents.CLICK, e -> {
        LDLib2.LOGGER.info("Capture: current={}, target={}",
                e.currentElement.getId(), e.target.getId());
    }, true);
    ```

===“KubeJS”
    ```js
    root.addEventListener(UIEvents.CLICK, e => {
        console.log(`Capture: current=${e.currentElement.getId()}, target=${e.target.getId()}`);
    }, true);
    ```

我们还提供了允许您监听`server`上的事件的方法。事件在客户端触发并同步到服务器。并非所有事件都支持服务器侦听器，请检查下面的[Event reference](#event-reference)。

===“Java”
    ```java
    root.addServerEventListener(UIEvents.CLICK, e -> {
        LDLib2.LOGGER.info("Triggered on the server";
    });
    ```

===“KubeJS”
    ```js
    root.addServerEventListener(UIEvents.CLICK, e => {
        console.log("Triggered on the server");
    });
    ```

要删除监听器，请调用`removeEventListener(...)`。确保 useCapture 标志与监听器的注册方式匹配：
===“Java”
    ```java
    UIEventListener onClick = e -> LDLib2.LOGGER.info("clicked!");

    button.addEventListener(UIEvents.CLICK, onClick);       // bubble
    root.addEventListener(UIEvents.CLICK, onClick, true);   // capture

    button.removeEventListener(UIEvents.CLICK, onClick);          // remove bubble listener
    root.removeEventListener(UIEvents.CLICK, onClick, true);      // remove capture listener
    ```

===“KubeJS”
    ```js
    let onClick = UIEventListener.creatre(e => LDLib2.LOGGER.info("clicked!"));

    button.addEventListener(UIEvents.CLICK, onClick);       // bubble
    root.addEventListener(UIEvents.CLICK, onClick, true);   // capture

    button.removeEventListener(UIEvents.CLICK, onClick);          // remove bubble listener
    root.removeEventListener(UIEvents.CLICK, onClick, true);      // remove capture listener
    ```

---

## 事件参考
当用户与元素交互并更改元素状态时，LDLib2 会引发事件。事件设计类似于 HTML 元素的事件接口。
事件类型适合基于`UIEvent.class` 的层次结构。每个事件系列都实现一个接口，该接口定义同一系列的所有事件的共同特征。
在这里，我们列出了适用于下面所有 ui 元素的常见事件。选择下面列出的任何事件类型以获取有关该事件的更多信息以及 API 文档的链接。
!!!笔记我们建议使用 `UIEvents.xxx` 而不是事件类型字符串。

### 鼠标事件
鼠标事件是最常用的事件。处理程序开始捕获鼠标后发送的事件。
| Event | Description | Capture down | Bubbles up | Support Server |
| ----- | ----------- | ------------ | ---------- | ---------- |
| `mouseDown` | Fired when the user presses a mouse button. | ✅ | ✅ | ✅ |
| `mouseUp` | Fired when the user releases a mouse button. | ✅ | ✅ | ✅ |
| `mouseClick` | Fired when the user clicks a mouse button (press + release). | ✅ | ✅ | ✅ |
| `doubleClick` | Fired when the user double-clicks a mouse button. | ✅ | ✅ | ✅ |
| `mouseMove` | Fired when the mouse moves over the element. | ✅ | ✅ | ✅ |
| `mouseEnter` | Fired when the mouse enters an element or one of its descendants. | ✅ | ❌ | ✅ |
| `mouseLeave` | Fired when the mouse leaves an element or one of its descendants. | ✅ | ❌ | ✅ |
| `mouseWheel` | Fired when the user scrolls the mouse wheel. | ✅ | ✅ | ✅ |


| Field | Description | Supported Event |
| ----- | ----------- | --------------- |
| `x` | mouse position x | All |
| `y` | mouse position y | All |
| `button` | mouse button code (0 - left, 1 - right, 2 - middle, others...) | `mouseDown` `mouseUp` `mouseClick` `doubleClick` |
| `deltaX` | scroll delta x | `mouseWheel` |
| `deltaY` | scroll delta y | `mouseWheel` |

**用法**
===“Java”
    ```java
    elem.addEventListener(UIEvents.DOUBLE_CLICK, e -> {
        LDLib2.LOGGER.info("double click {} with button {}", e.target, e.button)
    });
    ```

===“KubeJS”
    ```js
    elem.addEventListener(UIEvents.DOUBLE_CLICK, e => {
        console.log(`double click ${e.target} with button ${e.button}`)
    });
    ```

---

### 拖放事件
拖放事件在拖动操作期间调度。**这些事件仅在客户端发生，不会发送到服务器。**
| Event              | Description  | Capture down | Bubbles up | Support Server |
| ------------------ | ------------ | ------------ | ---------- | ---------- |
| `dragEnter`        | Fired when the pointer enters an element during a drag operation. | ✅ | ❌ | ❌ |
| `dragLeave`        | Fired when the pointer leaves an element during a drag operation. | ✅ | ❌ | ❌ |
| `dragUpdate`       | Fired when the pointer moves over an element during dragging.     | ✅ | ✅ | ❌ |
| `dragSourceUpdate` | Fired on the drag source while dragging.                          | ✅ | ❌ | ❌ |
| `dragPerform`      | Fired when the dragged object is released over an element.        | ✅ | ❌ | ❌ |
| `dragEnd`          | Fired on the drag source when the drag operation ends.            | ✅ | ❌ | ❌ |

| Field | Description | Supported Event |
| ----- | ----------- | --------------- |
| `x` | mouse position x | All |
| `y` | mouse position y | All |
| `relatedTarget` | If the relatedTarget is not null, it means the new element entered. | `dragLeave` |
| `deltaX` | dragging delta x | All |
| `deltaY` | dragging delta y | All |
| `dragStartX` | start position x before dragging | All |
| `dragStartY` | start position y before dragging | All |
| `dragHandler` | DragHandler is used to handle drag events. | All |


所有拖动事件只有在开始拖动`startDrag`后才会触发。拖放生命周期如下：
1. 例如，要在鼠标事件中触发拖动，您可以调用`startDrag`。2. 对拖动事件`dragEnter`、`dragLeave`、`dragUpdate` 和`dragSourceUpdate` 执行某些操作（如果定义了拖动源）。3. 拖动完成后，触发`dragPerform`和`dragEnd`（如果定义了拖动源）
**方法：`#!java DragHandler.startDrag(Object draggingObject, IGuiTexture dragTexture, UIElement dragSource)`**
参数：
- `draggingObject`：被拖动的对象；可以是任何类型来表示拖动有效负载- `dragTexture`：用于直观地表示拖动操作- `dragSource`：充当拖动操作源的`UIElement`
!!!笔记`dragSourceUpdate` 和`dragEnd` 仅分派到拖动源。
您还可以使用`UIElement.startDrag`开始拖动，它可以帮助您直接传递`dragSource`。
**用法**
===“Java”
    ```java
    elem.addEventListener(UIEvents.MOUSE_DOWN, e -> {
        // start drag when the mouse down
        elem.startDrag(null, null);
    });
    elem.addEventListener(UIEvents.DRAG_SOURCE_UPDATE, e -> {
        LDLib2.LOGGER.info("{} dragged ({}, {})", e.target, e.deltaX, e.deltaY)
    });
    ```

===“KubeJS”
    ```js
    elem.addEventListener(UIEvents.MOUSE_DOWN, e => {
        // start drag when the mouse down
        elem.startDrag(null, null);
    });
    elem.addEventListener(UIEvents.DRAG_SOURCE_UPDATE, e => {
        copnsole.log(`${e.target} dragged (${e.deltaX}, ${e.deltaY})`)
    });
    ```

---

### 焦点事件
当 `focusable` 元素获得或失去焦点时调度焦点事件。
| Event      | Description                                   | Capture down | Bubbles up | Support Server |
| ---------- | --------------------------------------------- | ------------ | ---------- | ---------- |
| `focusIn`  | Fired when an element is about to gain focus. | ✅ | ❌ | ❌ |
| `focus`    | Fired after an element has gained focus.      | ✅ | ❌ | ✅ |
| `focusOut` | Fired when an element is about to lose focus. | ✅ | ❌ | ❌ |
| `blur`     | Fired after an element has lost focus.        | ✅ | ❌ | ✅ |

| Field | Description | Supported Event |
| ----- | ----------- | --------------- |
| `relatedTarget` | For `focusIn` and `focus`, refers to last focused element. <br> For `focusOut` and `blur`, refers to last focused element. | All |

!!!笔记    - `focusIn` 和`focusOut` **不发送到服务器**。    - `relatedTarget` 表示元素失去或获得焦点。
**用法**
===“Java”
    ```java
    elem.setFocusable(true)
    elem.addEventListener(UIEvents.MOUSE_DOWN, e -> {
        // request focus
        elem.focus();
    });
    elem.addEventListener(UIEvents.FOCUS, e -> {
        LDLib2.LOGGER.info("{} gained the focus", elem);
    });
    ```

===“KubeJS”
    ```js
    elem.setFocusable(true)
    elem.addEventListener(UIEvents.MOUSE_DOWN, e => {
        // request focus
        elem.focus();
    });
    elem.addEventListener(UIEvents.FOCUS, e => {
        console.log(`${elem} gained the focus`);
    });
    ```

---

### 键盘事件
键盘事件被分派到当前具有**焦点**的元素。
| Event     | Description                                         | Capture down | Bubbles up | Support Server |
| --------- | --------------------------------------------------- | ------------ | ---------- | ---------- |
| `keyDown` | Fired when the user presses a key on the keyboard.  | ✅ | ✅ | ✅ |
| `keyUp`   | Fired when the user releases a key on the keyboard. | ✅ | ✅ | ✅ |


| Field | Description | Supported Event |
| ----- | ----------- | --------------- |
| `keyCode` | key code | All |
| `scanCode` | sccan code | All |
| `modifiers` | modifiers | All |

**用法**
===“Java”
    ```java
    elem.setFocusable(true)
    elem.addEventListener(UIEvents.MOUSE_DOWN, e -> {
        // request focus
        elem.focus();
    });
    elem.addEventListener(UIEvents.KEY_DOWN, e -> {
        LDLib2.LOGGER.info("key {} pressed", e.keyCode);
    });
    ```

===“KubeJS”
    ```js
    elem.setFocusable(true)
    elem.addEventListener(UIEvents.MOUSE_DOWN, e => {
        // request focus
        elem.focus();
    });
    elem.addEventListener(UIEvents.KEY_DOWN, e => {
        console.log(`key ${e.keyCode} pressed`)
    });
    ```

---

### 文本输入事件
文本输入事件用于字符级输入，例如在文本字段中键入内容，该事件也会分派到当前具有**焦点**的元素。
| Event       | Description                                      | Capture down | Bubbles up | Support Server |
| ----------- | ------------------------------------------------ | ------------ | ---------- | ---------- |
| `charTyped` | Fired when a character is input into an element. | ❌ | ❌ | ✅ |

| Field | Description | Supported Event |
| ----- | ----------- | --------------- |
| `codePoint` | code point | All |
| `modifiers` | modifiers | All |

**用法**
===“Java”
    ```java
    elem.setFocusable(true)
    elem.addEventListener(UIEvents.MOUSE_DOWN, e -> {
        // request focus
        elem.focus();
    });
    elem.addEventListener(UIEvents.CHAR_TYPED, e -> {
        LDLib2.LOGGER.info("key {} pressed", e.codePoint);
    });
    ```

===“KubeJS”
    ```js
    elem.setFocusable(true)
    elem.addEventListener(UIEvents.MOUSE_DOWN, e => {
        // request focus
        elem.focus();
    });
    elem.addEventListener(UIEvents.CHAR_TYPED, e => {
        console.log(`key ${e.codePoint} pressed`)
    });
    ```
---

### 悬停工具提示事件
当需要显示动态工具提示信息时，将调度悬停工具提示事件。

| Event           | Description                                  | Capture down | Bubbles up | Support Server |
| --------------- | -------------------------------------------- | ------------ | ---------- | ---------- |
| `hoverTooltips` | Fired to provide hover tooltip content for an element. | ❌ | ❌ | ❌ |

| Field | Description | Supported Event |
| ----- | ----------- | --------------- |
| `hoverTooltips` | Set your hover tooltips to display | All |

!!!信息“工具提示组件”![size](../assets/tooltipcomponent.png){align=右宽度=“200”}`hoverTooltips` 允许您在文本组件后面附加`TooltipComponent`。您可以使用 `ModularUITooltipComponent` 将 LDLib2 UI 附加到工具提示中。    

**用法**
===“Java”
    ```java
    elem.addEventListener(UIEvents.HOVER_TOOLTIPS, e -> {
        e.hoverTooltips = HoverTooltips.empty()
            // add text tooltips
            .append(Component.literal("Hello"), Component.literal("World"))
            // add a image
            .tooltipComponent(new ModularUITooltipComponent(new UIElement().layout(layout -> {
                layout.width(100).height(100);
            }).style(style -> style.background(SpriteTexture.of("ldlib2:textures/gui/icon.png")))));
    });
    ```

===“KubeJS”
    ```js
    elem.addEventListener(UIEvents.HOVER_TOOLTIPS, e => {
        e.hoverTooltips = HoverTooltips.empty()
            // add text tooltips
            .append("Hello", "World");
            // add a image
            .tooltipComponent(new ModularUITooltipComponent(new UIElement().layout(layout => {
                layout.width(100).height(100);
            }).style(style => style.background(SpriteTexture.of("ldlib2:textures/gui/icon.png")))));
    });
    ```
---

### 命令事件
命令事件用于处理高级 UI 命令（例如复制、粘贴、全选）。它们遵循验证→执行流程。要在`validateCommand`期间声明命令，请调用`UIEvent.stopPropagation()`。
| Event             | Description                     | Capture down | Bubbles up | Support Server |
| ----------------- | ------------------------------- | ------------ | ---------- | ---------- |
| `validateCommand` | Fired to check whether an element can handle a command. | ❌ | ❌ | ❌ |
| `executeCommand`  | Fired when a command is executed on an element.         | ❌ | ❌ | ❌ |

| Field | Description | Supported Event |
| ----- | ----------- | --------------- |
| `keyCode` | key code | All |
| `scanCode` | sccan code | All |
| `modifiers` | modifiers | All |
| `command` | command | All |

**命令**
| Command | Description |
| ----- | ----------- |
| `copy` | ctrl + c |
| `cut` | ctrl + x |
| `paste` | ctrl + v |
| `select-all` | ctrl + a |
| `undo` | ctrl + z |
| `redo` | ctrl + y / ctrl + shift + z |
| `find` | ctrl + f |
| `save` | ctrl + s |


!!!笔记如果检测到命令输入。命令事件将首先发送到`focus` 元素（如果存在）。如果没有被消耗，它将被发送到UI树元素，直到有元素消耗它。
**用法**
===“Java”
    ```java
    elem.addEventListener(UIEvents.VALIDATE_COMMAND, e -> {
        if (CommandEvents.COPY.equals(event.command)) {
            // notify cosnuming
            event.stopPropagation();
        }
    });

    elem.addEventListener(UIEvents.EXECUTE_COMMAND, e -> {
        if (CommandEvents.COPY.equals(event.command)) {
            ClipboardManager.copyDirect("data");
        }
    });
    ```

===“KubeJS”
    ```js
    elem.addEventListener(UIEvents.VALIDATE_COMMAND, e => {
        if (CommandEvents.COPY == event.command) {
            // notify cosnuming
            event.stopPropagation();
        }
    });

    elem.addEventListener(UIEvents.EXECUTE_COMMAND, e => {
        if (CommandEvents.COPY == event.command) {
            ClipboardManager.copyDirect("data");
        }
    });
    ```

---

### 布局事件
当元素的布局状态更改时，将调度布局事件。
| Event           | Description                                  | Capture down | Bubbles up | Support Server |
| --------------- | -------------------------------------------- | ------------ | ---------- | ---------- |
| `layoutChanged` | Fired when the yoga layout of an element changes. | ❌ | ❌ | ❌ |


**用法**
===“Java”
    ```java
    elem.addEventListener(UIEvents.LAYOUT_CHANGED, e -> {
        LDLib2.LOGGER.info("{} layout changed", e.target)
    });
    ```

===“KubeJS”
    ```js
    elem.addEventListener(UIEvents.LAYOUT_CHANGED, e => {
        console.log(`${e.target} layout changed`)
    });
    ```

---

### 生命周期事件
生命周期事件描述 UI 树中元素的存在变化。
| Event        | Description                                       | Capture down | Bubbles up | Support Server |
| ------------ | ------------------------------------------------- | ------------ | ---------- | ---------- |
| `added`      | Fired when the element is added to the UI tree.        | ❌            | ❌          | ❌ |
| `removed`    | Fired when the element is removed from the UI tree.    | ❌            | ❌          | ❌ |
| `muiChanged` | Fired when the element’s `ModularUI` instance changes. | ❌            | ❌          | ❌ |

!!!笔记`removed`不仅会发送元素删除，还会发送UI关闭。您可以使用此事件来分配资源。
**用法**
===“Java”
    ```java
    elem.addEventListener(UIEvents.REMOVED, e -> {
        // release resource here for safe
    });
    ```

===“KubeJS”
    ```js
    elem.addEventListener(UIEvents.REMOVED, e => {
        // release resource here for safe
    });
    ```

---

### 勾选事件
当元素处于活动状态且可见时，每个游戏tick 都会调度一次tick 事件。
| Event  | Description                                           | Capture down | Bubbles up | Support Server |
| ------ | ----------------------------------------------------- | ------------ | ---------- | ---------- |
| `tick` | Fired every tick when the element is active and displayed. | ❌ | ❌ | ✅ |

!!!笔记    - `tick` 不会自动发送到服务器。    - 如果需要，您仍然可以在服务器端收听。

===“Java”
    ```java
    elem.addEventListener(UIEvents.TICK, e -> {
    });
    ```

===“KubeJS”
    ```js
    elem.addEventListener(UIEvents.TICK, e => {
    });
    ```