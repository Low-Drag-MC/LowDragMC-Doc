# FluidStackTexture

<VersionBadge version="2.2.1" label="Since" icon="tag" />

`FluidStackTexture` renders one or more `FluidStack`s as a GUI texture using the standard Minecraft fluid rendering. When multiple stacks are provided, they cycle every 20 ticks (1 second).

Registry name: `fluid_stack_texture`

::: info
Extends `TransformTexture` — supports `rotate()`, `scale()`, `transform()`.
:::

---

## Usage

<DocTabs>
<DocTab title="Java">

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

</DocTab>
<DocTab title="Kotlin">

```kotlin
val water = FluidStackTexture(Fluids.WATER)

val cycle = FluidStackTexture(Fluids.WATER, Fluids.LAVA)
```

</DocTab>
<DocTab title="KubeJS">

```js
let water = new FluidStackTexture(Fluids.WATER);

let cycle = new FluidStackTexture(Fluids.WATER, Fluids.LAVA);
```

</DocTab>
</DocTabs>
---

## Fields

| Name | Type | Description |
| ---- | ---- | ----------- |
| `fluids` | `FluidStack[]` | The fluid stacks to display. |

---

## Methods

| Method | Returns | Description |
| ------ | ------- | ----------- |
| `setFluids(FluidStack...)` | `FluidStackTexture` | Replaces the displayed stacks and resets the cycle index. |
| `setColor(int)` | `FluidStackTexture` | Sets an ARGB tint applied over the rendered fluid. |
| `copy()` | `FluidStackTexture` | Returns a deep copy. |