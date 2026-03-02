# 流体堆栈纹理
{{ version_badge("2.2.1", label="Since", icon="tag") }}
`FluidStackTexture` 使用标准 Minecraft 流体渲染将一个或多个 `FluidStack` 渲染为 GUI 纹理。当提供多个堆栈时，它们每 20 个周期（1 秒）循环一次。
注册表名称：`fluid_stack_texture`
!!!笔记 ””扩展`TransformTexture` — 支持`rotate()`、`scale()`、`transform()`。
---

＃＃ 用法
===“Java”
    ```java
    // Single fluid
    IGuiTexture water = new FluidStackTexture(Fluids.WATER);

    // Multiple fluids — cycle every 20 ticks
    IGuiTexture cycle = new FluidStackTexture(
        Fluids.WATER, Fluids.LAVA
    );

    // From FluidStacks (custom amount)
    IGuiTexture exact = new FluidStackTexture(
        new FluidStack(Fluids.WATER, 1000)
    );

    // Tinted
    IGuiTexture tinted = new FluidStackTexture(Fluids.WATER)
        .setColor(0x8000AAFF);
    ```

===“科特林”
    ```kotlin
    val water = FluidStackTexture(Fluids.WATER)

    val cycle = FluidStackTexture(Fluids.WATER, Fluids.LAVA)
    ```

===“KubeJS”
    ```js
    let water = new FluidStackTexture(Fluids.WATER);

    let cycle = new FluidStackTexture(Fluids.WATER, Fluids.LAVA);
    ```

---

## 字段
| Name | Type | Description |
| ---- | ---- | ----------- |
| `fluids` | `FluidStack[]` | The fluid stacks to display. |

---

＃＃ 方法
| Method | Returns | Description |
| ------ | ------- | ----------- |
| `setFluids(FluidStack...)` | `FluidStackTexture` | Replaces the displayed stacks and resets the cycle index. |
| `setColor(int)` | `FluidStackTexture` | Sets an ARGB tint applied over the rendered fluid. |
| `copy()` | `FluidStackTexture` | Returns a deep copy. |