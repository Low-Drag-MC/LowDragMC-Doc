# ResourceTexture

`ResourceTexture` 类继承自 `TransformTexture`，用于根据资源路径渲染纹理。它支持可配置的偏移量、尺寸和颜色覆盖。

## 基本属性

| 字段          | 描述                                                       |
|---------------|------------------------------------------------------------|
| imageLocation | 纹理图像的资源路径                                         |
| offsetX       | 纹理的水平偏移量（默认为 0）                               |
| offsetY       | 纹理的垂直偏移量（默认为 0）                               |
| imageWidth    | 纹理的宽度因子（默认为 1）                                 |
| imageHeight   | 纹理的高度因子（默认为 1）                                 |
| color         | 应用于纹理的颜色覆盖（默认为 -1）                          |

---

## API

### createTexture

从资源路径创建纹理。

=== "Java / KubeJS"

    ``` java
    // 使用 float 参数
    var texture = new ResourceTexture("ldlib:textures/gui/icon.png");
    ```

### getSubTexture

返回当前纹理的子纹理。

=== "Java / KubeJS"

    ``` java
    // 使用 float 参数
    var subTexture = resourceTexture.getSubTexture(0.2, 0.2, 0.5, 0.5);
    ```
