# AnimationTexture

## Basic Properties

| Field         | Description                                           |
|---------------|-------------------------------------------------------|
| imageLocation | The resource location for the image                 |
| cellSize      | The size of each cell in the texture grid             |
| from          | The starting cell index for animation                |
| to            | The ending cell index for animation                  |
| animation     | The animation speed value                             |
| color         | The color overlay applied to the texture             |

---

## APIs

### setTexture

Sets the texture

=== "Java / KubeJS"

    ``` java
    animationTexture.setTexture("ldlib:textures/gui/particles.png");
    ```

### setCellSize

Sets the cell size. Refer to how many cells does the animation texture need to be divided into (side length).

=== "Java / KubeJS"

    ``` java
    animationTexture.setCellSize(8);
    ```

---

### setAnimation

Sets the animation range `from` which cell `to` which cell.

=== "Java / KubeJS"

    ``` java
    animationTexture.setAnimation(32, 44);
    ```

---

### setAnimation

Sets the animation speed. Tick time between cells.

=== "Java / KubeJS"

    ``` java
    animationTexture.setAnimation(1);
    ```

---

### setColor

Sets the texture color.

=== "Java / KubeJS"

    ``` java
    animationTexture.setColor(0xff000000);
    ```

---
