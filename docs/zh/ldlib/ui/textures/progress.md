# ProgressTexture

`ProgressTexture` 用于渲染一个进度条纹理，它会根据指定的方向进行填充。它结合了一个空纹理区域和一个已填充纹理区域，以直观地表示进度。

## 基本属性

| 字段          | 说明                                 |
|---------------|--------------------------------------|
| fillDirection | 进度填充的方向                       |
| emptyBarArea  | 进度条空部分使用的纹理               |
| filledBarArea | 进度条已填充部分使用的纹理           |
| progress      | 当前进度值（0.0 到 1.0）             |

---

## API 接口

### setTexture

设置进度纹理。`emptyBarArea` 和 `filledBarArea` 可以是任何类型的 [`GUI 纹理`](index.md)。

=== "Java / KubeJS"

    ``` java
    progressTexture.setTexture(emptyBarArea, filledBarArea);
    ```

---

### setProgress

设置进度值。

=== "Java / KubeJS"

    ``` java
    progressTexture.setProgress(0.75);
    ```

---

### setFillDirection

设置进度条的填充方向。

=== "Java / KubeJS"

    ``` java
    progressTexture.setFillDirection(ProgressTexture.FillDirection.RIGHT_TO_LEFT);
    ```
