# 材质系统

![当前 Photon 项目加载的 Material 资源](/assets/photon2/resource-material.webp)

*浏览器会合并内置与项目 Provider；选中 Material 后可在 Inspector 查看 Shader、Texture 与 Render State。*

材质保存渲染状态和 Shader 输入。在发射器的 **Renderer > Material** 中指定材质；材质必须和发射器生成的几何类型兼容。

![Photon 材质选项](/assets/photon2/material.png)

## 材质类型

| 材质 | 适合场景 | 主要输入 |
| --- | --- | --- |
| Texture | 完整纹理或任意资源 | texture、color、blend/depth/cull |
| Sprite | Minecraft Sprite/Atlas 区域 | sprite id、插值和像素风过滤 |
| Shader Graph | 新的自定义粒子着色 | Graph 资源与暴露参数 |
| Custom Shader | 已有 Core Shader 文件 | shader id、uniform、texture/curve/gradient sampler |
| UI Resource | 复用 LDLib UI 纹理资源 | UI resource path 和 color |
| Block Atlas | Minecraft 方块/物品图集 | atlas sprite 与 Block Atlas UV 规则 |

## 渲染状态

- **Blend** 决定源颜色/Alpha 如何与帧缓冲混合。火焰和能量常用 Additive，烟雾与贴花常用 Alpha Blend。
- **Depth Test** 让世界几何遮挡特效；**Depth Write** 决定特效是否遮挡之后绘制的几何。透明特效一般测试深度但不写深度。
- **Cull** 去掉背面或正面。双面片应关闭，封闭 Mesh 则通常保留。
- **Color/HDR Multiplier** 对 Shader 结果染色。开启 HDR 时，大于 1 的颜色可参与 Bloom。
- **Pixel Art** 使用保持锐利像素的采样方式，不适合平滑噪声和渐变。

<VersionBadge version="2.2.3" label="HDR 材质输入" icon="tag" />

## 几何兼容性

Texture、Sprite、Shader Graph 和 Custom Shader 都可用于普通 Tile 粒子。Model 渲染还要求支持 Model 的顶点路径。Trail、Beam、AraTrail 提供的是长度/点 UV 和法线，并不等同于 Billboard Sprite UV。只使用 **Particle Data** 的 Graph 更容易复用；读取特定 **Additional Data** 的 Graph 必须核对[通道支持表](./additional-gpu-data.md)。

::: warning
材质可能正常编译，但发射器不支持所选数据通道。不支持的 Additional Data 会返回 0，所以常见表现是效果不动或完全不可见，而不是编译报错。
:::

## 项目资源与全局资源

项目材质随 `.fxproj` 保存，并会被 FX Pack 导出收集。全局资源便于多个项目复用，但运行时必须存在于导出后的命名空间下。准备发布的效果优先使用项目资源，并保持稳定的小写资源路径。
