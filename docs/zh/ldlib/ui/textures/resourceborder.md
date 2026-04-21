# ResourceBorderTexture

`ResourceBorderTexture` 类继承自 `ResourceTexture`，用于渲染带有可配置边框的纹理。它会计算角部、边缘和中心区域的相对尺寸，从而支持对 UI 背景和按钮进行精细的自定义。

## 基本属性

| 字段          | 说明                                     |
|---------------|------------------------------------------|
| boderSize     | 边框角的大小                               |
| imageSize     | 纹理图像的整体尺寸                          |
| imageLocation | 纹理图像的资源路径（resource location）     |

---

## API

### setBoderSize

设置边框角的大小。

=== "Java / KubeJS"

    ``` java
    resourceBorderTexture.setBoderSize(5, 5);
    ```

---

### setImageSize

设置纹理图像的整体尺寸。

=== "Java / KubeJS"

    ``` java
    resourceBorderTexture.setImageSize(200, 150);
    ```

---
