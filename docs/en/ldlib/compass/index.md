# Introduction 

Compass is a doucament system combine both ponder-like and quest book-like system.

You can create separate compass system for your mods and projects.

The compass is entirely file driven and requires no java code to be written.

The compass file should be placed in `/assets/project_id/compass/...`

## Structure
* `section`: The classification section in comapss, similar to the list on the left in quest. All configuration files are located at `/assets/project_id/compass/sections/..`.
* `node`: The node in the section is similar to a task node in questbook, and there are relationship between the nodes. All configuration files are located at `/assets/project_id/compass/nodes/..`.
* `page`: The node json file points to a page, edited using `xml`. All configuration files are located at `/assets/project_id/compass/pages/en_us/..`.

### Section
The section configuration is as follows:
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

* `priority`: The lower the priority, the higher in the list.
* `section_id`: The unique identification id of a section is determined by the path to the configuration file. For example, if a section file is located at `assets/gtceu/compass/sections/my_section.json`, then its `section_id` should be `gtceu:my_section`

### Node
The section configuration is as follows:
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

* `section`: section id. It indicates which section the node belongs to.
* `size`: size of the node in the section view. (default by 24)
* `position`: the relative coordinates in the section view. The actual display position in the screen is calculated by compass automatically.
* `pre_nodes`: it refers to its parent nods. the section view will show their relations by lines. And a quick link to these relevant nodes is shown on the right panel after you open the page view.
* `items`: Pressing `[C]` when you're looking hover toolips at specifc items for a while will quickly open the compass system.

### Page
Pages are configured using xml, you can learn it by reading the ttuto [Compass XML](xml.md). The comments detail the purpose of tags in xml.

`Localization`: You can localize xml files by placing them in different language folders. such as: 

* en_us: `assets/ldlib/compass/pages/en_us/my_page.xml`
* zh_cn: `assets/ldlib/compass/pages/zh_cmn/my_page.xml`

## Example
unzip it under the `.minecraft/ldlib/assets/...`
[example.zip](https://github.com/Low-Drag-MC/LDLib-Architectury/files/12213577/example.zip)
