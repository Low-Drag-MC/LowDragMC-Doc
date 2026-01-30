# Compass XML

We will breifly inllustrates labels in the xml.

## generic attributes
```xml
<page>
  <xxx top-margin="10" bottom-margin="10" left-margin="10", right-margin="10">
  <!--margin is a generic property that represents the amount of space reserved between the previous component and the next component. The default is 0.-->
  </xxx>
</page>
```

## Header
```xml
<page>
    <h1>Title H1 <lang key="ldlib.author"/></h1> <!-- label <lang/> can be used to load text according to the lang key -->
    <h2>Title H2</h2>
    <h3>Title H3</h3>
    <!-- attributes-->
    <h1 space="2" font-size="9" isCenter="false" isShadow="true"> <!-- space: row spacing-->
</page>
```

## Blank
```xml
<page>
    <br height="20"/> <!--blank height-->
</page>
```

## Text
```xml
<page>
    <text>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit,
        <style underlined="true" link="ldlib:test_node2">
            link to node2
        </style>
        <style underlined="true" url-link="https://github.com/Low-Drag-MC/LDLib-Architectury">
            link to url
        </style>
        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        <style color="#ffff0000" hover-info="hover tooltips">
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi
            ut aliquip ex ea commodo consequat.
        </style>
        <br/>
        Duis aute irure dolor in reprehenderit
        in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
    </text>
    <!-- attributes-->
    <text space="2" isCenter="false">
        <br/> <!--new line-->
        <lang key="ldlib.author"/> <!-- used to load text according to the lang key -->
        <style color="#ffffffff" bold="false" italic="false" underlined="false" strikethrough="false" obfuscated="false"> 
            <!--The style of the text in the range-->
        </style>
        <style hover-info="hover tooltips" link="ldlib:my_node_2"> 
            <!--link will jump to the given node while click-->
        </style>
    </text>
</page>
```

## Image
```xml
<page>
    <image width="160" height="40" type="resource" top-margin="10" bottom-margin="10" url="gtceu:textures/gt_logo_long.png" hover-info="tooltips">
        <!-- same as the text label here -->
        description of the image.
    </image>
    <image width="100" height="100" type="item" item="minecraft:stone"/>
</page>
```

## Recipe
```xml
<page>
    <recipe id="minecraft:barrel"/> <!--recipe id-->
</page>
```

## Ingredient
```xml
<page>
    <ingredient>
	<item item="minecraft:stick" count="3"/>
	<item tag="minecraft:ores" forge-tag="forge:ores/gold" fabric-tag="c:ores/gold" count="64"/>
	<fluid fluid="minecraft:lava" count="64000"/>
    </ingredient>
</page>
```

## Scene
```xml
<page>
    <scene height="300"> <!-- draggable="false" scalable="false" zoom="6" camera="perspective"  yaw="25"can also be set here-->
	<page>
	    <block pos="0 0 0" block="minecraft:glass"/>
	    <block pos="1 0 0" block="minecraft:dirt" item-tips="true"/>
	    <block pos="0 0 1" block="minecraft:furnace">hover info</block>
	</page>
         <page>
	    <block pos="0 0 0" block="minecraft:redstone"/>
	    <block pos="1 0 0" block="minecraft:wool" item-tips="true"/>
	    <block pos="0 0 1" block="minecraft:grass">hover info</block>
	</page>
    </scene>
</page>
```

## Storyline Scene
Please refer to the page [Compass Scene](scene.md)

## Useful command to get the nbt of the blockentity/entity.
It's inevitable that when you're writing a scene you'll come across some blocks/entities that require nbt to be set. 

while you can get it by `/data get block/entity` you can't copy it in the game.

Ldlib provides a command to help you get the nbt of a block/entity in your game and copy it to the clipboard.

`/ldlib copy_block_tag [pos]` / `/ldlib copy_entity_tag [entity_selector]`: chat panel will show the tag when you execute this command. and you mouse click the `[Copy to clipboard]` in the chat panel to copy to the clipboard.