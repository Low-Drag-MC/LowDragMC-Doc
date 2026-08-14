# 核心 Shader 节点参考

![生产 Graph 中连接的核心 Math、Texture 与 Artistic 节点](/assets/photon2/graph-particle-shader.webp)

*节点分类只是积木；实际 Graph 通常会组合 Texture Sampling、Channel Math、Mask 与 Output。*

Photon Shader Graph 包含 KilaGraph 的通用 Shader 节点。本页按用途归类；节点 Tooltip 和 Description Panel 会显示准确端口与类型。

## 数值与逻辑

| 分类 | 常用节点 | 用途 |
| --- | --- | --- |
| 基础数学 | Add、Subtract、Multiply、Divide、Min、Max | 组合 Mask 和数值 |
| 高级数学 | Power、Exp、Log、Sqrt、Reciprocal | 衰减与响应曲线 |
| 范围 | Clamp、Saturate、Remap、Smoothstep、Step | 归一化并塑造过渡 |
| 三角函数 | Sin、Cos、Tan、Atan2 | 波形、旋转、极坐标 |
| 逻辑 | Compare、Select、And、Or、Not | 无 Java 分支的条件 Mask |

送入 Alpha 的算术结果建议经过 `Saturate`。`Smoothstep(edge0, edge1, x)` 可生成稳定柔边，交换两个 Edge 会反转渐变。

## Vector、Matrix 与 Channel

- **Compose/Split/Swizzle** 组合和提取 Vector Channel。
- **Dot** 测量方向一致程度，**Cross** 生成垂直方向。
- **Length/Distance/Normalize** 用于方向和径向 Mask。
- **Matrix Multiply/Transform** 转换坐标空间。点和方向的处理不同：平移不应影响方向。

## UV 与 Procedural

UV 节点包括 Tiling/Offset、Rotate、Polar/Twirl、Flipbook 和 Screen Mapping。Procedural 节点生成 Noise、Checker、Ellipse、Rectangle、Gradient 和 Voronoi 类 Mask。Procedural Noise 会为每个顶点/像素重算；图案无需数学变化时，纹理通常更便宜。

## Texture 与 Artistic

Texture Sample 使用 UV 和 Sampler State 读取 Texture/Sprite。颜色空间转换、Blend、Contrast、Hue/Saturation、Posterize 等节点处理采样结果。Mask 尽量保持 Scalar，不要让整条计算链都携带 `vec4`。

## Normal、Fog 与 Lighting

Normal 节点解包并转换 Normal Map。Lighting 使用 World Normal、Light 和 View Direction；Fog 节点与 Minecraft Fog 混合。Photon **Particle Data.litColor** 已包含 Block/Sky Light，原始 **color** 没有。除非故意双重光照，不要同时重复相乘。

## 常用小结构

```text
Dissolve: noise - threshold -> Smoothstep -> Alpha
Rim: 1 - Saturate(Dot(normal, viewDirection)) -> Power -> Emission
Flipbook: ParticleData.uv + frame/tiles -> Sample Texture
Soft particle: texture alpha × Depth Fade -> Alpha
```

粒子、场景和全屏输入见 [Photon Shader 节点参考](./photon-node-reference.md)。
