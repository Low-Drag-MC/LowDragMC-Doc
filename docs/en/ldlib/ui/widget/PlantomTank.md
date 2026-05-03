
# PhantomTankWidget

<div>
  <video width="50%" controls style="margin-left: 20px; float: right;">
    <source src="../../assets/phantom_tank.mp4" type="video/mp4">
    Your browser does not support video.
  </video>
</div>

The `PhantomTankWidget` is a **ghost fluid slot** that allows setting fluid content without actual transfer mechanics. It's useful for defining **recipe inputs** or **fluid placeholders**.

---

## Features

- **Phantom fluid storage** – Doesn't actually consume or provide fluids.
- **Supports drag-and-drop** – Accepts fluid items from JEI, EMI, or REI.
- **Custom event handling** – Updates an external state when fluid changes.

---

## APIs

It owns all APIs from [`TankWidget`](Tank.md), and you can get or set item by its APIs.

### setIFluidStackUpdater

Registers a callback to track fluid changes.

=== "Java"

    ```java
    phantomTank.setIFluidStackUpdater(fluid -> {
        System.out.println("New phantom fluid: " + fluid);
    });
    ```

=== "KubeJS"

    ```javascript
    phantomTank.setIFluidStackUpdater(fluid => {
        console.log("New phantom fluid: " + fluid);
    });
    ```