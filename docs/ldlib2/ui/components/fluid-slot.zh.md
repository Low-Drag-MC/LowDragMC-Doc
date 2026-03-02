# 流体槽
{{ version_badge("2.2.1", label="Since", icon="tag") }}
`FluidSlot` 在槽内渲染 `FluidStack` 并进行定向填充可视化。用手中的流体容器点击插槽，即可通过普通 `FluidUtil` API 填充或排出流体。当 JEI、REI 和 EMI 存在时，它还会连接这些 mod。
!!!笔记 ””[UIElement](../element.md){ data-preview } 上记录的所有内容（布局、样式、事件、数据绑定等）也适用于此处。
---

＃＃ 用法
===“Java”
    ```java
    var fluidSlot = new FluidSlot();
    fluidSlot.bind(fluidHandler, 0); // IFluidHandler + tank index
    fluidSlot.setCapacity(16000);
    parent.addChild(fluidSlot);

    // Phantom slot (XEI drag-drop)
    fluidSlot.xeiPhantom();
    ```

===“科特林”
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

===“KubeJS”
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

| XML Attribute | Type | Description |
| ------------- | ---- | ----------- |
| `capacity` | `int` | Tank capacity shown in the tooltip. Default: `0`. |
| `allow-xei-Lookup` | `boolean` | Whether hovering triggers XEI recipe lookup. Default: `true`. |

---

## 内部结构
| Field | CSS class | Description |
| ----- | --------- | ----------- |
| `amountLabel` | `.__fluid-slot_amount-label__` | `Label` in the bottom-right corner showing the fluid amount (e.g. `1.5B`). |

---

## 老虎机风格
!!!信息“”#### <p style="font-size: 1rem;">填充方向</p>
随着数量的增加，流体纹理填充槽的方向。值：`LEFT_TO_RIGHT`、`RIGHT_TO_LEFT`、`UP_TO_DOWN`、`DOWN_TO_UP`、`ALWAYS_FULL`。
默认值：`LEFT_TO_RIGHT`
===“Java”
        ```java
        fluidSlot.slotStyle(style -> style.fillDirection(FillDirection.UP_TO_DOWN));
        ```

===“LSS”
        ```css
        fluid-slot {
            fill-direction: UP_TO_DOWN;
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">悬停覆盖</p>
悬停时在槽上绘制纹理。
默认值：`ColorRectTexture(0x80FFFFFF)`
===“Java”
        ```java
        fluidSlot.slotStyle(style -> style.hoverOverlay(myTexture));
        ```

===“LSS”
        ```css
        fluid-slot {
            hover-overlay: color(#FFFFFF80);
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">槽覆盖</p>
在槽背景上绘制的纹理。
默认值：无（空）
===“Java”
        ```java
        fluidSlot.slotStyle(style -> style.slotOverlay(myOverlay));
        ```

===“LSS”
        ```css
        fluid-slot {
            slot-overlay: sprite("mymod:textures/gui/fluid_slot.png");
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">仅显示插槽覆盖-空</p>
当`true`时，`slot-overlay`仅当槽为空时才绘制。
默认值：`true`
===“Java”
        ```java
        fluidSlot.slotStyle(style -> style.showSlotOverlayOnlyEmpty(false));
        ```

===“LSS”
        ```css
        fluid-slot {
            show-slot-overlay-only-empty: false;
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">show-fluid-tooltips</p>
悬停时是否显示流体名称、数量/容量、温度和状态工具提示。
默认值：`true`
===“Java”
        ```java
        fluidSlot.slotStyle(style -> style.showFluidTooltips(false));
        ```

===“LSS”
        ```css
        fluid-slot {
            show-fluid-tooltips: false;
        }
        ```

---

## 值绑定
`FluidSlot` 扩展`BindableUIElement<FluidStack>`：
===“Java”
    ```java
    fluidSlot.bind(DataBindingBuilder.fluidStackS2C(
        () -> tank.getFluidInTank(0)
    ).build());
    ```

有关完整详细信息，请参阅[Data Bindings](../data_bindings.md){ data-preview }。
---

## 字段
| Name | Type | Access | Description |
| ---- | ---- | ------ | ----------- |
| `amountLabel` | `Label` | `public final` | Label showing the compact fluid amount. |
| `slotStyle` | `SlotStyle` | `private` (getter) | Current slot style. |
| `fluid` | `FluidStack` | `private` (getter) | The currently displayed fluid. |
| `capacity` | `int` | `getter/setter` | Tank capacity used for fill calculations and tooltips. |
| `allowClickFilled` | `boolean` | `getter/setter` | Whether clicking with a container fills it from the tank. Default: `true`. |
| `allowClickDrained` | `boolean` | `getter/setter` | Whether clicking with a container drains it into the tank. Default: `true`. |

---

＃＃ 方法
| Method | Returns | Description |
| ------ | ------- | ----------- |
| `bind(IFluidHandler, int)` | `FluidSlot` | Binds to a fluid handler at the given tank index. Syncs fluid and capacity. |
| `setFluid(FluidStack)` | `FluidSlot` | Sets the displayed fluid and notifies listeners. |
| `setFluid(FluidStack, boolean)` | `FluidSlot` | Sets the fluid; second param controls notification. |
| `slotStyle(Consumer<SlotStyle>)` | `FluidSlot` | Configures style fluently. |
| `xeiPhantom()` | `FluidSlot` | Enables XEI phantom drag-drop on this slot. |
| `xeiRecipeIngredient(IngredientIO)` | `FluidSlot` | Marks as recipe ingredient in XEI recipe views. |
| `xeiRecipeSlot()` | `FluidSlot` | Marks as recipe slot with default `IngredientIO.NONE`. |
| `xeiRecipeSlot(IngredientIO, float)` | `FluidSlot` | Marks as recipe slot with given I/O type and chance. |
| `getFluidAmountText()` | `Component` | Returns the compact amount text shown in `amountLabel`. |
| `getFullTooltipTexts()` | `List<Component>` | Returns the combined fluid and custom tooltip lines. |
