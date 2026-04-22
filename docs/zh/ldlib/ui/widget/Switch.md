# SwitchWidget

`SwitchWidget` 是一个**切换按钮**，用于在 ON 与 OFF 状态之间切换。它支持**自定义纹理**、**事件回调**和**动态状态更新**。

---

## 特性

- **切换按钮行为** —— 点击即可在 ON 与 OFF 之间切换。
- **事件处理** —— 当开关状态改变时触发回调。

---

## 属性

| 字段             | 类型                      | 描述 |
|------------------|--------------------------|-------------|
| `isPressed`      | `boolean` _(默认值：false)_ | 当前开关状态。 |

---

## API

### setPressed

设置开关的 **ON/OFF** 状态。

=== "Java / KubeJS"

    ```java
    switchWidget.setPressed(true); // 打开（ON）
    ```

- 触发 **UI 更新** 与事件回调。

---

### setOnPressCallback

注册当开关被点击时的回调。

=== "Java"

    ```java
    switchWidget.setOnPressCallback((clickData, state) -> {
        System.out.println("Switch is now: " + state);
    });
    ```

=== "KubeJS"

    ```javascript
    switchWidget.setOnPressCallback((clickData, state) => {
        console.log("Switch is now: " + state);
    });
    ```

---

### setSupplier

与**外部状态**自动同步。

=== "Java"

    ```java
    switchWidget.setSupplier(() -> getCurrentState()); // bool
    ```

=== "KubeJS"

    ```javascript
    switchWidget.setSupplier(() => getCurrentState()); // bool
    ```

- 当 `getCurrentState()` 变化时**动态**更新。
