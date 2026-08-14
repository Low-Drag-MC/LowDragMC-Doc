# FX Hierarchy 与 Transform

![真实项目中的 FX Hierarchy 面板](/assets/photon2/editor-timeline-hierarchy.webp)

*Hierarchy 节点保存 Transform 与 Runtime 状态；子节点继承父节点的最终状态。*

每个 Runtime 都有一个始终存在的 `root` 对象。编辑的 FX 对象直接放在 root 下，或通过 Empty 对象组成层级。父级 Transform、active、visible 和 time scale 会影响整个子树。

## 为什么使用 Empty

Empty 适合：

- 将多个 Emitter 作为整体移动或旋转；
- 在 Timeline 中制作共享 pivot 动画；
- 激活、重启或改变整个子树的速度；
- 给 Java 代码提供稳定的命名控制点。

## Transform 规则

每个 `FXObject` 都拥有 LDLib2 `Transform`，包含 position、rotation、scale、parent 和有序 children。Scene Gizmo 编辑局部 Transform，World Transform 通过父级链计算。

| 操作 | 结果 |
| --- | --- |
| 保持 World Transform 重新设置父级 | 重新计算局部值，对象位置不变。 |
| 移动父级 | Local-space 子对象跟随移动。 |
| 旋转父级 | 子对象的位置和方向绕父级 pivot 旋转。 |
| 缩放父级 | 子对象继承 scale。 |

## Active、Visible 与 Time Scale

- `selfActive=false` 会停止该对象及其子级的 tick 和渲染。
- `selfTimelineVisible=false` 只隐藏渲染，不修改编辑器中的 `selfVisible`。
- `selfTimeScale` 乘到模拟时间上，子对象继承层级结果。
- Timeline Control Clip 开始时可以 reset 并重新设置整棵子树的 seed。

## 名称与 UUID

对象通过 UUID 持久化，Timeline binding 也使用 UUID。名称用于人类阅读，允许重复，但需要由 Java 查找时强烈建议保持唯一。

```java
var muzzle = runtime.findObject("muzzle");
var sparks = runtime.findObjects("spark");
```

`findObject` 返回第一个匹配对象；`findObjects` 返回全部匹配对象。序列化数据使用 UUID，集成代码使用唯一名称。

## Simulation Space 是另一层概念

Transform 继承决定 Emitter 在哪里；Particle Simulation Space 决定已经生成的粒子状态保存在哪里。在 `WORLD` 空间中移动 Emitter，不会拖动旧粒子。详见 [Simulation 与 Force](./simulation-and-forces.md)。
