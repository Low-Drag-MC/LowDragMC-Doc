# Compass XML

我们将简要介绍 XML 中的标签。

## 通用属性
```xml
<page>
  <xxx top-margin="10" bottom-margin="10" left-margin="10", right-margin="10">
  <!--margin 是一个通用属性，表示在前一个组件和后一个组件之间保留的空间量。默认为 0。-->
  </xxx>
</page>
```

## 标题
```xml
<page>
    <h1>标题 H1 <lang key="ldlib.author"/></h1> <!-- 标签 <lang/> 可以根据语言键加载文本 -->
    <h2>标题 H2</h2>
    <h3>标题 H3</h3>
    <!-- 属性 -->
    <h1 space="2" font-size="9" isCenter="false" isShadow="true"> <!-- space: 行间距 -->
</page>
```

## 空行
```xml
<page>
    <br height="20"/> <!-- 空行高度 -->
</page>
```

## 文本
```xml
<page>
    <text>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit,
        <style underlined="true" link="ldlib:test_node2">
            链接到 node2
        </style>
        <style underlined="true" url-link="https://github.com/Low-Drag-MC/LDLib-Architectury">
            链接到 URL
        </style>
        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        <style color="#ffff0000" hover-info="悬浮提示">
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi
            ut aliquip ex ea commodo consequat.
        </style>
        <br/>
        Duis aute irure dolor in reprehenderit
        in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
    </text>
    <!-- 属性 -->
    <text space="2" isCenter="false">
        <br/> <!-- 换行 -->
        <lang key="ldlib.author"/> <!-- 根据语言键加载文本 -->
        <style color="#ffffffff" bold="false" italic="false" underlined="false" strikethrough="false" obfuscated="false"> 
            <!-- 范围内的文本样式 -->
        </style>
        <style hover-info="悬浮提示" link="ldlib:my_node_2"> 
            <!-- 点击时链接会跳转到给定的节点 -->
        </style>
    </text>
</page>
```

## 图片
```xml
<page>
    <image width="160" height="40" type="resource" top-margin="10" bottom-margin="10" url="gtceu:textures/gt_logo_long.png" hover-info="提示">
        <!-- 与文本标签在此处作用相同 -->
        图片描述。
    </image>
    <image width="100" height="100" type="item" item="minecraft:stone"/>
</page>
```

## 配方
```xml
<page>
    <recipe id="minecraft:barrel"/> <!-- 配方 id -->
</page>
```

## 材料
```xml
<page>
    <ingredient>
	<item item="minecraft:stick" count="3"/>
	<item tag="minecraft:ores" forge-tag="forge:ores/gold" fabric-tag="c:ores/gold" count="64"/>
	<fluid fluid="minecraft:lava" count="64000"/>
    </ingredient>
</page>
```

## 场景
```xml
<page>
    <scene height="300"> <!-- 还可以在此处设置 draggable="false" scalable="false" zoom="6" camera="perspective" yaw="25" -->
	<page>
	    <block pos="0 0 0" block="minecraft:glass"/>
	    <block pos="1 0 0" block="minecraft:dirt" item-tips="true"/>
	    <block pos="0 0 1" block="minecraft:furnace">悬浮信息</block>
	</page>
         <page>
	    <block pos="0 0 0" block="minecraft:redstone"/>
	    <block pos="1 0 0" block="minecraft:wool" item-tips="true"/>
	    <block pos="0 0 1" block="minecraft:grass">悬浮信息</block>
	</page>
    </scene>
</page>
```

## 故事线场景
请参阅 [Compass Scene](scene.md) 页面

## 获取方块实体/实体 NBT 的有用命令
编写场景时，不可避免地会遇到一些需要设置 NBT 的方块/实体。

虽然你可以通过 `/data get block/entity` 获取 NBT，但你无法在游戏中复制它。

LDLib 提供了一个命令来帮助你在游戏中获取方块/实体的 NBT，并将其复制到剪贴板。

`/ldlib copy_block_tag [pos]` / `/ldlib copy_entity_tag [entity_selector]`：执行此命令时，聊天面板会显示该标签。鼠标点击聊天面板中的 `[Copy to clipboard]` 即可将其复制到剪贴板。
