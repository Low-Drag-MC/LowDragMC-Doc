# StyleAnimation

{{ version_badge("2.2.1", label="Since", icon="tag") }}

`StyleAnimation` 是用于 `UIElement` 的运行时样式动画器。  
当你需要在代码中直接为样式属性添加动画时（例如点击、悬停或自定义事件），可以使用它，而不是仅依赖被动的 `transition`。

---

## 使用方法

`UIElement.animation()` 会自动将当前元素作为动画目标。

=== "Java"

    ```java
    target.animation()
            .duration(1f)
            .ease(Eases.QUAD_IN_OUT)
            .style(PropertyRegistry.TRANSFORM_2D, new Transform2D().scale(0.5f).translate(100f, 0))
            .style(PropertyRegistry.OPACITY, 0f)
            .onFinished(element -> {
                target.animation()
                        .ease(Eases.QUART_IN_OUT)
                        .style(PropertyRegistry.TRANSFORM_2D, new Transform2D())
                        .style(PropertyRegistry.OPACITY, 1f)
                        .start();
            })
            .start();
    ```

=== "Kotlin"

    ```kotlin
    target.animationDsl {
        duration(1f)
        ease(Eases.QUAD_IN_OUT)
        style(PropertyRegistry.TRANSFORM_2D, Transform2D().scale(0.5f).translate(100f, 0f))
        style(PropertyRegistry.OPACITY, 0f)
        onFinished {
            target.animationDsl {
                ease(Eases.QUART_IN_OUT)
                style(PropertyRegistry.TRANSFORM_2D, Transform2D())
                style(PropertyRegistry.OPACITY, 1f)
            }
        }
    }
    ```

=== "KubeJS"

    ```js
    target.animation()
        .duration(1)
        .ease(Eases.QUAD_IN_OUT)
        .style(PropertyRegistry.OPACITY, 0)
        .lss("width", 250)
        .onFinished(element => {
            target.animation()
                .ease(Eases.QUART_IN_OUT)
                .style(PropertyRegistry.OPACITY, 1)
                .lss("width", 100)
                .start();
        })
        .start();
    ```

---

## 提示

!!! warning
    `StyleAnimation.start()` 仅在 `ModularUI` 有效（非 null）时才能工作。

如果你需要**入场动画**（元素挂载到有效的 `ModularUI` 时播放一次），可以使用回调重载：

=== "Java"

    ```java
    target.animation(anim -> {
        anim.duration(0.5f)
            .ease(Eases.QUART_OUT)
            .style(PropertyRegistry.OPACITY, 1f)
            .start();
    });
    ```

当 `ModularUI` 已经可用时，回调会立即执行；否则会在 `UIEvents.MUI_CHANGED` 触发后执行一次。

=== "Kotlin"

    ```kotlin
    target.animationDsl {
        duration(0.5f)
        ease(Eases.QUART_OUT)
        style(PropertyRegistry.OPACITY, 1f)
    }
    ```

Kotlin DSL 通常不需要额外处理 `start()`：

* `animationDsl { ... }` 默认 `start = true`
* 动画执行会延迟到 `ModularUI` 变为有效时

---

## 关键帧

`style(property, frames...)` 通过进度（`0.0 -> 1.0`）支持关键帧。

=== "Java"

    ```java
    target.animation()
            .duration(2f)
            .ease(Eases.QUAD_IN_OUT)
            .style(PropertyRegistry.OPACITY,
                    FloatObjectPair.of(0.5f, 0f))
            .start();
    ```

=== "Kotlin"

    ```kotlin
    target.animationDsl {
        duration(2f)
        ease(Eases.QUAD_IN_OUT)
        style(PropertyRegistry.OPACITY,
            at(0.5f, 0f)
        )
    }
    ```

=== "KubeJS"

    ```js
    // KubeJS commonly uses single target values:
    target.animation()
        .duration(2)
        .style(PropertyRegistry.OPACITY, 0)
        .start();
    ```

---

## 目标选择

对于多目标动画，从 `ModularUI` 创建动画并通过元素或选择器进行选择。

=== "Java"

    ```java
    StyleAnimation.of(mui)
            .select(targetElement)
            .select(".card:hover")
            .lss("opacity", 0.5f)
            .start();
    ```

=== "Kotlin"

    ```kotlin
    StyleAnimation.of(mui)
        .select(targetElement)
        .select(".card:hover")
        .lss("opacity", 0.5f)
        .start()
    ```

=== "KubeJS"

    ```js
    StyleAnimation.of(mui)
        .select(".card:hover")
        .lss("opacity", 0.5)
        .start();
    ```

---

## 生命周期与控制

`start()` 返回 `ISubscription`。  
调用 `unsubscribe()` 可以停止/取消正在运行的动画订阅。

你还可以配置：

* `duration(float)`
* `delay(float)`
* `ease(IEase)`
* `onInterpolate((runtime, element) -> ...)`
* `onFinished(element -> ...)`
* `origin(StyleOrigin)` 和 `animationOrigin(StyleOrigin)` 用于高级样式来源控制

---

## API 参考

| 方法 | 返回值 | 描述 |
| ------ | ------- | ----------- |
| `select(UIElement)` | `StyleAnimation` | 添加一个元素目标。 |
| `select(String)` | `StyleAnimation` | 通过选择器在当前 `ModularUI` 上选择目标。 |
| `style(Property<T>, T)` | `StyleAnimation` | 将一个属性动画到最终值。 |
| `style(Property<T>, FloatObjectPair...)` | `StyleAnimation` | 使用关键帧为一个属性添加动画。 |
| `lss(String, Object)` | `StyleAnimation` | 通过 LSS 属性名和值字符串/对象设置目标属性。 |
| `duration(float)` | `StyleAnimation` | 设置动画持续时间（秒）。 |
| `delay(float)` | `StyleAnimation` | 设置开始延迟（秒）。 |
| `ease(IEase)` | `StyleAnimation` | 设置缓动函数。 |
| `onInterpolate(BiConsumer<AnimationRuntime, UIElement>)` | `StyleAnimation` | 每个动画帧更新时调用。 |
| `onFinished(Consumer<UIElement>)` | `StyleAnimation` | 动画完成时调用（每个目标/属性完成流程）。 |
| `start()` | `ISubscription` | 启动动画。 |
