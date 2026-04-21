# TextFieldWidget

<div>
  <video width="50%" controls style="margin-left: 20px; float: right;">
    <source src="../../assets/textfield.mp4" type="video/mp4">
    您的浏览器不支持视频播放。
  </video>
</div>


`TextFieldWidget` 为 GUI 界面提供一个可编辑的文本框。它支持通过 supplier 和 responder 进行动态文本更新，通过自定义验证器进行输入验证，以及可配置的属性，如最大字符串长度、边框样式和文本颜色。

## 基本属性

| 字段               | 说明                                                               |
|--------------------|--------------------------------------------------------------------|
| currentString      | 文本框当前显示的文本                                               |
| maxStringLength    | 允许的最大文本长度                                                 |
| isBordered         | 确定文本框是否显示边框                                             |
| textColor          | 文本的颜色（可通过 setter 修改）                                   |
| supplier           | 用于动态更新文本的 supplier                                        |
| textResponder      | 处理文本变化的 responder                                           |
| wheelDur           | 用于鼠标滚轮调整的持续时间（或步进值）                             |

---

## API

### setTextSupplier

设置用于动态更新文本的 supplier。

=== "Java / KubeJS"

    ``` java
    textFieldWidget.setTextSupplier(() -> "Dynamic Text");
    ```

---

### setTextResponder

设置当文本发生变化时调用的 responder。

=== "Java / KubeJS"

    ``` java
    textFieldWidget.setTextResponder(newText -> {
        // 处理文本变化
    });
    ```

---

### setBordered

配置文本框是否显示边框。

=== "Java / KubeJS"

    ``` java
    textFieldWidget.setBordered(true);
    ```

---

### setTextColor

设置文本框的文本颜色。

=== "Java / KubeJS"

    ``` java
    textFieldWidget.setTextColor(0xffffff);
    ```

---

### setMaxStringLength

设置文本框允许的最大字符数。

=== "Java / KubeJS"

    ``` java
    textFieldWidget.setMaxStringLength(100);
    ```

---

### setValidator

分配一个自定义验证器函数来控制和清理文本输入。

=== "Java / KubeJS"

    ``` java
    textFieldWidget.setValidator(text -> text.trim());
    ```

---

### setCompoundTagOnly

将输入限制为有效的 compound tag。会显示一个提示框指示该限制。

=== "Java / KubeJS"

    ``` java
    textFieldWidget.setCompoundTagOnly();
    ```

---

### setResourceLocationOnly

将输入限制为有效的 resource location。会显示一个提示框指示该限制。

=== "Java / KubeJS"

    ``` java
    textFieldWidget.setResourceLocationOnly();
    ```

---

### setNumbersOnly

将输入限制为数值。针对不同数值类型提供了重载方法。

=== "Java"

    ``` java
    textFieldWidget.setNumbersOnly(0, 100); // int
    textFieldWidget.setNumbersOnly(0.0f, 1.0f); // float
    ```

=== "KubeJS"

    ``` java
    textFieldWidget.setNumbersOnlyInt(0, 100); // int
    textFieldWidget.setNumbersOnlyFloat(0, 100); // float
    ```

---

### setWheelDur

设置通过鼠标滚轮或拖动调整数字时的轮步持续时间（步进值）。

=== "Java / KubeJS"

    ``` java
    textFieldWidget.setWheelDur(1);
    ```

---
