# 初步介绍

`GUI Texture` 广泛应用于背景设置、图像显示等场景。LDLib 提供了多种不同的纹理。纹理具备一些通用功能。

## 基本属性

| 字段      | 描述           |
|-----------|----------------|
| xOffset   | 水平偏移       |
| yOffset   | 垂直偏移       |
| scale     | 缩放系数（默认为 1） |
| rotation  | 旋转角度（单位为度） |

---

## API

### rotate

设置旋转角度。

<DocTabs>
<DocTab title="Java / KubeJS">


</DocTab>
</DocTabs>
``` java
texture.rotate(45);
```

---

### scale

设置缩放系数。

<DocTabs>
<DocTab title="Java / KubeJS">


</DocTab>
</DocTabs>
``` java
texture.scale(1.5);
```

---

### transform

设置水平和垂直偏移。

<DocTabs>
<DocTab title="Java / KubeJS">


</DocTab>
</DocTabs>
``` java
texture.transform(10, 20);
```

---

### copy

创建纹理的副本。

<DocTabs>
<DocTab title="Java / KubeJS">

``` java
var copiedTexture = texture.copy();
```

</DocTab>
</DocTabs>
---
