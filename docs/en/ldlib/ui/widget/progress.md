
# ProgressWidget

<div>
  <video width="50%" controls style="margin-left: 20px; float: right;">
    <source src="../../assets/progress.mp4" type="video/mp4">
    Your browser does not support video.
  </video>
</div>

The `ProgressWidget` is a UI component that visually represents progress using a **progress bar**. It can be used in various contexts, such as tracking crafting progress, energy levels, or other dynamically changing values.

---

## Features

- **Customizable progress texture** – Define how the progress bar looks.
- **Dynamic progress updates** – Uses a `DoubleSupplier` to fetch real-time progress.
---

## Properties

| Field               | Type                          | Description |
|---------------------|-----------------------------|-------------|
| `lastProgressValue` | `double`                     | Stores the last recorded progress value. |

---

## APIs

### setProgressSupplier

Sets a progress supplier from 0 to 1.

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

Sets a dynamic hovertips based on the progress value.

=== "Java"

    ```java
    progressWidget.setDynamicHoverTips(progress -> "current progress is %.f%".format(progress * 100));
    ```
=== "KubeJS"

    ```javascript
    progressWidget.setDynamicHoverTips(progress => `current progress is ${progress * 100}%` );
    ```