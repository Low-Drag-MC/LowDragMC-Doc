# 槽位名与配方查看器 UI

<VersionBadge version="21.1.1" label="MBD2" icon="tag" />

每一条配方内容都带着两个互不相干的名字：

| 字段 | 回答的问题 | 影响范围 |
| --- | --- | --- |
| `slotName` | *这条内容由哪个 Trait 处理* | 配方匹配以及世界中的实际进出 |
| `uiName` | *这条内容显示在哪个控件上* | 仅 JEI/REI/EMI 的配方页面 |

两者从不互相影响。只设了 `slotName` 的内容会被路由到指定名字的 handler，同时显示在默认控件上；只设了 `uiName` 的内容显示位置固定，但由任意空闲的 Trait 处理。

## `slotName`：路由到 Trait

### 在 Trait 上声明名字

每个配方能力 Trait 的 Inspector 里都有三个相邻的字段：

| 字段 | 含义 |
| --- | --- |
| **Recipe Handler IO** | 匹配时这个 Trait 算输入、输出还是两者 |
| **Distinct** | 只有当它能独自满足本能力的*全部*内容时才会被使用 |
| **Slot Names** | 这个 Trait 负责的名字列表 |

Slot Names 是一组自由字符串。不填就是空的，而空列表意味着"这个 Trait 只处理没有名字的内容"。

::: warning 槽位名不是 Trait 的名字
Trait 的名字（`input_items`、`coolant` 等）是 `getTraitByName` 用的那个。Slot Names 是另一个列表，配方的 `slotName` 只和这个列表比对，永远不会和 Trait 名字比对。
:::

### 匹配时如何使用

在询问任何 handler 之前，内容会先被分成两堆：无名的，以及按槽位名分组的。

1. **先试 distinct handler。** 只有当它能吃下全部无名内容，*并且* 它的 Slot Names 包含配方在该能力上用到的**每一个**名字时，才会被采用。要么全包要么不用——distinct handler 绝不会和别的 handler 拼合。
2. **然后按顺序试非 distinct 的 handler。** 每个 handler 会拿到剩余的无名内容，以及名字出现在它 Slot Names 里的那些分组。
3. 到最后还没被认领的就是失败。输入端表现为配方直接不匹配；输出端 MBD2 会打出 `io error while handling a recipe <id> outputs`，配方失败。

也就是说，一个没有任何 Trait 声明的名字会悄无声息地让配方永远跑不起来。这是"JEI 里看得到配方，机器就是不动"最常见的原因。

### 多方块的情况

成型后的控制器会收集各部件的 handler，并把每个 handler 连同合并后的槽位名集合一起包装，所以部件上的 Slot Names 对控制器的配方逻辑是可见的，不需要在控制器上重复声明。

### 运行时覆盖

`slot_names` 是一个[运行时值](../editor/runtime-values.md)，所以单台机器可以负责与其定义不同的名字。修改它会重建这台机器的能力代理表——以及它作为部件所属的每一个控制器的代理表——因此改动会立刻对匹配生效。

## `uiName`：绑定到配方查看器

配方查看器的页面是一个由配方类型持有的 UI 模板（编辑器中的 **Recipe Display UI**）。MBD2 通过查找元素 ID 来填充它。

### 默认 ID

`uiName` 为空时，MBD2 会去找 ID 匹配下面这个形式的元素：

```text
@<capability>_<io>_<index>
```

- `<capability>` 是能力的注册名 —— `item`、`fluid`、`forge_energy` 等
- `<io>` 输入为 `import`，输出为 `export`
- `<index>` 是这条内容在**该 IO 下该能力那份列表中**的位置，从 0 开始

所以一个配方的第二个流体输出是 `@fluid_export_1`，前面有多少个物品输出都不影响。

这种形式是**完全锚定**匹配的：只有整个 ID 恰好等于该字符串的元素才会被绑定。

### 显式设置 `uiName`

显式的 `uiName` 是按**子串**匹配的，不是精确 ID。`uiName('bonus')` 会绑定所有 ID 中包含 `bonus` 的元素 —— `bonus`、`bonus_output`、`my_bonus_slot` 都算。这是有意为之：一条内容可以同时驱动多个控件。但反过来，名字太短就可能捕获到你并不想要的元素，所以尽量取得独特一些。

### 绑定具体做了什么

由能力自己决定。物品能力要求元素是 `ItemSlot`；它会收到物品堆，或者当 ingredient 匹配多个物品时收到一个滚动数据源，并被标记为输入或输出供配方查看器自身查询使用。内容的提示文本 —— 概率、每档概率加成、per tick —— 会追加到元素原有的提示上。

没有任何内容匹配到的元素会保持编辑器里画的样子，**不会**被隐藏。

## 保留元素 ID

这些是按精确 ID 查找的，不走正则，并且对每个配方都会填充：

| ID | 元素类型 | 行为 |
| --- | --- | --- |
| `@progress_bar` | `ProgressBar` | 以 2 秒为周期的 0 → 1 循环动画；提示文本显示时长 |
| `@duration` | `Label` | 文本设为配方时长 |
| `@condition` | 任意 | 配方无条件时隐藏；否则挂上一个悬浮提示，每个条件一行 |
| `@custom_data` | `Button` | 配方没有 `data` 时隐藏；点击弹出对话框，以易读格式显示 NBT |

::: tip 两套不同的 ID 约定
`@…` 开头的 ID 属于**配方查看器**模板。机器自身的 UI 用的是 `ui:` 开头的 ID —— `ui:machine_name`、`ui:progress_bar`、`ui:fuel_bar`、`ui:xei_lookup`。`uiName` 对机器 UI 没有任何作用。
:::

## Recipe Display UI 编辑器

<figure><img src="/assets/multiblocked2/recipes/recipe-display-ui.png" alt="MBD2 配方查看器 UI 编辑器，展示配方在 JEI、REI 或 EMI 中显示所用的模板"><figcaption>配方类型的显示模板。内容控件就是普通的 UIElement，MBD2 按它们的 ID 查找。</figcaption></figure>

**RecipeType UI View** 会替你添加带正确 ID 的元素：

| 操作 | 添加的内容 |
| --- | --- |
| Add Input / Add Output | 指定能力的一个内容控件，索引取该能力与该 IO 下的下一个空位 |
| Progress Bar、Duration Text、Conditions Group、Custom Data | 对应的保留元素 |
| Generate All | 根据配方类型的内置配方生成一整套模板 |

::: warning Generate All 只看得到内置配方
它扫描的是**保存在配方类型工程里**的那些配方，并按其中最大的一个所需的数量，为每个能力和 IO 创建对应数量的控件。如果一个配方类型的配方全部来自 KubeJS 或数据包，它就没有内置配方，Generate All 只会生成一个空布局。要么手动添加控件，要么先在编辑器里写一个有代表性的配方再生成。
:::

新建配方类型自带的默认模板里只有 `@progress_bar` 和 `@duration`，一个内容控件都没有。在你添加之前，配方只会显示一个进度条。

## 两个字段的设置方式

两者都是配方 builder 上的修饰状态：在它们生效期间创建的每条内容都会被打上标记。回调形式会在结束后恢复原值，更安全。

- KubeJS：见[修饰器状态机](../KubeJS/recipe.md#修饰器状态机)与[路由示例](capability-reference.md#路由字段)。
- Java：`MBDRecipeBuilder` 上同名的链式字段，用 `slotName(null)` / `uiName(null)` 清除。

## 排查清单

1. 配方里的 `slotName` 出现在某个 Trait 的 **Slot Names** 列表里 —— 而不是它的 Trait 名字里。
2. 那个 Trait 的 **Recipe Handler IO** 支持该内容使用的方向。
3. 如果该 Trait 勾了 **Distinct**，它必须能独自满足该能力的全部内容。
4. 配方查看器模板里有 ID 能匹配上的元素 —— 默认是 `@<capability>_<io>_<index>`。
5. 该元素的类型正是该能力要绑定的类型（物品对应 `ItemSlot`，以此类推）。
6. 运行时改了 Slot Names 之后，是在下一次配方搜索时重新匹配，不会影响正在运行的配方。
