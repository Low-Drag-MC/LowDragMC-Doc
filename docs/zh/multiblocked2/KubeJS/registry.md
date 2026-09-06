# 注册事件

<VersionBadge version="Minecraft 1.21.1 / MBD2 21.1.1" label="当前 API" icon="tag" />

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

::: warning 同一个配方类型 ID 注册两次会直接崩游戏
`MBDRegistries.RECIPE_TYPES` 拒绝重复的键，而 startup 脚本抛异常会让 KubeJS 中止 mod 加载——游戏起不来，崩溃报告里是 `There were KubeJS startup script syntax errors!`，`logs/kubejs/startup.log` 里是 `[register] registry mbd2:recipe_type contains key <id> already`。

所以同一个 ID 只能调用一次 `createRecipeType`，也绝不要对 Java 模组已经注册过的 ID 调用它。机器 builder 的行为不同：`event.create` 传入重复 ID 只是替换掉待构建的 builder。
:::

## 注册基础机器定义

```js
MBDRegistryEvents.machine(event => {
  event.create('single', 'example:scripted_machine')
  event.create('multiblock', 'example:scripted_multiblock')
})
```

21.1.1 中支持的 builder key 只有：

| Key | MBD2 提供的 Java builder | 结果 |
| --- | --- | --- |
| `single` | `MBDMachineDefinition.builder()` | 基础单方块定义 |
| `multiblock` | `MultiblockMachineDefinition.builder()` | 基础多方块定义 |

事件先保存 builder，在全部 startup handler 完成后统一调用 `build()`，所以同一事件内重复创建相同 ID 会覆盖之前的 builder。传入其他 key 会抛 `Unknown machine type`——特别是没有注册 `kinetic`，所以 Create 动能机器必须在编辑器里创作、由 Java 注册。见 [Create](../integrations/create.md)。

::: warning 这是一个注册空壳，不是一台机器
`create` 返回的是 MBD2 的 Java `MBDMachineDefinition.Builder`。它不是面向编辑器模型的、有文档且受支持的 fluent API——它构建出的定义没有 Trait、没有 UI、没有配方逻辑、没有 Pattern，所以方块存在但什么都不做。

完整机器请在编辑器里创作，导出 `.sm` / `.mb`，再[由 Java 模组注册](../java/custom-machine.md)。KubeJS 负责围绕该定义的配方和行为。
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
