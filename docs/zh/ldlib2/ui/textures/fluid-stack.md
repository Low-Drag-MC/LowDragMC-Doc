# FluidStackTexture

{{ version_badge("2.2.1", label="Since", icon="tag") }}

`FluidStackTexture` 使用标准 Minecraft 流体渲染将一个或多个 `FluidStack` 渲染为 GUI 纹理。当提供多个流体堆时，它们会每 20 tick（1 秒）循环切换。

注册名：`fluid_stack_texture`

!!! note ""
    继承自 `TransformTexture` — 支持 `rotate()`、`scale()`、`transform()`。

---

## 用法

=== "Java"

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
| `fluids` | `FluidStack[]` | 要显示的流体堆。 |

---

## 方法

| 方法 | 返回值 | 描述 |
| ---- | ------ | ---- |
| `setFluids(FluidStack...)` | `FluidStackTexture` | 替换显示的流体堆并重置循环索引。 |
| `setColor(int)` | `FluidStackTexture` | 设置应用于渲染流体的 ARGB 色调。 |
| `copy()` | `FluidStackTexture` | 返回深拷贝。 |