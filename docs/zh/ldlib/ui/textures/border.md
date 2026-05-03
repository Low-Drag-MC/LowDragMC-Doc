# ColorBorderTexture

## 基本属性

| 字段           | 描述                       |
|----------------|----------------------------|
| color          | 应用于边框的颜色           |
| border         | 边框宽度                   |
| radiusLTInner  | 左上角内圆角半径           |
| radiusLBInner  | 左下角内圆角半径           |
| radiusRTInner  | 右上角内圆角半径           |
| radiusRBInner  | 右下角内圆角半径           |
| radiusLTOuter  | 左上角外圆角半径           |
| radiusLBOuter  | 左下角外圆角半径           |
| radiusRTOuter  | 右上角外圆角半径           |
| radiusRBOuter  | 右下角外圆角半径           |

---

## API

### setBorder

设置边框宽度。

=== "Java / KubeJS"

    ``` java
    colorBorderTexture.setBorder(5);
    ```

---

### setColor

设置边框颜色。

=== "Java / KubeJS"

    ``` java
    colorBorderTexture.setColor(0xff00ff);
    ```

---

### setRadius

根据提供的半径和当前边框宽度，设置统一的内、外圆角半径。

=== "Java / KubeJS"

    ``` java
    colorBorderTexture.setRadius(10);
    ```

---

### setLeftRadius

设置左侧内角和外角的圆角半径。

=== "Java / KubeJS"

    ``` java
    colorBorderTexture.setLeftRadius(8);
    ```

---

### setRightRadius

设置右侧内角和外角的圆角半径。

=== "Java / KubeJS"

    ``` java
    colorBorderTexture.setRightRadius(8);
    ```

---

### setTopRadius

设置顶部内角和外角的圆角半径。

=== "Java / KubeJS"

    ``` java
    colorBorderTexture.setTopRadius(8);
    ```

---

### setBottomRadius

设置底部内角和外角的圆角半径。

=== "Java / KubeJS"

    ``` java
    colorBorderTexture.setBottomRadius(8);
    ```
