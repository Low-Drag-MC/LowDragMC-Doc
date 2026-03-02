# StyleAnimation

{{ version_badge("2.2.1", label="Since", icon="tag") }}

`StyleAnimation` is a runtime style animator for `UIElement`.  
Use it when you want to animate style properties directly in code (for example on click, hover, or custom events), instead of relying only on passive `transition`.

---

## Usage

`UIElement.animation()` automatically selects the current element as the animation target.

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

## Tips

!!! warning
    `StyleAnimation.start()` only works when `ModularUI` is valid (non-null).

If you want an **enter animation** (play once when the element is mounted into a valid `ModularUI`), use the callback overload:

=== "Java"

    ```java
    target.animation(anim -> {
        anim.duration(0.5f)
            .ease(Eases.QUART_OUT)
            .style(PropertyRegistry.OPACITY, 1f)
            .start();
    });
    ```

The callback is invoked immediately when `ModularUI` is already available, or once after `UIEvents.MUI_CHANGED` when it becomes available.

=== "Kotlin"

    ```kotlin
    target.animationDsl {
        duration(0.5f)
        ease(Eases.QUART_OUT)
        style(PropertyRegistry.OPACITY, 1f)
    }
    ```

Kotlin DSL does not usually need extra `start()` handling:

* `animationDsl { ... }` defaults to `start = true`
* animation execution is deferred until `ModularUI` becomes valid

---

## Keyframes

`style(property, frames...)` supports keyframes by progress (`0.0 -> 1.0`).

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

## Target Selection

For multi-target animation, create an animation from `ModularUI` and select by element or selector.

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

## Lifecycle and Control

`start()` returns `ISubscription`.  
Call `unsubscribe()` to stop/cancel the running animation subscription.

You can also configure:

* `duration(float)`
* `delay(float)`
* `ease(IEase)`
* `onInterpolate((runtime, element) -> ...)`
* `onFinished(element -> ...)`
* `origin(StyleOrigin)` and `animationOrigin(StyleOrigin)` for advanced style-origin control

---

## API Reference

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
