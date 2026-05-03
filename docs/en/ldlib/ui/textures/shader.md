# ShaderTexture

The `ShaderTexture` class extends `TransformTexture` to render textures using custom shaders. It supports dynamic shader updates, setting uniform values, and binding textures for advanced visual effects. The class provides methods for creating shader-based textures from resource locations or raw shader code, along with caching and disposal mechanisms. 

!!! warning "IMPORTANT!!!"
    If you are using raw shader, DO NOT forget to release the texture after using.

## Basic Properties

| Field      | Description                                                           |
|------------|-----------------------------------------------------------------------|
| location   | The resource location of the shader                                 |
| resolution | The shader resolution factor (affects the iResolution uniform)        |
| color      | Color overlay applied to the shader texture                           |

---

## APIs

### dispose

Dispose shader.

=== "Java / KubeJS"

    ``` java
    shaderTexture.dispose();
    ```

---

### updateShader

Updates the shader using a new resource location.

=== "Java / KubeJS"

    ``` java
    shaderTexture.updateShader(new ResourceLocation("modid:shader"));
    ```

---

### updateRawShader

Updates the shader using raw shader code.

=== "Java / KubeJS"

    ``` java
    shaderTexture.updateRawShader("raw shader code");
    ```

---

### setUniformCache

Sets a uniform cache consumer to update additional shader uniforms.

=== "Java / KubeJS"

    ``` java
    shaderTexture.setUniformCache(cache -> {
        // Update additional uniforms as needed
    });
    ```

---

### setResolution

Sets the resolution factor used in the shader.

=== "Java / KubeJS"

    ``` java
    shaderTexture.setResolution(2.5f);
    ```

---
