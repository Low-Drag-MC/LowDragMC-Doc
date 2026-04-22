# ImageWidget

![Image title](../assets/image.png){ width="30%" align=right }

`ImageWidget` 用于显示由 [`GUI Texture`](../textures/index.md) 提供的图像。

## 基础属性

| 字段           | 说明                                        |
|----------------|----------------------------------------------------|
| border         | 边框宽度（范围：-100 到 100）              |
| borderColor    | 边框颜色                            |

---

## APIs

### setImage

使用纹理实例设置图像纹理。

=== "Java / KubeJS"

    ``` java
    imageWidget.setImage(new ResourceTexture("ldlib:textures/gui/icon.png"));
    ```

---

### setImage

使用 Supplier 设置图像纹理。

=== "Java"

    ``` java
    imageWidget.setImage(() -> new ResourceTexture("ldlib:textures/gui/icon.png"));
    ```

=== "KubeJS"

    ``` javascript
    imageWidget.setImage(() => new ResourceTexture("ldlib:textures/gui/icon.png"));
    ```

---

### getImage

返回当前的图像纹理。

=== "Java / KubeJS"

    ``` java
    var texture = imageWidget.getImage();
    ```

---

### setBorder

![Image title](../assets/image_border.png){ width="20%" align=right }

设置边框宽度和颜色。

=== "Java / KubeJS"

    ``` java
    imageWidget.setBorder(2, 0xFFFFFFFF); // ARGB
    ```

---
