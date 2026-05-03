# Compass Scene

Compass Scene is inspired by the ponder. The difference is that you don't need to write code, and all scenes can be implemented through `xml`. This page details how to configure a scene.

***
### `<compass/>`
Prepare your scene settings:
* `scene`: only use the scene (disable the information above)
* `height`: scene height
* `zoom`: zoom intial value
* `range`: plane range intial value
* `draggable`: whether the scene is draggable
* `scalable`: whether the scene is scalable
* `camera`: camera mode, `perspective` or `ortho`
* `yaw`: yad intial value
* `tick-scene`: should the scene try to call objects' tick functions, such as blockentities, entities, particles.
```xml
<page>
    <compass tick-scene="true"> 
    <!-- scene="true" height="250" zoom="28" range="5" draggable="false" scalable="false" camera="perspective" yaw="25" tick-scene="false" can also be set here-->
    </compass>
</page>
```

### `<frame/>`
The compass scene consists of many `<frame>`. `<frame>` refers to a chapter/section of the scene animation.

The user can jump back and forth between frames, but not to a specific moment of animation within the frame.

`<description/>`: Describes the frame, shows it on hover tooltips, and has the same syntax as the `<text/>` label.
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
Actions are used under the `<frame/>` tag.
There are two types of built-in actions `<information/>` and `<scene/>`. You can register custom actions via Java if you want.

Actions are executed sequentially, and the next action is executed if and only if the last action is completed, but this can be adjusted using the following attributes, similar to ppt animation:
 - delay: delay time after last action finish. (tick)
 - start-before-last: start this action while the last one is performing.
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
Action information: display text and images on top
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
Action scene: Animate the scene. **Notice that all the operations under the `<scene/>` are performing simultaneously**. More than one `<scene/>` label should be used when the operation is sequential.

Operations: `<add/>`, `<remove/>`, `<modify/>`, `<add-entity/>`, `<modify-entity/>`, `<remoge-entity/>`, `<rotation/>`, `<highlight/>`, `<tooltip/>`

#### `<add/>`
```xml
<!--add block to the scene with animation-->
<add pos="0 0 0" block="minecraft:glass"/>
<!--add block with properties-->
<add pos="1 1 0" block="minecraft:campfire">
    <properties name="lit" value="false"/>
</add>
<!--add block with nbt for blockentity-->
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
<!--offset: animation offset, duration: animation duration-->
<add pos="0 1 0" offset="3 1 0" duration="40" block="minecraft:glass"/>
```
#### `<remove/>`
```xml
<!--remove block from the scene with animation-->
<remove pos="0 0 0" offset="3 1 0" duration="40"/>
```
#### `<modify/>`
```xml
<!--modify a block, its kinda similar to the add label but without animation -->
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
<!-- add entities by its type name. You have to allocate it an id, or a random id will be generated-->
<add-entity pos="0 1 0" type="minecraft:player" id="12"/>
<!-- add entities with tag-->
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
<!-- remove entity by id-->
<remove-entity id="12" force="true"/>
```
#### `<modify-entity/>`
```xml
<!-- modify entity's tag and position by id-->
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
<!--rotate the scene view-->
<rotation degree="90"/>
```
#### `<hightlight/>`
```xml
<!--hightlight a block or a face of the block-->
<highlight pos="0 0 0" duration="70"/>
<highlight pos="0 0 0" face="UP" duration="70"/>
```
#### `<tooltip/>`
```xml
<!--Point to a location in the scene and provide a description-->
<tooltip pos="1.5 1.5 0.5" screen-offset="0.6 0.5" duration = "60" item="minecraft:flint_and_steel">
    <!--pos: position in the scene, screen-offset: description positon in the compass view-->
    lit = <style color="0xff00ff00">true</style>
</tooltip>
```
***
### Example
Now lets review the compass structure:

<img width="1399" alt="WechatIMG44" src="https://github.com/Low-Drag-MC/LDLib-Architectury/assets/18493855/1d82ec46-a924-4b0f-a3f6-031bf6843829">

Lets check how do the aboves actions look like!!

![demo2](https://github.com/Low-Drag-MC/LDLib-Architectury/assets/18493855/b7cc80c2-bd2e-405a-8b51-8ccbf0fdff86)

```xml
<page>
    <compass tick-scene="true"> <!-- scene="true" height="250" zoom="28" range="5" draggable="false" scalable="false" camera="perspective" yaw="25" tick-scene="false" can also be set here-->
        <!-- Frames divide the animation into different parts, similar to how the animation is segmented in a ponder. Frames are executed sequentially.-->
        <frame> <!-- duration="-1" delay="0"-->
            <description>
                <!-- Describes the frame, shows it on hovertooltips, and has the same syntax as the text label-->
                section 1.
            </description>
            <!--actions-->
            <!--Actions are executed sequentially, and the next action is executed if and only if the last action is completed, but this can be adjusted using the following attributes, similar to ppt animation.
                delay="0"
                start-before-last="false"
            -->

            <!--Action information: display text and images on top-->
            <information type="item" url="minecraft:apple">
                <style bold="true" color="#ffff0000"><lang key="ldlib.author"/></style>
            </information>

            <!--Action scene: Animate the scene. Notice that all the operations under the <scene/> are happening simultaneously. More than one <scene/> label should be used when the operation is sequential-->
            <scene start-before-last="true">
                <!--add block to the scene with animation-->
                <add pos="0 0 0" block="minecraft:glass"/>
                <!--add block with properties-->
                <add pos="1 1 0" block="minecraft:campfire">
                    <properties name="lit" value="false"/>
                </add>
                <!--add block with nbt for blockentity-->
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
                <!--offset: animation offset, duration: animation duration-->
            </scene>
            <scene>
                <!--modify a block, its kinda similar to the add label but without animation -->
                <modify pos="1 1 0" block="minecraft:campfire">
                    <properties name="lit" value="true"/>
                </modify>
            </scene>
            <scene>
                <!--remove block from the scene with animation-->
                <remove pos="0 0 0" offset="3 1 0" duration="40"/>
            </scene>
            <scene>
                <!--Point to a location in the scene and provide a description-->
                <tooltip pos="1.5 1.5 0.5" screen-offset="0.6 0.5" duration = "60" item="minecraft:flint_and_steel">
                    <!--pos: position in the scene, screen-offset: description positon in the compass view-->
                    lit = <style color="0xff00ff00">true</style>
                </tooltip>
            </scene>
            <scene>
                <!--hightlight a block or a face of the block-->
                <highlight pos="0 0 0" duration="70"/>
                <highlight pos="0 0 0" face="UP" duration="70"/>
            </scene>
            <scene>
                <!--rotate the scene view-->
                <rotation degree="90"/>
            </scene>
        </frame>
        <frame>
            <description>
                <!-- Describes the frame, shows it on hovertooltips, and has the same syntax as the text label-->
                section 2.
            </description>
            <scene>
                <!-- add entities by its type name. You have to allocate it an id, or a random id will be generated-->
                <add-entity pos="0 1 0" type="minecraft:player" id="12"/>
                <!-- add entities with tag-->
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
                <!-- Describes the frame, shows it on hovertooltips, and has the same syntax as the text label-->
                section 3.
            </description>
            <scene>
                <!-- modify entity's tag and position by id-->
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
                <!-- remove entity by id-->
                <remove-entity id="12" force="true"/>
            </scene>
        </frame>
    </compass>
</page>
```