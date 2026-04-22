# 事件
所有事件都可以在这里找到：

* [`MBDStartupEvents`](https://github.com/Low-Drag-MC/Multiblocked2/blob/1.20.1/src/main/java/com/lowdragmc/mbd2/integration/kubejs/events/MBDStartupEvents.java)
* [`MBDServerEvents`](https://github.com/Low-Drag-MC/Multiblocked2/blob/1.20.1/src/main/java/com/lowdragmc/mbd2/integration/kubejs/events/MBDServerEvents.java)
* [`MBDClientEvents`](https://github.com/Low-Drag-MC/Multiblocked2/blob/1.20.1/src/main/java/com/lowdragmc/mbd2/integration/kubejs/events/MBDClientEvents.java)

# 注册表事件
**W.I.P**

# 机器事件
请查看 [`MBDServerEvents`](https://github.com/Low-Drag-MC/Multiblocked2/blob/1.20.1/src/main/java/com/lowdragmc/mbd2/integration/kubejs/events/MBDServerEvents.java)
和 [`MBDClientEvents`](https://github.com/Low-Drag-MC/Multiblocked2/blob/1.20.1/src/main/java/com/lowdragmc/mbd2/integration/kubejs/events/MBDClientEvents.java) 以获取所有可用的机器事件。

由于事件也会被发布到 Forge Event Handler 中，我们将其包装为 KubeJS 事件。因此实际的事件实例展示在[这里](https://github.com/Low-Drag-MC/Multiblocked2/tree/1.20.1/src/main/java/com/lowdragmc/mbd2/common/machine/definition/config/event)。请查阅以了解字段和方法的详细信息。

这是一个使用示例。
```javascript
MBDMachineEvents.onOpenUI("mbd2:machine_id", e => {
    let event = e.event; // 注意！你必须使用它来获取实际的事件实例。
    let machine = event.machine;
    let machienID = machine.getDefinition().id();
    console.log("Open UI!! id: " + machienID)
})
```
