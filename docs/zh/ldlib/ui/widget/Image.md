# ImageWidget

<img src="../assets/image.png" alt="Image title" width="30%" class="md-img-right">

`ImageWidget` 用于显示由 [`GUI Texture`](../textures/index.md) 提供的图像。

## 基础属性

| 字段           | 说明                                        |
|----------------|----------------------------------------------------|
| border         | 边框宽度（范围：-100 到 100）              |
| borderColor    | 边框颜色                            |

---

## APIs

### setImage

使用纹理实例设置图像纹理。

<DocTabs>
<DocTab title="Java / KubeJS">

``` java
imageWidget.setImage(new ResourceTexture("ldlib:textures/gui/icon.png"));
```

</DocTab>
</DocTabs>

---

### setImage

使用 Supplier 设置图像纹理。

<DocTabs>
<DocTab title="Java">

``` java
imageWidget.setImage(() -> new ResourceTexture("ldlib:textures/gui/icon.png"));
```

</DocTab>
<DocTab title="KubeJS">

``` javascript
imageWidget.setImage(() => new ResourceTexture("ldlib:textures/gui/icon.png"));
```

</DocTab>
</DocTabs>

---

### getImage

返回当前的图像纹理。

<DocTabs>
<DocTab title="Java / KubeJS">

``` java
var texture = imageWidget.getImage();
```

</DocTab>
</DocTabs>

---

### setBorder

<img src="../assets/image_border.png" alt="Image title" width="20%" class="md-img-right">

设置边框宽度和颜色。

<DocTabs>
<DocTab title="Java / KubeJS">

``` java
imageWidget.setBorder(2, 0xFFFFFFFF); // ARGB
```

</DocTab>
</DocTabs>

---
