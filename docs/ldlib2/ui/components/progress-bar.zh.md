# 进度条
{{ version_badge("2.2.1", label="Since", icon="tag") }}
`ProgressBar` 将可配置`[min, max]` 范围内的值显示为部分填充的条形。填充方向、插值动画和内部纹理都是可配置的。可选的居中 `Label` 可以覆盖该栏。
`ProgressBar`实现了`IBindable<Float>`和`IDataConsumer<Float>`，因此它的值可以由数据提供者驱动并自动与服务器保持同步。
!!!笔记 ””[UIElement](../element.md){ data-preview } 上记录的所有内容（布局、样式、事件、数据绑定等）也适用于此处。
---

＃＃ 用法
===“Java”
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

===“科特林”
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

===“KubeJS”
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

| XML Attribute | Type | Description |
| ------------- | ---- | ----------- |
| `min-value` | `float` | Minimum value. Default: `0`. |
| `max-value` | `float` | Maximum value. Default: `1`. |
| `value` | `float` | Current value. Default: `0`. |
| `text` | `string` | Sets the overlay label (translated). |

---

## 内部结构
| Index | Field | Type | CSS class | Description |
| ----- | ----- | ---- | --------- | ----------- |
| `0` | `barContainer` | `UIElement` | `.__progress-bar_bar-container__` | Outer container with the background texture and padding. |

以下元素嵌套在内部结构中：
| Field | CSS class | Description |
| ----- | --------- | ----------- |
| `bar` | `.__progress-bar_bar__` | The filled portion of the bar. |
| `label` | `.__progress-bar_label__` | The optional overlay `Label` (absolute-positioned, centred). |

---

## 进度条样式
!!!信息“”#### <p style="font-size: 1rem;">填充方向</p>
条形随着值增加而填充的方向。
默认值：`LEFT_TO_RIGHT`
    | Value | Description |
    | ----- | ----------- |
    | `LEFT_TO_RIGHT` | Bar grows from the left edge. |
    | `RIGHT_TO_LEFT` | Bar grows from the right edge. |
    | `UP_TO_DOWN` | Bar grows from the top edge. |
    | `DOWN_TO_UP` | Bar grows from the bottom edge. |
    | `ALWAYS_FULL` | Bar is always fully visible regardless of value. |

===“Java”
        ```java
        bar.progressBarStyle(style -> style.fillDirection(FillDirection.DOWN_TO_UP));
        ```

===“LSS”
        ```css
        progress-bar {
            fill-direction: DOWN_TO_UP;
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">插值</p>
当 `true` 时，条形图会在每次刻度时以视觉动画向目标值移动，而不是跳跃。
默认值：`true`
===“Java”
        ```java
        bar.progressBarStyle(style -> style.interpolate(false));
        ```

===“LSS”
        ```css
        progress-bar {
            interpolate: false;
        }
        ```

!!!信息“”#### <p style="font-size: 1rem;">插值步骤</p>
插值期间每个刻度移动的总范围 (`max - min`) 的分数。负值使用部分刻度 lerp 来获得额外的平滑度。
默认值：`0.1`
===“Java”
        ```java
        bar.progressBarStyle(style -> style.interpolateStep(0.05f)); // slower animation
        bar.progressBarStyle(style -> style.interpolateStep(-1f));    // partial-tick lerp
        ```

===“LSS”
        ```css
        progress-bar {
            interpolate-step: 0.05;
        }
        ```

---

## 自定义条形纹理
该酒吧使用`Sprites.PROGRESS_CONTAINER`作为外部容器，使用`Sprites.PROGRESS_BAR`作为填充物。通过样式或 DSL 覆盖这些：
===“Java”
    ```java
    bar.barContainer(c -> c.style(s -> s.background(myContainerTexture)));
    bar.bar(b -> b.style(s -> s.background(myBarTexture)));
    ```

===“LSS”
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
`ProgressBar` 订阅 `IDataProvider<Float>` 以进行自动值更新。
===“Java”
    ```java
    var binding = DataBindingBuilder.floatValS2C(
        () -> machine.getProgress() / (float) machine.getMaxProgress()
    ).build();

    bar.bindDataSource(binding);
    bar.unbindDataSource(binding); // when done
    ```

请参阅 [Data Bindings](../data_bindings.md){ data-preview } 了解完整的绑定 API。
---

## 字段
| Name | Type | Access | Description |
| ---- | ---- | ------ | ----------- |
| `barContainer` | `UIElement` | `public final` | Outer container element. |
| `bar` | `UIElement` | `public final` | The filled bar element. |
| `label` | `Label` | `public final` | The overlay label element. |
| `progressBarStyle` | `ProgressBarStyle` | `private` (getter) | Current progress bar style. |
| `minValue` | `float` | `private` (getter) | Minimum range value. |
| `maxValue` | `float` | `private` (getter) | Maximum range value. |

---

＃＃ 方法
| Method | Returns | Description |
| ------ | ------- | ----------- |
| `setProgress(float)` | `ProgressBar` | Sets the current value (clamped to `[min, max]`). |
| `setRange(float, float)` | `ProgressBar` | Sets the `[min, max]` range and re-evaluates the current value. |
| `setMinValue(float)` | `ProgressBar` | Sets the minimum value. |
| `setMaxValue(float)` | `ProgressBar` | Sets the maximum value. |
| `progressBarStyle(Consumer<ProgressBarStyle>)` | `ProgressBar` | Configures `ProgressBarStyle` fluently. |
| `bar(Consumer<UIElement>)` | `ProgressBar` | Configures the fill bar element. |
| `barContainer(Consumer<UIElement>)` | `ProgressBar` | Configures the outer container element. |
| `label(Consumer<Label>)` | `ProgressBar` | Configures the overlay label. |
| `bindDataSource(IDataProvider<Float>)` | `ProgressBar` | Subscribes to a data provider. |
| `unbindDataSource(IDataProvider<Float>)` | `ProgressBar` | Unsubscribes from a data provider. |
| `getValue()` | `Float` | Returns the current value. |
| `getNormalizedValue()` | `float` | Returns the current value normalized to `[0, 1]`. |
