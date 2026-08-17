# 注册事件

<VersionBadge version="Minecraft 1.21.1 / MBD2 21.0.11" label="当前 API" icon="tag" />

<figure><img src="/assets/multiblocked2/integrations/integration-map.png" alt="startup 阶段定义注册表冻结后填充的 MBD2 编辑器菜单"><figcaption>startup 注册变更只有在重启并完成注册后才会显示在编辑器中。</figcaption></figure>

注册事件只能在 `kubejs/startup_scripts` 运行。它们会在 Minecraft 方块、物品、方块实体以及生成的 KubeJS 配方 schema 最终确定之前修改 MBD2 定义 registry。修改这些脚本后 `/reload` 不够，必须重启游戏或服务器。

## 注册配方类型

```js
// kubejs/startup_scripts/mbd2_registry.js
MBDRegistryEvents.recipeType(event => {
  const crusher = event.createRecipeType('example:crusher')
  console.info(`Registered ${crusher.registryName}`)
})
```

`createRecipeType(id)` 创建并立即注册 `MBDRecipeType`。它的 ID 同时决定生成的配方 schema 路径：

```js
event.recipes.example.crusher()
```

如果配方类型需要编辑器设计的 UI、代理映射或其他完整配置，应由 Java 从资源注册导出的 `.rt` 产品。KubeJS 函数只创建基础对象，不是所有 Java/编辑器设置的 fluent 镜像。

## 注册基础机器定义

```js
MBDRegistryEvents.machine(event => {
  event.create('single', 'example:scripted_machine')
  event.create('multiblock', 'example:scripted_multiblock')
})
```

21.0.11 中支持的 builder key 只有：

| Key | MBD2 提供的 Java builder | 结果 |
| --- | --- | --- |
| `single` | `MBDMachineDefinition.builder()` | 基础单方块定义 |
| `multiblock` | `MultiblockMachineDefinition.builder()` | 基础多方块定义 |

事件先保存 builder，在全部 startup handler 完成后统一调用 `build()`。同一事件内重复创建相同 ID 会覆盖待构建 builder。当前没有注册 `kinetic`；旧版 Create KubeJS 动力机器 builder 路径已在源码中停用。

::: warning 定义完整度
返回的 Java builder 没有面向 KubeJS 的完整文档，也没有覆盖全部 MBD2 编辑器模型的稳定 fluent API。状态、渲染器、Trait、UI、配方逻辑与 Pattern 请在编辑器中创建，导出 `.sm`/`.mb`，再由 Java 模组注册。KubeJS 适合为已有定义编写配方和事件行为。
:::

## 查询与删除

```js
MBDRegistryEvents.recipeType(event => {
  const existing = event.getRecipeType('example:crusher') // 对象或 null
  if (existing !== null) {
    console.info(existing.registryName)
  }

  // 仅在明确迁移时使用：生成的 schema 与依赖机器会一同失效。
  // event.removeRecipeType('example:obsolete')
})

MBDRegistryEvents.machine(event => {
  const existing = event.getMachine('example:crusher') // 对象或 null
  // event.removeMachine('example:obsolete')
})
```

`getMachine` 读取已经注册的定义，不会返回同一事件中仍待构建的 builder。`removeMachine` 同时移除相同 ID 的待构建 builder 和已注册定义。删除可能破坏编辑器项目、配方、方块、存档和脚本，只应在受控兼容迁移中使用。

## ID 与加载顺序检查

1. 始终使用 `example:crusher` 形式的命名空间 ID。
2. 注册调用只能放在 `startup_scripts`，不能放在 `server_scripts`。
3. 修改注册脚本后重启。
4. 调试配方前先检查 `logs/kubejs/startup.log`。
5. 调用 `event.recipes.example.crusher()` 前确认配方类型存在。
6. 整合包发布后保持 registry ID 稳定；它是持久标识符，不是显示名称。
