# 快速开始

本教程会制作一个可见的粒子效果，将它导出，并在世界中播放。整个过程只使用 Photon 内置资源。

## 1. 打开编辑器

安装互相兼容的 Photon 和 LDLib2，在创造模式单人世界中运行：

```mcfunction
/photon_editor
```

编辑器只能在单人游戏中打开，因为它需要访问本机的项目与资源文件。

<figure>
<img src="/assets/photon2/editor-timeline-overview.webp" alt="最大化的 Photon 编辑器工作区">
<figcaption>编辑器包含 Hierarchy、Scene、Inspector、Resources 和 Timeline。</figcaption>
</figure>

## 2. 创建 FX Project

选择 **File → New → FX Project**，将项目保存为 `first-effect.fxproj`。项目保存可编辑的对象树、Timeline 和可复用资源引用，它不是游戏运行时直接加载的文件。

## 3. 添加 Particle Emitter

在 `root` 下创建 **Particle Emitter**，然后在 FX Hierarchy 中选中它。第一个效果可以使用以下设置：

| 设置 | 值 |
| --- | --- |
| Duration | `40` ticks |
| Looping | 开启 |
| Start Lifetime | `20` |
| Start Speed | `0.05` |
| Start Size | `0.2` |
| Emission Rate | `2` |
| Shape | Sphere |

结构变化后 Scene 会重新开始预览。比较配置时可以使用 restart 和 pause 控件。

## 4. 指定 Material

打开 **Resources → Material**，选择 `circle` 等内置粒子纹理，并拖到发射器 Renderer 的 Material 列表中。Material 决定纹理或 Shader；Renderer 决定 Layer、排序、裁剪、Mask、Model 模式和 Instancing。

## 5. 添加运动和颜色

开启 **Color over Lifetime**，设置末端 alpha 为零的渐变。开启 **Velocity over Lifetime** 或 **Force over Lifetime**，可以让粒子在生成后继续改变运动状态。

<figure>
<img src="/assets/photon2/CurveAndGradient.png" alt="Photon 曲线与渐变编辑器">
<figcaption>Curve 和 Gradient 是可复用的数值来源，Emitter 模块和 Timeline Property 都会使用它们。</figcaption>
</figure>

## 6. 保存与导出

普通保存写入可编辑的 `.fxproj`。要生成运行时效果，请选择 **File → Export → FX**，导出到：

```text
<gameDir>/ldlib2/assets/photon/fx/first_effect.fx
```

运行时 id 是 `photon:first_effect`。如果效果引用了自定义 Material、Graph、Mesh 和 Texture，推荐导出成 FX Pack。

## 7. 播放导出的效果

关闭编辑器，将效果绑定到脚下方块：

```mcfunction
/photon fx photon:first_effect block ~ ~-1 ~ 0 0 0 1 1 1 0 false true
```

如果替换了导出文件但仍加载旧定义，可以运行：

```mcfunction
/photon_client clear_client_fx_cache
```

## 后续阅读

- 在 [Particle System](./particle-system/) 中学习所有发射器配置。
- 在 [Timeline](./timeline/) 中制作属性动画。
- 使用 [Shader Graph](./shaders-and-gpu/shader-graph-getting-started.md) 替换内置纹理。
- 使用[分发与 FX Pack](./distribution.md)打包依赖资源。
