# FluidSlot

{{ version_badge("2.2.1", label="Since", icon="tag") }}

`FluidSlot` 在槽位内渲染 `FluidStack`，带有方向性填充可视化效果。手持流体容器点击槽位时，会通过原版 `FluidUtil` API 进行填充或抽取。当 JEI、REI 和 EMI 模组存在时，还会自动与其集成。

!!! note ""
    [UIElement](../element.md){ data-preview } 中记录的所有内容（布局、样式、事件、数据绑定等）同样适用于此组件。

---

## 使用方法

=== "Java"

    ```java
    var fluidSlot = new FluidSlot();
    fluidSlot.bind(fluidHandler, 0); // IFluidHandler + tank index
    fluidSlot.setCapacity(16000);
    parent.addChild(fluidSlot);

    // Phantom slot (XEI drag-drop)
    fluidSlot.xeiPhantom();
    ```

=== "Kotlin"

    ```kotlin
    fluidSlot({
        layout { width(18).height(18) }
    }) {
        api {
            bind(fluidHandler, 0)
            setCapacity(16000)
        }
    }
    ```

=== "KubeJS"

    ```js
    let slot = new FluidSlot();
    slot.bind(fluidHandler, 0);
    slot.setCapacity(16000);
    parent.addChild(slot);
    ```

---

## XML

```xml
<!-- Basic slot -->
<fluid-slot capacity="16000"/>

<!-- Disable XEI lookup -->
<fluid-slot capacity="4000" allow-xei-Lookup="false"/>
```

| XML 属性 | 类型 | 描述 |
| ------------- | ---- | ----------- |
| `capacity` | `int` | 工具提示中显示的储罐容量。默认值：`0`。 |
| `allow-xei-Lookup` | `boolean` | 悬停时是否触发 XEI 配方查询。默认值：`true`。 |

---

## 内部结构

| 字段 | CSS 类名 | 描述 |
| ----- | --------- | ----------- |
| `amountLabel` | `.__fluid-slot_amount-label__` | 右下角显示流体量的 `Label`（如 `1.5B`）。 |

---

## 槽位样式

!!! info ""
    #### <p style="font-size: 1rem;">fill-direction</p>

    流体纹理随数量增加而填充槽位的方向。可选值：`LEFT_TO_RIGHT`、`RIGHT_TO_LEFT`、`UP_TO_DOWN`、`DOWN_TO_UP`、`ALWAYS_FULL`。

    默认值：`LEFT_TO_RIGHT`

    === "Java"

        ```java
        fluidSlot.slotStyle(style -> style.fillDirection(FillDirection.UP_TO_DOWN));
        ```

    === "LSS"

        ```css
        fluid-slot {
            fill-direction: UP_TO_DOWN;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">hover-overlay</p>

    悬停时在槽位上绘制的纹理。

    默认值：`ColorRectTexture(0x80FFFFFF)`

    === "Java"

        ```java
        fluidSlot.slotStyle(style -> style.hoverOverlay(myTexture));
        ```

    === "LSS"

        ```css
        fluid-slot {
            hover-overlay: color(#FFFFFF80);
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">slot-overlay</p>

    在槽位背景上绘制的纹理。

    默认值：无（空）

    === "Java"

        ```java
        fluidSlot.slotStyle(style -> style.slotOverlay(myOverlay));
        ```

    === "LSS"

        ```css
        fluid-slot {
            slot-overlay: sprite("mymod:textures/gui/fluid_slot.png");
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">show-slot-overlay-only-empty</p>

    为 `true` 时，`slot-overlay` 仅在槽位为空时绘制。

    默认值：`true`

    === "Java"

        ```java
        fluidSlot.slotStyle(style -> style.showSlotOverlayOnlyEmpty(false));
        ```

    === "LSS"

        ```css
        fluid-slot {
            show-slot-overlay-only-empty: false;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">show-fluid-tooltips</p>

    悬停时是否显示流体名称、数量/容量、温度和状态的工具提示。

    默认值：`true`

    === "Java"

        ```java
        fluidSlot.slotStyle(style -> style.showFluidTooltips(false));
        ```

    === "LSS"

        ```css
        fluid-slot {
            show-fluid-tooltips: false;
        }
        ```

---

## 值绑定

`FluidSlot` 扩展自 `BindableUIElement<FluidStack>`：

=== "Java"

    ```java
    fluidSlot.bind(DataBindingBuilder.fluidStackS2C(
        () -> tank.getFluidInTank(0)
    ).build());
    ```

详见 [数据绑定](../data_bindings.md){ data-preview }。

---

## 字段

| 名称 | 类型 | 访问权限 | 描述 |
| ---- | ---- | ------ | ----------- |
| `amountLabel` | `Label` | `public final` | 显示紧凑格式流体量的标签。 |
| `slotStyle` | `SlotStyle` | `private`（有 getter） | 当前槽位样式。 |
| `fluid` | `FluidStack` | `private`（有 getter） | 当前显示的流体。 |
| `capacity` | `int` | `getter/setter` | 用于填充计算和工具提示的储罐容量。 |
| `allowClickFilled` | `boolean` | `getter/setter` | 点击容器时是否允许从储罐填充。默认值：`true`。 |
| `allowClickDrained` | `boolean` | `getter/setter` | 点击容器时是否允许抽取到储罐。默认值：`true`。 |

---

## 方法

| 方法 | 返回值 | 描述 |
| ------ | ------- | ----------- |
| `bind(IFluidHandler, int)` | `FluidSlot` | 绑定到指定索引的流体处理器。同步流体和容量。 |
| `setFluid(FluidStack)` | `FluidSlot` | 设置显示的流体并通知监听器。 |
| `setFluid(FluidStack, boolean)` | `FluidSlot` | 设置流体；第二个参数控制是否通知。 |
| `slotStyle(Consumer<SlotStyle>)` | `FluidSlot` | 以流式方式配置样式。 |
| `xeiPhantom()` | `FluidSlot` | 在此槽位上启用 XEI 虚拟拖放。 |
| `xeiRecipeIngredient(IngredientIO)` | `FluidSlot` | 在 XEI 配方视图中标记为配方原料。 |
| `xeiRecipeSlot()` | `FluidSlot` | 标记为配方槽位，默认 `IngredientIO.NONE`。 |
| `xeiRecipeSlot(IngredientIO, float)` | `FluidSlot` | 标记为配方槽位，指定 I/O 类型和概率。 |
| `getFluidAmountText()` | `Component` | 返回 `amountLabel` 中显示的紧凑格式数量文本。 |
| `getFullTooltipTexts()` | `List<Component>` | 返回合并后的流体和自定义工具提示行。 |
