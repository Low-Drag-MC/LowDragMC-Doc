# ResourceBorderTexture

The `ResourceBorderTexture` class extends `ResourceTexture` to render textures with configurable borders. It calculates relative sizes for corners, edges, and the central area, enabling detailed customization for UI backgrounds and buttons.

## Basic Properties

| Field         | Description                                                       |
|---------------|-------------------------------------------------------------------|
| boderSize     | The size of the border corners      |
| imageSize     | The overall size of the texture image   |
| imageLocation | The resource location of the texture image                        |

---

## APIs

### setBoderSize

Sets the size of the border corners.

=== "Java / KubeJS"

    ``` java
    resourceBorderTexture.setBoderSize(5, 5);
    ```

---

### setImageSize

Sets the overall size of the texture image.

=== "Java / KubeJS"

    ``` java
    resourceBorderTexture.setImageSize(200, 150);
    ```

---