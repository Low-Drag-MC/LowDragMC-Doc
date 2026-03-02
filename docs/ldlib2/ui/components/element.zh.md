# 用户界面元素
{{ version_badge("2.2.1", label="Since", icon="tag") }}
`UIElement`是LDLib2中最基本、最常用的UI组件。所有的UI组件都继承自它。
从概念上讲，它类似于 HTML 中的 `#!html <div/>` 元素：一个通用容器，可以通过行为进行样式设置、布局和扩展。
因此，本页中介绍的所有内容也适用于 LDLib2 中的所有其他 UI 组件，因此请务必仔细阅读。
---

## 用法
===“Java”
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

===“科特林”
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

===“KubeJS”
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

## XML```xml
<element id="my_id" class="class1 class2" focusable="false" visible="true" active="true" style="background: #fff; width: 50">
    <!-- add children here -->
    <button text="click me!"/>
    <inventory-slots/>
</element>
```

---

## 风格
!!!注意“布局”布局属性实际上也是样式。
UIElement 样式（包括布局）可以通过以下方式访问：===“Java”
    ```java
    element.style(style -> style.background(...));
    element.layout(layout -> layout.width(...));
    element.getStyle().background(...);
    element.getLayout().width(...);
    ```

===“科特林”
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

===“KubeJS”
    ```js
    element.style(style -=> style.background(...));
    element.layout(layout => layout.width(...));
    element.getStyle().background(...);
    element.getLayout().width(...);
    ```
### 布局属性
使用前最好先阅读[Layout](../preliminary/layout.md){ data-preview }。
!!!信息“”#### <p style="font-size: 1rem;">显示</p>
控制元素是否参与布局。 `FLEX` 启用弹性布局，`GRID` 启用网格布局，`NONE` 从布局计算中删除元素，`CONTENTS` 不影响布局但渲染其子元素。
===“Java”
        ```java
        layout.display(TaffyDisplay.FLEX);
        layout.display(TaffyDisplay.GRID); // enable grid layout
        element.setDisplay(false); // equals to layout.display(TaffyDisplay.NONE);
        ```

===“科特林”
        ```kotlin
        layout {
            display(false)
            display(TaffyDisplay.GRID)
        }
        ```

===“LSS”
        ```css
        element {
            display: flex;
            display: grid;
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">布局方向</p>
设置布局方向。通常是从父母遗传的。
===“Java”
        ```java
        layout.layoutDirection(TaffyDirection.LTR);
        ```

===“科特林”
        ```kotlin
        layout {
            direction(TaffyDirection.LTR)
        }
        ```
        
===“LSS”
        ```css
        element {
            layout-direction: ltr;
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">flex-basis</p>
设置弹性增长/收缩之前的初始主尺寸。支持**点**、**百分比**和**自动**。
===“Java”
        ```java
        layout.flexBasis(1);
        ```

===“科特林”
        ```kotlin
        layout {
            flexBasis(1)
        }
        ```
      
===“LSS”
        ```css
        element {
            flex-basis: 1;
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">flex</p>
使单元沿主轴线灵活。
===“Java”
        ```java
        layout.flex(1);
        ```

===“科特林”
        ```kotlin
        layout {
            flex(1)
        }
        ```
      
===“LSS”
        ```css
        element {
            flex: 1;
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">flex-grow</p>
控制当有额外空间可用时元素的增长量。
===“Java”
        ```java
        layout.flexGrow(1);
        ```

===“科特林”
        ```kotlin
        layout {
            flexGrow(1)
        }
        ```
      
===“LSS”
        ```css
        element {
            flex-grow: 1;
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">flex-shrink</p>
控制空间不足时元素收缩的程度。
===“Java”
        ```java
        layout.flexShrink(1);
        ```

===“科特林”
        ```kotlin
        layout {
            flexShrink(1)
        }
        ```
      
===“LSS”
        ```css
        element {
            flex-shrink: 1;
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">弯曲方向</p>
定义主轴方向，例如`ROW` 或`COLUMN`。
===“Java”
        ```java
        layout.flexDirection(FlexDirection.ROW);
        ```

===“科特林”
        ```kotlin
        layout {
            flexDirection(FlexDirection.ROW)
        }
        ```
      
===“LSS”
        ```css
        element {
            flex-direction: row;
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">flex-wrap</p>
控制子项是否换行为多行。
===“Java”
        ```java
        layout.wrap(FlexWrap.WRAP);
        ```

===“科特林”
        ```kotlin
        layout {
            wrap(FlexWrap.WRAP)
        }
        ```
      
===“LSS”
        ```css
        element {
            flex-wrap: wrap;
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">位置</p>
设置定位模式。 `RELATIVE`参与布局，`ABSOLUTE`不影响同级。
===“Java”
        ```java
        layout.positionType(TaffyPosition.ABSOLUTE);
        ```

===“科特林”
        ```kotlin
        layout {
            position(TaffyPosition.ABSOLUTE)
        }
        ```
      
===“LSS”
        ```css
        element {
            position: absolute;
        }
        ```

!!!信息“”####<p style="font-size: 1rem;">上/右/下/左/开始/结束/水平/垂直/全部</p>
当`position` 是`RELATIVE` 或`ABSOLUTE` 时使用的偏移量。
===“Java”
        ```java
        layout.top(10);
        layout.leftPercent(30); // 30%
        layout.allAuto()
        ```

===“科特林”
        ```kotlin
        layout = {
            pos {
                top(10.px)
                left(10.px)
                bottom(auto)
            }
        }
        ```

===“LSS”
        ```css
        element {
            top: 10;
            left: 30%;
            all: auto;
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">margin-*</p>    
`*`：上/右/下/左/开始/结束/水平/垂直/全部
设置元素周围的外部间距。
===“Java”
        ```java
        layout.marginTop(5);
        layout.marginAll(3);
        ```

===“科特林”
        ```kotlin
        layout = {
            margin {
                top(5.px)
                all(3.px)
            }
        }
        ```

===“LSS”
        ```css
        element {
            margin-top: 5;
            margin-all: 3;
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">填充-*</p>
`*`：上/右/下/左/开始/结束/水平/垂直/全部
设置边框和内容之间的内部间距。
===“Java”
        ```java
        layout.paddingLeft(8);
        ```

===“科特林”
        ```kotlin
        layout = {
            padding { left(8) }
        }
        ```

===“LSS”
        ```css
        element {
            padding-left: 8;
        }
        ```

!!!信息“”####<p style="font-size: 1rem;">间隙-*</p>
`*`：行/列/全部
设置弹性布局中子项之间的间距。
===“Java”
        ```java
        layout.rowGap(6);
        ```

===“科特林”
        ```kotlin
        layout = {
            gap { row(6) }
        }
        ```

===“LSS”
        ```css
        element {
            gap-row: 6;
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">宽度</p>
设置元素宽度。支持**点**、**百分比**和**自动**模式。
===“Java”
        ```java
        layout.width(100);
        layout.widthPercent(20); // 20%
        ```

===“科特林”
        ```kotlin
        layout = {
            width(100)
            width(20.pct) // 20%
        }
        ```
        
===“LSS”
        ```css
        element {
            width: 100;
            width: 20%;
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">高度</p>
设置元素高度。支持**点**、**百分比**和**自动**模式。
===“Java”
        ```java
        layout.height(50);
        ```

===“科特林”
        ```kotlin
        layout = {
            widheightth(100)
            height(20.pct) // 20%
        }
        ```
        
===“LSS”
        ```css
        element {
            height: 50;
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">最小宽度/最小高度</p>
设置最小尺寸约束。
===“Java”
        ```java
        layout.minWidth(20);
        ```

===“科特林”
        ```kotlin
        layout = {
            minWidth(20);
        }
        ```

===“LSS”
        ```css
        element {
            min-width: 20;
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">最大宽度/最大高度</p>
设置最大尺寸约束。
===“Java”
        ```java
        layout.maxHeight(200);
        ```

===“科特林”
        ```kotlin
        layout = {
            maxHeight(200);
        }
        ```

===“LSS”
        ```css
        element {
            max-height: 200;
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">纵横比</p>
锁定宽高比。对于方形或图标元素很有用。
===“Java”
        ```java
        layout.aspectRate(1);
        ```

===“科特林”
        ```kotlin
        layout = {
            aspectRate(1);
        }
        ```

===“LSS”
        ```css
        element {
            aspect-rate: 1;
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">对齐项目</p>
沿横轴对齐子项（容器属性）。
===“Java”
        ```java
        layout.alignItems(AlignItems.CENTER);
        ```

===“科特林”
        ```kotlin
        layout = {
            alignItems(AlignItems.CENTER)
        }
        ```

===“LSS”
        ```css
        element {
            align-items: center;
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">justify-content</p>
沿主轴对齐子项（容器属性）。
===“Java”
        ```java
        layout.justifyContent(AlignContent.CENTER);
        ```

===“科特林”
        ```kotlin
        layout = {
            justifyContent(AlignContent.CENTER)
        }
        ```

===“LSS”
        ```css
        element {
            justify-content: center;
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">align-self</p>
覆盖单个元素的横轴对齐。
===“Java”
        ```java
        layout.alignSelf(AlignItems.CENTER);
        ```

===“科特林”
        ```kotlin
        layout = {
            alignSelf(AlignItems.CENTER)
        }
        ```

===“LSS”
        ```css
        element {
            align-self: center;
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">对齐内容</p>
当启用 `flex-wrap` 时对齐换行。
===“Java”
        ```java
        layout.alignContent(AlignContent.CENTER);
        ```

===“科特林”
        ```kotlin
        layout = {
            alignContent(AlignContent.CENTER)
        }
        ```

===“LSS”
        ```css
        element {
            align-content: center;
        }
        ```

---

### 网格属性
!!!笔记 ””要使用网格布局，请在容器元素上设置`display(TaffyDisplay.GRID)`。模板属性定义**容器**上的网格结构，而`grid-row`和`grid-column`放置在**子**元素上以控制它们的位置。
!!!信息“”#### <p style="font-size: 1rem;">网格模板行</p>
定义网格容器的显式行轨道。
支持的轨道大小：`Npx`（固定像素）、`N%`（百分比）、`Nfr`（小数单位）、`auto`、`min-content`、`max-content`、`minmax(min, max)`、`fit-content(limit)`、`repeat(count, size)`、`[name]`（命名行）。多个轨道是用空格分隔的。
===“Java”
        ```java
        layout.display(TaffyDisplay.GRID);
        layout.gridTemplateRows("1fr 1fr 1fr");             // three equal rows
        layout.gridTemplateRows("50px 1fr auto");           // fixed, flexible, auto
        layout.gridTemplateRows("repeat(3, 100px)");        // three 100px rows
        layout.gridTemplateRows("[header] 50px [content] 1fr [footer] 50px"); // named lines
        ```

===“科特林”
        ```kotlin
        layout = {
            display(TaffyDisplay.GRID)
            grid {
                templateRows("1fr 1fr 1fr")
                templateRows("repeat(3, 100px)")
            }
        }
        ```

===“LSS”
        ```css
        element {
            display: grid;
            grid-template-rows: 1fr 1fr 1fr;
            grid-template-rows: repeat(3, 100px);
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">网格模板列</p>
定义网格容器的显式列轨道。使用与 `grid-template-rows` 相同的轨道大小调整语法。
===“Java”
        ```java
        layout.display(TaffyDisplay.GRID);
        layout.gridTemplateColumns("10px 1fr 10px");    // fixed margins + flexible center
        layout.gridTemplateColumns("repeat(3, 1fr)");   // three equal columns
        layout.gridTemplateColumns("minmax(100px, 1fr) 200px");
        ```

===“科特林”
        ```kotlin
        layout = {
            display(TaffyDisplay.GRID)
            grid {
                templateColumns("10px 1fr 10px")
                templateColumns("repeat(3, 1fr)")
            }
        }
        ```

===“LSS”
        ```css
        element {
            display: grid;
            grid-template-columns: 10px 1fr 10px;
            grid-template-columns: repeat(3, 1fr);
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">网格模板区域</p>
将命名区域分配给网格单元。每个带引号的字符串代表一行；其中的单词命名该行中的单元格。对空单元格使用 `.`。所有行必须具有相同数量的单元格。
===“Java”
        ```java
        layout.display(TaffyDisplay.GRID);
        layout.gridTemplateColumns("1fr 1fr 1fr");
        layout.gridTemplateRows("auto 1fr auto");
        layout.gridTemplateAreas(
            "\"header header header\" \"sidebar content content\" \"footer footer footer\""
        );
        // Children reference areas via gridRow/gridColumn by area name
        ```

===“科特林”
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

===“LSS”
        ```css
        element {
            display: grid;
            grid-template-rows: auto 1fr auto;
            grid-template-columns: 1fr 1fr 1fr;
            grid-template-areas: "header header header" "sidebar content content" "footer footer footer";
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">网格自动行</p>
设置隐式创建的行的行轨道大小 - `grid-template-rows` 未覆盖的行。
===“Java”
        ```java
        layout.gridAutoRows("auto");
        layout.gridAutoRows("minmax(50px, auto)");
        ```

===“科特林”
        ```kotlin
        layout = {
            display(TaffyDisplay.GRID)
            grid { autoRows("minmax(50px, auto)") }
        }
        ```

===“LSS”
        ```css
        element {
            display: grid;
            grid-auto-rows: minmax(50px, auto);
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">网格自动列</p>
设置隐式创建的列的列轨道大小。
===“Java”
        ```java
        layout.gridAutoColumns("auto");
        layout.gridAutoColumns("100px");
        ```

===“科特林”
        ```kotlin
        layout = {
            display(TaffyDisplay.GRID)
            grid { autoColumns("100px") }
        }
        ```

===“LSS”
        ```css
        element {
            display: grid;
            grid-auto-columns: 100px;
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">网格自动流</p>
控制自动放置的项目如何填充网格。 `ROW` 首先填充行（默认）； `COLUMN` 首先填充列。 `ROW_DENSE` / `COLUMN_DENSE` 回补之前的空白。
===“Java”
        ```java
        layout.gridAutoFlow(GridAutoFlow.ROW);
        layout.gridAutoFlow(GridAutoFlow.COLUMN);
        layout.gridAutoFlow(GridAutoFlow.ROW_DENSE);
        ```

===“科特林”
        ```kotlin
        layout = {
            display(TaffyDisplay.GRID)
            grid { autoFlow(GridAutoFlow.COLUMN) }
        }
        ```

===“LSS”
        ```css
        element {
            display: grid;
            grid-auto-flow: column;
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">网格行</p>
控制网格容器中**子**元素的行位置。将其设置在子项上，而不是容器上。
放置值：`"1"`（行号）、`"1 / 3"`（开始/结束行）、`"span 2"`（跨N行）、`"1 / span 2"`（开始+跨）、`"header"`（命名区域行）、`"-1"`（最后一行）。
===“Java”
        ```java
        child.layout(layout -> layout.gridRow("1"));          // row 1
        child.layout(layout -> layout.gridRow("1 / 3"));      // rows 1–3
        child.layout(layout -> layout.gridRow("span 2"));     // span 2 rows
        child.layout(layout -> layout.gridRow("header"));     // named area row
        child.layout(layout -> layout.gridRow("-1"));         // last row line
        ```

===“科特林”
        ```kotlin
        element({
            layout = {
                grid { row("1 / span 2") }
            }
        }) { }
        ```

===“LSS”
        ```css
        child {
            grid-row: 1;
            grid-row: 1 / 3;
            grid-row: span 2;
            grid-row: header;
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">网格列</p>
控制网格容器中**子**元素的列位置。使用与 `grid-row` 相同的放置语法。
===“Java”
        ```java
        child.layout(layout -> layout.gridColumn("2"));
        child.layout(layout -> layout.gridColumn("1 / span 3"));
        child.layout(layout -> layout.gridColumn("sidebar"));
        ```

===“科特林”
        ```kotlin
        element({
            layout = {
                grid { column("1 / span 2") }
            }
        }) { }
        ```

===“LSS”
        ```css
        child {
            grid-column: 2;
            grid-column: 1 / span 3;
            grid-column: sidebar;
        }
        ```

---

### 基本属性
!!!信息“”#### <p style="font-size: 1rem;">背景</p>
设置元素下方的背景渲染，如颜色、矩形、图像。

===“Java”
        ```java
        layout.background(MCSprites.BORDER);
        ```

===“科特林”
        ```kotlin
        style = {
            background(MCSprites.BORDER)
        }
        ```

===“LSS”检查 [Texture in LSS](../textures/lss.md) 的 lss 支持。
        ```css
        element {
            background: #FFF;
            background: rect(#2ff, 3);
            background: sprite(ldlib2:textures/gui/icon.png);
        }
        ```


!!!信息“”#### <p style="font-size: 1rem;">溢出</p>
控制如何处理溢出内容。如果“隐藏”，则超出边界的内容将被隐藏。
===“Java”
        ```java
        style.overflow(YogaOverflow.HIDDEN);
        element.setOverflowVisible(false); // equals to style.overflow(YogaOverflow.HIDDEN);
        ```

===“科特林”
        ```kotlin
        style = {
            overflowVisible(false)
        }
        ```

===“LSS”
        ```css
        element {
            overflow: hidden;
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">覆盖</p>
控制在元素内容上方绘制的叠加渲染。
===“Java”
        ```java
        layout.overlay(...);
        ```

===“科特林”
        ```kotlin
        style = {
            overlay(MCSprites.BORDER)
        }
        ```

===“LSS”检查 [Texture in LSS](../textures/lss.md) 的 lss 支持。
        ```css
        element {
            overlay: #FFF;
            overlay: rect(#2ff, 3);
            overlay: sprite(ldlib2:textures/gui/icon.png);
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">工具提示</p>
定义悬停元素时显示的工具提示内容。
===“Java”
        ```java
        layout.tooltips("tips.0"， "tips.1");
        layout.appendTooltips("tips.2");
        ```

===“科特林”
        ```kotlin
        style = {
            tooltips("tips.0"， "tips.1")
        }
        ```

===“LSS”
        ```css
        element {
            tooltips: this is my tooltips;
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">z-index</p>
控制元素的堆叠顺序。较高的值出现在较低的值上方。
===“Java”
        ```java
        layout.zIndex(1);
        ```

===“科特林”
        ```kotlin
        style = {
            zIndex(1)
        }
        ```

===“LSS”
        ```css
        element {
            z-index: 1;
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">不透明度</p>
设置元素的透明度级别。 `0` 完全透明，`1` 完全不透明。
===“Java”
        ```java
        layout.opacity(0.8f);
        ```

===“科特林”
        ```kotlin
        style = {
            opacity(0.8)
        }
        ```

===“LSS”
        ```css
        element {
            opacity: 0.8;
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">颜色</p>
使用 ARGB 乘数对当前元素的 `background` 和 `overlay` 纹理进行着色。此色调仅应用于当前元素，不会影响子元素。
===“Java”
        ```java
        style.color(0x80FF8080);
        ```

===“科特林”
        ```kotlin
        style = {
            color(0x80FF8080.toInt())
        }
        ```

===“LSS”
        ```css
        element {
            color: #80FF8080;
        }
        ```


!!!信息“”#### <p style="font-size: 1rem;">溢出剪辑</p>
如果元素的溢出设置为`hidden`，则根据给定纹理的红色通道剪辑元素渲染。
<div style="text-align: center;"><video controls><source src="../../assets/overflow-clip.mp4" type="video/mp4">您的浏览器不支持视频。</video></div>
===“Java”
        ```java
        layout.overflowClip(true);
        ```

===“科特林”
        ```kotlin
        style = {
            overflowClip(true)
        }
        ```

===“LSS”检查 [Texture in LSS](../textures/lss.md) 的 lss 支持。
        ```css
        element {
            overflow-clip: sprite(ldlib2:textures/gui/icon.png);
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">transform-2d</p>
应用 2D 变换，例如平移、缩放或旋转。
===“Java”
        ```java
        layout.transform2D(Transform2D.identity().scale(0.5f));
        element.transform(transform -> transform.translate(10, 0))
        ```

===“科特林”
        ```kotlin
        style = {
            transform2D(Transform2D.identity().scale(0.5f))
        }
        ```

===“LSS”
        ```css
        element {
            transform: translate(10, 20) rotate(45) scale(2， 2) pivot(0.5, 0.5);
            transform: translateX(10) scale(0.5);
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">过渡</p>
定义属性更改之间的动画过渡。
<div style="text-align: center;"><video controls><source src="../../assets/transition.mp4" type="video/mp4">您的浏览器不支持视频。</video></div>
===“Java”
        ```java
        layout.transition(new Transition(Map.of(LayoutProperties.HEIGHT, new Animation(1, 0, Eases.LINEAR))));
        ```

===“科特林”
        ```kotlin
        style = {
            transition(Transition(mapOf(LayoutProperties.HEIGHT to Animation(1f, 0f, Eases.LINEAR))))
        }
        ```

===“LSS”
        ```css
        element {
            transition: width 1;
            transition: background 0.8 quad_in_out,
                        transform 0.3;
        }
        ```


---
## 州
###`isVisible`当`isVisible` 设置为`false` 时，该元素及其所有子元素将不再被渲染。与 `display: NONE` 不同，这不会影响布局计算。带有`isVisible = false`的元素也被排除在命中测试之外，因此许多UI事件（例如点击）将不会被触发。
###`isActive`当`isActive` 设置为`false` 时，元素可能会失去其交互行为（例如，无法再单击按钮），并且元素将不再接收`tick` 事件。
!!!笔记当`isActive`设置为`false`时，`__disabled__`类会自动添加到元素中。您可以使用以下 LSS 选择器来设置活动和非活动状态的样式：
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

###`focusable`默认情况下，元素为`focusable: false`。有些组件（例如`TextField`）在设计上是可聚焦的，但您仍然可以手动更改元素的可聚焦状态。只有当`focusable`设置为`true`时，才能通过`focus()`或通过鼠标交互来聚焦元素。
!!!笔记当元素处于`focused`状态时，会自动添加`__focused__`类。您可以使用以下 LSS 选择器设置聚焦和未聚焦状态的样式：
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

###`hover state`当元素悬停时，会自动添加 `__hovered__` 类。为了CSS兼容性，您可以使用`:hover`作为选择器糖，这相当于`.__hovered__`。
```css
selector.__hovered__ {
}

selector:hover {
}
```

###`isInternalUI`这是一种特殊状态，指示元素是否是组件的内部部分。例如，`button` 包含用于呈现其标签的内部`text` 元素。
从语义上讲，不允许直接添加、删除或重新排序内部元素。但是，您仍然可以通过编辑器或 XML 编辑它们的样式并管理它们的子元素。在编辑器中，内部元素在层次结构视图中显示为灰色。
在 XML 中，您可以使用 `#!xml <internal index="..."/>` 标记访问内部元素，其中 `index` 指定要引用哪个内部元素：
```xml
<button>
    <!-- obtain the internal text component here -->
    <internal index="0">
    </internal>
</button>
```
!!!笔记 ””在 LSS 中，您可以使用 :host 和 :internal 显式定位主机或内部元素。默认情况下，除非受到限制，选择器都会匹配两者。    ```css
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
| Name           | Type          | Access                  | Description                                              |
| -------------- | ------------- | ----------------------- | -------------------------------------------------------- |
| `layoutNode`   | `YogaNode`    | protected (getter)      | Underlying Yoga node used for layout calculation.        |
| `modularUI`    | `ModularUI`   | private (getter)        | The `ModularUI` instance this element belongs to.        |
| `id`           | `String`      | private (getter/setter) | Element ID, used by selectors and queries.               |
| `classes`      | `Set<String>` | private (getter)        | CSS-like class list applied to this element.             |
| `styleBag`     | `StyleBag`    | private (getter)        | Stores resolved style candidates and computed styles.    |
| `styles`       | `List<Style>` | private (getter)        | Inline styles attached to this element.                  |
| `layoutStyle`  | `LayoutStyle` | private (getter)        | Layout-related style wrapper (Yoga-based).               |
| `style`        | `BasicStyle`  | private (getter)        | Basic visual styles (background, overlay tint color, opacity, zIndex, etc.). |
| `isVisible`    | `boolean`     | private (getter/setter) | Whether the element is visible.                          |
| `isActive`     | `boolean`     | private (getter/setter) | Whether the element participates in logic and events.    |
| `focusable`    | `boolean`     | private (getter/setter) | Whether the element can receive focus.                   |
| `isInternalUI` | `boolean`     | private (getter)        | Marks internal (component-owned) elements.               |

---

＃＃ 方法
### 布局和几何
| Method                        | Signature                                 | Description                                              |
| ----------------------------- | ----------------------------------------- | -------------------------------------------------------- |
| `getLayout()`                 | `LayoutStyle`                             | Returns the layout style controller.                     |
| `layout(...)`                 | `UIElement layout(Consumer<LayoutStyle>)` | Modify layout properties fluently.                       |
| `node(...)`                   | `UIElement node(Consumer<YogaNode>)`      | Directly modify the underlying Yoga node.                |
| `getPositionX()`              | `float`                                   | Absolute X position on screen.                           |
| `getPositionY()`              | `float`                                   | Absolute Y position on screen.                           |
| `getSizeWidth()`              | `float`                                   | Computed width of the element.                           |
| `getSizeHeight()`             | `float`                                   | Computed height of the element.                          |
| `getContentX()`               | `float`                                   | X position of content area (excluding border & padding). |
| `getContentY()`               | `float`                                   | Y position of content area.                              |
| `getContentWidth()`           | `float`                                   | Width of content area.                                   |
| `getContentHeight()`          | `float`                                   | Height of content area.                                  |
| `adaptPositionToScreen()`     | `void`                                    | Adjusts position to stay within screen bounds.           |
| `adaptPositionToElement(...)` | `void`                                    | Adjusts position to stay inside another element.         |

---

### 树结构
| Method               | Signature                             | Description                                       |
| -------------------- | ------------------------------------- | ------------------------------------------------- |
| `getParent()`        | `UIElement`                           | Returns parent element, or `null`.                |
| `getChildren()`      | `List<UIElement>`                     | Returns an unmodifiable list of children.         |
| `addChild(...)`      | `UIElement addChild(UIElement)`       | Adds a child element.                             |
| `addChildren(...)`   | `UIElement addChildren(UIElement...)` | Adds multiple children.                           |
| `removeChild(...)`   | `boolean removeChild(UIElement)`      | Removes a child element.                          |
| `removeSelf()`       | `boolean`                             | Removes this element from its parent.             |
| `clearAllChildren()` | `void`                                | Removes all children.                             |
| `isAncestorOf(...)`  | `boolean`                             | Checks if this element is an ancestor of another. |
| `getStructurePath()` | `ImmutableList<UIElement>`            | Path from root to this element.                   |

---

### 风格和类别
| Method             | Signature                                    | Description                                         |
| ------------------ | -------------------------------------------- | --------------------------------------------------- |
| `style(...)`       | `UIElement style(Consumer<BasicStyle>)`      | Modify inline visual styles.                        |
| `lss(...)`         | `UIElement lss(String, Object)`              | Apply a stylesheet-style property programmatically. |
| `addClass(...)`    | `UIElement addClass(String)`                 | Adds a CSS-like class.                              |
| `removeClass(...)` | `UIElement removeClass(String)`              | Removes a class.                                    |
| `hasClass(...)`    | `boolean`                                    | Checks if the class exists.                         |
| `getLocalStylesheets()` | `List<Stylesheet>`                       | Returns local stylesheets attached to this element. |
| `addLocalStylesheet(...)` | `UIElement addLocalStylesheet(Stylesheet)` | Adds a local stylesheet (self + descendants only).  |
| `addLocalStylesheet(...)` | `UIElement addLocalStylesheet(String)`     | Parses and adds local stylesheet from LSS text.     |
| `removeLocalStylesheet(...)` | `UIElement removeLocalStylesheet(Stylesheet)` | Removes a local stylesheet from this element scope. |
| `clearLocalStylesheets()` | `UIElement`                              | Removes all local stylesheets attached to this element. |
| `transform(...)`   | `UIElement transform(Consumer<Transform2D>)` | Applies a 2D transform.                             |
| `animation()`      | `StyleAnimation`                             | Creates a style animation targeting this element. See [StyleAnimation](../preliminary/style_animation.md){ data-preview }. |
| `animation(a -> {})`| `StyleAnimation`                            | Runs animation setup immediately if `ModularUI` is valid, or once on `MUI_CHANGED` when it becomes valid. |

---

### 焦点与互动
| Method           | Signature     | Description                                          |
| ---------------- | ------------- | ---------------------------------------------------- |
| `focus()`        | `void`        | Requests focus for this element.                     |
| `blur()`         | `void`        | Clears focus if this element is focused.             |
| `isFocused()`    | `boolean`     | Returns true if this element is focused.             |
| `isHover()`      | `boolean`     | Returns true if mouse is directly over this element. |
| `isSelfOrChildHover()` | `boolean`     | Returns true if a slef or child is hovered.                  |
| `startDrag(...)` | `DragHandler` | Starts a drag operation.                             |

---

### 活动
| Method                               | Signature                                                      | Description                              |
| ------------------------------------ | -------------------------------------------------------------- | ---------------------------------------- |
| `addEventListener(...)`              | `UIElement addEventListener(String, UIEventListener)`          | Registers a bubble-phase event listener. |
| `addEventListener(..., true)`        | `UIElement addEventListener(String, UIEventListener, boolean)` | Registers a capture-phase listener.      |
| `removeEventListener(...)`           | `void`                                                         | Removes an event listener.               |
| `stopInteractionEventsPropagation()` | `UIElement`                                                    | Stops mouse & drag event propagation.    |

＃＃＃＃ 用法
===“Java”
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

===“科特林”
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

===“KubeJS”
    ```js
    element.addEventListener(UIEvents.MOUSE_DOWN, event => {
        event.currentElement.focus();
    });
    ```

#### 可用活动
| Event | Description |
| ----- | ----------- |
| `UIEvents.MOUSE_DOWN` | Mouse button pressed over the element |
| `UIEvents.MOUSE_UP` | Mouse button released |
| `UIEvents.CLICK` | Mouse clicked (pressed and released on the same element) |
| `UIEvents.DOUBLE_CLICK` | Mouse double-clicked |
| `UIEvents.MOUSE_MOVE` | Mouse moved while over the element |
| `UIEvents.MOUSE_ENTER` | Mouse pointer entered the element's bounds |
| `UIEvents.MOUSE_LEAVE` | Mouse pointer left the element's bounds |
| `UIEvents.MOUSE_WHEEL` | Mouse wheel scrolled |
| `UIEvents.DRAG_ENTER` | A drag operation entered this element |
| `UIEvents.DRAG_LEAVE` | A drag operation left this element |
| `UIEvents.DRAG_UPDATE` | Drag target position updated |
| `UIEvents.DRAG_SOURCE_UPDATE` | Drag source position updated |
| `UIEvents.DRAG_PERFORM` | Item was dropped on this element |
| `UIEvents.DRAG_END` | Drag operation ended |
| `UIEvents.FOCUS` | Element gained keyboard focus |
| `UIEvents.BLUR` | Element lost keyboard focus |
| `UIEvents.FOCUS_IN` | Focus moved into this element's subtree |
| `UIEvents.FOCUS_OUT` | Focus moved out of this element's subtree |
| `UIEvents.KEY_DOWN` | Keyboard key pressed |
| `UIEvents.KEY_UP` | Keyboard key released |
| `UIEvents.CHAR_TYPED` | A printable character was typed |
| `UIEvents.HOVER_TOOLTIPS` | Tooltip collection when hovering |
| `UIEvents.VALIDATE_COMMAND` | Slash command validation |
| `UIEvents.EXECUTE_COMMAND` | Slash command execution |
| `UIEvents.LAYOUT_CHANGED` | Layout was recalculated |
| `UIEvents.STYLE_CHANGED` | Styles were recomputed |
| `UIEvents.REMOVED` | Element was removed from its parent |
| `UIEvents.ADDED` | Element was added to a parent |
| `UIEvents.MUI_CHANGED` | `ModularUI` association changed |
| `UIEvents.TICK` | Periodic client-side tick |

---

### 客户端-服务器同步和 RPC
| Method                     | Signature   | Description                                |
| -------------------------- | ----------- | ------------------------------------------ |
| `addSyncValue(...)`        | `UIElement` | Registers a synced value.                  |
| `removeSyncValue(...)`     | `UIElement` | Unregisters a synced value.                |
| `addRPCEvent(...)`         | `RPCEmitter` | Registers an RPC event.                    |
| `sendEvent(...)`           | `void`      | Sends an RPC event to server.              |
| `sendEvent(..., callback)` | `<T> void`  | Sends an RPC event with response callback. |

#### 服务器事件
服务器端事件侦听器在 **服务器** 上运行，而不是在客户端上运行。它们使用相同的 `UIEvents` 类型常量并支持冒泡阶段和捕获阶段。它们通过内部 RPC 机制自动同步。
===“Java”
    ```java
    // Runs on the server when UIEvents.TICK fires
    element.addServerEventListener(UIEvents.TICK, event -> {
        // server-side tick logic
    });
    ```

===“科特林”
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
RPC（远程过程调用）事件允许客户端显式调用服务器上的逻辑并可选择接收响应。
===“Java”
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
数据绑定自动同步服务器和客户端之间的值。在 Java 中使用 `addSyncValue`，或在 Kotlin 中使用 `bind*` DSL 帮助器。
===“Java”
    ```java
    // Bidirectional: synced server <-> client
    element.addSyncValue(new SyncValue<>(Integer.class,
        () -> myData.count,
        v  -> myData.count = v
    ));
    ```

===“科特林”
    ```kotlin
    element({}) {
        // Bidirectional (server <-> client)
        bind({ myData.count }, { myData.count = it })

        // Server → client only
        bindS2C({ myData.count })

        // Client → server only
        bindC2S({ v -> myData.count = v })

        // Bind a mutable property directly (bidirectional)
        bind(myData::count)
    }
    ```

---

### 渲染
| Method                       | Signature | Description                            |
| ---------------------------- | --------- | -------------------------------------- |
| `isDisplayed()`              | `boolean` | Returns true if display is not `NONE`. |
