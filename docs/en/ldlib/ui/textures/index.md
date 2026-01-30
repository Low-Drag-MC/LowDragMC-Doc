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

=== "Java / KubeJS"

``` java
texture.rotate(45);
```

---

### scale

Sets the scale factor.

=== "Java / KubeJS"

``` java
texture.scale(1.5);
```

---

### transform

Sets the horizontal and vertical offset.

=== "Java / KubeJS"

``` java
texture.transform(10, 20);
```

---

### copy

Creates a copy of the texture.

=== "Java / KubeJS"

    ``` java
    var copiedTexture = texture.copy();
    ```

---