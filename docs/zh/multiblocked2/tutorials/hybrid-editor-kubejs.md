# 混合教程：编辑器机器与 KubeJS 配方

<VersionBadge version="21.0.11" label="MBD2" icon="tag" />

这是适合整合包分发的推荐工作流：编辑器负责完整机器与配方类型定义，Java 注册导出产品，KubeJS 负责配方与可选行为。

<figure>
<img src="/assets/multiblocked2/editor/machine-ui.png" alt="由 Java 注册且通过 KubeJS 提供配方的编辑器机器 UI">
<figcaption>混合工作流中，导出项目拥有此 UI，KubeJS 提供绑定到 UI 的配方。</figcaption>
</figure>

## 所有权模型

| 层 | 所有者 | 原因 |
| --- | --- | --- |
| 机器状态、渲染器、Trait、UI、Pattern | 由 Java 注册的编辑器产品 | 完整且受支持的创作模型 |
| 配方类型 UI 与代理 | 由 Java 注册的编辑器 `.rt` 产品 | 稳定的查看器/运行时配置 |
| 单个配方 | KubeJS server script | 整合包作者可以重载与覆盖 |
| 特殊行为 | KubeJS 定向事件或 Java 扩展 | 根据复杂度与模拟要求选择 |

Java 已注册的 ID 不要再调用 `MBDRegistryEvents.machine.create` 或 `createRecipeType`。

## 1. Java 只注册导出定义

```java
@Mod(ExampleMod.MOD_ID)
public final class ExampleMod {
    public static final String MOD_ID = "examplemod";

    public ExampleMod(IEventBus modBus) {
        modBus.addListener(MBDContent::registerRecipeTypes);
        modBus.addListener(MBDContent::registerMachines);
    }
}
```

```java
public final class MBDContent {
    public static void registerRecipeTypes(MBDRegistryEvent.MBDRecipeType event) {
        event.registerFromResource(
            ExampleMod.class,
            "examplemod/mbd/recipe_types/crushing.rt"
        );
    }

    public static void registerMachines(MBDRegistryEvent.Machine event) {
        event.registerFromResource(
            ExampleMod.class,
            "single_machine",
            "examplemod/mbd/machines/crusher.sm"
        );
    }
}
```

`.sm` 产品引用的 ID 必须与 `.rt` 保存的 `examplemod:crushing` 完全一致。

## 2. KubeJS 不再创建 Startup 定义

这里不需要 `MBDRegistryEvents.recipeType` 或 `MBDRegistryEvents.machine` 脚本。完整重启后，MBD2 KubeJS 插件会发现 Java 注册的配方类型并生成：

```js
event.recipes.example.crushing()
```

找不到 builder 时，先修复 Java/资源注册；创建重复 KubeJS 类型只会掩盖真正的所有权问题。

## 3. 添加整合包配方

```js
// kubejs/server_scripts/examplemod_crushing.js
ServerEvents.recipes(event => {
  event.recipes.example.crushing()
    .id('examplepack:crushing/iron')
    .duration(100)
    .inputItems('#c:ingots/iron')
    .outputItems('9x minecraft:iron_nugget')

  event.recipes.example.crushing()
    .id('examplepack:crushing/wet_copper')
    .duration(160)
    .inputItems('#c:ingots/copper')
    .perTick(r => r.inputFE(40))
    .slotName('water_input', r =>
      r.inputFluids('250x minecraft:water'))
    .outputItems('minecraft:copper_block')
})
```

机器产品必须提供匹配这些内容的物品、流体与 FE handler。`slotName('water_input', ...)` 还要求某个 Trait 定义的 `slotNames` 包含 `water_input`；Trait 自身的 `name` 是另一个标识符。

## 4. 只在配方引擎无法表达时添加行为

```js
MBDMachineEvents.onRecipeStatusChanged('examplemod:crusher', wrapper => {
  const { machine, oldStatus, newStatus } = wrapper.event
  console.debug(`${machine.definition.id()}: ${oldStatus} -> ${newStatus}`)
})

MBDMachineEvents.onRecipeWaiting('examplemod:crusher', wrapper => {
  const logic = wrapper.event.machine.recipeLogic
  console.debug(`Crusher waiting: ${logic.waitingReason}`)
})
```

资格判断使用 recipe condition，资源核算使用 Trait/handler。事件不应重复处理输入、输出、模拟或进度。

## 5. 重载矩阵

| 修改的文件 | 需要的操作 |
| --- | --- |
| KubeJS server 配方/事件脚本 | 通常 `/reload` 即可 |
| KubeJS startup registry 脚本 | 完整重启 |
| Java 类或依赖 | 重新编译并重启 |
| 打包的 `.rt`、`.sm`、`.mb` | 重建资源并重启 |
| 尚未导出的编辑器工作项目 | 导出产品，再重启注册 |

## 6. 验收测试

1. 启动时没有 startup script 错误。
2. 确认 Java 日志先加载 `examplemod:crushing`，再加载 `examplemod:crusher`。
3. 获取并放置 `examplemod:crusher`。
4. 确认 UI 组件绑定到编辑器 Trait。
5. 确认 KubeJS 配方出现在 JEI/REI/EMI。
6. 放入全部普通输入，并提供 per-tick 资源。
7. 观察 `IDLE -> WORKING -> IDLE`，确认输出只产生一次。
8. 执行 `/reload`，只修改配方 duration，确认下一轮采用新数值。

配方能显示却不运行时，按 [RecipeLogic 搜索/setup 流程](../recipes/recipe-lifecycle.md#搜索管线)依次检查条件、普通输出容量、per-tick IO 与 Trait 路由。
