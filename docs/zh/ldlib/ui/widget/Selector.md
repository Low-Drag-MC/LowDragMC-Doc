# SelectorWidget

<div>
  <video width="50%" controls style="margin-left: 20px; float: right;">
    <source src="../../assets/selector.mp4" type="video/mp4">
    您的浏览器不支持视频播放。
  </video>
</div>

`SelectorWidget` 是一个**下拉式选择控件**，允许用户从预定义的列表中选择选项。它支持动态更新选项列表、显示可配置的 UI，以及高效处理选择变化。

---

## 功能特性

- **下拉选择** – 展开以显示可用选项。
- **事件处理** – 当选择变化时触发回调。

---

## 属性

| 字段           | 类型                      | 描述 |
|----------------|--------------------------|-------------|
| `currentValue` | `String`                  | 当前选中的选项。 |

---

## API

### setCandidates

更新可选选项列表。

=== "Java"

    ```Java
    selectorWidget.setCandidates(List.of("OptionA", "OptionB", "OptionC"));
    ```

=== "KubeJS"

    ```Javascript
    selectorWidget.setCandidates(["OptionA", "OptionB", "OptionC"]);
    ```

- 触发 UI 更新以反映新选项。

---

### setValue

设置当前选中的值。

=== "Java / KubeJS"

    ```java
    selectorWidget.setValue("OptionA");
    ```

- 如果该值在 `candidates` 中**未找到**，则保持不变。

---

### setMaxCount

定义在滚动前可见的选项数量。

=== "Java / KubeJS"

    ```java
    selectorWidget.setMaxCount(3);
    ```

- 如果选项数量**超过** `maxCount`，则会添加**滚动条**。

---

### setFontColor

更改选项文本的颜色。

=== "Java / KubeJS"

    ```java
    selectorWidget.setFontColor(0xFFFFFF); // 白色文本
    ```

---

### setButtonBackground

设置按钮区域的背景纹理。

=== "Java / KubeJS"

    ```java
    selectorWidget.setButtonBackground(myCustomTexture);
    ```

---

### setOnChanged

注册一个回调函数来处理选择变化。

=== "Java"

    ```java
    selectorWidget.setOnChanged(selected -> {
        System.out.println("New selection: " + selected);
    });
    ```

=== "KubeJS"

    ```javascript
    selectorWidget.setOnChanged(selected => {
        console.log("New selection: " + selected);
    });
    ```

- 这对于**更新 UI 状态**或触发**游戏逻辑**非常有用。

---

### setCandidatesSupplier

从动态源自动更新选项列表。

=== "Java"

    ```java
    selectorWidget.setCandidatesSupplier(() -> fetchDynamicOptions());
    ```

=== "KubeJS"

    ```javascript
    selectorWidget.setCandidatesSupplier(() => fetchDynamicOptions());
    ```

- 控件会**轮询**此函数来刷新列表。
- 适用于**选项基于外部条件变化**的情况。

---

### setShow

手动切换下拉列表的可见性。

=== "Java / KubeJS"

    ```java
    selectorWidget.setShow(true); // 打开下拉列表
    ```
