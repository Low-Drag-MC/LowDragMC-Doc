# Shader Graph 入门

<VersionBadge version="2.2.0" label="开始支持" icon="tag" />

![最大化编辑器中打开的真实 Particle Shader Graph](/assets/photon2/graph-particle-shader.webp)

*左侧是 Blackboard 参数，中间是连线节点，Scene 中则显示实时粒子结果。*

下面制作一个带纹理、与方块交界处柔和消隐的粒子 Shader，并将它应用到发射器。

## 1. 创建 Graph 和材质

1. 在 **Resources** 中新建 **Shader Graph**，命名为 `soft_particle`。
2. 新建 **Shader Graph Material**。
3. 将其 Graph 资源设为 `soft_particle`。
4. 把材质赋给 Particle Emitter 的 Renderer。

Graph 与材质是两个资源：多个材质可以复用同一个 Graph，只覆盖不同纹理、颜色或数值参数。

## 2. 构建 Fragment 输出

添加并连接以下节点：

```text
Particle Data.uv ──> Sample Texture.uv
Texture 参数 ──────> Sample Texture.texture
Sample Texture.rgb × Color 参数.rgb ─> Base Color
Sample Texture.a   × Color 参数.a   ─> Alpha
```

将结果连接到 Fragment Output。保存一次，Photon 会编译 Graph 并刷新材质预览。

## 3. 添加柔和交界

添加 **Depth Fade**，将它乘到 Alpha 上。它比较粒子深度与场景深度，让较大的 Billboard 穿过方块时淡出，不再出现明显切线。

Depth Fade 是 Fragment Stage 的屏幕空间计算。Particle Data UV 路径不要误接到 Screen UV。

## 4. 暴露参数

将 Texture、Tint 和 Fade Distance 设为 Graph 参数。在 Graph 中设默认值，在每个材质中覆盖。参数名会被序列化；重命名后，要同步修改引用旧名字的材质。

## 5. 验证渲染路径

- Alpha 与 Additive Blend；
- 普通 Tile 与 GPU Instanced Tile；
- 与世界几何的交界；
- 如果支持 Iris，开启 Iris 后再测；
- 对大于 1 的颜色测试 HDR/Bloom。

::: tip
画面全黑时，先把常量颜色直接接到 Base Color。确认可见后，再逐个接回 Texture、Particle Color 和 Lighting，能快速区分缺资源和 Graph 计算错误。
:::

## 保存与打包

先保存 Graph，再保存材质，最后保存项目。FX Pack 会跟随资源引用收集依赖；Graph、材质和纹理都必须有可解析的资源路径。
