# ItemStackTexture

`ItemStackTexture` 会以循环方式显示物品。

## 基本属性

| 字段      | 描述                                             |
|-----------|-------------------------------------------------|
| items     | 该纹理使用的物品堆数组                            |
| color     | 应用到物品堆纹理上的颜色覆盖层                     |

---

## API

### setItems

设置物品。

=== "Java / KubeJS"

    ``` java
    itemStackTexture.setItems(item1, item2);
    ```

---

### setColor

设置物品堆纹理的颜色覆盖层。

=== "Java / KubeJS"

    ``` java
    itemStackTexture.setColor(0xffff00ff);
    ```

---
