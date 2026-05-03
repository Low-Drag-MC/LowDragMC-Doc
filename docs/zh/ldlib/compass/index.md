# 简介

Compass 是一个结合了类 Ponder 和类任务书系统的文档系统。

你可以为你的模组和项目创建独立的 Compass 系统。

Compass 完全由文件驱动，无需编写 Java 代码。

Compass 文件应放置在 `/assets/project_id/compass/...`

## 结构
* `section`：Compass 中的分类板块，类似于任务书左侧的列表。所有配置文件位于 `/assets/project_id/compass/sections/..`。
* `node`：板块中的节点，类似于任务书中的任务节点，节点之间存在关联。所有配置文件位于 `/assets/project_id/compass/nodes/..`。
* `page`：节点 json 文件指向一个使用 `xml` 编辑的页面。所有配置文件位于 `/assets/project_id/compass/pages/en_us/..`。

### Section
Section 配置如下：
```json
{
  "button_texture": {
    "type": "item",
    "res": "minecraft:apple"
  },
  "priority": 1,
  "background_texture": {
    "type": "resource",
    "res": "ldlib:textures/gui/icon.png"
  }
}
```

* `priority`：优先级越低，在列表中位置越靠上。
* `section_id`：Section 的唯一标识 id，由配置文件的路径决定。例如，如果 Section 文件位于 `assets/gtceu/compass/sections/my_section.json`，则其 `section_id` 应为 `gtceu:my_section`

### Node
Node 配置如下：
```json
{
  "section": "ldlib:my_section",
  "szie": 24,
  "button_texture": {
    "type": "item",
    "res": "minecraft:black_wool"
  },
  "position": [50, 50],
  "pre_nodes": [
    "ldlib:my_node_2"
  ],
  "page": "ldlib:my_node",
  "items": [
    "minecraft:apple",
    "minecraft:stone"
  ]
}
```

* `section`：Section id。它指示该节点属于哪个 Section。
* `size`：节点在 Section 视图中的大小。（默认值为 24）
* `position`：节点在 Section 视图中的相对坐标。实际在屏幕中的显示位置由 Compass 自动计算。
* `pre_nodes`：指向其父节点。Section 视图将通过线条展示它们之间的关系。打开页面视图后，右侧面板会显示这些相关节点的快速链接。
* `items`：当你将鼠标悬停在特定物品的提示框上时，按下 `[C]` 键可以快速打开 Compass 系统。

### Page
页面使用 xml 进行配置，你可以通过阅读教程 [Compass XML](xml.md) 来了解它。其中的注释详细说明了 xml 中标签的用途。

`本地化`：你可以通过将 xml 文件放置在不同的语言文件夹中来对其进行本地化。例如：

* en_us：`assets/ldlib/compass/pages/en_us/my_page.xml`
* zh_cn：`assets/ldlib/compass/pages/zh_cmn/my_page.xml`

## 示例
将其解压到 `.minecraft/ldlib/assets/...` 目录下
[example.zip](https://github.com/Low-Drag-MC/LDLib-Architectury/files/12213577/example.zip)