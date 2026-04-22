# FluidStackTexture

{{ version_badge("2.2.1", label="自", icon="tag") }}

`FluidStackTexture` 使用 Minecraft 标准流体渲染将一个或多个 `FluidStack` 渲染为 GUI 纹理。当提供多个堆叠时，它们每 20 tick（1 秒）循环一次。

注册名：`fluid_stack_texture`

!!! note ""
    继承自 `TransformTexture` — 支持 `rotate()`、`scale()`、`transform()`。

---

## 用法

=== "Java"

    ```java
    // 单个流体
    IGuiTexture water = new FluidStackTexture(Fluids.WATER);

    // 多个流体 — 每 20 tick 循环一次
    IGuiTexture cycle = new FluidStackTexture(
        Fluids.WATER, Fluids.LAVA
    );

    // 使用 FluidStack（自定义数量）
    IGuiTexture exact = new FluidStackTexture(
        new FluidStack(Fluids.WATER, 1000)
    );

    // 着色
    IGuiTexture tinted = new FluidStackTexture(Fluids.WATER)
        .setColor(0x8000AAFF);
    ```

=== "Kotlin"

    ```kotlin
    val water = FluidStackTexture(Fluids.WATER)

    val cycle = FluidStackTexture(Fluids.WATER, Fluids.LAVA)
    ```

=== "KubeJS"

    ```js
    let water = new FluidStackTexture(Fluids.WATER);

    let cycle = new FluidStackTexture(Fluids.WATER, Fluids.LAVA);
    ```

---

## 字段

| 名称 | 类型 | 描述 |
| ---- | ---- | ---- |
| `fluids` | `FluidStack[]` | 要显示的流体堆叠。 |

---

## 方法

| 方法 | 返回 | 描述 |
| ------ | ------- | ----------- |
| `setFluids(FluidStack...)` | `FluidStackTexture` | 替换显示的堆叠并重置循环索引。 |
| `setColor(int)` | `FluidStackTexture` | 设置在渲染流体上叠加的 ARGB 着色。 |
| `copy()` | `FluidStackTexture` | 返回深拷贝。 |
