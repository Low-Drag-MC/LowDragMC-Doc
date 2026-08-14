# Custom Shader Material

<VersionBadge version="2.0.0" label="自" icon="tag" />

<figure>
<img src="/assets/photon2/ShaderMaterialInspector.png" alt="Photon Custom Shader Material Inspector">
<figcaption>Custom Shader Material 的 Shader 选择、重载按钮，以及从 Shader JSON 自动生成的参数。</figcaption>
</figure>

Custom Shader Material 直接加载 Minecraft Core Shader 的 JSON、VSH 和 FSH。它不是已经被 Shader Graph 取代的旧功能：需要移植 GLSL、使用几何着色器或编写 Graph 尚未覆盖的算法时，应使用它。

本主题分为三页：

- 本页：创建材质、选择 Shader、在 Inspector 中配置参数。
- [手写 Core Shader 与 ExtendedShader](./extended-shader.md)：从 JSON、VSH、FSH 到可运行材质的完整例子。
- [内置 Uniform 与 Sampler 参考](./custom-shader-builtins.md)：可直接使用的准确名称、类型、来源和限制。

顶点布局与粒子数据另见 [Vertex Format 与 GPU Instancing](./vertex-formats-and-instancing.md) 和 [Additional GPU Data](./additional-gpu-data.md)。

## 文件放在哪里

```text
assets/<namespace>/shaders/core/<name>.json
assets/<namespace>/shaders/core/<vertex>.vsh
assets/<namespace>/shaders/core/<fragment>.fsh
assets/<namespace>/shaders/include/<library>.glsl   # 可选
```

材质中的 Shader ID 是 `<namespace>:<name>`，不含 `assets/`、`shaders/core/` 和 `.json`。例如：

```text
assets/wiki/shaders/core/dissolve_particle.json
                         ↓
wiki:dissolve_particle
```

开发中的资源可以放进已启用 Resource Pack 或 Mod Jar。使用编辑器的文件选择器时，文件仍必须位于某个 `assets/<namespace>/shaders/core/` 下，Photon 才能推导出 Shader ID。

## 在编辑器中使用

1. 在 Emitter 的 **Renderer > Materials** 中添加 **Custom Shader Material**。
2. 点击 **Select Shader** 选择 Core Shader JSON，或直接填写 Shader ID。
3. 编译成功后，展开 **Shader Settings**。
4. 为自定义 Texture、数字、向量或颜色参数填写值。
5. 修改 JSON/VSH/FSH 后点击 **Reload Shader**。

预览变成红色错误文字时，先修复编译错误再重载。Photon 会缓存失败状态，避免每一帧重新创建失败的 GL Program。

## Inspector 如何识别参数

`LDShaderHolder` 读取 JSON 声明并自动为“非内置”项创建控件。

| JSON 声明 | Inspector 控件 |
| --- | --- |
| 自定义 sampler，例如 `Texture`、`NoiseTexture` | 纹理选择与预览 |
| `int`，count 1–4 | 整数或整数向量 |
| `float`，count 1–4 | 浮点数或浮点向量 |
| vec3 名称含 `color` 或 `rgb` | RGB 颜色 |
| vec4 名称含 `color` 或 `rgba` | RGBA 颜色 |
| vec4 名称含 `hdr` 或 `emission` | HDR 颜色与强度 |

命名会影响控件类型。`TintColor` 会显示颜色控件，`Direction` 会显示向量控件。

::: warning 保留名称
所有以 `Sampler` 开头的 sampler 和所有以 `U_` 开头的 uniform 都被视为内置项，不会出现在 Shader Settings 中。只使用[参考页](./custom-shader-builtins.md)列出的名称；自定义参数不要使用这两个前缀。
:::

参数值随材质保存。重载 Shader 时，只要名称和类型仍匹配，Photon 会尽量保留已有值；删除或改名的参数需要重新配置。

## 选择 Shader Graph 还是手写 Shader

| 需求 | 选择 |
| --- | --- |
| 常规材质逻辑、跨 Renderer 复用 | Shader Graph |
| 已有 GLSL/Core Shader | Custom Shader Material |
| 几何着色器 | Custom Shader Material |
| 自动声明 GPU Channel | Shader Graph |
| 手动控制 Attribute、Varying 和 GLSL Include | Custom Shader Material |

手写 Shader 不会自动推断所需的 Additional GPU Data。读取相关通道时，必须在 Emitter 中手动启用，并核对对应渲染路径是否支持。

## 下一步

继续完成一个可运行的三文件 Shader：[手写 Core Shader 与 ExtendedShader](./extended-shader.md)。写 Shader 时需要查名字，则直接打开[内置 Uniform 与 Sampler 参考](./custom-shader-builtins.md)。
