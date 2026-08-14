# 分发与 FX Pack

<VersionBadge version="2.2.0" label="FX Pack 自" icon="package" />

Photon 可以导出轻量的 `.fx` 定义，也可以导出自包含的 `.fxpack`。选择哪一种取决于引用资源由谁提供。

![显示项目与内置材质的 Photon 资源浏览器](/assets/photon2/resource-material.webp)

*FX Pack 会从项目实际引用的 Material、Graph、Mesh 与 Texture 开始收集依赖。*

## 格式区别

| 格式 | 包含内容 | 适用场景 |
| --- | --- | --- |
| `.fx` | FX 对象树和 Timeline；资源仍然只是引用 | 目标 Mod 或 Resource Pack 已经包含全部依赖。 |
| `.fxpack` | 一个或多个 `.fx` 以及收集到的 Material、Graph、Mesh、Texture 和 Shader | 在不同安装之间分享效果，或发布独立效果包。 |

## 运行时资源结构

```text
assets/<namespace>/fx/<path>.fx
assets/<namespace>/textures/...
assets/<namespace>/models/...
assets/<namespace>/shaders/...
assets/ldlib2/resources/<provider>/<resource>.<type>.nbt
```

`FXHelper.getFX(ResourceLocation.parse("example:fire"))` 会读取 `assets/example/fx/fire.fx`。

## 导出 FX Pack

选择 **File → Export → FX Pack**，选择或创建 `.fxpack`，然后输入效果名称。Pack 文件名会成为 namespace，输入名称会成为 path。

向同一个 Pack 再次导出是追加操作。共享资源会按内容寻址，只保存一次。**Manage FX Pack** 可以列出并删除单个效果，同时清理不再被其他效果引用的资源。

## 挂载

将 Pack 放到：

```text
<gameDir>/photon/fxpacks/
```

下次资源重载时，它们会作为客户端 Resource Pack 挂载。内部效果会出现在 `FXHelper.listAllFX()` 中，可以像普通资源效果一样播放。

::: warning Windows 文件锁
已挂载的 Pack 可能被资源管理器保持打开。覆盖或删除同一文件前，需要卸载并重载资源，或者重启客户端。编辑器会把这种情况报告为 FX Pack locked。
:::

## 缺失依赖检查

导出的效果不可见或显示为紫黑色时：

1. 确认 `.fx` 的 id 和 namespace。
2. 在日志中查找加载失败的 Material、Graph、Mesh、Texture 或 Shader 路径。
3. 确保 Minecraft 资源路径只使用小写字母且不含空格。
4. 重载资源，并清除 FX 定义缓存。
5. 如果手动收集依赖容易遗漏，改用 `.fxpack`。

## 随 Mod 分发

可以把 Pack 的 `assets/` 内容复制到 `src/main/resources/assets/`，也可以把 `.fxpack` 作为用户安装的可选资源包发布。不要分发 `.fxproj`；它是编辑文件，不是运行时资源。
