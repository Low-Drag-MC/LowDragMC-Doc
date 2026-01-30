
# ResourceTexture

The `ResourceTexture` class extends `TransformTexture` to render textures based on a resource location. It supports configurable offsets, dimensions, and color overlays.

## Basic Properties

| Field         | Description                                                |
|---------------|------------------------------------------------------------|
| imageLocation | The resource location of the texture image                 |
| offsetX       | Horizontal offset of the texture (default is 0)            |
| offsetY       | Vertical offset of the texture (default is 0)              |
| imageWidth    | Width factor of the texture (default is 1)                 |
| imageHeight   | Height factor of the texture (default is 1)                |
| color         | Color overlay applied to the texture (default is -1)       |

---

## APIs

### createTexture

Create a texture from a resource location.

=== "Java / KubeJS"

    ``` java
    // Using float parameters
    var texture = new ResourceTexture("ldlib:textures/gui/icon.png");
    ```

### getSubTexture

Returns a sub-texture of the current texture.

=== "Java / KubeJS"

    ``` java
    // Using float parameters
    var subTexture = resourceTexture.getSubTexture(0.2, 0.2, 0.5, 0.5);
    ```
