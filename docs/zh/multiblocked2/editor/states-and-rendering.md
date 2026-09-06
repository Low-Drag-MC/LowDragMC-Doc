# 状态与渲染

<VersionBadge version="21.1.1" label="MBD2" icon="tag" />

每个定义都有根 `base` 状态。对应开关未启用时，子状态会继承渲染器、形状、光照、渲染包围盒和声音。

<figure>
<img src="/assets/multiblocked2/editor/states-and-rendering.png" alt="MBD2 base 状态被选中，Inspector 显示渲染器、形状、光照、渲染包围盒、半径与声音组">
<figcaption>在左侧层级选择状态，以编辑其启用的覆盖项和继承渲染字段。</figcaption>
</figure>

## 推荐状态树

| 状态 | 用途 |
| --- | --- |
| `base` | 后备渲染器、形状、光照和声音 |
| `idle` | 已就绪但当前未处理 |
| `waiting` | 已选择配方，但条件/输入/tick 要求不可用 |
| `working` | 工作中的视觉与声音 |
| `formed` / `unformed` | 适用于部件或多方块特有表现 |

没有启用自己渲染器的子状态会使用父状态渲染器。形状、光照等级、渲染包围盒、机器声音和[机器特效](./machine-fx.md)也分别采用相同继承规则。

## 渲染器选择

| 渲染器 | 需要 | 说明 |
| --- | --- | --- |
| 模型 | 一个模型资源 ID | 确认纹理依赖已打包 |
| GeckoLib | GeckoLib，以及模型、纹理、动画资源 | 附带客户端关键帧事件 |
| **Custom Script** | KubeJS | 由客户端脚本绘制——见[脚本渲染器](../KubeJS/client-renderers.md) |
| Java | 模组提供的 `IRenderer` | 服务端构造必须安全；客户端 supplier 只在客户端路径求值 |

形状会从创作时朝北方向旋转。渲染包围盒影响方块实体渲染边界，不影响碰撞。全局可见和渲染半径可让渲染器从更远处可见，应谨慎使用。

## 特效与声音

状态的 Photon 特效列表和机器声音遵循与渲染器相同的继承规则：开关**关闭**表示「沿用父状态」，而不是「没有」。真的想要安静的状态应该打开开关并留空列表。见[机器特效](./machine-fx.md)。

::: warning
形状和面向 registry 的方块属性变化可能需要重启，也可能影响已有自动化或碰撞。请测试每个朝向，尤其是不对称形状。
:::
