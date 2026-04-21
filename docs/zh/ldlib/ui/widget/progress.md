
# ProgressWidget

<div>
  <video width="50%" controls style="margin-left: 20px; float: right;">
    <source src="../../assets/progress.mp4" type="video/mp4">
    你的浏览器不支持视频。
  </video>
</div>

`ProgressWidget` 是一个使用**进度条**来直观显示进度的 UI 组件。它可用于多种场景，例如追踪合成进度、能量等级或其他动态变化的数值。

---

## 功能特性

- **可自定义的进度纹理** – 定义进度条的外观。
- **动态进度更新** – 使用 `DoubleSupplier` 来获取实时进度。
---

## 属性

| 字段                | 类型                          | 描述 |
|---------------------|-----------------------------|-------------|
| `lastProgressValue` | `double`                     | 存储上次记录的进度值。 |

---

## API

### setProgressSupplier

设置一个从 0 到 1 的进度提供器。

=== "Java"

    ```java
    progressWidget.setProgressSupplier(() -> 0.3);
    ```
=== "KubeJS"

    ```javascript
    progressWidget.setProgressSupplier(() => 0.3);
    ```

---

### setDynamicHoverTips

根据进度值设置动态悬停提示。

=== "Java"

    ```java
    progressWidget.setDynamicHoverTips(progress -> "current progress is %.f%".format(progress * 100));
    ```
=== "KubeJS"

    ```javascript
    progressWidget.setDynamicHoverTips(progress => `current progress is ${progress * 100}%` );
    ```
