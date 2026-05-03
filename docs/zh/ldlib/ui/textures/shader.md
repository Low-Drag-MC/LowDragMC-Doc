# ShaderTexture

`ShaderTexture` 类继承自 `TransformTexture`，用于使用自定义着色器渲染纹理。它支持动态着色器更新、设置统一变量值以及绑定纹理以实现高级视觉效果。该类提供了从资源路径或原始着色器代码创建基于着色器的纹理的方法，并包含缓存和释放机制。

!!! warning "重要提示！！！"
    如果你正在使用原始着色器，使用后请勿忘记释放纹理。

## 基本属性

| 字段       | 描述                                                           |
|------------|-----------------------------------------------------------------------|
| location   | 着色器的资源路径                                               |
| resolution | 着色器分辨率因子（影响 iResolution 统一变量）                      |
| color      | 应用于着色器纹理的颜色覆盖层                             |

---

## API

### dispose

释放着色器。

=== "Java / KubeJS"

    ``` java
    shaderTexture.dispose();
    ```

---

### updateShader

使用新的资源路径更新着色器。

=== "Java / KubeJS"

    ``` java
    shaderTexture.updateShader(new ResourceLocation("modid:shader"));
    ```

---

### updateRawShader

使用原始着色器代码更新着色器。

=== "Java / KubeJS"

    ``` java
    shaderTexture.updateRawShader("raw shader code");
    ```

---

### setUniformCache

设置统一变量缓存消费者以更新额外的着色器统一变量。

=== "Java / KubeJS"

    ``` java
    shaderTexture.setUniformCache(cache -> {
        // Update additional uniforms as needed
    });
    ```

---

### setResolution

设置着色器中使用的分辨率因子。

=== "Java / KubeJS"

    ``` java
    shaderTexture.setResolution(2.5f);
    ```

---
