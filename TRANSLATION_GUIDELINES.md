# LowDragMC 文档翻译规范（中英对照）

> 本规范基于 Photon2 / Multiblocked2 / LDLib / LDLib2 文档的实际翻译实践总结，用于确保所有翻译子代理输出一致、准确、可维护的中文文档。

---

## 一、总体原则

1. **从 `docs/en/` 翻译到 `docs/zh/`，保持完全相同的目录结构。**
2. **仅翻译自然语言内容**，所有代码、类名、方法名、资源路径、配置键保持原样。
3. **Minecraft 及模组专有名词保留英文原文**，不翻译。
4. **Markdown 格式必须 100% 保留**，包括表格对齐、代码块缩进、admonition、tabs、Mermaid 等。
5. **代码块内仅翻译注释**（`//`、`/* */`、`#` 等），代码本身不动。
6. **长文件必须分段写入**，不要一次性输出超过 100 行的内容。

---

## 二、保留英文的专有名词清单

### 2.1 Minecraft 原版专有名词
- 维度：`The Overworld`、`The Nether`、`The End` → 保留英文
- 生物群系：`Plains`、`Desert`、`Badlands`、`Dark Forest`、`Soul Sand Valley`、`Crimson Forest`、`Warped Forest` 等 → 保留英文
- 方块名：`Glass`、`Campfire`、`Chest`、`Diamond Ore`、`Obsidian`、`Crafting Table` 等 → 保留英文
- 物品名：`Apple`、`Ender Pearl`、`Nether Star`、`Totem of Undying`、`Lava Bucket` 等 → 保留英文
- 实体/生物：`Player`、`Pig`、`Creeper`、`Ender Dragon`、`Wither`、`Villager` 等 → 保留英文
- 结构：`Stronghold`、`Woodland Mansion`、`Bastion Remnant`、`Ancient City` 等 → 保留英文
- 附魔：`Mending`、`Fortune`、`Silk Touch` 等 → 保留英文
- 状态效果：`Jump Boost`、`Mining Fatigue`、`Bad Omen` 等 → 保留英文
- 游戏机制作为专有名词时：`Redstone`、`Command Block`、`Scoreboard`、`NBT`、`tick` 等 → 保留英文
- 更新名称：`The Nether Update`、`Caves & Cliffs`、`The Wild Update`、`Trails & Tales` 等 → 保留英文

### 2.2 模组/项目品牌名（始终保留英文，首字母大写）
| 英文 | 说明 |
|------|------|
| `LDLib` / `LDLib2` | 核心库名称 |
| `Photon` / `Photon2` | VFX 模组 |
| `Multiblocked` / `Multiblocked2` / `MBD` / `MBD2` | 多方块结构模组（统一用 `MBD2`） |
| `KubeJS` | JS 脚本模组 |
| `Forge` / `NeoForge` | 加载器 |
| `Fabric` | 加载器 |
| `JEI` / `REI` / `EMI` | 物品管理器 |
| `GTCEU` / `GTM` | GregTech 系列 |
| `Botania` | 植物魔法 |
| `Mekanism` / `Mek` | 通用机械 |
| `Create` | 机械动力 |
| `PneumaticCraft` / `PNC` |  pneumaticraft |
| `Embers` | 余烬 |
| `Nature's Aura` | 自然灵气 |
| `Shimmer` | 光影模组 |

### 2.3 技术术语（保留英文，必要时括号加注）
| 英文 | 处理方式 |
|------|---------|
| `UI`、`GUI`、`HUD` | 保留英文，或译为 `UI`/`GUI`/`HUD` |
| `Widget` | 保留英文，或译为 `控件`/`组件`（根据上下文） |
| `Trait` | 保留英文 `Trait`（MBD2 核心概念） |
| `Shader` | 作为材质类型时保留 `Shader`，普通描述可用 `着色器` |
| `Sprite` | 作为材质类型时保留 `Sprite` |
| `Texture` | 保留英文或译为 `纹理`（根据上下文） |
| `FX`、`VFX` | 保留英文 |
| `RPC` | 保留英文 |
| `NBT` | 保留英文 |
| `Component` (Minecraft) | 保留英文 |
| `ResourceLocation` | 保留英文 |
| `BlockEntity` | 保留英文 |
| `ItemStack`、`FluidStack` | 保留英文 |
| `BlockPos`、`BlockState` | 保留英文 |
| `UUID` | 保留英文 |
| `Codec` | 保留英文 |
| `ModularUI` | 保留英文 |
| `UIElement` | 保留英文 |
| `Slot` | 保留英文或译为 `槽位` |
| `Tank` | 保留英文或译为 `储罐` |
| `Label` | 保留英文或译为 `标签` |
| `Button` | 保留英文或译为 `按钮` |
| `ProgressBar` | 保留英文或译为 `进度条` |
| `Selector` | 保留英文或译为 `选择器` |
| `TextField` | 保留英文或译为 `文本框` |
| `Switch` | 保留英文或译为 `开关` |
| `Tooltip` | 保留英文或译为 `提示框`/`悬停提示` |
| `Event` | 保留英文或译为 `事件` |
| `Listener` | 保留英文或译为 `监听器` |
| `Data Binding` | 保留英文或译为 `数据绑定` |
| `Sync` | 保留英文或译为 `同步` |
| `Persisted` | 保留英文或译为 `持久化` |
| `Annotation` | 保留英文或译为 `注解` |
| `Packet` | 保留英文或译为 `数据包` |
| `Payload` | 保留英文 |
| `Accessor` | 保留英文 |
| `Maven` | 保留英文 |
| `Gradle` | 保留英文 |
| `Java` / `JavaScript` / `JS` | 保留英文 |
| `HTML` / `DOM` / `CSS` | 保留英文 |
| `GLSL` / `GPU` / `HDR` / `bloom` / `Fresnel` | 保留英文 |
| `Vertex` / `Fragment` / `Uniform` / `Sampler` | 保留英文 |
| `Yoga` / `FlexBox` / `flex` | 保留英文 |
| `LSS` (LDLib Style Sheet) | 保留英文 |
| `SDF` | 保留英文 |
| `XML` / `XSD` / `JSON` | 保留英文 |
| `W.I.P` | 保留英文，或译为 `开发中` |

---

## 三、统一译法表（必须一致的翻译）

| 英文原文 | 统一中文译法 | 备注 |
|---------|------------|------|
| `Introduction` | `简介` | 标题 |
| `Overview` | `概述` | |
| `Getting Started` | `快速开始` / `入门` | |
| `Basic Properties` | `基本属性` / `基础属性` | 统一用 `基本属性` |
| `API` / `APIs` | `API` | 不译为 `接口` |
| `Usage` | `用法` / `用法示例` | |
| `Example` | `示例` | |
| `Note` | `注意` / `备注` | admonition 类型保留 `!!! note` |
| `Warning` | `警告` | admonition 类型保留 `!!! warning` |
| `Info` | `信息` / `提示` | admonition 类型保留 `!!! info` |
| `Tip` | `技巧` / `提示` | admonition 类型保留 `!!! tip` |
| `Since` (version_badge label) | `自` | 统一使用 `label="自"`，不混用 `自版本`/`添加于` |
| `Description` | `描述` / `说明` | 表格列标题统一用 `描述` |
| `Field` | `字段` | 表格列标题 |
| `Event` | `事件` | 表格列标题 |
| `Type` | `类型` | 表格列标题 |
| `Default` | `默认值` | 表格列标题 |
| `Property` | `属性` | |
| `Method` | `方法` | |
| `Parameter` / `Param` | `参数` | |
| `Return` | `返回` | |
| `Callback` | `回调` / `回调函数` | |
| `Listener` | `监听器` | |
| `Handler` | `处理器` / `处理程序` | 统一用 `处理器` |
| `Supplier` | `supplier` / `提供器` | 技术上下文保留英文 |
| `Responder` | `responder` / `响应器` | 技术上下文保留英文 |
| `Container` | `容器` | |
| `Inventory` | `物品栏` / `库存` | 玩家上下文用 `物品栏` |
| `Stack` (ItemStack/FluidStack) | `堆叠` / `堆栈` | 统一用 `堆叠` |
| `Overlay` | `覆盖层` | |
| `Tooltip` | `提示框` / `悬停提示` | 统一用 `悬停提示` |
| `Hover` | `悬停` | |
| `Focus` | `焦点` | |
| `Blur` (失焦) | `失去焦点` | |
| `Drag` | `拖拽` | |
| `Drop` | `放下` / `释放` | |
| `Layout` | `布局` | |
| `Style` / `Stylesheet` | `样式` / `样式表` | |
| `Component` (UI) | `组件` | UI 上下文 |
| `Element` | `元素` | |
| `Root` | `根` / `根元素` | |
| `Parent` / `Child` / `Children` | `父元素` / `子元素` | |
| `Target` | `目标` | 事件上下文 |
| `Current` | `当前` | |
| `Bubble` | `冒泡` | 事件上下文 |
| `Capture` | `捕获` | 事件上下文 |
| `Propagation` | `传播` | 事件上下文 |
| `Phase` | `阶段` | |
| `Server` | `服务器` / `服务端` | 统一用 `服务端` |
| `Client` | `客户端` | |
| `Remote` | `远程` / `远端` | 统一用 `远程端` |
| `Sync` | `同步` | |
| `Tick` | `tick` / `刻` | 保留 `tick`，括号可注 `（刻）` |
| `Frame` | `帧` | |
| `Partial Ticks` | `partialTicks` / `部分刻` | 保留英文变量名 |
| `Recipe` | `配方` | |
| `Machine` | `机器` | |
| `Multiblock` | `多方块结构` | |
| `Controller` | `控制器` | MBD2 上下文 |
| `Part` | `部件` | MBD2 上下文 |
| `Upgrade` | `升级` | |
| `Modifier` | `修饰符` | |
| `Predicate` | `谓词` | |
| `Condition` | `条件` | |
| `Chance` | `概率` / `几率` | |
| `Energy` | `能量` | 通用 |
| `Mana` | `魔力` | Botania 上下文 |
| `RPM` / `Stress` | `转速` / `应力` | Create 上下文 |
| `Heat` | `热量` | |
| `Pressure` / `Air` | `压力` / `空气` | PNC 上下文 |
| `Ember` | `余烬` | Embers 上下文 |
| `Aura` | `灵气` | Nature's Aura 上下文 |
| `Gas` / `Slurry` / `Pigment` / `Infusion` | 保留英文 | Mekanism 上下文 |
| `Command` | `命令` | 常规意义 |
| `Copy` / `Cut` / `Paste` / `Select All` / `Undo` / `Redo` / `Find` / `Save` | `复制` / `剪切` / `粘贴` / `全选` / `撤销` / `重做` / `查找` / `保存` | 命令事件 |
| `Ingredient` | `原料` / `配料` | 统一用 `原料` |
| `Capability` | `能力` / `功能` | 根据上下文，能力更侧重扩展性 |
| `Custom` | `自定义` | |
| `Dynamic` | `动态` | |
| `Static` | `静态` | |
| `Internal` | `内部` | |
| `External` | `外部` | |

---

## 四、格式保留规则

### 4.1 Markdown 语法
- 标题层级（`#`、`##`、`###`）必须与原文一致
- 粗体 `**text**`、斜体 `*text*` 必须保留
- 代码块语言标记（` ```java `、` ```js `、` ```shell ` 等）不得更改
- 链接 `[text](path)` 的 `path` 不得更改，`text` 可翻译
- 图片引用 `![alt](path)` 的 `alt` 文本可翻译，`path` 不得更改
- 分隔线 `---` 保留

### 4.2 MkDocs 扩展语法
- **Admonitions**（`!!! note`、`!!! warning`、`!!! info`、`!!! tip`）：类型保留英文，标题内容翻译为中文
  ```markdown
  !!! note inline end
      示例可以在<a href="../assets/example.zip" download>这里</a>下载！
  ```
- **Tabs**（`=== "Java"`、`=== "KubeJS"`）：标签名保留英文
- **version_badge 宏**：`label="Since"` 统一译为 `label="自"`
  ```markdown
  {{ version_badge("2.0.0", label="自", icon="tag", href="/changelog/#2.0.0") }}
  ```
- **Mermaid 图表**：仅翻译图表中的自然语言注释/标签，语法保留
- **HTML 标签**（`<div>`、`<video>`、`<figure>` 等）：保留结构，标签内文本可翻译
- **视频回退文本**：统一使用 `您的浏览器不支持视频播放。`

### 4.3 表格
- 表格列标题：`Event` → `事件`，`Description` → `描述`，`Field` → `字段`
- 表格中的代码项（如 `` `mouseDown` ``、`` `canTakeItems` ``）保留英文
- 表格中的纯文本描述翻译为中文
- 表格对齐语法（`|` 和 `-`）保持与原文一致

### 4.4 代码块
- **仅翻译注释**，代码本身（变量名、方法名、类名、字符串字面量、语法关键字）完全不动
- 注释翻译示例：
  ```java
  // 绑定 DataSource 以通知 Label 和 ProgressBar 的值变化
  ```
- 代码块内的注释标记（`//`、`/* */`、`#`）保留
- 行号高亮（如 ` ```java linenums="1" hl_lines="3-5" `）保留

---

## 五、常见陷阱与注意事项

### 5.1 不要翻译的内容
- 资源路径：`minecraft:lava_bucket`、`ldlib2:textures/gui/icon.png`
- 命名空间 ID：`mod_id:filename`、`mbd2:kjs_ui_test`
- 类名和接口名：`UIElement`、`BlockEffectExecutor`、`IDataConsumer<T>`
- 方法名：`setFocusable()`、`addEventListener()`、`bindDataSource()`
- 字段名：`currentElement`、`target`、`relatedTarget`
- 事件类型字符串：`mouseDown`、`dragEnter`、`focusIn`（虽然出现在代码块外时也保留）
- 常量/枚举值：`AutoRotate.NONE`、`SyncStrategy.NONE`
- Maven 坐标：`com.lowdragmc.ldlib2:ldlib2-neoforge-1.21.1`
- 版本号：`2.1.0`、`1.21.1`
- URL：保持原样
- GitHub 链接：保持原样

### 5.2 容易出错的翻译
| ❌ 错误 | ✅ 正确 | 说明 |
|--------|--------|------|
| `pig` → `猪` | `pig` → `pig` | 实体 ID 保留英文 |
| `Pig` → `Pig` | `pig` → `pig` | 实体 ID 小写 |
| `photon` → `photon` | `Photon` → `Photon` | 模组名首字母大写 |
| `Ldlbib` → `Ldlbib` | `LDLib` → `LDLib` | 拼写修正 |
| `Mbd2` / `mbd2` | `MBD2` | 统一项目缩写 |
| `Forge energy` | `Forge Energy` | 专有名词首字母大写 |
| `dispaly` | `display` | 原文拼写错误可修正 |
| `cdoe` | `code` | 原文拼写错误可修正 |
| `creatre` | `create` | 原文拼写错误可修正 |
| `copnsole` | `console` | 原文拼写错误可修正 |
| `szie` | `size` | 原文拼写错误可修正 |
| `remoge` | `remove` | 原文拼写错误可修正 |
| `boderSize` | `borderSize` | 原文拼写错误可修正 |
| `setSlefPosition` | `setSelfPosition` | 原文拼写错误可修正 |

### 5.3 继承自英文源文件的 bug
- 如果英文原文中有拼写错误或描述错误，**中文翻译时应予以修正**，并在审查报告中注明
- 但如果错误是代码中的（如 Java 代码缺少括号），**保留原样**，只修正自然语言描述

---

## 六、审查清单（翻译完成后自检）

- [ ] 所有 Minecraft 方块/物品/生物/维度/结构/附魔/状态效果名都保留英文
- [ ] 所有模组品牌名（LDLib、Photon、MBD2、KubeJS 等）保留英文且大小写正确
- [ ] 所有类名、方法名、字段名、事件名保留英文
- [ ] 代码块内仅翻译注释，代码本身未改动
- [ ] Markdown 格式（标题、表格、admonition、tab、链接、图片）完整保留
- [ ] `version_badge` 的 `label="Since"` 统一为 `label="自"`
- [ ] 视频回退文本统一为 `您的浏览器不支持视频播放。`
- [ ] 无多余空行（文件开头、结尾）
- [ ] 无全角标点出现在代码块中（如 `，` 应为 `,`）
- [ ] 表格代码块在 MkDocs tab 下有正确的 4 空格缩进

---

## 七、文件结构约定

- 英文源：`docs/en/<path>/<file>.md`
- 中文目标：`docs/zh/<path>/<file>.md`
- 目录结构必须镜像，不可遗漏子目录
- 如果英文文件仅有标题占位符（如 `# IGuiTexture`），中文也翻译为对应标题即可，无需额外扩展内容（除非有明确需求）

---

## 八、术语保留决策树

遇到不确定是否保留英文的术语时，按以下顺序判断：

1. **是否是 Minecraft 原版专有名词？** → 保留英文
2. **是否是模组品牌名/项目名？** → 保留英文（首字母大写）
3. **是否是 Java/KubeJS 代码中的类名/方法名/字段名/常量？** → 保留英文
4. **是否是技术缩写（GPU、HDR、NBT、RPC、XML、JSON）？** → 保留英文
5. **是否是资源路径/命名空间 ID？** → 保留英文
6. **是否在该项目文档中已有统一中文译法？** → 使用统一译法（参考第 3 节）
7. **以上都不是** → 翻译为中文

---

*本规范随项目演进持续更新。每次大规模翻译后，应通过 `translation-reviewer` 子代理审查并反馈修正意见，以完善本规范。*
