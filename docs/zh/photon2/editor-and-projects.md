# 编辑器与项目

Photon 使用 LDLib2 编辑器框架。FX Project 在标准的资源与 Inspector 工作流上增加了实时 Scene、FX 对象层级和 Timeline。

## 工作区

| 区域 | 用途 |
| --- | --- |
| FX Hierarchy | 创建、命名、设置父子关系、排序、复制和选择 FX 对象。 |
| Scene | 预览 Runtime、查看 Shape、移动对象和控制播放。 |
| Inspector | 编辑所选对象的 Transform、Emitter 配置、模块、Material 和 Renderer。 |
| Resources | 创建并复用 Material、Graph、Curve、Gradient、Color 和 Mesh。 |
| Timeline | 编排对象、制作 Transform/配置动画、播放声音并提交后处理。 |
| History | 查看并撤销编辑器命令。 |

<figure>
<img src="/assets/photon2/editor-timeline-overview.webp" alt="最大化显示 Scene、Timeline、Resources、Inspector 与 Hierarchy 的 Photon 编辑器">
<figcaption>最大化后 Timeline、Scene、Resources、Inspector 与 Hierarchy 可以同时查看；选择目标后各视图会联动。</figcaption>
</figure>

## 文件类型

| 文件 | 作用 |
| --- | --- |
| `.fxproj` | 可编辑项目，包含项目元数据和 FX 定义。 |
| `.fx` | 压缩后的运行时定义，通过路径引用资源。 |
| `.fxpack` | 包含一个或多个效果及其依赖的 Resource Pack zip。 |
| `*.material.nbt` | 可复用 Material。 |
| `*.shader_graph.nbt` | 粒子/材质 Shader Graph。 |
| `*.shader_function.nbt` | 可复用 Shader Function Graph。 |
| `*.fullscreen_graph.nbt` | Fullscreen Shader Pass。 |
| `*.render_graph.nbt` | 多 Pass 后处理图。 |
| `*.mesh.nbt` | 可复用 Mesh Source。 |

## 项目资源

`FXProject` 会提供 Material、Shader Graph、Shader Function、Fullscreen Graph、Render Graph、Color、Curve、Gradient 和 Mesh 面板。资源可以拖到兼容的 Inspector 字段或 Graph 输入中。

`<gameDir>/ldlib2/assets/` 下的文件资源可以由多个项目共享。内置资源是只读的。保存 Graph 后，依赖它的 Material 或 Pass 会重新编译。

## 编辑文件与运行时文件

不要混用 `.fxproj` 和 `.fx`：

1. 使用 `.fxproj` 编辑和保存项目。
2. 所有依赖已经存在时，导出 `.fx` 供本机运行。
3. 需要连同依赖一起分发时，导出 `.fxpack`。

编辑器会在导出的 FX 中写入项目格式版本。加载旧的已版本化文件时，Photon 会应用已注册的 DataFixer。

## 实用规则

- 给需要由代码控制的对象设置稳定且唯一的名称，Java 可以使用 `FXRuntime#findObject` 查找。
- 将可复用 Graph、Material、Gradient 和 Mesh 放在命名明确的资源目录中，不要重复内联数据。
- 从编辑器外修改资源文件后，先执行资源重载再检查预览。
- 要放入 Resource Pack 的路径使用小写字母，不要包含空格。
