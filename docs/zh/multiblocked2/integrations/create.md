# Create

<VersionBadge version="21.1.1" label="MBD2" icon="tag" />

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

条件检查四个边界且不消耗资源；capability 内容由转动 Trait 处理。

## Trait 从哪里来

`!create_rotation` 不是从 **Add Trait** 菜单添加的——它由 **Create 动能机器**项目提供。在 `/mbd2_editor` 里新建这样一个项目，导出它的 `.cm` 产物，然后用类型键 `create_machine` 从 Java 注册：

```java
event.registerFromResource(ExampleMod.class, "create_machine",
        "examplemod/mbd/machines/mechanical_press.cm");
```

::: warning 没有 KubeJS builder 键
`MBDRegistryEvents.machine` 只接受 `single` 和 `multiblock`；`event.create('kinetic', ...)` 会抛 `Unknown machine type`。给普通机器加转动配方行同样不会产生传动轴节点——机器必须是动能定义。
:::

## 验证

确认机器加入动力网络、传动轴面与朝向一致、当前 RPM/应力落在条件范围、断轴后不再匹配，并验证配方输入/输出对网络行为的实际影响。编辑器预览无法证明机器已加入真实动力网络；转向、零转速和断开状态必须在游戏中测试。
