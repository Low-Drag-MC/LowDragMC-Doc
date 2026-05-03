# ProgressTexture

The `ProgressTexture` is used to render a progress bar texture that fills according to a specified direction. It combines an empty and a filled texture area to visually represent progress.

## Basic Properties

| Field         | Description                                             |
|---------------|---------------------------------------------------------|
| fillDirection | The direction in which the progress fills             |
| emptyBarArea  | Texture used for the empty portion of the progress bar  |
| filledBarArea | Texture used for the filled portion of the progress bar |
| progress      | The current progress value (0.0 to 1.0)                 |

---

## APIs

### setTexture

Sets the progress textures. `emptyBarArea` and `filledBarArea` can any type of the [`GUi Texture`](index.md).

=== "Java / KubeJS"

    ``` java
    progressTexture.setTexture(emptyBarArea, filledBarArea);
    ```

---

### setProgress

Sets the progress value.

=== "Java / KubeJS"

    ``` java
    progressTexture.setProgress(0.75);
    ```

---

### setFillDirection

Sets the fill direction for the progress bar.

=== "Java / KubeJS"

    ``` java
    progressTexture.setFillDirection(ProgressTexture.FillDirection.RIGHT_TO_LEFT);
    ```