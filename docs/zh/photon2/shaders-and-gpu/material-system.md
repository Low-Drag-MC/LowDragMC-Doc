# 材质系统

![当前 Photon 项目加载的 Material 资源](/assets/photon2/resource-material.webp)

*浏览器会合并内置与项目 Provider；选中 Material 后可在 Inspector 查看 Shader、Texture 和其他设置。*

材质保存 Shader 输入，有些材质还自带渲染状态。在发射器的 **Renderer > Material** 中指定材质；材质必须和发射器生成的几何类型兼容。

![Photon 材质选项](/assets/photon2/material.png)

## 材质类型

| 材质 | 适合场景 | 主要输入 |
| --- | --- | --- |
| Texture | 完整纹理或任意资源 | 纹理、丢弃阈值、HDR 颜色/模式、像素艺术、软粒子、受动态光照 |
| Sprite | Minecraft Sprite/Atlas 区域 | sprite id、插值和像素风过滤、软粒子、受动态光照 |
| Kila | 不写 Graph 的常见 VFX 效果 | 可开关的模块、预设、粒子数据驱动、自带渲染状态 |
| Shader Graph | 新的自定义粒子着色 | Graph 资源、暴露参数、可选的自带渲染状态 |
| Custom Shader | 已有 Core Shader 文件 | shader id、uniform、texture/curve/gradient sampler |
| UI Resource | 复用 LDLib UI 纹理资源 | UI resource path 和 color |
| Block Atlas | Minecraft 方块/物品图集 | atlas sprite 与 Block Atlas UV 规则 |

Texture、Sprite 和 Block Atlas 材质本身没有混合、深度和剔除设置，这些属于 Renderer 的材质槽位（见[渲染状态](#render-state)）。[Kila 材质](./kila-material.md)有单独的页面。**受动态光照** 见[受光粒子与 Shader](../dynamic-lights/lit-particles-and-shaders.md#lit-by-dynamic-lights)。

### 软粒子

<VersionBadge version="2.2.7" label="自" icon="tag" />

Texture 和 Sprite 材质带有 **软粒子** 开关分组，默认关闭。它会在粒子接近背后场景时让粒子淡出，消除面片穿过方块时的硬切线。

| 选项 | 默认值 | 描述 |
| --- | --- | --- |
| 淡出距离 | 1 | 淡出所跨越的距离（格），范围 0.001–64。 |
| 淡出曲线 | 1 | 淡出的曲线形状，范围 0.01–16。 |
| 淡出目标 | `BOTH` | `BOTH` 同时淡出颜色和 Alpha，适合叠加和柔和叠加混合；`ALPHA_ONLY` 只淡出 Alpha，适合传统的半透明混合。界面中直接显示枚举名。 |

软粒子使用渲染管线的场景深度副本，只有启用的材质需要时才会复制。淡出在雾之后应用，材质缩略图中看不到。Shader Graph 和 Custom Shader 材质没有这个开关：请使用 **Depth Fade** 节点或 `SamplerSceneDepth` 采样器。

## 渲染状态 { #render-state }

混合、剔除和深度在 Renderer 的材质槽位上设置。

- **Blend** 决定源颜色/Alpha 如何与帧缓冲混合。火焰和能量常用 Additive，烟雾与贴花常用 Alpha Blend。
- **Depth Test** 让世界几何遮挡特效；**Depth Write** 决定特效是否遮挡之后绘制的几何。透明特效一般测试深度但不写深度。
- **Cull** 去掉背面或正面。双面片应关闭，封闭 Mesh 则通常保留。
- **Color/HDR Multiplier** 对 Shader 结果染色。开启 HDR 时，大于 1 的颜色可参与 Bloom。
- **Pixel Art** 使用保持锐利像素的采样方式，不适合平滑噪声和渐变。

<VersionBadge version="2.2.3" label="HDR 材质输入" icon="tag" />

### 使用材质的渲染状态 { #render-state-from-the-material }

<VersionBadge version="2.2.8" label="自" icon="tag" />

有些材质自带混合、剔除和深度：[Kila 材质](./kila-material.md)（未打开 **使用槽位状态** 时），以及打开了 **自带渲染状态** 的 Shader Graph Material。对这些材质，槽位会显示 **渲染状态** 一行：

| 值 | 效果 |
| --- | --- |
| 跟随材质 | 默认值。槽位使用材质的渲染状态，自身的混合、剔除和深度行会隐藏，改为显示“使用材质的渲染状态：…”。 |
| 自定义 | 使用槽位自身的设置。 |

Texture、Sprite、Custom Shader 等不提供渲染状态的材质始终使用槽位的设置，也不会显示渲染状态一行。

槽位的 **混合** 下拉框按名称选择混合方式：半透明、叠加、柔和叠加、正片叠底、不透明。**自定义** 表示当前因子不属于任何预设。下面的 **混合模式** 仍保存原始因子。

材质的渲染状态还可以打开 **先画背面**：双面网格会绘制两次，先画背面再画正面，护盾、能量球这类封闭透明网格就能自己排好前后。

## 几何兼容性

Texture、Sprite、Kila、Shader Graph 和 Custom Shader 都可用于普通 Tile 粒子。Model 渲染还要求支持 Model 的顶点路径。Trail、Beam、AraTrail 提供的是长度/点 UV 和法线，并不等同于 Billboard Sprite UV。只使用 **Particle Data** 的 Graph 更容易复用；读取特定 **Additional Data** 的 Graph 必须核对[通道支持表](./additional-gpu-data.md)。Kila 材质可以绘制所有几何，见[几何](./kila-material.md#geometry)。

<VersionBadge version="2.2.8" label="自" icon="tag" />

| 材质读取 | Particle Emitter | Trail、Beam、AraTrail |
| --- | --- | --- |
| 只用 Particle Data | 开不开 GPU 实例化都可以 | 开不开 GPU 实例化都可以 |
| Additional Data、Custom Data 或 Kila 粒子数据驱动 | 开不开 GPU 实例化都可以 | 只能在 GPU 实例化下 |

发射器无法提供某个材质所需的数据时，Inspector 顶部会显示 **材质缺少数据** 一行。**一键修复** 会打开 GPU 实例化，或添加 Kila 驱动所读的自定义数据流。

::: warning
材质可能正常编译，但发射器不支持所选数据通道。不支持的 Additional Data 会返回 0，所以常见表现是效果不动或完全不可见，而不是编译报错。
:::

## 项目资源与全局资源

项目材质随 `.fxproj` 保存，并会被 FX Pack 导出收集。全局资源便于多个项目复用，但运行时必须存在于导出后的命名空间下。准备发布的效果优先使用项目资源，并保持稳定的小写资源路径。
