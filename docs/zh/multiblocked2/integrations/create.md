# Create

<VersionBadge version="21.0.11" label="MBD2" icon="tag" />

Create 集成把转动建模为同时包含 RPM 与应力的值，增加配方内容、范围条件、机器 Trait 与转动渲染支持。

<figure>
<img src="/assets/multiblocked2/integrations/create.png" alt="MBD2 Machine Traits 编辑器显示强制的 Create rotation Trait">
<figcaption>Create kinetic 机器定义自动提供的强制 `!create_rotation` Trait。</figcaption>
</figure>

## 已激活接口

| 层 | 名称 | 含义 |
| --- | --- | --- |
| 配方 capability | `create_rotation` | 标记为 RPM 或应力的 `CreateRotation` 值 |
| Condition | `create_rotation` | RPM 最小/最大值与应力最小/最大值 |
| Trait | `!create_rotation` | Create 网络运行时桥接与配方 handler |
| UI 元素 | `create-rotation-element` | 自定义 UI 中的转动显示/控制 |
| 机器定义类型 | `create_machine` | 源码注册的 Java 定义类型 |

Trait 名开头的 `!` 表示它是 Create 机器定义的必需/内部 Trait，不是否定。

## 编写规则

RPM 是速度，应力表示网络负载/容量语义。两者虽然共用 capability，但不能互换。按目标字段使用 `inputRPM`/`outputRPM` 或 `inputStress`/`outputStress`。

```js
ServerEvents.recipes(event => {
  event.recipes.example.press()
    .id('example:rotation_pressing')
    .duration(100)
    .inputRPM(64)
    .inputStress(8)
    .rotationCondition(32, 256, 4, 128)
    .inputItems('minecraft:iron_ingot')
    .outputItems('minecraft:iron_block')
})
```

条件检查四个边界且不消耗资源；capability 内容由转动 Trait 处理。必须在游戏中测试转向、零转速与断网状态，编辑器预览无法证明机器已加入真实动力网络。

::: warning 当前创作边界
源码包含 Create 动力机器 project/builder，但 21.0.11 禁用了编辑器项目注册和 KubeJS `kinetic` builder 路径。不要教授 `event.create('kinetic', ...)`。应使用发布构建中确实提供 `!create_rotation` 的编辑器/Java Create 定义；给普通机器增加配方行不会创建传动轴节点。
:::

## 验证

确认机器加入动力网络、传动轴面与朝向一致、当前 RPM/应力落在条件范围、断轴后不再匹配，并验证配方输入/输出对网络行为的实际影响。若普通定义无法选择该 Trait，这是创作接口限制，不应手改项目 JSON 绕过。
