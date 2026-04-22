# Compass Scene

Compass Scene 的设计灵感来源于 Ponder。不同之处在于，你无需编写代码，所有场景都可以通过 `xml` 来实现。本页详细介绍如何配置场景。

***
### `<compass/>`
准备你的场景设置：
* `scene`：仅使用场景视图（禁用上方信息栏）
* `height`：场景高度
* `zoom`：初始缩放值
* `range`：初始平面范围
* `draggable`：场景是否可拖拽
* `scalable`：场景是否可缩放
* `camera`：摄像机模式，`perspective`（透视）或 `ortho`（正交）
* `yaw`：初始偏航值
* `tick-scene`：场景是否尝试调用对象的 tick 函数，例如 BlockEntity、实体、粒子
```xml
<page>
    <compass tick-scene="true"> 
    <!-- 这里也可以设置 scene="true" height="250" zoom="28" range="5" draggable="false" scalable="false" camera="perspective" yaw="25" tick-scene="false" -->
    </compass>
</page>
```

### `<frame/>`
Compass Scene 由多个 `<frame>` 组成。`<frame>` 代表场景动画中的一个章节/片段。

用户可以在不同帧之间来回跳转，但无法跳转到某一帧内的具体时刻。

`<description/>`：描述该帧，鼠标悬停时显示提示，语法与 `<text/>` 标签相同。
```xml
<page>
    <compass>
        <frame>
            <description>F1</description>
            <!--actions-->
        </frame>
        <frame>
            <description>F2</description>
            <!--actions-->
        </frame>
        <frame>
            <description>F3</description>
            <!--actions-->
        </frame>
    </compass>
</page>
```
<img width="564" alt="image" src="https://github.com/Low-Drag-MC/LDLib-Architectury/assets/18493855/6958aeb0-584b-4fb3-b7b4-5dff2492cfd7">


### Actions
Actions 在 `<frame/>` 标签下使用。

内置的 Actions 有两种：`<information/>` 和 `<scene/>`。你也可以通过 Java 注册自定义 Actions。

Actions 按顺序依次执行，只有当前一个 Action 完成后，下一个才会执行，但可以通过以下属性进行调整，类似于 PPT 动画：
 - `delay`：上一个 Action 完成后的延迟时间（单位为 tick）
 - `start-before-last`：在上一个 Action 执行期间同时开始此 Action
```xml
<frame>
    <information type="item" url="minecraft:apple">
        <style bold="true" color="#ffff0000"><lang key="ldlib.author"/></style>
    </information>
    <scene delay="20">
        <add pos="1 0 1" block="minecraft:glass"/>
    </scene>
    <scene start-before-last="true">
        <add pos="0 0 0" block="minecraft:glass"/>
    </scene>
</frame>
```
<img width="529" alt="image" src="https://github.com/Low-Drag-MC/LDLib-Architectury/assets/18493855/bf2492a8-1479-4762-bbdb-71c47f19b2d1">

***
### `<information/>`
信息 Action：在顶部显示文字与图片
```xml
<information>
    <style bold="true" color="#ffff0000"><lang key="ldlib.author"/></style>
</information>
<information type="item" url="minecraft:apple">
    item
</information>
<information type="resource" url="ldlib:textures/gui/icon.png">
    image
</information>
<information type="shader" url="ldlib:fbm">
    shader
</information>
```
### `<scene/>`
场景 Action：为场景添加动画。**请注意，`<scene/>` 下的所有操作是同时进行的**。若需要按顺序执行，应使用多个 `<scene/>` 标签。

操作包括：`<add/>`、`<remove/>`、`<modify/>`、`<add-entity/>`、`<modify-entity/>`、`<remoge-entity/>`、`<rotation/>`、`<highlight/>`、`<tooltip/>`

#### `<add/>`
```xml
<!-- 将方块以动画形式添加到场景中 -->
<add pos="0 0 0" block="minecraft:glass"/>
<!-- 添加带有属性的方块 -->
<add pos="1 1 0" block="minecraft:campfire">
    <properties name="lit" value="false"/>
</add>
<!-- 添加带有 NBT 数据的方块，用于 BlockEntity -->
<add pos="3 0 1" block="minecraft:chest">
    <nbt>
        {
            Items: [
                {
                    Count: 63b,
                    Slot: 0b,
                    id: "minecraft:coal_block"
                }
            ]
        }
    </nbt>
</add>
<!-- offset: 动画偏移量, duration: 动画持续时间 -->
<add pos="0 1 0" offset="3 1 0" duration="40" block="minecraft:glass"/>
```
#### `<remove/>`
```xml
<!-- 将方块以动画形式从场景中移除 -->
<remove pos="0 0 0" offset="3 1 0" duration="40"/>
```
#### `<modify/>`
```xml
<!-- 修改一个方块，与 add 标签类似，但没有动画 -->
<modify pos="1 1 0" block="minecraft:campfire">
    <properties name="lit" value="true"/>
    <nbt>
        {
        }
    </nbt>
</modify>
```
#### `<add-entity/>`
```xml
<!-- 通过类型名称添加实体。你必须为其分配一个 id，否则将生成随机 id -->
<add-entity pos="0 1 0" type="minecraft:player" id="12"/>
<!-- 添加带有标签的实体 -->
<add-entity pos="0.5 3 0.5" type="minecraft:item" id="2">
    <nbt>
        {
            Item: {
                Count: 64b,
                id: "minecraft:spruce_door"
            }
        }
    </nbt>
</add-entity>
```
#### `<remove-entity/>`
```xml
<!-- 通过 id 移除实体 -->
<remove-entity id="12" force="true"/>
```
#### `<modify-entity/>`
```xml
<!-- 通过 id 修改实体的标签和位置 -->
<modify-entity pos="3 0 3" id="12">
    <nbt>
        {
            Inventory: [
                {
                    Count: 1b,
                    Slot: 0b,
                    id: "minecraft:stone_sword",
                    tag: {
                        Damage: 0
                    }
                }
            ],
            SelectedItemSlot: 0,
            Rotation: [
                -30f,
                0f
            ]
        }
    </nbt>
</modify-entity>
```
#### `<rotation/>`
```xml
<!-- 旋转场景视角 -->
<rotation degree="90"/>
```
#### `<hightlight/>`
```xml
<!-- 高亮显示一个方块或其某个面 -->
<highlight pos="0 0 0" duration="70"/>
<highlight pos="0 0 0" face="UP" duration="70"/>
```
#### `<tooltip/>`
```xml
<!-- 指向场景中的某个位置并提供描述 -->
<tooltip pos="1.5 1.5 0.5" screen-offset="0.6 0.5" duration = "60" item="minecraft:flint_and_steel">
    <!-- pos: 在场景中的位置, screen-offset: 描述在 Compass 视图中的位置 -->
    lit = <style color="0xff00ff00">true</style>
</tooltip>
```
***
### Example
现在我们来回顾一下 Compass 的结构：

<img width="1399" alt="WechatIMG44" src="https://github.com/Low-Drag-MC/LDLib-Architectury/assets/18493855/1d82ec46-a924-4b0f-a3f6-031bf6843829">

让我们看看上述 Actions 的实际效果！！

![demo2](https://github.com/Low-Drag-MC/LDLib-Architectury/assets/18493855/b7cc80c2-bd2e-405a-8b51-8ccbf0fdff86)

```xml
<page>
    <compass tick-scene="true"> <!-- 这里也可以设置 scene="true" height="250" zoom="28" range="5" draggable="false" scalable="false" camera="perspective" yaw="25" tick-scene="false" -->
        <!-- Frames 将动画分割为不同的部分，类似于 Ponder 中的分段。Frames 按顺序执行。-->
        <frame> <!-- duration="-1" delay="0"-->
            <description>
                <!-- 描述该帧，鼠标悬停时显示提示，语法与 text 标签相同 -->
                section 1.
            </description>
            <!--actions-->
            <!--Actions 按顺序执行，只有前一个完成后，下一个才会执行，但可以通过以下属性进行调整，类似于 PPT 动画。
                delay="0"
                start-before-last="false"
            -->

            <!-- 信息 Action：在顶部显示文字和图片 -->
            <information type="item" url="minecraft:apple">
                <style bold="true" color="#ffff0000"><lang key="ldlib.author"/></style>
            </information>

            <!-- 场景 Action：为场景添加动画。请注意，<scene/> 下的所有操作是同时进行的。若需要按顺序执行，应使用多个 <scene/> 标签 -->
            <scene start-before-last="true">
                <!-- 将方块以动画形式添加到场景中 -->
                <add pos="0 0 0" block="minecraft:glass"/>
                <!-- 添加带有属性的方块 -->
                <add pos="1 1 0" block="minecraft:campfire">
                    <properties name="lit" value="false"/>
                </add>
                <!-- 添加带有 NBT 数据的方块，用于 BlockEntity -->
                <add pos="3 0 1" block="minecraft:chest">
                    <nbt>
                        {
                            Items: [
                                {
                                    Count: 63b,
                                    Slot: 0b,
                                    id: "minecraft:coal_block"
                                }
                            ]
                        }
                    </nbt>
                </add>
                <add pos="0 1 0" offset="3 1 0" duration="40" block="minecraft:glass"/>
                <!-- offset: 动画偏移量, duration: 动画持续时间 -->
            </scene>
            <scene>
                <!-- 修改一个方块，与 add 标签类似，但没有动画 -->
                <modify pos="1 1 0" block="minecraft:campfire">
                    <properties name="lit" value="true"/>
                </modify>
            </scene>
            <scene>
                <!-- 将方块以动画形式从场景中移除 -->
                <remove pos="0 0 0" offset="3 1 0" duration="40"/>
            </scene>
            <scene>
                <!-- 指向场景中的某个位置并提供描述 -->
                <tooltip pos="1.5 1.5 0.5" screen-offset="0.6 0.5" duration = "60" item="minecraft:flint_and_steel">
                    <!-- pos: 在场景中的位置, screen-offset: 描述在 Compass 视图中的位置 -->
                    lit = <style color="0xff00ff00">true</style>
                </tooltip>
            </scene>
            <scene>
                <!-- 高亮显示一个方块或其某个面 -->
                <highlight pos="0 0 0" duration="70"/>
                <highlight pos="0 0 0" face="UP" duration="70"/>
            </scene>
            <scene>
                <!-- 旋转场景视角 -->
                <rotation degree="90"/>
            </scene>
        </frame>
        <frame>
            <description>
                <!-- 描述该帧，鼠标悬停时显示提示，语法与 text 标签相同 -->
                section 2.
            </description>
            <scene>
                <!-- 通过类型名称添加实体。你必须为其分配一个 id，否则将生成随机 id -->
                <add-entity pos="0 1 0" type="minecraft:player" id="12"/>
                <!-- 添加带有标签的实体 -->
                <add-entity pos="0.5 3 0.5" type="minecraft:item" id="2">
                    <nbt>
                        {
                            Item: {
                                Count: 64b,
                                id: "minecraft:spruce_door"
                            }
                        }
                    </nbt>
                </add-entity>
            </scene>
        </frame>
        <frame delay="40">
            <description>
                <!-- 描述该帧，鼠标悬停时显示提示，语法与 text 标签相同 -->
                section 3.
            </description>
            <scene>
                <!-- 通过 id 修改实体的标签和位置 -->
                <modify-entity pos="3 0 3" id="12">
                    <nbt>
                        {
                            Inventory: [
                                {
                                    Count: 1b,
                                    Slot: 0b,
                                    id: "minecraft:stone_sword",
                                    tag: {
                                        Damage: 0
                                    }
                                }
                            ],
                            SelectedItemSlot: 0,
                            Rotation: [
                                -30f,
                                0f
                            ]
                        }
                    </nbt>
                </modify-entity>
            </scene>
            <scene>
                <rotation degree="180"/>
                <tooltip pos="3 0.7 3" duration="60" screen-offset="0.2 0.5">
                    Carry a sword to fight!
                </tooltip>
            </scene>
            <scene>
                <!-- 通过 id 移除实体 -->
                <remove-entity id="12" force="true"/>
            </scene>
        </frame>
    </compass>
</page>
```
