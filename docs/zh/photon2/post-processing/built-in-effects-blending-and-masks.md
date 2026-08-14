# 内置效果、混合与 Mask

<VersionBadge version="2.2.0" label="自" icon="tag" />

| Vignette | RGB Shift |
| :---: | :---: |
| ![Vignette](/assets/photon2/post-vignette.webp) | ![RGB Shift](/assets/photon2/post-rgb-shift.webp) |
| Pixelate | Gaussian Blur |
| ![Pixelate](/assets/photon2/post-pixelate.webp) | ![Gaussian Blur](/assets/photon2/post-gaussian-blur.webp) |

*这些截图直接运行真实内置 Graph，Weight 为 1；Timeline 与 Java 可对同一效果做淡入淡出和参数覆盖。*

Photon 内置了一组可由 Render Graph Pass 直接选择的 Core Shader。它们是构建模块，一个完整 Effect 可以连接多个 Pass。

## 内置 Pass

| 分类 | Pass |
| --- | --- |
| 颜色 | grayscale、sepia、brightness_contrast、hue_saturation、tint、posterize |
| 镜头/屏幕 | vignette、rgb_shift、pixelate、dot_screen、film、glitch、lens_distortion |
| Filter | blur_h、blur_v、sharpen、radial_blur |
| Composite | bright、add_mix、dof_composite |
| Edge/Mask | outline、show_mask、mask_outline |

Pass Node 会读取 Core Shader JSON：Sampler 变为 Texture Port，Float/Vector Uniform 变为可配置 Value Port。所选 Pass 的准确参数以 Node Inspector 为准。

## 请求合并

同一 Effect Path 的普通请求会合并并只执行一次。Stack 以 `1 - Π(1 - wᵢ)` 合并 Weight，并按请求模型解析参数覆盖。两个实例需要保留不同参数或 Mask Group 时，Timeline Clip 开启 **Independent**；代价是额外一次全屏执行。

Effect 按 Priority 围绕内置 Bloom（`0`）排序。希望结果参与 Bloom，例如先增加发光亮度时，用负 Priority；希望处理 Bloom 后的最终画面时，用正 Priority。

## Custom Mask 与 Depth

1. 在 Particle/Trail/Beam/AraTrail Renderer 开启 **Write Custom Mask**。
2. 选择 8-bit Mask Group 和可选 Alpha Cutoff。
3. 在 Render Graph 读取 **Custom Mask**，需要遮挡信息时再读 **Custom Depth**。
4. 用 `round(mask.r * 255)` 匹配 Group，或启用 Post Process Clip Mask Filter。

只有实际需要时才分配并填充 Custom Mask。Group `0` 是背景，标记组为 `1..255`。Custom Depth 可区分标记 FX 是在几何前方可见，还是被几何遮挡。

`mask_outline` 是可直接使用的逐 Group 描边；`show_mask` 用不同颜色显示 Group ID，适合调试。Outline Pixel 会扩展到源 Mask 外侧，因此 Photon 对其最终 Blend 的处理不同于只修改 Mask 内部的颜色效果。

::: warning
只根据 Scene Depth 的普通 Fullscreen Outline 会检测场景中所有边缘；Custom Mask Outline 只针对选中的 Photon Renderer。两者目标不同，不能互相替代。
:::

## 质量与成本

每个独立 Full-resolution Pass 都要读取并写入数百万像素。尽量合并请求，宽范围 Blur 使用低分辨率，不使用 Mask 时关闭写入，也不要让复杂效果在 Weight 0 时继续执行。Pixel Radius 与 Target Resolution 有关，应在支持的窗口尺寸下检查效果。
