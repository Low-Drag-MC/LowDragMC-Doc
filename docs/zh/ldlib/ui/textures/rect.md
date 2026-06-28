# ColorRectTexture

## 基本属性

| 字段      | 描述                                         |
|-----------|----------------------------------------------|
| color     | 应用于矩形的颜色                             |
| radiusLT  | 左上角圆角半径                               |
| radiusLB  | 左下角圆角半径                               |
| radiusRT  | 右上角圆角半径                               |
| radiusRB  | 右下角圆角半径                               |

---

## API

### setRadius

为所有角设置统一的圆角半径。

<DocTabs>
<DocTab title="Java / KubeJS">

``` java
colorRectTexture.setRadius(10);
```

</DocTab>
</DocTabs>

---

### setLeftRadius

为矩形的左侧（顶部和底部）设置圆角半径。

<DocTabs>
<DocTab title="Java / KubeJS">

``` java
colorRectTexture.setLeftRadius(8);
```

</DocTab>
</DocTabs>

---

### setRightRadius

为矩形的右侧（顶部和底部）设置圆角半径。

<DocTabs>
<DocTab title="Java / KubeJS">

``` java
colorRectTexture.setRightRadius(8);
```

</DocTab>
</DocTabs>

---

### setTopRadius

为矩形的顶部（左侧和右侧）设置圆角半径。

<DocTabs>
<DocTab title="Java / KubeJS">

``` java
colorRectTexture.setTopRadius(8);
```

</DocTab>
</DocTabs>

---

### setBottomRadius

为矩形的底部（左侧和右侧）设置圆角半径。

<DocTabs>
<DocTab title="Java / KubeJS">

``` java
colorRectTexture.setBottomRadius(8);
```

</DocTab>
</DocTabs>