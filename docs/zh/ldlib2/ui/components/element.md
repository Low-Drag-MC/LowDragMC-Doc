# UIElement

{{ version_badge("2.2.1", label="自", icon="tag") }}

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
    element.addClass("add-class")
    element.removeClass("add-class")
    root.addChild(element);
    ```

=== "Kotlin"

    ```kotlin
    val root = element root@{
        element({
            layout = { size(40.px) }
            style = { background(MCSprites.RECT) }
            focusable = true
            cls = {
                +"add-class"
                -"remove-class"
            }
        }) {
            events { UIEvents.MOUSE_DOWN += { it.currentElement.focus() } }
        }
    }
    ```

=== "KubeJS"

    ```js
    let element = new UIElement();
    element.style(style => style.background(MCSprites.RECT));
    element.layout(layout => layout.width(40).height(40));
    element.setFocusable(true)
    element.addEventListener(UIEvents.MOUSE_DOWN, e => e.currentElement.focus());
    element.addClass("add-class")
    element.removeClass("add-class")
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

=== "Kotlin"

    ```kotlin
    element({
        layout = { width(20.pct) }
        style = { background(MCSprites.RECT) }
    }) { }

    element.layoutDsl { 
        width(20.pct)
    }
    element.styleDsl { 
        background(MCSprites.RECT)
    }
    ```

=== "KubeJS"

    ```js
    element.style(style -=> style.background(...));
    element.layout(layout => layout.width(...));
    element.getStyle().background(...);
    element.getLayout().width(...);
    ```
### 布局属性

使用前最好先阅读 [布局](../preliminary/layout.md){ data-preview }。

!!! info ""
    #### <p style="font-size: 1rem;">display</p>

    控制元素是否参与布局。`FLEX` 启用 flex 布局，`GRID` 启用 grid 布局，`NONE` 将元素从布局计算中移除，`CONTENTS` 不影响布局但会渲染其子元素。

    === "Java"

        ```java
        layout.display(TaffyDisplay.FLEX);
        layout.display(TaffyDisplay.GRID); // enable grid layout
        element.setDisplay(false); // equals to layout.display(TaffyDisplay.NONE);
        ```

    === "Kotlin"

        ```kotlin
        layout {
            display(false)
            display(TaffyDisplay.GRID)
        }
        ```

    === "LSS"

        ```css
        element {
            display: flex;
            display: grid;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">layout-direction</p>

    设置布局方向。通常从父元素继承。

    === "Java"

        ```java
        layout.layoutDirection(TaffyDirection.LTR);
        ```

    === "Kotlin"

        ```kotlin
        layout {
            direction(TaffyDirection.LTR)
        }
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

    === "Kotlin"

        ```kotlin
        layout {
            flexBasis(1)
        }
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

    === "Kotlin"

        ```kotlin
        layout {
            flex(1)
        }
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

    === "Kotlin"

        ```kotlin
        layout {
            flexGrow(1)
        }
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

    === "Kotlin"

        ```kotlin
        layout {
            flexShrink(1)
        }
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
        layout.flexDirection(FlexDirection.ROW);
        ```

    === "Kotlin"

        ```kotlin
        layout {
            flexDirection(FlexDirection.ROW)
        }
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
        layout.wrap(FlexWrap.WRAP);
        ```

    === "Kotlin"

        ```kotlin
        layout {
            wrap(FlexWrap.WRAP)
        }
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
        layout.positionType(TaffyPosition.ABSOLUTE);
        ```

    === "Kotlin"

        ```kotlin
        layout {
            position(TaffyPosition.ABSOLUTE)
        }
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

    === "Kotlin"

        ```kotlin
        layout = {
            pos {
                top(10.px)
                left(10.px)
                bottom(auto)
            }
        }
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

    === "Kotlin"

        ```kotlin
        layout = {
            margin {
                top(5.px)
                all(3.px)
            }
        }
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

    === "Kotlin"

        ```kotlin
        layout = {
            padding { left(8) }
        }
        ```

    === "LSS"

        ```css
        element {
            padding-left: 8;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">gap-*</p>

    `*`: row / column / all

    设置 flex 布局中子元素之间的间距。

    === "Java"

        ```java
        layout.rowGap(6);
        ```

    === "Kotlin"

        ```kotlin
        layout = {
            gap { row(6) }
        }
        ```

    === "LSS"

        ```css
        element {
            gap-row: 6;
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

    === "Kotlin"

        ```kotlin
        layout = {
            width(100)
            width(20.pct) // 20%
        }
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

    === "Kotlin"

        ```kotlin
        layout = {
            widheightth(100)
            height(20.pct) // 20%
        }
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

    === "Kotlin"

        ```kotlin
        layout = {
            minWidth(20);
        }
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

    === "Kotlin"

        ```kotlin
        layout = {
            maxHeight(200);
        }
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

    === "Kotlin"

        ```kotlin
        layout = {
            aspectRate(1);
        }
        ```

    === "LSS"

        ```css
        element {
            aspect-rate: 1;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">align-items</p>

    沿交叉轴对齐子元素（容器属性）。

    === "Java"

        ```java
        layout.alignItems(AlignItems.CENTER);
        ```

    === "Kotlin"

        ```kotlin
        layout = {
            alignItems(AlignItems.CENTER)
        }
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
        layout.justifyContent(AlignContent.CENTER);
        ```

    === "Kotlin"

        ```kotlin
        layout = {
            justifyContent(AlignContent.CENTER)
        }
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
        layout.alignSelf(AlignItems.CENTER);
        ```

    === "Kotlin"

        ```kotlin
        layout = {
            alignSelf(AlignItems.CENTER)
        }
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
        layout.alignContent(AlignContent.CENTER);
        ```

    === "Kotlin"

        ```kotlin
        layout = {
            alignContent(AlignContent.CENTER)
        }
        ```

    === "LSS"

        ```css
        element {
            align-content: center;
        }
        ```

---

### Grid 属性

!!! note ""
    要使用 grid 布局，请在容器元素上设置 `display(TaffyDisplay.GRID)`。模板属性在**容器**上定义 grid 结构，而 `grid-row` 和 `grid-column` 放在**子元素**上以控制其位置。

!!! info ""
    #### <p style="font-size: 1rem;">grid-template-rows</p>

    定义 grid 容器的显式行轨道。

    支持的轨道大小：`Npx`（固定像素）、`N%`（百分比）、`Nfr`（分数单位）、`auto`、`min-content`、`max-content`、`minmax(min, max)`、`fit-content(limit)`、`repeat(count, size)`、`[name]`（命名线）。多个轨道以空格分隔。

    === "Java"

        ```java
        layout.display(TaffyDisplay.GRID);
        layout.gridTemplateRows("1fr 1fr 1fr");             // three equal rows
        layout.gridTemplateRows("50px 1fr auto");           // fixed, flexible, auto
        layout.gridTemplateRows("repeat(3, 100px)");        // three 100px rows
        layout.gridTemplateRows("[header] 50px [content] 1fr [footer] 50px"); // named lines
        ```

    === "Kotlin"

        ```kotlin
        layout = {
            display(TaffyDisplay.GRID)
            grid {
                templateRows("1fr 1fr 1fr")
                templateRows("repeat(3, 100px)")
            }
        }
        ```

    === "LSS"

        ```css
        element {
            display: grid;
            grid-template-rows: 1fr 1fr 1fr;
            grid-template-rows: repeat(3, 100px);
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">grid-template-columns</p>

    定义 grid 容器的显式列轨道。使用与 `grid-template-rows` 相同的轨道尺寸语法。

    === "Java"

        ```java
        layout.display(TaffyDisplay.GRID);
        layout.gridTemplateColumns("10px 1fr 10px");    // fixed margins + flexible center
        layout.gridTemplateColumns("repeat(3, 1fr)");   // three equal columns
        layout.gridTemplateColumns("minmax(100px, 1fr) 200px");
        ```

    === "Kotlin"

        ```kotlin
        layout = {
            display(TaffyDisplay.GRID)
            grid {
                templateColumns("10px 1fr 10px")
                templateColumns("repeat(3, 1fr)")
            }
        }
        ```

    === "LSS"

        ```css
        element {
            display: grid;
            grid-template-columns: 10px 1fr 10px;
            grid-template-columns: repeat(3, 1fr);
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">grid-template-areas</p>

    为 grid 单元格分配命名区域。每个引号字符串代表一行；其中的单词命名该行中的单元格。使用 `.` 表示空单元格。所有行必须具有相同数量的单元格。

    === "Java"

        ```java
        layout.display(TaffyDisplay.GRID);
        layout.gridTemplateColumns("1fr 1fr 1fr");
        layout.gridTemplateRows("auto 1fr auto");
        layout.gridTemplateAreas(
            "\"header header header\" \"sidebar content content\" \"footer footer footer\""
        );
        // Children reference areas via gridRow/gridColumn by area name
        ```

    === "Kotlin"

        ```kotlin
        layout = {
            display(TaffyDisplay.GRID)
            grid {
                templateColumns("1fr 1fr 1fr")
                templateRows("auto 1fr auto")
                templateAreas("\"header header header\" \"sidebar content content\" \"footer footer footer\"")
            }
        }
        ```

    === "LSS"

        ```css
        element {
            display: grid;
            grid-template-rows: auto 1fr auto;
            grid-template-columns: 1fr 1fr 1fr;
            grid-template-areas: "header header header" "sidebar content content" "footer footer footer";
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">grid-auto-rows</p>

    为隐式创建的行设置行轨道大小——即未被 `grid-template-rows` 覆盖的行。

    === "Java"

        ```java
        layout.gridAutoRows("auto");
        layout.gridAutoRows("minmax(50px, auto)");
        ```

    === "Kotlin"

        ```kotlin
        layout = {
            display(TaffyDisplay.GRID)
            grid { autoRows("minmax(50px, auto)") }
        }
        ```

    === "LSS"

        ```css
        element {
            display: grid;
            grid-auto-rows: minmax(50px, auto);
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">grid-auto-columns</p>

    为隐式创建的列设置列轨道大小。

    === "Java"

        ```java
        layout.gridAutoColumns("auto");
        layout.gridAutoColumns("100px");
        ```

    === "Kotlin"

        ```kotlin
        layout = {
            display(TaffyDisplay.GRID)
            grid { autoColumns("100px") }
        }
        ```

    === "LSS"

        ```css
        element {
            display: grid;
            grid-auto-columns: 100px;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">grid-auto-flow</p>

    控制自动放置的元素如何填充 grid。`ROW` 优先填充行（默认）；`COLUMN` 优先填充列。`ROW_DENSE` / `COLUMN_DENSE` 会回填之前的空隙。

    === "Java"

        ```java
        layout.gridAutoFlow(GridAutoFlow.ROW);
        layout.gridAutoFlow(GridAutoFlow.COLUMN);
        layout.gridAutoFlow(GridAutoFlow.ROW_DENSE);
        ```

    === "Kotlin"

        ```kotlin
        layout = {
            display(TaffyDisplay.GRID)
            grid { autoFlow(GridAutoFlow.COLUMN) }
        }
        ```

    === "LSS"

        ```css
        element {
            display: grid;
            grid-auto-flow: column;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">grid-row</p>

    控制**子元素**在 grid 容器中的行位置。请在子元素上设置，而不是容器上。

    位置值：`"1"`（行号）、`"1 / 3"`（起始/结束行）、`"span 2"`（跨越 N 行）、`"1 / span 2"`（起始 + 跨越）、`"header"`（命名区域行）、`"-1"`（最后一行）。

    === "Java"

        ```java
        child.layout(layout -> layout.gridRow("1"));          // row 1
        child.layout(layout -> layout.gridRow("1 / 3"));      // rows 1-3
        child.layout(layout -> layout.gridRow("span 2"));     // span 2 rows
        child.layout(layout -> layout.gridRow("header"));     // named area row
        child.layout(layout -> layout.gridRow("-1"));         // last row line
        ```

    === "Kotlin"

        ```kotlin
        element({
            layout = {
                grid { row("1 / span 2") }
            }
        }) { }
        ```

    === "LSS"

        ```css
        child {
            grid-row: 1;
            grid-row: 1 / 3;
            grid-row: span 2;
            grid-row: header;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">grid-column</p>

    控制**子元素**在 grid 容器中的列位置。使用与 `grid-row` 相同的位置语法。

    === "Java"

        ```java
        child.layout(layout -> layout.gridColumn("2"));
        child.layout(layout -> layout.gridColumn("1 / span 3"));
        child.layout(layout -> layout.gridColumn("sidebar"));
        ```

    === "Kotlin"

        ```kotlin
        element({
            layout = {
                grid { column("1 / span 2") }
            }
        }) { }
        ```

    === "LSS"

        ```css
        child {
            grid-column: 2;
            grid-column: 1 / span 3;
            grid-column: sidebar;
        }
        ```

---

### 基本属性

!!! info ""
    #### <p style="font-size: 1rem;">background</p>

    设置在元素内容下方的背景渲染，例如颜色、矩形、图像。


    === "Java"

        ```java
        layout.background(MCSprites.BORDER);
        ```

    === "Kotlin"

        ```kotlin
        style = {
            background(MCSprites.BORDER)
        }
        ```

    === "LSS"
        查看 [LSS 中的纹理](../textures/lss.md) 了解 lss 支持。

        ```css
        element {
            background: #FFF;
            background: rect(#2ff, 3);
            background: sprite(ldlib2:textures/gui/icon.png);
        }
        ```


!!! info ""
    #### <p style="font-size: 1rem;">overflow</p>

    控制如何处理溢出内容。如果设为 'hidden'，边界之外的内容将被隐藏。

    === "Java"

        ```java
        style.overflow(YogaOverflow.HIDDEN);
        element.setOverflowVisible(false); // equals to style.overflow(YogaOverflow.HIDDEN);
        ```

    === "Kotlin"

        ```kotlin
        style = {
            overflowVisible(false)
        }
        ```

    === "LSS"

        ```css
        element {
            overflow: hidden;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">overlay</p>

    控制在元素内容上方绘制的覆盖层渲染。

    === "Java"

        ```java
        layout.overlay(...);
        ```

    === "Kotlin"

        ```kotlin
        style = {
            overlay(MCSprites.BORDER)
        }
        ```

    === "LSS"
        查看 [LSS 中的纹理](../textures/lss.md) 了解 lss 支持。

        ```css
        element {
            overlay: #FFF;
            overlay: rect(#2ff, 3);
            overlay: sprite(ldlib2:textures/gui/icon.png);
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">tooltips</p>

    定义当鼠标悬停在元素上时显示的悬停提示内容。

    === "Java"

        ```java
        layout.tooltips("tips.0", "tips.1");
        layout.appendTooltips("tips.2");
        ```

    === "Kotlin"

        ```kotlin
        style = {
            tooltips("tips.0", "tips.1")
        }
        ```

    === "LSS"

        ```css
        element {
            tooltips: this is my tooltips;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">z-index</p>

    控制元素的堆叠顺序。数值较大的元素显示在数值较小的元素之上。

    === "Java"

        ```java
        layout.zIndex(1);
        ```

    === "Kotlin"

        ```kotlin
        style = {
            zIndex(1)
        }
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

    === "Kotlin"

        ```kotlin
        style = {
            opacity(0.8)
        }
        ```

    === "LSS"

        ```css
        element {
            opacity: 0.8;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">color</p>

    使用 ARGB 乘数对当前元素的 `background` 和 `overlay` 纹理进行着色。
    此着色仅应用于当前元素，不会影响子元素。

    === "Java"

        ```java
        style.color(0x80FF8080);
        ```

    === "Kotlin"

        ```kotlin
        style = {
            color(0x80FF8080.toInt())
        }
        ```

    === "LSS"

        ```css
        element {
            color: #80FF8080;
        }
        ```


!!! info ""
    #### <p style="font-size: 1rem;">overflow-clip</p>

    如果元素的 overflow 设为 `hidden`，则根据给定纹理的红色通道裁剪元素渲染。

    <div style="text-align: center;">
        <video controls>
        <source src="../../assets/overflow-clip.mp4" type="video/mp4">
        您的浏览器不支持视频播放。
        </video>
    </div>

    === "Java"

        ```java
        layout.overflowClip(true);
        ```

    === "Kotlin"

        ```kotlin
        style = {
            overflowClip(true)
        }
        ```

    === "LSS"
        查看 [LSS 中的纹理](../textures/lss.md) 了解 lss 支持。

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

    === "Kotlin"

        ```kotlin
        style = {
            transform2D(Transform2D.identity().scale(0.5f))
        }
        ```

    === "LSS"

        ```css
        element {
            transform: translate(10, 20) rotate(45) scale(2, 2) pivot(0.5, 0.5);
            transform: translateX(10) scale(0.5);
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">transition</p>

    定义属性变化之间的动画过渡效果。

    <div style="text-align: center;">
        <video controls>
        <source src="../../assets/transition.mp4" type="video/mp4">
        您的浏览器不支持视频播放。
        </video>
    </div>

    === "Java"

        ```java
        layout.transition(new Transition(Map.of(LayoutProperties.HEIGHT, new Animation(1, 0, Eases.LINEAR))));
        ```

    === "Kotlin"

        ```kotlin
        style = {
            transition(Transition(mapOf(LayoutProperties.HEIGHT to Animation(1f, 0f, Eases.LINEAR))))
        }
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

    selector:disabled {
    }

    selector:not(.__disabled__) {
    }

    selector:not(:disabled) {
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

    selector:focused {
    }

    selector:not(.__focused__) {
    }

    selector:not(:focused) {
    }
    ```

### `hover state`
当元素被悬停时，会自动添加一个 `__hovered__` 类。
为了兼容 CSS，你可以使用 `:hover` 作为选择器简写，它等价于 `.__hovered__`。

```css
selector.__hovered__ {
}

selector:hover {
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

| 名称           | 类型          | 访问权限                 | 描述                                              |
| -------------- | ------------- | ------------------------ | ------------------------------------------------- |
| `layoutNode`   | `YogaNode`    | protected (getter)       | 用于布局计算的基础 Yoga 节点。                    |
| `modularUI`    | `ModularUI`   | private (getter)         | 此元素所属的 `ModularUI` 实例。                   |
| `id`           | `String`      | private (getter/setter)  | 元素 ID，用于选择器和查询。                       |
| `classes`      | `Set<String>` | private (getter)         | 应用于此元素的类似 CSS 的类列表。                 |
| `styleBag`     | `StyleBag`    | private (getter)         | 存储已解析的样式候选值和计算后的样式。            |
| `styles`       | `List<Style>` | private (getter)         | 附加到此元素的内联样式。                          |
| `layoutStyle`  | `LayoutStyle` | private (getter)         | 布局相关样式的包装器（基于 Yoga）。               |
| `style`        | `BasicStyle`  | private (getter)         | 基础视觉样式（background、overlay 着色、opacity、zIndex 等）。 |
| `isVisible`    | `boolean`     | private (getter/setter)  | 元素是否可见。                                    |
| `isActive`     | `boolean`     | private (getter/setter)  | 元素是否参与逻辑和事件。                          |
| `focusable`    | `boolean`     | private (getter/setter)  | 元素是否可以获得焦点。                            |
| `isInternalUI` | `boolean`     | private (getter)         | 标记内部（组件拥有的）元素。                      |

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
| `getLocalStylesheets()` | `List<Stylesheet>`                       | 返回附加到此元素的本地样式表。 |
| `addLocalStylesheet(...)` | `UIElement addLocalStylesheet(Stylesheet)` | 添加本地样式表（仅自身 + 后代）。  |
| `addLocalStylesheet(...)` | `UIElement addLocalStylesheet(String)`     | 从 LSS 文本解析并添加本地样式表。     |
| `removeLocalStylesheet(...)` | `UIElement removeLocalStylesheet(Stylesheet)` | 从此元素作用域中移除本地样式表。 |
| `clearLocalStylesheets()` | `UIElement`                              | 移除附加到此元素的所有本地样式表。 |
| `transform(...)`   | `UIElement transform(Consumer<Transform2D>)` | 应用 2D 变换。                          |
| `animation()`      | `StyleAnimation`                             | 创建一个以此元素为目标的样式动画。查看 [StyleAnimation](../preliminary/style_animation.md){ data-preview }。 |
| `animation(a -> {})`| `StyleAnimation`                            | 如果 `ModularUI` 有效则立即运行动画设置，或在变为有效时通过 `MUI_CHANGED` 运行一次。 |

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

#### 用法

=== "Java"

    ```java
    // Bubble-phase listener (default): fires after children handle the event
    element.addEventListener(UIEvents.MOUSE_DOWN, event -> {
        event.currentElement.focus();
    });

    // Capture-phase listener: fires before children handle the event
    element.addEventListener(UIEvents.CLICK, event -> {
        event.stopPropagation(); // prevent children from seeing this event
    }, true);

    // Removing a specific listener
    UIEventListener listener = event -> { /* ... */ };
    element.addEventListener(UIEvents.CLICK, listener);
    element.removeEventListener(UIEvents.CLICK, listener);

    // Stop all mouse/drag events from bubbling to parent elements
    element.stopInteractionEventsPropagation();
    ```

=== "Kotlin"

    ```kotlin
    element {
        // Bubble events (default)
        events {
            UIEvents.MOUSE_DOWN += UIEventListener { it.currentElement.focus() }
            UIEvents.CLICK on { event -> /* handle click */ }
        }
        // Capture events
        events(capture = true) {
            UIEvents.CLICK on { it.stopPropagation() }
        }
    }
    ```

=== "KubeJS"

    ```js
    element.addEventListener(UIEvents.MOUSE_DOWN, event => {
        event.currentElement.focus();
    });
    ```

#### 可用事件

| 事件 | 描述 |
| ----- | ----------- |
| `UIEvents.MOUSE_DOWN` | 鼠标按钮在元素上按下 |
| `UIEvents.MOUSE_UP` | 鼠标按钮释放 |
| `UIEvents.CLICK` | 鼠标点击（在同一元素上按下并释放） |
| `UIEvents.DOUBLE_CLICK` | 鼠标双击 |
| `UIEvents.MOUSE_MOVE` | 鼠标在元素上移动 |
| `UIEvents.MOUSE_ENTER` | 鼠标指针进入元素边界 |
| `UIEvents.MOUSE_LEAVE` | 鼠标指针离开元素边界 |
| `UIEvents.MOUSE_WHEEL` | 鼠标滚轮滚动 |
| `UIEvents.DRAG_ENTER` | 拖拽操作进入此元素 |
| `UIEvents.DRAG_LEAVE` | 拖拽操作离开此元素 |
| `UIEvents.DRAG_UPDATE` | 拖拽目标位置已更新 |
| `UIEvents.DRAG_SOURCE_UPDATE` | 拖拽源位置已更新 |
| `UIEvents.DRAG_PERFORM` | 物品被放置到此元素上 |
| `UIEvents.DRAG_END` | 拖拽操作结束 |
| `UIEvents.FOCUS` | 元素获得键盘焦点 |
| `UIEvents.BLUR` | 元素失去键盘焦点 |
| `UIEvents.FOCUS_IN` | 焦点移入此元素的子树 |
| `UIEvents.FOCUS_OUT` | 焦点移出此元素的子树 |
| `UIEvents.KEY_DOWN` | 键盘按键按下 |
| `UIEvents.KEY_UP` | 键盘按键释放 |
| `UIEvents.CHAR_TYPED` | 输入了一个可打印字符 |
| `UIEvents.HOVER_TOOLTIPS` | 悬停时收集悬停提示 |
| `UIEvents.VALIDATE_COMMAND` | 斜杠命令验证 |
| `UIEvents.EXECUTE_COMMAND` | 斜杠命令执行 |
| `UIEvents.LAYOUT_CHANGED` | 布局已重新计算 |
| `UIEvents.STYLE_CHANGED` | 样式已重新计算 |
| `UIEvents.REMOVED` | 元素已从其父元素中移除 |
| `UIEvents.ADDED` | 元素已添加到父元素 |
| `UIEvents.MUI_CHANGED` | `ModularUI` 关联已更改 |
| `UIEvents.TICK` | 周期性的客户端 tick |

---

### 客户端-服务端同步与 RPC

| 方法                     | 签名   | 描述                                |
| ------------------------ | ------ | ----------------------------------- |
| `addSyncValue(...)`      | `UIElement` | 注册一个同步值。                    |
| `removeSyncValue(...)`   | `UIElement` | 注销一个同步值。                    |
| `addRPCEvent(...)`       | `RPCEmitter` | 注册一个 RPC 事件。                 |
| `sendEvent(...)`         | `void` | 向服务端发送一个 RPC 事件。         |
| `sendEvent(..., callback)` | `<T> void` | 发送一个带有响应回调的 RPC 事件。 |

#### 服务端事件

服务端事件监听器在**服务端**而不是客户端上运行。它们使用相同的 `UIEvents` 类型常量，并支持冒泡和捕获阶段。它们通过内部 RPC 机制自动同步。

=== "Java"

    ```java
    // Runs on the server when UIEvents.TICK fires
    element.addServerEventListener(UIEvents.TICK, event -> {
        // server-side tick logic
    });
    ```

=== "Kotlin"

    ```kotlin
    element {
        serverEvents {
            UIEvents.TICK on { event ->
                // server-side logic
            }
        }
        // Capture phase on server
        serverEvents(capture = true) {
            UIEvents.CLICK on { it.stopPropagation() }
        }
    }
    ```

#### RPC 事件

RPC（远程过程调用）事件允许客户端显式调用服务端逻辑，并可选择接收响应。

=== "Java"

    ```java
    // Register an RPC event during element initialization
    RPCEmitter emitter = element.addRPCEvent(ele ->
        RPCEventBuilder.simple(UIEvents.CLICK, (e, args) -> {
            // This runs on the server
            ServerPlayer player = e.modularUI.player;
            player.sendSystemMessage(Component.literal("Hello from server!"));
        })
    );

    // Trigger the RPC from client (e.g., inside a client event listener)
    element.addEventListener(UIEvents.CLICK, event ->
        element.sendEvent(emitter.event())
    );
    ```

#### 数据绑定

数据绑定自动在服务端和客户端之间同步数值。在 Java 中使用 `addSyncValue`，或在 Kotlin 中使用 `bind*` DSL 辅助函数。

=== "Java"

    ```java
    // Bidirectional: synced server <-> client
    element.addSyncValue(new SyncValue<>(Integer.class,
        () -> myData.count,
        v  -> myData.count = v
    ));
    ```

=== "Kotlin"

    ```kotlin
    element({}) {
        // Bidirectional (server <-> client)
        bind({ myData.count }, { myData.count = it })

        // Server -> client only
        bindS2C({ myData.count })

        // Client -> server only
        bindC2S({ v -> myData.count = v })

        // Bind a mutable property directly (bidirectional)
        bind(myData::count)
    }
    ```

---

### 渲染

| 方法                       | 签名 | 描述                            |
| -------------------------- | ---- | ------------------------------- |
| `isDisplayed()`            | `boolean` | 如果 display 不是 `NONE`，则返回 true。 |
