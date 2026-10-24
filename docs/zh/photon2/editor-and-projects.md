# 编辑器与项目

Photon 使用 LDLib2 编辑器框架。FX Project 在标准的资源与 Inspector 工作流上增加了实时 Scene、FX 对象层级和 Timeline。

## 工作区

| 区域 | 用途 |
| --- | --- |
| FX Hierarchy | 创建、命名、设置父子关系、排序和选择 FX 对象。复制、粘贴和创建副本时会连同其 Timeline Track 一起处理。放置 [FX 实例](./fx-instances.md)。 |
| Scene | 预览 Runtime、查看 Shape、移动对象和控制播放。工具栏开关可以显示 Bloom、动态光照、碰撞视图等辅助内容。 |
| Inspector | 编辑所选对象的 Transform、Emitter 配置、模块、Material 和 Renderer。 |
| Resources | 创建并复用 Material、Graph、Curve、Gradient、Color 和 Mesh。 |
| Timeline | 编排对象、制作 Transform/配置动画、播放声音并提交后处理。 |
| History | 查看并撤销编辑器命令。 |

<figure>
<img src="/assets/photon2/editor-timeline-overview.webp" alt="最大化显示 Scene、Timeline、Resources、Inspector 与 Hierarchy 的 Photon 编辑器">
<figcaption>最大化后 Timeline、Scene、Resources、Inspector 与 Hierarchy 可以同时查看；选择目标后各视图会联动。</figcaption>
</figure>

### 复制、粘贴与创建副本

<VersionBadge version="2.2.8" label="自" icon="tag" />

在 FX Hierarchy 中右键选择 **复制**（Copy）、**创建副本**（Duplicate）或 **粘贴**（Paste），或者按 `Ctrl+C`、`Ctrl+D`、`Ctrl+V`。粘贴的对象会放到所选对象共同的父对象下；没有共同父对象时放到 `root` 下。

复制时会带上所有以被复制对象为目标的 Timeline Track，并改为指向副本：

- Animation、Activator、Speed 和 Audio Track；
- 被复制对象自己在 Control Track 上的 Clip；
- Track Group，只保留其中被复制的 Track。

因此，有动画的对象复制后会继续播放动画，而不会停在复制那一刻显示的帧上。

自 2.2.8 起，删除父对象会连同其子对象一起彻底删除。之前重新打开项目后，子对象会重新出现。

### Scene 开关

Scene 工具栏上有一组辅助视图的图标开关，其中两个是新增的：

| 开关 | 版本 | 显示内容 |
| --- | --- | --- |
| **显示动态光照**（Show dynamic lights） | 2.2.8 | 在预览中显示[动态光照](./dynamic-lights/index.md)。 |
| 碰撞视图 | 2.2.9 | 当前选中 Collider 的 Gizmo，或当前选中发射器最近的粒子接触点和法线。见[粒子碰撞](./particle-system/collision.md)。 |

## 快捷键

<VersionBadge version="2.2.7" label="自" icon="tag" />

FX 编辑器在 LDLib2 内置快捷键之外增加了以下快捷键。它们都可以在 **设置 → 快捷键**（Settings → Keymap）中重新绑定，见 [Keymap](../ldlib2/editor/keymap.md)。

| 操作 | 默认按键 |
| --- | --- |
| **操作轴：无** / **移动** / **旋转** / **缩放** | `Q` / `W` / `E` / `R` |
| **操作轴：切换本地 / 世界** | `X` |
| **切换绘制模式（着色 / 线框 / 两者）** | `Z` |
| **切换泛光** | `B` |
| **播放 / 暂停** | `Space` |
| **停止并回到开头** | `Shift+Space` |
| **后退一 tick** / **前进一 tick** | `,` / `.` |
| **重新加载特效** | `Ctrl+R` |

LDLib2 内置的编辑快捷键在 FX Hierarchy 和 Scene 中同样有效：`Ctrl+C` / `Ctrl+V` / `Ctrl+D` 复制、粘贴和创建 FX 对象副本，`Ctrl+Z` / `Ctrl+Y` 撤销和重做，`Ctrl+S` 保存项目。

在输入框中打字时，单键快捷键不会触发。飞行相机处于激活状态（按住鼠标右键）时，操作轴按键也会被忽略，因为飞行控制使用同样的按键。

## 文件菜单

<VersionBadge version="2.2.9" label="Changed" icon="tag" />

| 菜单项 | 作用 | 是否需要打开项目 |
| --- | --- | --- |
| **导出 → 导出特效（仅定义）**（Export → Export FX (Definition Only)） | 把效果写成 `.fx` 运行时定义。 | 是 |
| **导出 → 导出到 FXPack…**（Export → Export to FXPack...） | 把效果及其依赖加入 `.fxpack`。 | 是 |
| **将 .fx 转换为工程…**（Convert .fx to Project...） | 把 `.fx` 转回可编辑的项目。 | 否 |
| **管理 FXPack…**（Manage FXPack...） | 列出 Pack 中的效果，可以转换为项目或从包中移除。 | 否 |

自 2.2.9 起，**将 .fx 转换为工程…**（新增）和 **管理 FXPack…** 属于编辑器自身的文件菜单，而不是项目的菜单，因此不打开项目也能使用。导出、转换和管理 Pack 的细节见[分发与 FX Pack](./distribution.md)。

<figure>
<img src="/assets/photon2/editor-file-menu.webp" alt="Photon 编辑器的文件菜单，包含导出、将 .fx 转换为工程和管理 FXPack">
<figcaption>编辑器的文件菜单：导出、将 .fx 转换为工程…、管理 FXPack…。</figcaption>
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

<VersionBadge version="2.2.9" label="自" icon="tag" />

Asset Browser 用专门的 FX 图标显示 `.fx` 文件，与 `.fxproj` 区分开。打开（双击）`.fx` 会先询问项目保存位置，再把它转换成项目并打开。右键 `.fx` 可以把它放置为 [FX 实例](./fx-instances.md)。

原始模型文件（`.obj`、`.json`、`.glb`、`.gltf`）可以直接拖进 Mesh 资源面板，见 [glTF 模型](./particle-system/gltf-models.md)。

## 项目资源

`FXProject` 会提供 Material、Shader Graph、Shader Function、Fullscreen Graph、Render Graph、Color、Curve、Gradient 和 Mesh 面板。资源可以拖到兼容的 Inspector 字段或 Graph 输入中。

`<gameDir>/ldlib2/assets/` 下的文件资源可以由多个项目共享。内置资源是只读的。保存 Graph 后，依赖它的 Material 或 Pass 会重新编译。

## 编辑文件与运行时文件

不要混用 `.fxproj` 和 `.fx`：

1. 使用 `.fxproj` 编辑和保存项目。
2. 所有依赖已经存在时，导出 `.fx` 供本机运行。
3. 需要连同依赖一起分发时，导出 `.fxpack`。

要重新编辑导出的效果，可以用 **文件 → 将 .fx 转换为工程…** 把它转回项目。要在更大的效果中复用它，请把它放置为 [FX 实例](./fx-instances.md)，而不是复制它的对象。

编辑器会在导出的 FX 中写入项目格式版本。加载旧的已版本化文件时，Photon 会应用已注册的 DataFixer。

## 实用规则

- 给需要由代码控制的对象设置稳定且唯一的名称，Java 可以使用 `FXRuntime#findObject` 查找。
- 将可复用 Graph、Material、Gradient 和 Mesh 放在命名明确的资源目录中，不要重复内联数据。
- 从编辑器外修改资源文件后，先执行资源重载再检查预览。
- 要放入 Resource Pack 的路径使用小写字母，不要包含空格。
