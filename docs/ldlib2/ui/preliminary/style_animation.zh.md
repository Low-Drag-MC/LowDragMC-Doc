# 风格动画
{{ version_badge("2.2.1", label="Since", icon="tag") }}
`StyleAnimation` 是 `UIElement` 的运行时风格动画制作器。当您想要直接在代码中对样式属性进行动画处理（例如单击、悬停或自定义事件）时，请使用它，而不是仅仅依赖被动的`transition`。
---

＃＃ 用法
`UIElement.animation()` 自动选择当前元素作为动画目标。
===“Java”
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

===“科特林”
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

===“KubeJS”
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

＃＃ 尖端
!!!警告`StyleAnimation.start()` 仅当`ModularUI` 有效（非空）时才起作用。
如果您想要**进入动画**（当元素安装到有效的`ModularUI`时播放一次），请使用回调重载：
===“Java”
    ```java
    target.animation(anim -> {
        anim.duration(0.5f)
            .ease(Eases.QUART_OUT)
            .style(PropertyRegistry.OPACITY, 1f)
            .start();
    });
    ```

当 `ModularUI` 已经可用时，回调会立即调用，或者在 `UIEvents.MUI_CHANGED` 可用时调用一次。
===“科特林”
    ```kotlin
    target.animationDsl {
        duration(0.5f)
        ease(Eases.QUART_OUT)
        style(PropertyRegistry.OPACITY, 1f)
    }
    ```

Kotlin DSL 通常不需要额外的 `start()` 处理：
* `animationDsl { ... }` 默认为`start = true`* 动画执行被推迟到 `ModularUI` 生效
---

## 关键帧
`style(property, frames...)` 支持按进度关键帧 (`0.0 -> 1.0`)。
===“Java”
    ```java
    target.animation()
            .duration(2f)
            .ease(Eases.QUAD_IN_OUT)
            .style(PropertyRegistry.OPACITY,
                    FloatObjectPair.of(0.5f, 0f))
            .start();
    ```

===“科特林”
    ```kotlin
    target.animationDsl {
        duration(2f)
        ease(Eases.QUAD_IN_OUT)
        style(PropertyRegistry.OPACITY,
            at(0.5f, 0f)
        )
    }
    ```

===“KubeJS”
    ```js
    // KubeJS commonly uses single target values:
    target.animation()
        .duration(2)
        .style(PropertyRegistry.OPACITY, 0)
        .start();
    ```

---

## 目标选择
对于多目标动画，从 `ModularUI` 创建动画并按元素或选择器进行选择。
===“Java”
    ```java
    StyleAnimation.of(mui)
            .select(targetElement)
            .select(".card:hover")
            .lss("opacity", 0.5f)
            .start();
    ```

===“科特林”
    ```kotlin
    StyleAnimation.of(mui)
        .select(targetElement)
        .select(".card:hover")
        .lss("opacity", 0.5f)
        .start()
    ```

===“KubeJS”
    ```js
    StyleAnimation.of(mui)
        .select(".card:hover")
        .lss("opacity", 0.5)
        .start();
    ```

---

## 生命周期和控制
`start()` 返回`ISubscription`。调用`unsubscribe()`停止/取消正在运行的动画订阅。
您还可以配置：
* `duration(float)`* `delay(float)`* `ease(IEase)`* `onInterpolate((runtime, element) -> ...)`* `onFinished(element -> ...)`* `origin(StyleOrigin)` 和 `animationOrigin(StyleOrigin)` 用于高级风格源控制
---

## API 参考
| Method | Returns | Description |
| ------ | ------- | ----------- |
| `select(UIElement)` | `StyleAnimation` | Adds one element target. |
| `select(String)` | `StyleAnimation` | Selects targets by selector on current `ModularUI`. |
| `style(Property<T>, T)` | `StyleAnimation` | Animates one property to a final value. |
| `style(Property<T>, FloatObjectPair...)` | `StyleAnimation` | Animates one property with keyframes. |
| `lss(String, Object)` | `StyleAnimation` | Sets target property by LSS property name and value string/object. |
| `duration(float)` | `StyleAnimation` | Sets animation duration in seconds. |
| `delay(float)` | `StyleAnimation` | Sets start delay in seconds. |
| `ease(IEase)` | `StyleAnimation` | Sets easing function. |
| `onInterpolate(BiConsumer<AnimationRuntime, UIElement>)` | `StyleAnimation` | Called every animation frame update. |
| `onFinished(Consumer<UIElement>)` | `StyleAnimation` | Called when animation finishes per target/property completion flow. |
| `start()` | `ISubscription` | Starts the animation. |
