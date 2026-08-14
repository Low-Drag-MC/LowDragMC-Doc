# 制作一个后处理效果

<VersionBadge version="2.2.0" label="自" icon="tag" />

![最大化 Photon 编辑器中打开的 Fullscreen Shader Graph](/assets/photon2/graph-fullscreen.webp)

*Fullscreen Graph 定义像素操作；Render Graph 决定输入、Pass 顺序、输出与混合行为。*

下面制作一个 Tint 效果，在编辑器中预览，再通过 Timeline 驱动它。

## 1. 创建 Fullscreen Graph

1. 在 **Resources** 新建 **Fullscreen Shader Graph**，命名 `wiki_tint`。
2. 添加名为 `Scene` 的 Texture/Sampler Graph Variable。
3. 添加名为 `Tint` 的 Color 参数，默认设为白色。
4. 将 Fullscreen Position UV 接到 `Scene` 的 Texture Sample。
5. Sampled RGB 乘 `Tint.rgb`，Alpha 保持 Sampled Alpha。
6. 连接到 Fullscreen Output 并保存。

需要由 Render Graph、Timeline 或 Java 修改的值必须暴露为 Graph Variable，普通内部常量不会成为 Pass Port。

## 2. 构建 Render Graph

1. 新建 **Render Graph**，命名 `wiki_tint_effect`。
2. 添加 **Scene Color Input**、一个 **Pass** 和 **Effect Output**。
3. 将 Pass Source 设为 `wiki_tint` Fullscreen Graph。
4. 将 Scene Color 接到 Pass 的 `Scene` Port。
5. 在 Pass 上设置 `Tint`，或连接 Blackboard 参数。
6. 将 Pass Output 接到 Effect Output。
7. 保持 **Auto Blend** 开启并保存。

Pass Port 会镜像 Source Graph 暴露的 Variable。重命名 `Scene` 或 `Tint` 后，原连线可能变成 Orphan，需要重新连接。

## 3. 预览

打开 Render Graph Preview，让效果覆盖真实世界画面。修改 Tint 与 Effect Weight，确认 Weight 0 完全返回原画面，Weight 1 显示完整效果。

画面全黑时，先把 Scene Color 直接接到 Effect Output；确认输入正常后，再恢复 Pass 并检查 Texture Port 连线。

## 4. 添加到 Timeline

1. 新建 **Post Process Track**。
2. 添加 Clip 并选择 `wiki_tint_effect`。
3. 设置 Start/Duration 与 Fade/Weight Curve。
4. 在 Clip 参数中覆盖 `Tint`。
5. 拖过 Clip 两端，检查 Fade In/Out。

Clip 在有效范围内每帧提交请求。结束或 Mute Clip 就会停止提交。

## 5. 打包

Render Graph 依赖其 Fullscreen Graph 及采样的 Texture。导出 FX Pack 前保存所有资源，并在干净资源环境中测试导出的 Pack，以发现未收集的全局资源依赖。
