# 事件

{{ version_badge("2.1.0", label="Since", icon="tag") }}

LDLib2 UI 提供了用于将用户操作或通知传递给 UI 元素的事件系统。该系统使用与 [HTML 事件](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Events#what_is_an_event) 相同的术语和事件命名。

---

## 派发事件

事件系统监听来自 ModularUI 或手动触发的事件，然后使用 `UIEventDispatcher` 将这些事件分派给 UI 元素。事件分发器会为它发送的每个事件确定一个适当的分发策略。一旦确定，分发器就会执行该策略。

### 事件传播
每个事件阶段都有其自己的分发行为。每种事件类型的行为分为两个阶段：

- `捕获阶段`：在向下捕获阶段发送给元素的事件。
- `冒泡阶段`：在向上冒泡阶段发送给元素的事件。

事件分发器选择事件 `target` 后，会计算事件的传播路径。传播路径是一个按顺序接收事件的 UI 元素列表。传播路径按以下顺序进行：

1. 路径从 UI 元素树的根开始，向下朝向 `target` 元素。这是向下捕获阶段。
2. 事件目标接收到事件。
3. 事件然后向上朝向根元素冒泡。这是向上冒泡阶段。

<figure markdown="span" style="width: 60%">
  ![alt text](../assets/event_phase.png)
  <figcaption>传播路径</figcaption>
</figure>

大多数事件会沿着传播路径发送给所有元素。有些事件会跳过冒泡阶段，有些事件则仅发送给事件目标。

### 事件目标

当 `UIEvent` 沿着传播路径移动时，`UIEvent.currentElement` 会更新为 **当前正在处理** 事件的元素。这使得很容易知道“哪个元素正在运行我的监听器”。

在事件监听器内部，LDLib2 区分两个重要的元素引用：

- **`UIEvent.target`**：事件 **起源** 的元素（分发目标）。
- **`UIEvent.relatedTarget`（可选）**：在某些事件中可能涉及的其他元素。
- **`UIEvent.currentElement`**：**当前正在执行** 监听器的元素。

`target` 在分发开始前确定，并且在传播过程中 **不会改变**。  
`currentElement` 会随着分发器在树中移动（捕获 → 目标 → 冒泡）而改变。

### 停止传播

LDLib2 提供两个级别的取消：

- `event.stopPropagation()`  
  阻止事件到达 **后续元素和后续阶段**（捕获/冒泡将停止）。

- `event.stopImmediatePropagation()`  
  阻止 **当前元素** 上的其他监听器运行，同时也阻止进一步传播。

---

## 注册事件监听器

LDLib2 使用 **类 DOM 事件模型**：事件在 UI 树中传播，可以为以下任一阶段注册监听器：

- **冒泡阶段**（默认）
- **捕获阶段**（设置 `useCapture = true`）

使用 `addEventListener(eventType, listener)` 注册一个 **冒泡阶段** 监听器：

=== "Java"

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

=== "KubeJS"

    ```js
    let root = new UIElement().setId("root");
    let button = new UIElement().setId("button");
    root.addChild(button);

    // UIEvents.CLICK == "mouseClick"
    button.addEventListener(UIEvents.CLICK, e => {
        console.log(`Bubble listener: current=${e.currentElement.getId()}, target=${e.target.getId()}`);
    });
    ```

要注册捕获阶段监听器，将 true 作为第三个参数传递：

=== "Java"

    ```java
    root.addEventListener(UIEvents.CLICK, e -> {
        LDLib2.LOGGER.info("Capture: current={}, target={}",
                e.currentElement.getId(), e.target.getId());
    }, true);
    ```

=== "KubeJS"

    ```js
    root.addEventListener(UIEvents.CLICK, e => {
        console.log(`Capture: current=${e.currentElement.getId()}, target=${e.target.getId()}`);
    }, true);
    ```

我们还提供了允许您在 `server` 上监听事件的方法。事件在客户端触发并同步到服务器。并非所有事件都支持服务器监听器，请查看下面的 [事件参考](#事件参考)。


=== "Java"

    ```java
    root.addServerEventListener(UIEvents.CLICK, e -> {
        LDLib2.LOGGER.info("Triggered on the server";
    });
    ```

=== "KubeJS"

    ```js
    root.addServerEventListener(UIEvents.CLICK, e => {
        console.log("Triggered on the server");
    });
    ```

要移除监听器，调用 `removeEventListener(...)`。
确保 useCapture 标志与监听器注册时的方式匹配：

=== "Java"

    ```java
    UIEventListener onClick = e -> LDLib2.LOGGER.info("clicked!");

    button.addEventListener(UIEvents.CLICK, onClick);       // bubble
    root.addEventListener(UIEvents.CLICK, onClick, true);   // capture

    button.removeEventListener(UIEvents.CLICK, onClick);          // 移除冒泡监听器
    root.removeEventListener(UIEvents.CLICK, onClick, true);      // 移除捕获监听器
    ```

=== "KubeJS"

    ```js
    let onClick = UIEventListener.creatre(e => LDLib2.LOGGER.info("clicked!"));

    button.addEventListener(UIEvents.CLICK, onClick);       // bubble
    root.addEventListener(UIEvents.CLICK, onClick, true);   // capture

    button.removeEventListener(UIEvents.CLICK, onClick);          // 移除冒泡监听器
    root.removeEventListener(UIEvents.CLICK, onClick, true);      // 移除捕获监听器
    ```

---

## 事件参考

当用户与元素交互并改变其状态时，LDLib2 会引发事件。事件设计类似于 HTML 元素的事件接口。

事件类型基于 `UIEvent.class` 形成一个层次结构。每个事件族实现一个接口，该接口定义了同一族所有事件的共同特征。

在这里，我们列出了所有 UI 元素可用的常见事件。选择下面列出的任何事件类型以获取有关该事件的更多信息以及 API 文档的链接。

!!! note
    我们建议使用 `UIEvents.xxx` 而不是事件类型字符串。

### 鼠标事件

鼠标事件是最常用的事件。当处理器开始捕获鼠标后发送的事件。

| 事件 | 描述 | 捕获向下 | 冒泡向上 | 支持服务器 |
| ----- | ----------- | ------------ | ---------- | ---------- |
| `mouseDown` | 当用户按下鼠标按钮时触发。 | ✅ | ✅ | ✅ |
| `mouseUp` | 当用户释放鼠标按钮时触发。 | ✅ | ✅ | ✅ |
| `mouseClick` | 当用户点击鼠标按钮（按下 + 释放）时触发。 | ✅ | ✅ | ✅ |
| `doubleClick` | 当用户双击鼠标按钮时触发。 | ✅ | ✅ | ✅ |
| `mouseMove` | 当鼠标在元素上移动时触发。 | ✅ | ✅ | ✅ |
| `mouseEnter` | 当鼠标进入元素或其子元素之一时触发。 | ✅ | ❌ | ✅ |
| `mouseLeave` | 当鼠标离开元素或其子元素之一时触发。 | ✅ | ❌ | ✅ |
| `mouseWheel` | 当用户滚动鼠标滚轮时触发。 | ✅ | ✅ | ✅ |


| 字段 | 描述 | 支持的事件 |
| ----- | ----------- | --------------- |
| `x` | 鼠标位置 x | 全部 |
| `y` | 鼠标位置 y | 全部 |
| `button` | 鼠标按钮代码 (0 - 左键, 1 - 右键, 2 - 中键, 其他...) | `mouseDown` `mouseUp` `mouseClick` `doubleClick` |
| `deltaX` | 滚动增量 x | `mouseWheel` |
| `deltaY` | 滚动增量 y | `mouseWheel` |

**用法**

=== "Java"

    ```java
    elem.addEventListener(UIEvents.DOUBLE_CLICK, e -> {
        LDLib2.LOGGER.info("double click {} with button {}", e.target, e.button)
    });
    ```

=== "KubeJS"

    ```js
    elem.addEventListener(UIEvents.DOUBLE_CLICK, e => {
        console.log(`double click ${e.target} with button ${e.button}`)
    });
    ```

---

### 拖放事件

拖放事件在拖拽操作期间派发。
**这些事件仅在客户端生效，不会发送到服务器。**

| 事件              | 描述  | 捕获向下 | 冒泡向上 | 支持服务器 |
| ------------------ | ------------ | ------------ | ---------- | ---------- |
| `dragEnter`        | 当指针在拖拽操作期间进入元素时触发。 | ✅ | ❌ | ❌ |
| `dragLeave`        | 当指针在拖拽操作期间离开元素时触发。 | ✅ | ❌ | ❌ |
| `dragUpdate`       | 当指针在拖拽过程中在元素上移动时触发。     | ✅ | ✅ | ❌ |
| `dragSourceUpdate` | 拖拽源在拖拽时触发。                          | ✅ | ❌ | ❌ |
| `dragPerform`      | 当被拖拽对象在元素上释放时触发。        | ✅ | ❌ | ❌ |
| `dragEnd`          | 拖拽操作结束时在拖拽源上触发。            | ✅ | ❌ | ❌ |

| 字段 | 描述 | 支持的事件 |
| ----- | ----------- | --------------- |
| `x` | 鼠标位置 x | 全部 |
| `y` | 鼠标位置 y | 全部 |
| `relatedTarget` | 如果 relatedTarget 不为 null，表示有新的元素进入。 | `dragLeave` |
| `deltaX` | 拖拽增量 x | 全部 |
| `deltaY` | 拖拽增量 y | 全部 |
| `dragStartX` | 拖拽前的起始位置 x | 全部 |
| `dragStartY` | 拖拽前的起始位置 y | 全部 |
| `dragHandler` | DragHandler 用于处理拖拽事件。 | 全部 |

所有拖放事件只有在调用 `startDrag` 开始拖拽后才会被触发。拖放生命周期如下：

1. 要触发拖拽，例如，在鼠标事件中，可以调用 `startDrag`。
2. 使用拖拽事件做些什么，`dragEnter`、`dragLeave`、`dragUpdate` 和 `dragSourceUpdate`（如果定义了拖拽源）。
3. 当拖拽完成时，触发 `dragPerform` 和 `dragEnd`（如果定义了拖拽源）。

**方法：`#!java DragHandler.startDrag(Object draggingObject, IGuiTexture dragTexture, UIElement dragSource)`**

参数：

- `draggingObject`：正在拖拽的对象；可以是任何类型以表示拖拽负载
- `dragTexture`：用于视觉上表示拖拽操作的纹理
- `dragSource`：作为拖拽操作源的 `UIElement`

!!! note
    `dragSourceUpdate` 和 `dragEnd` 仅派发给拖拽源。

你也可以使用 `UIElement.startDrag` 来开始拖拽，它可以帮助你直接传递 `dragSource`。

**用法**

=== "Java"

    ```java
    elem.addEventListener(UIEvents.MOUSE_DOWN, e -> {
        // 鼠标按下时开始拖拽
        elem.startDrag(null, null);
    });
    elem.addEventListener(UIEvents.DRAG_SOURCE_UPDATE, e -> {
        LDLib2.LOGGER.info("{} dragged ({}, {})", e.target, e.deltaX, e.deltaY)
    });
    ```

=== "KubeJS"

    ```js
    elem.addEventListener(UIEvents.MOUSE_DOWN, e => {
        // 鼠标按下时开始拖拽
        elem.startDrag(null, null);
    });
    elem.addEventListener(UIEvents.DRAG_SOURCE_UPDATE, e => {
        copnsole.log(`${e.target} dragged (${e.deltaX}, ${e.deltaY})`)
    });
    ```

---

### 焦点事件

当 `可聚焦` 元素获得或失去焦点时，会派发焦点事件。

| 事件      | 描述                                   | 捕获向下 | 冒泡向上 | 支持服务器 |
| ---------- | --------------------------------------------- | ------------ | ---------- | ---------- |
| `focusIn`  | 当元素即将获得焦点时触发。 | ✅ | ❌ | ❌ |
| `focus`    | 当元素获得焦点后触发。      | ✅ | ❌ | ✅ |
| `focusOut` | 当元素即将失去焦点时触发。 | ✅ | ❌ | ❌ |
| `blur`     | 当元素失去焦点后触发。        | ✅ | ❌ | ✅ |

| 字段 | 描述 | 支持的事件 |
| ----- | ----------- | --------------- |
| `relatedTarget` | 对于 `focusIn` 和 `focus`，指上一个获得焦点的元素。 <br> 对于 `focusOut` 和 `blur`，指上一个失去焦点的元素。 | 全部 |

!!! note
    - `focusIn` 和 `focusOut` **不会发送到服务器**。
    - `relatedTarget` 表示正在失去或获得焦点的元素。

**用法**

=== "Java"

    ```java
    elem.setFocusable(true)
    elem.addEventListener(UIEvents.MOUSE_DOWN, e -> {
        // 请求焦点
        elem.focus();
    });
    elem.addEventListener(UIEvents.FOCUS, e -> {
        LDLib2.LOGGER.info("{} gained the focus", elem);
    });
    ```

=== "KubeJS"

    ```js
    elem.setFocusable(true)
    elem.addEventListener(UIEvents.MOUSE_DOWN, e => {
        // 请求焦点
        elem.focus();
    });
    elem.addEventListener(UIEvents.FOCUS, e => {
        console.log(`${elem} gained the focus`);
    });
    ```

---

### 键盘事件

键盘事件派发给当前拥有 **焦点** 的元素。

| 事件     | 描述                                         | 捕获向下 | 冒泡向上 | 支持服务器 |
| --------- | --------------------------------------------------- | ------------ | ---------- | ---------- |
| `keyDown` | 当用户在键盘上按下按键时触发。  | ✅ | ✅ | ✅ |
| `keyUp`   | 当用户在键盘上释放按键时触发。 | ✅ | ✅ | ✅ |


| 字段 | 描述 | 支持的事件 |
| ----- | ----------- | --------------- |
| `keyCode` | 按键代码 | 全部 |
| `scanCode` | 扫描代码 | 全部 |
| `modifiers` | 修饰键 | 全部 |

**用法**

=== "Java"

    ```java
    elem.setFocusable(true)
    elem.addEventListener(UIEvents.MOUSE_DOWN, e -> {
        // 请求焦点
        elem.focus();
    });
    elem.addEventListener(UIEvents.KEY_DOWN, e -> {
        LDLib2.LOGGER.info("key {} pressed", e.keyCode);
    });
    ```

=== "KubeJS"

    ```js
    elem.setFocusable(true)
    elem.addEventListener(UIEvents.MOUSE_DOWN, e => {
        // 请求焦点
        elem.focus();
    });
    elem.addEventListener(UIEvents.KEY_DOWN, e => {
        console.log(`key ${e.keyCode} pressed`)
    });
    ```

---

### 文本输入事件

文本输入事件用于字符级输入，例如在文本字段中键入，同样派发给当前拥有 **焦点** 的元素。

| 事件       | 描述                                      | 捕获向下 | 冒泡向上 | 支持服务器 |
| ----------- | ------------------------------------------------ | ------------ | ---------- | ---------- |
| `charTyped` | 当向元素输入字符时触发。 | ❌ | ❌ | ✅ |

| 字段 | 描述 | 支持的事件 |
| ----- | ----------- | --------------- |
| `codePoint` | 代码点 | 全部 |
| `modifiers` | 修饰键 | 全部 |

**用法**

=== "Java"

    ```java
    elem.setFocusable(true)
    elem.addEventListener(UIEvents.MOUSE_DOWN, e -> {
        // 请求焦点
        elem.focus();
    });
    elem.addEventListener(UIEvents.CHAR_TYPED, e -> {
        LDLib2.LOGGER.info("key {} pressed", e.codePoint);
    });
    ```

=== "KubeJS"

    ```js
    elem.setFocusable(true)
    elem.addEventListener(UIEvents.MOUSE_DOWN, e => {
        // 请求焦点
        elem.focus();
    });
    elem.addEventListener(UIEvents.CHAR_TYPED, e => {
        console.log(`key ${e.codePoint} pressed`)
    });
    ```
---

### 悬停提示事件

当需要显示动态提示信息时，会派发悬停提示事件。

| 事件           | 描述                                  | 捕获向下 | 冒泡向上 | 支持服务器 |
| --------------- | -------------------------------------------- | ------------ | ---------- | ---------- |
| `hoverTooltips` | 触发以为元素提供悬停提示内容。 | ❌ | ❌ | ❌ |

| 字段 | 描述 | 支持的事件 |
| ----- | ----------- | --------------- |
| `hoverTooltips` | 设置您要显示的悬停提示 | 全部 |

!!! info "TooltipComponent"
    ![size](../assets/tooltipcomponent.png){ align=right width="200" }
    `hoverTooltips` 允许您在文本组件后追加 `TooltipComponent`。您可以使用 `ModularUITooltipComponent` 将 LDLib2 UI 附加到提示中。
    

**用法**

=== "Java"

    ```java
    elem.addEventListener(UIEvents.HOVER_TOOLTIPS, e -> {
        e.hoverTooltips = HoverTooltips.empty()
            // 添加文本提示
            .append(Component.literal("Hello"), Component.literal("World"))
            // 添加图片
            .tooltipComponent(new ModularUITooltipComponent(new UIElement().layout(layout -> {
                layout.width(100).height(100);
            }).style(style -> style.background(SpriteTexture.of("ldlib2:textures/gui/icon.png")))));
    });
    ```

=== "KubeJS"

    ```js
    elem.addEventListener(UIEvents.HOVER_TOOLTIPS, e => {
        e.hoverTooltips = HoverTooltips.empty()
            // 添加文本提示
            .append("Hello", "World");
            // 添加图片
            .tooltipComponent(new ModularUITooltipComponent(new UIElement().layout(layout => {
                layout.width(100).height(100);
            }).style(style => style.background(SpriteTexture.of("ldlib2:textures/gui/icon.png")))));
    });
    ```
---

### 命令事件

命令事件用于处理高级 UI 命令（例如复制、粘贴、全选）。
它们遵循验证 → 执行的流程。要在 `validateCommand` 期间声明命令，请调用 `UIEvent.stopPropagation()`。

| 事件             | 描述                     | 捕获向下 | 冒泡向上 | 支持服务器 |
| ----------------- | ------------------------------- | ------------ | ---------- | ---------- |
| `validateCommand` | 触发以检查元素是否可以处理某个命令。 | ❌ | ❌ | ❌ |
| `executeCommand`  | 当命令在元素上执行时触发。         | ❌ | ❌ | ❌ |

| 字段 | 描述 | 支持的事件 |
| ----- | ----------- | --------------- |
| `keyCode` | 按键代码 | 全部 |
| `scanCode` | 扫描代码 | 全部 |
| `modifiers` | 修饰键 | 全部 |
| `command` | 命令 | 全部 |

**命令**

| 命令 | 描述 |
| ----- | ----------- |
| `copy` | ctrl + c |
| `cut` | ctrl + x |
| `paste` | ctrl + v |
| `select-all` | ctrl + a |
| `undo` | ctrl + z |
| `redo` | ctrl + y / ctrl + shift + z |
| `find` | ctrl + f |
| `save` | ctrl + s |


!!! note
    如果检测到命令输入。命令事件将首先发送给 `focus` 元素（如果存在）。如果它没有被消费，它将被发送给 UI 树元素，直到某个元素消费它为止。

**用法**

=== "Java"

    ```java
    elem.addEventListener(UIEvents.VALIDATE_COMMAND, e -> {
        if (CommandEvents.COPY.equals(event.command)) {
            // 通知消费
            event.stopPropagation();
        }
    });

    elem.addEventListener(UIEvents.EXECUTE_COMMAND, e -> {
        if (CommandEvents.COPY.equals(event.command)) {
            ClipboardManager.copyDirect("data");
        }
    });
    ```

=== "KubeJS"

    ```js
    elem.addEventListener(UIEvents.VALIDATE_COMMAND, e => {
        if (CommandEvents.COPY == event.command) {
            // 通知消费
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

当元素的布局状态发生变化时，会派发布局事件。

| 事件           | 描述                                  | 捕获向下 | 冒泡向上 | 支持服务器 |
| --------------- | -------------------------------------------- | ------------ | ---------- | ---------- |
| `layoutChanged` | 当元素的 yoga 布局发生变化时触发。 | ❌ | ❌ | ❌ |


**用法**

=== "Java"

    ```java
    elem.addEventListener(UIEvents.LAYOUT_CHANGED, e -> {
        LDLib2.LOGGER.info("{} layout changed", e.target)
    });
    ```

=== "KubeJS"

    ```js
    elem.addEventListener(UIEvents.LAYOUT_CHANGED, e => {
        console.log(`${e.target} layout changed`)
    });
    ```

---

### 生命周期事件

生命周期事件描述了元素在 UI 树中存在状态的变化。

| 事件        | 描述                                       | 捕获向下 | 冒泡向上 | 支持服务器 |
| ------------ | ------------------------------------------------- | ------------ | ---------- | ---------- |
| `added`      | 当元素被添加到 UI 树时触发。        | ❌            | ❌          | ❌ |
| `removed`    | 当元素从 UI 树中移除时触发。    | ❌            | ❌          | ❌ |
| `muiChanged` | 当元素的 `ModularUI` 实例更改时触发。 | ❌            | ❌          | ❌ |

!!! note
    `removed` 不仅在元素移除时发送，UI 关闭时也会发送。你可以使用此事件来释放资源。

**用法**

=== "Java"

    ```java
    elem.addEventListener(UIEvents.REMOVED, e -> {
        // 为安全起见在此释放资源
    });
    ```

=== "KubeJS"

    ```js
    elem.addEventListener(UIEvents.REMOVED, e => {
        // 为安全起见在此释放资源
    });
    ```

---

### 刻事件

刻事件在元素处于活动且可见状态时，每游戏刻派发一次。

| 事件  | 描述                                           | 捕获向下 | 冒泡向上 | 支持服务器 |
| ------ | ----------------------------------------------------- | ------------ | ---------- | ---------- |
| `tick` | 当元素处于活动并显示状态时，每刻触发一次。 | ❌ | ❌ | ✅ |

!!! note
    - `tick` 不会自动发送到服务器。
    - 如果需要，您仍然可以在服务器端监听它。

=== "Java"

    ```java
    elem.addEventListener(UIEvents.TICK, e -> {
    });
    ```

=== "KubeJS"

    ```js
    elem.addEventListener(UIEvents.TICK, e => {
    });
    ```