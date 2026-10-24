# 受光粒子与 Shader

<VersionBadge version="2.2.8" label="自" icon="tag" />

粒子可以从两个方向参与动态光照：**粒子发光**（Light Emission）让粒子照亮周围；**受动态光照**（Lit by Dynamic Lights）让粒子接收附近光源的光。Shader Graph 和手写 Shader 同样可以受光。

## 粒子发光 {#light-emission}

**粒子发光** 是粒子发射器的一个模块，默认关闭。它把一部分粒子变成跟随粒子、并随粒子一起淡出的动态光源。模块里的曲线都在每个粒子的生命周期上运行。

<figure>
<img src="/assets/photon2/lights-emission.webp" alt="营火升起的余烬在周围的石地板上照出一片暖光">
<figcaption>开启粒子发光的余烬在营火周围的地面上照出一片暖光。这张图里营火本身没有光源，光全部来自粒子。</figcaption>
</figure>

| 选项 | 默认值 | 作用 |
| --- | --- | --- |
| **比例**（Ratio） | 1（0–1） | 发光粒子所占的比例，按粒子随机挑选。 |
| **最大光源数**（Max Lights） | 32（0–1024） | 这个发射器每帧最多提交的光源数。 |
| **使用粒子颜色**（Use Particle Color） | 开 | 把光的颜色乘上粒子当前的颜色。 |
| **颜色**（Color） | 白色 | 随粒子生命周期变化的光色。HDR 强度会乘到亮度上。 |
| **强度**（Intensity） | 4 | 随粒子生命周期变化的亮度。 |
| **范围**（Range） | 4 | 每个光源衰减到零的距离（方块），随粒子生命周期变化。 |
| **透明度影响强度**（Alpha Affects Intensity） | 开 | 粒子淡出时，它的光也一起淡出。 |
| **尺寸影响范围**（Size Affects Range） | 关 | 把范围乘上粒子的尺寸。 |
| **投射阴影**（Cast Shadows） | 关 | 让这些光源投射阴影。它们会和其他所有光源争夺阴影名额。 |
| **光源半径**（Source Radius） | 0.1（0–8） | 每个光源发光球体的大小（方块），用于软阴影。 |
| **聚光灯**（Spot） | 关 | 让每个光源呈锥形照射，而不是照向所有方向。 |
| **聚光灯** → **内角** / **外角** | 20 / 35 | 完全照亮的核心与光锥衰减到零处的半角（度）。 |
| **聚光灯** → **对齐速度**（Align to Velocity） | 开 | 让每个光锥朝向粒子的运动方向。静止的粒子使用“方向”。 |
| **聚光灯** → **方向**（Direction） | (0, -1, 0) | 光锥的朝向，以“空间”指定的坐标轴表示。 |
| **聚光灯** → **空间**（Space） | Local | **Local**：发射器自身的坐标轴，旋转特效会一起改变光锥朝向。**World**：世界坐标轴。**Custom**：所选对象的坐标轴。 |
| **体积光**（Volumetric）→ **强度** | 关 → 1 | 让每个光源在空气中显出光晕或光柱。开启投射阴影并使用体素阴影时，光晕也会被遮挡。 |

只有粒子发射器有这个模块，拖尾、光束和 Ara拖尾发射器不能发光。粒子发光（开关）、颜色、强度和范围可以在 Timeline 上做动画。

## 受动态光照 {#lit-by-dynamic-lights}

**受动态光照** 是 **Texture Material** 和 **Sprite Material** 上的材质选项，默认关闭。开启它并设置 **强度**（1，0–16），烟、尘和火花就会染上附近光源的颜色。

<figure>
<img src="/assets/photon2/lights-lit-smoke.webp" alt="光源旁的烟雾：左边关闭受动态光照，右边开启">
<figcaption>同一团烟雾：左边关闭受动态光照，右边开启。</figcaption>
</figure>

- 公告板粒子没有法线，所以光从各个方向照来。
- 光叠加在粒子本身的颜色之上，并且会饱和：增加的光最多达到“强度 × 粒子颜色”，并保持光的色相，不会直接冲成白色。
- 使用体素阴影时，挡在投影光源和粒子之间的方块会挡住光。使用屏幕空间阴影时，受光粒子没有阴影。
- Kila 材质在“光照”分类中有同样功能的 **受动态光照亮** 模块，强度设置相同。同时使用 **光照**（Shading）模块时，动态光会按着色法线照亮粒子，因此能照到六向烟雾的侧面。见 [Kila 材质](../shaders-and-gpu/kila-material.md)。
- 内置的 `block_atlas` 材质没有任何设置，所以它永远不会受光。

### 固定光照不是动态光照

**固定光照**（Fixed Light）模块（天空光与方块光，0–15）位于粒子、拖尾和光束发射器上，它只设定粒子绘制时使用的原版光照图数值。它默认开启且为 15/15，所以粒子默认是全亮的。它不会照亮周围的任何东西，也不会对动态光源产生反应。受动态光照的光会叠加在它之上，所以全亮的粒子同样能染上附近光源的颜色。见[固定光照](../particle-system/physics-noise-lighting-uv.md#fixed-light)。

| 功能 | 位置 | 作用 |
| --- | --- | --- |
| **固定光照** | 发射器模块 | 固定粒子绘制时使用的原版光照图数值。 |
| **粒子发光** | 粒子发射器模块 | 粒子照亮周围。 |
| **受动态光照** | 材质选项、Kila 材质模块 | 粒子接收动态光源的光。 |

## 动态光源节点 {#dynamic-light-node}

在 Shader Graph 中，**动态光源**（Dynamic Light）节点（位于 **Photon 场景** 分组）返回动态光源投在当前片元上的光。它的效果与“受动态光照”相同，可用于粒子 Shader Graph 和函数图，只能在片元阶段使用。

| 端口 | 类型 | 含义 |
| --- | --- | --- |
| `normal`（输入） | `vec3` | 世界空间的表面法线，例如 Normal 节点的 World 输出。公告板粒子不要连接：此时光从各个方向照来。 |
| `wrap`（输入） | `float`，默认 0 | 连接法线时，光能绕过背光面多远，限制在 0–1。0 是普通的 Lambert；1 连背面的一半也照亮。 |
| `light`（输出） | `vec3` | 到达此处的光色，没有光照到的地方为 0。 |

输出把到达这个片元的所有动态光源（光源对象、粒子发光、Java 添加的光源）连同衰减、聚光锥和阴影累加起来，并做饱和处理：每个通道最多提亮 1 倍，且保持光的色相。常见用法：

```text
Base Color = Texture × Vertex Color × (1 + Dynamic Light)
```

使用了这个节点的材质会自动绑定光源，强度为满强度。把 `light` 乘上一个数值即可调弱或调强。动态光照关闭时、在节点和材质预览中，以及包含它的函数图被用在后处理 Pass 中时，节点输出 0。

## 手写 Shader {#hand-written-shaders}

Custom Shader Material 通过引入 `photon:lit_particle.glsl` 接收光照，需要做三件事。

**1. 提供视图空间位置。** `photon:particle` 顶点着色器已经输出了 `photonViewPos`（视图空间位置）和 `photonBaseColor`（乘光照图之前的粒子颜色）。如果使用自己的顶点着色器，加上同样的输出：

```glsl
out vec3 photonViewPos;
out vec3 photonBaseColor;

void main() {
    ParticleData data = getParticleData();
    vec4 viewPos = ModelViewMat * vec4(data.Position, 1.0);
    gl_Position = ProjMat * viewPos;
    photonViewPos = viewPos.xyz;
    photonBaseColor = data.Color.rgb;
    // ……其余输出
}
```

**2. 在片元着色器中引入头文件并调用光照函数。**

| 函数 | 返回值 |
| --- | --- |
| `vec3 photon_particle_light(vec3 viewPos)` | 从各个方向到达 `viewPos` 的光，适用于公告板粒子。 |
| `vec3 photon_surface_light(vec3 viewPos, vec3 viewNormal, float wrap)` | 每个光源按它照在 `viewNormal`（单位长度，视图空间）上的角度加权。法线为零时光从各个方向照来；`wrap` 大于 0 时光能绕过明暗交界线。 |

两个函数都只能在片元着色器中使用，没有绑定光源时返回 0。下面几行取自 Photon 的 `hdr_particle.fsh`，把光叠加到带纹理的粒子上（`texel` 是纹理采样结果）：

```glsl
#moj_import <photon:lit_particle.glsl>

in vec3 photonViewPos;
in vec3 photonBaseColor;

// 在 main() 中，算出基础颜色之后
color.rgb += texel.rgb * photonBaseColor * ColorModulator.rgb * photon_particle_light(photonViewPos);
```

**3. 在 Shader JSON 中声明 Sampler 与 Uniform。** 把下面这些条目加到 `samplers` 和 `uniforms` 数组里，与你自己的条目放在一起。它们取自 `assets/photon/shaders/core/hdr_particle.json`：

```json
"samplers": [
  { "name": "PhotonLightData" },
  { "name": "PhotonClusterGrid" },
  { "name": "PhotonClusterIndices" },
  { "name": "PhotonVisibilityAtlas" }
],
"uniforms": [
  { "name": "PhotonClusterInfo", "type": "int", "count": 4, "values": [ 64, 1, 1, 1 ] },
  { "name": "PhotonClusterView", "type": "float", "count": 4, "values": [ 0.5, 1.0, 0.0, 0.0 ] },
  { "name": "LitParticleParams", "type": "float", "count": 4, "values": [ 0.0, 0.0, 0.0, 0.0 ] },
  { "name": "PhotonVisibilityInfo", "type": "int", "count": 4, "values": [ 128, 8, 0, 0 ] },
  { "name": "PhotonViewInverse", "type": "matrix4x4", "count": 16, "values": [ 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0 ] }
]
```

JSON 声明了 `PhotonLightData` 时，Custom Shader Material 会在每次绘制时以强度 1 绑定光源，把这九个条目从 **Shader Settings** 中隐藏，并且不保存它们。要改变光的强弱，在 GLSL 里缩放返回值即可。名称列表见 [Custom Shader 内置 Uniform 与 Sampler](../shaders-and-gpu/custom-shader-builtins.md#dynamic-lights)。

## 性能建议

- 粒子发光的光源 **范围** 要小。开销主要取决于光源覆盖的屏幕面积，而不是光源个数。
- **最大光源数** 够玩家分辨就行。几十个余烬照亮地面的效果和几百个差不多。
- 粒子发光保持 **投射阴影** 关闭。大量粒子光源会把阴影名额从特效的主光源那里抢走。
- 只给少数主光源开启 **体积光**。投射阴影的体积光比不投射阴影的更贵。
- 受动态光照会在粒子的每个像素上遍历附近的光源。厚重、层层叠加的烟雾处在很多光源中时，开销会累积起来。
