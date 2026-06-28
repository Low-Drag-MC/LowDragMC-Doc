# Preliminary

`GUI Texture` is widely used for background setup, image dispaly, etc. LDLib provides lots of different textures. Textures have some generic functions.

## Basic Properties

| Field    | Description                      |
|----------|----------------------------------|
| xOffset  | Horizontal offset                |
| yOffset  | Vertical offset                  |
| scale    | Scale factor (default is 1)      |
| rotation | Rotation angle in degrees        |

---

## APIs

### rotate

Sets the rotation angle.

<DocTabs>
<DocTab title="Java / KubeJS">


</DocTab>
</DocTabs>

``` java
texture.rotate(45);
```

---

### scale

Sets the scale factor.

<DocTabs>
<DocTab title="Java / KubeJS">


</DocTab>
</DocTabs>

``` java
texture.scale(1.5);
```

---

### transform

Sets the horizontal and vertical offset.

<DocTabs>
<DocTab title="Java / KubeJS">


</DocTab>
</DocTabs>

``` java
texture.transform(10, 20);
```

---

### copy

Creates a copy of the texture.

<DocTabs>
<DocTab title="Java / KubeJS">

``` java
var copiedTexture = texture.copy();
```

</DocTab>
</DocTabs>

---