# ColorBorderTexture

## Basic Properties

| Field          | Description                                        |
|----------------|----------------------------------------------------|
| color          | The color applied to the border                    |
| border         | The border width                                   |
| radiusLTInner  | Top-left inner corner radius                       |
| radiusLBInner  | Bottom-left inner corner radius                    |
| radiusRTInner  | Top-right inner corner radius                      |
| radiusRBInner  | Bottom-right inner corner radius                   |
| radiusLTOuter  | Top-left outer corner radius                       |
| radiusLBOuter  | Bottom-left outer corner radius                    |
| radiusRTOuter  | Top-right outer corner radius                      |
| radiusRBOuter  | Bottom-right outer corner radius                   |

---

## APIs

### setBorder

Sets the border width.

<DocTabs>
<DocTab title="Java / KubeJS">

``` java
colorBorderTexture.setBorder(5);
```

</DocTab>
</DocTabs>

---

### setColor

Sets the border color.

<DocTabs>
<DocTab title="Java / KubeJS">

``` java
colorBorderTexture.setColor(0xff00ff);
```

</DocTab>
</DocTabs>

---

### setRadius

Sets uniform inner and outer radii based on the provided radius and current border.

<DocTabs>
<DocTab title="Java / KubeJS">

``` java
colorBorderTexture.setRadius(10);
```

</DocTab>
</DocTabs>

---

### setLeftRadius

Sets the left-side radii for both inner and outer corners.

<DocTabs>
<DocTab title="Java / KubeJS">

``` java
colorBorderTexture.setLeftRadius(8);
```

</DocTab>
</DocTabs>

---

### setRightRadius

Sets the right-side radii for both inner and outer corners.

<DocTabs>
<DocTab title="Java / KubeJS">

``` java
colorBorderTexture.setRightRadius(8);
```

</DocTab>
</DocTabs>

---

### setTopRadius

Sets the top-side radii for both inner and outer corners.

<DocTabs>
<DocTab title="Java / KubeJS">

``` java
colorBorderTexture.setTopRadius(8);
```

</DocTab>
</DocTabs>

---

### setBottomRadius

Sets the bottom-side radii for both inner and outer corners.

<DocTabs>
<DocTab title="Java / KubeJS">

``` java
colorBorderTexture.setBottomRadius(8);
```

</DocTab>
</DocTabs>