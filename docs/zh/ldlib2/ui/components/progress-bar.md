# ProgressBar

{{ version_badge("2.2.1", label="自", icon="tag") }}

`ProgressBar` 在可配置的 `[min, max]` 范围内将数值显示为部分填充的进度条。填充方向、插值动画和内部纹理均可配置。可选的居中 `Label` 可以覆盖在进度条上方。

`ProgressBar` 实现了 `IBindable<Float>` 和 `IDataConsumer<Float>`，因此其数值可以由数据提供器驱动，并自动与服务端保持同步。

!!! note ""
    [UIElement](element.md){ data-preview } 中记录的所有内容（布局、样式、事件、数据绑定等）同样适用于此处。

---

## 用法

=== "Java"

    ```java
    var bar = new ProgressBar();
    bar.setRange(0, 100);
    bar.setProgress(75f);
    parent.addChild(bar);

    // 数据绑定（服务端 → 客户端，每 tick 同步）
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
<!-- 基础进度条，当前值 50% -->
<progress-bar min-value="0" max-value="100" value="50"/>

<!-- 带居中文字标签 -->
<progress-bar min-value="0" max-value="200" value="100" text="my.progress.key"/>
```

| XML 属性 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `min-value` | `float` | 最小值。默认值：`0`。 |
| `max-value` | `float` | 最大值。默认值：`1`。 |
| `value` | `float` | 当前值。默认值：`0`。 |
| `text` | `string` | 设置覆盖层标签（会被翻译）。 |

---

## 内部结构

| 索引 | 字段 | 类型 | CSS 类 | 描述 |
| ----- | ----- | ---- | --------- | ----------- |
| `0` | `barContainer` | `UIElement` | `.__progress-bar_bar-container__` | 带有背景纹理和内边距的外部容器。 |

以下元素嵌套在内部结构中：

| 字段 | CSS 类 | 描述 |
| ----- | --------- | ----------- |
| `bar` | `.__progress-bar_bar__` | 进度条的填充部分。 |
| `label` | `.__progress-bar_label__` | 可选的覆盖层 `Label`（绝对定位，居中）。 |

---

## 进度条样式

!!! info ""
    #### <p style="font-size: 1rem;">fill-direction</p>

    随着数值增加，进度条填充的方向。

    默认值：`LEFT_TO_RIGHT`

    | 值 | 描述 |
    | ----- | ----------- |
    | `LEFT_TO_RIGHT` | 进度条从左边缘开始增长。 |
    | `RIGHT_TO_LEFT` | 进度条从右边缘开始增长。 |
    | `UP_TO_DOWN` | 进度条从上边缘开始增长。 |
    | `DOWN_TO_UP` | 进度条从下边缘开始增长。 |
    | `ALWAYS_FULL` | 无论数值如何，进度条始终完全可见。 |

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

    当为 `true` 时，进度条会在每个 tick 视觉上动画过渡到目标值，而不是直接跳变。

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

    插值过程中每个 tick 移动的总范围（`max - min`）比例。负值使用 partial-tick lerp 以实现更平滑的动画。

    默认值：`0.1`

    === "Java"

        ```java
        bar.progressBarStyle(style -> style.interpolateStep(0.05f)); // 更慢的动画
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

进度条的外部容器使用 `Sprites.PROGRESS_CONTAINER`，填充部分使用 `Sprites.PROGRESS_BAR`。可以通过样式或 DSL 覆盖这些纹理：

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

`ProgressBar` 订阅 `IDataProvider<Float>` 以自动更新数值。

=== "Java"

    ```java
    var binding = DataBindingBuilder.floatValS2C(
        () -> machine.getProgress() / (float) machine.getMaxProgress()
    ).build();

    bar.bindDataSource(binding);
    bar.unbindDataSource(binding); // 完成时取消绑定
    ```

完整的绑定 API 请参见 [数据绑定](../preliminary/data_bindings.md){ data-preview }。

---

## 字段

| 名称 | 类型 | 访问权限 | 描述 |
| ---- | ---- | ------ | ----------- |
| `barContainer` | `UIElement` | `public final` | 外部容器元素。 |
| `bar` | `UIElement` | `public final` | 填充条元素。 |
| `label` | `Label` | `public final` | 覆盖层标签元素。 |
| `progressBarStyle` | `ProgressBarStyle` | `private` (getter) | 当前进度条样式。 |
| `minValue` | `float` | `private` (getter) | 范围最小值。 |
| `maxValue` | `float` | `private` (getter) | 范围最大值。 |

---

## 方法

| 方法 | 返回类型 | 描述 |
| ------ | ------- | ----------- |
| `setProgress(float)` | `ProgressBar` | 设置当前值（限制在 `[min, max]` 范围内）。 |
| `setRange(float, float)` | `ProgressBar` | 设置 `[min, max]` 范围并重新评估当前值。 |
| `setMinValue(float)` | `ProgressBar` | 设置最小值。 |
| `setMaxValue(float)` | `ProgressBar` | 设置最大值。 |
| `progressBarStyle(Consumer<ProgressBarStyle>)` | `ProgressBar` | 以流式方式配置 `ProgressBarStyle`。 |
| `bar(Consumer<UIElement>)` | `ProgressBar` | 配置填充条元素。 |
| `barContainer(Consumer<UIElement>)` | `ProgressBar` | 配置外部容器元素。 |
| `label(Consumer<Label>)` | `ProgressBar` | 配置覆盖层标签。 |
| `bindDataSource(IDataProvider<Float>)` | `ProgressBar` | 订阅数据提供器。 |
| `unbindDataSource(IDataProvider<Float>)` | `ProgressBar` | 取消订阅数据提供器。 |
| `getValue()` | `Float` | 返回当前值。 |
| `getNormalizedValue()` | `float` | 返回归一化到 `[0, 1]` 的当前值。 |
