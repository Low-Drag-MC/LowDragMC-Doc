# ButtonWidget

![Image title](../assets/button.png){ width="30%" align=right }

ButtonWidget 是 GUI 系统中代表可点击按钮的 UI 控件

## 基本属性

所有属性都可以通过 Java / KubeJS 访问。


| 字段       | 描述                          |
| :---------- | :----------------------------------- |
| `isClicked`       | 当前按钮是否被点击 |

---

## API

### `setButtonTexture()`

等同于 [`setBackground`](index.md#setbackground)。

=== "Java / KubeJS"

    ``` java 
    button.setButtonTexture(ResourceBorderTexture.BUTTON_COMMON, new TextTexture("Button"));
    ```
---

### `setClickedTexture()`

移除其中的子控件。

=== "Java / KubeJS"

    ``` java 
    button.setClickedTexture(ResourceBorderTexture.BUTTON_COMMON, new TextTexture("Clicked"));
    ```
---

### `setOnPressCallback()`

用于绑定功能逻辑。

`ClickData` 提供鼠标状态信息：

1. `clickData.button`: 鼠标按键 ID 编号。

    | 按键       | 描述                          |
    | :---------- | :----------------------------------- |
    | `0`       | 左键 |
    | `1`       | 右键 |
    | `2`       | 中键 |

2. `clickData.isShiftClick`: 是否按下了 Shift 键。
3. `clickData.isCtrlClick`: 是否按下了 Ctrl 键。
3. `clickData.isRemote`: 是否为远程环境。

=== "Java"

    ``` java 
    button.setOnPressCallback(clickData -> {
        if (clickData.isRemote) { // 可用于检测触发端
            
        }
    });
    ```

=== "KubeJS"

    ``` javascript 
    button.setOnPressCallback(clickData => {
        if (clickData.isRemote) { // 可用于检测触发端
            
        }
    });
    ```

---
