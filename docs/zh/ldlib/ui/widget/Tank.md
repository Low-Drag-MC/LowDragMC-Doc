# TankWidget

![Image title](../assets/tank.png){ width="30%" align=right }

`TankWidget` 表示容器 GUI 中的流体槽位部件。它在指定的储液罐中显示流体，并支持填充和排空等流体交互操作。此外，它还与外部系统（JEI/REI/EMI）集成以显示流体原料详细信息，并提供可配置的选项用于悬停覆盖层、提示框和点击行为。

## 基本属性

| 字段              | 说明                                                                                  |
|--------------------|----------------------------------------------------------------------------------------------|
| fluidTank          | 与此部件关联的流体存储或传输处理器                                                            |
| tank               | 所表示流体储液罐的索引                                                                      |
| showAmount         | 确定是否显示流体数量                                                                        |
| allowClickFilled   | 控制当槽位已填充时点击是否触发容器填充行为                                                    |
| allowClickDrained  | 控制当槽位为空时点击是否触发容器排空行为                                                      |
| drawHoverOverlay   | 指示当鼠标悬停在该部件上时是否绘制悬停覆盖层                                                  |
| drawHoverTips      | 指示是否显示悬停提示框                                                                      |
| fillDirection      | 流体填充渲染的方向（例如 DOWN_TO_UP）                                                        |
| lastFluidInTank    | 储液罐中上一次存储的流体                                                                    |
| lastTankCapacity   | 上一次储液罐容量                                                                            |


---

## API

### setFluidTank (IFluidStorage)

将该部件与流体存储关联，并将储液罐索引设置为 0。

=== "Java / KubeJS"

    ``` java
    tankWidget.setFluidTank(fluidStorage);
    ```

---

### setFluidTank (IFluidTransfer, int)

将该部件与流体传输处理器关联，并指定储液罐索引。

=== "Java / KubeJS"

    ``` java
    tankWidget.setFluidTank(fluidTransfer, 1);
    ```

---

### setFluid

设置内部流体堆栈，可选择是否通知。

=== "Java / KubeJS"

    ``` java
    tankWidget.setFluid(fluidstack); // 它还会触发你设置的监听
    tankWidget.setFluid(fluidstack, false); // 它不会触发监听
    ```

---

### getFluid

获取存储的内部流体堆栈。

=== "Java / KubeJS"

    ``` java
    var fluidstack = tankWidget.getFluid();
    ```
---

### setChangeListener

配置当储罐流体内容变化时触发的监听器。

=== "Java"

    ``` java
    tankWidget.setChangeListener(() -> {
        var last = tankWidget.getLastFluidInTank();
        var current = tankWidget.getFluid();
    });
    ```

=== "KubeJS"

    ``` javascript
    tankWidget.setChangeListener(() => {
        let last = tankWidget.getLastFluidInTank();
        let current = tankWidget.getFluid();
    });
    ```

---
