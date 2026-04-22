# AnimationTexture

## 基本属性

| 字段          | 说明                                                  |
|---------------|-------------------------------------------------------|
| imageLocation | 图片的资源路径                                         |
| cellSize      | 纹理网格中每个单元格的大小                             |
| from          | 动画的起始单元格索引                                   |
| to            | 动画的结束单元格索引                                   |
| animation     | 动画速度值                                             |
| color         | 应用到纹理上的颜色覆盖层                               |

---

## API

### setTexture

设置纹理

=== "Java / KubeJS"

    ``` java
    animationTexture.setTexture("ldlib:textures/gui/particles.png");
    ```

### setCellSize

设置单元格大小。用于指定动画纹理需要被划分为多少个单元格（边长）。

=== "Java / KubeJS"

    ``` java
    animationTexture.setCellSize(8);
    ```

---

### setAnimation

设置动画范围，从第几个单元格到第几个单元格。

=== "Java / KubeJS"

    ``` java
    animationTexture.setAnimation(32, 44);
    ```

---

### setAnimation

设置动画速度。单元格之间的刻时间。

=== "Java / KubeJS"

    ``` java
    animationTexture.setAnimation(1);
    ```

---

### setColor

设置纹理颜色。

=== "Java / KubeJS"

    ``` java
    animationTexture.setColor(0xff000000);
    ```

---
