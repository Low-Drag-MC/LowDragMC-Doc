# AnimationTexture

## Basic Properties

| Field         | Description                                           |
|---------------|-------------------------------------------------------|
| imageLocation | The resource location for the image                 |
| cellSize      | The size of each cell in the texture grid             |
| from          | The starting cell index for animation                |
| to            | The ending cell index for animation                  |
| animation     | The animation speed value                             |
| color         | The color overlay applied to the texture             |

---

## APIs

### setTexture

Sets the texture

<DocTabs>
<DocTab title="Java / KubeJS">

``` java
animationTexture.setTexture("ldlib:textures/gui/particles.png");
```

</DocTab>
</DocTabs>
### setCellSize

Sets the cell size. Refer to how many cells does the animation texture need to be divided into (side length).

<DocTabs>
<DocTab title="Java / KubeJS">

``` java
animationTexture.setCellSize(8);
```

</DocTab>
</DocTabs>
---

### setAnimation

Sets the animation range `from` which cell `to` which cell.

<DocTabs>
<DocTab title="Java / KubeJS">

``` java
animationTexture.setAnimation(32, 44);
```

</DocTab>
</DocTabs>
---

### setAnimation

Sets the animation speed. Tick time between cells.

<DocTabs>
<DocTab title="Java / KubeJS">

``` java
animationTexture.setAnimation(1);
```

</DocTab>
</DocTabs>
---

### setColor

Sets the texture color.

<DocTabs>
<DocTab title="Java / KubeJS">

``` java
animationTexture.setColor(0xff000000);
```

</DocTab>
</DocTabs>
---
