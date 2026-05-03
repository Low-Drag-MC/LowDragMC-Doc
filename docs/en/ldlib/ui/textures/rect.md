# ColorRectTexture

## Basic Properties

| Field     | Description                                  |
|-----------|----------------------------------------------|
| color     | The color applied to the rectangle           |
| radiusLT  | Top-left corner radius                       |
| radiusLB  | Bottom-left corner radius                    |
| radiusRT  | Top-right corner radius                      |
| radiusRB  | Bottom-right corner radius                   |

---

## APIs

### setRadius

Sets a uniform radius for all corners.

=== "Java / KubeJS"

    ``` java
    colorRectTexture.setRadius(10);
    ```

---

### setLeftRadius

Sets the left-side radii (top and bottom) for the rectangle.

=== "Java / KubeJS"

    ``` java
    colorRectTexture.setLeftRadius(8);
    ```

---

### setRightRadius

Sets the right-side radii (top and bottom) for the rectangle.

=== "Java / KubeJS"

    ``` java
    colorRectTexture.setRightRadius(8);
    ```

---

### setTopRadius

Sets the top-side radii (left and right) for the rectangle.

=== "Java / KubeJS"

    ``` java
    colorRectTexture.setTopRadius(8);
    ```

---

### setBottomRadius

Sets the bottom-side radii (left and right) for the rectangle.

=== "Java / KubeJS"

    ``` java
    colorRectTexture.setBottomRadius(8);
    ```