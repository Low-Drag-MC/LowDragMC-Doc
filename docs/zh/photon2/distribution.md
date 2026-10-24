# 分发与 FX Pack

<VersionBadge version="2.2.0" label="FX Pack 自" icon="package" />

Photon 可以导出轻量的 `.fx` 定义，也可以导出自包含的 `.fxpack`。选择哪一种取决于引用资源由谁提供。

![显示项目与内置材质的 Photon 资源浏览器](/assets/photon2/resource-material.webp)

*FX Pack 会从项目实际引用的 Material、Graph、Mesh 与 Texture 开始收集依赖。*

## 格式区别

| 格式 | 包含内容 | 适用场景 |
| --- | --- | --- |
| `.fx` | FX 对象树和 Timeline；资源和 [FX 实例](./fx-instances.md)的源仍然只是引用 | 目标 Mod 或 Resource Pack 已经包含全部依赖。 |
| `.fxpack` | 一个或多个 `.fx`，以及收集到的 Material、Graph、Mesh、模型（`.obj`、`.glb`、`.gltf`）、Texture、Shader 和其中 FX 实例放置的源 | 在不同安装之间分享效果，或发布独立效果包。 |

<VersionBadge version="2.2.9" label="自" icon="tag" />

包含 FX 实例的普通 `.fx` 在运行时需要用到这些实例的源。每个源都必须能按 id 从 Mod、Resource Pack 或 `.fxpack` 中加载到。导出 `.fxpack` 时会自动把源打进包里（任意嵌套深度都会处理），游戏或 Mod 已经自带的源除外。见 [FX 实例](./fx-instances.md#导出与运行时)。

## 运行时资源结构

```text
assets/<namespace>/fx/<path>.fx
assets/<namespace>/textures/...
assets/<namespace>/models/...
assets/<namespace>/shaders/...
assets/ldlib2/resources/<provider>/<resource>.<type>.nbt
```

`FXHelper.getFX(ResourceLocation.parse("example:fire"))` 会读取 `assets/example/fx/fire.fx`。

在 `.fxpack` 内部，库资源（Material、Shader Graph、Function Graph、Mesh）按内容只存一份，位于 `assets/photon_fx/<kind>/<hash>.<kind>.nbt`，包内的效果都指向这些文件。Texture、模型、Shader 等原始资源保留原来的位置。

## 导出 FX Pack

选择 **文件 → 导出 → 导出到 FXPack…**（File → Export → Export to FXPack...），选择或创建 `.fxpack`，然后输入效果名称（**包内特效名称**）。Pack 文件名会成为 namespace，输入名称会成为 path。

向同一个 Pack 再次导出是追加操作。共享资源会按内容寻址，只保存一次。

### 实时更新

<VersionBadge version="2.2.9" label="Changed" icon="tag" />

自 2.2.9 起，导出到游戏已经加载的 Pack 时，会直接原地重写这个包。游戏会立即播放新版本，编辑器会提示“已生效，可直接在游戏中播放。”从已加载的 Pack 中移除效果同样立即生效。打开中的项目如果有 FX 实例放置了该 Pack 中的效果，也会跟随新版本。

旧版本会一直占用已挂载的 Pack 文件，要求先重载资源或重启客户端才能覆盖。这条建议已经不再适用。

导出后无法立即播放时，编辑器会说明原因：

| 提示 | 含义 |
| --- | --- |
| “该包尚未加载，现在重载资源吗？” | 游戏还不认识这个 Pack 文件。选择 **重载资源**（Reload Resources）即可加载。 |
| “但 %s 提供了同名特效且优先级更高，游戏中播放的是那一个。” | 另一个优先级更高的 Pack 中有同一 id 的效果。 |
| “游戏只加载直接放在 photon/fxpacks 下的 .fxpack，不会加载这个包。” | Pack 保存在其他位置，或者放在子文件夹中。 |
| “包文件正被其他程序占用，请关闭后重试。” | 其他程序（例如压缩软件）占用了该文件。 |

## 管理 FX Pack

<VersionBadge version="2.2.9" label="Changed" icon="tag" />

选择 **文件 → 管理 FXPack…**（File → Manage FXPack...）并选择一个 Pack。对话框按 id 列出包中的效果，每一行有两个按钮：

| 按钮 | 作用 |
| --- | --- |
| **转换为工程**（Convert to Project） | 把该效果转换为可编辑项目，见[把效果转换为项目](#把效果转换为项目)。 |
| **从包中移除**（Remove from Pack） | 先询问“从包中移除 %s？只被它使用的资源会一并删除。”，然后移除该效果，以及其余效果都不再引用的资源。 |

Pack 尚未加载时，对话框会显示“此包尚未加载，重载资源后才能在游戏中播放其中的特效。”，并提供 **重载资源** 按钮。

自 2.2.9 起，**管理 FXPack…** 位于编辑器自身的文件菜单中，不打开项目也能使用。**转换为工程** 和移除前的确认也是 2.2.9 新增的。

<figure>
<img src="/assets/photon2/fxpack-manager.webp" alt="管理 FXPack 对话框，列出包中的效果以及转换为工程和从包中移除按钮">
<figcaption>管理 FXPack 对话框列出包中的效果，每一行都有“转换为工程”和“从包中移除”。</figcaption>
</figure>

## 把效果转换为项目

<VersionBadge version="2.2.9" label="自" icon="tag" />

导出的效果可以转回可编辑的 `.fxproj`：

- 单独的 `.fx` 文件：使用 **文件 → 将 .fx 转换为工程…**（File → Convert .fx to Project...），不需要打开项目。
- Pack 中的效果：在 **管理 FXPack…** 中点击 **转换为工程**。它直接读取 Pack 文件，无论是否已加载。
- 在 Asset Browser 中双击 `.fx`，或者在 [FX 实例](./fx-instances.md)上选择 **打开源**。

每种方式都会询问项目保存位置（**保存转换后的工程**）。文件已存在时，会先确认是否替换。转换完成后会打开该项目。

转换器对引用的处理方式：

| 引用 | 结果 |
| --- | --- |
| Pack 中的库资源（`assets/photon_fx/...`） | 复制到项目旁边的 `<project>_resources/` 中，并改为引用这些副本。项目不再依赖该 Pack，编辑副本也不会改动 Pack。 |
| 原始资源（Texture、模型、Shader） | 保留原位置。 |
| 找不到的引用 | 原样保留。编辑器会提示“有 %s 个引用的资源未找到，已保留原引用（详见日志）。” |

## 挂载

将 Pack 放到：

```text
<gameDir>/photon/fxpacks/
```

只有直接放在这个文件夹中的 `.fxpack` 才会被加载。下次资源重载时，它们会作为客户端 Resource Pack 挂载。内部效果会出现在 `FXHelper.listAllFX()` 中，可以像普通资源效果一样播放。

## 缺失依赖检查

导出的效果不可见或显示为紫黑色时：

1. 确认 `.fx` 的 id 和 namespace。
2. 在日志中查找加载失败的 Material、Graph、Mesh、Texture 或 Shader 路径。
3. 确保 Minecraft 资源路径只使用小写字母且不含空格。
4. 如果效果包含 FX 实例，确认每个源 id 都能加载。源缺失的实例不会放置任何内容。
5. 重载资源，并清除 FX 定义缓存。
6. 如果手动收集依赖容易遗漏，改用 `.fxpack`。

## 随 Mod 分发

可以把 Pack 的 `assets/` 内容复制到 `src/main/resources/assets/`，也可以把 `.fxpack` 作为用户安装的可选资源包发布。不要分发 `.fxproj`；它是编辑文件，不是运行时资源。
