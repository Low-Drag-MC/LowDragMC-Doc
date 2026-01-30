# Events
All events can be found here:

* [`MBDStartupEvents`](https://github.com/Low-Drag-MC/Multiblocked2/blob/1.20.1/src/main/java/com/lowdragmc/mbd2/integration/kubejs/events/MBDStartupEvents.java)
* [`MBDServerEvents`](https://github.com/Low-Drag-MC/Multiblocked2/blob/1.20.1/src/main/java/com/lowdragmc/mbd2/integration/kubejs/events/MBDServerEvents.java)
* [`MBDClientEvents`](https://github.com/Low-Drag-MC/Multiblocked2/blob/1.20.1/src/main/java/com/lowdragmc/mbd2/integration/kubejs/events/MBDClientEvents.java)

# Registry Events
**W.I.P**

# Machine Events
Check [`MBDServerEvents`](https://github.com/Low-Drag-MC/Multiblocked2/blob/1.20.1/src/main/java/com/lowdragmc/mbd2/integration/kubejs/events/MBDServerEvents.java)
and [`MBDClientEvents`](https://github.com/Low-Drag-MC/Multiblocked2/blob/1.20.1/src/main/java/com/lowdragmc/mbd2/integration/kubejs/events/MBDClientEvents.java) for all available machien events.

Because events will be posted to the Forge Event Handler as well. We wrap it with a KubeJS Event. So the actually event instance are shown [here](https://github.com/Low-Drag-MC/Multiblocked2/tree/1.20.1/src/main/java/com/lowdragmc/mbd2/common/machine/definition/config/event). Please check it for detials of fields and methods.

This is an example of using it.
```javascript
MBDMachineEvents.onOpenUI("mbd2:machine_id", e => {
    let event = e.event; // NOTE! you have to use it to get the actual event instance.
    let machine = event.machine;
    let machienID = machine.getDefinition().id();
    console.log("Open UI!! id: " + machienID)
})
```