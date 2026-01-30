# UIElement

{{ version_badge("2.1.0", label="Since", icon="tag") }}

`UIElement` 是 LDLib2 中最基础且最常用的 UI 组件。
所有 UI 组件都继承自它。

从概念上讲，它类似于 HTML 中的 `#!html <div/>` 元素：一个通用的容器，可以进行样式化、布局，并通过行为进行扩展。

因此，本页介绍的所有内容同样适用于 LDLib2 中的所有其他 UI 组件——所以请务必仔细阅读。

---

## 用法

=== "Java"

    ```java
    var element = new UIElement();
    element.style(style -> style.background(MCSprites.RECT));
    element.layout(layout -> layout.width(40).height(40));
    element.setFocusable(true)
    element.addEventListener(UIEvents.MOUSE_DOWN, e -> e.currentElement.focus());
    root.addChild(element);
    ```

=== "KubeJS"

    ```js
    let element = new UIElement();
    element.style(style => style.background(MCSprites.RECT));
    element.layout(layout => layout.width(40).height(40));
    element.setFocusable(true)
    element.addEventListener(UIEvents.MOUSE_DOWN, e => e.currentElement.focus());
    root.addChild(element);
    ```

---

## Xml
```xml
<element id="my_id" class="class1 class2" focusable="false" visible="true" active="true" style="background: #fff; width: 50">
    <!-- 在此添加子元素 -->
    <button text="click me!"/>
    <inventory-slots/>
</element>
```

---

## 样式

!!! note "布局"
    布局属性实际上也是样式。

UIElement 的样式（包括布局）可以通过以下方式访问：
=== "Java"

    ```java
    element.style(style -> style.background(...));
    element.layout(layout -> layout.width(...));
    element.getStyle().background(...);
    element.getLayout().width(...);
    ```

=== "KubeJS"

    ```js
    element.style(style => style.background(...));
    element.layout(layout => layout.width(...));
    element.getStyle().background(...);
    element.getLayout().width(...);
    ```

### 布局属性

使用前最好先阅读 [布局](../preliminary/layout.md){ data-preview }。

!!! info ""
    #### <p style="font-size: 1rem;">display</p>

    控制元素是否参与布局。`FLEX` 启用正常布局，`NONE` 将元素从布局计算中移除。`CONTENTS` 不影响布局但会渲染其子元素。

    === "Java"

        ```java
        layout.display(YogaDisplay.FLEX);
        element.setDisplay(false); // 等同于 layout.display(YogaDisplay.NONE);
        ```

    === "LSS"

        ```css
        element {
            display: flex;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">layout-direction</p>

    设置布局方向。通常从父元素继承。

    === "Java"

        ```java
        layout.layoutDirection(YogaDirection.LTR);
        ```

    === "LSS"

        ```css
        element {
            layout-direction: ltr;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">flex-basis</p>

    设置在 flex 增长/收缩之前的主轴初始大小。支持 **点**、**百分比** 和 **自动** 模式。

    === "Java"

        ```java
        layout.flexBasis(1);
        ```

    === "LSS"

        ```css
        element {
            flex-basis: 1;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">flex</p>

    使元素沿主轴灵活伸缩。

    === "Java"

        ```java
        layout.flex(1);
        ```

    === "LSS"

        ```css
        element {
            flex: 1;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">flex-grow</p>

    控制当有额外空间时，元素的增长程度。

    === "Java"

        ```java
        layout.flexGrow(1);
        ```

    === "LSS"

        ```css
        element {
            flex-grow: 1;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">flex-shrink</p>

    控制当空间不足时，元素的收缩程度。

    === "Java"

        ```java
        layout.flexShrink(1);
        ```

    === "LSS"

        ```css
        element {
            flex-shrink: 1;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">flex-direction</p>

    定义主轴方向，例如 `ROW` 或 `COLUMN`。

    === "Java"

        ```java
        layout.flexDirection(YogaFlexDirection.ROW);
        ```

    === "LSS"

        ```css
        element {
            flex-direction: row;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">flex-wrap</p>

    控制子元素是否换行。

    === "Java"

        ```java
        layout.flexWrap(YogaWrap.WRAP);
        ```

    === "LSS"

        ```css
        element {
            flex-wrap: wrap;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">position</p>

    设置定位模式。`RELATIVE` 参与布局，`ABSOLUTE` 不影响兄弟元素。

    === "Java"

        ```java
        layout.position(YogaPositionType.ABSOLUTE);
        ```

    === "LSS"

        ```css
        element {
            position: absolute;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">top / right / bottom / left / start / end / horizontal / vertical / all</p>

    当 `position` 为 `RELATIVE` 或 `ABSOLUTE` 时使用的偏移量。

    === "Java"

        ```java
        layout.top(10);
        layout.leftPercent(30); // 30%
        layout.allAuto()
        ```

    === "LSS"

        ```css
        element {
            top: 10;
            left: 30%;
            all: auto;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">margin-*</p>

    `*`: top / right / bottom / left / start / end / horizontal / vertical / all

    设置元素周围的外边距。

    === "Java"

        ```java
        layout.marginTop(5);
        layout.marginAll(3);
        ```

    === "LSS"

        ```css
        element {
            margin-top: 5;
            margin-all: 3;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">padding-*</p>

    `*`: top / right / bottom / left / start / end / horizontal / vertical / all

    设置边框与内容之间的内边距。

    === "Java"

        ```java
        layout.paddingLeft(8);
        ```

    === "LSS"

        ```css
        element {
            padding-left: 8;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">gap-*</p>

    `*`: top / right / bottom / left / start / end / horizontal / vertical / all

    设置弹性布局中子元素之间的间距。

    === "Java"

        ```java
        layout.rowGap(6);
        ```

    === "LSS"

        ```css
        element {
            row-gap: 6;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">width</p>

    设置元素宽度。支持 **点**、**百分比** 和 **自动** 模式。

    === "Java"

        ```java
        layout.width(100);
        layout.widthPercent(20); // 20%
        ```

    === "LSS"

        ```css
        element {
            width: 100;
            width: 20%;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">height</p>

    设置元素高度。支持 **点**、**百分比** 和 **自动** 模式。

    === "Java"

        ```java
        layout.height(50);
        ```

    === "LSS"

        ```css
        element {
            height: 50;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">min-width / min-height</p>

    设置最小尺寸约束。

    === "Java"

        ```java
        layout.minWidth(20);
        ```

    === "LSS"

        ```css
        element {
            min-width: 20;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">max-width / max-height</p>

    设置最大尺寸约束。

    === "Java"

        ```java
        layout.maxHeight(200);
        ```

    === "LSS"

        ```css
        element {
            max-height: 200;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">aspect-rate</p>

    锁定宽高比。对于方形或图标元素很有用。

    === "Java"

        ```java
        layout.aspectRate(1);
        ```

    === "LSS"

        ```css
        element {
            aspect-rate: 1;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">overflow</p>

    控制如何处理溢出内容。如果设为 'hidden'，边界之外的内容将被隐藏。

    === "Java"

        ```java
        layout.overflow(YogaOverflow.HIDDEN);
        element.setOverflowVisible(false); // 等同于 layout.overflow(YogaOverflow.HIDDEN);
        ```

    === "LSS"

        ```css
        element {
            overflow: hidden;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">align-items</p>

    沿交叉轴对齐子元素（容器属性）。

    === "Java"

        ```java
        layout.alignItems(YogaAlign.CENTER);
        ```

    === "LSS"

        ```css
        element {
            align-items: center;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">justify-content</p>

    沿主轴对齐子元素（容器属性）。

    === "Java"

        ```java
        layout.justifyContent(YogaJustify.CENTER);
        ```

    === "LSS"

        ```css
        element {
            justify-content: center;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">align-self</p>

    覆盖单个元素的交叉轴对齐方式。

    === "Java"

        ```java
        layout.alignSelf(YogaAlign.CENTER);
        ```

    === "LSS"

        ```css
        element {
            align-self: center;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">align-content</p>

    当启用 `flex-wrap` 时，对齐换行后的行。

    === "Java"

        ```java
        layout.alignContent(YogaAlign.CENTER);
        ```

    === "LSS"

        ```css
        element {
            align-content: center;
        }
        ```

---

### 基础属性

!!! info ""
    #### <p style="font-size: 1rem;">background</p>

    设置在元素内容下方的背景渲染，例如颜色、矩形、图像。

    === "Java"

        ```java
        layout.background(MCSprites.BORDER);
        ```

    === "LSS"
        关于 lss 支持，请查看 [LSS 中的纹理](../textures/lss.md)。

        ```css
        element {
            background: #FFF;
            background: rect(#2ff, 3);
            background: sprite(ldlib2:textures/gui/icon.png);
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">overlay</p>

    控制在元素内容上方绘制的覆盖层渲染。

    === "Java"

        ```java
        layout.overlay(...);
        ```

    === "LSS"
        关于 lss 支持，请查看 [LSS 中的纹理](../textures/lss.md)。

        ```css
        element {
            overlay: #FFF;
            overlay: rect(#2ff, 3);
            overlay: sprite(ldlib2:textures/gui/icon.png);
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">tooltips</p>

    定义当鼠标悬停在元素上时显示的工具提示内容。

    === "Java"

        ```java
        layout.tooltips("tips.0"， "tips.1");
        layout.appendTooltips("tips.2");
        ```

    === "LSS"

        ```css
        element {
            tooltips: 这是我的工具提示;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">z-index</p>

    控制元素的堆叠顺序。数值较大的元素显示在数值较小的元素之上。

    === "Java"

        ```java
        layout.zIndex(1);
        ```

    === "LSS"

        ```css
        element {
            z-index: 1;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">opacity</p>

    设置元素的透明度等级。`0` 为完全透明，`1` 为完全不透明。

    === "Java"

        ```java
        layout.opacity(0.8f);
        ```

    === "LSS"

        ```css
        element {
            opacity: 0.8;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">overflow-clip</p>

    如果元素的 overflow 设为 `hidden`，则根据给定纹理的红色通道裁剪元素渲染。

    <div style="text-align: center;">
        <video controls>
        <source src="../../assets/overflow-clip.mp4" type="video/mp4">
        您的浏览器不支持视频。
        </video>
    </div>

    === "Java"

        ```java
        layout.overflowClip(true);
        ```

    === "LSS"
        关于 lss 支持，请查看 [LSS 中的纹理](../textures/lss.md)。

        ```css
        element {
            overflow-clip: sprite(ldlib2:textures/gui/icon.png);
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">transform-2d</p>

    应用 2D 变换，例如平移、缩放或旋转。

    === "Java"

        ```java
        layout.transform2D(Transform2D.identity().scale(0.5f));
        element.transform(transform -> transform.translate(10, 0))
        ```

    === "LSS"

        ```css
        element {
            transform: translate(10, 20) rotate(45) scale(2， 2) pivot(0.5, 0.5);
            transform: translateX(10) scale(0.5);
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">transition</p>

    定义属性变化之间的动画过渡效果。

    <div style="text-align: center;">
        <video controls>
        <source src="../../assets/transition.mp4" type="video/mp4">
        您的浏览器不支持视频。
        </video>
    </div>

    === "Java"

        ```java
        layout.transition(new Transition(Map.of(YogaProperties.HEIGHT, new Animation(1, 0, Eases.LINEAR))));
        ```

    === "LSS"

        ```css
        element {
            transition: width 1;
            transition: background 0.8 quad_in_out,
                        transform 0.3;
        }
        ```

---
## 状态

### `isVisible`
当 `isVisible` 设置为 `false` 时，该元素及其所有子元素将不再被渲染。
与 `display: NONE` 不同，这**不会**影响布局计算。
`isVisible = false` 的元素也会被排除在命中测试之外，因此许多 UI 事件（如点击）将不会被触发。

### `isActive`
当 `isActive` 设置为 `false` 时，元素可能会失去其交互行为——例如，按钮无法再被点击——并且元素将不再接收 `tick` 事件。

!!! note
    当 `isActive` 设置为 `false` 时，会自动向元素添加一个 `__disabled__` 类。
    你可以使用以下 LSS 选择器来设置活动和非活动状态的样式：

    ```css
    selector.__disabled__ {
    }

    selector:not(.__disabled__) {
    }
    ```

### `focusable`
元素默认是 `focusable: false`。有些组件（如 `TextField`）在设计上是可聚焦的，但你仍然可以手动更改元素的可聚焦状态。
只有当 `focusable` 设置为 `true` 时，元素才能通过 `focus()` 或鼠标交互获得焦点。

!!! note
    当元素处于 `focused`（已聚焦）状态时，会自动添加一个 `__focused__` 类。
    你可以使用以下 LSS 选择器来设置已聚焦和未聚焦状态的样式：

    ```css
    selector.__focused__ {
    }

    selector:not(.__focused__) {
    }
    ```

### `isInternalUI`
这是一个特殊状态，表示一个元素是否是组件的内部部分。
例如，一个 `button` 包含一个用于渲染其标签的内部 `text` 元素。

从语义上讲，不允许直接添加、移除或重新排序内部元素。
但是，你仍然可以通过编辑器或 XML 编辑它们的样式并管理它们的子元素。
在编辑器中，内部元素在层级视图中显示为灰色。

在 XML 中，你可以使用 `#!xml <internal index="..."/>` 标签访问内部元素，其中 `index` 指定要引用的内部元素：

```xml
<button>
    <!-- 在这里获取内部文本组件 -->
    <internal index="0">
    </internal>
</button>
```

!!! note ""
    在 LSS 中，你可以使用 :host 和 :internal 来明确指定宿主元素或内部元素。默认情况下，选择器会匹配两者，除非加以限制。
    ```css
    button > text {
    }

    button > text:internal {
    }

    button > text:host {
    }
    ```

---

## 字段

> 仅列出外部可观察或可配置的公共或受保护字段。

| 名称            | 类型            | 访问权限                 | 描述                                             |
| --------------- | --------------- | ------------------------ | ------------------------------------------------ |
| `layoutNode`    | `YogaNode`      | protected (getter)       | 用于布局计算的基础 Yoga 节点。                   |
| `modularUI`     | `ModularUI`     | private (getter)         | 此元素所属的 `ModularUI` 实例。                  |
| `id`            | `String`        | private (getter/setter)  | 元素 ID，用于选择器和查询。                      |
| `classes`       | `Set<String>`   | private (getter)         | 应用于此元素的类似 CSS 的类列表。                |
| `styleBag`      | `StyleBag`      | private (getter)         | 存储已解析的样式候选值和计算后的样式。           |
| `styles`        | `List<Style>`   | private (getter)         | 附加到此元素的内联样式。                         |
| `layoutStyle`   | `LayoutStyle`   | private (getter)         | 布局相关样式的包装器（基于 Yoga）。              |
| `style`         | `BasicStyle`    | private (getter)         | 基础视觉样式（背景、不透明度、zIndex 等）。      |
| `isVisible`     | `boolean`       | private (getter/setter)  | 元素是否可见。                                   |
| `isActive`      | `boolean`       | private (getter/setter)  | 元素是否参与逻辑和事件。                         |
| `focusable`     | `boolean`       | private (getter/setter)  | 元素是否可以获得焦点。                           |
| `isInternalUI`  | `boolean`       | private (getter)         | 标记内部（组件拥有的）元素。                     |

---

## 方法

### 布局与几何

| 方法                        | 签名                                    | 描述                                             |
| --------------------------- | --------------------------------------- | ------------------------------------------------ |
| `getLayout()`               | `LayoutStyle`                           | 返回布局样式控制器。                             |
| `layout(...)`               | `UIElement layout(Consumer<LayoutStyle>)` | 以流式方式修改布局属性。                         |
| `node(...)`                 | `UIElement node(Consumer<YogaNode>)`    | 直接修改底层的 Yoga 节点。                       |
| `getPositionX()`            | `float`                                 | 屏幕上的绝对 X 坐标。                            |
| `getPositionY()`            | `float`                                 | 屏幕上的绝对 Y 坐标。                            |
| `getSizeWidth()`            | `float`                                 | 元素的计算宽度。                                 |
| `getSizeHeight()`           | `float`                                 | 元素的计算高度。                                 |
| `getContentX()`             | `float`                                 | 内容区域的 X 坐标（不包括边框和内边距）。        |
| `getContentY()`             | `float`                                 | 内容区域的 Y 坐标。                              |
| `getContentWidth()`         | `float`                                 | 内容区域的宽度。                                 |
| `getContentHeight()`        | `float`                                 | 内容区域的高度。                                 |
| `adaptPositionToScreen()`   | `void`                                  | 调整位置以保持在屏幕边界内。                     |
| `adaptPositionToElement(...)` | `void`                                | 调整位置以保持在另一个元素内部。                 |

---

### 树结构

| 方法               | 签名                             | 描述                                       |
| ------------------ | -------------------------------- | ------------------------------------------ |
| `getParent()`      | `UIElement`                      | 返回父元素，或 `null`。                    |
| `getChildren()`    | `List<UIElement>`                | 返回一个不可修改的子元素列表。             |
| `addChild(...)`    | `UIElement addChild(UIElement)`  | 添加一个子元素。                           |
| `addChildren(...)` | `UIElement addChildren(UIElement...)` | 添加多个子元素。                     |
| `removeChild(...)` | `boolean removeChild(UIElement)` | 移除一个子元素。                           |
| `removeSelf()`     | `boolean`                        | 从其父元素中移除此元素。                   |
| `clearAllChildren()` | `void`                         | 移除所有子元素。                           |
| `isAncestorOf(...)`| `boolean`                        | 检查此元素是否是另一个元素的祖先。         |
| `getStructurePath()` | `ImmutableList<UIElement>`     | 从根元素到此元素的路径。                   |

---

### 样式与类

| 方法             | 签名                                    | 描述                                         |
| ---------------- | --------------------------------------- | -------------------------------------------- |
| `style(...)`     | `UIElement style(Consumer<BasicStyle>)` | 修改内联视觉样式。                           |
| `lss(...)`       | `UIElement lss(String, Object)`         | 以编程方式应用样式表风格的属性。             |
| `addClass(...)`  | `UIElement addClass(String)`            | 添加一个类似 CSS 的类。                      |
| `removeClass(...)` | `UIElement removeClass(String)`       | 移除一个类。                                 |
| `hasClass(...)`  | `boolean`                               | 检查类是否存在。                             |
| `transform(...)` | `UIElement transform(Consumer<Transform2D>)` | 应用 2D 变换。                          |
| `animation()`    | `StyleAnimation`                        | 开始一个以此元素为目标的样式动画。           |
| `animation(a -> {})`| `StyleAnimation`                    | 开始一个以此元素为目标的样式动画。（当 `ModularUI` 有效时总是可用） |

---

### 焦点与交互

| 方法           | 签名     | 描述                                          |
| -------------- | -------- | --------------------------------------------- |
| `focus()`      | `void`   | 请求此元素获得焦点。                          |
| `blur()`       | `void`   | 如果此元素已聚焦，则清除其焦点。              |
| `isFocused()`  | `boolean`| 如果此元素已聚焦，则返回 true。               |
| `isHover()`    | `boolean`| 如果鼠标直接悬停在此元素上，则返回 true。     |
| `isSelfOrChildHover()` | `boolean` | 如果自身或子元素被悬停，则返回 true。      |
| `startDrag(...)` | `DragHandler` | 开始一个拖拽操作。                     |

---

### 事件

| 方法                               | 签名                                                      | 描述                              |
| ---------------------------------- | --------------------------------------------------------- | --------------------------------- |
| `addEventListener(...)`            | `UIElement addEventListener(String, UIEventListener)`     | 注册一个冒泡阶段的事件监听器。    |
| `addEventListener(..., true)`      | `UIElement addEventListener(String, UIEventListener, boolean)` | 注册一个捕获阶段的监听器。 |
| `removeEventListener(...)`         | `void`                                                    | 移除一个事件监听器。              |
| `stopInteractionEventsPropagation()` | `UIElement`                                             | 停止鼠标和拖拽事件的传播。        |

---

### 客户端-服务器同步与 RPC

| 方法                     | 签名   | 描述                                |
| ------------------------ | ------ | ----------------------------------- |
| `addSyncValue(...)`      | `UIElement` | 注册一个同步值。                    |
| `removeSyncValue(...)`   | `UIElement` | 注销一个同步值。                    |
| `addRPCEvent(...)`       | `UIElement` | 注册一个 RPC 事件。                 |
| `sendEvent(...)`         | `void` | 向服务器发送一个 RPC 事件。         |
| `sendEvent(..., callback)` | `<T> void` | 发送一个带有响应回调的 RPC 事件。 |

---

### 渲染

| 方法                       | 签名 | 描述                            |
| -------------------------- | ---- | ------------------------------- |
| `isDisplayed()`            | `boolean` | 如果 display 不是 `NONE`，则返回 true。 |
| `isRendered()`            | `boolean` | 如果元素当前被渲染，则返回 true。 |
| `isDragged()`             | `boolean` | 如果元素当前正被拖拽，则返回 true。 |