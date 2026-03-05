# ProgressBar

{{ version_badge("2.2.1", label="Since", icon="tag") }}

`ProgressBar` 在可配置的 `[min, max]` 范围内以部分填充的进度条形式显示数值。填充方向、插值动画和内部纹理均可配置。还可选择在进度条上叠加一个居中的 `Label`。

`ProgressBar` 实现了 `IBindable<Float>` 和 `IDataConsumer<Float>`，因此其值可由数据提供者驱动，并自动与服务器保持同步。

!!! note ""
    [UIElement](../element.md){ data-preview } 中记录的所有内容（布局、样式、事件、数据绑定等）同样适用于此组件。

---

## 使用方法

=== "Java"

    ```java
    var bar = new ProgressBar();
    bar.setRange(0, 100);
    bar.setProgress(75f);
    parent.addChild(bar);

    // Data-bound (server → client, ticks every tick)
    bar.bindDataSource(DataBindingBuilder.floatValS2C(
        () -> machine.getProgress() / (float) machine.getMaxProgress()
    ).build());
    ```

=== "Kotlin"

    ```kotlin
    progressBar({
        layout { width(80).height(14) }
        style { background(Sprites.PROGRESS_CONTAINER) }
    }) {
        api {
            setRange(0f, 100f)
            setProgress(75f)
        }
    }
    ```

=== "KubeJS"

    ```js
    let bar = new ProgressBar();
    bar.setRange(0, 100);
    bar.setProgress(75);
    parent.addChild(bar);
    ```

---

## XML

```xml
<!-- Basic progress bar at 50 % -->
<progress-bar min-value="0" max-value="100" value="50"/>

<!-- With a centered text label -->
<progress-bar min-value="0" max-value="200" value="100" text="my.progress.key"/>
```

| XML 属性 | 类型 | 描述 |
| ------------- | ---- | ----------- |
| `min-value` | `float` | 最小值。默认值：`0`。 |
| `max-value` | `float` | 最大值。默认值：`1`。 |
| `value` | `float` | 当前值。默认值：`0`。 |
| `text` | `string` | 设置叠加标签（已翻译）。 |

---

## 内部结构

| 索引 | 字段 | 类型 | CSS 类 | 描述 |
| ----- | ----- | ---- | --------- | ----------- |
| `0` | `barContainer` | `UIElement` | `.__progress-bar_bar-container__` | 带有背景纹理和内边距的外部容器。 |

以下元素嵌套在内部结构中：

| 字段 | CSS 类 | 描述 |
| ----- | --------- | ----------- |
| `bar` | `.__progress-bar_bar__` | 进度条的填充部分。 |
| `label` | `.__progress-bar_label__` | 可选的叠加 `Label`（绝对定位，居中）。 |

---

## Progress Bar 样式

!!! info ""
    #### <p style="font-size: 1rem;">fill-direction</p>

    进度条随数值增加时的填充方向。

    默认值：`LEFT_TO_RIGHT`

    | 值 | 描述 |
    | ----- | ----------- |
    | `LEFT_TO_RIGHT` | 进度条从左边缘增长。 |
    | `RIGHT_TO_LEFT` | 进度条从右边缘增长。 |
    | `UP_TO_DOWN` | 进度条从上边缘增长。 |
    | `DOWN_TO_UP` | 进度条从下边缘增长。 |
    | `ALWAYS_FULL` | 无论数值如何，进度条始终完全显示。 |

    === "Java"

        ```java
        bar.progressBarStyle(style -> style.fillDirection(FillDirection.DOWN_TO_UP));
        ```

    === "LSS"

        ```css
        progress-bar {
            fill-direction: DOWN_TO_UP;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">interpolate</p>

    当设为 `true` 时，进度条会在每个 tick 以动画形式逐渐过渡到目标值，而不是直接跳变。

    默认值：`true`

    === "Java"

        ```java
        bar.progressBarStyle(style -> style.interpolate(false));
        ```

    === "LSS"

        ```css
        progress-bar {
            interpolate: false;
        }
        ```

!!! info ""
    #### <p style="font-size: 1rem;">interpolate-step</p>

    插值过程中每个 tick 移动的总范围（`max - min`）比例。负值使用 partial-tick lerp 以获得更平滑的效果。

    默认值：`0.1`

    === "Java"

        ```java
        bar.progressBarStyle(style -> style.interpolateStep(0.05f)); // slower animation
        bar.progressBarStyle(style -> style.interpolateStep(-1f));    // partial-tick lerp
        ```

    === "LSS"

        ```css
        progress-bar {
            interpolate-step: 0.05;
        }
        ```

---

## 自定义进度条纹理

进度条使用 `Sprites.PROGRESS_CONTAINER` 作为外部容器，使用 `Sprites.PROGRESS_BAR` 作为填充。可通过样式或 DSL 覆盖这些设置：

=== "Java"

    ```java
    bar.barContainer(c -> c.style(s -> s.background(myContainerTexture)));
    bar.bar(b -> b.style(s -> s.background(myBarTexture)));
    ```

=== "LSS"

    ```css
    .__progress-bar_bar-container__ {
        background: sprite("mymod:textures/gui/bar_bg.png");
    }
    .__progress-bar_bar__ {
        background: sprite("mymod:textures/gui/bar_fill.png");
    }
    ```

---

## 数据绑定

`ProgressBar` 订阅 `IDataProvider<Float>` 以实现自动值更新。

=== "Java"

    ```java
    var binding = DataBindingBuilder.floatValS2C(
        () -> machine.getProgress() / (float) machine.getMaxProgress()
    ).build();

    bar.bindDataSource(binding);
    bar.unbindDataSource(binding); // when done
    ```

详见 [数据绑定](../data_bindings.md){ data-preview }。

---

## 字段

| 名称 | 类型 | 访问权限 | 描述 |
| ---- | ---- | ------ | ----------- |
| `barContainer` | `UIElement` | `public final` | 外部容器元素。 |
| `bar` | `UIElement` | `public final` | 填充进度条元素。 |
| `label` | `Label` | `public final` | 叠加标签元素。 |
| `progressBarStyle` | `ProgressBarStyle` | `private`（有 getter） | 当前进度条样式。 |
| `minValue` | `float` | `private`（有 getter） | 范围最小值。 |
| `maxValue` | `float` | `private`（有 getter） | 范围最大值。 |

---

## 方法

| 方法 | 返回值 | 描述 |
| ------ | ------- | ----------- |
| `setProgress(float)` | `ProgressBar` | 设置当前值（会被限制在 `[min, max]` 范围内）。 |
| `setRange(float, float)` | `ProgressBar` | 设置 `[min, max]` 范围并重新计算当前值。 |
| `setMinValue(float)` | `ProgressBar` | 设置最小值。 |
| `setMaxValue(float)` | `ProgressBar` | 设置最大值。 |
| `progressBarStyle(Consumer<ProgressBarStyle>)` | `ProgressBar` | 以流式方式配置 `ProgressBarStyle`。 |
| `bar(Consumer<UIElement>)` | `ProgressBar` | 配置填充进度条元素。 |
| `barContainer(Consumer<UIElement>)` | `ProgressBar` | 配置外部容器元素。 |
| `label(Consumer<Label>)` | `ProgressBar` | 配置叠加标签。 |
| `bindDataSource(IDataProvider<Float>)` | `ProgressBar` | 订阅数据提供者。 |
| `unbindDataSource(IDataProvider<Float>)` | `ProgressBar` | 取消订阅数据提供者。 |
| `getValue()` | `Float` | 返回当前值。 |
| `getNormalizedValue()` | `float` | 返回归一化到 `[0, 1]` 的当前值。 |
